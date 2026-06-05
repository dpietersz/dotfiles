# Pattern: Subagent System

A unified async agent delegation system with live widgets, focus navigation, and input routing.
All subagents — whether spawned by the LLM tool or by `/sub` command — go through the same
async spawn engine, appear as live widgets, and are navigable via keyboard shortcuts.

## File Layout

```
~/.pi/agent/agents/              # Agent definitions (markdown with YAML frontmatter)
├── engineer.md                  # Primary agent (default, inline)
├── explore.md                   # Subagent: fast codebase exploration (OpenCode-style)
├── perplexity-researcher.md     # Subagent: direct Perplexity Sonar API research
└── subagent.md                  # Subagent: generic, hidden, used by /sub command

~/.pi/agent/extensions/subagent/ # Extension (3-file architecture)
├── agents.ts                    # Agent discovery: scans agents/ dirs, parses frontmatter
├── spawn.ts                     # SpawnEngine: async process spawning, widgets, focus
└── index.ts                     # Main extension: tool, commands, events, keybindings
```

## Agent Definition Format

Agent `.md` files live in `~/.pi/agent/agents/` (global) or `.pi/agents/` (project).

```markdown
---
name: explore
description: "Fast agent for exploring codebases. Specify thoroughness: quick, medium, or very thorough."
mode: subagent
model: google/gemini-2.5-flash-lite
tools: read,bash,grep,find,ls
hidden: false
---

System prompt body goes here. This is passed via --append-system-prompt to the subprocess.
```

### Frontmatter Fields

| Field | Required | Values | Description |
|-------|----------|--------|-------------|
| `name` | Yes | string | Agent identifier (used in tool calls and commands) |
| `description` | Yes | string | LLM-facing description (injected into system prompt) |
| `mode` | No | `primary` \| `subagent` \| `all` | Default: `subagent`. Controls behavior |
| `model` | No | `provider/model-id` | Override model for this agent |
| `tools` | No | comma-separated | Restrict tools (e.g., `read,bash,grep,find,ls,perplexity`) |
| `hidden` | No | `true` \| `false` | Hidden agents excluded from LLM's available list |

### Agent Modes

- **`primary`**: Instructions injected into system prompt. Agent acts inline.
- **`subagent`**: Only available via `subagent` tool or `/sub`. Runs in isolated subprocess.
- **`all`**: Both — instructions in system prompt AND available via tool.

## Architecture

### agents.ts — Agent Discovery

Scans directories for `.md` files with valid frontmatter. Supports 3 levels of subdirectories.

Key exports:
- `discoverAgents(cwd, scope)` → `{ agents: AgentConfig[], projectAgentsDir }`
- `getPrimaryAgents(agents)` → agents for system prompt injection
- `getSubagents(agents)` → agents available for delegation (excludes hidden)
- `getVisibleAgents(agents)` → all non-hidden agents

### spawn.ts — Async Spawn Engine

The `SpawnEngine` class manages all background subagent processes.

**Key behaviors:**
- Spawns `pi --mode json -p --session <file> --no-extensions` subprocesses
- Streams JSON events from stdout: `message_update` (text deltas), `tool_execution_start`,
  `message_end` (final text + usage stats)
- **stderr kept separate** — never mixed into output (avoids API key warnings polluting results)
- **Output priority**: `lastAssistantText` (from `message_end`) preferred over streaming `textChunks`
- Live widgets per agent with focus highlighting
- Session management in `.pi/subagent-sessions/` with metadata sidecars

**SpawnEngine API:**
```typescript
spawn(agentConfig, task, options) → SpawnedAgent   // Fire-and-forget
continueAgent(id, prompt, onComplete?) → boolean   // Continue existing session
remove(id) → boolean                               // Kill and remove
clearAll() → { total, killed }                     // Cleanup
focusNext() / focusPrev() / focusPrimary()         // Navigation
findByTaskId(taskId) → SpawnedAgent | undefined     // Resume support
```

**SpawnOptions:**
```typescript
{
  source: "tool" | "command",   // Who initiated
  cwd: string,                  // Working directory
  onComplete?: (spawned, output) => void,  // Fires when process exits
  parentSessionFile?: string,   // For session hierarchy
  taskId?: string,              // Resume existing session
}
```

### index.ts — Main Extension

Integrates everything: agent discovery, primary agent management, async tool, commands, events.

**Two completion callback styles:**
- `makeToolOnComplete(triggerTurn)` — For LLM-spawned subagents. Wraps output in `<task_result>` tags
  via `wrapTaskResult()`. Structured for LLM parsing.
