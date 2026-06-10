import { createHash } from "node:crypto";
import type {
  SemanticEdge,
  SemanticNode,
  WhiteboardContextPacket,
} from "../../shared/protocol.ts";

/**
 * Cleanup compiler: turns a noisy raw .excalidraw scene into a compact,
 * semantically meaningful Whiteboard Context Packet for Pi.
 *
 * Reliability rules (from the architecture doc):
 *  - Drop deleted elements, transient app state, style noise, seeds/nonces.
 *  - Replace base64 file payloads with MIME/hash/dimensions metadata.
 *  - Normalize text + bound arrows into nodes, labels and edges with stable ids.
 *  - Never send base64 or full style noise by default.
 */

// Loose Excalidraw element shape — we only read fields we care about.
export interface ExElement {
  id: string;
  type: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  isDeleted?: boolean;
  text?: string;
  containerId?: string | null;
  boundElements?: Array<{ id: string; type: string }> | null;
  startBinding?: { elementId?: string } | null;
  endBinding?: { elementId?: string } | null;
  groupIds?: string[];
  frameId?: string | null;
  fileId?: string | null;
  customData?: {
    semanticId?: string;
    semanticType?: string;
    title?: string;
    summary?: string;
    tags?: string[];
    owner?: string;
    source?: string;
  } | null;
}

export interface ExScene {
  type?: string;
  version?: number;
  source?: string;
  elements?: ExElement[];
  appState?: {
    scrollX?: number;
    scrollY?: number;
    zoom?: { value?: number } | number;
    selectedElementIds?: Record<string, boolean>;
    viewBackgroundColor?: string;
    [k: string]: unknown;
  };
  files?: Record<
    string,
    { id?: string; mimeType?: string; dataURL?: string; created?: number }
  >;
}

const NODE_SHAPES = new Set(["rectangle", "ellipse", "diamond", "image", "frame"]);
const ARROW_SHAPES = new Set(["arrow", "line"]);

export interface CompileOptions {
  revisionId: string;
  scope?: "selected" | "viewport" | "all";
  recentEvents?: string[];
  /** Optional snapshot info to attach (path/dataUrl/reason). */
  snapshot?: WhiteboardContextPacket["snapshot"];
}

interface CompileResult {
  packet: WhiteboardContextPacket;
  /** Map of raw element id -> semantic node id (for downstream tooling). */
  elementToNode: Map<string, string>;
}

function zoomValue(appState: ExScene["appState"]): number {
  const z = appState?.zoom;
  if (typeof z === "number") return z;
  if (z && typeof z.value === "number") return z.value;
  return 1;
}

function shortHash(input: string): string {
  return createHash("sha256").update(input).digest("hex").slice(0, 12);
}

function labelFor(el: ExElement, byId: Map<string, ExElement>): string | undefined {
  // Prefer explicit title, then a bound text element's text.
  if (el.customData?.title) return el.customData.title;
  if (el.type === "text" && el.text) return el.text.trim();
  const bound = el.boundElements ?? [];
  for (const b of bound) {
    if (b.type === "text") {
      const t = byId.get(b.id);
      if (t?.text) return t.text.trim();
    }
  }
  return undefined;
}

