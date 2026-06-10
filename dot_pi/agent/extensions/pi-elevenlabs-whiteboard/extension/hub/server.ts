import { createReadStream, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import { extname, join, normalize } from "node:path";
import { randomUUID } from "node:crypto";
import { WebSocketServer, type WebSocket } from "ws";
import type {
  ClientMessage,
  ServerMessage,
  SessionInfo,
  TranscriptTurn,
} from "../../shared/protocol.ts";
import { PROTOCOL_VERSION } from "../../shared/protocol.ts";
import type { HubConfig } from "./config.ts";
import { secretValues } from "./config.ts";
import { Logger } from "./log.ts";
import type { PiBridge } from "./bridge.ts";
import { WhiteboardStore } from "./whiteboard-store.ts";
import { handleChatCompletions, runTurn } from "./gateway.ts";
import { handleConversationToken, handleScribeToken, handleSignedUrl, handleTts } from "./elevenlabs.ts";
import { renderSnapshot, type SnapshotScope } from "./snapshot.ts";
import { sendJson, readJsonBody, notFound, methodNotAllowed } from "./http-util.ts";

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ico": "image/x-icon",
  ".webmanifest": "application/manifest+json",
};

interface PendingExport {
  resolve: (dataUrl: string) => void;
  reject: (err: Error) => void;
  timer: NodeJS.Timeout;
}

export class Hub {
  readonly config: HubConfig;
  readonly log: Logger;
  readonly bridge: PiBridge;
  readonly store: WhiteboardStore;

  private httpServer?: Server;
  private wss?: WebSocketServer;
  private clients = new Set<WebSocket>();
  private pendingExports = new Map<string, PendingExport>();
  private unsubscribeBridge?: () => void;
  private locks = new Map<string, Promise<unknown>>();
  private transcripts = new Map<string, TranscriptTurn[]>();

  constructor(opts: { config: HubConfig; bridge: PiBridge; log?: Logger }) {
    this.config = opts.config;
    this.log =
      opts.log ??
      new Logger({
        level: "info",
        file: opts.config.dataDir ? join(opts.config.dataDir, "hub.log") : undefined,
        secrets: secretValues(opts.config),
      });
    this.log.setSecrets(secretValues(opts.config));
    this.bridge = opts.bridge;
    this.store = new WhiteboardStore({ dataDir: opts.config.dataDir, log: this.log });

    // Fan store mutations out to all dashboards.
    this.store.on("scene", (e) => {
      this.broadcast({
        type: "whiteboard.scene",
        sessionId: e.sessionId,
        revisionId: e.revisionId,
        scene: e.scene,
        summary: e.summary,
        author: e.author,
      });
    });
    this.store.on("revision", (e) => {
      this.broadcast({ type: "whiteboard.revision", revision: e.revision });
    });
    this.unsubscribeBridge = this.bridge.onSessionsChanged(() => {
      this.broadcast({ type: "sessions", sessions: this.bridge.listSessions() });
    });
  }

  // --- lifecycle ----------------------------------------------------------

  async start(): Promise<{ url: string }> {
    const server = createServer((req, res) => {
      this.handleRequest(req, res).catch((err) => {
        this.log.error("request handler crashed", { err: String(err) });
        if (!res.headersSent) sendJson(res, 500, { error: "internal error" });
        else res.end();
      });
    });
    this.httpServer = server;

    const wss = new WebSocketServer({ noServer: true });
    this.wss = wss;
    server.on("upgrade", (req, socket, head) => {
      const url = new URL(req.url ?? "/", "http://localhost");
      if (url.pathname !== "/ws") {
        socket.destroy();
        return;
      }
      wss.handleUpgrade(req, socket, head, (ws) => this.onConnection(ws));
    });

    await new Promise<void>((resolve, reject) => {
      server.once("error", reject);
      server.listen(this.config.port, this.config.host, () => {
        server.off("error", reject);
        resolve();
      });
    });
    const url = `http://${this.config.host}:${this.config.port}`;
    this.log.info("hub listening", { url, bridge: this.config.bridge });
    return { url };
  }

