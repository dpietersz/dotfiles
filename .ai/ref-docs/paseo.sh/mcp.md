---
title: "Paseo MCP"
description: "Paseo MCP tools injected into agents."
domain: "paseo.sh"
source: "https://paseo.sh/docs/mcp"
scraped_at: "2026-05-23T07:01:47Z"
---

[![Paseo](https://paseo.sh/logo.svg)Paseo](https://paseo.sh/)
[![Paseo](https://paseo.sh/logo.svg)Paseo](https://paseo.sh/)
[Getting started](https://paseo.sh/docs)[Why Paseo?](https://paseo.sh/docs/why)[Providers](https://paseo.sh/docs/providers)[Supported providers](https://paseo.sh/docs/supported-providers)[Custom providers](https://paseo.sh/docs/custom-providers)[CLI](https://paseo.sh/docs/cli)[Paseo MCP](https://paseo.sh/docs/mcp)[Git worktrees](https://paseo.sh/docs/worktrees)[Schedules](https://paseo.sh/docs/schedules)[Skills](https://paseo.sh/docs/skills)[Voice](https://paseo.sh/docs/voice)[Configuration](https://paseo.sh/docs/configuration)[Security](https://paseo.sh/docs/security)[Best practices](https://paseo.sh/docs/best-practices)
Alternatives
[Conductor](https://paseo.sh/docs/alternatives/conductor)[Superset](https://paseo.sh/docs/alternatives/superset)[OpenChamber](https://paseo.sh/docs/alternatives/openchamber)[Happy Coder](https://paseo.sh/docs/alternatives/happy-coder)
#  [#](https://paseo.sh/docs/mcp#paseo-mcp)Paseo MCP
Paseo can inject these MCP tools into every new agent it launches. Turn on **Inject Paseo tools** in host settings, or set `daemon.mcp.injectIntoAgents` to `true`.
The MCP server itself is controlled by `daemon.mcp.enabled`. Existing agents may need a reload.
##  [#](https://paseo.sh/docs/mcp#tools)Tools
###  [#](https://paseo.sh/docs/mcp#agents)Agents  
| Tool  | Function  |  
| --- | --- |  
| `create_agent`  | Create an agent tied to a working directory, optionally with initial settings or a new git worktree.  |  
| `wait_for_agent`  | Block until an agent requests permission or finishes its current run.  |  
| `send_agent_prompt`  | Send a task to a running agent.  |  
| `get_agent_status`  | Return the latest snapshot for an agent.  |  
| `list_agents`  | List recent agents as compact metadata.  |  
| `cancel_agent`  | Abort an agent's current run but keep the agent alive.  |  
| `archive_agent`  | Soft-delete an agent and remove it from the active list.  |  
| `kill_agent`  | Terminate an agent session permanently.  |  
| `update_agent`  | Update an agent name, labels, or runtime settings such as mode/model/thinking/features.  |  
| `get_agent_activity`  | Return recent agent timeline entries as a curated summary.  |  
| `set_agent_mode`  | Switch an agent's session mode.  |  
###  [#](https://paseo.sh/docs/mcp#terminals)Terminals  
| Tool  | Function  |  
| --- | --- |  
| `list_terminals`  | List terminal sessions for one working directory or all working directories.  |  
| `create_terminal`  | Create a terminal session for a working directory.  |  
| `kill_terminal`  | Kill a terminal session.  |  
| `capture_terminal`  | Capture plain-text output from a terminal session.  |  
| `send_terminal_keys`  | Send text or special key tokens to a terminal session.  |  
###  [#](https://paseo.sh/docs/mcp#schedules)Schedules  
| Tool  | Function  |  
| --- | --- |  
| `create_schedule`  | Create a recurring schedule that runs on an agent or a new agent.  |  
| `list_schedules`  | List schedules managed by the daemon.  |  
| `inspect_schedule`  | Inspect a schedule and its run history.  |  
| `pause_schedule`  | Pause an active schedule.  |  
| `resume_schedule`  | Resume a paused schedule.  |  
| `delete_schedule`  | Delete a schedule permanently.  |  
###  [#](https://paseo.sh/docs/mcp#providers)Providers  
| Tool  | Function  |  
| --- | --- |  
| `list_providers`  | List configured agent providers, availability, and modes.  |  
| `list_models`  | List models for an agent provider.  |  
| `inspect_provider`  | Inspect compact provider capabilities and draft feature settings.  |  
###  [#](https://paseo.sh/docs/mcp#worktrees)Worktrees  
| Tool  | Function  |  
| --- | --- |  
| `list_worktrees`  | List Paseo-managed git worktrees for a repository.  |  
| `create_worktree`  | Create a Paseo-managed git worktree from a branch, base branch, or GitHub PR.  |  
| `archive_worktree`  | Delete a Paseo-managed git worktree.  |  
###  [#](https://paseo.sh/docs/mcp#permissions)Permissions  
| Tool  | Function  |  
| --- | --- |  
| `list_pending_permissions`  | Return pending permission requests across agents.  |  
| `respond_to_permission`  | Approve or deny a pending permission request.  |  
###  [#](https://paseo.sh/docs/mcp#voice)Voice  
| Tool  | Function  |  
| --- | --- |  
| `speak`  | Speak text through daemon-managed voice output. Available only in voice-enabled sessions.  |  
[View this page on GitHub](https://github.com/getpaseo/paseo/blob/main/public-docs/mcp.md)
