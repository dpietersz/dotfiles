---
title: "Pi Coding Agent"
description: "A terminal-based coding agent"
domain: "pi.dev"
source: "https://pi.dev/docs/latest/rpc"
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
[Starting RPC Mode](https://pi.dev/docs/latest/rpc#starting-rpc-mode)[Protocol Overview](https://pi.dev/docs/latest/rpc#protocol-overview)[Framing](https://pi.dev/docs/latest/rpc#framing)[Commands](https://pi.dev/docs/latest/rpc#commands)[Prompting](https://pi.dev/docs/latest/rpc#prompting)[State](https://pi.dev/docs/latest/rpc#state)[Model](https://pi.dev/docs/latest/rpc#model)[Thinking](https://pi.dev/docs/latest/rpc#thinking)[Queue Modes](https://pi.dev/docs/latest/rpc#queue-modes)[Compaction](https://pi.dev/docs/latest/rpc#compaction)[Retry](https://pi.dev/docs/latest/rpc#retry)[Bash](https://pi.dev/docs/latest/rpc#bash)[Session](https://pi.dev/docs/latest/rpc#session)[Commands](https://pi.dev/docs/latest/rpc#commands-1)[Events](https://pi.dev/docs/latest/rpc#events)[Event Types](https://pi.dev/docs/latest/rpc#event-types)[agent_start](https://pi.dev/docs/latest/rpc#agent-start)[agent_end](https://pi.dev/docs/latest/rpc#agent-end)[turn_start / turn_end](https://pi.dev/docs/latest/rpc#turn-start-turn-end)[message_start / message_end](https://pi.dev/docs/latest/rpc#message-start-message-end)[message_update (Streaming)](https://pi.dev/docs/latest/rpc#message-update-streaming)[tool_execution_start / tool_execution_update / tool_execution_end](https://pi.dev/docs/latest/rpc#tool-execution-start-tool-execution-update-tool-execution-end)[queue_update](https://pi.dev/docs/latest/rpc#queue-update)[compaction_start / compaction_end](https://pi.dev/docs/latest/rpc#compaction-start-compaction-end)[auto_retry_start / auto_retry_end](https://pi.dev/docs/latest/rpc#auto-retry-start-auto-retry-end)[extension_error](https://pi.dev/docs/latest/rpc#extension-error)[Extension UI Protocol](https://pi.dev/docs/latest/rpc#extension-ui-protocol)[Extension UI Requests (stdout)](https://pi.dev/docs/latest/rpc#extension-ui-requests-stdout)[Extension UI Responses (stdin)](https://pi.dev/docs/latest/rpc#extension-ui-responses-stdin)[Error Handling](https://pi.dev/docs/latest/rpc#error-handling)[Types](https://pi.dev/docs/latest/rpc#types)[Model](https://pi.dev/docs/latest/rpc#model-1)[UserMessage](https://pi.dev/docs/latest/rpc#usermessage)[AssistantMessage](https://pi.dev/docs/latest/rpc#assistantmessage)[ToolResultMessage](https://pi.dev/docs/latest/rpc#toolresultmessage)[BashExecutionMessage](https://pi.dev/docs/latest/rpc#bashexecutionmessage)[Attachment](https://pi.dev/docs/latest/rpc#attachment)[Example: Basic Client (Python)](https://pi.dev/docs/latest/rpc#example-basic-client-python)[Example: Interactive Client (Node.js)](https://pi.dev/docs/latest/rpc#example-interactive-client-node-js)
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
  1. [](https://pi.dev/docs/latest/rpc)
  2. [](https://pi.dev/docs/latest/rpc)
  3. [](https://pi.dev/docs/latest/rpc)
  4. [](https://pi.dev/docs/latest/rpc)
  5. [](https://pi.dev/docs/latest/rpc)
  6. [](https://pi.dev/docs/latest/rpc)
  7. [](https://pi.dev/docs/latest/rpc)
  8. [](https://pi.dev/docs/latest/rpc)
  9. [](https://pi.dev/docs/latest/rpc)
  10. [](https://pi.dev/docs/latest/rpc)


* [](https://pi.dev/docs/latest/rpc)
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
[Starting RPC Mode](https://pi.dev/docs/latest/rpc#starting-rpc-mode)[Protocol Overview](https://pi.dev/docs/latest/rpc#protocol-overview)[Framing](https://pi.dev/docs/latest/rpc#framing)[Commands](https://pi.dev/docs/latest/rpc#commands)[Prompting](https://pi.dev/docs/latest/rpc#prompting)[State](https://pi.dev/docs/latest/rpc#state)[Model](https://pi.dev/docs/latest/rpc#model)[Thinking](https://pi.dev/docs/latest/rpc#thinking)[Queue Modes](https://pi.dev/docs/latest/rpc#queue-modes)[Compaction](https://pi.dev/docs/latest/rpc#compaction)[Retry](https://pi.dev/docs/latest/rpc#retry)[Bash](https://pi.dev/docs/latest/rpc#bash)[Session](https://pi.dev/docs/latest/rpc#session)[Commands](https://pi.dev/docs/latest/rpc#commands-1)[Events](https://pi.dev/docs/latest/rpc#events)[Event Types](https://pi.dev/docs/latest/rpc#event-types)[agent_start](https://pi.dev/docs/latest/rpc#agent-start)[agent_end](https://pi.dev/docs/latest/rpc#agent-end)[turn_start / turn_end](https://pi.dev/docs/latest/rpc#turn-start-turn-end)[message_start / message_end](https://pi.dev/docs/latest/rpc#message-start-message-end)[message_update (Streaming)](https://pi.dev/docs/latest/rpc#message-update-streaming)[tool_execution_start / tool_execution_update / tool_execution_end](https://pi.dev/docs/latest/rpc#tool-execution-start-tool-execution-update-tool-execution-end)[queue_update](https://pi.dev/docs/latest/rpc#queue-update)[compaction_start / compaction_end](https://pi.dev/docs/latest/rpc#compaction-start-compaction-end)[auto_retry_start / auto_retry_end](https://pi.dev/docs/latest/rpc#auto-retry-start-auto-retry-end)[extension_error](https://pi.dev/docs/latest/rpc#extension-error)[Extension UI Protocol](https://pi.dev/docs/latest/rpc#extension-ui-protocol)[Extension UI Requests (stdout)](https://pi.dev/docs/latest/rpc#extension-ui-requests-stdout)[Extension UI Responses (stdin)](https://pi.dev/docs/latest/rpc#extension-ui-responses-stdin)[Error Handling](https://pi.dev/docs/latest/rpc#error-handling)[Types](https://pi.dev/docs/latest/rpc#types)[Model](https://pi.dev/docs/latest/rpc#model-1)[UserMessage](https://pi.dev/docs/latest/rpc#usermessage)[AssistantMessage](https://pi.dev/docs/latest/rpc#assistantmessage)[ToolResultMessage](https://pi.dev/docs/latest/rpc#toolresultmessage)[BashExecutionMessage](https://pi.dev/docs/latest/rpc#bashexecutionmessage)[Attachment](https://pi.dev/docs/latest/rpc#attachment)[Example: Basic Client (Python)](https://pi.dev/docs/latest/rpc#example-basic-client-python)[Example: Interactive Client (Node.js)](https://pi.dev/docs/latest/rpc#example-interactive-client-node-js)
On this page
[Starting RPC Mode](https://pi.dev/docs/latest/rpc#starting-rpc-mode)[Protocol Overview](https://pi.dev/docs/latest/rpc#protocol-overview)[Framing](https://pi.dev/docs/latest/rpc#framing)[Commands](https://pi.dev/docs/latest/rpc#commands)[Prompting](https://pi.dev/docs/latest/rpc#prompting)[State](https://pi.dev/docs/latest/rpc#state)[Model](https://pi.dev/docs/latest/rpc#model)[Thinking](https://pi.dev/docs/latest/rpc#thinking)[Queue Modes](https://pi.dev/docs/latest/rpc#queue-modes)[Compaction](https://pi.dev/docs/latest/rpc#compaction)[Retry](https://pi.dev/docs/latest/rpc#retry)[Bash](https://pi.dev/docs/latest/rpc#bash)[Session](https://pi.dev/docs/latest/rpc#session)[Commands](https://pi.dev/docs/latest/rpc#commands-1)[Events](https://pi.dev/docs/latest/rpc#events)[Event Types](https://pi.dev/docs/latest/rpc#event-types)[agent_start](https://pi.dev/docs/latest/rpc#agent-start)[agent_end](https://pi.dev/docs/latest/rpc#agent-end)[turn_start / turn_end](https://pi.dev/docs/latest/rpc#turn-start-turn-end)[message_start / message_end](https://pi.dev/docs/latest/rpc#message-start-message-end)[message_update (Streaming)](https://pi.dev/docs/latest/rpc#message-update-streaming)[tool_execution_start / tool_execution_update / tool_execution_end](https://pi.dev/docs/latest/rpc#tool-execution-start-tool-execution-update-tool-execution-end)[queue_update](https://pi.dev/docs/latest/rpc#queue-update)[compaction_start / compaction_end](https://pi.dev/docs/latest/rpc#compaction-start-compaction-end)[auto_retry_start / auto_retry_end](https://pi.dev/docs/latest/rpc#auto-retry-start-auto-retry-end)[extension_error](https://pi.dev/docs/latest/rpc#extension-error)[Extension UI Protocol](https://pi.dev/docs/latest/rpc#extension-ui-protocol)[Extension UI Requests (stdout)](https://pi.dev/docs/latest/rpc#extension-ui-requests-stdout)[Extension UI Responses (stdin)](https://pi.dev/docs/latest/rpc#extension-ui-responses-stdin)[Error Handling](https://pi.dev/docs/latest/rpc#error-handling)[Types](https://pi.dev/docs/latest/rpc#types)[Model](https://pi.dev/docs/latest/rpc#model-1)[UserMessage](https://pi.dev/docs/latest/rpc#usermessage)[AssistantMessage](https://pi.dev/docs/latest/rpc#assistantmessage)[ToolResultMessage](https://pi.dev/docs/latest/rpc#toolresultmessage)[BashExecutionMessage](https://pi.dev/docs/latest/rpc#bashexecutionmessage)[Attachment](https://pi.dev/docs/latest/rpc#attachment)[Example: Basic Client (Python)](https://pi.dev/docs/latest/rpc#example-basic-client-python)[Example: Interactive Client (Node.js)](https://pi.dev/docs/latest/rpc#example-interactive-client-node-js)
# RPC Mode
Latest·[](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/rpc.md)·[](https://github.com/earendil-works/pi/edit/main/packages/coding-agent/docs/rpc.md)
RPC mode enables headless operation of the coding agent via a JSON protocol over stdin/stdout. This is useful for embedding the agent in other applications, IDEs, or custom UIs.
**Note for Node.js/TypeScript users** : If you're building a Node.js application, consider using `AgentSession` directly from `@earendil-works/pi-coding-agent` instead of spawning a subprocess. See [`src/core/agent-session.ts`](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/src/core/agent-session.ts) for the API. For a subprocess-based TypeScript client, see [`src/modes/rpc/rpc-client.ts`](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/src/modes/rpc/rpc-client.ts).
##  Starting RPC Mode 
[ Copied ](https://pi.dev/docs/latest/rpc#starting-rpc-mode)

```
pi --mode rpc [options]

```

Common options:
  * `--provider <name>`: Set the LLM provider (anthropic, openai, google, etc.)
  * `--model <pattern>`: Model pattern or ID (supports `provider/id` and optional `:<thinking>`)
  * `--name <name>` / `-n <name>`: Set the session display name at startup
  * `--no-session`: Disable session persistence
  * `--session-dir <path>`: Custom session storage directory


##  Protocol Overview 
[ Copied ](https://pi.dev/docs/latest/rpc#protocol-overview)
  * **Commands** : JSON objects sent to stdin, one per line
  * **Responses** : JSON objects with `type: "response"` indicating command success/failure
  * **Events** : Agent events streamed to stdout as JSON lines


All commands support an optional `id` field for request/response correlation. If provided, the corresponding response will include the same `id`.
###  Framing 
[ Copied ](https://pi.dev/docs/latest/rpc#framing)
RPC mode uses strict JSONL semantics with LF (`\n`) as the only record delimiter.
This matters for clients:
  * Split records on `\n` only
  * Accept optional `\r\n` input by stripping a trailing `\r`
  * Do not use generic line readers that treat Unicode separators as newlines


In particular, Node `readline` is not protocol-compliant for RPC mode because it also splits on `U+2028` and `U+2029`, which are valid inside JSON strings.
##  Commands 
[ Copied ](https://pi.dev/docs/latest/rpc#commands)
###  Prompting 
[ Copied ](https://pi.dev/docs/latest/rpc#prompting)
####  prompt 
[ Copied ](https://pi.dev/docs/latest/rpc#prompt)
Send a user prompt to the agent. The command response is emitted after the prompt is accepted, queued, or handled. Events continue streaming asynchronously after acceptance.

```
{"id": "req-1", "type": "prompt", "message": "Hello, world!"}

```

With images:

```
{"type": "prompt", "message": "What's in this image?", "images": [{"type": "image", "data": "base64-encoded-data", "mimeType": "image/png"}]}

```

**During streaming** : If the agent is already streaming, you must specify `streamingBehavior` to queue the message:

```
{"type": "prompt", "message": "New instruction", "streamingBehavior": "steer"}

```

  * `"steer"`: Queue the message while the agent is running. It is delivered after the current assistant turn finishes executing its tool calls, before the next LLM call.
  * `"followUp"`: Wait until the agent finishes. Message is delivered only when agent stops.


If the agent is streaming and no `streamingBehavior` is specified, the command returns an error.
**Extension commands** : If the message is an extension command (e.g., `/mycommand`), it executes immediately even during streaming. Extension commands manage their own LLM interaction via `pi.sendMessage()`.
**Input expansion** : Skill commands (`/skill:name`) and prompt templates (`/template`) are expanded before sending/queueing.
Response:

```
{"id": "req-1", "type": "response", "command": "prompt", "success": true}

```

`success: true` means the prompt was accepted, queued, or handled immediately. `success: false` means the prompt was rejected before acceptance. Failures after acceptance are reported through the normal event and message stream, not as a second `response` for the same request id.
The `images` field is optional. Each image uses `ImageContent` format: `{"type": "image", "data": "base64-encoded-data", "mimeType": "image/png"}`.
####  steer 
[ Copied ](https://pi.dev/docs/latest/rpc#steer)
Queue a steering message while the agent is running. It is delivered after the current assistant turn finishes executing its tool calls, before the next LLM call. Skill commands and prompt templates are expanded. Extension commands are not allowed (use `prompt` instead).

```
{"type": "steer", "message": "Stop and do this instead"}

```

With images:

```
{"type": "steer", "message": "Look at this instead", "images": [{"type": "image", "data": "base64-encoded-data", "mimeType": "image/png"}]}

```

The `images` field is optional. Each image uses `ImageContent` format (same as `prompt`).
Response:

```
{"type": "response", "command": "steer", "success": true}

```

See [set_steering_mode](https://pi.dev/docs/latest/rpc#set_steering_mode) for controlling how steering messages are processed.
####  follow_up 
[ Copied ](https://pi.dev/docs/latest/rpc#follow-up)
Queue a follow-up message to be processed after the agent finishes. Delivered only when agent has no more tool calls or steering messages. Skill commands and prompt templates are expanded. Extension commands are not allowed (use `prompt` instead).

```
{"type": "follow_up", "message": "After you're done, also do this"}

```

With images:

```
{"type": "follow_up", "message": "Also check this image", "images": [{"type": "image", "data": "base64-encoded-data", "mimeType": "image/png"}]}

```

The `images` field is optional. Each image uses `ImageContent` format (same as `prompt`).
Response:

```
{"type": "response", "command": "follow_up", "success": true}

```

See [set_follow_up_mode](https://pi.dev/docs/latest/rpc#set_follow_up_mode) for controlling how follow-up messages are processed.
####  abort 
[ Copied ](https://pi.dev/docs/latest/rpc#abort)
Abort the current agent operation.

```
{"type": "abort"}

```

Response:

```
{"type": "response", "command": "abort", "success": true}

```

####  new_session 
[ Copied ](https://pi.dev/docs/latest/rpc#new-session)
Start a fresh session. Can be cancelled by a `session_before_switch` extension event handler.

```
{"type": "new_session"}

```

With optional parent session tracking:

```
{"type": "new_session", "parentSession": "/path/to/parent-session.jsonl"}

```

Response:

```
{"type": "response", "command": "new_session", "success": true, "data": {"cancelled": false}}

```

If an extension cancelled:

```
{"type": "response", "command": "new_session", "success": true, "data": {"cancelled": true}}

```

###  State 
[ Copied ](https://pi.dev/docs/latest/rpc#state)
####  get_state 
[ Copied ](https://pi.dev/docs/latest/rpc#get-state)
Get current session state.

```
{"type": "get_state"}

```

Response:

```
{
  "type": "response",
  "command": "get_state",
  "success": true,
  "data": {
    "model": {...},
    "thinkingLevel": "medium",
    "isStreaming": false,
    "isCompacting": false,
    "steeringMode": "all",
    "followUpMode": "one-at-a-time",
    "sessionFile": "/path/to/session.jsonl",
    "sessionId": "abc123",
    "sessionName": "my-feature-work",
    "autoCompactionEnabled": true,
    "messageCount": 5,
    "pendingMessageCount": 0
  }
}

```

The `model` field is a full [Model](https://pi.dev/docs/latest/rpc#model) object or `null`. The `sessionName` field is the display name set via `set_session_name`, or omitted if not set.
####  get_messages 
[ Copied ](https://pi.dev/docs/latest/rpc#get-messages)
Get all messages in the conversation.

```
{"type": "get_messages"}

```

Response:

```
{
  "type": "response",
  "command": "get_messages",
  "success": true,
  "data": {"messages": [...]}
}

```

Messages are `AgentMessage` objects (see [Message Types](https://pi.dev/docs/latest/rpc#message-types)).
###  Model 
[ Copied ](https://pi.dev/docs/latest/rpc#model)
####  set_model 
[ Copied ](https://pi.dev/docs/latest/rpc#set-model)
Switch to a specific model.

```
{"type": "set_model", "provider": "anthropic", "modelId": "claude-sonnet-4-20250514"}

```

Response contains the full [Model](https://pi.dev/docs/latest/rpc#model) object:

```
{
  "type": "response",
  "command": "set_model",
  "success": true,
  "data": {...}
}

```

####  cycle_model 
[ Copied ](https://pi.dev/docs/latest/rpc#cycle-model)
Cycle to the next available model. Returns `null` data if only one model available.

```
{"type": "cycle_model"}

```

Response:

```
{
  "type": "response",
  "command": "cycle_model",
  "success": true,
  "data": {
    "model": {...},
    "thinkingLevel": "medium",
    "isScoped": false
  }
}

```

The `model` field is a full [Model](https://pi.dev/docs/latest/rpc#model) object.
####  get_available_models 
[ Copied ](https://pi.dev/docs/latest/rpc#get-available-models)
List all configured models.

```
{"type": "get_available_models"}

```

Response contains an array of full [Model](https://pi.dev/docs/latest/rpc#model) objects:

```
{
  "type": "response",
  "command": "get_available_models",
  "success": true,
  "data": {
    "models": [...]
  }
}

```

###  Thinking 
[ Copied ](https://pi.dev/docs/latest/rpc#thinking)
####  set_thinking_level 
[ Copied ](https://pi.dev/docs/latest/rpc#set-thinking-level)
Set the reasoning/thinking level for models that support it.

```
{"type": "set_thinking_level", "level": "high"}

```

Levels: `"off"`, `"minimal"`, `"low"`, `"medium"`, `"high"`, `"xhigh"`
Note: `"xhigh"` is only supported by OpenAI codex-max models.
Response:

```
{"type": "response", "command": "set_thinking_level", "success": true}

```

####  cycle_thinking_level 
[ Copied ](https://pi.dev/docs/latest/rpc#cycle-thinking-level)
Cycle through available thinking levels. Returns `null` data if model doesn't support thinking.

```
{"type": "cycle_thinking_level"}

```

Response:

```
{
  "type": "response",
  "command": "cycle_thinking_level",
  "success": true,
  "data": {"level": "high"}
}

```

###  Queue Modes 
[ Copied ](https://pi.dev/docs/latest/rpc#queue-modes)
####  set_steering_mode 
[ Copied ](https://pi.dev/docs/latest/rpc#set-steering-mode)
Control how steering messages (from `steer`) are delivered.

```
{"type": "set_steering_mode", "mode": "one-at-a-time"}

```

Modes:
  * `"all"`: Deliver all steering messages after the current assistant turn finishes executing its tool calls
  * `"one-at-a-time"`: Deliver one steering message per completed assistant turn (default)


Response:

```
{"type": "response", "command": "set_steering_mode", "success": true}

```

####  set_follow_up_mode 
[ Copied ](https://pi.dev/docs/latest/rpc#set-follow-up-mode)
Control how follow-up messages (from `follow_up`) are delivered.

```
{"type": "set_follow_up_mode", "mode": "one-at-a-time"}

```

Modes:
  * `"all"`: Deliver all follow-up messages when agent finishes
  * `"one-at-a-time"`: Deliver one follow-up message per agent completion (default)


Response:

```
{"type": "response", "command": "set_follow_up_mode", "success": true}

```

###  Compaction 
[ Copied ](https://pi.dev/docs/latest/rpc#compaction)
####  compact 
[ Copied ](https://pi.dev/docs/latest/rpc#compact)
Manually compact conversation context to reduce token usage.

```
{"type": "compact"}

```

With custom instructions:

```
{"type": "compact", "customInstructions": "Focus on code changes"}

```

Response:

```
{
  "type": "response",
  "command": "compact",
  "success": true,
  "data": {
    "summary": "Summary of conversation...",
    "firstKeptEntryId": "abc123",
    "tokensBefore": 150000,
    "details": {}
  }
}

```

####  set_auto_compaction 
[ Copied ](https://pi.dev/docs/latest/rpc#set-auto-compaction)
Enable or disable automatic compaction when context is nearly full.

```
{"type": "set_auto_compaction", "enabled": true}

```

Response:

```
{"type": "response", "command": "set_auto_compaction", "success": true}

```

###  Retry 
[ Copied ](https://pi.dev/docs/latest/rpc#retry)
####  set_auto_retry 
[ Copied ](https://pi.dev/docs/latest/rpc#set-auto-retry)
Enable or disable automatic retry on transient errors (overloaded, rate limit, 5xx).

```
{"type": "set_auto_retry", "enabled": true}

```

Response:

```
{"type": "response", "command": "set_auto_retry", "success": true}

```

####  abort_retry 
[ Copied ](https://pi.dev/docs/latest/rpc#abort-retry)
Abort an in-progress retry (cancel the delay and stop retrying).

```
{"type": "abort_retry"}

```

Response:

```
{"type": "response", "command": "abort_retry", "success": true}

```

###  Bash 
[ Copied ](https://pi.dev/docs/latest/rpc#bash)
####  bash 
[ Copied ](https://pi.dev/docs/latest/rpc#bash-1)
Execute a shell command and add output to conversation context.

```
{"type": "bash", "command": "ls -la"}

```

Response:

```
{
  "type": "response",
  "command": "bash",
  "success": true,
  "data": {
    "output": "total 48\ndrwxr-xr-x ...",
    "exitCode": 0,
    "cancelled": false,
    "truncated": false
  }
}

```

If output was truncated, includes `fullOutputPath`:

```
{
  "type": "response",
  "command": "bash",
  "success": true,
  "data": {
    "output": "truncated output...",
    "exitCode": 0,
    "cancelled": false,
    "truncated": true,
    "fullOutputPath": "/tmp/pi-bash-abc123.log"
  }
}

```

**How bash results reach the LLM:**
The `bash` command executes immediately and returns a `BashResult`. Internally, a `BashExecutionMessage` is created and stored in the agent's message state. This message does NOT emit an event.
When the next `prompt` command is sent, all messages (including `BashExecutionMessage`) are transformed before being sent to the LLM. The `BashExecutionMessage` is converted to a `UserMessage` with this format:

```
Ran `ls -la`
```
total 48
drwxr-xr-x ...
```

```

This means:
  1. Bash output is included in the LLM context on the **next prompt** , not immediately
  2. Multiple bash commands can be executed before a prompt; all outputs will be included
  3. No event is emitted for the `BashExecutionMessage` itself


####  abort_bash 
[ Copied ](https://pi.dev/docs/latest/rpc#abort-bash)
Abort a running bash command.

```
{"type": "abort_bash"}

```

Response:

```
{"type": "response", "command": "abort_bash", "success": true}

```

###  Session 
[ Copied ](https://pi.dev/docs/latest/rpc#session)
####  get_session_stats 
[ Copied ](https://pi.dev/docs/latest/rpc#get-session-stats)
Get token usage, cost statistics, and current context window usage.

```
{"type": "get_session_stats"}

```

Response:

```
{
  "type": "response",
  "command": "get_session_stats",
  "success": true,
  "data": {
    "sessionFile": "/path/to/session.jsonl",
    "sessionId": "abc123",
    "userMessages": 5,
    "assistantMessages": 5,
    "toolCalls": 12,
    "toolResults": 12,
    "totalMessages": 22,
    "tokens": {
      "input": 50000,
      "output": 10000,
      "cacheRead": 40000,
      "cacheWrite": 5000,
      "total": 105000
    },
    "cost": 0.45,
    "contextUsage": {
      "tokens": 60000,
      "contextWindow": 200000,
      "percent": 30
    }
  }
}

```

`tokens` contains assistant usage totals for the current session state. `contextUsage` contains the actual current context-window estimate used for compaction and footer display.
`contextUsage` is omitted when no model or context window is available. `contextUsage.tokens` and `contextUsage.percent` are `null` immediately after compaction until a fresh post-compaction assistant response provides valid usage data.
####  export_html 
[ Copied ](https://pi.dev/docs/latest/rpc#export-html)
Export session to an HTML file.

```
{"type": "export_html"}

```

With custom path:

```
{"type": "export_html", "outputPath": "/tmp/session.html"}

```

Response:

```
{
  "type": "response",
  "command": "export_html",
  "success": true,
  "data": {"path": "/tmp/session.html"}
}

```

####  switch_session 
[ Copied ](https://pi.dev/docs/latest/rpc#switch-session)
Load a different session file. Can be cancelled by a `session_before_switch` extension event handler.

```
{"type": "switch_session", "sessionPath": "/path/to/session.jsonl"}

```

Response:

```
{"type": "response", "command": "switch_session", "success": true, "data": {"cancelled": false}}

```

If an extension cancelled the switch:

```
{"type": "response", "command": "switch_session", "success": true, "data": {"cancelled": true}}

```

####  fork 
[ Copied ](https://pi.dev/docs/latest/rpc#fork)
Create a new fork from a previous user message on the active branch. Can be cancelled by a `session_before_fork` extension event handler. Returns the text of the message being forked from.

```
{"type": "fork", "entryId": "abc123"}

```

Response:

```
{
  "type": "response",
  "command": "fork",
  "success": true,
  "data": {"text": "The original prompt text...", "cancelled": false}
}

```

If an extension cancelled the fork:

```
{
  "type": "response",
  "command": "fork",
  "success": true,
  "data": {"text": "The original prompt text...", "cancelled": true}
}

```

####  clone 
[ Copied ](https://pi.dev/docs/latest/rpc#clone)
Duplicate the current active branch into a new session at the current position. Can be cancelled by a `session_before_fork` extension event handler.

```
{"type": "clone"}

```

Response:

```
{
  "type": "response",
  "command": "clone",
  "success": true,
  "data": {"cancelled": false}
}

```

If an extension cancelled the clone:

```
{
  "type": "response",
  "command": "clone",
  "success": true,
  "data": {"cancelled": true}
}

```

####  get_fork_messages 
[ Copied ](https://pi.dev/docs/latest/rpc#get-fork-messages)
Get user messages available for forking.

```
{"type": "get_fork_messages"}

```

Response:

```
{
  "type": "response",
  "command": "get_fork_messages",
  "success": true,
  "data": {
    "messages": [
      {"entryId": "abc123", "text": "First prompt..."},
      {"entryId": "def456", "text": "Second prompt..."}
    ]
  }
}

```

####  get_last_assistant_text 
[ Copied ](https://pi.dev/docs/latest/rpc#get-last-assistant-text)
Get the text content of the last assistant message.

```
{"type": "get_last_assistant_text"}

```

Response:

```
{
  "type": "response",
  "command": "get_last_assistant_text",
  "success": true,
  "data": {"text": "The assistant's response..."}
}

```

Returns `{"text": null}` if no assistant messages exist.
####  set_session_name 
[ Copied ](https://pi.dev/docs/latest/rpc#set-session-name)
Set a display name for the current session. The name appears in session listings and helps identify sessions.

```
{"type": "set_session_name", "name": "my-feature-work"}

```

Response:

```
{
  "type": "response",
  "command": "set_session_name",
  "success": true
}

```

The current session name is available via `get_state` in the `sessionName` field. To set the initial name when starting RPC mode, pass `--name <name>` or `-n <name>` to the `pi --mode rpc` process.
###  Commands 
[ Copied ](https://pi.dev/docs/latest/rpc#commands-1)
####  get_commands 
[ Copied ](https://pi.dev/docs/latest/rpc#get-commands)
Get available commands (extension commands, prompt templates, and skills). These can be invoked via the `prompt` command by prefixing with `/`.

```
{"type": "get_commands"}

```

Response:

```
{
  "type": "response",
  "command": "get_commands",
  "success": true,
  "data": {
    "commands": [
      {"name": "session-name", "description": "Set or clear session name", "source": "extension", "path": "/home/user/.pi/agent/extensions/session.ts"},
      {"name": "fix-tests", "description": "Fix failing tests", "source": "prompt", "location": "project", "path": "/home/user/myproject/.pi/agent/prompts/fix-tests.md"},
      {"name": "skill:brave-search", "description": "Web search via Brave API", "source": "skill", "location": "user", "path": "/home/user/.pi/agent/skills/brave-search/SKILL.md"}
    ]
  }
}

```

Each command has:
  * `name`: Command name (invoke with `/name`)
  * `description`: Human-readable description (optional for extension commands)
  * `source`: What kind of command:
    * `"extension"`: Registered via `pi.registerCommand()` in an extension
    * `"prompt"`: Loaded from a prompt template `.md` file
    * `"skill"`: Loaded from a skill directory (name is prefixed with `skill:`)
  * `location`: Where it was loaded from (optional, not present for extensions):
    * `"user"`: User-level (`~/.pi/agent/`)
    * `"project"`: Project-level (`./.pi/agent/`)
    * `"path"`: Explicit path via CLI or settings
  * `path`: Absolute file path to the command source (optional)


**Note** : Built-in TUI commands (`/settings`, `/hotkeys`, etc.) are not included. They are handled only in interactive mode and would not execute if sent via `prompt`.
##  Events 
[ Copied ](https://pi.dev/docs/latest/rpc#events)
Events are streamed to stdout as JSON lines during agent operation. Events do NOT include an `id` field (only responses do).
###  Event Types 
[ Copied ](https://pi.dev/docs/latest/rpc#event-types)  
| Event  | Description  |  
| --- | --- |  
| `agent_start`  | Agent begins processing  |  
| `agent_end`  | Agent completes (includes all generated messages)  |  
| `turn_start`  | New turn begins  |  
| `turn_end`  | Turn completes (includes assistant message and tool results)  |  
| `message_start`  | Message begins  |  
| `message_update`  | Streaming update (text/thinking/toolcall deltas)  |  
| `message_end`  | Message completes  |  
| `tool_execution_start`  | Tool begins execution  |  
| `tool_execution_update`  | Tool execution progress (streaming output)  |  
| `tool_execution_end`  | Tool completes  |  
| `queue_update`  | Pending steering/follow-up queue changed  |  
| `compaction_start`  | Compaction begins  |  
| `compaction_end`  | Compaction completes  |  
| `auto_retry_start`  | Auto-retry begins (after transient error)  |  
| `auto_retry_end`  | Auto-retry completes (success or final failure)  |  
| `extension_error`  | Extension threw an error  |  
###  agent_start 
[ Copied ](https://pi.dev/docs/latest/rpc#agent-start)
Emitted when the agent begins processing a prompt.

```
{"type": "agent_start"}

```

###  agent_end 
[ Copied ](https://pi.dev/docs/latest/rpc#agent-end)
Emitted when the agent completes. Contains all messages generated during this run.

```
{
  "type": "agent_end",
  "messages": [...]
}

```

###  turn_start / turn_end 
[ Copied ](https://pi.dev/docs/latest/rpc#turn-start-turn-end)
A turn consists of one assistant response plus any resulting tool calls and results.

```
{"type": "turn_start"}

```

```
{
  "type": "turn_end",
  "message": {...},
  "toolResults": [...]
}

```

###  message_start / message_end 
[ Copied ](https://pi.dev/docs/latest/rpc#message-start-message-end)
Emitted when a message begins and completes. The `message` field contains an `AgentMessage`.

```
{"type": "message_start", "message": {...}}
{"type": "message_end", "message": {...}}

```

###  message_update (Streaming) 
[ Copied ](https://pi.dev/docs/latest/rpc#message-update-streaming)
Emitted during streaming of assistant messages. Contains both the partial message and a streaming delta event.

```
{
  "type": "message_update",
  "message": {...},
  "assistantMessageEvent": {
    "type": "text_delta",
    "contentIndex": 0,
    "delta": "Hello ",
    "partial": {...}
  }
}

```

The `assistantMessageEvent` field contains one of these delta types:  
| Type  | Description  |  
| --- | --- |  
| `start`  | Message generation started  |  
| `text_start`  | Text content block started  |  
| `text_delta`  | Text content chunk  |  
| `text_end`  | Text content block ended  |  
| `thinking_start`  | Thinking block started  |  
| `thinking_delta`  | Thinking content chunk  |  
| `thinking_end`  | Thinking block ended  |  
| `toolcall_start`  | Tool call started  |  
| `toolcall_delta`  | Tool call arguments chunk  |  
| `toolcall_end`  | Tool call ended (includes full `toolCall` object)  |  
| `done`  | Message complete (reason: `"stop"`, `"length"`, `"toolUse"`)  |  
| `error`  | Error occurred (reason: `"aborted"`, `"error"`)  |  
Example streaming a text response:

```
{"type":"message_update","message":{...},"assistantMessageEvent":{"type":"text_start","contentIndex":0,"partial":{...}}}
{"type":"message_update","message":{...},"assistantMessageEvent":{"type":"text_delta","contentIndex":0,"delta":"Hello","partial":{...}}}
{"type":"message_update","message":{...},"assistantMessageEvent":{"type":"text_delta","contentIndex":0,"delta":" world","partial":{...}}}
{"type":"message_update","message":{...},"assistantMessageEvent":{"type":"text_end","contentIndex":0,"content":"Hello world","partial":{...}}}

```

###  tool_execution_start / tool_execution_update / tool_execution_end 
[ Copied ](https://pi.dev/docs/latest/rpc#tool-execution-start-tool-execution-update-tool-execution-end)
Emitted when a tool begins, streams progress, and completes execution.

```
{
  "type": "tool_execution_start",
  "toolCallId": "call_abc123",
  "toolName": "bash",
  "args": {"command": "ls -la"}
}

```

During execution, `tool_execution_update` events stream partial results (e.g., bash output as it arrives):

```
{
  "type": "tool_execution_update",
  "toolCallId": "call_abc123",
  "toolName": "bash",
  "args": {"command": "ls -la"},
  "partialResult": {
    "content": [{"type": "text", "text": "partial output so far..."}],
    "details": {"truncation": null, "fullOutputPath": null}
  }
}

```

When complete:

```
{
  "type": "tool_execution_end",
  "toolCallId": "call_abc123",
  "toolName": "bash",
  "result": {
    "content": [{"type": "text", "text": "total 48\n..."}],
    "details": {...}
  },
  "isError": false
}

```

Use `toolCallId` to correlate events. The `partialResult` in `tool_execution_update` contains the accumulated output so far (not just the delta), allowing clients to simply replace their display on each update.
###  queue_update 
[ Copied ](https://pi.dev/docs/latest/rpc#queue-update)
Emitted whenever the pending steering or follow-up queue changes.

```
{
  "type": "queue_update",
  "steering": ["Focus on error handling"],
  "followUp": ["After that, summarize the result"]
}

```

###  compaction_start / compaction_end 
[ Copied ](https://pi.dev/docs/latest/rpc#compaction-start-compaction-end)
Emitted when compaction runs, whether manual or automatic.

```
{"type": "compaction_start", "reason": "threshold"}

```

The `reason` field is `"manual"`, `"threshold"`, or `"overflow"`.

```
{
  "type": "compaction_end",
  "reason": "threshold",
  "result": {
    "summary": "Summary of conversation...",
    "firstKeptEntryId": "abc123",
    "tokensBefore": 150000,
    "details": {}
  },
  "aborted": false,
  "willRetry": false
}

```

If `reason` was `"overflow"` and compaction succeeds, `willRetry` is `true` and the agent will automatically retry the prompt.
If compaction was aborted, `result` is `null` and `aborted` is `true`.
If compaction failed (e.g., API quota exceeded), `result` is `null`, `aborted` is `false`, and `errorMessage` contains the error description.
###  auto_retry_start / auto_retry_end 
[ Copied ](https://pi.dev/docs/latest/rpc#auto-retry-start-auto-retry-end)
Emitted when automatic retry is triggered after a transient error (overloaded, rate limit, 5xx).

```
{
  "type": "auto_retry_start",
  "attempt": 1,
  "maxAttempts": 3,
  "delayMs": 2000,
  "errorMessage": "529 {\"type\":\"error\",\"error\":{\"type\":\"overloaded_error\",\"message\":\"Overloaded\"}}"
}

```

```
{
  "type": "auto_retry_end",
  "success": true,
  "attempt": 2
}

```

On final failure (max retries exceeded):

```
{
  "type": "auto_retry_end",
  "success": false,
  "attempt": 3,
  "finalError": "529 overloaded_error: Overloaded"
}

```

###  extension_error 
[ Copied ](https://pi.dev/docs/latest/rpc#extension-error)
Emitted when an extension throws an error.

```
{
  "type": "extension_error",
  "extensionPath": "/path/to/extension.ts",
  "event": "tool_call",
  "error": "Error message..."
}

```

##  Extension UI Protocol 
[ Copied ](https://pi.dev/docs/latest/rpc#extension-ui-protocol)
Extensions can request user interaction via `ctx.ui.select()`, `ctx.ui.confirm()`, etc. In RPC mode, these are translated into a request/response sub-protocol on top of the base command/event flow.
There are two categories of extension UI methods:
  * **Dialog methods** (`select`, `confirm`, `input`, `editor`): emit an `extension_ui_request` on stdout and block until the client sends back an `extension_ui_response` on stdin with the matching `id`.
  * **Fire-and-forget methods** (`notify`, `setStatus`, `setWidget`, `setTitle`, `set_editor_text`): emit an `extension_ui_request` on stdout but do not expect a response. The client can display the information or ignore it.


If a dialog method includes a `timeout` field, the agent-side will auto-resolve with a default value when the timeout expires. The client does not need to track timeouts.
Some `ExtensionUIContext` methods are not supported or degraded in RPC mode because they require direct TUI access:
  * `custom()` returns `undefined`
  * `setWorkingMessage()`, `setWorkingIndicator()`, `setFooter()`, `setHeader()`, `setEditorComponent()`, `setToolsExpanded()` are no-ops
  * `getEditorText()` returns `""`
  * `getToolsExpanded()` returns `false`
  * `pasteToEditor()` delegates to `setEditorText()` (no paste/collapse handling)
  * `getAllThemes()` returns `[]`
  * `getTheme()` returns `undefined`
  * `setTheme()` returns `{ success: false, error: "..." }`


Note: `ctx.mode` is `"rpc"` and `ctx.hasUI` is `true` in RPC mode because the dialog and fire-and-forget methods are functional via the extension UI sub-protocol. Use `ctx.mode === "tui"` to guard TUI-specific features like `custom()` that require a real terminal.
###  Extension UI Requests (stdout) 
[ Copied ](https://pi.dev/docs/latest/rpc#extension-ui-requests-stdout)
All requests have `type: "extension_ui_request"`, a unique `id`, and a `method` field.
####  select 
[ Copied ](https://pi.dev/docs/latest/rpc#select)
Prompt the user to choose from a list. Dialog methods with a `timeout` field include the timeout in milliseconds; the agent auto-resolves with `undefined` if the client doesn't respond in time.

```
{
  "type": "extension_ui_request",
  "id": "uuid-1",
  "method": "select",
  "title": "Allow dangerous command?",
  "options": ["Allow", "Block"],
  "timeout": 10000
}

```

Expected response: `extension_ui_response` with `value` (the selected option string) or `cancelled: true`.
####  confirm 
[ Copied ](https://pi.dev/docs/latest/rpc#confirm)
Prompt the user for yes/no confirmation.

```
{
  "type": "extension_ui_request",
  "id": "uuid-2",
  "method": "confirm",
  "title": "Clear session?",
  "message": "All messages will be lost.",
  "timeout": 5000
}

```

Expected response: `extension_ui_response` with `confirmed: true/false` or `cancelled: true`.
####  input 
[ Copied ](https://pi.dev/docs/latest/rpc#input)
Prompt the user for free-form text.

```
{
  "type": "extension_ui_request",
  "id": "uuid-3",
  "method": "input",
  "title": "Enter a value",
  "placeholder": "type something..."
}

```

Expected response: `extension_ui_response` with `value` (the entered text) or `cancelled: true`.
####  editor 
[ Copied ](https://pi.dev/docs/latest/rpc#editor)
Open a multi-line text editor with optional prefilled content.

```
{
  "type": "extension_ui_request",
  "id": "uuid-4",
  "method": "editor",
  "title": "Edit some text",
  "prefill": "Line 1\nLine 2\nLine 3"
}

```

Expected response: `extension_ui_response` with `value` (the edited text) or `cancelled: true`.
####  notify 
[ Copied ](https://pi.dev/docs/latest/rpc#notify)
Display a notification. Fire-and-forget, no response expected.

```
{
  "type": "extension_ui_request",
  "id": "uuid-5",
  "method": "notify",
  "message": "Command blocked by user",
  "notifyType": "warning"
}

```

The `notifyType` field is `"info"`, `"warning"`, or `"error"`. Defaults to `"info"` if omitted.
####  setStatus 
[ Copied ](https://pi.dev/docs/latest/rpc#setstatus)
Set or clear a status entry in the footer/status bar. Fire-and-forget.

```
{
  "type": "extension_ui_request",
  "id": "uuid-6",
  "method": "setStatus",
  "statusKey": "my-ext",
  "statusText": "Turn 3 running..."
}

```

Send `statusText: undefined` (or omit it) to clear the status entry for that key.
####  setWidget 
[ Copied ](https://pi.dev/docs/latest/rpc#setwidget)
Set or clear a widget (block of text lines) displayed above or below the editor. Fire-and-forget.

```
{
  "type": "extension_ui_request",
  "id": "uuid-7",
  "method": "setWidget",
  "widgetKey": "my-ext",
  "widgetLines": ["--- My Widget ---", "Line 1", "Line 2"],
  "widgetPlacement": "aboveEditor"
}

```

Send `widgetLines: undefined` (or omit it) to clear the widget. The `widgetPlacement` field is `"aboveEditor"` (default) or `"belowEditor"`. Only string arrays are supported in RPC mode; component factories are ignored.
####  setTitle 
[ Copied ](https://pi.dev/docs/latest/rpc#settitle)
Set the terminal window/tab title. Fire-and-forget.

```
{
  "type": "extension_ui_request",
  "id": "uuid-8",
  "method": "setTitle",
  "title": "pi - my project"
}

```

####  set_editor_text 
[ Copied ](https://pi.dev/docs/latest/rpc#set-editor-text)
Set the text in the input editor. Fire-and-forget.

```
{
  "type": "extension_ui_request",
  "id": "uuid-9",
  "method": "set_editor_text",
  "text": "prefilled text for the user"
}

```

###  Extension UI Responses (stdin) 
[ Copied ](https://pi.dev/docs/latest/rpc#extension-ui-responses-stdin)
Responses are sent for dialog methods only (`select`, `confirm`, `input`, `editor`). The `id` must match the request.
####  Value response (select, input, editor) 
[ Copied ](https://pi.dev/docs/latest/rpc#value-response-select-input-editor)

```
{"type": "extension_ui_response", "id": "uuid-1", "value": "Allow"}

```

####  Confirmation response (confirm) 
[ Copied ](https://pi.dev/docs/latest/rpc#confirmation-response-confirm)

```
{"type": "extension_ui_response", "id": "uuid-2", "confirmed": true}

```

####  Cancellation response (any dialog) 
[ Copied ](https://pi.dev/docs/latest/rpc#cancellation-response-any-dialog)
Dismiss any dialog method. The extension receives `undefined` (for select/input/editor) or `false` (for confirm).

```
{"type": "extension_ui_response", "id": "uuid-3", "cancelled": true}

```

##  Error Handling 
[ Copied ](https://pi.dev/docs/latest/rpc#error-handling)
Failed commands return a response with `success: false`:

```
{
  "type": "response",
  "command": "set_model",
  "success": false,
  "error": "Model not found: invalid/model"
}

```

Parse errors:

```
{
  "type": "response",
  "command": "parse",
  "success": false,
  "error": "Failed to parse command: Unexpected token..."
}

```

##  Types 
[ Copied ](https://pi.dev/docs/latest/rpc#types)
Source files:
  * [`packages/ai/src/types.ts`](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/ai/src/types.ts) - `Model`, `UserMessage`, `AssistantMessage`, `ToolResultMessage`
  * [`packages/agent/src/types.ts`](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/agent/src/types.ts) - `AgentMessage`, `AgentEvent`
  * [`src/core/messages.ts`](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/src/core/messages.ts) - `BashExecutionMessage`
  * [`src/modes/rpc/rpc-types.ts`](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/src/modes/rpc/rpc-types.ts) - RPC command/response types, extension UI request/response types


###  Model 
[ Copied ](https://pi.dev/docs/latest/rpc#model-1)

```
{
  "id": "claude-sonnet-4-20250514",
  "name": "Claude Sonnet 4",
  "api": "anthropic-messages",
  "provider": "anthropic",
  "baseUrl": "https://api.anthropic.com",
  "reasoning": true,
  "input": ["text", "image"],
  "contextWindow": 200000,
  "maxTokens": 16384,
  "cost": {
    "input": 3.0,
    "output": 15.0,
    "cacheRead": 0.3,
    "cacheWrite": 3.75
  }
}

```

###  UserMessage 
[ Copied ](https://pi.dev/docs/latest/rpc#usermessage)

```
{
  "role": "user",
  "content": "Hello!",
  "timestamp": 1733234567890,
  "attachments": []
}

```

The `content` field can be a string or an array of `TextContent`/`ImageContent` blocks.
###  AssistantMessage 
[ Copied ](https://pi.dev/docs/latest/rpc#assistantmessage)

```
{
  "role": "assistant",
  "content": [
    {"type": "text", "text": "Hello! How can I help?"},
    {"type": "thinking", "thinking": "User is greeting me..."},
    {"type": "toolCall", "id": "call_123", "name": "bash", "arguments": {"command": "ls"}}
  ],
  "api": "anthropic-messages",
  "provider": "anthropic",
  "model": "claude-sonnet-4-20250514",
  "usage": {
    "input": 100,
    "output": 50,
    "cacheRead": 0,
    "cacheWrite": 0,
    "cost": {"input": 0.0003, "output": 0.00075, "cacheRead": 0, "cacheWrite": 0, "total": 0.00105}
  },
  "stopReason": "stop",
  "timestamp": 1733234567890
}

```

Stop reasons: `"stop"`, `"length"`, `"toolUse"`, `"error"`, `"aborted"`
###  ToolResultMessage 
[ Copied ](https://pi.dev/docs/latest/rpc#toolresultmessage)

```
{
  "role": "toolResult",
  "toolCallId": "call_123",
  "toolName": "bash",
  "content": [{"type": "text", "text": "total 48\ndrwxr-xr-x ..."}],
  "isError": false,
  "timestamp": 1733234567890
}

```

###  BashExecutionMessage 
[ Copied ](https://pi.dev/docs/latest/rpc#bashexecutionmessage)
Created by the `bash` RPC command (not by LLM tool calls):

```
{
  "role": "bashExecution",
  "command": "ls -la",
  "output": "total 48\ndrwxr-xr-x ...",
  "exitCode": 0,
  "cancelled": false,
  "truncated": false,
  "fullOutputPath": null,
  "timestamp": 1733234567890
}

```

###  Attachment 
[ Copied ](https://pi.dev/docs/latest/rpc#attachment)

```
{
  "id": "img1",
  "type": "image",
  "fileName": "photo.jpg",
  "mimeType": "image/jpeg",
  "size": 102400,
  "content": "base64-encoded-data...",
  "extractedText": null,
  "preview": null
}

```

##  Example: Basic Client (Python) 
[ Copied ](https://pi.dev/docs/latest/rpc#example-basic-client-python)

```
import subprocess
import json

proc = subprocess.Popen(
    ["pi", "--mode", "rpc", "--no-session"],
    stdin=subprocess.PIPE,
    stdout=subprocess.PIPE,
    text=True
)

def send(cmd):
    proc.stdin.write(json.dumps(cmd) + "\n")
    proc.stdin.flush()

def read_events():
    for line in proc.stdout:
        yield json.loads(line)

# Send prompt
send({"type": "prompt", "message": "Hello!"})

# Process events
for event in read_events():
    if event.get("type") == "message_update":
        delta = event.get("assistantMessageEvent", {})
        if delta.get("type") == "text_delta":
            print(delta["delta"], end="", flush=True)
    
    if event.get("type") == "agent_end":
        print()
        break

```

##  Example: Interactive Client (Node.js) 
[ Copied ](https://pi.dev/docs/latest/rpc#example-interactive-client-node-js)
See [`test/rpc-example.ts`](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/test/rpc-example.ts) for a complete interactive example, or [`src/modes/rpc/rpc-client.ts`](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/src/modes/rpc/rpc-client.ts) for a typed client implementation.
For a complete example of handling the extension UI protocol, see [`examples/rpc-extension-ui.ts`](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/examples/rpc-extension-ui.ts) which pairs with the [`examples/extensions/rpc-demo.ts`](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/examples/extensions/rpc-demo.ts) extension.

```
const { spawn } = require("child_process");
const { StringDecoder } = require("string_decoder");

const agent = spawn("pi", ["--mode", "rpc", "--no-session"]);

function attachJsonlReader(stream, onLine) {
    const decoder = new StringDecoder("utf8");
    let buffer = "";

    stream.on("data", (chunk) => {
        buffer += typeof chunk === "string" ? chunk : decoder.write(chunk);

        while (true) {
            const newlineIndex = buffer.indexOf("\n");
            if (newlineIndex === -1) break;

            let line = buffer.slice(0, newlineIndex);
            buffer = buffer.slice(newlineIndex + 1);
            if (line.endsWith("\r")) line = line.slice(0, -1);
            onLine(line);
        }
    });

    stream.on("end", () => {
        buffer += decoder.end();
        if (buffer.length > 0) {
            onLine(buffer.endsWith("\r") ? buffer.slice(0, -1) : buffer);
        }
    });
}

attachJsonlReader(agent.stdout, (line) => {
    const event = JSON.parse(line);

    if (event.type === "message_update") {
        const { assistantMessageEvent } = event;
        if (assistantMessageEvent.type === "text_delta") {
            process.stdout.write(assistantMessageEvent.delta);
        }
    }
});

// Send prompt
agent.stdin.write(JSON.stringify({ type: "prompt", message: "Hello" }) + "\n");

// Abort on Ctrl+C
process.on("SIGINT", () => {
    agent.stdin.write(JSON.stringify({ type: "abort" }) + "\n");
});

```

[Earendil Inc.](https://earendil.com/) & Contributors
[Press Kit](https://pi.dev/press-kit)
MIT License
[](https://github.com/earendil-works/pi/tree/main/packages/coding-agent "GitHub")[](https://www.npmjs.com/package/@earendil-works/pi-coding-agent "npm")[](https://discord.com/invite/3cU7Bz4UPx "Discord")
[](https://earendil.com "Earendil Inc. website")AutoLightDark
pi.dev domain graciously donated by [exe.dev](https://exe.dev)
