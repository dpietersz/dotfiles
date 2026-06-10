import type { SessionInfo } from "../../shared/protocol.ts";

export interface PromptHandlers {
  /** Incremental assistant text (a delta, not the cumulative string). */
  onDelta(text: string): void;
  /** Optional human-readable notice about a tool/whiteboard action mid-turn. */
  onNotice?(summary: string): void;
  /** Called once when the turn completes, with the full assistant text. */
  onDone(fullText: string): void;
  /** Called once on failure. After this, onDone is not called. */
  onError(err: Error): void;
}

/**
 * The only component that talks to Pi sessions. Dependency-inverted so the hub
 * can run against a real Pi extension (PiExtensionBridge) or a scripted mock
 * (MockBridge) for tests and offline development.
 */
export interface PiBridge {
  listSessions(): SessionInfo[];
  getActiveSessionId(): string | null;
  setActiveSessionId(id: string): void;
  isBusy(sessionId: string): boolean;
  /**
   * Submit a user prompt to a session and stream the assistant reply.
   * Resolves only after onDone or onError has fired.
   */
  prompt(sessionId: string, text: string, handlers: PromptHandlers, signal?: AbortSignal): Promise<void>;
  /** Subscribe to session-list changes; returns an unsubscribe function. */
  onSessionsChanged(cb: () => void): () => void;
}

/**
 * Scripted bridge for tests / offline use. Echoes a deterministic answer,
 * streamed word-by-word so SSE consumers see realistic deltas.
 */
export class MockBridge implements PiBridge {
  private sessions: SessionInfo[];
  private activeId: string;
  private busy = new Set<string>();
  private listeners = new Set<() => void>();
  /** Optional canned responder for richer tests. */
  responder?: (sessionId: string, text: string) => string;

  constructor(initial?: SessionInfo[]) {
    const now = Date.now();
    this.sessions = initial ?? [
      {
        id: "current",
        title: "Live TUI session",
        cwd: process.cwd(),
        liveness: "live",
        busy: false,
        model: "mock/echo-1",
        updatedAt: now,
      },
      {
        id: "demo-2",
        title: "Refactor auth module",
        cwd: process.cwd(),
        liveness: "persisted",
        busy: false,
        model: "mock/echo-1",
        updatedAt: now - 60_000,
      },
    ];
    this.activeId = this.sessions[0]?.id ?? "current";
  }

  listSessions(): SessionInfo[] {
    return this.sessions.map((s) => ({ ...s, busy: this.busy.has(s.id) }));
  }

  getActiveSessionId(): string | null {
    return this.activeId;
  }

  setActiveSessionId(id: string): void {
    if (this.sessions.some((s) => s.id === id)) {
      this.activeId = id;
      this.emit();
    }
  }

  isBusy(sessionId: string): boolean {
    return this.busy.has(sessionId);
  }

  onSessionsChanged(cb: () => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private emit(): void {
    for (const cb of this.listeners) {
      try {
        cb();
      } catch {
        /* ignore */
      }
    }
  }

  async prompt(
    sessionId: string,
    text: string,
    handlers: PromptHandlers,
    signal?: AbortSignal,
  ): Promise<void> {
    if (!this.sessions.some((s) => s.id === sessionId)) {
      handlers.onError(new Error(`unknown session: ${sessionId}`));
      return;
    }
    this.busy.add(sessionId);
    this.emit();
    try {
      const visibleText = extractVisibleUserText(text);
      const answer =
        this.responder?.(sessionId, visibleText) ??
        `Acknowledged. You said: "${visibleText}". (mock bridge echo — Pi is the real reasoning engine in production.)`;
      const words = answer.split(/(\s+)/);
      let full = "";
      for (const w of words) {
        if (signal?.aborted) throw new Error("aborted");
        full += w;
        handlers.onDelta(w);
        await delay(15);
      }
      handlers.onDone(full);
    } catch (err) {
      handlers.onError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      this.busy.delete(sessionId);
      this.emit();
    }
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function extractVisibleUserText(text: string): string {
  const marker = "## User said";
  const idx = text.lastIndexOf(marker);
  if (idx < 0) return text.trim();
  return text.slice(idx + marker.length).trim();
}