/** Compile a raw Excalidraw scene into a Whiteboard Context Packet. */
export function compileContextPacket(scene: ExScene, opts: CompileOptions): CompileResult {
  const elements = (scene.elements ?? []).filter((e) => e && !e.isDeleted);
  const byId = new Map<string, ExElement>();
  for (const el of elements) byId.set(el.id, el);

  const appState = scene.appState ?? {};
  const selectedMap = appState.selectedElementIds ?? {};
  const selectedElementIds = Object.keys(selectedMap).filter((k) => selectedMap[k]);

  // Text elements that are labels bound to a container should not become their
  // own nodes; track them so edges/nodes can absorb them.
  const labelTextIds = new Set<string>();
  for (const el of elements) {
    if (el.type === "text" && el.containerId && byId.has(el.containerId)) {
      labelTextIds.add(el.id);
    }
  }

  const elementToNode = new Map<string, string>();
  const nodes: SemanticNode[] = [];
  let autoId = 0;

  const nodeIdFor = (el: ExElement): string => el.customData?.semanticId ?? `n_${el.id.slice(0, 8)}_${autoId++}`;

  for (const el of elements) {
    const isStandaloneText = el.type === "text" && !labelTextIds.has(el.id) && !el.containerId;
    if (!NODE_SHAPES.has(el.type) && !isStandaloneText) continue;

    const semanticId = nodeIdFor(el);
    const elementIds = [el.id];
    // Absorb bound label text elements into the node.
    for (const b of el.boundElements ?? []) {
      if (b.type === "text" && byId.has(b.id)) elementIds.push(b.id);
    }
    const title = labelFor(el, byId) ?? (el.type === "frame" ? "Frame" : el.type);
    const kind = el.customData?.semanticType ?? defaultKind(el.type);

    const node: SemanticNode = {
      id: semanticId,
      elementIds,
      kind,
      title,
    };
    if (el.customData?.summary) node.summary = el.customData.summary;
    if (el.customData?.tags?.length) node.tags = el.customData.tags;
    nodes.push(node);
    for (const eid of elementIds) elementToNode.set(eid, semanticId);
  }

  // Edges from arrows/lines with bindings.
  const edges: SemanticEdge[] = [];
  for (const el of elements) {
    if (!ARROW_SHAPES.has(el.type)) continue;
    const fromEl = el.startBinding?.elementId;
    const toEl = el.endBinding?.elementId;
    const from = fromEl ? elementToNode.get(fromEl) : undefined;
    const to = toEl ? elementToNode.get(toEl) : undefined;
    if (!from || !to) continue; // unbound decorative arrow -> summarized, not an edge
    const edge: SemanticEdge = { from, to, arrowElementId: el.id };
    const label = labelFor(el, byId);
    if (label) edge.label = label;
    if (el.customData?.semanticType) edge.kind = el.customData.semanticType;
    edges.push(edge);
  }

  // File payloads -> metadata only (no base64).
  const files: WhiteboardContextPacket["files"] = [];
  for (const [fileId, f] of Object.entries(scene.files ?? {})) {
    if (!f) continue;
    const dataURL = f.dataURL ?? "";
    files.push({
      fileId,
      mimeType: f.mimeType ?? "application/octet-stream",
      hash: dataURL ? shortHash(dataURL) : "unknown",
    });
  }

  // Scope filtering: when "selected", restrict nodes/edges to the selection.
  let outNodes = nodes;
  let outEdges = edges;
  if (opts.scope === "selected" && selectedElementIds.length > 0) {
    const selNodeIds = new Set<string>();
    for (const eid of selectedElementIds) {
      const nid = elementToNode.get(eid);
      if (nid) selNodeIds.add(nid);
    }
    outNodes = nodes.filter((n) => selNodeIds.has(n.id));
    outEdges = edges.filter((e) => selNodeIds.has(e.from) && selNodeIds.has(e.to));
  }

  const selectedSemantic = Array.from(
    new Set(selectedElementIds.map((eid) => elementToNode.get(eid)).filter((v): v is string => !!v)),
  );

  const packet: WhiteboardContextPacket = {
    revisionId: opts.revisionId,
    selected: selectedSemantic,
    viewport: {
      x: Math.round(appState.scrollX ?? 0),
      y: Math.round(appState.scrollY ?? 0),
      zoom: Number(zoomValue(appState).toFixed(3)),
    },
    nodes: outNodes,
    edges: outEdges,
    recentEvents: (opts.recentEvents ?? []).slice(-12),
  };
  if (files.length) packet.files = files;
  if (opts.snapshot) packet.snapshot = opts.snapshot;
  return { packet, elementToNode };
}

function defaultKind(type: string): string {
  switch (type) {
    case "image":
      return "image";
    case "frame":
      return "group";
    case "text":
      return "note";
    default:
      return "node";
  }
}

/** Stable checksum of the meaningful scene content (ignores transient noise). */
export function sceneChecksum(scene: ExScene): string {
  const elements = (scene.elements ?? [])
    .filter((e) => e && !e.isDeleted)
    .map((e) => ({
      id: e.id,
      type: e.type,
      x: Math.round(e.x ?? 0),
      y: Math.round(e.y ?? 0),
      w: Math.round(e.width ?? 0),
      h: Math.round(e.height ?? 0),
      text: e.text ?? null,
      from: e.startBinding?.elementId ?? null,
      to: e.endBinding?.elementId ?? null,
    }))
    .sort((a, b) => (a.id < b.id ? -1 : 1));
  return shortHash(JSON.stringify(elements));
}

/** Count non-deleted elements. */
export function elementCount(scene: ExScene): number {
  return (scene.elements ?? []).filter((e) => e && !e.isDeleted).length;
}
