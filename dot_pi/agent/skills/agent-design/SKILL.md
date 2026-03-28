---
name: agent-design
description: Create and maintain subagents with traits for the trait-composed agent system. Covers the four-level prompt architecture, context file design, trait creation, model selection, escalation paths, and chain compatibility. Use when creating a new agent, modifying an agent, designing traits, adding a trait dimension, designing agent context files, or troubleshooting agent behavior.
---

# Agent Design

Guide for creating and maintaining agents and traits in the trait-composed agent system. Agents are the building blocks — chains orchestrate them, traits specialize them.

**Before creating a new agent**: Can an existing agent + traits handle this? Adding agents increases the LLM's decision space. Prefer trait composition over new agents.

**Before creating a new trait**: Does it describe a reusable BEHAVIOR (how to think/work), not a role-specific SKILL (what to do)? Traits compose across agents. Role-specific instructions belong in agent context files.

## The Four-Level Prompt Architecture

Understanding which instructions go WHERE is the most critical design decision.

```
Level 1: APPEND_SYSTEM.md (~85 lines — loaded EVERY turn)
  │  Intent gate, clarification, todo enforcement, delegation rules, core behavior
  │  Every line costs attention on EVERY interaction.
  │
Level 2: Agent Context File (.md — loaded in subprocess only)
  │  Role, required knowledge, key principles, output format
  │  60-110 lines. Zero cost to main session.
  │
Level 3: Traits (traits.yaml — injected into agent system prompt)
  │  Behavioral fragments: expertise, personality, approach
  │  3-5 lines each. Composed at runtime via agent-template.hbs. Additive to Level 2.
  │
Level 4: Task Prompt (chain step body or user task)
     Workflow-specific instructions, enforcement blocks, variables ({task}, {previous})
     Specific to one invocation.
```

### What Goes Where

| Instruction type | Level | Example |
|-----------------|-------|---------|
| Universal behavior | 1 (APPEND_SYSTEM) | "Be direct", "Create todos", "Delegate Linear ops" |
| Role identity | 2 (agent .md) | "YOU PLAN. SOMEONE ELSE IMPLEMENTS." |
| Role-specific rules | 2 (agent .md) | "Run lint after changes", "Max 3 issues per rejection" |
| Reusable behavior | 3 (trait) | "Question assumptions", "Comprehensive over speed" |
| Workflow step | 4 (chain/task) | "Set Linear to In Progress", "Post learnings comment" |

**Anti-pattern**: Putting Level 2 in Level 1. "Run lint after changes" in APPEND_SYSTEM.md wastes tokens on every scout/researcher/planner turn.

**Anti-pattern**: Putting Level 3 in Level 2. "Be thorough" hardcoded in scout.md prevents rapid scouts. Make it a trait so the caller chooses.

## Creating a New Agent

### Step 1: Challenge the Need

- Can an existing agent + traits handle this? (scout + security traits vs new "security-scanner")
- Will the LLM know when to use it? (Description must trigger correctly)
- Does it need a DIFFERENT model, tools, or output format?

### Step 2: Choose the Model

Each provider has a strength. Pick based on what the agent primarily does.

**Is this agent primarily shaping the plan or architecture?** → Use **OpenAI GPT**.
GPT-5.x excels at planning, decomposition, structured outputs, and trade-off reasoning.

| Scope | Model | Thinking | Fallback |
|-------|-------|----------|----------|
| Critical planning, risk analysis, test strategy | `openai-codex/gpt-5.4` | high | `anthropic/claude-opus-4-6` |
| PM, task routing, coordination, dependency graphs | `openai-codex/gpt-5.4-mini` | medium | `anthropic/claude-sonnet-4-6` |
| Code review, surgical patches, read→critique→modify | `openai-codex/gpt-5.4-mini` | medium | `anthropic/claude-sonnet-4-6` |

**Is this agent primarily manipulating code or reasoning over large context?** → Use **Anthropic Claude**.
Claude ranks at or near the top for complex coding and long-context tasks.

