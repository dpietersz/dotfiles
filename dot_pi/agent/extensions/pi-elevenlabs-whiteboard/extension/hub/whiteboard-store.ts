import { EventEmitter } from "node:events";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type {
  SemanticEdge,
  SemanticNode,
  WhiteboardContextPacket,
  WhiteboardRevisionMeta,
} from "../../shared/protocol.ts";
import {
  compileContextPacket,
  elementCount,
  sceneChecksum,
  type ExElement,
  type ExScene,
} from "./cleanup.ts";
import { createArrow, createShape, emptyScene } from "./excalidraw-factory.ts";
import type { Logger } from "./log.ts";

interface SessionState {
  scene: ExScene;
  revisionNumber: number;
  revisionId: string;
  revisions: WhiteboardRevisionMeta[];
  selected: string[];
  viewport: { x: number; y: number; zoom: number };
  recentEvents: string[];
}

export interface PatchOperation {
  op: "add" | "update" | "delete";
  element?: ExElement;
  elementId?: string;
  /** For update: partial fields to merge into the element. */
  set?: Record<string, unknown>;
}

export interface WhiteboardStoreEvents {
  scene: (e: {
    sessionId: string;
    revisionId: string;
    scene: ExScene;
    summary: string;
    author: "user" | "agent";
  }) => void;
  revision: (e: { revision: WhiteboardRevisionMeta }) => void;
}

/**
 * Owns Excalidraw scenes, semantic compilation, revision history and disk
 * persistence. Mutating methods return a fresh revision id and a human summary
 * for the transcript (architecture: "Each mutating tool returns a validated
 * patch, a human-readable summary, and a new revision ID.").
 */
export class WhiteboardStore extends EventEmitter {
  private sessions = new Map<string, SessionState>();
  private dataDir: string;
  private log?: Logger;

  constructor(opts: { dataDir: string; log?: Logger }) {
    super();
    this.dataDir = opts.dataDir;
    this.log = opts.log;
  }

  private dir(sessionId: string): string {
    return join(this.dataDir, "whiteboards", sanitize(sessionId));
  }

  snapshotsDir(sessionId: string): string {
    const d = join(this.dir(sessionId), "snapshots");
    mkdirSync(d, { recursive: true });
    return d;
  }

  private load(sessionId: string): SessionState {
    const existing = this.sessions.get(sessionId);
    if (existing) return existing;

    let scene = emptyScene();
    let revisionNumber = 0;
    const scenePath = join(this.dir(sessionId), "scene.excalidraw");
    if (existsSync(scenePath)) {
      try {
        scene = JSON.parse(readFileSync(scenePath, "utf8")) as ExScene;
      } catch (err) {
        this.log?.warn("whiteboard: failed to load scene, starting empty", {
          sessionId,
          err: String(err),
        });
      }
    }
    const metaPath = join(this.dir(sessionId), "revisions.json");
    let revisions: WhiteboardRevisionMeta[] = [];
    if (existsSync(metaPath)) {
      try {
        revisions = JSON.parse(readFileSync(metaPath, "utf8")) as WhiteboardRevisionMeta[];
        revisionNumber = revisions.length;
      } catch {
        /* ignore */
      }
    }
    const state: SessionState = {
      scene,
      revisionNumber,
      revisionId: `wb_${revisionNumber}`,
      revisions,
      selected: [],
      viewport: { x: 0, y: 0, zoom: 1 },
      recentEvents: [],
    };
    this.sessions.set(sessionId, state);
    return state;
  }

  private persist(sessionId: string, state: SessionState): void {
    if (!this.dataDir) return;
    try {
      const d = this.dir(sessionId);
      mkdirSync(d, { recursive: true });
      writeFileSync(join(d, "scene.excalidraw"), JSON.stringify(state.scene, null, 2));
      writeFileSync(join(d, "revisions.json"), JSON.stringify(state.revisions, null, 2));
    } catch (err) {
      this.log?.warn("whiteboard: persist failed", { sessionId, err: String(err) });
    }
  }

  private bump(
    sessionId: string,
    state: SessionState,
    summary: string,
    author: "user" | "agent",
  ): WhiteboardRevisionMeta {
    state.revisionNumber += 1;
    state.revisionId = `wb_${state.revisionNumber}`;
    const meta: WhiteboardRevisionMeta = {
      revisionId: state.revisionId,
      sessionId,
      elementCount: elementCount(state.scene),
      summary,
      author,
      ts: Date.now(),
    };
    state.revisions.push(meta);
    if (state.revisions.length > 200) state.revisions = state.revisions.slice(-200);
    this.pushEvent(state, summary);
    this.persist(sessionId, state);
    this.emit("scene", { sessionId, revisionId: state.revisionId, scene: state.scene, summary, author });
    this.emit("revision", { revision: meta });
    return meta;
  }

