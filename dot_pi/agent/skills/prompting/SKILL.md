---
name: prompting
description: Prompt engineering standards and patterns for pi agents, skills, and chain steps. Covers context engineering, output format design, enforcement patterns, and anti-overengineering. Use when writing prompts, improving prompts, prompt engineering, creating agent prompts, or optimizing chain step instructions.
---

# Prompting

Prompt engineering standards for the pi agent ecosystem. Applies to: skill instructions, chain step prompts, agent system prompts, and any structured instructions for LLMs.

**Core philosophy**: Find the smallest set of high-signal tokens that maximize the likelihood of desired outcomes. Every token depletes the attention budget.

Load [standards.md](standards.md) for the complete reference. Below is the working essentials.

## The Prompt Quality Equation

```
Quality = f(Correctness, Completeness, Size, Trajectory)
```

Worst things for your context window, in order:
1. **Incorrect information** — leads to confidently wrong output
2. **Missing information** — leads to hallucinated gap-filling
3. **Too much noise** — dilutes attention on what matters

## Core Principles

### 1. Be Explicit — No Ambiguity
Use imperative voice. Direct instructions.

✅ `Read the config file and extract the database URL.`
❌ `You might want to consider reading the config file to find relevant settings.`

### 2. Tell, Don't Forbid
Positive framing gives a clear target. Negative framing gives a void.

✅ `Write in flowing prose with natural transitions.`
❌ `Don't use bullet points or markdown formatting.`

### 3. Context is Finite — Every Token Costs
Treat your prompt like expensive real estate. Earn every line.

- Remove redundant explanations
- Don't explain WHY unless the WHY changes behavior
- Prefer examples over explanation (1-3 examples optimal)
- Use just-in-time loading: reference files loaded when needed, not always

### 4. Enforce Critical Rules Visually
For rules that cause cascading failures if violated:
```
⛔ ENFORCEMENT: You MUST NOT merge without running tests.
```
Reserve enforcement blocks for 2-3 truly critical rules. Overuse dilutes their power.

### 5. Specify Output Format Explicitly
The single highest-impact improvement for any prompt. Always specify structure.

```markdown
**MANDATORY OUTPUT FORMAT:**
# Title
## Summary
[2-3 sentences]
## Key Findings
- `file:line` — [description]
## Recommendation
[1 paragraph]
```

### 6. Front-Load Constraints
Most important rules first. LLMs pay more attention to the beginning.

```markdown
## CRITICAL: This agent is READ-ONLY
- Do NOT modify any files
- Do NOT suggest changes unless asked
- ONLY describe what exists

## Instructions
[... regular instructions follow ...]
```

### 7. Match Prompt Style to Output Style
The format of your prompt influences the format of the output. If you want structured markdown, write your prompt in structured markdown.

## Prompt Template — Universal

Use this as a starting skeleton. Include only sections your task requires.

```markdown
# [Task Name]

## Context
[WHY this matters — 1-3 sentences. Explain motivation when it changes behavior.]

## Instructions
1. [Primary directive — imperative voice]
2. [Secondary directive]
3. [Verification step]

## Constraints
- [Positive framing: what TO do]
- [Boundary or limitation]

## Output Format
[Exact structure specification]

## Examples
**Example 1: [Scenario]**
Input: [representative input]
Output: [exact desired output]
```

### Section Selection Guide

| Task Type | Required | Recommended | Skip |
|-----------|----------|-------------|------|
| Simple query | Instructions, Output | Context | Examples |
| Implementation | Instructions, Output, Constraints | Context, Examples | — |
| Research/Analysis | Context, Instructions, Constraints | Examples | — |
| Chain step | Context, Instructions, Output, Enforcement | Examples | — |
| Agent system prompt | Context, Instructions, Constraints, Output | — | — |

## Chain Step Prompting (Specialized)

Chain steps have unique constraints. Each step:
- Gets `{task}`, `{previous}`, `{chain_dir}` variables
- Gets behavioral traits composed into the system prompt (via `traits:` config)
- Produces an artifact consumed by the next step
- Runs in an isolated context window (fresh for each step)

### Three-Layer Composition

