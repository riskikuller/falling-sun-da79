import "./styles.css";

import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import createGlobe from "cobe";
import usePartySocket from "partysocket/react";

// The type of messages we'll be receiving from the server
import type {
  ActionLogEntry,
  ActionRequest,
  IncomingMessage,
  OutgoingMessage,
} from "../shared";
import type { LegacyRef } from "react";

function App() {
  // A reference to the canvas element where we'll render the globe
  const canvasRef = useRef<HTMLCanvasElement>();
  // The number of markers we're currently displaying
  const [counter, setCounter] = useState(0);
  const [pendingActions, setPendingActions] = useState<ActionRequest[]>([]);
  const [actionLog, setActionLog] = useState<ActionLogEntry[]>([]);
  const [deletePath, setDeletePath] = useState("/tmp/example.txt");
  const [packageName, setPackageName] = useState("lodash");
  // A map of marker IDs to their positions
  // Note that we use a ref because the globe's `onRender` callback
  // is called on every animation frame, and we don't want to re-render
  // the component on every frame.
  const positions = useRef<
    Map<
      string,
      {
        location: [number, number];
        size: number;
      }
    >
  >(new Map());
  // Connect to the PartyServer server
  const socket = usePartySocket({
    room: "default",
    party: "globe",
    onMessage(evt) {
      const message = JSON.parse(evt.data as string) as
        | OutgoingMessage
        | IncomingMessage;
      if (message.type === "add-marker") {
        // Add the marker to our map
        positions.current.set(message.position.id, {
          location: [message.position.lat, message.position.lng],
          size: message.position.id === socket.id ? 0.1 : 0.05,
        });
        // Update the counter
        setCounter((c) => c + 1);
      } else if (message.type === "remove-marker") {
        // Remove the marker from our map
        positions.current.delete(message.id);
        // Update the counter
        setCounter((c) => c - 1);
      } else if (message.type === "action:state") {
        setPendingActions(message.pending);
        setActionLog(message.log);
      } else if (message.type === "action:request") {
        setPendingActions((current) => {
          if (current.some((action) => action.id === message.action.id)) {
            return current;
          }
          return [message.action, ...current];
        });
      }
    },
  });

  const submitDeleteAction = () => {
    socket.send(
      JSON.stringify({
        type: "action:submit",
        action: {
          kind: "delete-file",
          payload: { path: deletePath },
        },
      } satisfies IncomingMessage),
    );
  };

  const submitInstallAction = () => {
    socket.send(
      JSON.stringify({
        type: "action:submit",
        action: {
          kind: "install-package",
          payload: { packageName },
        },
      } satisfies IncomingMessage),
    );
  };

  const decideAction = (id: string, decision: "approved" | "rejected") => {
    socket.send(
      JSON.stringify({
        type: "action:decision",
        id,
        decision,
      } satisfies IncomingMessage),
    );
  };

  useEffect(() => {
    // The angle of rotation of the globe
    // We'll update this on every frame to make the globe spin
    let phi = 0;

    const globe = createGlobe(canvasRef.current as HTMLCanvasElement, {
      devicePixelRatio: 2,
      width: 400 * 2,
      height: 400 * 2,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 0.8,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [0.8, 0.1, 0.1],
      glowColor: [0.2, 0.2, 0.2],
      markers: [],
      opacity: 0.7,
      onRender: (state) => {
        // Called on every animation frame.
        // `state` will be an empty object, return updated params.

        // Get the current positions from our map
        state.markers = [...positions.current.values()];

        // Rotate the globe
        state.phi = phi;
        phi += 0.01;
      },
    });

    return () => {
      globe.destroy();
    };
  }, []);

  return (
    <div className="App">
      <h1>Where's everyone at?</h1>
      {counter !== 0 ? (
        <p>
          <b>{counter}</b> {counter === 1 ? "person" : "people"} connected.
        </p>
      ) : (
        <p>&nbsp;</p>
      )}

      {/* The canvas where we'll render the globe */}
      <canvas
        ref={canvasRef as LegacyRef<HTMLCanvasElement>}
        style={{ width: 400, height: 400, maxWidth: "100%", aspectRatio: 1 }}
      />

      {/* Let's give some credit */}
      <p>
        Powered by <a href="https://cobe.vercel.app/">🌏 Cobe</a>,{" "}
        <a href="https://www.npmjs.com/package/phenomenon">Phenomenon</a> and{" "}
        <a href="https://npmjs.com/package/partyserver/">🎈 PartyServer</a>
      </p>

      <section className="dashboard">
        <h2>Action approvals</h2>
        <p className="dashboard__subtitle">
          Sensitive actions emit an approval request before they execute.
        </p>

        <div className="dashboard__panels">
          <div className="dashboard__panel">
            <h3>Request an action</h3>
            <div className="dashboard__form">
              <label className="dashboard__field">
                Delete file path
                <input
                  value={deletePath}
                  onChange={(event) => setDeletePath(event.target.value)}
                />
                <button type="button" onClick={submitDeleteAction}>
                  Request delete
                </button>
              </label>
              <label className="dashboard__field">
                Install package
                <input
                  value={packageName}
                  onChange={(event) => setPackageName(event.target.value)}
                />
                <button type="button" onClick={submitInstallAction}>
                  Request install
                </button>
              </label>
            </div>
          </div>

          <div className="dashboard__panel">
            <h3>Pending approvals</h3>
            {pendingActions.length === 0 ? (
              <p className="dashboard__empty">No pending approvals.</p>
            ) : (
              <ul className="dashboard__list">
                {pendingActions.map((action) => (
                  <li key={action.id} className="dashboard__item">
                    <div>
                      <strong>{action.kind}</strong>
                      <span className="dashboard__meta">
                        Requested by {action.requestedBy}
                      </span>
                      {"path" in action.payload ? (
                        <span className="dashboard__detail">
                          Path: {action.payload.path}
                        </span>
                      ) : (
                        <span className="dashboard__detail">
                          Package: {action.payload.packageName}
                        </span>
                      )}
                    </div>
                    <div className="dashboard__actions">
                      <button
                        type="button"
                        onClick={() => decideAction(action.id, "approved")}
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => decideAction(action.id, "rejected")}
                      >
                        Reject
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="dashboard__panel">
          <h3>Decision log</h3>
          {actionLog.length === 0 ? (
            <p className="dashboard__empty">No actions have been reviewed.</p>
          ) : (
            <ul className="dashboard__list">
              {actionLog.map((entry) => (
                <li key={entry.id} className="dashboard__item">
                  <div>
                    <strong>
                      {entry.kind} ({entry.status})
                    </strong>
                    <span className="dashboard__meta">
                      Reviewed by {entry.decidedBy}
                    </span>
                    {"path" in entry.payload ? (
                      <span className="dashboard__detail">
                        Path: {entry.payload.path}
                      </span>
                    ) : (
                      <span className="dashboard__detail">
                        Package: {entry.payload.packageName}
                      </span>
                    )}
                    {entry.result ? (
                      <span className="dashboard__detail">
                        Result: {entry.result}
                      </span>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById("root")!).render(<App />);
