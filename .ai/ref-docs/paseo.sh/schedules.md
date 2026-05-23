---
title: "Schedules"
description: "Run Paseo agents on intervals or cron."
domain: "paseo.sh"
source: "https://paseo.sh/docs/schedules"
scraped_at: "2026-05-23T07:01:47Z"
---

[![Paseo](https://paseo.sh/logo.svg)Paseo](https://paseo.sh/)
[![Paseo](https://paseo.sh/logo.svg)Paseo](https://paseo.sh/)
[Getting started](https://paseo.sh/docs)[Why Paseo?](https://paseo.sh/docs/why)[Providers](https://paseo.sh/docs/providers)[Supported providers](https://paseo.sh/docs/supported-providers)[Custom providers](https://paseo.sh/docs/custom-providers)[CLI](https://paseo.sh/docs/cli)[Paseo MCP](https://paseo.sh/docs/mcp)[Git worktrees](https://paseo.sh/docs/worktrees)[Schedules](https://paseo.sh/docs/schedules)[Skills](https://paseo.sh/docs/skills)[Voice](https://paseo.sh/docs/voice)[Configuration](https://paseo.sh/docs/configuration)[Security](https://paseo.sh/docs/security)[Best practices](https://paseo.sh/docs/best-practices)
Alternatives
[Conductor](https://paseo.sh/docs/alternatives/conductor)[Superset](https://paseo.sh/docs/alternatives/superset)[OpenChamber](https://paseo.sh/docs/alternatives/openchamber)[Happy Coder](https://paseo.sh/docs/alternatives/happy-coder)
#  [#](https://paseo.sh/docs/schedules#schedules)Schedules
Schedules let agents come back later.
Think of a schedule as a standing instruction: at this cadence, run this prompt, in this repo, with this agent target.
The target can be:
  * A new agent each time, useful for fresh daily jobs and long-running watchers.
  * An existing agent, useful when you want continuity.
  * The same agent that created the schedule, useful for heartbeats from inside an agent.


Schedules can use interval cadence, like every 30 minutes, or cron cadence, like every weekday morning. Runs are recorded, can be inspected later, and can be paused, resumed, triggered once, updated, or deleted.
##  [#](https://paseo.sh/docs/schedules#uses)Uses
  * **Overnight refactoring loops:** wake an agent every 30 minutes to continue a scoped refactor, run checks, and leave notes.
  * **Heartbeats:** have the same agent periodically reassess state and keep moving.
  * **Long build babysitting:** check CI, EAS, Docker, or release builds until they pass.
  * **Daily GitHub triage:** scan issues, PRs, notifications, and flaky checks every morning.
  * **Maintenance sweeps:** refresh dependencies, audit docs, clean stale branches, or summarize repo health.


##  [#](https://paseo.sh/docs/schedules#setup-examples)Setup Examples
Overnight refactor on Codex:

```
paseo schedule create \
  --every 30m \
  --name overnight-refactor \
  --provider codex/gpt-5.5 \
  --cwd ~/dev/my-app \
  --max-runs 16 \
  --expires-in 10h \
  "Continue the refactor. Run the focused checks. Leave a short status note."
```

Long build babysitter on Claude:

```
paseo schedule create \
  --every 5m \
  --name build-watch \
  --provider claude/opus-4.7 \
  --cwd ~/dev/my-app \
  --max-runs 24 \
  "Check the release build. If it failed, inspect logs, fix the cause, and rerun."
```

Daily GitHub triage on GLM through OpenCode:

```
paseo schedule create \
  --cron "0 14 * * 1-5" \
  --run-now \
  --name github-triage \
  --provider opencode/openrouter/glm-5.1 \
  --cwd ~/dev/my-app \
  "Triage GitHub issues, PRs, and failing checks. Summarize what needs attention."
```

Heartbeat the current agent:

```
paseo schedule create \
  --every 20m \
  --target self \
  --name heartbeat \
  "Check the current task state and continue with the next useful step."
```

##  [#](https://paseo.sh/docs/schedules#managing-schedules)Managing Schedules

```
paseo schedule ls
paseo schedule inspect <id>
paseo schedule logs <id>
paseo schedule pause <id>
paseo schedule resume <id>
paseo schedule run-once <id>
paseo schedule update <id> --every 10m --max-runs 6
paseo schedule delete <id>
```

Use `--every <duration>` for intervals and `--cron "<expr>"` for 5-field UTC cron. Interval schedules run once immediately by default; pass `--no-run-now` to wait for the first interval. Cron schedules wait for the next matching time; pass `--run-now` to fire once immediately.
When targeting a remote daemon with `--host`, pass `--cwd`; your local working directory may not exist on the remote machine.
##  [#](https://paseo.sh/docs/schedules#mcp)MCP
Agents can create and manage schedules through [Paseo MCP](https://paseo.sh/docs/mcp).
[View this page on GitHub](https://github.com/getpaseo/paseo/blob/main/public-docs/schedules.md)