  async stop(): Promise<void> {
    this.unsubscribeBridge?.();
    for (const ws of this.clients) {
      try {
        ws.close();
      } catch {
        /* ignore */
      }
    }
    this.clients.clear();
    await new Promise<void>((resolve) => this.wss?.close(() => resolve()));
    await new Promise<void>((resolve) => this.httpServer?.close(() => resolve()));
  }

  // --- websocket ----------------------------------------------------------

  private onConnection(ws: WebSocket): void {
    this.clients.add(ws);
    this.log.debug("ws client connected", { clients: this.clients.size });
    const hello: ServerMessage = {
      type: "hello",
      protocol: PROTOCOL_VERSION,
      sessions: this.bridge.listSessions(),
      activeSessionId: this.bridge.getActiveSessionId(),
    };
    this.sendTo(ws, hello);

    ws.on("message", (raw) => {
      let msg: ClientMessage;
      try {
        msg = JSON.parse(raw.toString()) as ClientMessage;
      } catch {
        return;
      }
      this.onClientMessage(ws, msg);
    });
    ws.on("close", () => {
      this.clients.delete(ws);
      this.log.debug("ws client disconnected", { clients: this.clients.size });
    });
    ws.on("error", (err) => this.log.warn("ws error", { err: String(err) }));
  }

  private onClientMessage(ws: WebSocket, msg: ClientMessage): void {
    switch (msg.type) {
      case "subscribe": {
        // Send current whiteboard scene for the requested session.
        const scene = this.store.getScene(msg.sessionId);
        for (const turn of this.getTranscript(msg.sessionId)) {
          this.sendTo(ws, { type: "transcript", turn });
        }
        this.sendTo(ws, {
          type: "whiteboard.scene",
          sessionId: msg.sessionId,
          revisionId: this.store.getRevisionId(msg.sessionId),
          scene,
          summary: "current scene",
          author: "agent",
        });
        break;
      }
      case "whiteboard.changed": {
        this.store.setSceneFromClient(
          msg.sessionId,
          msg.scene as never,
          msg.selected,
          msg.viewport,
        );
        this.store.noteSelection(msg.sessionId, msg.selected, msg.viewport);
        break;
      }
      case "whiteboard.exportResult": {
        const pending = this.pendingExports.get(msg.requestId);
        if (!pending) return;
        this.pendingExports.delete(msg.requestId);
        clearTimeout(pending.timer);
        if (msg.ok && msg.dataUrl) pending.resolve(msg.dataUrl);
        else pending.reject(new Error(msg.error ?? "export failed"));
        break;
      }
      case "ping":
        break;
    }
  }

  broadcast(msg: ServerMessage): void {
    const data = JSON.stringify(msg);
    for (const ws of this.clients) {
      if (ws.readyState === ws.OPEN) ws.send(data);
    }
  }

  private sendTo(ws: WebSocket, msg: ServerMessage): void {
    if (ws.readyState === ws.OPEN) ws.send(JSON.stringify(msg));
  }

  get connectedClients(): number {
    return this.clients.size;
  }

  /**
   * Serialize work per session so voice turns, dashboard text and TUI input
   * cannot interleave on the same Pi session (architecture: session safety).
   */
  async withSessionLock<T>(sessionId: string, fn: () => Promise<T>): Promise<T> {
    const prev = this.locks.get(sessionId) ?? Promise.resolve();
    let release!: () => void;
    const next = new Promise<void>((r) => (release = r));
    const chained = prev.then(() => next);
    this.locks.set(sessionId, chained);
    try {
      await prev.catch(() => undefined);
      return await fn();
    } finally {
      release();
      if (this.locks.get(sessionId) === chained) this.locks.delete(sessionId);
    }
  }

