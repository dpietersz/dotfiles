import { randomUUID } from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";
import type { TranscriptTurn } from "../../shared/protocol.ts";
import type { Hub } from "./server.ts";
import { checkBearer, readJsonBody, sendJson } from "./http-util.ts";
import { renderPrompt, promptVersion } from "./prompts.ts";

// ---------------------------------------------------------------------------
// Core turn runner — shared by the voice gateway and the dashboard text path.
// ---------------------------------------------------------------------------

export interface RunTurnArgs {
  sessionId: string;
  /** The raw user utterance / text. */
  text: string;
  source: "voice" | "text";
  signal?: AbortSignal;
  /** Receives assistant text deltas (used by the SSE gateway). */
  onDelta?: (delta: string) => void;
  /** Compose the voice prompt + whiteboard context around the utterance. */
  includeWhiteboard?: boolean;
}

function turn(partial: Omit<TranscriptTurn, "id" | "ts"> & { id?: string }): TranscriptTurn {
  return { id: partial.id ?? randomUUID(), ts: Date.now(), ...partial };
}

const MAX_CONTEXT_CHARS = 4000;
const rateBuckets = new Map<string, { resetAt: number; count: number }>();

function buildPrompt(hub: Hub, sessionId: string, utterance: string, includeWhiteboard: boolean): string {
  if (!includeWhiteboard) return utterance;
  const packet = hub.store.getContextPacket(sessionId, { scope: "all" });
  let packetJson = JSON.stringify(packet);
  if (packetJson.length > MAX_CONTEXT_CHARS) {
    // Drop nodes' verbose fields if the packet is too large.
    const trimmed = {
      ...packet,
      nodes: packet.nodes.map((n) => ({ id: n.id, kind: n.kind, title: n.title })),
    };
    packetJson = JSON.stringify(trimmed).slice(0, MAX_CONTEXT_CHARS);
  }
  return renderPrompt("voice-prompt", {}) +
    `\n\n## Current whiteboard (revision ${packet.revisionId})\n` +
    "```json\n" + packetJson + "\n```\n" +
    `\n## User said\n${utterance}`;
}

/**
 * Submit one user turn to a Pi session, stream the assistant reply to all
 * dashboards (and optionally to an SSE consumer), and return the full text.
 * Serialized per session via the hub lock.
 */
export async function runTurn(hub: Hub, args: RunTurnArgs): Promise<string> {
  const { sessionId, source } = args;
  return hub.withSessionLock(sessionId, async () => {
    const turnId = randomUUID();
    hub.emitTranscript(turn({ sessionId, role: "user", text: args.text, source }));
    const assistantId = randomUUID();
    hub.emitTranscript(turn({ id: assistantId, sessionId, role: "assistant", text: "", streaming: true, source }));
    hub.emitStatus(sessionId, true);

    const prompt = buildPrompt(hub, sessionId, args.text, args.includeWhiteboard ?? source === "voice");
    let full = "";
    let failure: Error | null = null;

    await hub.bridge.prompt(
      sessionId,
      prompt,
      {
        onDelta: (delta) => {
          full += delta;
          args.onDelta?.(delta);
          hub.emitTranscript(
            turn({ id: assistantId, sessionId, role: "assistant", text: full, streaming: true, source }),
          );
        },
        onNotice: (summary) => {
          hub.emitTranscript(turn({ sessionId, role: "system", text: summary, source: "system" }));
        },
        onDone: (text) => {
          full = text || full;
          hub.emitTranscript(
            turn({ id: assistantId, sessionId, role: "assistant", text: full, streaming: false, source }),
          );
        },
        onError: (err) => {
          failure = err;
          hub.emitTranscript(
            turn({
              id: assistantId,
              sessionId,
              role: "system",
              text: `Turn failed: ${err.message}`,
              streaming: false,
              source: "system",
            }),
          );
        },
      },
      args.signal,
    );

    hub.emitStatus(sessionId, false);
    hub.log.info("turn complete", {
      turnId,
      sessionId,
      source,
      promptVersion: promptVersion("voice-prompt"),
      chars: full.length,
      ok: !failure,
    });
    if (failure) throw failure;
    return full;
  });
}

// ---------------------------------------------------------------------------
// OpenAI-compatible Custom LLM endpoint for ElevenLabs ConvAI.
// ---------------------------------------------------------------------------

interface ChatMessage {
  role: string;
  content: string | Array<{ type?: string; text?: string }>;
}
interface ChatBody {
  model?: string;
  messages?: ChatMessage[];
  stream?: boolean;
  user?: string;
  /** Optional non-standard hint from the agent for the target Pi session. */
  pi_session?: string;
}

function messageText(content: ChatMessage["content"]): string {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((p) => (typeof p === "string" ? p : (p.text ?? "")))
      .join("")
      .trim();
  }
  return "";
}

function latestUserUtterance(messages: ChatMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i]!.role === "user") return messageText(messages[i]!.content);
  }
  return "";
}

