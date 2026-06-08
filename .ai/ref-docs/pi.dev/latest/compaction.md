---
title: "Pi Coding Agent"
description: "A terminal-based coding agent"
domain: "pi.dev"
source: "https://pi.dev/docs/latest/compaction"
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
[Overview](https://pi.dev/docs/latest/compaction#overview)[Compaction](https://pi.dev/docs/latest/compaction#compaction)[When It Triggers](https://pi.dev/docs/latest/compaction#when-it-triggers)[How It Works](https://pi.dev/docs/latest/compaction#how-it-works)[Split Turns](https://pi.dev/docs/latest/compaction#split-turns)[Cut Point Rules](https://pi.dev/docs/latest/compaction#cut-point-rules)[CompactionEntry Structure](https://pi.dev/docs/latest/compaction#compactionentry-structure)[Branch Summarization](https://pi.dev/docs/latest/compaction#branch-summarization)[When It Triggers](https://pi.dev/docs/latest/compaction#when-it-triggers-1)[How It Works](https://pi.dev/docs/latest/compaction#how-it-works-1)[Cumulative File Tracking](https://pi.dev/docs/latest/compaction#cumulative-file-tracking)[BranchSummaryEntry Structure](https://pi.dev/docs/latest/compaction#branchsummaryentry-structure)[Summary Format](https://pi.dev/docs/latest/compaction#summary-format)[Message Serialization](https://pi.dev/docs/latest/compaction#message-serialization)[Custom Summarization via Extensions](https://pi.dev/docs/latest/compaction#custom-summarization-via-extensions)[session_before_compact](https://pi.dev/docs/latest/compaction#session-before-compact)[session_before_tree](https://pi.dev/docs/latest/compaction#session-before-tree)[Settings](https://pi.dev/docs/latest/compaction#settings)
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
  1. [](https://pi.dev/docs/latest/compaction)
  2. [](https://pi.dev/docs/latest/compaction)
  3. [](https://pi.dev/docs/latest/compaction)
  4. [](https://pi.dev/docs/latest/compaction)
  5. [](https://pi.dev/docs/latest/compaction)
  6. [](https://pi.dev/docs/latest/compaction)
  7. [](https://pi.dev/docs/latest/compaction)
  8. [](https://pi.dev/docs/latest/compaction)
  9. [](https://pi.dev/docs/latest/compaction)
  10. [](https://pi.dev/docs/latest/compaction)


* [](https://pi.dev/docs/latest/compaction)
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
[Overview](https://pi.dev/docs/latest/compaction#overview)[Compaction](https://pi.dev/docs/latest/compaction#compaction)[When It Triggers](https://pi.dev/docs/latest/compaction#when-it-triggers)[How It Works](https://pi.dev/docs/latest/compaction#how-it-works)[Split Turns](https://pi.dev/docs/latest/compaction#split-turns)[Cut Point Rules](https://pi.dev/docs/latest/compaction#cut-point-rules)[CompactionEntry Structure](https://pi.dev/docs/latest/compaction#compactionentry-structure)[Branch Summarization](https://pi.dev/docs/latest/compaction#branch-summarization)[When It Triggers](https://pi.dev/docs/latest/compaction#when-it-triggers-1)[How It Works](https://pi.dev/docs/latest/compaction#how-it-works-1)[Cumulative File Tracking](https://pi.dev/docs/latest/compaction#cumulative-file-tracking)[BranchSummaryEntry Structure](https://pi.dev/docs/latest/compaction#branchsummaryentry-structure)[Summary Format](https://pi.dev/docs/latest/compaction#summary-format)[Message Serialization](https://pi.dev/docs/latest/compaction#message-serialization)[Custom Summarization via Extensions](https://pi.dev/docs/latest/compaction#custom-summarization-via-extensions)[session_before_compact](https://pi.dev/docs/latest/compaction#session-before-compact)[session_before_tree](https://pi.dev/docs/latest/compaction#session-before-tree)[Settings](https://pi.dev/docs/latest/compaction#settings)
On this page
[Overview](https://pi.dev/docs/latest/compaction#overview)[Compaction](https://pi.dev/docs/latest/compaction#compaction)[When It Triggers](https://pi.dev/docs/latest/compaction#when-it-triggers)[How It Works](https://pi.dev/docs/latest/compaction#how-it-works)[Split Turns](https://pi.dev/docs/latest/compaction#split-turns)[Cut Point Rules](https://pi.dev/docs/latest/compaction#cut-point-rules)[CompactionEntry Structure](https://pi.dev/docs/latest/compaction#compactionentry-structure)[Branch Summarization](https://pi.dev/docs/latest/compaction#branch-summarization)[When It Triggers](https://pi.dev/docs/latest/compaction#when-it-triggers-1)[How It Works](https://pi.dev/docs/latest/compaction#how-it-works-1)[Cumulative File Tracking](https://pi.dev/docs/latest/compaction#cumulative-file-tracking)[BranchSummaryEntry Structure](https://pi.dev/docs/latest/compaction#branchsummaryentry-structure)[Summary Format](https://pi.dev/docs/latest/compaction#summary-format)[Message Serialization](https://pi.dev/docs/latest/compaction#message-serialization)[Custom Summarization via Extensions](https://pi.dev/docs/latest/compaction#custom-summarization-via-extensions)[session_before_compact](https://pi.dev/docs/latest/compaction#session-before-compact)[session_before_tree](https://pi.dev/docs/latest/compaction#session-before-tree)[Settings](https://pi.dev/docs/latest/compaction#settings)
# Compaction & Branch Summarization
Latest·[](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/compaction.md)·[](https://github.com/earendil-works/pi/edit/main/packages/coding-agent/docs/compaction.md)
LLMs have limited context windows. When conversations grow too long, pi uses compaction to summarize older content while preserving recent work. This page covers both auto-compaction and branch summarization.
**Source files** ([pi-mono](https://github.com/earendil-works/pi-mono)):
  * [`packages/coding-agent/src/core/compaction/compaction.ts`](https://github.com/earendil-works/pi-mono/blob/main/packages/coding-agent/src/core/compaction/compaction.ts) - Auto-compaction logic
  * [`packages/coding-agent/src/core/compaction/branch-summarization.ts`](https://github.com/earendil-works/pi-mono/blob/main/packages/coding-agent/src/core/compaction/branch-summarization.ts) - Branch summarization
  * [`packages/coding-agent/src/core/compaction/utils.ts`](https://github.com/earendil-works/pi-mono/blob/main/packages/coding-agent/src/core/compaction/utils.ts) - Shared utilities (file tracking, serialization)
  * [`packages/coding-agent/src/core/session-manager.ts`](https://github.com/earendil-works/pi-mono/blob/main/packages/coding-agent/src/core/session-manager.ts) - Entry types (`CompactionEntry`, `BranchSummaryEntry`)
  * [`packages/coding-agent/src/core/extensions/types.ts`](https://github.com/earendil-works/pi-mono/blob/main/packages/coding-agent/src/core/extensions/types.ts) - Extension event types


For TypeScript definitions in your project, inspect `node_modules/@earendil-works/pi-coding-agent/dist/`.
##  Overview 
[ Copied ](https://pi.dev/docs/latest/compaction#overview)
Pi has two summarization mechanisms:  
| Mechanism  | Trigger  | Purpose  |  
| --- | --- | --- |  
| Compaction  | Context exceeds threshold, or `/compact`  | Summarize old messages to free up context  |  
| Branch summarization  |  `/tree` navigation  | Preserve context when switching branches  |  
Both use the same structured summary format and track file operations cumulatively.
##  Compaction 
[ Copied ](https://pi.dev/docs/latest/compaction#compaction)
###  When It Triggers 
[ Copied ](https://pi.dev/docs/latest/compaction#when-it-triggers)
Auto-compaction triggers when:

```
contextTokens > contextWindow - reserveTokens

```

By default, `reserveTokens` is 16384 tokens (configurable in `~/.pi/agent/settings.json` or `<project-dir>/.pi/settings.json`). This leaves room for the LLM's response.
You can also trigger manually with `/compact [instructions]`, where optional instructions focus the summary.
###  How It Works 
[ Copied ](https://pi.dev/docs/latest/compaction#how-it-works)
  1. **Find cut point** : Walk backwards from newest message, accumulating token estimates until `keepRecentTokens` (default 20k, configurable in `~/.pi/agent/settings.json` or `<project-dir>/.pi/settings.json`) is reached
  2. **Extract messages** : Collect messages from the previous kept boundary (or session start) up to the cut point
  3. **Generate summary** : Call LLM to summarize with structured format, passing the previous summary as iterative context when present
  4. **Append entry** : Save `CompactionEntry` with summary and `firstKeptEntryId`
  5. **Reload** : Session reloads, using summary + messages from `firstKeptEntryId` onwards


```
Before compaction:

  entry:  0     1     2     3      4     5     6      7      8     9
        ┌─────┬─────┬─────┬─────┬──────┬─────┬─────┬──────┬──────┬─────┐
        │ hdr │ usr │ ass │ tool │ usr │ ass │ tool │ tool │ ass │ tool│
        └─────┴─────┴─────┴──────┴─────┴─────┴──────┴──────┴─────┴─────┘
                └────────┬───────┘ └──────────────┬──────────────┘
               messagesToSummarize            kept messages
                                   ↑
                          firstKeptEntryId (entry 4)

After compaction (new entry appended):

  entry:  0     1     2     3      4     5     6      7      8     9     10
        ┌─────┬─────┬─────┬─────┬──────┬─────┬─────┬──────┬──────┬─────┬─────┐
        │ hdr │ usr │ ass │ tool │ usr │ ass │ tool │ tool │ ass │ tool│ cmp │
        └─────┴─────┴─────┴──────┴─────┴─────┴──────┴──────┴─────┴─────┴─────┘
               └──────────┬──────┘ └──────────────────────┬───────────────────┘
                 not sent to LLM                    sent to LLM
                                                         ↑
                                              starts from firstKeptEntryId

What the LLM sees:

  ┌────────┬─────────┬─────┬─────┬──────┬──────┬─────┬──────┐
  │ system │ summary │ usr │ ass │ tool │ tool │ ass │ tool │
  └────────┴─────────┴─────┴─────┴──────┴──────┴─────┴──────┘
       ↑         ↑      └─────────────────┬────────────────┘
    prompt   from cmp          messages from firstKeptEntryId

```

On repeated compactions, the summarized span starts at the previous compaction's kept boundary (`firstKeptEntryId`), not at the compaction entry itself, falling back to the entry after the previous compaction if that kept entry cannot be found in the path. This preserves messages that survived the earlier compaction by including them in the next summarization pass as well. Pi also recalculates `tokensBefore` from the rebuilt session context before writing the new `CompactionEntry`, so the token count reflects the actual pre-compaction context being replaced.
###  Split Turns 
[ Copied ](https://pi.dev/docs/latest/compaction#split-turns)
A "turn" starts with a user message and includes all assistant responses and tool calls until the next user message. Normally, compaction cuts at turn boundaries.
When a single turn exceeds `keepRecentTokens`, the cut point lands mid-turn at an assistant message. This is a "split turn":

```
Split turn (one huge turn exceeds budget):

  entry:  0     1     2      3     4      5      6     7      8
        ┌─────┬─────┬─────┬──────┬─────┬──────┬──────┬─────┬──────┐
        │ hdr │ usr │ ass │ tool │ ass │ tool │ tool │ ass │ tool │
        └─────┴─────┴─────┴──────┴─────┴──────┴──────┴─────┴──────┘
                ↑                                     ↑
         turnStartIndex = 1                  firstKeptEntryId = 7
                │                                     │
                └──── turnPrefixMessages (1-6) ───────┘
                                                      └── kept (7-8)

  isSplitTurn = true
  messagesToSummarize = []  (no complete turns before)
  turnPrefixMessages = [usr, ass, tool, ass, tool, tool]

```

For split turns, pi generates two summaries and merges them:
  1. **History summary** : Previous context (if any)
  2. **Turn prefix summary** : The early part of the split turn


###  Cut Point Rules 
[ Copied ](https://pi.dev/docs/latest/compaction#cut-point-rules)
Valid cut points are:
  * User messages
  * Assistant messages
  * BashExecution messages
  * Custom messages (custom_message, branch_summary)


Never cut at tool results (they must stay with their tool call).
###  CompactionEntry Structure 
[ Copied ](https://pi.dev/docs/latest/compaction#compactionentry-structure)
Defined in [`session-manager.ts`](https://github.com/earendil-works/pi-mono/blob/main/packages/coding-agent/src/core/session-manager.ts):

```
interface CompactionEntry<T = unknown> {
  type: "compaction";
  id: string;
  parentId: string;
  timestamp: number;
  summary: string;
  firstKeptEntryId: string;
  tokensBefore: number;
  fromHook?: boolean;  // true if provided by extension (legacy field name)
  details?: T;         // implementation-specific data
}

// Default compaction uses this for details (from compaction.ts):
interface CompactionDetails {
  readFiles: string[];
  modifiedFiles: string[];
}

```

Extensions can store any JSON-serializable data in `details`. The default compaction tracks file operations, but custom extension implementations can use their own structure.
See [`prepareCompaction()`](https://github.com/earendil-works/pi-mono/blob/main/packages/coding-agent/src/core/compaction/compaction.ts) and [`compact()`](https://github.com/earendil-works/pi-mono/blob/main/packages/coding-agent/src/core/compaction/compaction.ts) for the implementation.
##  Branch Summarization 
[ Copied ](https://pi.dev/docs/latest/compaction#branch-summarization)
###  When It Triggers 
[ Copied ](https://pi.dev/docs/latest/compaction#when-it-triggers-1)
When you use `/tree` to navigate to a different branch, pi offers to summarize the work you're leaving. This injects context from the left branch into the new branch.
###  How It Works 
[ Copied ](https://pi.dev/docs/latest/compaction#how-it-works-1)
  1. **Find common ancestor** : Deepest node shared by old and new positions
  2. **Collect entries** : Walk from old leaf back to common ancestor
  3. **Prepare with budget** : Include messages up to token budget (newest first)
  4. **Generate summary** : Call LLM with structured format
  5. **Append entry** : Save `BranchSummaryEntry` at navigation point


```
Tree before navigation:

         ┌─ B ─ C ─ D (old leaf, being abandoned)
    A ───┤
         └─ E ─ F (target)

Common ancestor: A
Entries to summarize: B, C, D

After navigation with summary:

         ┌─ B ─ C ─ D ─ [summary of B,C,D]
    A ───┤
         └─ E ─ F (new leaf)

```

###  Cumulative File Tracking 
[ Copied ](https://pi.dev/docs/latest/compaction#cumulative-file-tracking)
Both compaction and branch summarization track files cumulatively. When generating a summary, pi extracts file operations from:
  * Tool calls in the messages being summarized
  * Previous compaction or branch summary `details` (if any)


This means file tracking accumulates across multiple compactions or nested branch summaries, preserving the full history of read and modified files.
###  BranchSummaryEntry Structure 
[ Copied ](https://pi.dev/docs/latest/compaction#branchsummaryentry-structure)
Defined in [`session-manager.ts`](https://github.com/earendil-works/pi-mono/blob/main/packages/coding-agent/src/core/session-manager.ts):

```
interface BranchSummaryEntry<T = unknown> {
  type: "branch_summary";
  id: string;
  parentId: string;
  timestamp: number;
  summary: string;
  fromId: string;      // Entry we navigated from
  fromHook?: boolean;  // true if provided by extension (legacy field name)
  details?: T;         // implementation-specific data
}

// Default branch summarization uses this for details (from branch-summarization.ts):
interface BranchSummaryDetails {
  readFiles: string[];
  modifiedFiles: string[];
}

```

Same as compaction, extensions can store custom data in `details`.
See [`collectEntriesForBranchSummary()`](https://github.com/earendil-works/pi-mono/blob/main/packages/coding-agent/src/core/compaction/branch-summarization.ts), [`prepareBranchEntries()`](https://github.com/earendil-works/pi-mono/blob/main/packages/coding-agent/src/core/compaction/branch-summarization.ts), and [`generateBranchSummary()`](https://github.com/earendil-works/pi-mono/blob/main/packages/coding-agent/src/core/compaction/branch-summarization.ts) for the implementation.
##  Summary Format 
[ Copied ](https://pi.dev/docs/latest/compaction#summary-format)
Both compaction and branch summarization use the same structured format:

```
## Goal
[What the user is trying to accomplish]

## Constraints & Preferences
- [Requirements mentioned by user]

## Progress
### Done
- [x] [Completed tasks]

### In Progress
- [ ] [Current work]

### Blocked
- [Issues, if any]

## Key Decisions
- **[Decision]**: [Rationale]

## Next Steps
1. [What should happen next]

## Critical Context
- [Data needed to continue]

<read-files>
path/to/file1.ts
path/to/file2.ts
</read-files>

<modified-files>
path/to/changed.ts
</modified-files>

```

###  Message Serialization 
[ Copied ](https://pi.dev/docs/latest/compaction#message-serialization)
Before summarization, messages are serialized to text via [`serializeConversation()`](https://github.com/earendil-works/pi-mono/blob/main/packages/coding-agent/src/core/compaction/utils.ts):

```
[User]: What they said
[Assistant thinking]: Internal reasoning
[Assistant]: Response text
[Assistant tool calls]: read(path="foo.ts"); edit(path="bar.ts", ...)
[Tool result]: Output from tool

```

This prevents the model from treating it as a conversation to continue.
Tool results are truncated to 2000 characters during serialization. Content beyond that limit is replaced with a marker indicating how many characters were truncated. This keeps summarization requests within reasonable token budgets, since tool results (especially from `read` and `bash`) are typically the largest contributors to context size.
##  Custom Summarization via Extensions 
[ Copied ](https://pi.dev/docs/latest/compaction#custom-summarization-via-extensions)
Extensions can intercept and customize both compaction and branch summarization. See [`extensions/types.ts`](https://github.com/earendil-works/pi-mono/blob/main/packages/coding-agent/src/core/extensions/types.ts) for event type definitions.
###  session_before_compact 
[ Copied ](https://pi.dev/docs/latest/compaction#session-before-compact)
Fired before auto-compaction or `/compact`. Can cancel or provide custom summary. See `SessionBeforeCompactEvent` and `CompactionPreparation` in the types file.

```
pi.on("session_before_compact", async (event, ctx) => {
  const { preparation, branchEntries, customInstructions, signal } = event;

  // preparation.messagesToSummarize - messages to summarize
  // preparation.turnPrefixMessages - split turn prefix (if isSplitTurn)
  // preparation.previousSummary - previous compaction summary
  // preparation.fileOps - extracted file operations
  // preparation.tokensBefore - context tokens before compaction
  // preparation.firstKeptEntryId - where kept messages start
  // preparation.settings - compaction settings

  // branchEntries - all entries on current branch (for custom state)
  // signal - AbortSignal (pass to LLM calls)

  // Cancel:
  return { cancel: true };

  // Custom summary:
  return {
    compaction: {
      summary: "Your summary...",
      firstKeptEntryId: preparation.firstKeptEntryId,
      tokensBefore: preparation.tokensBefore,
      details: { /* custom data */ },
    }
  };
});

```

####  Converting Messages to Text 
[ Copied ](https://pi.dev/docs/latest/compaction#converting-messages-to-text)
To generate a summary with your own model, convert messages to text using `serializeConversation`:

```
import { convertToLlm, serializeConversation } from "@earendil-works/pi-coding-agent";

pi.on("session_before_compact", async (event, ctx) => {
  const { preparation } = event;
  
  // Convert AgentMessage[] to Message[], then serialize to text
  const conversationText = serializeConversation(
    convertToLlm(preparation.messagesToSummarize)
  );
  // Returns:
  // [User]: message text
  // [Assistant thinking]: thinking content
  // [Assistant]: response text
  // [Assistant tool calls]: read(path="..."); bash(command="...")
  // [Tool result]: output text

  // Now send to your model for summarization
  const summary = await myModel.summarize(conversationText);
  
  return {
    compaction: {
      summary,
      firstKeptEntryId: preparation.firstKeptEntryId,
      tokensBefore: preparation.tokensBefore,
    }
  };
});

```

See [custom-compaction.ts](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/examples/extensions/custom-compaction.ts) for a complete example using a different model.
###  session_before_tree 
[ Copied ](https://pi.dev/docs/latest/compaction#session-before-tree)
Fired before `/tree` navigation. Always fires regardless of whether user chose to summarize. Can cancel navigation or provide custom summary.

```
pi.on("session_before_tree", async (event, ctx) => {
  const { preparation, signal } = event;

  // preparation.targetId - where we're navigating to
  // preparation.oldLeafId - current position (being abandoned)
  // preparation.commonAncestorId - shared ancestor
  // preparation.entriesToSummarize - entries that would be summarized
  // preparation.userWantsSummary - whether user chose to summarize

  // Cancel navigation entirely:
  return { cancel: true };

  // Provide custom summary (only used if userWantsSummary is true):
  if (preparation.userWantsSummary) {
    return {
      summary: {
        summary: "Your summary...",
        details: { /* custom data */ },
      }
    };
  }
});

```

See `SessionBeforeTreeEvent` and `TreePreparation` in the types file.
##  Settings 
[ Copied ](https://pi.dev/docs/latest/compaction#settings)
Configure compaction in `~/.pi/agent/settings.json` or `<project-dir>/.pi/settings.json`:

```
{
  "compaction": {
    "enabled": true,
    "reserveTokens": 16384,
    "keepRecentTokens": 20000
  }
}

```
  
| Setting  | Default  | Description  |  
| --- | --- | --- |  
| `enabled`  | `true`  | Enable auto-compaction  |  
| `reserveTokens`  | `16384`  | Tokens to reserve for LLM response  |  
| `keepRecentTokens`  | `20000`  | Recent tokens to keep (not summarized)  |  
Disable auto-compaction with `"enabled": false`. You can still compact manually with `/compact`.
[Earendil Inc.](https://earendil.com/) & Contributors
[Press Kit](https://pi.dev/press-kit)
MIT License
[](https://github.com/earendil-works/pi/tree/main/packages/coding-agent "GitHub")[](https://www.npmjs.com/package/@earendil-works/pi-coding-agent "npm")[](https://discord.com/invite/3cU7Bz4UPx "Discord")
[](https://earendil.com "Earendil Inc. website")AutoLightDark
pi.dev domain graciously donated by [exe.dev](https://exe.dev)
