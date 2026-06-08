---
title: "Pi Coding Agent"
description: "A terminal-based coding agent"
domain: "pi.dev"
source: "https://pi.dev/docs/latest/tmux"
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
[Recommended Configuration](https://pi.dev/docs/latest/tmux#recommended-configuration)[Why csi-u Is Recommended](https://pi.dev/docs/latest/tmux#why-csi-u-is-recommended)[What This Fixes](https://pi.dev/docs/latest/tmux#what-this-fixes)[Requirements](https://pi.dev/docs/latest/tmux#requirements)
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
  1. [](https://pi.dev/docs/latest/tmux)
  2. [](https://pi.dev/docs/latest/tmux)
  3. [](https://pi.dev/docs/latest/tmux)
  4. [](https://pi.dev/docs/latest/tmux)
  5. [](https://pi.dev/docs/latest/tmux)
  6. [](https://pi.dev/docs/latest/tmux)
  7. [](https://pi.dev/docs/latest/tmux)
  8. [](https://pi.dev/docs/latest/tmux)
  9. [](https://pi.dev/docs/latest/tmux)
  10. [](https://pi.dev/docs/latest/tmux)


* [](https://pi.dev/docs/latest/tmux)
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
[Recommended Configuration](https://pi.dev/docs/latest/tmux#recommended-configuration)[Why csi-u Is Recommended](https://pi.dev/docs/latest/tmux#why-csi-u-is-recommended)[What This Fixes](https://pi.dev/docs/latest/tmux#what-this-fixes)[Requirements](https://pi.dev/docs/latest/tmux#requirements)
On this page
[Recommended Configuration](https://pi.dev/docs/latest/tmux#recommended-configuration)[Why csi-u Is Recommended](https://pi.dev/docs/latest/tmux#why-csi-u-is-recommended)[What This Fixes](https://pi.dev/docs/latest/tmux#what-this-fixes)[Requirements](https://pi.dev/docs/latest/tmux#requirements)
# tmux Setup
Latest·[](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/tmux.md)·[](https://github.com/earendil-works/pi/edit/main/packages/coding-agent/docs/tmux.md)
Pi works inside tmux, but tmux strips modifier information from certain keys by default. Without configuration, `Shift+Enter` and `Ctrl+Enter` are usually indistinguishable from plain `Enter`.
##  Recommended Configuration 
[ Copied ](https://pi.dev/docs/latest/tmux#recommended-configuration)
Add to `~/.tmux.conf`:

```
set -g extended-keys on
set -g extended-keys-format csi-u

```

Then restart tmux fully:

```
tmux kill-server
tmux

```

Pi requests extended key reporting automatically when Kitty keyboard protocol is not available. With `extended-keys-format csi-u`, tmux forwards modified keys in CSI-u format, which is the most reliable configuration. The `extended-keys-format` option requires tmux 3.5 or later.
##  Why `csi-u` Is Recommended 
[ Copied ](https://pi.dev/docs/latest/tmux#why-csi-u-is-recommended)
With only:

```
set -g extended-keys on

```

tmux defaults to `extended-keys-format xterm`. When an application requests extended key reporting, modified keys are forwarded in xterm `modifyOtherKeys` format such as:
  * `Ctrl+C` → `\x1b[27;5;99~`
  * `Ctrl+D` → `\x1b[27;5;100~`
  * `Ctrl+Enter` → `\x1b[27;5;13~`


With `extended-keys-format csi-u`, the same keys are forwarded as:
  * `Ctrl+C` → `\x1b[99;5u`
  * `Ctrl+D` → `\x1b[100;5u`
  * `Ctrl+Enter` → `\x1b[13;5u`


Pi supports both formats, but `csi-u` is the recommended tmux setup.
##  What This Fixes 
[ Copied ](https://pi.dev/docs/latest/tmux#what-this-fixes)
Without tmux extended keys, modified Enter keys collapse to legacy sequences:  
| Key  | Without extkeys  | With `csi-u`  |  
| --- | --- | --- |  
| Enter  | `\r`  | `\r`  |  
| Shift+Enter  | `\r`  | `\x1b[13;2u`  |  
| Ctrl+Enter  | `\r`  | `\x1b[13;5u`  |  
| Alt/Option+Enter  | `\x1b\r`  | `\x1b[13;3u`  |  
This affects the default keybindings (`Enter` to submit, `Shift+Enter` for newline) and any custom keybindings using modified Enter.
##  Requirements 
[ Copied ](https://pi.dev/docs/latest/tmux#requirements)
  * tmux 3.5 or later for `extended-keys-format csi-u` (run `tmux -V` to check)
  * A terminal emulator that supports extended keys (Ghostty, Kitty, iTerm2, WezTerm, Windows Terminal)


With tmux 3.2 through 3.4, omit `extended-keys-format csi-u`; Pi still supports tmux's default xterm `modifyOtherKeys` format.
[Earendil Inc.](https://earendil.com/) & Contributors
[Press Kit](https://pi.dev/press-kit)
MIT License
[](https://github.com/earendil-works/pi/tree/main/packages/coding-agent "GitHub")[](https://www.npmjs.com/package/@earendil-works/pi-coding-agent "npm")[](https://discord.com/invite/3cU7Bz4UPx "Discord")
[](https://earendil.com "Earendil Inc. website")AutoLightDark
pi.dev domain graciously donated by [exe.dev](https://exe.dev)
