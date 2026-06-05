---
name: html-docs
description: Create high-quality HTML documentation with Diátaxis routing, extensible HTML-native templates, rich visual layout, optional generated images, and pushback when input is too thin. Use when creating PRDs, architecture docs, project overviews, tutorials, how-to guides, reference docs, explanations, research reports, specs, or any document that should be readable as HTML instead of markdown.
---

# HTML Docs

Create useful, human-readable documentation as browser-ready HTML. Use extensible `.doc.html` templates, Diátaxis intent, rich HTML components, and generated images when they improve understanding.

## Core Workflow

1. **Route** — Load `template-router.md`. Scan `templates/*.doc.html` frontmatter only. Pick one template by `use_when`, `avoid_when`, `diataxis`, and required inputs.
2. **Gate** — Load `quality-gates.md`. If selected template lacks meat, ask 3-5 sharp questions before writing. Explain which missing facts would make the doc weak.
3. **Hydrate** — Read only the selected template body. Do not load all templates.
4. **Research** — For repo/source-backed docs, gather focused context. Delegate broad exploration when useful; compact findings before authoring.
5. **Author** — Load `html-authoring.md`. Write a Tailwind-powered `.html` document using semantic HTML, Tailwind CDN, reusable component classes, valid metadata, accessible structure, and relative assets. Load `references/tailwind.md` and cached Tailwind docs only when styling/layout decisions need deeper reference.
6. **Compose visuals first** — Load `visual-system.md` before final authoring when `visual_policy` is `strategic`/`required`. Build a visual plan: document-level mental model, section-level visuals, image slots, inline diagrams, and tables. Visuals are explanatory devices, not decoration.
7. **Generate earned images** — Load `image-generation.md`. For `strategic` docs, target 2-4 generated images when the content has enough spatial/structural/temporal concepts. Use `openai_image` for conceptual/spatial visuals and inline SVG/HTML for exact details.
8. **Validate** — Apply global and template-specific checks. Report file path, template, quadrant, assumptions, open questions, generated assets, and preview command.

## Output Rules

- Produce HTML as final artifact. Do not create markdown unless user explicitly asks.
- Use Tailwind CSS browser CDN for generated docs unless the user requires offline/self-contained output.
- Generated docs use valid HTML metadata, not YAML frontmatter.
- Template files may use YAML frontmatter because they are not served directly as final docs.
- Default output path follows selected template `output_path_pattern`; otherwise use `docs/{slug}.html`.
- Assets live under `docs/assets/{slug}/` unless repo convention says otherwise.
- A strategic visual document should normally contain multiple useful visuals: at least one generated overview plus section-level visuals where diagrams materially reduce cognitive load.

## Context Discipline

- Scan template frontmatter with shell tools; hydrate one chosen template.
- Load optional references only when needed.
- Treat templates as expert priors, not checklists. Drop sections that do not earn their place; add sections the document needs.

⛔ ENFORCEMENT: Do not produce pretty but empty HTML. If required inputs are missing and cannot be responsibly inferred, ask questions first.

⛔ ENFORCEMENT: Do not use generated images as gimmicks. Every generated image must answer a specific reader question and be paired with nearby precise HTML/SVG/table detail.