function resolveSession(hub: Hub, url: URL, body: ChatBody): string | null {
  const q = url.searchParams.get("session");
  const candidate = q || body.pi_session || hub.bridge.getActiveSessionId();
  if (candidate && hub.bridge.listSessions().some((s) => s.id === candidate)) return candidate;
  return hub.bridge.listSessions()[0]?.id ?? null;
}

function clientIp(req: IncomingMessage): string {
  const xff = req.headers["x-forwarded-for"];
  if (typeof xff === "string" && xff.trim()) return xff.split(",")[0]!.trim();
  return req.socket.remoteAddress ?? "unknown";
}

function consumeRateLimit(hub: Hub, req: IncomingMessage): { ok: true } | { ok: false; retryAfter: number } {
  const limit = hub.config.gatewayRateLimitPerMinute;
  if (limit <= 0) return { ok: true };
  const now = Date.now();
  const key = clientIp(req);
  const current = rateBuckets.get(key);
  if (!current || current.resetAt <= now) {
    rateBuckets.set(key, { resetAt: now + 60_000, count: 1 });
    return { ok: true };
  }
  current.count += 1;
  if (current.count <= limit) return { ok: true };
  return { ok: false, retryAfter: Math.ceil((current.resetAt - now) / 1000) };
}

function sseChunk(model: string, delta: Record<string, unknown>, finish: string | null): string {
  const payload = {
    id: "chatcmpl-" + randomUUID(),
    object: "chat.completion.chunk",
    created: Math.floor(Date.now() / 1000),
    model,
    choices: [{ index: 0, delta, finish_reason: finish }],
  };
  return `data: ${JSON.stringify(payload)}\n\n`;
}

export async function handleChatCompletions(
  hub: Hub,
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  // Auth + host allowlist (public endpoint hardening).
  if (!checkBearer(req.headers.authorization, hub.config.gatewayToken)) {
    return sendJson(res, 401, { error: { message: "unauthorized", type: "invalid_request_error" } });
  }
  const host = (req.headers.host ?? "").toLowerCase().split(":")[0]!;
  const allow = hub.config.gatewayAllowedHosts;
  if (allow.length > 0 && !allow.includes(host)) {
    hub.log.warn("gateway host rejected", { host });
    return sendJson(res, 403, { error: { message: "host not allowed", type: "invalid_request_error" } });
  }

  const limited = consumeRateLimit(hub, req);
  if (!limited.ok) {
    res.setHeader("Retry-After", String(limited.retryAfter));
    return sendJson(res, 429, { error: { message: "rate limit exceeded", type: "rate_limit_error" } });
  }

  const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
  const body = await readJsonBody<ChatBody>(req);
  if (!body?.messages?.length) {
    return sendJson(res, 400, { error: { message: "messages required", type: "invalid_request_error" } });
  }
  const utterance = latestUserUtterance(body.messages);
  if (!utterance) {
    return sendJson(res, 400, { error: { message: "no user message", type: "invalid_request_error" } });
  }
  const sessionId = resolveSession(hub, url, body);
  hub.log.info("gateway request", {
    stream: body.stream !== false,
    model: body.model ?? "pi",
    host: (req.headers.host ?? "").toString(),
    sessionId,
    utteranceChars: utterance.length,
    utterancePreview: utterance.slice(0, 80),
  });
  if (!sessionId) {
    return sendJson(res, 503, { error: { message: "no pi session available", type: "server_error" } });
  }
  const model = body.model ?? "pi";
  const stream = body.stream !== false; // default to streaming for ConvAI

  // Abort the turn if the ElevenLabs connection drops (barge-in / hang-up).
  const ac = new AbortController();
  req.on("close", () => ac.abort());

  if (!stream) {
    try {
      const text = await runTurn(hub, { sessionId, text: utterance, source: "voice", signal: ac.signal });
      return sendJson(res, 200, {
        id: "chatcmpl-" + randomUUID(),
        object: "chat.completion",
        created: Math.floor(Date.now() / 1000),
        model,
        choices: [{ index: 0, message: { role: "assistant", content: text }, finish_reason: "stop" }],
        usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
      });
    } catch (err) {
      return sendJson(res, 500, {
        error: { message: err instanceof Error ? err.message : String(err), type: "server_error" },
      });
    }
  }

  res.writeHead(200, {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });
  res.write(sseChunk(model, { role: "assistant" }, null));

  try {
    await runTurn(hub, {
      sessionId,
      text: utterance,
      source: "voice",
      signal: ac.signal,
      onDelta: (delta) => {
        res.write(sseChunk(model, { content: delta }, null));
      },
    });
    res.write(sseChunk(model, {}, "stop"));
    res.write("data: [DONE]\n\n");
    res.end();
  } catch (err) {
    hub.log.warn("gateway turn failed", { err: String(err) });
    // Surface a spoken error so the user is not left in silence.
    res.write(sseChunk(model, { content: " Sorry, I hit an error handling that." }, "stop"));
    res.write("data: [DONE]\n\n");
    res.end();
  }
}