| Scope | Model | Thinking | Fallback |
|-------|-------|----------|----------|
| Deep refactors, aligning implementation with design intent | `anthropic/claude-opus-4-6` | high | `openai-codex/gpt-5.4` |
| Day-to-day implementation, bug fixes, tests | `anthropic/claude-sonnet-4-6` | medium | `openai-codex/gpt-5.2` |

**Neither — fetch, summarize, scout, or lightly transform?** → Use **Google Gemini Flash**.
Great value for high-volume, expendable work where correctness is easy to verify.

| Scope | Model | Thinking | Fallback |
|-------|-------|----------|----------|
| Scanning, summaries, web research, boilerplate | `google/gemini-2.5-flash` | off | `openai-codex/gpt-5.2` |

**Escalation pairs**: scout→eagle-scout, engineer→lead-engineer. Cheap handles common cases, expensive handles complex ones.

**Current agent-to-model assignments:**

| Agent | Model | Thinking | Fallback | Why this provider |
|-------|-------|----------|----------|-------------------|
| scout | `google/gemini-2.5-flash` | off | `openai-codex/gpt-5.2` | Cheap scouting |
| eagle-scout | `anthropic/claude-sonnet-4-6` | medium | `openai-codex/gpt-5.2` | Deep code reasoning |
| researcher | `google/gemini-2.5-flash` | off | `openai-codex/gpt-5.2` | High-volume web research |
| engineer | `anthropic/claude-sonnet-4-6` | medium | `openai-codex/gpt-5.2` | Day-to-day coding |
| lead-engineer | `anthropic/claude-opus-4-6` | high | `openai-codex/gpt-5.4` | Deep refactors, architecture |
| planner | `openai-codex/gpt-5.4` | high | `anthropic/claude-opus-4-6` | Critical planning |
| reviewer | `openai-codex/gpt-5.4-mini` | medium | `anthropic/claude-sonnet-4-6` | Code review |
| code-reviewer | `openai-codex/gpt-5.4-mini` | medium | `anthropic/claude-sonnet-4-6` | Code review |
| project-manager | `openai-codex/gpt-5.4-mini` | medium | `anthropic/claude-sonnet-4-6` | Coordination, task routing |
| context-builder | `openai-codex/gpt-5.4-mini` | low | `anthropic/claude-sonnet-4-6` | Meta-prompt generation |

**⛔ CRITICAL: When you change an agent's model, you MUST also update every chain step that uses that agent with a `model:` override. Chain step `model:` overrides the agent default — the agent definition alone is not enough.**

### Step 3: Write the Context File

```markdown
---
name: agent-name
description: [Action-oriented. WHEN to use this, not just what it is. Max 1024 chars.]
model: provider/model-name
thinking: level
skills: skill-name-1, skill-name-2
defaultProgress: true
---

**Role**: [One sentence. What this agent does AND does not do.]

## Required Knowledge
- Read AGENTS.md for project conventions.
- [Skills to load. Docs to check. What to read before working.]

## Key Principles
- [Role-specific rules. Imperative voice. Positive framing.]
- [What makes this agent DIFFERENT from others.]

## [Role-Specific Sections]
[Patterns unique to this role — see patterns.md for proven templates.]

## Output Format
[Mandatory structured format. Consuming agents/chains depend on this.]
```

### Step 4: Validate

