# HTML Authoring

Write final documentation as readable HTML using Tailwind CSS from the official browser CDN. Prefer Tailwind utility classes, typography-style prose containers, and reusable component patterns over large hand-written CSS.

## Document Shell

Use this Tailwind shell unless selected template provides a stronger one. Tailwind CDN is explicitly approved for generated docs.

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{{title}}</title>
  <meta name="doc-template" content="{{template_id}}">
  <meta name="diataxis" content="{{quadrants}}">
  <meta name="doc-status" content="draft">
  <meta name="audience" content="{{audience}}">
  <meta name="generated-by" content="pi html-docs skill">
  <script type="application/json" id="html-docs-metadata">{"template":"{{template_id}}","diataxis":[{{quadrants_json}}],"status":"draft","visuals":[]}</script>
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
  <style type="text/tailwindcss">
    @theme {
      --color-doc-bg: #0a0e1a;
      --color-doc-panel: #111827;
      --color-doc-panel-2: #172033;
      --color-doc-line: #263244;
      --color-doc-ink: #f8fafc;
      --color-doc-muted: #94a3b8;
      --color-doc-accent: #60a5fa;
      --color-doc-cyan: #22d3ee;
      --color-doc-amber: #f59e0b;
      --color-doc-green: #34d399;
      --color-doc-red: #f87171;
    }
    @layer components {
      .doc-shell { @apply min-h-screen bg-doc-bg text-doc-ink antialiased; }
      .doc-wrap { @apply mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14; }
      .doc-hero { @apply overflow-hidden rounded-3xl border border-doc-line bg-gradient-to-br from-doc-panel via-doc-panel to-blue-950/40 p-8 shadow-2xl shadow-black/20 lg:p-12; }
      .doc-kicker { @apply text-sm font-bold uppercase tracking-[0.22em] text-doc-cyan; }
      .doc-title { @apply mt-3 text-4xl font-black tracking-tight text-white md:text-6xl; }
      .doc-summary { @apply mt-5 max-w-4xl text-lg leading-8 text-slate-200; }
      .doc-section { @apply my-6 rounded-2xl border border-doc-line bg-doc-panel/90 p-6 shadow-xl shadow-black/10 lg:p-8; }
      .doc-section-title { @apply mb-4 border-b border-doc-line pb-3 text-2xl font-bold tracking-tight text-doc-cyan; }
      .doc-card { @apply rounded-2xl border border-doc-line bg-doc-panel-2/80 p-5 shadow-lg shadow-black/10; }
      .doc-grid { @apply grid gap-4 md:grid-cols-2 xl:grid-cols-3; }
      .doc-badge { @apply inline-flex items-center rounded-full border border-doc-line bg-white/5 px-3 py-1 text-xs font-medium text-doc-muted; }
      .doc-callout { @apply rounded-2xl border-l-4 border-doc-accent bg-blue-500/10 p-4 text-slate-200; }
      .doc-callout-warning { @apply border-doc-amber bg-amber-500/10; }
      .doc-callout-risk { @apply border-doc-red bg-red-500/10; }
      .doc-callout-ok { @apply border-doc-green bg-emerald-500/10; }
      .doc-figure { @apply my-6 overflow-hidden rounded-2xl border border-doc-line bg-black/20 p-3; }
      .doc-figure img, .doc-figure svg { @apply w-full rounded-xl; }
      .doc-figcaption { @apply mt-3 px-1 text-sm leading-6 text-doc-muted; }
      .doc-table { @apply w-full border-collapse overflow-hidden rounded-xl text-left text-sm; }
      .doc-table th { @apply border-b border-doc-line bg-white/5 px-4 py-3 font-semibold text-doc-cyan; }
      .doc-table td { @apply border-b border-doc-line px-4 py-3 align-top text-slate-200; }
      .doc-prose { @apply max-w-none text-slate-200; }
      .doc-prose p { @apply my-4 leading-8; }
      .doc-prose ul { @apply my-4 list-disc space-y-2 pl-6; }
      .doc-prose ol { @apply my-4 list-decimal space-y-2 pl-6; }
      .doc-prose code { @apply rounded-md border border-doc-line bg-slate-950 px-1.5 py-0.5 text-sm text-doc-amber; }
      .doc-prose pre { @apply overflow-auto rounded-2xl border border-doc-line bg-slate-950 p-4 text-sm text-slate-100; }
      .doc-link { @apply text-doc-accent underline decoration-doc-accent/40 underline-offset-4 hover:text-doc-cyan; }
    }
  </style>
</head>
<body class="doc-shell"><main class="doc-wrap">{{content}}</main></body>
</html>
```

## Components To Prefer

- `<nav class="toc">` for table of contents.
- `<section data-doc-part="...">` for major sections.
- `<aside class="callout assumption">` for assumptions.
- `<aside class="callout risk">` for risks/gotchas.
- `<details><summary>...</summary>...</details>` for optional depth.
- `<table>` for comparisons, requirements, API contracts.
- `<dl>` for glossaries.
- `<figure>` with inline SVG or generated images.
- `<div class="visual-detail">` for section-level maps, trees, timelines, and flow cards.
- `<pre><code>` for commands, payloads, examples.

## Visual Density Rule

Do not rely on one hero image. For strategic docs, distribute visuals through the document:

- overview image in hero or context
- inline SVG/map in mental model or architecture section
- flow/timeline near process explanation
- matrix/table near trade-offs or decisions

Each visual must be followed by prose that explains the insight and a precise artifact (table/list/SVG) that makes it actionable.

## Metadata Block

Generated docs must include both meta tags and JSON block. Server reads these without needing template files.
