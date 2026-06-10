import { randomBytes } from "node:crypto";
import type { ExElement, ExScene } from "./cleanup.ts";

/**
 * Server-side factory for complete Excalidraw elements. The hub is the
 * authoritative owner of the scene, so it must emit fully-formed elements
 * (not skeletons). The browser runs Excalidraw `restore()` on load which
 * normalizes bindings and bound-text measurements.
 */

export type ShapeKind =
  | "service"
  | "database"
  | "api"
  | "component"
  | "queue"
  | "external"
  | "note"
  | "decision";

const KIND_STYLE: Record<string, { bg: string; stroke: string; type: "rectangle" | "ellipse" | "diamond" }> = {
  service: { bg: "#83a59833", stroke: "#83a598", type: "rectangle" },
  api: { bg: "#8ec07c33", stroke: "#8ec07c", type: "rectangle" },
  component: { bg: "#d3869b33", stroke: "#d3869b", type: "rectangle" },
  queue: { bg: "#fabd2f33", stroke: "#fabd2f", type: "rectangle" },
  external: { bg: "#fe801933", stroke: "#fe8019", type: "rectangle" },
  database: { bg: "#b8bb2633", stroke: "#b8bb26", type: "ellipse" },
  decision: { bg: "#fb493433", stroke: "#fb4934", type: "diamond" },
  note: { bg: "#ebdbb233", stroke: "#a89984", type: "rectangle" },
};

export function genId(): string {
  return randomBytes(12).toString("base64url");
}

function nonce(): number {
  return Math.floor(Math.random() * 2_147_483_647);
}

function baseElement(type: string, overrides: Partial<ExElement> & Record<string, unknown>): ExElement {
  return {
    id: genId(),
    type,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    angle: 0,
    strokeColor: "#1e1e1e",
    backgroundColor: "transparent",
    fillStyle: "solid",
    strokeWidth: 2,
    strokeStyle: "solid",
    roughness: 1,
    opacity: 100,
    groupIds: [],
    frameId: null,
    roundness: type === "rectangle" ? { type: 3 } : null,
    seed: nonce(),
    version: 1,
    versionNonce: nonce(),
    isDeleted: false,
    boundElements: null,
    updated: Date.now(),
    link: null,
    locked: false,
    ...overrides,
  } as ExElement & Record<string, unknown>;
}

export interface CreatedNode {
  semanticId: string;
  shape: ExElement;
  label: ExElement;
}

/** Create a labelled shape (container + bound text) for a semantic kind. */
export function createShape(args: {
  kind: string;
  title: string;
  summary?: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  semanticId?: string;
  tags?: string[];
}): CreatedNode {
  const style = KIND_STYLE[args.kind] ?? KIND_STYLE.note!;
  const width = args.width ?? 200;
  const height = args.height ?? 90;
  const semanticId = args.semanticId ?? `svc.${slug(args.title)}.${genId().slice(0, 4)}`;

  const shape = baseElement(style.type, {
    x: args.x,
    y: args.y,
    width,
    height,
    backgroundColor: style.bg,
    strokeColor: style.stroke,
    customData: {
      semanticId,
      semanticType: args.kind,
      title: args.title,
      ...(args.summary ? { summary: args.summary } : {}),
      ...(args.tags?.length ? { tags: args.tags } : {}),
    },
  });

  const label = baseElement("text", {
    x: args.x + 12,
    y: args.y + height / 2 - 10,
    width: width - 24,
    height: 20,
    text: args.title,
    originalText: args.title,
    fontSize: 16,
    fontFamily: 1,
    textAlign: "center",
    verticalAlign: "middle",
    strokeColor: style.stroke,
    containerId: shape.id,
    lineHeight: 1.25,
  } as Partial<ExElement> & Record<string, unknown>);

  shape.boundElements = [{ id: label.id, type: "text" }];

  return { semanticId, shape, label };
}

/** Create an arrow bound between two existing container elements. */
export function createArrow(args: {
  from: ExElement;
  to: ExElement;
  label?: string;
  kind?: string;
}): { arrow: ExElement; label?: ExElement } {
  const a = centerOf(args.from);
  const b = centerOf(args.to);
  // Start/end on the shape boundaries (with a small gap) so arrowheads do not
  // overlap the shapes' bound text labels.
  const start = edgePoint(args.from, b.x, b.y, 6);
  const end = edgePoint(args.to, a.x, a.y, 6);
  const arrow = baseElement("arrow", {
    x: start.x,
    y: start.y,
    width: Math.abs(end.x - start.x),
    height: Math.abs(end.y - start.y),
    points: [
      [0, 0],
      [end.x - start.x, end.y - start.y],
    ],
    strokeColor: "#a89984",
    startBinding: { elementId: args.from.id, focus: 0, gap: 6 },
    endBinding: { elementId: args.to.id, focus: 0, gap: 6 },
    endArrowhead: "arrow",
    startArrowhead: null,
    ...(args.kind ? { customData: { semanticType: args.kind } } : {}),
  } as Partial<ExElement> & Record<string, unknown>);

  let label: ExElement | undefined;
  const bound: Array<{ id: string; type: string }> = [];
  if (args.label) {
    label = baseElement("text", {
      x: (start.x + end.x) / 2 - 40,
      y: (start.y + end.y) / 2 - 22,
      width: 80,
      height: 20,
      text: args.label,
      originalText: args.label,
      fontSize: 14,
      fontFamily: 1,
      textAlign: "center",
      verticalAlign: "middle",
      strokeColor: "#a89984",
      containerId: arrow.id,
      lineHeight: 1.25,
    } as Partial<ExElement> & Record<string, unknown>);
    bound.push({ id: label.id, type: "text" });
  }
  if (bound.length) arrow.boundElements = bound;

  // Register the arrow on both endpoints' boundElements.
  args.from.boundElements = [...(args.from.boundElements ?? []), { id: arrow.id, type: "arrow" }];
  args.to.boundElements = [...(args.to.boundElements ?? []), { id: arrow.id, type: "arrow" }];

  return { arrow, label };
}

function centerOf(el: ExElement): { x: number; y: number } {
  return { x: (el.x ?? 0) + (el.width ?? 0) / 2, y: (el.y ?? 0) + (el.height ?? 0) / 2 };
}

/** Point on the boundary box of `el` (expanded by gap) toward (tx, ty). */
function edgePoint(el: ExElement, tx: number, ty: number, gap: number): { x: number; y: number } {
  const cx = (el.x ?? 0) + (el.width ?? 0) / 2;
  const cy = (el.y ?? 0) + (el.height ?? 0) / 2;
  const dx = tx - cx;
  const dy = ty - cy;
  if (dx === 0 && dy === 0) return { x: cx, y: cy };
  const hw = (el.width ?? 0) / 2 + gap;
  const hh = (el.height ?? 0) / 2 + gap;
  const scale = 1 / Math.max(Math.abs(dx) / hw || 0, Math.abs(dy) / hh || 0);
  return { x: cx + dx * scale, y: cy + dy * scale };
}

function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24) || "node";
}

/** A fresh, empty Excalidraw scene. */
export function emptyScene(): ExScene {
  return {
    type: "excalidraw",
    version: 2,
    source: "pi-elevenlabs-whiteboard",
    elements: [],
    appState: { viewBackgroundColor: "transparent", zoom: { value: 1 }, scrollX: 0, scrollY: 0 },
    files: {},
  };
}
