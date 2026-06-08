---
title: "Pi Coding Agent"
description: "A terminal-based coding agent"
domain: "pi.dev"
source: "https://pi.dev/docs/latest"
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
[Quick start](https://pi.dev/docs/latest#quick-start)[Start here](https://pi.dev/docs/latest#start-here)[Customization](https://pi.dev/docs/latest#customization)[Programmatic usage](https://pi.dev/docs/latest#programmatic-usage)[Reference](https://pi.dev/docs/latest#reference)[Platform setup](https://pi.dev/docs/latest#platform-setup)[Development](https://pi.dev/docs/latest#development)
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
  1. [](https://pi.dev/docs/latest)
  2. [](https://pi.dev/docs/latest)
  3. [](https://pi.dev/docs/latest)
  4. [](https://pi.dev/docs/latest)
  5. [](https://pi.dev/docs/latest)
  6. [](https://pi.dev/docs/latest)
  7. [](https://pi.dev/docs/latest)
  8. [](https://pi.dev/docs/latest)
  9. [](https://pi.dev/docs/latest)
  10. [](https://pi.dev/docs/latest)


* [](https://pi.dev/docs/latest)
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
[Quick start](https://pi.dev/docs/latest#quick-start)[Start here](https://pi.dev/docs/latest#start-here)[Customization](https://pi.dev/docs/latest#customization)[Programmatic usage](https://pi.dev/docs/latest#programmatic-usage)[Reference](https://pi.dev/docs/latest#reference)[Platform setup](https://pi.dev/docs/latest#platform-setup)[Development](https://pi.dev/docs/latest#development)
On this page
[Quick start](https://pi.dev/docs/latest#quick-start)[Start here](https://pi.dev/docs/latest#start-here)[Customization](https://pi.dev/docs/latest#customization)[Programmatic usage](https://pi.dev/docs/latest#programmatic-usage)[Reference](https://pi.dev/docs/latest#reference)[Platform setup](https://pi.dev/docs/latest#platform-setup)[Development](https://pi.dev/docs/latest#development)
# Pi Documentation
Latest·[](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/index.md)·[](https://github.com/earendil-works/pi/edit/main/packages/coding-agent/docs/index.md)
Pi is a minimal terminal coding harness. It is designed to stay small at the core while being extended through TypeScript extensions, skills, prompt templates, themes, and pi packages.
##  Quick start 
[ Copied ](https://pi.dev/docs/latest#quick-start)
Install Pi with npm:

```
npm install -g --ignore-scripts @earendil-works/pi-coding-agent

```

`--ignore-scripts` disables dependency lifecycle scripts during install. Pi does not require install scripts for normal npm installs.
On Linux or macOS, you can also use the installer:

```
curl -fsSL https://pi.dev/install.sh | sh

```

To uninstall pi itself, use npm for curl and npm installs:

```
npm uninstall -g @earendil-works/pi-coding-agent

```

For pnpm, Yarn, or Bun installs, use the matching global remove command: `pnpm remove -g @earendil-works/pi-coding-agent`, `yarn global remove @earendil-works/pi-coding-agent`, or `bun uninstall -g @earendil-works/pi-coding-agent`.
Then run it in a project directory:

```
pi

```

Authenticate with `/login` for subscription providers, or set an API key such as `ANTHROPIC_API_KEY` before starting pi.
For the full first-run flow, see [Quickstart](https://pi.dev/docs/latest/quickstart).
##  Start here 
[ Copied ](https://pi.dev/docs/latest#start-here)
  * [Quickstart](https://pi.dev/docs/latest/quickstart) - install, authenticate, and run a first session.
  * [Using Pi](https://pi.dev/docs/latest/usage) - interactive mode, slash commands, context files, and CLI reference.
  * [Providers](https://pi.dev/docs/latest/providers) - subscription and API-key setup for built-in providers.
  * [Containerization](https://pi.dev/docs/latest/containerization) - sandbox pi with OpenShell, Gondolin, or Docker.
  * [Settings](https://pi.dev/docs/latest/settings) - global and project settings.
  * [Keybindings](https://pi.dev/docs/latest/keybindings) - default shortcuts and custom keybindings.
  * [Sessions](https://pi.dev/docs/latest/sessions) - session management, branching, and tree navigation.
  * [Compaction](https://pi.dev/docs/latest/compaction) - context compaction and branch summarization.


##  Customization 
[ Copied ](https://pi.dev/docs/latest#customization)
  * [Extensions](https://pi.dev/docs/latest/extensions) - TypeScript modules for tools, commands, events, and custom UI.
  * [Skills](https://pi.dev/docs/latest/skills) - Agent Skills for reusable on-demand capabilities.
  * [Prompt templates](https://pi.dev/docs/latest/prompt-templates) - reusable prompts that expand from slash commands.
  * [Themes](https://pi.dev/docs/latest/themes) - built-in and custom terminal themes.
  * [Pi packages](https://pi.dev/docs/latest/packages) - bundle and share extensions, skills, prompts, and themes.
  * [Custom models](https://pi.dev/docs/latest/models) - add model entries for supported provider APIs.
  * [Custom providers](https://pi.dev/docs/latest/custom-provider) - implement custom APIs and OAuth flows.


##  Programmatic usage 
[ Copied ](https://pi.dev/docs/latest#programmatic-usage)
  * [SDK](https://pi.dev/docs/latest/sdk) - embed pi in Node.js applications.
  * [RPC mode](https://pi.dev/docs/latest/rpc) - integrate over stdin/stdout JSONL.
  * [JSON event stream mode](https://pi.dev/docs/latest/json) - print mode with structured events.
  * [TUI components](https://pi.dev/docs/latest/tui) - build custom terminal UI for extensions.


##  Reference 
[ Copied ](https://pi.dev/docs/latest#reference)
  * [Session format](https://pi.dev/docs/latest/session-format) - JSONL session file format, entry types, and SessionManager API.


##  Platform setup 
[ Copied ](https://pi.dev/docs/latest#platform-setup)
  * [Windows](https://pi.dev/docs/latest/windows)
  * [Termux on Android](https://pi.dev/docs/latest/termux)
  * [tmux](https://pi.dev/docs/latest/tmux)
  * [Terminal setup](https://pi.dev/docs/latest/terminal-setup)
  * [Shell aliases](https://pi.dev/docs/latest/shell-aliases)


##  Development 
[ Copied ](https://pi.dev/docs/latest#development)
  * [Development](https://pi.dev/docs/latest/development) - local setup, project structure, and debugging.


[Earendil Inc.](https://earendil.com/) & Contributors
[Press Kit](https://pi.dev/press-kit)
MIT License
[](https://github.com/earendil-works/pi/tree/main/packages/coding-agent "GitHub")[](https://www.npmjs.com/package/@earendil-works/pi-coding-agent "npm")[](https://discord.com/invite/3cU7Bz4UPx "Discord")
[](https://earendil.com "Earendil Inc. website")AutoLightDark
pi.dev domain graciously donated by [exe.dev](https://exe.dev)
