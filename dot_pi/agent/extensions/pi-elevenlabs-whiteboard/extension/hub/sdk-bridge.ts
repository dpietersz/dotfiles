import {
  createAgentSession,
  DefaultResourceLoader,
  getAgentDir,
  SessionManager,
  type AgentSession,
} from "@earendil-works/pi-coding-agent";
import type { SessionInfo } from "../../shared/protocol.ts";
import { createWhiteboardTools } from "../tools/whiteboard-tools.ts";
import type { PiBridge, PromptHandlers } from "./bridge.ts";
import type { Hub } from "./server.ts";

/**
 * Headless in-process Pi SDK bridge.
 *
 * This avoids `pi.sendUserMessage()` into the visible TUI. Voice/dashboard turns
 * run in an isolated SDK AgentSession, stream deltas directly to the hub, and
 * can still use whiteboard tools through customTools.
 */
export class SdkPiBridge implements PiBridge {
  private hub: Hub | null = null;
  private listeners = new Set<() => void>();
  private session: AgentSession | null = null;
  private initPromise: Promise<AgentSession> | null = null;
  private busy = false;
  private model?: string;
  private cwd = process.cwd();
  private title = "Headless Pi voice session";

  setHub(hub: Hub): void {
    this.hub = hub;
  }

  listSessions(): SessionInfo[] {
    return [
      {
        id: "current",
        title: this.title,
        cwd: this.cwd,
        liveness: "live",
        busy: this.busy,
        ...(this.model ? { model: this.model } : {}),
        updatedAt: Date.now(),
      },
    ];
  }

  getActiveSessionId(): string {
    return "current";
  }

  setActiveSessionId(_id: string): void {
    /* single headless session in v1 */
  }

  isBusy(_sessionId: string): boolean {
    return this.busy;
  }

  onSessionsChanged(cb: () => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  async prompt(_sessionId: string, text: string, handlers: PromptHandlers, signal?: AbortSignal): Promise<void> {
    const session = await this.ensureSession();
    let full = "";
    let errored: Error | null = null;

    const unsubscribe = session.subscribe((event) => {
      if (event.type === "agent_start") {
        this.busy = true;
        this.emitSessions();
      }
      if (event.type === "message_update" && event.assistantMessageEvent?.type === "text_delta") {
        const delta = event.assistantMessageEvent.delta ?? "";
        if (delta) {
          full += delta;
          handlers.onDelta(delta);
        }
      }
      if (event.type === "turn_end") {
        const final = extractText((event as { message?: { content?: unknown } }).message);
        if (final && final !== full.trim()) {
          const delta = final.slice(full.length);
          if (delta) handlers.onDelta(delta);
          full = final;
        }
      }
      if (event.type === "agent_end") {
        this.busy = false;
        this.emitSessions();
        const final = lastAssistantText((event as { messages?: unknown[] }).messages);
        if (final && final !== full.trim()) full = final;
      }
    });

    const abort = () => {
      session.abort().catch(() => undefined);
    };
    signal?.addEventListener("abort", abort, { once: true });

    try {
      this.busy = true;
      this.emitSessions();
      await session.prompt(text, {
        source: "extension",
        streamingBehavior: session.isStreaming ? "followUp" : undefined,
      });
      handlers.onDone(full.trim() || lastAssistantText(session.messages));
    } catch (err) {
      errored = err instanceof Error ? err : new Error(String(err));
      handlers.onError(errored);
    } finally {
      signal?.removeEventListener("abort", abort);
      unsubscribe();
      this.busy = false;
      this.emitSessions();
    }
  }

  private async ensureSession(): Promise<AgentSession> {
    if (this.session) return this.session;
    if (this.initPromise) return this.initPromise;

    this.initPromise = this.createSession();
    try {
      this.session = await this.initPromise;
      return this.session;
    } finally {
      this.initPromise = null;
    }
  }

  private async createSession(): Promise<AgentSession> {
    const agentDir = getAgentDir();
    const resourceLoader = new DefaultResourceLoader({
      cwd: this.cwd,
      agentDir,
      noExtensions: true,
      noPromptTemplates: true,
      noThemes: true,
      // Keep AGENTS.md context; disable skills to keep voice latency/prompt small.
      noSkills: true,
    });
    await resourceLoader.reload();

    const { session } = await createAgentSession({
      cwd: this.cwd,
      agentDir,
      resourceLoader,
      sessionManager: SessionManager.inMemory(),
      customTools: createWhiteboardTools(this.requireHub(), () => "current"),
    });

    this.model = session.model ? `${session.model.provider}/${session.model.id}` : undefined;
    this.emitSessions();
    return session;
  }

  private requireHub(): Hub {
    if (!this.hub) throw new Error("SDK bridge hub not attached");
    return this.hub;
  }

  private emitSessions(): void {
    for (const cb of this.listeners) {
      try {
        cb();
      } catch {
        /* ignore */
      }
    }
  }
}

function lastAssistantText(messages: unknown[] | undefined): string {
  if (!Array.isArray(messages)) return "";
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i] as { role?: string; content?: unknown } | undefined;
    if (msg?.role === "assistant") return extractText(msg).trim();
  }
  return "";
}

function extractText(msg: { content?: unknown } | undefined): string {
  const content = msg?.content;
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";
  let out = "";
  for (const block of content) {
    if (typeof block === "string") out += block;
    else if (block && typeof block === "object") {
      const b = block as { type?: string; text?: string; content?: string; value?: string };
      if (b.type === "text" && typeof b.text === "string") out += b.text;
      else if (typeof b.text === "string") out += b.text;
      else if (typeof b.content === "string") out += b.content;
      else if (typeof b.value === "string") out += b.value;
    }
  }
  return out;
}