- [ ] `name` is lowercase kebab-case, matches filename
- [ ] `description` says WHEN to use this agent (trigger-rich)
- [ ] Role defines what it does AND does not do (scope boundary)
- [ ] Output format specified (chains depend on it)
- [ ] No Level 1 instructions duplicated (belongs in APPEND_SYSTEM.md)
- [ ] No hardcoded behaviors that should be traits (Level 3)
- [ ] No inline domain knowledge that should be a skill (via `skills:` frontmatter)
- [ ] Agent works without traits or skills (they are additive)
- [ ] Model matches capability needed (don't use opus for grep)

## Creating and Maintaining Traits

Traits are the behavioral composition layer. Each trait is a reusable prompt fragment that can be applied to ANY agent.

### Trait Dimensions

| Dimension | Purpose | Example |
|-----------|---------|---------|
| **Expertise** | Domain knowledge focus — what to pay attention to | security, planning, code-review |
| **Personality** | Thinking style — how to reason | skeptical, analytical, creative |
| **Approach** | Work methodology — how to execute | thorough, rapid, systematic |

### When to Create a New Trait

Create a trait when:
- The behavior is reusable across 2+ agents
- It describes HOW to work, not WHAT to do
- It's composable — works in combination with other traits
- It's 3-5 lines of imperative instructions

Do NOT create a trait when:
- It's role-specific (put in agent context file)
- It's task-specific (put in chain step prompt)
- It duplicates an existing trait
- It would only be used by one agent (put in that agent's context file)

### Writing a Trait Fragment

```yaml
expertise:
  new-domain:
    name: "Domain Name"
    prompt_fragment: |
      [Line 1: Primary focus directive — what to pay attention to.]
      [Line 2: How to approach it — methodology or framework.]
      [Line 3: What to include in output — evidence standard.]
      [Line 4: What to watch for — risks or gotchas.]
```

**Rules for trait fragments:**
- 3-5 lines maximum. Every line earns its tokens.
- Imperative voice: "Focus on X" not "You should focus on X"
- Positive framing: "Do X" not "Don't do Y"
- No output format instructions (that's Level 2)
- No workflow instructions (that's Level 4)
- No role identity (that's Level 2)

### Trait Fragment Anti-Patterns

❌ **Too vague**: `"Be careful and thorough."` — doesn't change behavior.
❌ **Too specific**: `"Check lines 42-67 of auth.ts for SQL injection."` — that's a task, not a trait.
❌ **Role instructions**: `"You are a security expert with 20 years experience."` — that's Level 2 anthropomorphizing.
❌ **Output format**: `"Return results as a markdown table."` — that's Level 2.
❌ **Duplicate**: A new "meticulous" trait that overlaps with "disciplined" + "thorough".

### Validating a Trait

- [ ] Fragment is 3-5 lines
- [ ] Imperative voice, positive framing
- [ ] Reusable across 2+ agents (not role-specific)
- [ ] Composable with other traits (no conflicts)
- [ ] Doesn't duplicate existing traits
- [ ] Name is lowercase, single word or kebab-case
- [ ] Placed in correct dimension (expertise/personality/approach)

### Skill vs Trait Decision Guide

When adding domain knowledge to an agent or chain step, choose the right mechanism:

| Need | Mechanism | Size | Scope |
|------|-----------|------|-------|
| Behavioral shaping ("be thorough", "question assumptions") | Trait | 3-5 lines | Reusable across all agents |
| Domain workflow instructions (API patterns, integration guides) | Skill via `skills:` | 20-150 lines | Reusable across agents/chains |
| Role identity and output format | Agent context file | 60-110 lines | Specific to one agent |
| One-off workflow step | Chain step prompt | Varies | Specific to one chain step |

**Rule of thumb**: If the knowledge is >5 lines and reusable, it's a skill. If it's ≤5 lines and behavioral, it's a trait. If it defines WHO the agent is, it's the context file.

### The Composition Template (agent-template.hbs)

The template structures how context + traits assemble into the system prompt:

```
# {agentName}

{agent context body}          ← Level 2: role, knowledge, format

---

## Behavioral Profile

### Expertise: {name}
{prompt_fragment}              ← Level 3: domain focus

### {personality name}
{prompt_fragment}              ← Level 3: thinking style

### {approach name}
{prompt_fragment}              ← Level 3: methodology

---

## Operational Guidelines     ← Standard rules for all composed agents
```

Traits are injected between the agent context and the operational guidelines. The template is in `agents/agent-template.hbs` — modify it to change the structure for ALL composed agents.

### How Composition Works at Runtime

```
1. LLM calls: { agent: "scout", traits: ["security", "skeptical"], skill: "linear-app-integration" }
2. execution.ts loads scout.md → context body + frontmatter (incl. default skills)
3. compose-traits.ts loads traits.yaml → resolves trait keys to fragments
4. compose-traits.ts renders agent-template.hbs with context + traits
5. skills.ts resolves skill names → reads SKILL.md files → strips frontmatter
6. Skill content wrapped in <skill> tags, appended to composed system prompt
7. Result = composed system prompt (context + behavioral profile + guidelines + skills)
8. Task = user message (separate from system prompt)
9. Pi subprocess spawns with --no-skills (prevents duplicate catalog) + composed prompt + task
```

Backward compatible: no traits or skills = agent context used as-is.

## Agent Context File Patterns

Proven patterns extracted from production agents. Load [patterns.md](patterns.md) for the full catalog.

**Pre-Flight Analysis** (scout, eagle-scout): Identify literal request vs actual need before searching.

**Turn-End Self-Check** (engineer, lead-engineer): 4-point verification before ending response.

**Identity Constraint** (planner): "YOU PLAN. SOMEONE ELSE IMPLEMENTS." Prevents scope bleed.

**Approval Bias** (reviewer): "80% clear is good enough." With max-3 issues and NOT-my-job list.

**Failure Recovery** (lead-engineer): 3 failures → stop, revert, document in Linear.

**Evidence-Based Completion** (engineer, lead-engineer): NO EVIDENCE = NOT COMPLETE.

## Chain Compatibility

Agents in chains must:
- Produce stable output format (next step parses it)
- Create self-contained artifacts (next step reads only the artifact)
- Accept model overrides (`model:` config in chain step)
- Accept trait composition (`traits:` config in chain step)
- Accept skill injection (`skills:` config in chain step or agent frontmatter)
- Work with chain variables (`{task}`, `{previous}`, `{chain_dir}`)

### Skills in Agent Frontmatter

The `skills:` frontmatter field sets **default skills** for the agent. When a chain step uses this agent without specifying its own `skills:`, these defaults apply. Chain steps can override with `skills: other-skill` or disable with `skills: false`.

```yaml
skills: linear-app-integration    # always inject this skill
skills: skill-a, skill-b          # multiple defaults
# omitted                         # no default skills
```

**Resolution cascade**: step `skills:` > agent frontmatter `skills:` > chain-level `skill` param (merged). See the `chain-design` skill for the full cascade.

**When to set agent-level skills**: When the agent's role fundamentally depends on domain knowledge that most callers need. Example: a `linear-specialist` agent that always needs the `linear-app-integration` skill. If only some chain steps need the skill, set it at step level instead.

## Maintaining Existing Agents

| Situation | Action |
|-----------|--------|
| New capability for existing role | Modify agent context file (Level 2) |
| New reusable behavior (3-5 lines) | Add trait to traits.yaml (Level 3) |
| Reusable domain knowledge (20-150 lines) | Create skill, reference via `skills:` frontmatter or chain step |
| Fundamentally different role | Create new agent |
| Same role, different model tier | Create escalation pair |
| Workflow-specific behavior | Chain step prompt (Level 4) |

### Modification Checklist

- [ ] Change stays at correct level (1/2/3/4)
- [ ] Output format unchanged (or consuming chains updated)
- [ ] Agent still works without traits
- [ ] Description updated if capabilities changed
- [ ] No trait fragments exceed 5 lines

## Reference

- Agent files: `dotfiles/home/dot_pi/agent/agents/*.md`
- Traits: `dotfiles/home/dot_pi/agent/traits.yaml`
- Template: `dotfiles/home/dot_pi/agent/agents/agent-template.hbs`
- Composition engine: `dotfiles/home/dot_pi/agent/extensions/minion-subagents/compose-traits.ts`
- System design: `Plans/trait-composed-agents-system-design.md`

**Related skills** — agents are the core building blocks everything else composes:
- `prompting` — Apply when writing agent context files and trait fragments
- `chain-design` — Chains orchestrate agents. Agent output format must match chain expectations.
- `skill-design` — Know when to create a skill vs an agent vs a trait
- `advanced-context-engineering` — The four-level architecture IS context engineering
- `run-chains` — Execute chains that compose the agents you've designed
