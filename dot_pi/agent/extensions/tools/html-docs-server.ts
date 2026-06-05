/**
 * html-docs-server - local hot-reloading HTML documentation dashboard
 */

import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { Type, type Static } from "@sinclair/typebox";
import { StringEnum } from "@mariozechner/pi-ai";
import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, dirname, extname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DESCRIPTION = readFileSync(join(__dirname, "html-docs-server.txt"), "utf8").trim();

const Action = ["start", "status", "stop"] as const;
const DEFAULT_PORT = 43110;
const EXCLUDED_DIRS = new Set([
  ".git", "node_modules", ".venv", "venv", "dist", "build", ".cache", ".next", ".turbo",
  "coverage", "target", ".direnv", ".idea", ".vscode",
]);

const ParameterSchema = Type.Object({
  action: StringEnum(Action, { description: "start, status, or stop" }),
  root: Type.Optional(Type.String({ description: "Root directory to scan/serve. Defaults to current working directory." })),
  port: Type.Optional(Type.Number({ description: "Port to use. Defaults to 43110. By default this port is fixed; set fallbackPort=true to fall forward if busy." })),
  fallbackPort: Type.Optional(Type.Boolean({ description: "If true, fall forward from the requested port when busy. Default false for deterministic URLs." })),
  id: Type.Optional(Type.String({ description: "Server id for status/stop. Defaults to the first running server for stop." })),
  all: Type.Optional(Type.Boolean({ description: "With action=stop, stop all running servers." })),
  open: Type.Optional(Type.Boolean({ description: "Reserved for future browser opening. Current tool returns the URL." })),
  pollMs: Type.Optional(Type.Number({ description: "Hot-reload scan interval in milliseconds. Default 1000." })),
});

type Params = Static<typeof ParameterSchema>;

type DocInfo = {
  path: string;
  url: string;
  title: string;
  h1: string;
  template: string;
  diataxis: string[];
  status: string;
  audience: string;
  hasGeneratedImages: boolean;
  modified: string;
  size: number;
};

type RunningServer = {
  id: string;
  root: string;
  port: number;
  url: string;
  server: Server;
  docs: DocInfo[];
  fingerprint: string;
  clients: Set<ServerResponse>;
  interval: NodeJS.Timeout;
  startedAt: Date;
};

const servers = new Map<string, RunningServer>();

function resolveRoot(root: string | undefined, cwd: string): string {
  const full = resolve(cwd, root ?? ".");
  if (!existsSync(full) || !statSync(full).isDirectory()) throw new Error(`Root is not a directory: ${full}`);
  return full;
}

function isInside(root: string, file: string): boolean {
  const rel = relative(root, file);
  return rel === "" || (!rel.startsWith("..") && !rel.includes(`..${sep}`));
}

function isSupportHtml(root: string, file: string): boolean {
  const rel = relative(root, file).split(sep).join("/");
  const name = basename(file);
  if (name.endsWith(".doc.html")) return true;
  if (name === "render_template.html") return true;
  if (rel.startsWith("dot_pi/agent/skills/") && rel.includes("/references/")) return true;
  if (rel.startsWith("dot_pi/agent/skills/") && rel.includes("/templates/")) return true;
  if (rel.startsWith("dot_pi/agent/extensions/") && rel.includes("/templates/")) return true;
  return false;
}

function walkHtml(root: string, dir = root, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (EXCLUDED_DIRS.has(entry.name)) continue;
      walkHtml(root, join(dir, entry.name), out);
    } else if (entry.isFile() && [".html", ".htm"].includes(extname(entry.name).toLowerCase())) {
      const file = join(dir, entry.name);
      if (isSupportHtml(root, file)) continue;
      out.push(file);
    }
  }
  return out;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[ch] ?? ch));
}

function attr(content: string, name: string): string {
  const re = new RegExp(`<meta\\s+[^>]*name=["']${name}["'][^>]*content=["']([^"']*)["'][^>]*>`, "i");
  return decodeEntities(content.match(re)?.[1] ?? "");
}

