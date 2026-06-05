# Quality Gates

Use these checks before and after authoring.

## Sufficiency Gate

Read selected template `required_inputs`. If any are missing, decide whether they can be safely inferred.

Ask 3-5 questions when missing facts would create hollow docs:

- audience and downstream use
- scope and non-goals
- success criteria
- source material or repo area
- constraints, risks, stakeholders, platform, environment

Push back directly:

> I can make this look good, but it will not be useful without X/Y/Z. Answer these first or confirm I should proceed with assumptions.

Proceed only when one is true:

- user answers enough
- user explicitly approves assumptions
- missing items are non-blocking and can be listed as Open Questions

## Substance Checks

- Every major section contains concrete nouns: people, systems, files, actions, metrics, decisions, examples.
- Claims are sourced, obvious, or tagged as assumptions.
- Scope boundaries are explicit.
- Open questions are phrased so a human can answer them.
- Success criteria are observable.
- Risks/constraints are included when they affect decisions.

## Diátaxis Checks

- Tutorial: guided safe path, visible results, minimal explanation, no options overload.
- How-to: real-world goal, action sequence, competent reader, no teaching digressions.
- Reference: complete facts, neutral tone, mirrors system structure, easy lookup.
- Explanation: context, why, trade-offs, alternatives, mental models.

## HTML Checks

- Valid HTML document with `<!doctype html>`.
- `<title>`, `<h1>`, useful headings, and landmarks (`header`, `main`, `nav`, `article`).
- Tailwind browser CDN is allowed and preferred: `https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4`.
- Keep custom CSS minimal; prefer Tailwind utilities and `@layer components` classes.
- Relative links/assets.
- Images have meaningful alt text.
- Metadata exists:
  - `doc-template`
  - `diataxis`
  - `doc-status`
  - `audience`
  - `generated-by`
- Include JSON metadata block for dashboard discovery.

## Visual Checks

- Layout uses Tailwind component classes (`doc-hero`, `doc-section`, `doc-card`, `doc-figure`, `doc-table`, `doc-prose`) or equivalent utilities.
- Generated images explain shape/meaning, not decoration.
- Every generated image answers a named reader question.
- Strategic docs include multiple visuals when useful, not a single gimmick hero.
- Inline SVG/tables capture precise details near each generated overview.
- No image contains dense prose or more than 10 labels.
- Visuals use consistent palette and captions.
- Captions state the insight or reader question.
- If an image does not make the document clearer, remove it and use a stronger inline visual instead.
