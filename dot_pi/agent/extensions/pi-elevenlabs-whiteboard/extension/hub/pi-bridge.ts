import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import type { SessionInfo } from "../../shared/protocol.ts";
import type { PiBridge, PromptHandlers } from "./bridge.ts";

const PROMPT_WATCHDOG_MS = 120_000;

interface PendingTurn {
  handlers: PromptHandlers;
  prompt: string;
  full: string;
  /** Per-assistant-message sent length, keyed by message id. */
  sent: Map<string, number>;
  /** True only while Pi is processing the user message injected by this bridge. */
  active: boolean;
  settled: boolean;
  timeout?: ReturnType<typeof setTimeout>;
}

interface PiMessage {
  id?: string;
  role?: string;
  content?: unknown;
}

/**
 * Real bridge backed by the live Pi extension. Drives the current Pi session
 * with sendUserMessage and captures only the matching injected turn. This is
 * important because normal user/Pi chat in the same TUI emits the same events.
 */
export class PiExtensionBridge implements PiBridge {
  private pi: ExtensionAPI;
  private listeners = new Set<() => void>();
  private pending: PendingTurn | null = null;
  private busy = false;
  private cwd = process.cwd();
  private title = "Live Pi session";
  private model?: string;
  private sessionFile?: string;
  private lastCtx: { abort?: () => void } | null = null;

  constructor(pi: ExtensionAPI) {
    this.pi = pi;
    this.attach();
  }

  listSessions(): SessionInfo[] {
    return [
      {
        id: "current",
        title: this.title,
        cwd: this.cwd,
        liveness: "live",
        busy: this.busy || Boolean(this.pending && !this.pending.settled),
        ...(this.model ? { model: this.model } : {}),
        updatedAt: Date.now(),
      },
    ];
  }

  getActiveSessionId(): string {
    return "current";
  }

  setActiveSessionId(_id: string): void {
    /* single live session in v1 */
  }

  isBusy(_sessionId: string): boolean {
    return this.busy || Boolean(this.pending && !this.pending.settled);
  }

