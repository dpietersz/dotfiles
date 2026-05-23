---
title: "Happy Coder alternative with a desktop app and git worktrees"
description: "Paseo ships a native desktop app, runs agents in isolated git worktrees, and supports 30+ agents. Happy Coder is mobile and web only, wraps the agent CLI, and supports Claude Code and Codex."
domain: "paseo.sh"
source: "https://paseo.sh/docs/alternatives/happy-coder"
scraped_at: "2026-05-23T07:01:47Z"
---

[![Paseo](https://paseo.sh/logo.svg)Paseo](https://paseo.sh/)
[![Paseo](https://paseo.sh/logo.svg)Paseo](https://paseo.sh/)
[Getting started](https://paseo.sh/docs)[Why Paseo?](https://paseo.sh/docs/why)[Providers](https://paseo.sh/docs/providers)[Supported providers](https://paseo.sh/docs/supported-providers)[Custom providers](https://paseo.sh/docs/custom-providers)[CLI](https://paseo.sh/docs/cli)[Paseo MCP](https://paseo.sh/docs/mcp)[Git worktrees](https://paseo.sh/docs/worktrees)[Schedules](https://paseo.sh/docs/schedules)[Skills](https://paseo.sh/docs/skills)[Voice](https://paseo.sh/docs/voice)[Configuration](https://paseo.sh/docs/configuration)[Security](https://paseo.sh/docs/security)[Best practices](https://paseo.sh/docs/best-practices)
Alternatives
[Conductor](https://paseo.sh/docs/alternatives/conductor)[Superset](https://paseo.sh/docs/alternatives/superset)[OpenChamber](https://paseo.sh/docs/alternatives/openchamber)[Happy Coder](https://paseo.sh/docs/alternatives/happy-coder)
#  [#](https://paseo.sh/docs/alternatives/happy-coder#paseo-vs-happy-coder)Paseo vs Happy Coder
Happy Coder is a mobile and web client for Claude Code and Codex. It wraps the agent CLI on your laptop and syncs sessions to phone and browser over an end-to-end encrypted relay. Open source under MIT.
Paseo is an app for orchestrating coding agents, with native clients on desktop, mobile, web, and the CLI. Open source (AGPL-3.0).
![Paseo desktop and mobile app](https://paseo.sh/hero-mockup.png)
##  [#](https://paseo.sh/docs/alternatives/happy-coder#when-to-pick-what)When to pick what
Pick Happy Coder if you want the most minimal setup. Wrap an existing Claude Code or Codex session on your laptop and check in on it from your phone.
Pick Paseo if you want:
  * A native desktop app on macOS, Linux, and Windows
  * Git worktrees for parallel agents
  * Per-worktree dev server URLs
  * GitHub PRs, checks, reviews, and merges in the app
  * Many more agents than Claude Code and Codex
  * A CLI to script agent work and drive remote daemons


##  [#](https://paseo.sh/docs/alternatives/happy-coder#architecture)Architecture
Paseo runs the agent inside its own daemon. The daemon owns the agent lifecycle, the worktree, and the dev servers. Clients connect over a websocket and drive the daemon.
Happy Coder runs the agent inside its existing CLI on your laptop and syncs the session to its mobile and web clients through an end-to-end encrypted relay.
##  [#](https://paseo.sh/docs/alternatives/happy-coder#panes)Panes
Paseo's app has split panes and tabs (⌘D for vertical, ⌘⇧D for horizontal). Panes include a terminal alongside your agents, a diff viewer, and a browser for testing running services.
Happy Coder does not have a desktop app.
##  [#](https://paseo.sh/docs/alternatives/happy-coder#github)GitHub
Paseo's app handles commit, push, opening PRs, watching checks and reviews, and merging.
##  [#](https://paseo.sh/docs/alternatives/happy-coder#mobile)Mobile
Both tools ship native iOS and Android apps.
##  [#](https://paseo.sh/docs/alternatives/happy-coder#providers)Providers
Paseo runs Claude Code, Codex, OpenCode, and Pi natively, plus 30+ more agents through the in-app catalog including GitHub Copilot, Cursor, Gemini CLI, and Amp. Paseo speaks the [Agent Client Protocol](https://agentclientprotocol.com), so any ACP agent works. Custom providers run any CLI agent. See [Supported providers](https://paseo.sh/docs/supported-providers).
Happy Coder runs Claude Code and Codex.
##  [#](https://paseo.sh/docs/alternatives/happy-coder#worktrees-and-services)Worktrees and services
Paseo runs each agent in its own git worktree. Each worktree gets its own dev server URL like `web.fix-auth.my-app.localhost`, so parallel agents don't fight for the same port.
Happy Coder runs the agent in the directory you launched the CLI from.
##  [#](https://paseo.sh/docs/alternatives/happy-coder#cli)CLI
Paseo has a CLI that mirrors the app:

```
paseo run --provider codex "implement OAuth"
paseo run --host devbox:6767 "run the test suite"
paseo ls
paseo send <agent-id> "add tests"
paseo schedule create --cron "0 9 * * 1" "audit the codebase"
```

`paseo run --host` connects to a remote daemon. `paseo schedule` runs an agent on a cron. `paseo loop` retries an agent until a verification command passes.
Happy Coder has a CLI to launch the wrapped session. It does not have schedules or loops.
##  [#](https://paseo.sh/docs/alternatives/happy-coder#voice)Voice
Paseo's speech-to-text and text-to-speech run locally on your device. Nothing leaves your network.
##  [#](https://paseo.sh/docs/alternatives/happy-coder#comparison)Comparison  
|   | Paseo  | Happy Coder  |  
| --- | --- | --- |  
| License  | Open source (AGPL-3.0)  | Open source (MIT)  |  
| Desktop app  | macOS, Linux, Windows  | —  |  
| Native mobile  | iOS, Android  | iOS, Android  |  
| Architecture  | Daemon owns agent lifecycle  | Wraps the agent CLI  |  
| Providers  | Claude Code, Codex, OpenCode, Pi + 30+ via ACP catalog + custom  | Claude Code, Codex  |  
| Split panes and tabs  | Yes  | —  |  
| In-app terminal  | Yes  | —  |  
| In-app browser  | Yes  | —  |  
| GitHub workflow in app  | Commit, push, PR, checks, reviews, merge  | —  |  
| Git worktrees  | Yes  | —  |  
| Per-worktree dev server URLs  | Yes  | —  |  
| CLI  | Run, `--host`, ls, send, schedule, loop  | Launch wrapped session  |  
| Local voice (on-device)  | Yes  | —  |  
See also: [Paseo vs Conductor](https://paseo.sh/docs/alternatives/conductor), [Paseo vs Superset](https://paseo.sh/docs/alternatives/superset), [Paseo vs OpenChamber](https://paseo.sh/docs/alternatives/openchamber).
[View this page on GitHub](https://github.com/getpaseo/paseo/blob/main/public-docs/alternatives/happy-coder.md)
