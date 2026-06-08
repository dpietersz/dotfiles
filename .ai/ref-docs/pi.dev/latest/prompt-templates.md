---
title: "Pi Coding Agent"
description: "A terminal-based coding agent"
domain: "pi.dev"
source: "https://pi.dev/docs/latest/prompt-templates"
scraped_at: "2026-06-08T07:02:40Z"
---

[](https://pi.dev/)
Copy SVG[Download SVG](https://pi.dev/logo-auto.svg)[Press Kit](https://pi.dev/press-kit)
[Home](https://pi.dev/)[Docs](https://pi.dev/docs/latest)[News](https://pi.dev/news)[Packages](https://pi.dev/packages)[Models](https://pi.dev/models)
[Login](https://pi.dev/enter)
[Home→](https://pi.dev/)[Docs→](https://pi.dev/docs/latest)[News→](https://pi.dev/news)[Packages→](https://pi.dev/packages)[Models→](https://pi.dev/models)
[GitHub](https://github.com/earendil-works/pi/tree/main/packages/coding-agent)[npm](https://www.npmjs.com/package/@earendil-works/pi-coding-agent)[Discord](https://discord.com/invite/3cU7Bz4UPx)
[Earendil Inc.](https://earendil.com "Earendil Inc. website")
Documentation
Guides and references for configuring and extending Pi.
Navigation
On this page
[Locations](https://pi.dev/docs/latest/prompt-templates#locations)[Format](https://pi.dev/docs/latest/prompt-templates#format)[Argument Hints](https://pi.dev/docs/latest/prompt-templates#argument-hints)[Usage](https://pi.dev/docs/latest/prompt-templates#usage)[Arguments](https://pi.dev/docs/latest/prompt-templates#arguments)[Loading Rules](https://pi.dev/docs/latest/prompt-templates#loading-rules)
Docs
## Start here
[Overview](https://pi.dev/docs/latest)[Quickstart](https://pi.dev/docs/latest/quickstart)[Using Pi](https://pi.dev/docs/latest/usage)[Providers](https://pi.dev/docs/latest/providers)[Containerization](https://pi.dev/docs/latest/containerization)[Settings](https://pi.dev/docs/latest/settings)[Keybindings](https://pi.dev/docs/latest/keybindings)[Sessions](https://pi.dev/docs/latest/sessions)[Compaction](https://pi.dev/docs/latest/compaction)
## Customization
[Extensions](https://pi.dev/docs/latest/extensions)[Skills](https://pi.dev/docs/latest/skills)[Prompt Templates](https://pi.dev/docs/latest/prompt-templates)[Themes](https://pi.dev/docs/latest/themes)[Pi Packages](https://pi.dev/docs/latest/packages)[Custom Models](https://pi.dev/docs/latest/models)[Custom Providers](https://pi.dev/docs/latest/custom-provider)
## Reference
[Session Format](https://pi.dev/docs/latest/session-format)
## Programmatic Usage
[SDK](https://pi.dev/docs/latest/sdk)[RPC Mode](https://pi.dev/docs/latest/rpc)[JSON Event Stream Mode](https://pi.dev/docs/latest/json)[TUI Components](https://pi.dev/docs/latest/tui)
## Platform Setup
[Windows](https://pi.dev/docs/latest/windows)[Termux on Android](https://pi.dev/docs/latest/termux)[tmux](https://pi.dev/docs/latest/tmux)[Terminal Setup](https://pi.dev/docs/latest/terminal-setup)[Shell Aliases](https://pi.dev/docs/latest/shell-aliases)
## Development
[Development](https://pi.dev/docs/latest/development)
Search documentation
`Ctrl K`
  1. [](https://pi.dev/docs/latest/prompt-templates)
  2. [](https://pi.dev/docs/latest/prompt-templates)
  3. [](https://pi.dev/docs/latest/prompt-templates)
  4. [](https://pi.dev/docs/latest/prompt-templates)
  5. [](https://pi.dev/docs/latest/prompt-templates)
  6. [](https://pi.dev/docs/latest/prompt-templates)
  7. [](https://pi.dev/docs/latest/prompt-templates)
  8. [](https://pi.dev/docs/latest/prompt-templates)
  9. [](https://pi.dev/docs/latest/prompt-templates)
  10. [](https://pi.dev/docs/latest/prompt-templates)


* [](https://pi.dev/docs/latest/prompt-templates)
## Docs
## Start here
[Overview](https://pi.dev/docs/latest)[Quickstart](https://pi.dev/docs/latest/quickstart)[Using Pi](https://pi.dev/docs/latest/usage)[Providers](https://pi.dev/docs/latest/providers)[Containerization](https://pi.dev/docs/latest/containerization)[Settings](https://pi.dev/docs/latest/settings)[Keybindings](https://pi.dev/docs/latest/keybindings)[Sessions](https://pi.dev/docs/latest/sessions)[Compaction](https://pi.dev/docs/latest/compaction)
## Customization
[Extensions](https://pi.dev/docs/latest/extensions)[Skills](https://pi.dev/docs/latest/skills)[Prompt Templates](https://pi.dev/docs/latest/prompt-templates)[Themes](https://pi.dev/docs/latest/themes)[Pi Packages](https://pi.dev/docs/latest/packages)[Custom Models](https://pi.dev/docs/latest/models)[Custom Providers](https://pi.dev/docs/latest/custom-provider)
## Reference
[Session Format](https://pi.dev/docs/latest/session-format)
## Programmatic Usage
[SDK](https://pi.dev/docs/latest/sdk)[RPC Mode](https://pi.dev/docs/latest/rpc)[JSON Event Stream Mode](https://pi.dev/docs/latest/json)[TUI Components](https://pi.dev/docs/latest/tui)
## Platform Setup
[Windows](https://pi.dev/docs/latest/windows)[Termux on Android](https://pi.dev/docs/latest/termux)[tmux](https://pi.dev/docs/latest/tmux)[Terminal Setup](https://pi.dev/docs/latest/terminal-setup)[Shell Aliases](https://pi.dev/docs/latest/shell-aliases)
## Development
[Development](https://pi.dev/docs/latest/development)
## On this page
[Locations](https://pi.dev/docs/latest/prompt-templates#locations)[Format](https://pi.dev/docs/latest/prompt-templates#format)[Argument Hints](https://pi.dev/docs/latest/prompt-templates#argument-hints)[Usage](https://pi.dev/docs/latest/prompt-templates#usage)[Arguments](https://pi.dev/docs/latest/prompt-templates#arguments)[Loading Rules](https://pi.dev/docs/latest/prompt-templates#loading-rules)
On this page
[Locations](https://pi.dev/docs/latest/prompt-templates#locations)[Format](https://pi.dev/docs/latest/prompt-templates#format)[Argument Hints](https://pi.dev/docs/latest/prompt-templates#argument-hints)[Usage](https://pi.dev/docs/latest/prompt-templates#usage)[Arguments](https://pi.dev/docs/latest/prompt-templates#arguments)[Loading Rules](https://pi.dev/docs/latest/prompt-templates#loading-rules)
# Prompt Templates
Latest·[](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/prompt-templates.md)·[](https://github.com/earendil-works/pi/edit/main/packages/coding-agent/docs/prompt-templates.md)
> pi can create prompt templates. Ask it to build one for your workflow.
Prompt templates are Markdown snippets that expand into full prompts. Type `/name` in the editor to invoke a template, where `name` is the filename without `.md`.
##  Locations 
[ Copied ](https://pi.dev/docs/latest/prompt-templates#locations)
Pi loads prompt templates from:
  * Global: `~/.pi/agent/prompts/*.md`
  * Project: `.pi/prompts/*.md` (only after the project is trusted)
  * Packages: `prompts/` directories or `pi.prompts` entries in `package.json`
  * Settings: `prompts` array with files or directories
  * CLI: `--prompt-template <path>` (repeatable)


Disable discovery with `--no-prompt-templates`.
##  Format 
[ Copied ](https://pi.dev/docs/latest/prompt-templates#format)

```
---
description: Review staged git changes
---
Review the staged changes (`git diff --cached`). Focus on:
- Bugs and logic errors
- Security issues
- Error handling gaps

```

  * The filename becomes the command name. `review.md` becomes `/review`.
  * `description` is optional. If missing, the first non-empty line is used.
  * `argument-hint` is optional. When set, the hint is displayed before the description in the autocomplete dropdown.


###  Argument Hints 
[ Copied ](https://pi.dev/docs/latest/prompt-templates#argument-hints)
Use `argument-hint` in frontmatter to show expected arguments in autocomplete. Use `<angle brackets>` for required arguments and `[square brackets]` for optional ones:

```
---
description: Review PRs from URLs with structured issue and code analysis
argument-hint: "<PR-URL>"
---

```

This renders in the autocomplete dropdown as:

```
→ pr   <PR-URL>       — Review PRs from URLs with structured issue and code analysis
  is   <issue>        — Analyze GitHub issues (bugs or feature requests)
  wr   [instructions] — Finish the current task end-to-end
  cl   — Audit changelog entries before release

```

##  Usage 
[ Copied ](https://pi.dev/docs/latest/prompt-templates#usage)
Type `/` followed by the template name in the editor. Autocomplete shows available templates with descriptions.

```
/review                           # Expands review.md
/component Button                 # Expands with argument
/component Button "click handler" # Multiple arguments

```

##  Arguments 
[ Copied ](https://pi.dev/docs/latest/prompt-templates#arguments)
Templates support positional arguments and simple slicing:
  * `$1`, `$2`, ... positional args
  * `$@` or `$ARGUMENTS` for all args joined
  * `${@:N}` for args from the Nth position (1-indexed)
  * `${@:N:L}` for `L` args starting at N


Example:

```
---
description: Create a component
---
Create a React component named $1 with features: $@

```

Usage: `/component Button "onClick handler" "disabled support"`
##  Loading Rules 
[ Copied ](https://pi.dev/docs/latest/prompt-templates#loading-rules)
  * Template discovery in `prompts/` is non-recursive.
  * If you want templates in subdirectories, add them explicitly via `prompts` settings or a package manifest.


[Earendil Inc.](https://earendil.com/) & Contributors
[Press Kit](https://pi.dev/press-kit)
MIT License
[](https://github.com/earendil-works/pi/tree/main/packages/coding-agent "GitHub")[](https://www.npmjs.com/package/@earendil-works/pi-coding-agent "npm")[](https://discord.com/invite/3cU7Bz4UPx "Discord")
[](https://earendil.com "Earendil Inc. website")AutoLightDark
pi.dev domain graciously donated by [exe.dev](https://exe.dev)
