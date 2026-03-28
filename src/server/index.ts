import { routePartykitRequest, Server } from "partyserver";

import type {
  ActionLogEntry,
  ActionRequest,
  IncomingMessage,
  OutgoingMessage,
  Position,
} from "../shared";
import type { Connection, ConnectionContext } from "partyserver";
import {
  createActionLogEntry,
  createActionRequest,
  executeAction,
  type ActionState,
} from "./commands";

// This is the state that we'll store on each connection
type ConnectionState = {
  position: Position;
};

export class Globe extends Server {
  private actionLog: ActionLogEntry[] = [];
  private pendingActions: ActionRequest[] = [];

  async onStart() {
    const stored = await this.ctx.storage.get<ActionState>("actionState");
    this.actionLog = stored?.log ?? [];
    this.pendingActions = stored?.pending ?? [];
  }

  onConnect(conn: Connection<ConnectionState>, ctx: ConnectionContext) {
    // Whenever a fresh connection is made, we'll
    // send the entire state to the new connection

    // First, let's extract the position from the Cloudflare headers
    const latitude = ctx.request.cf?.latitude as string | undefined;
    const longitude = ctx.request.cf?.longitude as string | undefined;
    if (!latitude || !longitude) {
      console.warn(`Missing position information for connection ${conn.id}`);
      return;
    }
    const position = {
      lat: parseFloat(latitude),
      lng: parseFloat(longitude),
      id: conn.id,
    };
    // And save this on the connection's state
    conn.setState({
      position,
    });

    // Now, let's send the entire state to the new connection
    for (const connection of this.getConnections<ConnectionState>()) {
      try {
        conn.send(
          JSON.stringify({
            type: "add-marker",
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            position: connection.state!.position,
          } satisfies OutgoingMessage),
        );
      } catch {
        this.onCloseOrError(conn);
      }

      if (connection.id !== conn.id) {
        try {
          connection.send(
            JSON.stringify({
              type: "add-marker",
              position,
            } satisfies OutgoingMessage),
          );
        } catch {
          this.onCloseOrError(connection);
        }
      }
    }

    this.sendActionState(conn);
  }

  // Whenever a connection closes (or errors), we'll broadcast a message to all
  // other connections to remove the marker.
  onCloseOrError(connection: Connection) {
    this.broadcast(
      JSON.stringify({
        type: "remove-marker",
        id: connection.id,
      } satisfies OutgoingMessage),
      [connection.id],
    );
  }

  onClose(connection: Connection): void | Promise<void> {
    this.onCloseOrError(connection);
  }

  onError(connection: Connection): void | Promise<void> {
    this.onCloseOrError(connection);
  }

  async onMessage(connection: Connection, message: string | ArrayBuffer) {
    if (typeof message !== "string") {
      return;
    }
    let parsed: IncomingMessage;
    try {
      parsed = JSON.parse(message) as IncomingMessage;
    } catch {
      return;
    }

    if (parsed.type === "action:submit") {
      const request = createActionRequest(
        parsed.action.kind,
        parsed.action.payload,
        connection.id,
      );
      this.pendingActions = [...this.pendingActions, request];
      await this.persistActionState();
      this.broadcast(
        JSON.stringify({
          type: "action:request",
          action: request,
        } satisfies OutgoingMessage),
      );
      this.broadcastActionState();
      return;
    }

    if (parsed.type === "action:decision") {
      const targetIndex = this.pendingActions.findIndex(
        (action) => action.id === parsed.id,
      );
      if (targetIndex === -1) {
        return;
      }

      const [action] = this.pendingActions.splice(targetIndex, 1);
      const decision = {
        status: parsed.decision,
        decidedBy: connection.id,
        decidedAt: new Date().toISOString(),
      } as const;

      const result =
        parsed.decision === "approved"
          ? await executeAction(action.kind, action.payload)
          : undefined;

      const logEntry = createActionLogEntry(action, decision, result);
      this.actionLog = [logEntry, ...this.actionLog].slice(0, 100);
      await this.persistActionState();
      this.broadcastActionState();
    }
  }

  private async persistActionState() {
    await this.ctx.storage.put<ActionState>("actionState", {
      pending: this.pendingActions,
      log: this.actionLog,
    });
  }

  private sendActionState(connection: Connection) {
    try {
      connection.send(
        JSON.stringify({
          type: "action:state",
          pending: this.pendingActions,
          log: this.actionLog,
        } satisfies OutgoingMessage),
      );
    } catch {
      this.onCloseOrError(connection);
    }
  }

  private broadcastActionState() {
    this.broadcast(
      JSON.stringify({
        type: "action:state",
        pending: this.pendingActions,
        log: this.actionLog,
      } satisfies OutgoingMessage),
    );
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return (
      (await routePartykitRequest(request, { ...env })) ||
      new Response("Not Found", { status: 404 })
    );
  },
} satisfies ExportedHandler<Env>;
