---
title: "CLI"
description: "Paseo CLI reference: manage agents, daemons, permissions, and worktrees from your terminal."
domain: "paseo.sh"
source: "https://paseo.sh/docs/cli"
scraped_at: "2026-05-23T07:01:47Z"
---

[![Paseo](https://paseo.sh/logo.svg)Paseo](https://paseo.sh/)
[![Paseo](https://paseo.sh/logo.svg)Paseo](https://paseo.sh/)
[Getting started](https://paseo.sh/docs)[Why Paseo?](https://paseo.sh/docs/why)[Providers](https://paseo.sh/docs/providers)[Supported providers](https://paseo.sh/docs/supported-providers)[Custom providers](https://paseo.sh/docs/custom-providers)[CLI](https://paseo.sh/docs/cli)[Paseo MCP](https://paseo.sh/docs/mcp)[Git worktrees](https://paseo.sh/docs/worktrees)[Schedules](https://paseo.sh/docs/schedules)[Skills](https://paseo.sh/docs/skills)[Voice](https://paseo.sh/docs/voice)[Configuration](https://paseo.sh/docs/configuration)[Security](https://paseo.sh/docs/security)[Best practices](https://paseo.sh/docs/best-practices)
Alternatives
[Conductor](https://paseo.sh/docs/alternatives/conductor)[Superset](https://paseo.sh/docs/alternatives/superset)[OpenChamber](https://paseo.sh/docs/alternatives/openchamber)[Happy Coder](https://paseo.sh/docs/alternatives/happy-coder)
#  [#](https://paseo.sh/docs/cli#cli)CLI
The Paseo CLI lets you manage agents from your terminal. It's the same interface exposed by the daemon's API, so anything you can do in the app you can do from the command line.
> **Agent orchestration:** You can tell coding agents to use the Paseo CLI to spawn and manage other agents. This enables multi-agent workflows where one agent delegates subtasks to others and waits for results.
##  [#](https://paseo.sh/docs/cli#quick-reference)Quick reference

```
paseo run "fix the tests"            # Start an agent
paseo ls                             # List running agents
paseo attach <id>                    # Stream agent output
paseo send <id> "also fix linting"   # Send follow-up task
paseo logs <id>                      # View agent timeline
paseo stop <id>                      # Stop an agent
```

##  [#](https://paseo.sh/docs/cli#running-agents)Running agents
Use `paseo run` to start a new agent with a task:

```
paseo run "implement user authentication"
paseo run --provider codex "refactor the API layer"
paseo run --detach "run the full test suite"  # background
paseo run --worktree feature-x "implement feature X"
paseo run --output-schema schema.json "extract release notes"
paseo run --output-schema '{"type":"object","properties":{"summary":{"type":"string"}},"required":["summary"]}' "summarize release notes"
```

The `--worktree` flag creates the agent in an isolated git worktree, useful for parallel feature development.
Use `--output-schema` to return only matching JSON output. You can pass a schema file path or an inline JSON schema object. This mode cannot be used with `--detach`.
By default, `paseo run` waits for completion. Use `--detach` to run in the background.
##  [#](https://paseo.sh/docs/cli#listing-agents)Listing agents

```
paseo ls                    # Running agents in current directory
paseo ls -a                 # Include completed/stopped agents
paseo ls -g                 # All directories
paseo ls -a -g --json       # Full list as JSON
```

##  [#](https://paseo.sh/docs/cli#streaming-output)Streaming output
Use `paseo attach` to stream an agent's output in real-time:

```
paseo attach abc123   # Attach to agent (Ctrl+C to detach)
```

Agent IDs can be shortened, `abc` works if it's unambiguous.
##  [#](https://paseo.sh/docs/cli#sending-messages)Sending messages
Send follow-up tasks to a running or idle agent:

```
paseo send <id> "now run the tests"
paseo send <id> --image screenshot.png "what's wrong here?"
paseo send <id> --no-wait "queue this task"
```

##  [#](https://paseo.sh/docs/cli#viewing-logs)Viewing logs

```
paseo logs <id>                  # Full timeline
paseo logs <id> -f               # Follow (streaming)
paseo logs <id> --tail 10        # Last 10 entries
paseo logs <id> --filter tools   # Only tool calls
```

##  [#](https://paseo.sh/docs/cli#waiting-for-agents)Waiting for agents
Block until an agent finishes its current task:

```
paseo wait <id>
paseo wait <id> --timeout 60   # 60 second timeout
```

Useful in scripts or when one agent needs to wait for another.
##  [#](https://paseo.sh/docs/cli#permissions)Permissions
Agents may request permission for certain actions. Manage these from the CLI:

```
paseo permit ls                # List pending requests
paseo permit allow <id>        # Allow all pending for agent
paseo permit deny <id> --all   # Deny all pending
```

##  [#](https://paseo.sh/docs/cli#agent-modes)Agent modes
Change an agent's operational mode (provider-specific):

```
paseo agent mode <id> --list   # Show available modes
paseo agent mode <id> bypass   # Set bypass mode
paseo agent mode <id> plan     # Set plan mode
```

##  [#](https://paseo.sh/docs/cli#daemon-management)Daemon management

```
paseo daemon start             # Start the daemon
paseo daemon status            # Check status
paseo daemon stop              # Stop the daemon
```

Use `PASEO_HOME` to run multiple isolated daemon instances.
##  [#](https://paseo.sh/docs/cli#connecting-to-a-remote-daemon)Connecting to a remote daemon
`--host` accepts either a local target (`host:port`, a unix socket, or a Windows pipe) or a pairing offer URL, the same `https://app.paseo.sh/#offer=...` link the mobile app uses for QR pairing. With an offer URL the CLI connects through the Paseo relay with end-to-end encryption, so you can drive a daemon on another machine without exposing it to the network.
Get an offer URL from the daemon you want to control:

```
paseo daemon pair --json   # prints { url, qr, ... }
```

Use it from anywhere:

```
paseo ls --host 'https://app.paseo.sh/#offer=eyJ2IjoyLC...'
paseo run --host "$OFFER_URL" "fix the failing tests"
```

You can also set it once via `PASEO_HOST` instead of passing `--host` on every command.
##  [#](https://paseo.sh/docs/cli#multi-agent-workflows)Multi-agent workflows
The CLI is designed to be used by agents themselves. You can instruct an agent to spawn sub-agents for parallel work:

```
# Agent A spawns Agent B and waits for it
paseo run --detach "implement the API" --name api-agent
paseo wait api-agent
paseo logs api-agent --tail 5
```

Simple implement + verify loop:

```
# Requires jq
while true; do
  paseo run --provider codex "make the tests pass" >/dev/null

  verdict=$(paseo run --provider claude --output-schema '{"type":"object","properties":{"criteria_met":{"type":"boolean"}},"required":["criteria_met"],"additionalProperties":false}' "ensure tests all pass")
  if echo "$verdict" | jq -e '.criteria_met == true' >/dev/null; then
    echo "criteria met"
    break
  fi
done
```

This pattern enables hierarchical task decomposition, a lead agent can break down work, delegate to specialists, and synthesize results.
##  [#](https://paseo.sh/docs/cli#output-formats)Output formats
Most commands support multiple output formats for scripting:

```
paseo ls --json                # JSON output
paseo ls --format yaml         # YAML output
paseo ls -q                    # IDs only (quiet)
```

##  [#](https://paseo.sh/docs/cli#global-options)Global options
  * `--host <target>`, connect to a different daemon (`host:port`, unix socket, or `https://app.paseo.sh/#offer=...` for relay). See [Connecting to a remote daemon](https://paseo.sh/docs/cli#connecting-to-a-remote-daemon).
  * `--json`, JSON output
  * `-q, --quiet`, minimal output
  * `--no-color`, disable colors

[View this page on GitHub](https://github.com/getpaseo/paseo/blob/main/public-docs/cli.md)
