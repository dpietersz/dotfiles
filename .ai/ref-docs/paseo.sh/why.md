---
title: "Why Paseo?"
description: "What Paseo is, what it isn't, and how it fits into your workflow."
domain: "paseo.sh"
source: "https://paseo.sh/docs/why"
scraped_at: "2026-05-23T07:01:47Z"
---

[![Paseo](https://paseo.sh/logo.svg)Paseo](https://paseo.sh/)
[![Paseo](https://paseo.sh/logo.svg)Paseo](https://paseo.sh/)
[Getting started](https://paseo.sh/docs)[Why Paseo?](https://paseo.sh/docs/why)[Providers](https://paseo.sh/docs/providers)[Supported providers](https://paseo.sh/docs/supported-providers)[Custom providers](https://paseo.sh/docs/custom-providers)[CLI](https://paseo.sh/docs/cli)[Paseo MCP](https://paseo.sh/docs/mcp)[Git worktrees](https://paseo.sh/docs/worktrees)[Schedules](https://paseo.sh/docs/schedules)[Skills](https://paseo.sh/docs/skills)[Voice](https://paseo.sh/docs/voice)[Configuration](https://paseo.sh/docs/configuration)[Security](https://paseo.sh/docs/security)[Best practices](https://paseo.sh/docs/best-practices)
Alternatives
[Conductor](https://paseo.sh/docs/alternatives/conductor)[Superset](https://paseo.sh/docs/alternatives/superset)[OpenChamber](https://paseo.sh/docs/alternatives/openchamber)[Happy Coder](https://paseo.sh/docs/alternatives/happy-coder)
#  [#](https://paseo.sh/docs/why#why-paseo)Why Paseo?
Paseo is a self-hostable platform for running and orchestrating coding agents. It runs the agent CLIs you already use, on the hardware you already have, and gives you a UI, CLI, and API to drive them from anywhere.
##  [#](https://paseo.sh/docs/why#architecture)Architecture
  * Daemon-client architecture. The daemon manages agents; clients (mobile, desktop, web, CLI) connect locally or over a relay. Remote access isn't an add-on.
  * macOS, Windows, and Linux are all primary targets. None of them are a port or an afterthought.
  * Mobile, desktop, and web are separate native clients. The mobile app is built in React Native, not a webview.


##  [#](https://paseo.sh/docs/why#providers)Providers
  * Bring your own. Use your Claude subscription, your OpenAI account, your own API keys, a self-hosted endpoint. Paseo doesn't proxy model calls.
  * Local voice stack. Speech-to-text and text-to-speech run on-device by default. OpenAI providers are configurable if you want cloud quality.
  * Open source. No telemetry on your code.


##  [#](https://paseo.sh/docs/why#where-agents-run)Where agents run
  * Your laptop, a homelab, a company server. Same daemon, same client surface.
  * Any directory, git or not. Launch agents, merge locally, review the diff in the app.
  * GitHub PRs, checks, and reviews surface in the app when you want them. Not required.


##  [#](https://paseo.sh/docs/why#parallel-work)Parallel work
  * Splits and panes. Agents, terminals, and browsers side by side in one workspace.
  * Per-worktree services. Each worktree gets allocated ports for dev servers and databases, reachable through proxy URLs like `web.fix-auth.my-app.localhost` so they don't collide.
  * Multiple agents on the same repo via worktrees.


##  [#](https://paseo.sh/docs/why#automation)Automation
  * The CLI exposes the same surface as the app. Anything in the UI is scriptable.
  * MCP server. Agents can drive Paseo themselves: create worktrees, spawn other agents, open terminals, send prompts.


##  [#](https://paseo.sh/docs/why#what-it-isnt)What it isn't
Not a hosted agent, not an IDE, not a model provider. Paseo runs the CLIs you already use and stays out of the way.
[View this page on GitHub](https://github.com/getpaseo/paseo/blob/main/public-docs/why.md)
