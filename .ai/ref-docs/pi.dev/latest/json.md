---
title: "Pi Coding Agent"
description: "A terminal-based coding agent"
domain: "pi.dev"
source: "https://pi.dev/docs/latest/json"
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
[Event Types](https://pi.dev/docs/latest/json#event-types)[Message Types](https://pi.dev/docs/latest/json#message-types)[Output Format](https://pi.dev/docs/latest/json#output-format)[Example](https://pi.dev/docs/latest/json#example)
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
  1. [](https://pi.dev/docs/latest/json)
  2. [](https://pi.dev/docs/latest/json)
  3. [](https://pi.dev/docs/latest/json)
  4. [](https://pi.dev/docs/latest/json)
  5. [](https://pi.dev/docs/latest/json)
  6. [](https://pi.dev/docs/latest/json)
  7. [](https://pi.dev/docs/latest/json)
  8. [](https://pi.dev/docs/latest/json)
  9. [](https://pi.dev/docs/latest/json)
  10. [](https://pi.dev/docs/latest/json)


* [](https://pi.dev/docs/latest/json)
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
[Event Types](https://pi.dev/docs/latest/json#event-types)[Message Types](https://pi.dev/docs/latest/json#message-types)[Output Format](https://pi.dev/docs/latest/json#output-format)[Example](https://pi.dev/docs/latest/json#example)
On this page
[Event Types](https://pi.dev/docs/latest/json#event-types)[Message Types](https://pi.dev/docs/latest/json#message-types)[Output Format](https://pi.dev/docs/latest/json#output-format)[Example](https://pi.dev/docs/latest/json#example)
# JSON Event Stream Mode
Latest·[](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/json.md)·[](https://github.com/earendil-works/pi/edit/main/packages/coding-agent/docs/json.md)

```
pi --mode json "Your prompt"

```

Outputs all session events as JSON lines to stdout. Useful for integrating pi into other tools or custom UIs.
##  Event Types 
[ Copied ](https://pi.dev/docs/latest/json#event-types)
Events are defined in [`AgentSessionEvent`](https://github.com/earendil-works/pi-mono/blob/main/packages/coding-agent/src/core/agent-session.ts#L102):

```
type AgentSessionEvent =
  | AgentEvent
  | { type: "queue_update"; steering: readonly string[]; followUp: readonly string[] }
  | { type: "compaction_start"; reason: "manual" | "threshold" | "overflow" }
  | { type: "compaction_end"; reason: "manual" | "threshold" | "overflow"; result: CompactionResult | undefined; aborted: boolean; willRetry: boolean; errorMessage?: string }
  | { type: "auto_retry_start"; attempt: number; maxAttempts: number; delayMs: number; errorMessage: string }
  | { type: "auto_retry_end"; success: boolean; attempt: number; finalError?: string };

```

`queue_update` emits the full pending steering and follow-up queues whenever they change. `compaction_start` and `compaction_end` cover both manual and automatic compaction.
Base events from [`AgentEvent`](https://github.com/earendil-works/pi-mono/blob/main/packages/agent/src/types.ts#L179):

```
type AgentEvent =
  // Agent lifecycle
  | { type: "agent_start" }
  | { type: "agent_end"; messages: AgentMessage[] }
  // Turn lifecycle
  | { type: "turn_start" }
  | { type: "turn_end"; message: AgentMessage; toolResults: ToolResultMessage[] }
  // Message lifecycle
  | { type: "message_start"; message: AgentMessage }
  | { type: "message_update"; message: AgentMessage; assistantMessageEvent: AssistantMessageEvent }
  | { type: "message_end"; message: AgentMessage }
  // Tool execution
  | { type: "tool_execution_start"; toolCallId: string; toolName: string; args: any }
  | { type: "tool_execution_update"; toolCallId: string; toolName: string; args: any; partialResult: any }
  | { type: "tool_execution_end"; toolCallId: string; toolName: string; result: any; isError: boolean };

```

##  Message Types 
[ Copied ](https://pi.dev/docs/latest/json#message-types)
Base messages from [`packages/ai/src/types.ts`](https://github.com/earendil-works/pi-mono/blob/main/packages/ai/src/types.ts#L134):
  * `UserMessage` (line 134)
  * `AssistantMessage` (line 140)
  * `ToolResultMessage` (line 152)


Extended messages from [`packages/coding-agent/src/core/messages.ts`](https://github.com/earendil-works/pi-mono/blob/main/packages/coding-agent/src/core/messages.ts#L29):
  * `BashExecutionMessage` (line 29)
  * `CustomMessage` (line 46)
  * `BranchSummaryMessage` (line 55)
  * `CompactionSummaryMessage` (line 62)


##  Output Format 
[ Copied ](https://pi.dev/docs/latest/json#output-format)
Each line is a JSON object. The first line is the session header:

```
{"type":"session","version":3,"id":"uuid","timestamp":"...","cwd":"/path"}

```

Followed by events as they occur:

```
{"type":"agent_start"}
{"type":"turn_start"}
{"type":"message_start","message":{"role":"assistant","content":[],...}}
{"type":"message_update","message":{...},"assistantMessageEvent":{"type":"text_delta","delta":"Hello",...}}
{"type":"message_end","message":{...}}
{"type":"turn_end","message":{...},"toolResults":[]}
{"type":"agent_end","messages":[...]}

```

##  Example 
[ Copied ](https://pi.dev/docs/latest/json#example)

```
pi --mode json "List files" 2>/dev/null | jq -c 'select(.type == "message_end")'

```

[Earendil Inc.](https://earendil.com/) & Contributors
[Press Kit](https://pi.dev/press-kit)
MIT License
[](https://github.com/earendil-works/pi/tree/main/packages/coding-agent "GitHub")[](https://www.npmjs.com/package/@earendil-works/pi-coding-agent "npm")[](https://discord.com/invite/3cU7Bz4UPx "Discord")
[](https://earendil.com "Earendil Inc. website")AutoLightDark
pi.dev domain graciously donated by [exe.dev](https://exe.dev)
