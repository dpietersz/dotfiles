---
title: "Pi Coding Agent"
description: "A terminal-based coding agent"
domain: "pi.dev"
source: "https://pi.dev/docs/latest/windows"
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
[Custom Shell Path](https://pi.dev/docs/latest/windows#custom-shell-path)
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
  1. [](https://pi.dev/docs/latest/windows)
  2. [](https://pi.dev/docs/latest/windows)
  3. [](https://pi.dev/docs/latest/windows)
  4. [](https://pi.dev/docs/latest/windows)
  5. [](https://pi.dev/docs/latest/windows)
  6. [](https://pi.dev/docs/latest/windows)
  7. [](https://pi.dev/docs/latest/windows)
  8. [](https://pi.dev/docs/latest/windows)
  9. [](https://pi.dev/docs/latest/windows)
  10. [](https://pi.dev/docs/latest/windows)


* [](https://pi.dev/docs/latest/windows)
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
[Custom Shell Path](https://pi.dev/docs/latest/windows#custom-shell-path)
On this page
[Custom Shell Path](https://pi.dev/docs/latest/windows#custom-shell-path)
# Windows Setup
Latest·[](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/windows.md)·[](https://github.com/earendil-works/pi/edit/main/packages/coding-agent/docs/windows.md)
Pi requires a bash shell on Windows. Checked locations (in order):
  1. Custom path from `~/.pi/agent/settings.json`
  2. Git Bash (`C:\Program Files\Git\bin\bash.exe`)
  3. `bash.exe` on PATH (Cygwin, MSYS2, WSL)


For most users, [Git for Windows](https://git-scm.com/download/win) is sufficient.
##  Custom Shell Path 
[ Copied ](https://pi.dev/docs/latest/windows#custom-shell-path)

```
{
  "shellPath": "C:\\cygwin64\\bin\\bash.exe"
}

```

[Earendil Inc.](https://earendil.com/) & Contributors
[Press Kit](https://pi.dev/press-kit)
MIT License
[](https://github.com/earendil-works/pi/tree/main/packages/coding-agent "GitHub")[](https://www.npmjs.com/package/@earendil-works/pi-coding-agent "npm")[](https://discord.com/invite/3cU7Bz4UPx "Discord")
[](https://earendil.com "Earendil Inc. website")AutoLightDark
pi.dev domain graciously donated by [exe.dev](https://exe.dev)