function tag(content: string, tagName: string): string {
  const re = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)</${tagName}>`, "i");
  return stripTags(content.match(re)?.[1] ?? "").trim();
}

function stripTags(value: string): string {
  return decodeEntities(value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " "));
}

function decodeEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function parseYamlArray(line: string): string[] {
  const bracket = line.match(/\[([^\]]*)\]/)?.[1];
  if (!bracket) return [];
  return bracket.split(",").map((s) => s.trim().replace(/^['"]|['"]$/g, "")).filter(Boolean);
}

function parseFrontmatter(content: string): Record<string, any> {
  if (!content.startsWith("---\n")) return {};
  const end = content.indexOf("\n---", 4);
  if (end < 0) return {};
  const fm = content.slice(4, end).split(/\r?\n/);
  const data: Record<string, any> = {};
  for (const line of fm) {
    const m = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!m) continue;
    const key = m[1];
    const val = m[2].trim();
    data[key] = val.startsWith("[") ? parseYamlArray(val) : val.replace(/^['"]|['"]$/g, "");
  }
  return data;
}

function parseJsonMetadata(content: string): any {
  const m = content.match(/<script\s+[^>]*id=["']html-docs-metadata["'][^>]*>([\s\S]*?)<\/script>/i);
  if (!m) return {};
  try { return JSON.parse(m[1].trim()); } catch { return {}; }
}

function fileUrlForRelativePath(rel: string): string {
  return `/file/${rel.split("/").map((part) => encodeURIComponent(part)).join("/")}`;
}

function parseDoc(root: string, file: string): DocInfo {
  const content = readFileSync(file, "utf8");
  const st = statSync(file);
  const rel = relative(root, file).split(sep).join("/");
  const fm = parseFrontmatter(content);
  const json = parseJsonMetadata(content);
  const title = attr(content, "title") || tag(content, "title") || fm.name || basename(file);
  const diataxisRaw = attr(content, "diataxis") || json.diataxis || fm.diataxis || [];
  const diataxis = Array.isArray(diataxisRaw) ? diataxisRaw : String(diataxisRaw).split(",").map((s) => s.trim()).filter(Boolean);
  const template = attr(content, "doc-template") || json.template || fm.id || "unknown";
  const status = attr(content, "doc-status") || json.status || fm.status || "unknown";
  const hasGeneratedImages = /<meta\s+[^>]*name=["']has-generated-images["'][^>]*content=["']true["']/i.test(content) ||
    Boolean(json.visuals?.length) || /<img\s/i.test(content);
  return {
    path: rel,
    url: fileUrlForRelativePath(rel),
    title,
    h1: tag(content, "h1") || title,
    template: String(template),
    diataxis,
    status: String(status),
    audience: attr(content, "audience") || json.audience || "",
    hasGeneratedImages,
    modified: st.mtime.toISOString(),
    size: st.size,
  };
}

function scan(root: string): { docs: DocInfo[]; fingerprint: string } {
  const files = walkHtml(root).sort();
  const docs = files.map((file) => parseDoc(root, file));
  const fingerprint = files.map((file) => {
    const st = statSync(file);
    return `${relative(root, file)}:${st.mtimeMs}:${st.size}`;
  }).join("|");
  return { docs, fingerprint };
}

function contentType(file: string): string {
  const ext = extname(file).toLowerCase();
  if (ext === ".html" || ext === ".htm") return "text/html; charset=utf-8";
  if (ext === ".css") return "text/css; charset=utf-8";
  if (ext === ".js") return "text/javascript; charset=utf-8";
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".webp") return "image/webp";
  if (ext === ".svg") return "image/svg+xml";
  if (ext === ".json") return "application/json; charset=utf-8";
  return "application/octet-stream";
}

function dashboardHtml(state: RunningServer): string {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>HTML Docs</title><style>
  :root{color-scheme:light dark;--bg:#f8fafc;--panel:#fff;--ink:#0f172a;--muted:#64748b;--line:#cbd5e1;--accent:#2563eb} @media(prefers-color-scheme:dark){:root{--bg:#0a0e1a;--panel:#111827;--ink:#f8fafc;--muted:#94a3b8;--line:#263244;--accent:#60a5fa}} *{box-sizing:border-box} body{margin:0;background:var(--bg);color:var(--ink);font:14px/1.45 system-ui,sans-serif} header{padding:16px 20px;border-bottom:1px solid var(--line);background:var(--panel);position:sticky;top:0;z-index:2} h1{margin:0;font-size:20px}.layout{display:grid;grid-template-columns:380px 1fr;min-height:calc(100vh - 64px)} aside{border-right:1px solid var(--line);padding:16px;overflow:auto}.preview{height:calc(100vh - 64px)} iframe{width:100%;height:100%;border:0;background:white}.doc{display:block;text-decoration:none;color:var(--ink);border:1px solid var(--line);border-radius:12px;padding:10px;margin:8px 0;background:var(--panel)}.doc:hover{border-color:var(--accent)}.meta{color:var(--muted);font-size:12px}.badge{display:inline-block;border:1px solid var(--line);border-radius:999px;padding:1px 7px;margin-right:4px;color:var(--muted);font-size:11px} input{width:100%;padding:10px;border:1px solid var(--line);border-radius:10px;background:var(--panel);color:var(--ink)} details{margin:12px 0} summary{cursor:pointer;font-weight:700}.hot{color:#16a34a;font-size:12px}@media(max-width:900px){.layout{grid-template-columns:1fr}.preview{height:70vh} aside{border-right:0;border-bottom:1px solid var(--line)}}
  </style></head><body><header><h1>HTML Docs <span class="hot" id="hot">● hot reload</span></h1><div class="meta">Root: ${escapeHtml(state.root)} · <span id="count">0</span> docs</div></header><div class="layout"><aside><input id="q" placeholder="Search docs..."><div id="groups"></div></aside><main class="preview"><iframe id="frame" src="about:blank"></iframe></main></div><script>
  let docs=[]; let current=''; const q=document.getElementById('q'); const groups=document.getElementById('groups'); const frame=document.getElementById('frame');
  function groupBy(arr, fn){return arr.reduce((m,x)=>{const k=fn(x)||'uncategorized';(m[k]||(m[k]=[])).push(x);return m},{})}
  function docCard(d){return '<a class="doc" href="'+d.url+'" data-url="'+d.url+'"><strong>'+escapeHtml(d.h1||d.title)+'</strong><div class="meta">'+escapeHtml(d.path)+'</div><div><span class="badge">'+escapeHtml(d.template)+'</span>'+d.diataxis.map(x=>'<span class="badge">'+escapeHtml(x)+'</span>').join('')+(d.hasGeneratedImages?'<span class="badge">visuals</span>':'')+'</div></a>'}
  function escapeHtml(s){return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function render(){const term=q.value.toLowerCase(); const filtered=docs.filter(d=>[d.h1,d.title,d.path,d.template,d.status,d.audience,...d.diataxis].join(' ').toLowerCase().includes(term)); document.getElementById('count').textContent=filtered.length; const byQ=groupBy(filtered,d=>d.diataxis[0]); groups.innerHTML=Object.keys(byQ).sort().map(k=>'<details open><summary>'+escapeHtml(k)+'</summary>'+byQ[k].map(docCard).join('')+'</details>').join(''); groups.querySelectorAll('a.doc').forEach(a=>a.onclick=e=>{e.preventDefault(); current=a.dataset.url; frame.src=current;});}
  async function load(){const res=await fetch('/api/docs'); docs=await res.json(); render(); if(!current&&docs[0]){current=docs[0].url; frame.src=current}}
  q.oninput=render; load(); const es=new EventSource('/events'); es.onmessage=()=>{load(); if(current) frame.src=current+(current.includes('?')?'&':'?')+'t='+Date.now()}; es.onerror=()=>document.getElementById('hot').textContent='● reconnecting'; es.onopen=()=>document.getElementById('hot').textContent='● hot reload';
  </script></body></html>`;
}

