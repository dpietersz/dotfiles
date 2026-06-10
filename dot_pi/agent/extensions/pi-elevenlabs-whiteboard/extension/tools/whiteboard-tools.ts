import type { ExtensionAPI, ToolDefinition } from "@earendil-works/pi-coding-agent";
import { StringEnum } from "@earendil-works/pi-ai";
import { Type } from "typebox";
import type { Hub } from "../hub/server.ts";
import type { PatchOperation } from "../hub/whiteboard-store.ts";
import { renderSnapshot, type SnapshotScope } from "../hub/snapshot.ts";

const SHAPE_KINDS = ["service", "api", "database", "queue", "external", "component", "decision", "note"] as const;
const SCOPES = ["selected", "viewport", "all"] as const;

type ToolResult = {
  content: Array<
    | { type: "text"; text: string }
    | { type: "image"; data: string; mimeType: string }
  >;
  details?: Record<string, unknown>;
};

function text(t: string): ToolResult["content"][number] {
  return { type: "text", text: t };
}

/** Create whiteboard tools for either the interactive extension API or a headless SDK session. */
export function createWhiteboardTools(hub: Hub, getSessionId?: () => string): ToolDefinition[] {
  const sessionId = (): string => getSessionId?.() ?? hub.bridge.getActiveSessionId() ?? "current";

  return [
    {
      name: "whiteboard_get_context",
      label: "Whiteboard: Get Context",
      description:
        "Read the current whiteboard as a compact semantic context packet (nodes, edges, selection, viewport). Call this before editing an existing diagram. Set includeSnapshot to also capture a rendered PNG when visual layout matters.",
      promptSnippet: "Read the whiteboard scene as a semantic context packet",
      promptGuidelines: [
        "Call whiteboard_get_context before editing an existing whiteboard so you target the right semantic nodes.",
      ],
      parameters: Type.Object({
        scope: Type.Optional(StringEnum(SCOPES)),
        includeSnapshot: Type.Optional(Type.Boolean()),
      }),
      async execute(_id, params: any) {
        const scope = (params.scope as SnapshotScope | undefined) ?? "all";
        let snapshot;
        if (params.includeSnapshot) {
          const snap = await renderSnapshot(hub, { sessionId: sessionId(), scope, reason: "explicit_request" });
          snapshot = snap.available
            ? { available: true as const, ...(snap.path ? { path: snap.path } : {}), reason: snap.reason }
            : { available: false as const, reason: snap.error };
        }
        const packet = hub.store.getContextPacket(sessionId(), { scope, snapshot });
        const content: ToolResult["content"] = [text(JSON.stringify(packet, null, 2))];
        return { content, details: { packet } };
      },
    },

    {
      name: "whiteboard_add_shape",
      label: "Whiteboard: Add Shape",
      description:
        "Add a labelled node to the whiteboard. Returns its semanticId for use with whiteboard_add_arrow. Choose a kind that fits the component.",
      promptSnippet: "Add a labelled node (service, api, database, …) to the whiteboard",
      parameters: Type.Object({
        kind: StringEnum(SHAPE_KINDS),
        title: Type.String({ description: "Short, specific label" }),
        summary: Type.Optional(Type.String({ description: "One-line description of the node's role" })),
        x: Type.Optional(Type.Number()),
        y: Type.Optional(Type.Number()),
        tags: Type.Optional(Type.Array(Type.String())),
      }),
      async execute(_id, params: any) {
        const { revision, node } = hub.store.addShape(sessionId(), {
          kind: params.kind as string,
          title: params.title as string,
          summary: params.summary as string | undefined,
          x: params.x as number | undefined,
          y: params.y as number | undefined,
          tags: params.tags as string[] | undefined,
        });
        return {
          content: [
            text(
              `Added ${node.kind} "${node.title}" as ${node.id} (revision ${revision.revisionId}). Use this semanticId to connect arrows.`,
            ),
          ],
          details: { node, revision },
        };
      },
    },

    {
      name: "whiteboard_add_arrow",
      label: "Whiteboard: Add Arrow",
      description:
        "Connect two existing whiteboard nodes by their semanticId. Label the arrow with the relationship or protocol.",
      promptSnippet: "Connect two whiteboard nodes with a labelled arrow",
      parameters: Type.Object({
        fromSemanticId: Type.String(),
        toSemanticId: Type.String(),
        label: Type.Optional(Type.String()),
        kind: Type.Optional(Type.String({ description: "edge kind, e.g. voice, data, http" })),
      }),
      async execute(_id, params: any) {
        const { revision, edge } = hub.store.addArrow(sessionId(), {
          fromSemanticId: params.fromSemanticId as string,
          toSemanticId: params.toSemanticId as string,
          label: params.label as string | undefined,
          kind: params.kind as string | undefined,
        });
        return {
          content: [
            text(
              `Connected ${edge.from} → ${edge.to}${edge.label ? ` ("${edge.label}")` : ""} (revision ${revision.revisionId}).`,
            ),
          ],
          details: { edge, revision },
        };
      },
    },

    {
      name: "whiteboard_apply_excalidraw_patch",
      label: "Whiteboard: Apply Patch",
      description:
        "Apply low-level Excalidraw element operations (add/update/delete) with optimistic concurrency. Provide the current baseRevisionId from whiteboard_get_context. Operations is an array of {op, element?, elementId?, set?}.",
      promptSnippet: "Apply precise add/update/delete element operations to the whiteboard",
      promptGuidelines: [
        "Use whiteboard_apply_excalidraw_patch only with a fresh baseRevisionId from whiteboard_get_context; never delete elements you cannot identify.",
      ],
      parameters: Type.Object({
        baseRevisionId: Type.String(),
        rationale: Type.Optional(Type.String()),
        operations: Type.Array(
          Type.Object({
            op: StringEnum(["add", "update", "delete"] as const),
            elementId: Type.Optional(Type.String()),
            element: Type.Optional(Type.Unknown()),
            set: Type.Optional(Type.Unknown()),
          }),
        ),
      }),
      async execute(_id, params: any) {
        const { revision, applied } = hub.store.applyPatch(sessionId(), {
          baseRevisionId: params.baseRevisionId as string,
          rationale: params.rationale as string | undefined,
          operations: params.operations as unknown as PatchOperation[],
        });
        return {
          content: [text(`Applied ${applied} operation(s). New revision ${revision.revisionId}.`)],
          details: { revision, applied },
        };
      },
    },

    {
      name: "whiteboard_cleanup_scene",
      label: "Whiteboard: Cleanup",
      description:
        "Compact the scene: remove deleted elements and reset transient app state. Keeps exported files when preserveExports is true.",
      promptSnippet: "Compact the whiteboard scene, removing stale/deleted elements",
      parameters: Type.Object({
        baseRevisionId: Type.Optional(Type.String()),
        preserveExports: Type.Optional(Type.Boolean()),
      }),
      async execute(_id, params: any) {
        const { revision, removed } = hub.store.cleanupScene(sessionId(), {
          baseRevisionId: params.baseRevisionId as string | undefined,
          preserveExports: (params.preserveExports as boolean | undefined) ?? true,
        });
        return {
          content: [text(`Cleaned scene: removed ${removed} stale element(s). New revision ${revision.revisionId}.`)],
          details: { revision, removed },
        };
      },
    },

    {
      name: "whiteboard_render_snapshot",
      label: "Whiteboard: Render Snapshot",
      description:
        "Render the whiteboard to a PNG for visual reasoning when layout, overlap or ambiguity matters. Returns the image so you can inspect it directly.",
      promptSnippet: "Render the whiteboard to a PNG for visual reasoning",
      promptGuidelines: [
        "Use whiteboard_render_snapshot when the scene is visually ambiguous before making a destructive edit.",
      ],
      parameters: Type.Object({
        scope: Type.Optional(StringEnum(SCOPES)),
        reason: Type.Optional(Type.String()),
      }),
      async execute(_id, params: any) {
        const scope = (params.scope as SnapshotScope | undefined) ?? "viewport";
        const result = await renderSnapshot(hub, {
          sessionId: sessionId(),
          scope,
          reason: (params.reason as string | undefined) ?? "layout_or_ambiguous_scene",
        });
        if (!result.available) {
          return {
            content: [text(`Snapshot unavailable: ${result.error ?? "unknown reason"}.`)],
            details: { result },
          };
        }
        const content: ToolResult["content"] = [
          text(`Rendered ${scope} snapshot via ${result.via}${result.path ? ` (saved to ${result.path})` : ""}.`),
        ];
        const decoded = result.dataUrl?.match(/^data:(image\/[^;]+);base64,(.*)$/);
        if (decoded) {
          content.push({ type: "image", mimeType: decoded[1]!, data: decoded[2]! });
        }
        return { content, details: { result } };
      },
    },

    {
      name: "whiteboard_explain_selection",
      label: "Whiteboard: Explain Selection",
      description:
        "Return the semantic context for the elements the user has selected on the canvas (or the whole scene if nothing is selected).",
      promptSnippet: "Explain the user's current whiteboard selection",
      parameters: Type.Object({}),
      async execute() {
        const packet = hub.store.getContextPacket(sessionId(), { scope: "selected" });
        const scope = packet.nodes.length ? "selected" : "all";
        const full = scope === "all" ? hub.store.getContextPacket(sessionId(), { scope: "all" }) : packet;
        return {
          content: [text(JSON.stringify(full, null, 2))],
          details: { packet: full, scope },
        };
      },
    },
  ];
}

/** Register the Pi whiteboard tool contract on the visible interactive Pi session. */
export function registerWhiteboardTools(pi: ExtensionAPI, hub: Hub): void {
  for (const tool of createWhiteboardTools(hub)) pi.registerTool(tool);
}
