import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { WhiteboardStore } from "./whiteboard-store.ts";

function freshStore(): { store: WhiteboardStore; dir: string } {
  const dir = mkdtempSync(join(tmpdir(), "piwb-test-"));
  return { store: new WhiteboardStore({ dataDir: dir }), dir };
}

test("addShape creates a node and bumps revision", () => {
  const { store, dir } = freshStore();
  try {
    assert.equal(store.getRevisionId("s1"), "wb_0");
    const { revision, node } = store.addShape("s1", { kind: "service", title: "Pi Hub", summary: "owns prompts" });
    assert.equal(revision.revisionId, "wb_1");
    assert.equal(node.title, "Pi Hub");
    assert.equal(revision.elementCount, 2); // shape + label
    const packet = store.getContextPacket("s1");
    assert.equal(packet.nodes.length, 1);
    assert.equal(packet.nodes[0]?.kind, "service");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("addArrow connects two shapes by semantic id", () => {
  const { store, dir } = freshStore();
  try {
    const a = store.addShape("s1", { kind: "external", title: "ElevenLabs" });
    const b = store.addShape("s1", { kind: "service", title: "Pi Hub" });
    const { edge } = store.addArrow("s1", {
      fromSemanticId: a.node.id,
      toSemanticId: b.node.id,
      label: "Custom LLM",
      kind: "voice",
    });
    assert.equal(edge.from, a.node.id);
    assert.equal(edge.to, b.node.id);
    const packet = store.getContextPacket("s1");
    assert.equal(packet.edges.length, 1);
    assert.equal(packet.edges[0]?.label, "Custom LLM");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("addArrow rejects unknown semantic id", () => {
  const { store, dir } = freshStore();
  try {
    store.addShape("s1", { kind: "service", title: "A" });
    assert.throws(
      () => store.addArrow("s1", { fromSemanticId: "nope", toSemanticId: "alsonope" }),
      /no element with semanticId/,
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("applyPatch enforces optimistic concurrency on baseRevisionId", () => {
  const { store, dir } = freshStore();
  try {
    store.addShape("s1", { kind: "service", title: "A" }); // wb_1
    assert.throws(
      () => store.applyPatch("s1", { baseRevisionId: "wb_0", operations: [] }),
      /stale baseRevisionId/,
    );
    const { revision } = store.applyPatch("s1", {
      baseRevisionId: "wb_1",
      operations: [
        { op: "add", element: { id: "x1", type: "rectangle", x: 0, y: 0, width: 10, height: 10 } },
      ],
      rationale: "add box",
    });
    assert.equal(revision.revisionId, "wb_2");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("applyPatch delete marks element deleted and cleanup removes it", () => {
  const { store, dir } = freshStore();
  try {
    const a = store.addShape("s1", { kind: "service", title: "A" }); // wb_1, 2 elements
    const shapeId = a.node.elementIds[0]!;
    store.applyPatch("s1", {
      baseRevisionId: "wb_1",
      operations: [{ op: "delete", elementId: shapeId }],
    }); // wb_2
    // deleted element no longer shows up as a node
    let packet = store.getContextPacket("s1");
    assert.ok(!packet.nodes.some((n) => n.elementIds.includes(shapeId)));
    const { removed } = store.cleanupScene("s1", { baseRevisionId: "wb_2", preserveExports: true });
    assert.ok(removed >= 1);
    packet = store.getContextPacket("s1");
    assert.equal(packet.revisionId, "wb_3");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("setSceneFromClient ignores no-op edits but records real changes", () => {
  const { store, dir } = freshStore();
  try {
    store.addShape("s1", { kind: "service", title: "A" });
    const scene = store.getScene("s1");
    // identical scene -> no new revision
    const noop = store.setSceneFromClient("s1", JSON.parse(JSON.stringify(scene)), [], { x: 0, y: 0, zoom: 1 });
    assert.equal(noop, null);
    // real edit
    const edited = JSON.parse(JSON.stringify(scene));
    edited.elements[0].width = 333;
    const rev = store.setSceneFromClient("s1", edited, [], { x: 0, y: 0, zoom: 1 });
    assert.ok(rev);
    assert.equal(rev?.author, "user");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("scenes persist across store instances", () => {
  const dir = mkdtempSync(join(tmpdir(), "piwb-persist-"));
  try {
    const s1 = new WhiteboardStore({ dataDir: dir });
    s1.addShape("sess", { kind: "service", title: "Persisted" });
    const s2 = new WhiteboardStore({ dataDir: dir });
    const packet = s2.getContextPacket("sess");
    assert.equal(packet.nodes.length, 1);
    assert.equal(packet.nodes[0]?.title, "Persisted");
    assert.equal(s2.getRevisionId("sess"), "wb_1");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
