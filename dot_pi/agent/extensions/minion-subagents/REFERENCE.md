# Minion Subagents — Reference Documentation

Customized pi-subagents extension for the Minions AI Infra project. Based on [pi-subagents](https://github.com/nicobailon/pi-subagents) with project-specific agents, chains, tools, skills, and the `chainName` execution mode.

**Extension location:** `dotfiles/home/dot_pi/agent/extensions/minion-subagents/`  
**Deployed to:** `~/.pi/agent/extensions/minion-subagents/` (via chezmoi)

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Agents](#agents)
- [Chains](#chains)
- [Skills](#skills)
- [Tools](#tools)
- [Slash Commands](#slash-commands)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Subagent Tool Reference](#subagent-tool-reference)
- [Chain Files](#chain-files)
- [Agent Files](#agent-files)
- [Execution Modes](#execution-modes)
- [Chain Variables](#chain-variables)
- [Chain Artifacts](#chain-artifacts)
- [Async Execution](#async-execution)
- [Agents Manager TUI](#agents-manager-tui)
- [Customizations vs Upstream](#customizations-vs-upstream)

---

## Architecture Overview

The subagent system provides context-isolated agent execution. Each subagent runs in its own pi session with a fresh context window — this is the core of our context engineering strategy (ACE-FCA).

```
Main Session (40-60% context utilization target)
  │
  ├─ subagent tool ──► scout (haiku, fast recon)
  │                       └─► returns <1KB compressed brief
  ├─ subagent tool ──► linear (sonnet, PM specialist)  
  │                       └─► returns structured issue data
  ├─ subagent tool ──► chain: implementation
  │                       ├─► engineer (branch)
  │                       ├─► scout (research) → research.md
  │                       ├─► planner (plan) → plan.md
  │                       ├─► engineer (implement)
  │                       ├─► engineer (PR)
  │                       └─► reviewer (triage)
  └─ subagent tool ──► researcher (web research)
                          └─► returns research brief with sources
```

**Key principles:**
- Subagents are context isolation boundaries — they explore in their own window and return compressed findings
- Chain steps communicate via artifacts (`research.md`, `plan.md`) in a shared `{chain_dir}`
- Each step's text response becomes `{previous}` for the next step
- Mandatory delegation: Linear ops → `linear`, code research → `scout`, web research → `researcher`

---

## Agents

Agent definitions live in `dotfiles/home/dot_pi/agent/agents/*.md` (user scope) and `dotfiles/home/dot_pi/agent/extensions/minion-subagents/agents/*.md` (builtin scope). User agents override builtins with the same name.

### scout

| Field | Value |
|-------|-------|
| **Model** | `anthropic/claude-haiku-4-5` |
| **Tools** | `read, grep, find, ls, bash, write` |
| **Purpose** | Fast codebase reconnaissance. Returns compressed context (<1KB) for handoff to other agents. |
| **Default behavior** | `defaultProgress: true` |

Use for: exploring codebases, finding relevant files, understanding architecture before planning.

### planner

| Field | Value |
|-------|-------|
| **Model** | `claude-opus-4-6` |
| **Thinking** | `high` |
| **Tools** | `read, grep, find, ls, write` |
| **Purpose** | Creates implementation plans using ISC (Independent, Specific, Checkable) criteria. |
| **Default behavior** | `defaultReads: context.md` |

Use for: creating detailed implementation plans after scout research.

### engineer

| Field | Value |
|-------|-------|
| **Model** | `claude-sonnet-4-6` |
| **Tools** | All (default) |
| **Purpose** | General-purpose implementer with full capabilities. Used for implementation, PR creation, branch management. |
| **Default behavior** | `defaultReads: context.md, plan.md`, `defaultProgress: true` |

Use for: implementing code changes, creating PRs, any task needing full tool access.

### reviewer

| Field | Value |
|-------|-------|
| **Model** | `openai-codex/gpt-5.3-codex` |
| **Thinking** | `high` |
| **Tools** | `read, grep, find, ls, bash` |
| **Purpose** | Code review specialist. Triages automated review bot comments, fixes real issues, dismisses false positives. |
| **Default behavior** | `defaultReads: plan.md, progress.md`, `defaultProgress: true` |

Use for: PR review triage after implementation.

### linear

| Field | Value |
|-------|-------|
| **Model** | `anthropic/claude-sonnet-4-6` |
| **Tools** | `pm, read, write` |
| **Extensions** | `pm-tool.ts` (auto-loaded via tools/index.ts) |
| **Purpose** | Linear project management specialist. Handles issue CRUD, project updates, milestone tracking. Returns structured briefs. |
| **Default behavior** | `defaultProgress: true` |

Use for: ALL Linear operations. Never use pm tool directly from main context — always delegate to this agent.

### researcher

| Field | Value |
|-------|-------|
| **Model** | `anthropic/claude-sonnet-4-6` |
| **Tools** | `read, write, web_search, fetch_content, get_search_content` |
| **Purpose** | Autonomous web researcher. Searches, evaluates, and synthesizes focused research briefs with sources. |
| **Default behavior** | `defaultProgress: true` |

Use for: external information gathering, best practices research, library evaluation.

### context-builder

| Field | Value |
|-------|-------|
| **Model** | `claude-sonnet-4-6` |
| **Tools** | `read, grep, find, ls, bash, web_search` |
| **Purpose** | Analyzes requirements and codebase, generates context documents and meta-prompts for other agents. |

Use for: building comprehensive context before complex multi-step work.

---

## Chains

Chain files live in `dotfiles/home/dot_pi/agent/agents/*.chain.md`. They define reusable multi-step pipelines where each step runs an agent with specific configuration.

### implementation

**File:** `implementation.chain.md`  
**When to use:** Full autonomous development cycle. Works for single issues and epics with sub-issues.

| Step | Agent | Model | Purpose |
|------|-------|-------|---------|
| 1 | engineer | haiku | Create feature branch, assign Linear issue(s), set `In Progress` |
| 2 | scout | sonnet | Research codebase → `research.md` |
| 3 | planner | opus (high thinking) | Create implementation plan with ISC criteria → `plan.md`, post Linear project update |
| 4 | engineer | opus (medium thinking) | Implement all phases sequentially, post learnings comments |
| 5 | code-reviewer | — | Deep code review with plan-to-code fidelity checks → `review.md` |
| 6 | engineer | haiku | Create PR covering all changes |
| 7 | reviewer | — | Triage review bot comments, set Linear to `Done`, post retrospective |

**Linear lifecycle:** Primary issue: `In Progress` → `In Review` → `Done`. Sub-issues (if any): `In Progress` → `In Review` → `Done` (per issue during implementation).  
**Key features:** Code review step for mental model alignment, learnings comments per phase, project update before and after implementation.

### implementation-direct

**File:** `implementation-direct.chain.md`  
**When to use:** Simple, well-defined tasks that don't need research or planning.

| Step | Agent | Purpose |
|------|-------|---------|
| 1 | engineer | Implement changes, assign Linear issue, set `In Progress` |
| 2 | engineer | Create PR, set Linear to `In Review` |

**Linear lifecycle:** `In Progress` → `In Review`

### research-plan-implement

**File:** `research-plan-implement.chain.md`  
**When to use:** Tasks needing deep codebase understanding before coding. No PR step.

| Step | Agent | Model | Purpose |
|------|-------|-------|---------|
| 1 | scout | opus (medium thinking) | Deep codebase research, assign Linear, set `In Progress` → `research.md` |
| 2 | planner | opus (medium thinking) | Detailed planning with ISC methodology → `plan.md` |
| 3 | engineer | opus (medium thinking) | Implement the plan |

**Linear lifecycle:** `In Progress` (no PR/review — use separate chain or manual)

### refine-linear-issue

**File:** `refine-linear-issue.chain.md`  
**When to use:** Creating or refining Linear issues with human-in-the-loop clarification. Works for single issues and epics that get split into sub-issues.

| Step | Agent | Model | Purpose |
|------|-------|-------|---------|
| 1 | scout | sonnet | Research codebase for context → `research.md` |
| 2 | engineer | sonnet | Create/update issue, post clarification questions as Linear comments, refine → `issue.md` |
| 3 | engineer | sonnet | Design implementation spec, append to issue as comment |

**Human interaction:** Step 2 uses Linear comments for clarification questions/answers. All substantive discussion lives in Linear comments for traceability.  
**Templates:** Step 2 reads `standards/issue-templates.md` for Story/Bug/Task templates.  
**Issue splitting:** If scope is too large, step 2 creates sub-issues under a parent epic.

---

## Skills

Skills live in `dotfiles/home/dot_pi/agent/skills/`.

### run-chains

**File:** `skills/run-chains/SKILL.md`  
**Purpose:** Documents how to run saved chains from interactive mode.

Provides instructions and examples for running all 4 chains via:
- `subagent` tool with `chainName` parameter
- `/chain` slash command with saved chain names
- Background execution with `async: true` or `--bg`

### skill-design

**File:** `skills/skill-design/SKILL.md`  
**Purpose:** Skill lifecycle framework — create, maintain, validate: Clarify → Research → Design → Write → Validate.

Includes references:
- `references/pi-skill-spec.md` — Pi Agent Skills standard quick reference
- `references/example-prompts.md` — HumanLayer prompt patterns analysis

### prompting

**File:** `skills/prompting/SKILL.md`  
**Purpose:** Prompt engineering standards for pi agents, skills, and chain steps.

Covers context engineering, output format design, enforcement patterns, anti-overengineering, and prompt templates for research/plan/implement patterns.

Includes: `standards.md` — Complete reference with empirical foundation, all templates, and advanced patterns.

### chain-design

**File:** `skills/chain-design/SKILL.md`  
**Purpose:** Chain lifecycle framework — create, maintain, debug: Clarify → Design → Write → Validate.

Includes references:
- `references/chain-patterns.md` — 10 patterns distilled from the implementation chain
- `references/example-prompts.md` — HumanLayer research/plan/implement prompt analysis

---

## Tools

Custom tools registered by the extension and companion tool extensions:

### subagent (core)

The main tool for delegating to subagents. Supports single, chain, parallel, and saved chain execution modes.

### subagent_status

Inspect async/background subagent run status and artifacts.

### Companion tools (in `extensions/tools/`)

| Tool | File | Purpose |
|------|------|---------|
| `pm` | `pm-tool.ts` | Linear project management (issue CRUD, projects, milestones) |
| `docsfetch` | `docsfetch.ts` | Scrape documentation sites, save as local markdown |
| `webfetch` | `webfetch.ts` | Fetch web page content as markdown/HTML/screenshot |
| `fabric` | `fabric.ts` | Run Fabric AI patterns on text |

---

## Slash Commands

| Command | Description | Examples |
|---------|-------------|---------|
| `/run agent task` | Run a single agent | `/run scout "analyze the auth module"` |
| `/chain ...` | Run saved chain or ad-hoc sequence | `/chain refine-linear-issue "Create issue for caching"` |
| `/chain ... -> ...` | Ad-hoc agent sequence | `/chain scout "analyze" -> planner "create plan"` |
| `/parallel ...` | Run agents in parallel | `/parallel scout "scan frontend" -> scout "scan backend"` |
| `/agents` | Open Agents Manager TUI overlay | `/agents` |

**Flags:**
- `--bg` at end of any command → run in background (async)
- `[key=value]` after agent name → inline config override

**Inline config examples:**
```
/run scout[model=anthropic/claude-sonnet-4] analyze this codebase
/chain scout[output=context.md] "scan" -> planner[reads=context.md] "plan"
```

### /chain — Saved Chain Mode

When the first argument matches a saved `.chain.md` file name, `/chain` runs the full saved chain:

```
/chain refine-linear-issue "Refine SUR-138"
/chain implementation "Implement SUR-150 add caching layer" --bg
/chain research-plan-implement "Refactor auth middleware"
```

When the first argument is an agent name or uses `->` separators, it falls back to ad-hoc mode:

```
/chain scout "analyze auth" -> planner -> engineer
```

Tab-completion suggests both saved chain names and agent names.

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+A` | Open Agents Manager overlay |

---

## Subagent Tool Reference

### Execution Modes

**Single agent:**
```json
{ "agent": "scout", "task": "Analyze the auth module" }
```

**Saved chain (by name):**
```json
{ "chainName": "implementation", "task": "Implement SUR-150", "clarify": false }
```

**Inline chain (step array):**
```json
{
  "chain": [
    { "agent": "scout", "task": "Research {task}", "output": "research.md" },
    { "agent": "planner", "reads": ["research.md"], "output": "plan.md" },
    { "agent": "engineer", "reads": ["plan.md"], "progress": true }
  ],
  "task": "Add rate limiting to API",
  "clarify": false
}
```

**Parallel execution:**
```json
{
  "tasks": [
    { "agent": "scout", "task": "Scan frontend" },
    { "agent": "scout", "task": "Scan backend" }
  ]
}
```

**Parallel within chain (fan-out/fan-in):**
```json
{
  "chain": [
    { "agent": "scout", "task": "Gather context" },
    { "parallel": [
      { "agent": "engineer", "task": "Implement feature A based on {previous}" },
      { "agent": "engineer", "task": "Implement feature B based on {previous}" }
    ], "concurrency": 2 },
    { "agent": "reviewer", "task": "Review all changes from {previous}" }
  ],
  "clarify": false
}
```

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `agent` | string | — | Agent name (single mode) or management target |
| `task` | string | — | Task description |
| `chainName` | string | — | Run a saved `.chain.md` by name (execution) or target for management |
| `chain` | array | — | Inline chain steps |
| `tasks` | array | — | Parallel tasks |
| `action` | string | — | Management: `list`, `get`, `create`, `update`, `delete` |
| `config` | object | — | Agent/chain config for create/update |
| `clarify` | boolean | true (chains) | Show TUI preview before execution |
| `async` | boolean | false | Run in background |
| `model` | string | agent default | Override model |
| `skill` | string/array/false | agent default | Override skills |
| `output` | string/false | agent default | Override output file |
| `cwd` | string | — | Override working directory |
| `chainDir` | string | auto | Persistent chain artifacts directory |
| `maxOutput` | object | 200KB/5000 lines | `{ bytes?, lines? }` truncation limits |
| `agentScope` | string | `both` | `user`, `project`, or `both` |
| `artifacts` | boolean | true | Write debug artifacts |
| `share` | boolean | false | Upload session to GitHub Gist |
| `sessionDir` | string | auto | Override session log directory |
| `includeProgress` | boolean | false | Include full progress in result |

### Management Actions

```json
{ "action": "list" }
{ "action": "get", "agent": "scout" }
{ "action": "get", "chainName": "implementation" }
{ "action": "create", "config": { "name": "my-agent", "description": "...", "systemPrompt": "..." } }
{ "action": "update", "agent": "scout", "config": { "model": "anthropic/claude-sonnet-4" } }
{ "action": "delete", "agent": "my-agent" }
```

---

## Chain Files

### Format

```markdown
---
name: my-chain
description: "What this chain does"
---

## agent-name
output: artifact.md
reads: input.md
model: provider/model
progress: true

Task prompt template with {task}, {previous}, {chain_dir} variables.

## next-agent
reads: artifact.md

Next step's prompt. Gets {previous} from prior step automatically.
```

### Step Config Lines

Config lines go immediately after `## agent-name`, before a blank line:

| Line | Effect |
|------|--------|
| `output: file.md` | Write agent output to `{chain_dir}/file.md` |
| `output: false` | Disable file output |
| `reads: a.md, b.md` | Read files from `{chain_dir}` before running |
| `reads: false` | Disable reading |
| `model: provider/model` | Override agent's default model |
| `skills: skill1, skill2` | Override skills |
| `skills: false` | Disable all skills |
| `progress: true` | Enable `progress.md` tracking |

### File Locations

| Scope | Path | Priority |
|-------|------|----------|
| User | `~/.pi/agent/agents/{name}.chain.md` | Lower |
| Project | `.pi/agents/{name}.chain.md` | Higher |

### Agent Name Resolution

Chain steps use `## agent-name` headers. The agent name **must match an existing agent definition** — there is no automatic fallback. If no matching agent is found, execution fails with "Unknown agent".

To use descriptive step names, create lightweight agent definition files with specific system prompts. Alternatively, reuse generic agents like `engineer` with inline prompts in chain steps (as both `implementation` and `refine-linear-issue` chains do). The `engineer` approach is preferred — it keeps all chain logic in one file and avoids scattered agent definitions.

---

## Agent Files

### Format

```markdown
---
name: agent-name
description: What this agent does
tools: read, grep, find, ls, bash
model: provider/model-name
thinking: high
skill: skill1, skill2
extensions: /path/to/ext.ts
output: context.md
defaultReads: input.md
defaultProgress: true
---

System prompt for the agent goes here.
```

### Frontmatter Fields

| Field | Description |
|-------|-------------|
| `name` | Agent identifier |
| `description` | What the agent does (shown in listings) |
| `tools` | Comma-separated tool allowlist. Absent = all tools. |
| `model` | Default model (e.g. `anthropic/claude-sonnet-4-6`) |
| `thinking` | Extended thinking level: `off`, `minimal`, `low`, `medium`, `high`, `xhigh` |
| `skill` | Comma-separated skills to inject |
| `extensions` | Extension sandboxing. Absent = all. Empty = none. CSV = allowlist. |
| `output` | Default output filename for chain steps |
| `defaultReads` | Default files to read in chain steps |
| `defaultProgress` | Enable progress.md tracking by default |

### File Locations

| Scope | Path | Priority |
|-------|------|----------|
| Builtin | `extensions/minion-subagents/agents/` | Lowest |
| User | `~/.pi/agent/agents/{name}.md` | Medium |
| Project | `.pi/agents/{name}.md` | Highest |

---

## Chain Variables

Templates in chain step tasks support three variables:

| Variable | Description |
|----------|-------------|
| `{task}` | Original task from the first step / user input |
| `{previous}` | Text output from the prior step |
| `{chain_dir}` | Path to the shared artifacts directory |

**Defaults:** First step defaults to `{task}`, subsequent steps default to `{previous}`.

**Parallel output aggregation:** When a parallel step completes, outputs are concatenated:
```
=== Parallel Task 1 (engineer) ===
[output]

=== Parallel Task 2 (engineer) ===
[output]
```

---

## Chain Artifacts

Each chain run creates a directory at `<tmpdir>/pi-chain-runs/{runId}/`:

```
<chain_dir>/
├── research.md       # Scout output
├── plan.md           # Planner output
├── progress.md       # Shared progress tracking
├── exploration.md    # Explorer output (refine chain)
├── created-issue.md  # Issue creator output (refine chain)
└── parallel-{N}/     # Parallel step outputs
    ├── 0-engineer/output.md
    └── 1-engineer/output.md
```

Directories older than 24 hours are cleaned up automatically.

---

## Async Execution

### From tool
```json
{ "chainName": "implementation", "task": "...", "clarify": false, "async": true }
```

### From slash command
```
/chain implementation "task" --bg
/run scout "full audit" --bg
```

### Status check
```json
{ "id": "a53ebe46" }
```
Or use `subagent_status` tool.

### Async artifacts
```
<tmpdir>/pi-async-subagent-runs/<id>/
  status.json        # Source of truth for progress
  events.jsonl       # Event stream
  subagent-log-<id>.md  # Human-readable log
```

---

## Agents Manager TUI

Open with `Ctrl+Shift+A` or `/agents`.

### Screens

| Screen | Description |
|--------|-------------|
| List | Browse agents and chains with search, scope badges, chain badges |
| Detail | View resolved prompt, frontmatter, recent run history |
| Edit | Edit fields with specialized pickers (model, thinking, skills) |
| Chain Detail | View chain steps with flow visualization |
| Parallel Builder | Build parallel execution with per-slot task overrides |
| Task Input | Enter task, toggle skip-clarify, launch |
| New Agent | Create from templates |

### Key Bindings

**List screen:** `↑↓` navigate, `Enter` view, `Tab` select, `Ctrl+N` new, `Ctrl+K` clone, `Ctrl+D` delete, `Ctrl+R` run selected, `Ctrl+P` parallel builder, `Esc` close.

**Parallel builder:** `↑↓` navigate, `Ctrl+A` add, `Del` remove, `Enter` edit task, `Ctrl+R` continue.

**Clarify TUI:** `Enter` run, `e` edit task, `m` model, `t` thinking, `s` skills, `b` toggle background, `w` output file, `r` reads, `p` progress, `S` save to agent, `W` save chain.

---

## Customizations vs Upstream

Our `minion-subagents` is forked from [pi-subagents](https://github.com/nicobailon/pi-subagents). Key customizations:

### Added: `chainName` Execution Mode

The upstream only supports `chainName` for management actions (get/update/delete). We added execution support:

```json
{ "chainName": "refine-linear-issue", "task": "Refine SUR-138", "clarify": false }
```

**Implementation:** In `index.ts`, after management action handling, `chainName` is resolved via `findChains()` and converted to a `chain` steps array before mode detection.

### Added: Saved Chain Support in `/chain` Command

Upstream `/chain` only supports ad-hoc `agent -> agent` sequences. We added saved chain name resolution:

```
/chain refine-linear-issue "Refine SUR-138"
```

Tab-completion includes both chain names and agent names.

### Custom Agent Definitions

All agents have been customized with project-specific models, tools, and prompts:

- `scout` → haiku (cost-efficient recon)
- `planner` → opus with high thinking (quality plans)
- `engineer` → sonnet (balanced implementation)
- `reviewer` → codex with high thinking (code review)
- `linear` → sonnet with sandboxed extensions (PM specialist)
- `researcher` → sonnet with web tools (research)

### Custom Chains with Linear Lifecycle

All implementation chains enforce Linear issue lifecycle management:
- Assign to Minion on start
- Set `In Progress` when work begins
- Set `In Review` when PR is created
- Set `Done` after review triage

### Issue Templates Integration

The `refine-linear-issue` chain reads `standards/issue-templates.md` for consistent Story/Bug/Task templates following INVEST criteria.

### Companion Tool Extensions

Custom tools in `extensions/tools/` that work alongside subagents:
- `pm-tool` — Linear API integration
- `docsfetch` — Documentation site scraping
- `webfetch` — Web content fetching
- `fabric` — AI pattern processing

### Other Extensions

| Extension | Purpose |
|-----------|---------|
| `load-context` | Injects `APPEND_SYSTEM.md` + standards into system prompt |
| `dispatch-chain` | Routes dispatched tasks through appropriate chains |
| `build-agents-md` | Auto-generates `AGENTS.md` for repositories |
| `minion-telemetry` | Records run telemetry to Turso DB |
| `ci-detect` | Detects CI/CD configuration gaps |

---

## Extension File Structure

```
minion-subagents/
├── index.ts                      # Main extension, tool registration, commands
├── agents.ts                     # Agent + chain discovery, frontmatter parsing
├── skills.ts                     # Skill resolution and caching
├── settings.ts                   # Chain behavior resolution, templates
├── schemas.ts                    # TypeBox parameter schemas
├── chain-clarify.ts              # TUI for chain/single/parallel clarification
├── chain-execution.ts            # Chain orchestration (sequential + parallel)
├── chain-serializer.ts           # Parse/serialize .chain.md files
├── async-execution.ts            # Background execution support
├── execution.ts                  # Core runSync, thinking suffix
├── render.ts                     # TUI rendering (widget, tool result)
├── render-helpers.ts             # Shared UI helpers
├── artifacts.ts                  # Artifact management
├── formatters.ts                 # Output formatting
├── types.ts                      # Shared types and constants
├── utils.ts                      # Shared utilities
├── agent-management.ts           # Management action handlers (CRUD)
├── agent-manager.ts              # Overlay orchestrator, screen routing
├── agent-manager-list.ts         # List screen
├── agent-manager-detail.ts       # Detail screen
├── agent-manager-edit.ts         # Edit screen with pickers
├── agent-manager-parallel.ts     # Parallel builder screen
├── agent-manager-chain-detail.ts # Chain detail screen
├── agent-scope.ts                # Scope resolution utilities
├── agent-selection.ts            # Selection state management
├── agent-serializer.ts           # Serialize agents to markdown
├── agent-templates.ts            # Agent creation templates
├── single-output.ts              # Solo agent output handling
├── run-history.ts                # Per-agent JSONL run recording
├── text-editor.ts                # Shared text editor component
├── pi-spawn.ts                   # Cross-platform pi CLI spawning
├── subagent-runner.ts            # Async runner (detached process)
├── parallel-utils.ts             # Parallel execution utilities
├── notify.ts                     # Async completion notifications
├── completion-dedupe.ts          # Notification deduplication
├── file-coalescer.ts             # Debounced file writes
├── jsonl-writer.ts               # JSONL event stream writer
├── package.json                  # Extension package manifest
└── agents/                       # Builtin agent definitions
    ├── scout.md
    ├── planner.md
    ├── worker.md
    ├── reviewer.md
    ├── linear.md
    ├── researcher.md
    └── context-builder.md
```
