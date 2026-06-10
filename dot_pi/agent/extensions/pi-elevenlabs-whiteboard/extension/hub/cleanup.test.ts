import { test } from "node:test";
import assert from "node:assert/strict";
import { compileContextPacket, elementCount, sceneChecksum, type ExScene } from "./cleanup.ts";

function scene(): ExScene {
  return {
    type: "excalidraw",
    elements: [
      // Service rectangle with semantic data + bound label
      {
        id: "rect1",
        type: "rectangle",
        x: 0,
        y: 0,
        width: 200,
        height: 90,
        boundElements: [{ id: "txt1", type: "text" }],
        customData: { semanticId: "svc.api", semanticType: "api", title: "API", summary: "edge" },
      },
      { id: "txt1", type: "text", text: "API", containerId: "rect1" },
      // Database ellipse, label derived from bound text
      {
        id: "ell1",
        type: "ellipse",
        x: 400,
        y: 0,
        width: 160,
        height: 80,
        boundElements: [{ id: "txt2", type: "text" }],
      },
      { id: "txt2", type: "text", text: "Postgres", containerId: "ell1" },
      // Arrow API -> DB bound on both ends
      {
        id: "arr1",
        type: "arrow",
        startBinding: { elementId: "rect1" },
        endBinding: { elementId: "ell1" },
        boundElements: [{ id: "txt3", type: "text" }],
      },
      { id: "txt3", type: "text", text: "reads", containerId: "arr1" },
      // Deleted element should be dropped
      { id: "ghost", type: "rectangle", isDeleted: true, x: 0, y: 0, width: 10, height: 10 },
      // Decorative unbound arrow should NOT become an edge
      { id: "arr2", type: "arrow", x: 0, y: 0 },
      // Standalone note text
      { id: "note1", type: "text", text: "remember caching" },
    ],
    appState: {
      scrollX: 12,
      scrollY: -8,
      zoom: { value: 0.8 },
      selectedElementIds: { rect1: true },
    },
    files: {
      f1: { id: "f1", mimeType: "image/png", dataURL: "data:image/png;base64,AAAA" },
    },
  };
}

test("elementCount ignores deleted elements", () => {
  assert.equal(elementCount(scene()), 8);
});

test("compiles nodes with semantic ids and titles", () => {
  const { packet } = compileContextPacket(scene(), { revisionId: "wb_1" });
  const api = packet.nodes.find((n) => n.id === "svc.api");
  assert.ok(api, "api node present");
  assert.equal(api?.kind, "api");
  assert.equal(api?.title, "API");
  // bound label absorbed, not a separate node
  assert.ok(!packet.nodes.some((n) => n.elementIds.includes("txt1") && n.id !== "svc.api"));
  // database label derived from bound text
  const db = packet.nodes.find((n) => n.title === "Postgres");
  assert.ok(db, "database node present with derived label");
  // standalone note becomes a node
  assert.ok(packet.nodes.some((n) => n.title === "remember caching"));
});

test("bound arrow becomes an edge; unbound arrow does not", () => {
  const { packet } = compileContextPacket(scene(), { revisionId: "wb_1" });
  assert.equal(packet.edges.length, 1);
  const edge = packet.edges[0]!;
  assert.equal(edge.from, "svc.api");
  assert.equal(edge.label, "reads");
  assert.ok(packet.nodes.find((n) => n.id === edge.to)?.title === "Postgres");
});

test("files are reduced to metadata (no base64)", () => {
  const { packet } = compileContextPacket(scene(), { revisionId: "wb_1" });
  assert.equal(packet.files?.length, 1);
  assert.equal(packet.files?.[0]?.mimeType, "image/png");
  const json = JSON.stringify(packet);
  assert.ok(!json.includes("base64"), "no base64 leaks into packet");
  assert.ok(!json.includes("AAAA"), "no dataURL payload leaks");
});

test("viewport and selection are captured", () => {
  const { packet } = compileContextPacket(scene(), { revisionId: "wb_1" });
  assert.deepEqual(packet.viewport, { x: 12, y: -8, zoom: 0.8 });
  assert.deepEqual(packet.selected, ["svc.api"]);
});

test("scope=selected restricts to selected nodes", () => {
  const { packet } = compileContextPacket(scene(), { revisionId: "wb_1", scope: "selected" });
  assert.equal(packet.nodes.length, 1);
  assert.equal(packet.nodes[0]?.id, "svc.api");
  assert.equal(packet.edges.length, 0);
});

test("checksum is stable across transient noise but changes on real edits", () => {
  const a = scene();
  const b = scene();
  // Mutate only transient noise on b
  (b.elements![0] as unknown as Record<string, unknown>).seed = 999;
  (b.elements![0] as unknown as Record<string, unknown>).versionNonce = 123;
  assert.equal(sceneChecksum(a), sceneChecksum(b));
  // Real edit changes checksum
  b.elements![0]!.width = 999;
  assert.notEqual(sceneChecksum(a), sceneChecksum(b));
});
