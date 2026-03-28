---
name: advanced-context-engineering
description: Context engineering strategies for AI coding agents. Covers frequent intentional compaction, research-plan-implement workflows, subagent delegation, artifact handoff design, and context window optimization. Use when designing agent workflows, optimizing context usage, building chains, planning multi-step agent work, or improving agent output quality.
---

# Advanced Context Engineering

Strategies for getting the most out of today's models by engineering what goes into the context window. Based on Frequent Intentional Compaction (ACE-FCA) and 12-Factor Agent principles.

**Core insight**: The context window is your ONLY lever for output quality. Every token either helps or hurts.

## The Context Quality Equation

Optimize in this order (worst problems first):

1. **Incorrect information** → confidently wrong output
2. **Missing information** → hallucinated gap-filling
3. **Too much noise** → diluted attention, degraded performance

Target 40-60% context utilization. Higher = worse outcomes.

## Frequent Intentional Compaction

Design your ENTIRE workflow around context management. Split complex work into phases where each phase produces a dense artifact consumed by the next in a fresh context:

```
Research (explore in context A) → research.md (compacted findings)
    ↓ fresh context
Plan (read research.md in context B) → plan.md (compacted plan)
    ↓ fresh context
Implement (read plan.md in context C) → commits
```

Each artifact IS the compaction. The next phase reads ONLY the artifact — not the exploration that produced it.

**What to compact into artifacts:**
- Goal and current approach
- Key file paths with line references
- Decisions made and rationale
- What remains to be done
- Blockers or open questions

**What to leave out:**
- Search queries that led nowhere
- File contents already summarized
- Tool call logs
- Intermediate reasoning steps

## Human Leverage Hierarchy

Focus human attention on the highest-leverage artifacts:

```
Bad research   → thousands of bad lines of code
Bad plan       → hundreds of bad lines of code
Bad code       → a bad line of code
```

Human reviews research and plans (highest leverage). Let agents handle implementation autonomously within the plan's constraints.

## Subagent Delegation Principles

Subagents are **context isolation boundaries**, not role-play:

- Each subagent gets a FRESH context window — no inherited noise
- Subagent output is compressed handoff (<1KB target for scouts)
- The parent agent stays lean by delegating exploration
- Mandatory delegation: Linear ops → project-manager, code research → scout, web research → researcher

**When to delegate vs do directly:**
- Trivial (1-2 tool calls, known location) → do directly
- Exploration (unknown scope, multiple files) → delegate to scout
- Specialized (PM, web research) → always delegate

## Trait Composition for Context Efficiency

Add behavioral traits to shape subagent behavior without loading additional context:

```json
{ "agent": "scout", "traits": ["security", "skeptical"], "task": "audit auth module" }
```

Traits inject 3-5 lines of behavioral shaping into the system prompt. This is more context-efficient than explaining desired behavior in the task description.

## Chain Design Principles

Chains are structured compaction workflows. Each step:
1. Reads artifacts from prior steps (compacted input)
2. Does focused work in isolated context
3. Produces a structured artifact (compacted output)

**Key rules:**
- Each artifact must be self-contained — next step works with ONLY this artifact + original task
- Behavioral instructions go in traits, workflow instructions in the step prompt
- Enforcement blocks (⛔) stay in step prompts for rules that cause cascading failures
- Use cheapest model that produces acceptable quality per step

For detailed chain design, load the `chain-design` skill.

## Anti-Patterns

❌ **Context hoarding** — Loading all potentially relevant files "just in case." Load on demand.
❌ **Inline exploration** — Doing grep/find/read in the main context when a scout subagent would keep it clean.
❌ **Prompt bloat** — 500 lines of instructions when 50 would do. Complexity ≠ quality.
❌ **Skipping compaction** — Working in one long session until context degrades. Compact early.
❌ **Ignoring research** — Jumping to implementation without understanding the codebase first. Bad research → thousands of bad lines of code.
❌ **Over-engineering chains** — 10 steps when 4 would do. Each step adds latency and potential failure.

## When to Apply This Skill

- Designing a new chain or multi-step workflow
- Noticing degraded agent output quality in long sessions
- Planning work that touches many files or systems
- Deciding whether to delegate or work directly
- Reviewing a chain for context efficiency

## Reference

For detailed patterns, read [patterns.md](patterns.md).

**Related skills** — context engineering is the foundation all other skills build on:
- `agent-design` — Apply context principles when designing agents and the four-level architecture
- `chain-design` — Chains ARE frequent intentional compaction. Each step compacts into an artifact.
- `skill-design` — Skills use progressive disclosure — the core context engineering pattern
- `prompting` — Prompt quality directly affects context signal-to-noise ratio
- `run-chains` — Execute the compaction workflows designed with these principles