function sendJson(res: ServerResponse, data: unknown): void {
  res.writeHead(200, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  res.end(JSON.stringify(data, null, 2));
}

function handleRequest(state: RunningServer, req: IncomingMessage, res: ServerResponse): void {
  const url = new URL(req.url ?? "/", `http://localhost:${state.port}`);
  if (url.pathname === "/") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" });
    res.end(dashboardHtml(state));
    return;
  }
  if (url.pathname === "/api/docs") return sendJson(res, state.docs);
  if (url.pathname === "/api/status") return sendJson(res, { id: state.id, root: state.root, port: state.port, url: state.url, docs: state.docs.length, startedAt: state.startedAt });
  if (url.pathname === "/events") {
    res.writeHead(200, { "Content-Type": "text/event-stream", "Cache-Control": "no-store", Connection: "keep-alive" });
    res.write(`data: ready\n\n`);
    state.clients.add(res);
    req.on("close", () => state.clients.delete(res));
    return;
  }
  if (url.pathname.startsWith("/file/")) {
    const rel = decodeURIComponent(url.pathname.slice("/file/".length));
    const file = resolve(state.root, rel);
    if (!isInside(state.root, file) || !existsSync(file) || !statSync(file).isFile()) {
      res.writeHead(404); res.end("Not found"); return;
    }
    res.writeHead(200, { "Content-Type": contentType(file), "Cache-Control": "no-store" });
    res.end(readFileSync(file));
    return;
  }
  res.writeHead(404); res.end("Not found");
}