Each chain step is composed from three layers:
1. **Context file** (agent .md) → WHO: role, skill references, output format
2. **Traits** (traits.yaml) → HOW: expertise, personality, approach
3. **Step prompt** (chain body) → WHAT: workflow instructions, enforcement

Behavioral instructions belong in **traits** (Layer 2), not in the step prompt. The step prompt should be pure workflow + enforcement.

### Artifact Handoff Pattern

Each step compacts its full exploration into a structured document:
```markdown
output: research.md    ← step writes this
reads: research.md     ← next step reads this
```

The output IS the compaction. Design it for the NEXT step's needs, not the current step's exploration.

### Agent + Trait Selection for Steps

| Step type | Agent | Traits | Why |
|-----------|-------|--------|-----|
| Branch/setup | engineer | systematic | Cheap (haiku), deterministic |
| Fast recon | scout | codebase-research, rapid | Quick targeted lookups |
| Deep research | eagle-scout | codebase-research, thorough | Complex multi-file tracing |
| Planning | planner | planning, analytical | Highest leverage artifact (opus+high) |
| Standard impl | engineer | implementation, disciplined | Day-to-day coding (sonnet) |
| Complex impl | lead-engineer | implementation, disciplined, systematic | Architecture decisions (opus) |
| Code review | reviewer | code-review, analytical | Mental model alignment (codex+high) |
| PR creation | engineer | systematic | Template work (haiku override) |
| Review triage | reviewer | code-review, skeptical | Bot comment evaluation |

### Enforcement in Chain Steps

Chain steps MUST enforce rules the agent is likely to violate. These stay in the step prompt (Layer 3), not in traits:
- State transitions it shouldn't make
- Output it must produce before proceeding
- Max 2-3 enforcement blocks per step

```markdown
⛔ ENFORCEMENT: You MUST post a learnings comment BEFORE setting any issue to `In Review`.
No comment = no status transition.
```

## Anti-Patterns

❌ **Wall of text** — Long paragraphs the agent skims. Use structure.
❌ **Redundant emphasis** — "CRITICAL", "IMPORTANT", "MUST" on every line. Reserve for truly critical rules.
❌ **Vague instructions** — "Handle edge cases appropriately." Which edge cases? How?
❌ **Negative-only constraints** — "Don't do X, Y, or Z" without saying what TO do.
❌ **Example overload** — 10 examples when 2 would suffice. Diminishing returns after 3.
❌ **Premature loading** — Loading all reference material upfront "just in case." Load on-demand.
❌ **Anthropomorphizing roles** — "You are a senior staff engineer with 20 years of experience." Define WHAT to do, not WHO to be.
❌ **Overengineered prompts** — 500 lines for a task that needs 50. Complexity ≠ quality.

## Context Engineering Integration

### Subagent Prompts
- Each subagent gets a FRESH context window — include all necessary context
- Target <1KB response — the output is consumed by the parent agent
- Mandatory output format — the parent needs structured data, not prose
- No conversational filler — "Here's what I found:" wastes tokens

### Compaction Prompts
When compacting, include:
1. What was done (completed steps)
2. Current state (what exists now)
3. What remains (next steps)
4. Blockers/decisions needed
5. Key file paths with line references

### Research Prompts
- Document what IS, not what SHOULD BE
- Include file:line references for every claim
- Structured output: Summary → Key Files → Architecture → Patterns → Constraints

### Planning Prompts
- ISC criteria for every phase (Independent, Specific, Checkable)
- "What we're NOT doing" section prevents scope creep
- Minimum 4 criteria per phase
- No open questions — resolve before finalizing

## Reference

For the complete prompt engineering standards including templates, empirical foundation, and advanced patterns, read [standards.md](standards.md).

**Related skills** — prompting applies at every level of the system:
- `agent-design` — Apply prompting standards when writing agent context files and trait fragments
- `chain-design` — Apply when writing chain step prompts and output format specs
- `skill-design` — Apply when writing SKILL.md instructions and descriptions
- `advanced-context-engineering` — Understand WHY context budget matters for prompt decisions
- `run-chains` — Execute chains that use the prompts you've designed
