/**
 * Shared wire protocol between the Pi hub (extension/hub) and the dashboard web
 * app (web/src). Single source of truth — imported by both sides so the
 * WebSocket and REST contracts cannot drift.
 */

export const PROTOCOL_VERSION = 1;

// ---------------------------------------------------------------------------
// Sessions
// ---------------------------------------------------------------------------

export type SessionLiveness = "live" | "persisted";

export interface SessionInfo {
  /** Stable session id (Pi session file id, or "current" for the live TUI). */
  id: string;
  /** Human label (session name, first message, or cwd). */
  title: string;
  cwd: string;
  liveness: SessionLiveness;
  /** True while an agent turn is streaming in this session. */
  busy: boolean;
  /** Currently selected model "provider/id", if known. */
  model?: string;
  /** Unix ms of last activity. */
  updatedAt: number;
}

// ---------------------------------------------------------------------------
// Transcript
// ---------------------------------------------------------------------------

export type TranscriptRole = "user" | "assistant" | "system";

export interface TranscriptTurn {
  id: string;
  sessionId: string;
  role: TranscriptRole;
  text: string;
  /** True while the assistant turn is still streaming. */
  streaming?: boolean;
  /** Source of the turn: voice gateway, dashboard text, or pi tui. */
  source: "voice" | "text" | "tui" | "system";
  ts: number;
}

// ---------------------------------------------------------------------------
// Whiteboard
// ---------------------------------------------------------------------------

export interface WhiteboardRevisionMeta {
  revisionId: string;
  sessionId: string;
  /** Number of (non-deleted) elements in the scene. */
  elementCount: number;
  /** Short human summary of what changed in this revision. */
  summary: string;
  /** Author of the revision. */
  author: "user" | "agent";
  ts: number;
}

/** A node in the semantic sidecar graph (cleanup compiler output). */
export interface SemanticNode {
  id: string;
  elementIds: string[];
  kind: string;
  title: string;
  summary?: string;
  tags?: string[];
}

export interface SemanticEdge {
  from: string;
  to: string;
  arrowElementId?: string;
  label?: string;
  kind?: string;
}

/** The compact Whiteboard Context Packet handed to Pi each turn. */
export interface WhiteboardContextPacket {
  revisionId: string;
  selected: string[];
  viewport: { x: number; y: number; zoom: number };
  nodes: SemanticNode[];
  edges: SemanticEdge[];
  recentEvents: string[];
  files?: Array<{
    fileId: string;
    mimeType: string;
    hash: string;
    width?: number;
    height?: number;
    name?: string;
  }>;
  snapshot?: {
    available: boolean;
    path?: string;
    dataUrl?: string;
    reason?: string;
  };
}

// ---------------------------------------------------------------------------
// WebSocket envelope (hub -> browser and browser -> hub)
// ---------------------------------------------------------------------------

export type ServerMessage =
  | { type: "hello"; protocol: number; sessions: SessionInfo[]; activeSessionId: string | null }
  | { type: "sessions"; sessions: SessionInfo[] }
  | { type: "transcript"; turn: TranscriptTurn }
  | {
      type: "whiteboard.scene";
      sessionId: string;
      revisionId: string;
      scene: unknown;
      summary: string;
      author: "user" | "agent";
    }
  | { type: "whiteboard.revision"; revision: WhiteboardRevisionMeta }
  | {
      type: "whiteboard.exportRequest";
      requestId: string;
      sessionId: string;
      scope: "selected" | "viewport" | "all";
    }
  | { type: "status"; sessionId: string; busy: boolean }
  | { type: "log"; level: "info" | "warn" | "error"; message: string };

export type ClientMessage =
  | { type: "subscribe"; sessionId: string }
  | {
      type: "whiteboard.changed";
      sessionId: string;
      scene: unknown;
      selected: string[];
      viewport: { x: number; y: number; zoom: number };
    }
  | {
      type: "whiteboard.exportResult";
      requestId: string;
      ok: boolean;
      dataUrl?: string;
      error?: string;
    }
  | { type: "ping" };