  onSessionsChanged(cb: () => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
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

  async prompt(
    _sessionId: string,
    text: string,
    handlers: PromptHandlers,
    signal?: AbortSignal,
  ): Promise<void> {
    if (this.pending && !this.pending.settled) {
      handlers.onError(new Error("a Pi whiteboard turn is already waiting for this session"));
      return;
    }

    const turn: PendingTurn = { handlers, prompt: text, full: "", sent: new Map(), active: false, settled: false };
    this.pending = turn;
    this.emitSessions();

    const settle = (fn: () => void) => {
      if (turn.settled) return;
      turn.settled = true;
      if (turn.timeout) clearTimeout(turn.timeout);
      signal?.removeEventListener("abort", onAbort);
      if (this.pending === turn) this.pending = null;
      this.emitSessions();
      fn();
    };

    const onAbort = () => {
      if (turn.active) {
        try {
          this.lastCtx?.abort?.();
        } catch {
          /* ignore */
        }
      }
      settle(() => handlers.onError(new Error("Pi turn aborted")));
    };
    signal?.addEventListener("abort", onAbort, { once: true });

    turn.timeout = setTimeout(() => {
      if (turn.active) {
        try {
          this.lastCtx?.abort?.();
        } catch {
          /* ignore */
        }
      }
      this.busy = false;
      settle(() => handlers.onError(new Error(`Pi turn timed out after ${PROMPT_WATCHDOG_MS / 1000}s`)));
    }, PROMPT_WATCHDOG_MS);

    turn.handlers = {
      onDelta: handlers.onDelta,
      onNotice: handlers.onNotice,
      onDone: (t) => settle(() => handlers.onDone(t)),
      onError: (e) => settle(() => handlers.onError(e)),
    };

    try {
      if (this.busy) this.pi.sendUserMessage(text, { deliverAs: "followUp" });
      else this.pi.sendUserMessage(text);
    } catch (err) {
      try {
        this.pi.sendUserMessage(text, { deliverAs: "followUp" });
      } catch (fallbackErr) {
        turn.handlers.onError(fallbackErr instanceof Error ? fallbackErr : new Error(String(fallbackErr ?? err)));
        return;
      }
    }

    await new Promise<void>((resolve) => {
      const timer = setInterval(() => {
        if (turn.settled) {
          clearInterval(timer);
          resolve();
        }
      }, 25);
    });
  }

  private attach(): void {
    const pi = this.pi;

    pi.on("session_start", async (_e, ctx) => {
      this.cwd = ctx.cwd ?? this.cwd;
      this.sessionFile = ctx.sessionManager?.getSessionFile?.() ?? undefined;
      const name = pi.getSessionName?.();
      if (name) this.title = name;
      this.emitSessions();
    });

    pi.on("model_select", async (e: { model?: { provider?: string; id?: string } }) => {
      if (e.model?.provider && e.model.id) {
        this.model = `${e.model.provider}/${e.model.id}`;
        this.emitSessions();
      }
    });

    pi.on("before_agent_start", async (e: { prompt?: string }, ctx) => {
      const turn = this.pending;
      if (turn && !turn.settled && promptsMatch(e.prompt, turn.prompt)) {
        turn.active = true;
        turn.full = "";
        turn.sent.clear();
      }
      this.lastCtx = ctx as unknown as { abort?: () => void };
    });

    pi.on("agent_start", async (_e, ctx) => {
      this.busy = true;
      this.lastCtx = ctx as unknown as { abort?: () => void };
      this.emitSessions();
    });

    pi.on("message_update", async (e: { message?: unknown; assistantMessageEvent?: unknown }, ctx) => {
      this.lastCtx = ctx as unknown as { abort?: () => void };
      const turn = this.pending;
      if (!turn?.active || turn.settled) return;

      const event = e.assistantMessageEvent as { type?: string; delta?: string; text?: string } | undefined;
      const directDelta = event?.type === "text_delta" && typeof event.delta === "string" ? event.delta : "";
      if (directDelta) {
        turn.full += directDelta;
        turn.handlers.onDelta(directDelta);
        return;
      }

      this.emitMessageDelta(turn, e.message as PiMessage | undefined);
    });

    pi.on("message_end", async (e: { message?: unknown }) => {
      const turn = this.pending;
      if (!turn?.active || turn.settled) return;
      const msg = e.message as PiMessage | undefined;
      if (msg?.role !== "assistant") return;
      this.finishFromMessage(turn, msg);
    });

    pi.on("turn_end", async (e: { message?: unknown }) => {
      const turn = this.pending;
      if (!turn?.active || turn.settled) return;
      this.finishFromMessage(turn, e.message as PiMessage | undefined);
    });

    pi.on("agent_end", async (e: { messages?: unknown[] }) => {
      this.busy = false;
      this.emitSessions();
      const turn = this.pending;
      if (!turn?.active || turn.settled) return;
      const final = lastAssistantText(e.messages);
      if (final && final !== turn.full.trim()) {
        const delta = final.slice(turn.full.length);
        if (delta) turn.handlers.onDelta(delta);
        turn.full = final;
      }
      turn.handlers.onDone((final || turn.full).trim());
    });
  }

  private finishFromMessage(turn: PendingTurn, msg: PiMessage | undefined): void {
    const finalText = extractText(msg).trim();
    if (finalText && finalText !== turn.full.trim()) this.emitFinalRemainder(turn, msg);
    turn.handlers.onDone((finalText || turn.full).trim());
  }

  private emitMessageDelta(turn: PendingTurn, msg: PiMessage | undefined): void {
    if (!msg || msg.role !== "assistant" || !msg.id) return;
    const current = extractText(msg);
    const already = turn.sent.get(msg.id) ?? 0;
    if (current.length > already) {
      const delta = current.slice(already);
      turn.sent.set(msg.id, current.length);
      turn.full += delta;
      turn.handlers.onDelta(delta);
    }
  }

  private emitFinalRemainder(turn: PendingTurn, msg: PiMessage | undefined): void {
    const current = extractText(msg);
    if (current.length > turn.full.length) {
      const delta = current.slice(turn.full.length);
      turn.full = current;
      turn.handlers.onDelta(delta);
    }
  }
}

function promptsMatch(actual: string | undefined, expected: string): boolean {
  if (!actual) return false;
  return actual === expected || actual.trim() === expected.trim();
}

function lastAssistantText(messages: unknown[] | undefined): string {
  if (!Array.isArray(messages)) return "";
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i] as PiMessage | undefined;
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
    if (typeof block === "string") {
      out += block;
    } else if (block && typeof block === "object") {
      const b = block as { type?: string; text?: string; content?: string; value?: string };
      if (b.type === "text" && typeof b.text === "string") out += b.text;
      else if (typeof b.text === "string") out += b.text;
      else if (typeof b.content === "string") out += b.content;
      else if (typeof b.value === "string") out += b.value;
    }
  }
  return out;
}
