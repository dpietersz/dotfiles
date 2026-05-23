---
title: "Getting started"
description: "Install Paseo and start running coding agents from anywhere."
domain: "paseo.sh"
source: "https://paseo.sh/docs"
scraped_at: "2026-05-23T07:01:47Z"
---

[![Paseo](https://paseo.sh/logo.svg)Paseo](https://paseo.sh/)
[![Paseo](https://paseo.sh/logo.svg)Paseo](https://paseo.sh/)
[Getting started](https://paseo.sh/docs)[Why Paseo?](https://paseo.sh/docs/why)[Providers](https://paseo.sh/docs/providers)[Supported providers](https://paseo.sh/docs/supported-providers)[Custom providers](https://paseo.sh/docs/custom-providers)[CLI](https://paseo.sh/docs/cli)[Paseo MCP](https://paseo.sh/docs/mcp)[Git worktrees](https://paseo.sh/docs/worktrees)[Schedules](https://paseo.sh/docs/schedules)[Skills](https://paseo.sh/docs/skills)[Voice](https://paseo.sh/docs/voice)[Configuration](https://paseo.sh/docs/configuration)[Security](https://paseo.sh/docs/security)[Best practices](https://paseo.sh/docs/best-practices)
Alternatives
[Conductor](https://paseo.sh/docs/alternatives/conductor)[Superset](https://paseo.sh/docs/alternatives/superset)[OpenChamber](https://paseo.sh/docs/alternatives/openchamber)[Happy Coder](https://paseo.sh/docs/alternatives/happy-coder)
#  [#](https://paseo.sh/docs#getting-started)Getting started
Paseo runs your coding agents on your machine and gives you a mobile, desktop, web, and CLI client to drive them from anywhere. Two ways to install.
##  [#](https://paseo.sh/docs#desktop-app-recommended)Desktop app (recommended)
Download from [paseo.sh/download](https://paseo.sh/download) or the [GitHub releases page](https://github.com/getpaseo/paseo/releases). Open it and you're done.
The desktop app bundles its own daemon and starts it automatically, no separate install required. On first launch you'll see a brief startup screen, then connect from your phone by scanning the QR code in Settings.
##  [#](https://paseo.sh/docs#server--cli)Server / CLI
For headless machines, dev boxes, or any setup where you want the daemon running without the desktop UI:

```
npm install -g @getpaseo/cli
paseo
```

Paseo prints a QR code in the terminal. Scan it from the mobile app, or enter the daemon address manually from another client.
Configuration and local state live under `PASEO_HOME` (defaults to `~/.paseo`).
##  [#](https://paseo.sh/docs#where-next)Where next
  * [Providers](https://paseo.sh/docs/providers), what a provider is and how Paseo wraps existing CLIs.
  * [CLI reference](https://paseo.sh/docs/cli), every command.
  * [GitHub repo](https://github.com/getpaseo/paseo)
  * [Report an issue](https://github.com/getpaseo/paseo/issues)


##  [#](https://paseo.sh/docs#prerequisites)Prerequisites
Paseo manages other agents, it doesn't ship one. Before it's useful, install at least one provider CLI yourself and make sure it works with your credentials. See [Supported providers](https://paseo.sh/docs/supported-providers) for the full list.
You'll also want the [GitHub CLI](https://cli.github.com/) (`gh`) installed and authenticated, Paseo uses it for PR-aware worktrees and a few orchestration features.
[View this page on GitHub](https://github.com/getpaseo/paseo/blob/main/public-docs/index.md)
