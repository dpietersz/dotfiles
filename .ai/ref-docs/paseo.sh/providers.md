---
title: "Providers"
description: "How Paseo thinks about coding agents, wrapping existing CLIs, native vs ACP support, and where to go next."
domain: "paseo.sh"
source: "https://paseo.sh/docs/providers"
scraped_at: "2026-05-23T07:01:47Z"
---

[![Paseo](https://paseo.sh/logo.svg)Paseo](https://paseo.sh/)
[![Paseo](https://paseo.sh/logo.svg)Paseo](https://paseo.sh/)
[Getting started](https://paseo.sh/docs)[Why Paseo?](https://paseo.sh/docs/why)[Providers](https://paseo.sh/docs/providers)[Supported providers](https://paseo.sh/docs/supported-providers)[Custom providers](https://paseo.sh/docs/custom-providers)[CLI](https://paseo.sh/docs/cli)[Paseo MCP](https://paseo.sh/docs/mcp)[Git worktrees](https://paseo.sh/docs/worktrees)[Schedules](https://paseo.sh/docs/schedules)[Skills](https://paseo.sh/docs/skills)[Voice](https://paseo.sh/docs/voice)[Configuration](https://paseo.sh/docs/configuration)[Security](https://paseo.sh/docs/security)[Best practices](https://paseo.sh/docs/best-practices)
Alternatives
[Conductor](https://paseo.sh/docs/alternatives/conductor)[Superset](https://paseo.sh/docs/alternatives/superset)[OpenChamber](https://paseo.sh/docs/alternatives/openchamber)[Happy Coder](https://paseo.sh/docs/alternatives/happy-coder)
#  [#](https://paseo.sh/docs/providers#providers)Providers
Paseo doesn't ship its own coding agent. It launches and supervises **existing CLIs you've already installed and authenticated** , Claude Code, Codex, OpenCode, Cursor, Gemini, and the rest. Your subscriptions, your config, your skills, your MCP servers all stay intact. Paseo just gives you a UI, a CLI, a relay, and orchestration on top.
##  [#](https://paseo.sh/docs/providers#mental-model)Mental model
A provider is the contract between Paseo and one external agent CLI: how to launch it, how to stream its output, how to send input back, what modes it supports. The actual binary lives on your machine and runs as a normal subprocess.
##  [#](https://paseo.sh/docs/providers#two-tiers)Two tiers
  * **Native support** , Paseo ships a bundled adapter for the major agents (Claude Code, Codex, OpenCode, pi). Auto-discovered when the underlying CLI is installed, with mode metadata and voice support where applicable.
  * **ACP catalog** , any agent speaking the [Agent Client Protocol](https://agentclientprotocol.com) is supported through a generic adapter. Paseo ships a curated catalog of one-click installs (Cursor, Gemini, GitHub Copilot, Hermes, Kimi, Qwen Code, and 25+ more), and you can add any other ACP agent yourself.


Either way, **you install the underlying CLI**. Paseo runs it.
##  [#](https://paseo.sh/docs/providers#where-to-go-next)Where to go next
  * [Supported providers](https://paseo.sh/docs/supported-providers), the full list with install links.
  * [Custom providers](https://paseo.sh/docs/custom-providers), add your own provider, point an existing one at a different endpoint, run multiple profiles, or override the binary in `~/.paseo/config.json`.
  * [paseo.sh/agents](https://paseo.sh/agents), per-agent landing page for each supported provider.

[View this page on GitHub](https://github.com/getpaseo/paseo/blob/main/public-docs/providers.md)
