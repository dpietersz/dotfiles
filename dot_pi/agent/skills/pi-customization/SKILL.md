---
name: pi-customization
description: >
  Customize pi coding agent: create/modify extensions (TypeScript tools, commands, event handlers, UI components),
  themes (JSON color schemes), skills (markdown capability packages), prompt templates, keybindings, settings,
  and pi packages. Use when the user asks to customize, extend, configure, or theme pi, or wants to create
  extensions, tools, commands, shortcuts, skills, prompt templates, themes, or packages for pi.
---

# Pi Customization Skill

You are helping the user customize pi, the coding agent harness you are running in. This skill gives you
the knowledge to create and modify all pi customization points.

## MANDATORY: Fetch ALL Documentation Before Acting

This skill does NOT include inline reference documentation. All docs and examples live upstream in the
pi-mono repository and **must be fetched dynamically** using the `WebFetch` tool every time this skill runs.
**Never assume you know the content — always fetch everything first.**

### Step 1: Discover All Docs

Fetch the upstream directory listing to get all available documentation files:

`https://api.github.com/repos/badlogic/pi-mono/contents/packages/coding-agent/docs`

This returns a JSON array. Filter for entries where `type` is `"file"` and `name` ends with `.md`.
Each entry has a `download_url` field — that is the raw URL to fetch the doc content.

**If the fetch fails or the URL no longer exists, STOP and alert the user:**
> "⚠️ The pi documentation location has changed. The expected API endpoint
> `https://api.github.com/repos/badlogic/pi-mono/contents/packages/coding-agent/docs`
> is no longer accessible. The upstream repository may have been restructured.
> Please verify the new docs location at https://github.com/badlogic/pi-mono and update this
> skill file at `~/.pi/agent/skills/pi-customization/SKILL.md` with the correct URL."

### Step 2: Fetch Every Doc

Use `WebFetch` to fetch **every** `.md` file discovered in Step 1 via its `download_url`.
Fetch them all — do not skip any. You need the full documentation to give accurate guidance.

### Step 3: Proceed With the Task

Only after all docs have been fetched and read, proceed to help the user with their customization task.

### Examples

Example extensions and SDK examples are fetched dynamically from GitHub. **Always fetch a relevant example
before implementing something similar.**

#### Extension examples

1. **List available examples** — fetch the directory listing:
   `https://api.github.com/repos/badlogic/pi-mono/contents/packages/coding-agent/examples/extensions`

2. **Fetch a single-file example** (e.g., `hello.ts`):
   `https://raw.githubusercontent.com/badlogic/pi-mono/main/packages/coding-agent/examples/extensions/hello.ts`

3. **Fetch a directory example** (e.g., `plan-mode/`): first list its contents via the API, then fetch each file:
   - List: `https://api.github.com/repos/badlogic/pi-mono/contents/packages/coding-agent/examples/extensions/plan-mode`
   - Then fetch individual files via their `download_url`

4. **Extension examples README** (describes all examples):
   `https://raw.githubusercontent.com/badlogic/pi-mono/main/packages/coding-agent/examples/extensions/README.md`

#### SDK examples

1. **List available SDK examples**:
   `https://api.github.com/repos/badlogic/pi-mono/contents/packages/coding-agent/examples/sdk`

2. **Fetch a SDK example** (e.g., `01-minimal.ts`):
   `https://raw.githubusercontent.com/badlogic/pi-mono/main/packages/coding-agent/examples/sdk/01-minimal.ts`

3. **SDK examples README**:
   `https://raw.githubusercontent.com/badlogic/pi-mono/main/packages/coding-agent/examples/sdk/README.md`

## Important: Check Patterns Before Creating

The user has established patterns for common customization tasks. **Always check patterns first** —
if one exists for what you're doing, follow it exactly.

| Pattern | When to use |
|---------|-------------|
| [tools-system.md](patterns/tools-system.md) | Adding a new custom tool (webfetch, websearch, etc.) |
| [fabric-tools.md](patterns/fabric-tools.md) | Managing Fabric AI tools: adding/removing patterns, sources, pipelines, updating config |
| [docsfetch.md](patterns/docsfetch.md) | Documentation fetcher: scraping websites or GitHub repos into local ref-docs, freshness/caching, ref-docs companion extension |
| [subagent-system.md](patterns/subagent-system.md) | Subagent system: agent definitions, async spawning, live widgets, focus navigation, /sub command |

Patterns describe file layout, conventions, and a working reference implementation.
When a pattern exists, read it **instead of** starting from scratch with the reference docs.
Only fall back to fetching upstream docs for things not covered by a pattern.

