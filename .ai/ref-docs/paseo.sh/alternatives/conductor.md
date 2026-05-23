---
title: "Open source Conductor alternative with Linux, Windows, and mobile"
description: "Paseo is open source, runs on macOS, Linux, and Windows, ships native iOS and Android apps, and supports 30+ agents through the in-app catalog plus any ACP or CLI agent. Conductor is macOS only and Claude Code or Codex only."
domain: "paseo.sh"
source: "https://paseo.sh/docs/alternatives/conductor"
scraped_at: "2026-05-23T07:01:47Z"
---

[![Paseo](https://paseo.sh/logo.svg)Paseo](https://paseo.sh/)
[![Paseo](https://paseo.sh/logo.svg)Paseo](https://paseo.sh/)
[Getting started](https://paseo.sh/docs)[Why Paseo?](https://paseo.sh/docs/why)[Providers](https://paseo.sh/docs/providers)[Supported providers](https://paseo.sh/docs/supported-providers)[Custom providers](https://paseo.sh/docs/custom-providers)[CLI](https://paseo.sh/docs/cli)[Paseo MCP](https://paseo.sh/docs/mcp)[Git worktrees](https://paseo.sh/docs/worktrees)[Schedules](https://paseo.sh/docs/schedules)[Skills](https://paseo.sh/docs/skills)[Voice](https://paseo.sh/docs/voice)[Configuration](https://paseo.sh/docs/configuration)[Security](https://paseo.sh/docs/security)[Best practices](https://paseo.sh/docs/best-practices)
Alternatives
[Conductor](https://paseo.sh/docs/alternatives/conductor)[Superset](https://paseo.sh/docs/alternatives/superset)[OpenChamber](https://paseo.sh/docs/alternatives/openchamber)[Happy Coder](https://paseo.sh/docs/alternatives/happy-coder)
#  [#](https://paseo.sh/docs/alternatives/conductor#paseo-vs-conductor)Paseo vs Conductor
Conductor is a macOS app for running Claude Code and Codex in parallel git worktrees. Closed source.
Paseo is an app for orchestrating coding agents, with native clients on desktop, mobile, web, and the CLI. Open source (AGPL-3.0).
![Paseo desktop and mobile app](https://paseo.sh/hero-mockup.png)
##  [#](https://paseo.sh/docs/alternatives/conductor#why-pick-paseo)Why pick Paseo
Conductor runs on macOS, with Claude Code and Codex, in parallel git worktrees. Paseo does all of that. Pick Paseo if you want:
  * Linux or Windows alongside macOS
  * A native iOS and Android app
  * Many more agents than Claude Code and Codex
  * A CLI to script agent work and drive remote daemons
  * A self-hosted daemon you can run on a server, VM, or homelab
  * Open source you can audit and fork


##  [#](https://paseo.sh/docs/alternatives/conductor#architecture)Architecture
The Paseo daemon runs as its own process. Desktop, web, mobile, and CLI all connect to it over a websocket. Run the daemon on your laptop, on a VM, in Docker, or across a fleet, and connect to any of them from any client.
Conductor's desktop app is the host. Agents run inside it.
##  [#](https://paseo.sh/docs/alternatives/conductor#providers)Providers
Paseo runs Claude Code, Codex, OpenCode, and Pi natively, plus 30+ more agents through the in-app catalog including GitHub Copilot, Cursor, Gemini CLI, and Amp. Paseo speaks the [Agent Client Protocol](https://agentclientprotocol.com), so any ACP agent works. Custom providers run any CLI agent. See [Supported providers](https://paseo.sh/docs/supported-providers).
Conductor runs Claude Code and Codex.
Both tools launch the official CLIs as subprocesses with your own credentials. Neither extracts tokens or proxies model calls.
##  [#](https://paseo.sh/docs/alternatives/conductor#panes)Panes
Paseo's app has split panes and tabs (⌘D for vertical, ⌘⇧D for horizontal). Panes include a terminal alongside your agents, a diff viewer, and a browser for testing running services.
##  [#](https://paseo.sh/docs/alternatives/conductor#github)GitHub
Paseo's app handles commit, push, opening PRs, watching checks and reviews, and merging.
##  [#](https://paseo.sh/docs/alternatives/conductor#cli)CLI
Paseo has a CLI that mirrors the app:

```
paseo run --provider codex "implement OAuth"
paseo run --host devbox:6767 "run the test suite"
paseo ls
paseo send <agent-id> "add tests"
paseo schedule create --cron "0 9 * * 1" "audit the codebase"
```

`paseo run --host` connects to a remote daemon. `paseo schedule` runs an agent on a cron. `paseo loop` retries an agent until a verification command passes.
Conductor does not have a CLI.
##  [#](https://paseo.sh/docs/alternatives/conductor#worktrees-and-services)Worktrees and services
Both tools isolate parallel agents in git worktrees.
Paseo also gives each worktree its own dev server URL. Two agents running their dev servers at the same time get `web.fix-auth.my-app.localhost` and `web.add-search.my-app.localhost` instead of port collisions.
##  [#](https://paseo.sh/docs/alternatives/conductor#mobile)Mobile
Paseo ships native iOS and Android apps with the same feature set as the desktop app. Conductor has no mobile app.
##  [#](https://paseo.sh/docs/alternatives/conductor#voice)Voice
Paseo's speech-to-text and text-to-speech run locally on your device. Nothing leaves your network. Conductor does not have voice.
##  [#](https://paseo.sh/docs/alternatives/conductor#comparison)Comparison  
|   | Paseo  | Conductor  |  
| --- | --- | --- |  
| License  | Open source (AGPL-3.0)  | Closed source  |  
| Platforms  | macOS, Linux, Windows  | macOS only  |  
| Native mobile  | iOS, Android  | —  |  
| Providers  | Claude Code, Codex, OpenCode, Pi + 30+ via ACP catalog + custom  | Claude Code, Codex  |  
| Git worktrees  | Yes  | Yes  |  
| Per-worktree dev server URLs  | Yes  | —  |  
| Split panes and tabs  | Yes  | —  |  
| In-app terminal  | Yes  | Yes  |  
| In-app browser  | Yes  | —  |  
| GitHub workflow in app  | Commit, push, PR, checks, reviews, merge  | Yes  |  
| CLI  | Run, `--host`, ls, send, schedule, loop  | —  |  
| Local voice (on-device)  | Yes  | —  |  
| Self-hosted daemon  | Yes  | —  |  
See also: [Paseo vs Superset](https://paseo.sh/docs/alternatives/superset), [Paseo vs OpenChamber](https://paseo.sh/docs/alternatives/openchamber), [Paseo vs Happy Coder](https://paseo.sh/docs/alternatives/happy-coder).
[View this page on GitHub](https://github.com/getpaseo/paseo/blob/main/public-docs/alternatives/conductor.md)
