// Messages that we'll send to the client

// Representing a person's position
export type Position = {
  lat: number;
  lng: number;
  id: string;
};

export type OutgoingMessage =
  | {
      type: "add-marker";
      position: Position;
    }
  | {
      type: "remove-marker";
      id: string;
    }
  | {
      type: "action:request";
      action: ActionRequest;
    }
  | {
      type: "action:state";
      pending: ActionRequest[];
      log: ActionLogEntry[];
    };

export type ActionKind = "delete-file" | "install-package";

export type DeleteFilePayload = {
  path: string;
};

export type InstallPackagePayload = {
  packageName: string;
};

export type ActionPayloadByKind = {
  "delete-file": DeleteFilePayload;
  "install-package": InstallPackagePayload;
};

export type ActionRequest = {
  id: string;
  kind: ActionKind;
  payload: ActionPayloadByKind[ActionKind];
  requestedAt: string;
  requestedBy: string;
};

export type ActionLogEntry = {
  id: string;
  kind: ActionKind;
  payload: ActionPayloadByKind[ActionKind];
  requestedAt: string;
  requestedBy: string;
  decidedAt: string;
  decidedBy: string;
  status: "approved" | "rejected";
  result?: string;
};

export type IncomingMessage =
  | {
      type: "action:submit";
      action: {
        kind: ActionKind;
        payload: ActionPayloadByKind[ActionKind];
      };
    }
  | {
      type: "action:decision";
      id: string;
      decision: "approved" | "rejected";
    };