## Overview of Customization Points

### 1. Extensions (most powerful)

TypeScript modules in `~/.pi/agent/extensions/` (global) or `.pi/extensions/` (project).
Can do everything: custom tools, commands, shortcuts, event handlers, UI, providers.

```typescript
import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { Type } from "@sinclair/typebox";

export default function (pi: ExtensionAPI) {
  pi.registerTool({ name: "my_tool", ... });
  pi.registerCommand("my-cmd", { ... });
  pi.registerShortcut("ctrl+shift+x", { ... });
  pi.on("tool_call", async (event, ctx) => { ... });
}
```

Key capabilities:
- **Custom tools** - `pi.registerTool()` with TypeBox schemas (use `StringEnum` from `@mariozechner/pi-ai` for enums)
- **Commands** - `pi.registerCommand()` with optional argument autocompletion
- **Events** - `pi.on()` for lifecycle hooks (session, agent, tool, input events)
- **UI** - `ctx.ui.select/confirm/input/notify/custom()`, `setWidget`, `setStatus`, `setFooter`
- **State** - `pi.appendEntry()` for persistence, reconstruct from `ctx.sessionManager.getBranch()`
- **Tools management** - `pi.getActiveTools()`, `pi.setActiveTools()`
- **Model control** - `pi.setModel()`, `pi.setThinkingLevel()`
- **Providers** - `pi.registerProvider()` for custom LLM endpoints
- **Messages** - `pi.sendMessage()`, `pi.sendUserMessage()`

### 2. Themes

JSON files in `~/.pi/agent/themes/` defining 51 color tokens. Hot-reload on save.
Fetch the themes doc for all tokens and format.

### 3. Skills

Markdown capability packages in `~/.pi/agent/skills/` (global) or `.pi/skills/` (project).
SKILL.md with frontmatter + instructions. Agent loads on-demand via description matching or `/skill:name`.

### 4. Prompt Templates

Markdown files in `~/.pi/agent/prompts/` (global) or `.pi/prompts/` (project).
Filename becomes `/command`. Supports `$1`, `$@` arguments.

### 5. Settings

`~/.pi/agent/settings.json` (global) or `.pi/settings.json` (project).
Controls model, thinking, theme, compaction, keybindings, resource paths, UI options.

### 6. Keybindings

`~/.pi/agent/keybindings.json` - remap any action to custom key combos.

### 7. Pi Packages

Bundle extensions/skills/prompts/themes in npm or git packages for sharing.

## User's Current Setup

The user may have extensions in a project-specific `pi-extensions/` directory and reference them
via settings. Check `~/.pi/agent/settings.json` and `.pi/settings.json` for current configuration.
Check `~/.pi/agent/extensions/`, `.pi/extensions/`, and any project `pi-extensions/` directories
for existing extensions.

## Workflow

1. Understand what the user wants to customize
2. Check if a pattern exists in `patterns/` — if so, follow it
3. Use `WebFetch` to fetch the relevant upstream doc(s) and example(s)
4. Check the user's existing setup (settings, extensions, themes, etc.)
5. Implement the customization
6. Tell the user to run `/reload` to pick up changes (or restart pi if needed)
7. **Update documentation** (see below)

## MANDATORY: Keep Patterns Up to Date

**Every time you create, modify, or delete a pi customization (extension, agent, tool, command,
shortcut, skill, theme, or any component covered by a pattern), you MUST update the relevant
pattern file in `patterns/`.**

This is not optional. The patterns are the single source of truth for how the user's setup works.
Stale patterns cause incorrect implementations in future sessions.

### What to update:

- **Created a new extension or modified an existing one?** → Update or create the pattern that covers it.
- **Added/removed/renamed an agent definition?** → Update `subagent-system.md` agent list.
- **Changed keybindings, commands, or event handlers?** → Update the relevant pattern's tables.
- **Added a new tool to the tools system?** → Update `tools-system.md` if conventions changed.
- **Changed file layout or architecture?** → Update the pattern's file layout section.
- **Fixed a bug that reveals a design decision?** → Add it to the pattern's "Key Design Decisions" section.
- **No existing pattern covers the change?** → Create a new pattern file and add it to the table above.

### How to update:

1. Read the current pattern file
2. Make surgical updates reflecting the change (don't rewrite from scratch)
3. Ensure the pattern still accurately describes the live implementation
4. If creating a new pattern, follow the format of existing patterns (file layout, conventions,
   reference implementation sections)
