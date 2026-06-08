---
title: "Pi Coding Agent"
description: "A terminal-based coding agent"
domain: "pi.dev"
source: "https://pi.dev/docs/latest/session-format"
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
[File Location](https://pi.dev/docs/latest/session-format#file-location)[Deleting Sessions](https://pi.dev/docs/latest/session-format#deleting-sessions)[Session Version](https://pi.dev/docs/latest/session-format#session-version)[Source Files](https://pi.dev/docs/latest/session-format#source-files)[Message Types](https://pi.dev/docs/latest/session-format#message-types)[Content Blocks](https://pi.dev/docs/latest/session-format#content-blocks)[Base Message Types (from pi-ai)](https://pi.dev/docs/latest/session-format#base-message-types-from-pi-ai)[Extended Message Types (from pi-coding-agent)](https://pi.dev/docs/latest/session-format#extended-message-types-from-pi-coding-agent)[AgentMessage Union](https://pi.dev/docs/latest/session-format#agentmessage-union)[Entry Base](https://pi.dev/docs/latest/session-format#entry-base)[Entry Types](https://pi.dev/docs/latest/session-format#entry-types)[SessionHeader](https://pi.dev/docs/latest/session-format#sessionheader)[SessionMessageEntry](https://pi.dev/docs/latest/session-format#sessionmessageentry)[ModelChangeEntry](https://pi.dev/docs/latest/session-format#modelchangeentry)[ThinkingLevelChangeEntry](https://pi.dev/docs/latest/session-format#thinkinglevelchangeentry)[CompactionEntry](https://pi.dev/docs/latest/session-format#compactionentry)[BranchSummaryEntry](https://pi.dev/docs/latest/session-format#branchsummaryentry)[CustomEntry](https://pi.dev/docs/latest/session-format#customentry)[CustomMessageEntry](https://pi.dev/docs/latest/session-format#custommessageentry)[LabelEntry](https://pi.dev/docs/latest/session-format#labelentry)[SessionInfoEntry](https://pi.dev/docs/latest/session-format#sessioninfoentry)[Tree Structure](https://pi.dev/docs/latest/session-format#tree-structure)[Context Building](https://pi.dev/docs/latest/session-format#context-building)[Parsing Example](https://pi.dev/docs/latest/session-format#parsing-example)[SessionManager API](https://pi.dev/docs/latest/session-format#sessionmanager-api)[Static Creation Methods](https://pi.dev/docs/latest/session-format#static-creation-methods)[Static Listing Methods](https://pi.dev/docs/latest/session-format#static-listing-methods)[Instance Methods - Session Management](https://pi.dev/docs/latest/session-format#instance-methods-session-management)[Instance Methods - Appending (all return entry ID)](https://pi.dev/docs/latest/session-format#instance-methods-appending-all-return-entry-id)[Instance Methods - Tree Navigation](https://pi.dev/docs/latest/session-format#instance-methods-tree-navigation)[Instance Methods - Context & Info](https://pi.dev/docs/latest/session-format#instance-methods-context-info)
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
  1. [](https://pi.dev/docs/latest/session-format)
  2. [](https://pi.dev/docs/latest/session-format)
  3. [](https://pi.dev/docs/latest/session-format)
  4. [](https://pi.dev/docs/latest/session-format)
  5. [](https://pi.dev/docs/latest/session-format)
  6. [](https://pi.dev/docs/latest/session-format)
  7. [](https://pi.dev/docs/latest/session-format)
  8. [](https://pi.dev/docs/latest/session-format)
  9. [](https://pi.dev/docs/latest/session-format)
  10. [](https://pi.dev/docs/latest/session-format)


* [](https://pi.dev/docs/latest/session-format)
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
[File Location](https://pi.dev/docs/latest/session-format#file-location)[Deleting Sessions](https://pi.dev/docs/latest/session-format#deleting-sessions)[Session Version](https://pi.dev/docs/latest/session-format#session-version)[Source Files](https://pi.dev/docs/latest/session-format#source-files)[Message Types](https://pi.dev/docs/latest/session-format#message-types)[Content Blocks](https://pi.dev/docs/latest/session-format#content-blocks)[Base Message Types (from pi-ai)](https://pi.dev/docs/latest/session-format#base-message-types-from-pi-ai)[Extended Message Types (from pi-coding-agent)](https://pi.dev/docs/latest/session-format#extended-message-types-from-pi-coding-agent)[AgentMessage Union](https://pi.dev/docs/latest/session-format#agentmessage-union)[Entry Base](https://pi.dev/docs/latest/session-format#entry-base)[Entry Types](https://pi.dev/docs/latest/session-format#entry-types)[SessionHeader](https://pi.dev/docs/latest/session-format#sessionheader)[SessionMessageEntry](https://pi.dev/docs/latest/session-format#sessionmessageentry)[ModelChangeEntry](https://pi.dev/docs/latest/session-format#modelchangeentry)[ThinkingLevelChangeEntry](https://pi.dev/docs/latest/session-format#thinkinglevelchangeentry)[CompactionEntry](https://pi.dev/docs/latest/session-format#compactionentry)[BranchSummaryEntry](https://pi.dev/docs/latest/session-format#branchsummaryentry)[CustomEntry](https://pi.dev/docs/latest/session-format#customentry)[CustomMessageEntry](https://pi.dev/docs/latest/session-format#custommessageentry)[LabelEntry](https://pi.dev/docs/latest/session-format#labelentry)[SessionInfoEntry](https://pi.dev/docs/latest/session-format#sessioninfoentry)[Tree Structure](https://pi.dev/docs/latest/session-format#tree-structure)[Context Building](https://pi.dev/docs/latest/session-format#context-building)[Parsing Example](https://pi.dev/docs/latest/session-format#parsing-example)[SessionManager API](https://pi.dev/docs/latest/session-format#sessionmanager-api)[Static Creation Methods](https://pi.dev/docs/latest/session-format#static-creation-methods)[Static Listing Methods](https://pi.dev/docs/latest/session-format#static-listing-methods)[Instance Methods - Session Management](https://pi.dev/docs/latest/session-format#instance-methods-session-management)[Instance Methods - Appending (all return entry ID)](https://pi.dev/docs/latest/session-format#instance-methods-appending-all-return-entry-id)[Instance Methods - Tree Navigation](https://pi.dev/docs/latest/session-format#instance-methods-tree-navigation)[Instance Methods - Context & Info](https://pi.dev/docs/latest/session-format#instance-methods-context-info)
On this page
[File Location](https://pi.dev/docs/latest/session-format#file-location)[Deleting Sessions](https://pi.dev/docs/latest/session-format#deleting-sessions)[Session Version](https://pi.dev/docs/latest/session-format#session-version)[Source Files](https://pi.dev/docs/latest/session-format#source-files)[Message Types](https://pi.dev/docs/latest/session-format#message-types)[Content Blocks](https://pi.dev/docs/latest/session-format#content-blocks)[Base Message Types (from pi-ai)](https://pi.dev/docs/latest/session-format#base-message-types-from-pi-ai)[Extended Message Types (from pi-coding-agent)](https://pi.dev/docs/latest/session-format#extended-message-types-from-pi-coding-agent)[AgentMessage Union](https://pi.dev/docs/latest/session-format#agentmessage-union)[Entry Base](https://pi.dev/docs/latest/session-format#entry-base)[Entry Types](https://pi.dev/docs/latest/session-format#entry-types)[SessionHeader](https://pi.dev/docs/latest/session-format#sessionheader)[SessionMessageEntry](https://pi.dev/docs/latest/session-format#sessionmessageentry)[ModelChangeEntry](https://pi.dev/docs/latest/session-format#modelchangeentry)[ThinkingLevelChangeEntry](https://pi.dev/docs/latest/session-format#thinkinglevelchangeentry)[CompactionEntry](https://pi.dev/docs/latest/session-format#compactionentry)[BranchSummaryEntry](https://pi.dev/docs/latest/session-format#branchsummaryentry)[CustomEntry](https://pi.dev/docs/latest/session-format#customentry)[CustomMessageEntry](https://pi.dev/docs/latest/session-format#custommessageentry)[LabelEntry](https://pi.dev/docs/latest/session-format#labelentry)[SessionInfoEntry](https://pi.dev/docs/latest/session-format#sessioninfoentry)[Tree Structure](https://pi.dev/docs/latest/session-format#tree-structure)[Context Building](https://pi.dev/docs/latest/session-format#context-building)[Parsing Example](https://pi.dev/docs/latest/session-format#parsing-example)[SessionManager API](https://pi.dev/docs/latest/session-format#sessionmanager-api)[Static Creation Methods](https://pi.dev/docs/latest/session-format#static-creation-methods)[Static Listing Methods](https://pi.dev/docs/latest/session-format#static-listing-methods)[Instance Methods - Session Management](https://pi.dev/docs/latest/session-format#instance-methods-session-management)[Instance Methods - Appending (all return entry ID)](https://pi.dev/docs/latest/session-format#instance-methods-appending-all-return-entry-id)[Instance Methods - Tree Navigation](https://pi.dev/docs/latest/session-format#instance-methods-tree-navigation)[Instance Methods - Context & Info](https://pi.dev/docs/latest/session-format#instance-methods-context-info)
# Session File Format
Latest·[](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/session-format.md)·[](https://github.com/earendil-works/pi/edit/main/packages/coding-agent/docs/session-format.md)
Sessions are stored as JSONL (JSON Lines) files. Each line is a JSON object with a `type` field. Session entries form a tree structure via `id`/`parentId` fields, enabling in-place branching without creating new files.
##  File Location 
[ Copied ](https://pi.dev/docs/latest/session-format#file-location)

```
~/.pi/agent/sessions/--<path>--/<timestamp>_<uuid>.jsonl

```

Where `<path>` is the working directory with `/` replaced by `-`.
##  Deleting Sessions 
[ Copied ](https://pi.dev/docs/latest/session-format#deleting-sessions)
Sessions can be removed by deleting their `.jsonl` files under `~/.pi/agent/sessions/`.
Pi also supports deleting sessions interactively from `/resume` (select a session and press `Ctrl+D`, then confirm). When available, pi uses the `trash` CLI to avoid permanent deletion.
##  Session Version 
[ Copied ](https://pi.dev/docs/latest/session-format#session-version)
Sessions have a version field in the header:
  * **Version 1** : Linear entry sequence (legacy, auto-migrated on load)
  * **Version 2** : Tree structure with `id`/`parentId` linking
  * **Version 3** : Renamed `hookMessage` role to `custom` (extensions unification)


Existing sessions are automatically migrated to the current version (v3) when loaded.
##  Source Files 
[ Copied ](https://pi.dev/docs/latest/session-format#source-files)
Source on GitHub ([pi-mono](https://github.com/earendil-works/pi-mono)):
  * [`packages/coding-agent/src/core/session-manager.ts`](https://github.com/earendil-works/pi-mono/blob/main/packages/coding-agent/src/core/session-manager.ts) - Session entry types and SessionManager
  * [`packages/coding-agent/src/core/messages.ts`](https://github.com/earendil-works/pi-mono/blob/main/packages/coding-agent/src/core/messages.ts) - Extended message types (BashExecutionMessage, CustomMessage, etc.)
  * [`packages/ai/src/types.ts`](https://github.com/earendil-works/pi-mono/blob/main/packages/ai/src/types.ts) - Base message types (UserMessage, AssistantMessage, ToolResultMessage)
  * [`packages/agent/src/types.ts`](https://github.com/earendil-works/pi-mono/blob/main/packages/agent/src/types.ts) - AgentMessage union type


For TypeScript definitions in your project, inspect `node_modules/@earendil-works/pi-coding-agent/dist/` and `node_modules/@earendil-works/pi-ai/dist/`.
##  Message Types 
[ Copied ](https://pi.dev/docs/latest/session-format#message-types)
Session entries contain `AgentMessage` objects. Understanding these types is essential for parsing sessions and writing extensions.
###  Content Blocks 
[ Copied ](https://pi.dev/docs/latest/session-format#content-blocks)
Messages contain arrays of typed content blocks:

```
interface TextContent {
  type: "text";
  text: string;
}

interface ImageContent {
  type: "image";
  data: string;      // base64 encoded
  mimeType: string;  // e.g., "image/jpeg", "image/png"
}

interface ThinkingContent {
  type: "thinking";
  thinking: string;
}

interface ToolCall {
  type: "toolCall";
  id: string;
  name: string;
  arguments: Record<string, any>;
}

```

###  Base Message Types (from pi-ai) 
[ Copied ](https://pi.dev/docs/latest/session-format#base-message-types-from-pi-ai)

```
interface UserMessage {
  role: "user";
  content: string | (TextContent | ImageContent)[];
  timestamp: number;  // Unix ms
}

interface AssistantMessage {
  role: "assistant";
  content: (TextContent | ThinkingContent | ToolCall)[];
  api: string;
  provider: string;
  model: string;
  usage: Usage;
  stopReason: "stop" | "length" | "toolUse" | "error" | "aborted";
  errorMessage?: string;
  timestamp: number;
}

interface ToolResultMessage {
  role: "toolResult";
  toolCallId: string;
  toolName: string;
  content: (TextContent | ImageContent)[];
  details?: any;      // Tool-specific metadata
  isError: boolean;
  timestamp: number;
}

interface Usage {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
  totalTokens: number;
  cost: {
    input: number;
    output: number;
    cacheRead: number;
    cacheWrite: number;
    total: number;
  };
}

```

###  Extended Message Types (from pi-coding-agent) 
[ Copied ](https://pi.dev/docs/latest/session-format#extended-message-types-from-pi-coding-agent)

```
interface BashExecutionMessage {
  role: "bashExecution";
  command: string;
  output: string;
  exitCode: number | undefined;
  cancelled: boolean;
  truncated: boolean;
  fullOutputPath?: string;
  excludeFromContext?: boolean;  // true for !! prefix commands
  timestamp: number;
}

interface CustomMessage {
  role: "custom";
  customType: string;            // Extension identifier
  content: string | (TextContent | ImageContent)[];
  display: boolean;              // Show in TUI
  details?: any;                 // Extension-specific metadata
  timestamp: number;
}

interface BranchSummaryMessage {
  role: "branchSummary";
  summary: string;
  fromId: string;                // Entry we branched from
  timestamp: number;
}

interface CompactionSummaryMessage {
  role: "compactionSummary";
  summary: string;
  tokensBefore: number;
  timestamp: number;
}

```

###  AgentMessage Union 
[ Copied ](https://pi.dev/docs/latest/session-format#agentmessage-union)

```
type AgentMessage =
  | UserMessage
  | AssistantMessage
  | ToolResultMessage
  | BashExecutionMessage
  | CustomMessage
  | BranchSummaryMessage
  | CompactionSummaryMessage;

```

##  Entry Base 
[ Copied ](https://pi.dev/docs/latest/session-format#entry-base)
All entries (except `SessionHeader`) extend `SessionEntryBase`:

```
interface SessionEntryBase {
  type: string;
  id: string;           // 8-char hex ID
  parentId: string | null;  // Parent entry ID (null for first entry)
  timestamp: string;    // ISO timestamp
}

```

##  Entry Types 
[ Copied ](https://pi.dev/docs/latest/session-format#entry-types)
###  SessionHeader 
[ Copied ](https://pi.dev/docs/latest/session-format#sessionheader)
First line of the file. Metadata only, not part of the tree (no `id`/`parentId`).

```
{"type":"session","version":3,"id":"uuid","timestamp":"2024-12-03T14:00:00.000Z","cwd":"/path/to/project"}

```

For sessions with a parent (created via `/fork`, `/clone`, or `newSession({ parentSession })`):

```
{"type":"session","version":3,"id":"uuid","timestamp":"2024-12-03T14:00:00.000Z","cwd":"/path/to/project","parentSession":"/path/to/original/session.jsonl"}

```

###  SessionMessageEntry 
[ Copied ](https://pi.dev/docs/latest/session-format#sessionmessageentry)
A message in the conversation. The `message` field contains an `AgentMessage`.

```
{"type":"message","id":"a1b2c3d4","parentId":"prev1234","timestamp":"2024-12-03T14:00:01.000Z","message":{"role":"user","content":"Hello"}}
{"type":"message","id":"b2c3d4e5","parentId":"a1b2c3d4","timestamp":"2024-12-03T14:00:02.000Z","message":{"role":"assistant","content":[{"type":"text","text":"Hi!"}],"provider":"anthropic","model":"claude-sonnet-4-5","usage":{...},"stopReason":"stop"}}
{"type":"message","id":"c3d4e5f6","parentId":"b2c3d4e5","timestamp":"2024-12-03T14:00:03.000Z","message":{"role":"toolResult","toolCallId":"call_123","toolName":"bash","content":[{"type":"text","text":"output"}],"isError":false}}

```

###  ModelChangeEntry 
[ Copied ](https://pi.dev/docs/latest/session-format#modelchangeentry)
Emitted when the user switches models mid-session.

```
{"type":"model_change","id":"d4e5f6g7","parentId":"c3d4e5f6","timestamp":"2024-12-03T14:05:00.000Z","provider":"openai","modelId":"gpt-4o"}

```

###  ThinkingLevelChangeEntry 
[ Copied ](https://pi.dev/docs/latest/session-format#thinkinglevelchangeentry)
Emitted when the user changes the thinking/reasoning level.

```
{"type":"thinking_level_change","id":"e5f6g7h8","parentId":"d4e5f6g7","timestamp":"2024-12-03T14:06:00.000Z","thinkingLevel":"high"}

```

###  CompactionEntry 
[ Copied ](https://pi.dev/docs/latest/session-format#compactionentry)
Created when context is compacted. Stores a summary of earlier messages.

```
{"type":"compaction","id":"f6g7h8i9","parentId":"e5f6g7h8","timestamp":"2024-12-03T14:10:00.000Z","summary":"User discussed X, Y, Z...","firstKeptEntryId":"c3d4e5f6","tokensBefore":50000}

```

Optional fields:
  * `details`: Implementation-specific data (e.g., `{ readFiles: string[], modifiedFiles: string[] }` for default, or custom data for extensions)
  * `fromHook`: `true` if generated by an extension, `false`/`undefined` if pi-generated (legacy field name)


###  BranchSummaryEntry 
[ Copied ](https://pi.dev/docs/latest/session-format#branchsummaryentry)
Created when switching branches via `/tree` with an LLM generated summary of the left branch up to the common ancestor. Captures context from the abandoned path.

```
{"type":"branch_summary","id":"g7h8i9j0","parentId":"a1b2c3d4","timestamp":"2024-12-03T14:15:00.000Z","fromId":"f6g7h8i9","summary":"Branch explored approach A..."}

```

Optional fields:
  * `details`: File tracking data (`{ readFiles: string[], modifiedFiles: string[] }`) for default, or custom data for extensions
  * `fromHook`: `true` if generated by an extension, `false`/`undefined` if pi-generated (legacy field name)


###  CustomEntry 
[ Copied ](https://pi.dev/docs/latest/session-format#customentry)
Extension state persistence. Does NOT participate in LLM context.

```
{"type":"custom","id":"h8i9j0k1","parentId":"g7h8i9j0","timestamp":"2024-12-03T14:20:00.000Z","customType":"my-extension","data":{"count":42}}

```

Use `customType` to identify your extension's entries on reload.
###  CustomMessageEntry 
[ Copied ](https://pi.dev/docs/latest/session-format#custommessageentry)
Extension-injected messages that DO participate in LLM context.

```
{"type":"custom_message","id":"i9j0k1l2","parentId":"h8i9j0k1","timestamp":"2024-12-03T14:25:00.000Z","customType":"my-extension","content":"Injected context...","display":true}

```

Fields:
  * `content`: String or `(TextContent | ImageContent)[]` (same as UserMessage)
  * `display`: `true` = show in TUI with distinct styling, `false` = hidden
  * `details`: Optional extension-specific metadata (not sent to LLM)


###  LabelEntry 
[ Copied ](https://pi.dev/docs/latest/session-format#labelentry)
User-defined bookmark/marker on an entry.

```
{"type":"label","id":"j0k1l2m3","parentId":"i9j0k1l2","timestamp":"2024-12-03T14:30:00.000Z","targetId":"a1b2c3d4","label":"checkpoint-1"}

```

Set `label` to `undefined` to clear a label.
###  SessionInfoEntry 
[ Copied ](https://pi.dev/docs/latest/session-format#sessioninfoentry)
Session metadata (e.g., user-defined display name). Set via `/name`, `--name` / `-n`, or `pi.setSessionName()` in extensions.

```
{"type":"session_info","id":"k1l2m3n4","parentId":"j0k1l2m3","timestamp":"2024-12-03T14:35:00.000Z","name":"Refactor auth module"}

```

The session name is displayed in the session selector (`/resume`) instead of the first message when set.
##  Tree Structure 
[ Copied ](https://pi.dev/docs/latest/session-format#tree-structure)
Entries form a tree:
  * First entry has `parentId: null`
  * Each subsequent entry points to its parent via `parentId`
  * Branching creates new children from an earlier entry
  * The "leaf" is the current position in the tree


```
[user msg] ─── [assistant] ─── [user msg] ─── [assistant] ─┬─ [user msg] ← current leaf
                                                            │
                                                            └─ [branch_summary] ─── [user msg] ← alternate branch

```

##  Context Building 
[ Copied ](https://pi.dev/docs/latest/session-format#context-building)
`buildSessionContext()` walks from the current leaf to the root, producing the message list for the LLM:
  1. Collects all entries on the path
  2. Extracts current model and thinking level settings
  3. If a `CompactionEntry` is on the path:
     * Emits the summary first
     * Then messages from `firstKeptEntryId` to compaction
     * Then messages after compaction
  4. Converts `BranchSummaryEntry` and `CustomMessageEntry` to appropriate message formats


##  Parsing Example 
[ Copied ](https://pi.dev/docs/latest/session-format#parsing-example)

```
import { readFileSync } from "fs";

const lines = readFileSync("session.jsonl", "utf8").trim().split("\n");

for (const line of lines) {
  const entry = JSON.parse(line);

  switch (entry.type) {
    case "session":
      console.log(`Session v${entry.version ?? 1}: ${entry.id}`);
      break;
    case "message":
      console.log(`[${entry.id}] ${entry.message.role}: ${JSON.stringify(entry.message.content)}`);
      break;
    case "compaction":
      console.log(`[${entry.id}] Compaction: ${entry.tokensBefore} tokens summarized`);
      break;
    case "branch_summary":
      console.log(`[${entry.id}] Branch from ${entry.fromId}`);
      break;
    case "custom":
      console.log(`[${entry.id}] Custom (${entry.customType}): ${JSON.stringify(entry.data)}`);
      break;
    case "custom_message":
      console.log(`[${entry.id}] Extension message (${entry.customType}): ${entry.content}`);
      break;
    case "label":
      console.log(`[${entry.id}] Label "${entry.label}" on ${entry.targetId}`);
      break;
    case "model_change":
      console.log(`[${entry.id}] Model: ${entry.provider}/${entry.modelId}`);
      break;
    case "thinking_level_change":
      console.log(`[${entry.id}] Thinking: ${entry.thinkingLevel}`);
      break;
  }
}

```

##  SessionManager API 
[ Copied ](https://pi.dev/docs/latest/session-format#sessionmanager-api)
Key methods for working with sessions programmatically.
###  Static Creation Methods 
[ Copied ](https://pi.dev/docs/latest/session-format#static-creation-methods)
  * `SessionManager.create(cwd, sessionDir?)` - New session
  * `SessionManager.open(path, sessionDir?)` - Open existing session file
  * `SessionManager.continueRecent(cwd, sessionDir?)` - Continue most recent or create new
  * `SessionManager.inMemory(cwd?)` - No file persistence
  * `SessionManager.forkFrom(sourcePath, targetCwd, sessionDir?)` - Fork session from another project


###  Static Listing Methods 
[ Copied ](https://pi.dev/docs/latest/session-format#static-listing-methods)
  * `SessionManager.list(cwd, sessionDir?, onProgress?)` - List sessions for a directory
  * `SessionManager.listAll(onProgress?)` - List all sessions across all projects


###  Instance Methods - Session Management 
[ Copied ](https://pi.dev/docs/latest/session-format#instance-methods-session-management)
  * `newSession(options?)` - Start a new session (options: `{ parentSession?: string }`)
  * `setSessionFile(path)` - Switch to a different session file
  * `createBranchedSession(leafId)` - Extract branch to new session file


###  Instance Methods - Appending (all return entry ID) 
[ Copied ](https://pi.dev/docs/latest/session-format#instance-methods-appending-all-return-entry-id)
  * `appendMessage(message)` - Add message
  * `appendThinkingLevelChange(level)` - Record thinking change
  * `appendModelChange(provider, modelId)` - Record model change
  * `appendCompaction(summary, firstKeptEntryId, tokensBefore, details?, fromHook?)` - Add compaction
  * `appendCustomEntry(customType, data?)` - Extension state (not in context)
  * `appendSessionInfo(name)` - Set session display name
  * `appendCustomMessageEntry(customType, content, display, details?)` - Extension message (in context)
  * `appendLabelChange(targetId, label)` - Set/clear label


###  Instance Methods - Tree Navigation 
[ Copied ](https://pi.dev/docs/latest/session-format#instance-methods-tree-navigation)
  * `getLeafId()` - Current position
  * `getLeafEntry()` - Get current leaf entry
  * `getEntry(id)` - Get entry by ID
  * `getBranch(fromId?)` - Walk from entry to root
  * `getTree()` - Get full tree structure
  * `getChildren(parentId)` - Get direct children
  * `getLabel(id)` - Get label for entry
  * `branch(entryId)` - Move leaf to earlier entry
  * `resetLeaf()` - Reset leaf to null (before any entries)
  * `branchWithSummary(entryId, summary, details?, fromHook?)` - Branch with context summary


###  Instance Methods - Context & Info 
[ Copied ](https://pi.dev/docs/latest/session-format#instance-methods-context-info)
  * `buildSessionContext()` - Get messages, thinkingLevel, and model for LLM
  * `getEntries()` - All entries (excluding header)
  * `getHeader()` - Session header metadata
  * `getSessionName()` - Get display name from latest session_info entry
  * `getCwd()` - Working directory
  * `getSessionDir()` - Session storage directory
  * `getSessionId()` - Session UUID
  * `getSessionFile()` - Session file path (undefined for in-memory)
  * `isPersisted()` - Whether session is saved to disk


[Earendil Inc.](https://earendil.com/) & Contributors
[Press Kit](https://pi.dev/press-kit)
MIT License
[](https://github.com/earendil-works/pi/tree/main/packages/coding-agent "GitHub")[](https://www.npmjs.com/package/@earendil-works/pi-coding-agent "npm")[](https://discord.com/invite/3cU7Bz4UPx "Discord")
[](https://earendil.com "Earendil Inc. website")AutoLightDark
pi.dev domain graciously donated by [exe.dev](https://exe.dev)
