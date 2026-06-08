---
title: "Pi Coding Agent"
description: "A terminal-based coding agent"
domain: "pi.dev"
source: "https://pi.dev/docs/latest/development"
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
[Setup](https://pi.dev/docs/latest/development#setup)[Forking / Rebranding](https://pi.dev/docs/latest/development#forking-rebranding)[Path Resolution](https://pi.dev/docs/latest/development#path-resolution)[Debug Command](https://pi.dev/docs/latest/development#debug-command)[Testing](https://pi.dev/docs/latest/development#testing)[Project Structure](https://pi.dev/docs/latest/development#project-structure)
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
  1. [](https://pi.dev/docs/latest/development)
  2. [](https://pi.dev/docs/latest/development)
  3. [](https://pi.dev/docs/latest/development)
  4. [](https://pi.dev/docs/latest/development)
  5. [](https://pi.dev/docs/latest/development)
  6. [](https://pi.dev/docs/latest/development)
  7. [](https://pi.dev/docs/latest/development)
  8. [](https://pi.dev/docs/latest/development)
  9. [](https://pi.dev/docs/latest/development)
  10. [](https://pi.dev/docs/latest/development)


* [](https://pi.dev/docs/latest/development)
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
[Setup](https://pi.dev/docs/latest/development#setup)[Forking / Rebranding](https://pi.dev/docs/latest/development#forking-rebranding)[Path Resolution](https://pi.dev/docs/latest/development#path-resolution)[Debug Command](https://pi.dev/docs/latest/development#debug-command)[Testing](https://pi.dev/docs/latest/development#testing)[Project Structure](https://pi.dev/docs/latest/development#project-structure)
On this page
[Setup](https://pi.dev/docs/latest/development#setup)[Forking / Rebranding](https://pi.dev/docs/latest/development#forking-rebranding)[Path Resolution](https://pi.dev/docs/latest/development#path-resolution)[Debug Command](https://pi.dev/docs/latest/development#debug-command)[Testing](https://pi.dev/docs/latest/development#testing)[Project Structure](https://pi.dev/docs/latest/development#project-structure)
# Development
Latest·[](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/development.md)·[](https://github.com/earendil-works/pi/edit/main/packages/coding-agent/docs/development.md)
See [AGENTS.md](https://github.com/earendil-works/pi-mono/blob/main/AGENTS.md) for additional guidelines.
##  Setup 
[ Copied ](https://pi.dev/docs/latest/development#setup)

```
git clone https://github.com/earendil-works/pi-mono
cd pi-mono
npm install
npm run build

```

Run from source:

```
/path/to/pi-mono/pi-test.sh

```

The script can be run from any directory. Pi keeps the caller's current working directory.
##  Forking / Rebranding 
[ Copied ](https://pi.dev/docs/latest/development#forking-rebranding)
Configure via `package.json`:

```
{
  "piConfig": {
    "name": "pi",
    "configDir": ".pi"
  }
}

```

Change `name`, `configDir`, and `bin` field for your fork. Affects CLI banner, config paths, and environment variable names.
##  Path Resolution 
[ Copied ](https://pi.dev/docs/latest/development#path-resolution)
Three execution modes: npm install, standalone binary, tsx from source.
**Always use`src/config.ts`** for package assets:

```
import { getPackageDir, getThemeDir } from "./config.js";

```

Never use `__dirname` directly for package assets.
##  Debug Command 
[ Copied ](https://pi.dev/docs/latest/development#debug-command)
`/debug` (hidden) writes to `~/.pi/agent/pi-debug.log`:
  * Rendered TUI lines with ANSI codes
  * Last messages sent to the LLM


##  Testing 
[ Copied ](https://pi.dev/docs/latest/development#testing)

```
./test.sh                         # Run non-LLM tests (no API keys needed)
npm test                          # Run all tests
npm test -- test/specific.test.ts # Run specific test

```

##  Project Structure 
[ Copied ](https://pi.dev/docs/latest/development#project-structure)

```
packages/
  ai/           # LLM provider abstraction
  agent/        # Agent loop and message types  
  tui/          # Terminal UI components
  coding-agent/ # CLI and interactive mode

```

[Earendil Inc.](https://earendil.com/) & Contributors
[Press Kit](https://pi.dev/press-kit)
MIT License
[](https://github.com/earendil-works/pi/tree/main/packages/coding-agent "GitHub")[](https://www.npmjs.com/package/@earendil-works/pi-coding-agent "npm")[](https://discord.com/invite/3cU7Bz4UPx "Discord")
[](https://earendil.com "Earendil Inc. website")AutoLightDark
pi.dev domain graciously donated by [exe.dev](https://exe.dev)
