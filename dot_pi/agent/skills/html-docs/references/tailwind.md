# Tailwind Reference

Use Tailwind CSS for generated HTML docs.

## Local Docs

Tailwind docs are cached globally at:

`~/.pi/.ai/ref-docs/tailwindcss.com/`

Start with:

`~/.pi/.ai/ref-docs/tailwindcss.com/_index.md`

Read specific pages when needed, especially:

- `installation/play-cdn.md` — browser/CDN usage
- `styling-with-utility-classes.md` — utility-first patterns
- `hover-focus-and-other-states.md` — interactive states
- `responsive-design.md` — responsive breakpoints
- `dark-mode.md` — dark mode
- `theme.md` / `colors.md` — theme tokens and palettes
- `adding-custom-styles.md` / `functions-and-directives.md` — custom CSS and `@theme`, `@layer`
- `typography-plugin.md` — prose/typography patterns when available

## Dynamic Use Rule

Load Tailwind docs when:

- user asks to change styling/theme/layout
- generating or modifying shared component classes
- using unfamiliar Tailwind v4 browser features
- deciding between utilities, `@layer components`, or theme tokens

Do not load Tailwind docs for every document; use existing skill guidance unless styling is the task.

## Preferred Generated-Doc Pattern

- Include Tailwind browser build: `https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4`
- Define a compact `@theme` block for document colors.
- Define reusable document components in `@layer components`.
- Use component classes plus utilities in templates.
- Keep custom raw CSS minimal.