- `makeCommandOnComplete(triggerTurn)` — For `/sub` command. Clean human-readable format (Disler-style):
  `Subagent #1 finished "task" in 12s.\n\nResult:\n{output}`

Both use `pi.sendMessage({ deliverAs: "followUp", triggerTurn })` for async delivery.

## Commands

| Command | Description |
|---------|-------------|
| `/sub <task>` | Spawn background subagent (always uses "subagent" agent). No completions — free text. |
| `/subcont <id> <prompt>` | Continue an existing subagent's conversation |
| `/subrm <id>` | Remove/kill a specific subagent |
| `/subclear` | Clear all subagents |
| `/agents` | List all discovered agents |
| `/switch <name>` | Switch active primary agent (with completions) |

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `ctrl+shift+j` | Focus next subagent |
| `ctrl+shift+k` | Focus previous subagent |
| `ctrl+shift+h` | Focus primary agent (unfocus subagent) |
| `ctrl+shift+a` | Cycle primary agent forward |
| `ctrl+shift+z` | Cycle primary agent backward |

## Event Handlers

| Event | Purpose |
|-------|---------|
| `session_start` | Reset spawn engine, rediscover agents, setup primary agent |
| `session_switch` | Reset spawn engine on `/new` or `/resume` |
| `model_select` | Update agent status bar |
| `before_agent_start` | Inject active primary agent + available subagents into system prompt |
| `input` | Route input to focused subagent when one is focused |

## Widget Rendering

Each spawned subagent gets a widget above the editor:
```
────────────────────────────────────────────────────── (full width, accent when focused)
▶ ✓ Subagent #1 · Turn 2  task preview here...  (12s) | Tools: 5
    Last output line preview...
    3 turns ↑1.2k ↓500 $0.0012 gemini-2.5-flash-lite
────────────────────────────────────────────────────── (full width)
```

- `▶` focus marker (accent color, only on focused agent)
- Status icon: `●` running (warning), `✓` done (success), `✗` error
- Agent name + ID in accent color: `Subagent #1`
- Border color: accent when focused, dim otherwise
- Borders are always full terminal width

## Async Tool (subagent)

The `subagent` tool is async — it returns immediately and delivers results via follow-up messages.

**LLM instructions in system prompt:**
> This tool is ASYNCHRONOUS. It spawns the subagent and returns immediately.
> If your current work DEPENDS on the result, stop after spawning and say you're waiting.
> If the task is INDEPENDENT, continue working — the result arrives when ready.

**Modes:**
- **Single**: `{ agent, task }` — spawn one agent, result as follow-up
- **Parallel**: `{ tasks: [{agent, task}] }` — spawn all, combined follow-up when all complete
- **Chain**: `{ chain: [{agent, task}] }` — sequential, `{previous}` placeholder, final follow-up
- **Resume**: `{ task_id, task }` — continue a previous session

## Key Design Decisions

1. **Async over sync**: All subagents are non-blocking. The LLM decides whether to wait or continue.
2. **Unified spawn engine**: Tool-spawned and command-spawned go through the same `SpawnEngine`.
3. **stderr separation**: Never mix stderr into output — API key warnings, etc. stay separate.
4. **Output priority**: `lastAssistantText` from `message_end` is authoritative; streaming `textChunks` is fallback.
5. **Two callback styles**: Tool-spawned gets structured `<task_result>` wrapping; `/sub` gets clean Disler-style text.
6. **Focus routing**: When focused on a subagent, `input` event intercepts messages and routes to that agent.
7. **Session cleanup**: `session_start` AND `session_switch` both reset the spawn engine.
8. **Hidden generic agent**: The "subagent" agent is `hidden: true` so the LLM uses named agents (explore, etc.)
   while `/sub` uses the generic one.

## Reference Implementation

The live implementation is the reference:
- `~/.pi/agent/extensions/subagent/agents.ts` — Agent discovery
- `~/.pi/agent/extensions/subagent/spawn.ts` — Spawn engine
- `~/.pi/agent/extensions/subagent/index.ts` — Main extension
- `~/.pi/agent/agents/engineer.md` — Primary agent
- `~/.pi/agent/agents/explore.md` — Explore subagent
- `~/.pi/agent/agents/perplexity-researcher.md` — Direct Perplexity Sonar API research subagent (`tools: perplexity`)
- `~/.pi/agent/agents/subagent.md` — Generic subagent (hidden)