  private pushEvent(state: SessionState, ev: string): void {
    state.recentEvents.push(ev);
    if (state.recentEvents.length > 24) state.recentEvents = state.recentEvents.slice(-24);
  }

  // --- Public API ---------------------------------------------------------

  getScene(sessionId: string): ExScene {
    return this.load(sessionId).scene;
  }

  getRevisionId(sessionId: string): string {
    return this.load(sessionId).revisionId;
  }

  listRevisions(sessionId: string): WhiteboardRevisionMeta[] {
    return this.load(sessionId).revisions.slice();
  }

  /** Update selection/viewport without bumping a revision (UI focus only). */
  noteSelection(sessionId: string, selected: string[], viewport: { x: number; y: number; zoom: number }): void {
    const state = this.load(sessionId);
    const before = state.selected.join(",");
    state.selected = selected;
    state.viewport = viewport;
    if (selected.length && selected.join(",") !== before) {
      this.pushEvent(state, `user selected ${selected.length} element(s)`);
    }
  }

  /** Replace whole scene from an imported .excalidraw file. */
  importScene(sessionId: string, scene: ExScene, summary = "imported Excalidraw scene"): WhiteboardRevisionMeta {
    const state = this.load(sessionId);
    state.scene = normalizeScene(scene);
    state.selected = [];
    state.viewport = { x: 0, y: 0, zoom: 1 };
    return this.bump(sessionId, state, summary, "user");
  }

  /** Replace the scene from a browser edit. */
  setSceneFromClient(
    sessionId: string,
    scene: ExScene,
    selected: string[],
    viewport: { x: number; y: number; zoom: number },
  ): WhiteboardRevisionMeta | null {
    const state = this.load(sessionId);
    const prev = sceneChecksum(state.scene);
    const next = sceneChecksum(scene);
    state.selected = selected;
    state.viewport = viewport;
    if (prev === next) return null; // no meaningful change
    state.scene = scene;
    return this.bump(sessionId, state, "canvas edited in dashboard", "user");
  }

  addShape(
    sessionId: string,
    args: { kind: string; title: string; summary?: string; x?: number; y?: number; tags?: string[] },
  ): { revision: WhiteboardRevisionMeta; node: SemanticNode } {
    const state = this.load(sessionId);
    const count = (state.scene.elements ?? []).filter((e) => !e.isDeleted).length;
    const x = args.x ?? 120 + (count % 4) * 260;
    const y = args.y ?? 120 + Math.floor(count / 4) * 160;
    const created = createShape({ ...args, x, y });
    state.scene.elements = [...(state.scene.elements ?? []), created.shape, created.label];
    const revision = this.bump(
      sessionId,
      state,
      `added ${args.kind} "${args.title}"`,
      "agent",
    );
    const node: SemanticNode = {
      id: created.semanticId,
      elementIds: [created.shape.id, created.label.id],
      kind: args.kind,
      title: args.title,
      ...(args.summary ? { summary: args.summary } : {}),
      ...(args.tags?.length ? { tags: args.tags } : {}),
    };
    return { revision, node };
  }

  private findBySemanticId(scene: ExScene, semanticId: string): ExElement | undefined {
    return (scene.elements ?? []).find(
      (e) => !e.isDeleted && e.customData?.semanticId === semanticId,
    );
  }

  addArrow(
    sessionId: string,
    args: { fromSemanticId: string; toSemanticId: string; label?: string; kind?: string },
  ): { revision: WhiteboardRevisionMeta; edge: SemanticEdge } {
    const state = this.load(sessionId);
    const from = this.findBySemanticId(state.scene, args.fromSemanticId);
    const to = this.findBySemanticId(state.scene, args.toSemanticId);
    if (!from) throw new Error(`no element with semanticId "${args.fromSemanticId}"`);
    if (!to) throw new Error(`no element with semanticId "${args.toSemanticId}"`);
    const { arrow, label } = createArrow({ from, to, label: args.label, kind: args.kind });
    const extra = label ? [arrow, label] : [arrow];
    state.scene.elements = [...(state.scene.elements ?? []), ...extra];
    const revision = this.bump(
      sessionId,
      state,
      `connected ${args.fromSemanticId} → ${args.toSemanticId}${args.label ? ` (${args.label})` : ""}`,
      "agent",
    );
    const edge: SemanticEdge = {
      from: args.fromSemanticId,
      to: args.toSemanticId,
      arrowElementId: arrow.id,
      ...(args.label ? { label: args.label } : {}),
      ...(args.kind ? { kind: args.kind } : {}),
    };
    return { revision, edge };
  }

