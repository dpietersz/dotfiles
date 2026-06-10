import { useCallback, useEffect, useRef, useState } from "react";
import type {
  ClientMessage,
  ServerMessage,
  SessionInfo,
  TranscriptTurn,
} from "@shared/protocol";

export interface SceneEvent {
  sessionId: string;
  revisionId: string;
  scene: unknown;
  summary: string;
  author: "user" | "agent";
}
export interface ExportRequestEvent {
  requestId: string;
  sessionId: string;
  scope: "selected" | "viewport" | "all";
}

interface Handlers {
  onScene?: (e: SceneEvent) => void;
  onExportRequest?: (e: ExportRequestEvent) => void;
}

export interface HubApi {
  connected: boolean;
  sessions: SessionInfo[];
  activeSessionId: string | null;
  transcript: TranscriptTurn[];
  send: (msg: ClientMessage) => void;
  setHandlers: (h: Handlers) => void;
  clearTranscriptForSession: (sessionId: string) => void;
}

function wsUrl(): string {
  const proto = location.protocol === "https:" ? "wss:" : "ws:";
  return `${proto}//${location.host}/ws`;
}

const MAX_TURNS = 200;

async function loadTranscript(sessionId: string): Promise<TranscriptTurn[]> {
  const res = await fetch(`/api/session/${encodeURIComponent(sessionId)}/transcript`);
  if (!res.ok) return [];
  const data = (await res.json()) as { turns?: TranscriptTurn[] };
  return Array.isArray(data.turns) ? data.turns.slice(-MAX_TURNS) : [];
}

export function useHub(): HubApi {
  const [connected, setConnected] = useState(false);
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<TranscriptTurn[]>([]);

  const wsRef = useRef<WebSocket | null>(null);
  const handlersRef = useRef<Handlers>({});
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closedRef = useRef(false);

  const upsertTurn = useCallback((turn: TranscriptTurn) => {
    setTranscript((prev) => {
      const idx = prev.findIndex((t) => t.id === turn.id);
      let next: TranscriptTurn[];
      if (idx >= 0) {
        next = prev.slice();
        next[idx] = turn;
      } else {
        next = [...prev, turn];
      }
      return next.length > MAX_TURNS ? next.slice(next.length - MAX_TURNS) : next;
    });
  }, []);

  const connect = useCallback(() => {
    if (wsRef.current) return;
    const ws = new WebSocket(wsUrl());
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);
    ws.onclose = () => {
      setConnected(false);
      wsRef.current = null;
      if (!closedRef.current) {
        reconnectRef.current = setTimeout(connect, 1200);
      }
    };
    ws.onerror = () => ws.close();
    ws.onmessage = (ev) => {
      let msg: ServerMessage;
      try {
        msg = JSON.parse(ev.data as string) as ServerMessage;
      } catch {
        return;
      }
      switch (msg.type) {
        case "hello":
          setSessions(msg.sessions);
          setActiveSessionId(msg.activeSessionId);
          if (msg.activeSessionId) {
            loadTranscript(msg.activeSessionId).then(setTranscript).catch(() => undefined);
          }
          break;
        case "sessions":
          setSessions(msg.sessions);
          break;
        case "transcript":
          upsertTurn(msg.turn);
          break;
        case "status":
          setSessions((prev) =>
            prev.map((s) => (s.id === msg.sessionId ? { ...s, busy: msg.busy } : s)),
          );
          break;
        case "whiteboard.scene":
          handlersRef.current.onScene?.({
            sessionId: msg.sessionId,
            revisionId: msg.revisionId,
            scene: msg.scene,
            summary: msg.summary,
            author: msg.author,
          });
          break;
        case "whiteboard.exportRequest":
          handlersRef.current.onExportRequest?.({
            requestId: msg.requestId,
            sessionId: msg.sessionId,
            scope: msg.scope,
          });
          break;
        case "whiteboard.revision":
        case "log":
          break;
      }
    };
  }, [upsertTurn]);

  useEffect(() => {
    closedRef.current = false;
    connect();
    return () => {
      closedRef.current = true;
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [connect]);

  const send = useCallback((msg: ClientMessage) => {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(msg));
  }, []);

  const setHandlers = useCallback((h: Handlers) => {
    handlersRef.current = h;
  }, []);

  const clearTranscriptForSession = useCallback((sessionId: string) => {
    setTranscript((prev) => prev.filter((t) => t.sessionId !== sessionId));
  }, []);

  return {
    connected,
    sessions,
    activeSessionId,
    transcript,
    send,
    setHandlers,
    clearTranscriptForSession,
  };
}