async function listen(server: Server, preferredPort: number, fallbackPort: boolean): Promise<number> {
  const attempts = fallbackPort ? 50 : 1;
  for (let offset = 0; offset < attempts; offset++) {
    const port = preferredPort + offset;
    try {
      await new Promise<void>((resolveListen, rejectListen) => {
        const onError = (err: any) => { server.off("listening", onListening); rejectListen(err); };
        const onListening = () => { server.off("error", onError); resolveListen(); };
        server.once("error", onError);
        server.once("listening", onListening);
        server.listen(port, "127.0.0.1");
      });
      return port;
    } catch (err: any) {
      if (err?.code !== "EADDRINUSE" || !fallbackPort) throw err;
    }
  }
  throw new Error(`No free port found starting at ${preferredPort}`);
}

function broadcastReload(state: RunningServer): void {
  for (const client of state.clients) client.write(`data: reload ${Date.now()}\n\n`);
}

async function startServer(params: Params, cwd: string): Promise<RunningServer> {
  const root = resolveRoot(params.root, cwd);
  const existing = [...servers.values()].find((s) => s.root === root);
  if (existing) return existing;
  const id = `html-docs-${Buffer.from(root).toString("base64url").slice(0, 10)}-${Date.now().toString(36)}`;
  const initial = scan(root);
  const state = {} as RunningServer;
  const server = createServer((req, res) => handleRequest(state, req, res));
  const port = await listen(server, Math.round(params.port ?? DEFAULT_PORT), params.fallbackPort ?? false);
  Object.assign(state, {
    id,
    root,
    port,
    url: `http://127.0.0.1:${port}/`,
    server,
    docs: initial.docs,
    fingerprint: initial.fingerprint,
    clients: new Set<ServerResponse>(),
    startedAt: new Date(),
  });
  state.interval = setInterval(() => {
    try {
      const next = scan(root);
      if (next.fingerprint !== state.fingerprint) {
        state.docs = next.docs;
        state.fingerprint = next.fingerprint;
        broadcastReload(state);
      }
    } catch {
      // Keep server alive; next poll may recover.
    }
  }, Math.max(500, Math.round(params.pollMs ?? 1000)));
  servers.set(id, state);
  return state;
}

function stopServer(id: string): boolean {
  const state = servers.get(id);
  if (!state) return false;
  clearInterval(state.interval);
  for (const client of state.clients) client.end();
  state.server.close();
  servers.delete(id);
  return true;
}

export function register(pi: ExtensionAPI) {
  pi.registerTool({
    name: "html_docs_server",
    label: "HTML Docs Server",
    description: DESCRIPTION,
    parameters: ParameterSchema,
    async execute(_toolCallId, params: Params, _signal, _onUpdate, ctx) {
      try {
        if (params.action === "status") {
          const list = [...servers.values()].map((s) => ({ id: s.id, root: s.root, url: s.url, docs: s.docs.length, startedAt: s.startedAt.toISOString() }));
          return { content: [{ type: "text", text: list.length ? list.map((s) => `${s.id}\n  ${s.url}\n  root: ${s.root}\n  docs: ${s.docs}`).join("\n") : "No html-docs servers running." }], details: { servers: list } };
        }
        if (params.action === "stop") {
          const ids = params.all ? [...servers.keys()] : [params.id ?? servers.keys().next().value].filter(Boolean);
          const stopped = ids.filter((id) => stopServer(id));
          return { content: [{ type: "text", text: stopped.length ? `Stopped ${stopped.length} server(s):\n${stopped.join("\n")}` : "No matching html-docs server found." }], details: { stopped } };
        }
        const state = await startServer(params, ctx.cwd);
        const text = `HTML docs server started\nURL: ${state.url}\nRoot: ${state.root}\nDocs: ${state.docs.length}\nHot reload: enabled (${params.pollMs ?? 1000}ms poll)\nID: ${state.id}`;
        return { content: [{ type: "text", text }], details: { id: state.id, url: state.url, root: state.root, docs: state.docs.length, hotReload: true } };
      } catch (err: any) {
        return { content: [{ type: "text", text: `html_docs_server error: ${err?.message ?? String(err)}` }], details: { error: true }, isError: true };
      }
    },
  });
}
