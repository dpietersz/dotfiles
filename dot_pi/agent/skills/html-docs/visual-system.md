# Visual System

Visuals are part of the documentation contract. Use them to make structure, sequence, trade-offs, and meaning easier to grasp. A good visual should let the reader understand something faster than prose alone.

## Visual Planning Comes Before Final HTML

Before writing final prose, create a short visual plan:

| Reader question | Best visual | Placement | Why prose is weaker |
| --- | --- | --- | --- |
| What are the moving parts? | Generated architecture/context image | Hero or Context | Prose hides shape. |
| How does work flow? | Inline SVG sequence + optional generated flow image | Workflow section | Steps alone hide concurrency/branches. |
| What should I compare? | Matrix/table | Trade-offs section | Paragraphs hide criteria. |
| Where do files/capabilities live? | HTML map/grid/tree | Reference/Context section | Lists hide grouping. |

Only build visuals that answer a real reader question.

## Two Visual Layers

1. **Generated images** — memorable conceptual/spatial mental model. Use for system context, architecture shape, user journeys, product concept, operational flow, threat/risk landscape, roadmap shape.
2. **Inline HTML/SVG** — precise facts. Use for schemas, sequence diagrams, state machines, decision trees, timelines, tables, API contracts, file maps.

Best docs use both: generated image for overview, inline components for exact detail. The generated image creates the mental picture; nearby HTML/SVG/table makes it actionable.

## Visual Policy

- `none` — avoid generated images unless user explicitly asks.
- `optional` — use images only when a concept is spatial/visual.
- `strategic` — target 2-4 generated images when the doc has enough substance. Use fewer only when additional images would be redundant. Pair each generated image with at least one precise inline visual/table/list nearby.
- `required` — generate declared required slots unless key/tool missing; stop and report blocker if impossible.

## Image Slot Rules

Each template can define `image_slots`. Evaluate every slot:

- What reader question does this image answer?
- Is the concept spatial, structural, temporal, emotional, or topological?
- Would a reader understand faster with a visual?
- Would inline SVG be better because precision matters?
- Is this duplicate of an existing figure?

Generate only earned images. Avoid visual filler.

## Useful Generated Image Patterns

- **System map** — actors, core, extensions, storage, external services, boundaries.
- **Workflow map** — start → phases → feedback loops → outputs.
- **Layer cake** — foundations at bottom, orchestration in middle, user-facing outcomes at top.
- **Trade-off landscape** — competing forces and chosen balance point.
- **Before/after transformation** — painful current state → intervention → improved state.
- **Capability constellation** — groups of capabilities with relationships and center of gravity.

Avoid generic hub-and-spoke if it does not reveal relationships, sequence, boundaries, or trade-offs.

## Shared Style Brief

Before image calls, write one shared style brief and reuse it verbatim:

- palette aligned to document CSS
- background/light-dark preference
- diagram conventions for nodes/arrows/zones
- visual density
- label limit
- negation list: no tiny text, no code blocks, no UI chrome unless requested, no stock-photo look

## Placement

- Hero image: after summary, before detail, only if it establishes the document's mental model.
- Context/architecture images: before precise tables.
- Journey/process images: before numbered steps.
- Risk/decision images: near trade-off matrix.
- Section images: directly before the section they unlock. Do not put all visuals at the top.

## Minimum Visual Bar

For `strategic` docs, include:

1. One generated overview image OR a strong inline overview SVG.
2. One precise structural visual: map, tree, matrix, timeline, or SVG flow.
3. One section-level visual where the reader would otherwise hold many relationships in working memory.

If you cannot meet this bar, ask for more source material or explain why the doc is intentionally text-first.

## Accessibility

Every visual needs:

- `alt` describing meaning, not “diagram”
- caption explaining why it matters
- nearby text containing critical facts so image is not sole source of truth
