import type {
  ActionKind,
  ActionLogEntry,
  ActionPayloadByKind,
  ActionRequest,
} from "../shared";

type ActionExecutionResult = {
  ok: boolean;
  message: string;
};

type ActionDecision = {
  status: "approved" | "rejected";
  decidedBy: string;
  decidedAt: string;
};

export type ActionState = {
  pending: ActionRequest[];
  log: ActionLogEntry[];
};

export function createActionRequest<K extends ActionKind>(
  kind: K,
  payload: ActionPayloadByKind[K],
  requestedBy: string,
): ActionRequest {
  return {
    id: crypto.randomUUID(),
    kind,
    payload,
    requestedAt: new Date().toISOString(),
    requestedBy,
  };
}

export async function executeAction(
  kind: ActionKind,
  payload: ActionPayloadByKind[ActionKind],
): Promise<ActionExecutionResult> {
  switch (kind) {
    case "delete-file":
      return simulateDeleteFile(payload);
    case "install-package":
      return simulateInstallPackage(payload);
    default: {
      const unreachable: never = kind;
      return {
        ok: false,
        message: `Unknown action ${unreachable}`,
      };
    }
  }
}

export function createActionLogEntry(
  action: ActionRequest,
  decision: ActionDecision,
  result?: ActionExecutionResult,
): ActionLogEntry {
  return {
    id: action.id,
    kind: action.kind,
    payload: action.payload,
    requestedAt: action.requestedAt,
    requestedBy: action.requestedBy,
    decidedAt: decision.decidedAt,
    decidedBy: decision.decidedBy,
    status: decision.status,
    result: result?.message,
  };
}

function simulateDeleteFile(payload: ActionPayloadByKind["delete-file"]) {
  return Promise.resolve<ActionExecutionResult>({
    ok: true,
    message: `Simulated deletion of ${payload.path}.`,
  });
}

function simulateInstallPackage(
  payload: ActionPayloadByKind["install-package"],
) {
  return Promise.resolve<ActionExecutionResult>({
    ok: true,
    message: `Simulated installation of ${payload.packageName}.`,
  });
}