  emitTranscript(turn: TranscriptTurn): void {
    this.persistTranscriptTurn(turn);
    this.broadcast({ type: "transcript", turn });
  }

  getTranscript(sessionId: string): TranscriptTurn[] {
    const cached = this.transcripts.get(sessionId);
    if (cached) return cached;
    const path = this.transcriptPath(sessionId);
    try {
      const parsed = JSON.parse(readFileSync(path, "utf8")) as TranscriptTurn[];
      const turns = Array.isArray(parsed) ? parsed.filter(isTranscriptTurn).slice(-500) : [];
      this.transcripts.set(sessionId, turns);
      return turns;
    } catch {
      const turns: TranscriptTurn[] = [];
      this.transcripts.set(sessionId, turns);
      return turns;
    }
  }

  private persistTranscriptTurn(turn: TranscriptTurn): void {
    const turns = this.getTranscript(turn.sessionId);
    const idx = turns.findIndex((t) => t.id === turn.id);
    if (idx >= 0) turns[idx] = turn;
    else turns.push(turn);
    const clipped = turns.slice(-500);
    this.transcripts.set(turn.sessionId, clipped);
    try {
      const path = this.transcriptPath(turn.sessionId);
      mkdirSync(join(this.config.dataDir, "transcripts"), { recursive: true });
      writeFileSync(path, JSON.stringify(clipped, null, 2));
    } catch (err) {
      this.log.warn("transcript persist failed", { err: String(err), sessionId: turn.sessionId });
    }
  }

  private transcriptPath(sessionId: string): string {
    return join(this.config.dataDir, "transcripts", `${safeFileName(sessionId)}.json`);
  }

  emitStatus(sessionId: string, busy: boolean): void {
    this.broadcast({ type: "status", sessionId, busy });
  }

