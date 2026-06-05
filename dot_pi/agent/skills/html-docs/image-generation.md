# Image Generation

Use the `openai_image` tool when template visual policy and content justify generated images. Generated images must explain structure, flow, boundaries, forces, or relationships. Do not create generic decorative hero art.

## Tool Contract

Call `openai_image` with:

```json
{
  "action": "generate",
  "prompt": "<shared style brief>\n\n<slot-specific composition>",
  "outputPath": "docs/assets/<slug>/<slot>.png",
  "size": "1536x1024",
  "quality": "medium",
  "outputFormat": "png",
  "timeoutSec": 180
}
```

Use `quality: high` only for final/high-stakes assets. Use `low` for drafts.

## Prompt Shape

```text
Reader question this image answers: <one concrete question>

Shared style brief:
- Clean editorial technical illustration, not a screenshot.
- Palette: background #0A0E1A, panels #111827, ink #F8FAFC, accent #60A5FA, cyan #22D3EE, amber #F59E0B, green #34D399, red #F87171.
- Use simple labeled nodes, thick arrows, generous spacing, clear grouping, and visible boundaries.
- Maximum 8 text labels. These labels are the complete set: [...].
- No tiny text, no paragraphs, no code, no watermarks, no photorealistic people, no clutter, no vague hub-and-spoke unless boundaries/flows are meaningful.

Composition:
- Show ...
- Emphasize ...
- Layout ...
- Make the relationship/sequence/trade-off obvious by ...
```

The prompt must name what the visual teaches. If you cannot write the reader question, do not generate the image.

## Multi-Image Strategy

For `strategic` documents, consider 2-4 images:

1. **Overview** — the whole system/problem shape.
2. **Flow** — lifecycle, sequence, pipeline, or process.
3. **Trade-off/decision** — competing forces or why this design exists.
4. **Deep section image** — one complex section that benefits from a visual.

Do not generate multiple images that say the same thing. Each image needs a distinct reader question and placement.

## Parallelism

When generating multiple independent images, call `openai_image` with `n` only when prompts are same. For different slots, separate tool calls may run in parallel if tool execution supports it. Do not wait between unrelated images.

## Failure Handling

- If `OPENAI_API_KEY` missing: ask user to set it or continue without generated images.
- If moderation blocks prompt: revise prompt to be more abstract/technical.
- If generation fails and visual is optional: continue with inline SVG fallback and note it.
- If generation fails and visual is required: stop and report blocker.

## HTML Embed

```html
<figure data-image-slot="system-context">
  <img src="../assets/my-doc/system-context.png" alt="System context showing users, app, API, data store, and external provider boundaries.">
  <figcaption><strong>Reader question:</strong> What talks to what? This overview gives the reader the system shape before the exact contracts below.</figcaption>
</figure>
```

Captions should state the reader question or insight, not just name the image.
