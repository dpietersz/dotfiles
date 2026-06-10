Update the existing whiteboard safely.

Process:
1. Call whiteboard_get_context first. Identify the exact semantic node(s) and
   edge(s) the user means. If the target is ambiguous, ask one short clarifying
   question or call whiteboard_render_snapshot before editing.
2. Make the smallest change that satisfies the request:
   - New structure: whiteboard_add_shape / whiteboard_add_arrow.
   - Precise edits or deletions: whiteboard_apply_excalidraw_patch with the
     current baseRevisionId. Never delete elements you cannot identify.
3. If the scene has accumulated stale/deleted elements, you may call
   whiteboard_cleanup_scene (preserveExports: true) to compact it.

Confirm the change in one spoken sentence, naming what changed.