  /**
   * Ask a connected dashboard to export the live Excalidraw canvas to a PNG
   * data URL. Resolves with the data URL or rejects on timeout / no client.
   */
  requestExport(sessionId: string, scope: "selected" | "viewport" | "all", timeoutMs = 8000): Promise<string> {
    if (this.clients.size === 0) {
      return Promise.reject(new Error("no dashboard connected to render a snapshot"));
    }
    const requestId = randomUUID();
    return new Promise<string>((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pendingExports.delete(requestId);
        reject(new Error("snapshot export timed out"));
      }, timeoutMs);
      this.pendingExports.set(requestId, { resolve, reject, timer });
      this.broadcast({ type: "whiteboard.exportRequest", requestId, sessionId, scope });
    });
  }

  // --- http ---------------------------------------------------------------

  private async handleRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
    const path = url.pathname;
    const method = req.method ?? "GET";

    // If a public tunnel host is configured, expose only the Custom LLM gateway
    // on that host. Dashboard/API routes stay local-only.
    const host = (req.headers.host ?? "").toLowerCase().split(":")[0]!;
    if (isPublicTunnelHost(host, this.config) && path !== "/v1/chat/completions") {
      return notFound(res);
    }

    // CORS for same-origin SPA is not needed; gateway is called server->server.
    if (path === "/api/health") {
      return sendJson(res, 200, {
        ok: true,
        protocol: PROTOCOL_VERSION,
        bridge: this.config.bridge,
        clients: this.clients.size,
      });
    }

    if (path === "/api/config") {
      // Public, non-secret runtime config for the browser.
      return sendJson(res, 200, {
        protocol: PROTOCOL_VERSION,
        voiceId: this.config.elevenLabs.voiceId,
        ttsVoiceId: this.config.elevenLabs.ttsVoiceId,
        ttsConfigured: Boolean(this.config.elevenLabs.apiKey),
        authMode: this.config.elevenLabs.authMode,
        elevenLabsConfigured: Boolean(this.config.elevenLabs.agentId),
        gatewayConfigured: Boolean(this.config.gatewayToken),
      });
    }

    if (path === "/api/sessions") {
      return sendJson(res, 200, { sessions: this.bridge.listSessions() });
    }

    if (path === "/api/elevenlabs/scribe-token") {
      return handleScribeToken(this, req, res);
    }

    if (path === "/api/elevenlabs/tts") {
      if (method !== "POST") return methodNotAllowed(res);
      return handleTts(this, req, res);
    }

    if (path === "/api/active-session") {
      if (method !== "POST") return methodNotAllowed(res);
      const body = await readJsonBody<{ sessionId?: string }>(req);
      if (!body?.sessionId) return sendJson(res, 400, { error: "sessionId required" });
      this.bridge.setActiveSessionId(body.sessionId);
      return sendJson(res, 200, { activeSessionId: this.bridge.getActiveSessionId() });
    }

    const signed = path.match(/^\/api\/session\/([^/]+)\/signed-url$/);
    if (signed) {
      return handleSignedUrl(this, decodeURIComponent(signed[1]!), url, res);
    }

    const token = path.match(/^\/api\/session\/([^/]+)\/conversation-token$/);
    if (token) {
      return handleConversationToken(this, decodeURIComponent(token[1]!), url, res);
    }

    const wb = path.match(/^\/api\/session\/([^/]+)\/whiteboard$/);
    if (wb) {
      const sessionId = decodeURIComponent(wb[1]!);
      if (method === "GET") {
        return sendJson(res, 200, {
          revisionId: this.store.getRevisionId(sessionId),
          scene: this.store.getScene(sessionId),
          revisions: this.store.listRevisions(sessionId),
        });
      }
      if (method === "POST") {
        const body = await readJsonBody<{ scene?: unknown; summary?: string }>(req);
        if (!body?.scene || typeof body.scene !== "object") return sendJson(res, 400, { error: "scene required" });
        const revision = this.store.importScene(sessionId, body.scene as never, body.summary || "imported Excalidraw scene");
        return sendJson(res, 200, { revision });
      }
      return methodNotAllowed(res);
    }

    const cleanup = path.match(/^\/api\/session\/([^/]+)\/whiteboard\/cleanup$/);
    if (cleanup) {
      if (method !== "POST") return methodNotAllowed(res);
      const sessionId = decodeURIComponent(cleanup[1]!);
      const body = await readJsonBody<{ baseRevisionId?: string; preserveExports?: boolean }>(req);
      const result = this.store.cleanupScene(sessionId, {
        baseRevisionId: body?.baseRevisionId,
        preserveExports: body?.preserveExports ?? true,
      });
      return sendJson(res, 200, result);
    }

    const ctx = path.match(/^\/api\/session\/([^/]+)\/context-packet$/);
    if (ctx) {
      const sessionId = decodeURIComponent(ctx[1]!);
      const scope = (url.searchParams.get("scope") as "selected" | "viewport" | "all") ?? "all";
      return sendJson(res, 200, this.store.getContextPacket(sessionId, { scope }));
    }

    const snap = path.match(/^\/api\/session\/([^/]+)\/snapshot$/);
    if (snap) {
      if (method !== "POST") return methodNotAllowed(res);
      const sessionId = decodeURIComponent(snap[1]!);
      const sc = (url.searchParams.get("scope") as SnapshotScope) ?? "all";
      const result = await renderSnapshot(this, { sessionId, scope: sc, reason: "dashboard_request" });
      return sendJson(res, result.available ? 200 : 503, {
        available: result.available,
        via: result.via,
        path: result.path,
        hasImage: Boolean(result.dataUrl),
        error: result.error,
      });
    }

    const seed = path.match(/^\/api\/session\/([^/]+)\/seed-demo$/);
    if (seed) {
      if (method !== "POST") return methodNotAllowed(res);
      if (this.config.bridge !== "mock") return sendJson(res, 403, { error: "seed-demo is mock-only" });
      const sessionId = decodeURIComponent(seed[1]!);
      const eleven = this.store.addShape(sessionId, { kind: "external", title: "ElevenLabs", summary: "voice transport" });
      const hub = this.store.addShape(sessionId, { kind: "service", title: "Pi Hub", summary: "reasoning + tools" });
      const db = this.store.addShape(sessionId, { kind: "database", title: "Whiteboard Store", summary: "scenes + revisions" });
      this.store.addArrow(sessionId, { fromSemanticId: eleven.node.id, toSemanticId: hub.node.id, label: "Custom LLM SSE", kind: "voice" });
      this.store.addArrow(sessionId, { fromSemanticId: hub.node.id, toSemanticId: db.node.id, label: "persists", kind: "data" });
      return sendJson(res, 200, { revisionId: this.store.getRevisionId(sessionId) });
    }

    const transcript = path.match(/^\/api\/session\/([^/]+)\/transcript$/);
    if (transcript) {
      const sessionId = decodeURIComponent(transcript[1]!);
      return sendJson(res, 200, { turns: this.getTranscript(sessionId) });
    }

    const prompt = path.match(/^\/api\/session\/([^/]+)\/prompt$/);
    if (prompt) {
      if (method !== "POST") return methodNotAllowed(res);
      const sessionId = decodeURIComponent(prompt[1]!);
      const body = await readJsonBody<{ text?: string }>(req);
      if (!body?.text) return sendJson(res, 400, { error: "text required" });
      const text = await runTurn(this, { sessionId, text: body.text, source: "text" });
      return sendJson(res, 200, { text });
    }

    if (path === "/v1/chat/completions") {
      if (method !== "POST") return methodNotAllowed(res);
      return handleChatCompletions(this, req, res);
    }

    // Static SPA (also serves /render for the Playwright snapshot fallback).
    if (method === "GET" || method === "HEAD") {
      return this.serveStatic(path, res);
    }
    return notFound(res);
  }

  private serveStatic(path: string, res: ServerResponse): void {
    const dir = this.config.webDir;
    if (!dir || !existsSync(dir)) {
      sendJson(res, 503, {
        error: "web build not found — run `bun run build:web` (expected at " + (dir || "<unset>") + ")",
      });
      return;
    }
    const rel = path === "/" ? "index.html" : path.replace(/^\/+/, "");
    const safe = normalize(rel).replace(/^(\.\.[/\\])+/, "");
    let filePath = join(dir, safe);

    if (!existsSync(filePath) || !statSync(filePath).isFile()) {
      // SPA fallback: serve index.html for client-side routes (incl. /render).
      filePath = join(dir, "index.html");
      if (!existsSync(filePath)) {
        sendJson(res, 404, { error: "not found" });
        return;
      }
    }
    const ext = extname(filePath).toLowerCase();
    res.writeHead(200, {
      "Content-Type": MIME[ext] ?? "application/octet-stream",
      "Cache-Control": ext === ".html" ? "no-store" : "public, max-age=86400",
    });
    createReadStream(filePath).pipe(res);
  }
}

export function listSessionsSafe(bridge: PiBridge): SessionInfo[] {
  try {
    return bridge.listSessions();
  } catch {
    return [];
  }
}

function safeFileName(id: string): string {
  return id.replace(/[^a-zA-Z0-9_.-]+/g, "_").slice(0, 120) || "current";
}

function isTranscriptTurn(v: unknown): v is TranscriptTurn {
  if (!v || typeof v !== "object") return false;
  const t = v as Partial<TranscriptTurn>;
  return typeof t.id === "string" && typeof t.sessionId === "string" && typeof t.text === "string" && typeof t.ts === "number";
}

function isPublicTunnelHost(host: string, cfg: HubConfig): boolean {
  if (!host || host === "localhost" || host === "127.0.0.1" || host === "::1") return false;
  return cfg.gatewayAllowedHosts.includes(host);
}