  /** Apply low-level element operations with optimistic concurrency control. */
  applyPatch(
    sessionId: string,
    args: { baseRevisionId: string; operations: PatchOperation[]; rationale?: string },
  ): { revision: WhiteboardRevisionMeta; applied: number } {
    const state = this.load(sessionId);
    if (args.baseRevisionId && args.baseRevisionId !== state.revisionId) {
      throw new Error(
        `stale baseRevisionId "${args.baseRevisionId}" (current "${state.revisionId}"). Re-fetch context before patching.`,
      );
    }
    const byId = new Map<string, ExElement>();
    for (const el of state.scene.elements ?? []) byId.set(el.id, el);

    let applied = 0;
    for (const op of args.operations) {
      if (op.op === "add") {
        if (!op.element?.id || !op.element.type) throw new Error("add op requires element with id and type");
        if (byId.has(op.element.id)) throw new Error(`add op: element ${op.element.id} already exists`);
        byId.set(op.element.id, op.element);
        applied++;
      } else if (op.op === "update") {
        const id = op.elementId ?? op.element?.id;
        if (!id) throw new Error("update op requires elementId");
        const cur = byId.get(id);
        if (!cur) throw new Error(`update op: element ${id} not found`);
        byId.set(id, { ...cur, ...(op.set ?? {}), ...(op.element ?? {}), id } as ExElement);
        applied++;
      } else if (op.op === "delete") {
        const id = op.elementId ?? op.element?.id;
        if (!id) throw new Error("delete op requires elementId");
        const cur = byId.get(id);
        if (cur) {
          byId.set(id, { ...cur, isDeleted: true } as ExElement);
          applied++;
        }
      } else {
        throw new Error(`unknown op "${(op as { op: string }).op}"`);
      }
    }
    state.scene.elements = Array.from(byId.values());
    const revision = this.bump(
      sessionId,
      state,
      args.rationale ? `patch: ${args.rationale}` : `applied ${applied} patch op(s)`,
      "agent",
    );
    return { revision, applied };
  }

  /** Compact the scene: drop deleted elements and reset transient app state. */
  cleanupScene(
    sessionId: string,
    args: { baseRevisionId?: string; preserveExports?: boolean },
  ): { revision: WhiteboardRevisionMeta; removed: number } {
    const state = this.load(sessionId);
    if (args.baseRevisionId && args.baseRevisionId !== state.revisionId) {
      throw new Error(`stale baseRevisionId "${args.baseRevisionId}" (current "${state.revisionId}")`);
    }
    const before = (state.scene.elements ?? []).length;
    const kept = (state.scene.elements ?? []).filter((e) => !e.isDeleted);
    const removed = before - kept.length;
    state.scene.elements = kept;
    if (!args.preserveExports) state.scene.files = {};
    // Reset transient app-state noise but keep viewport.
    state.scene.appState = {
      viewBackgroundColor: state.scene.appState?.viewBackgroundColor ?? "transparent",
      scrollX: state.scene.appState?.scrollX ?? 0,
      scrollY: state.scene.appState?.scrollY ?? 0,
      zoom: state.scene.appState?.zoom ?? { value: 1 },
    };
    const revision = this.bump(sessionId, state, `cleaned scene (removed ${removed} stale element(s))`, "agent");
    return { revision, removed };
  }

  /** Build the compact Whiteboard Context Packet for an LLM turn. */
  getContextPacket(
    sessionId: string,
    opts: { scope?: "selected" | "viewport" | "all"; snapshot?: WhiteboardContextPacket["snapshot"] } = {},
  ): WhiteboardContextPacket {
    const state = this.load(sessionId);
    // Mirror live selection/viewport into appState so the compiler sees it.
    const scene: ExScene = {
      ...state.scene,
      appState: {
        ...state.scene.appState,
        selectedElementIds: Object.fromEntries(state.selected.map((id) => [id, true])),
        scrollX: state.viewport.x,
        scrollY: state.viewport.y,
        zoom: { value: state.viewport.zoom },
      },
    };
    const { packet } = compileContextPacket(scene, {
      revisionId: state.revisionId,
      scope: opts.scope ?? "all",
      recentEvents: state.recentEvents,
      snapshot: opts.snapshot,
    });
    return packet;
  }
}

function sanitize(id: string): string {
  return id.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80) || "default";
}

function normalizeScene(scene: ExScene): ExScene {
  return {
    type: "excalidraw",
    version: 2,
    source: scene.source ?? "piwb-import",
    elements: Array.isArray(scene.elements) ? scene.elements : [],
    appState: scene.appState ?? {},
    files: scene.files ?? {},
  };
}
