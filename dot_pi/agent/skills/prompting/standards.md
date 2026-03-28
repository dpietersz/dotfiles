# Prompt Engineering Standards — Complete Reference

Extended reference for the `prompting` skill. Load this when you need the full standards, templates, or empirical backing. The SKILL.md has the working essentials.

## Empirical Foundation

Prompt structure has measurable, significant impact on output quality:
- **Performance range**: 10-90% variation based on structure choices
- **Few-shot examples**: +25% to +90% improvement (optimal: 1-3 examples, diminishing returns after 3)
- **Structured organization**: Consistent gains across reasoning tasks
- **Clear instructions**: Reduces ambiguity and improves task completion

## Context Window Optimization

### The Attention Budget

LLMs have a finite attention budget. As context length increases, model performance degrades. Optimization priorities:

1. **Correctness** — No incorrect information (leads to confidently wrong output)
2. **Completeness** — No critical gaps (leads to hallucinated gap-filling)
3. **Signal-to-noise** — Every token earns its place
4. **Trajectory** — Context steers toward the goal, not away from it

### Utilization Target: 40-60%

From Advanced Context Engineering:
> "The more you use the context window, the worse the outcomes you'll get."

Design workflows to keep context utilization in the 40-60% range. Techniques:
- **Subagent delegation** — Exploration in isolated context, return compressed brief
- **Artifact handoff** — Each step produces a dense document, next step starts fresh
- **Just-in-time loading** — Load reference material only when needed
- **Frequent compaction** — Distill accumulated context into structured artifacts

### Compaction Best Practices

A good compaction artifact includes:
- **Goal**: What we're trying to achieve
- **Current state**: What exists, what's been done
- **Key decisions**: Choices made and rationale
- **File references**: `path/file:line` for every claim
- **Next steps**: What remains to be done
- **Blockers**: Anything that prevents progress

## Prompt Architecture Patterns

### 1. Research Prompt Pattern

Used for understanding codebases, gathering context, documenting what exists.

```markdown
# Research: [Topic]

## CRITICAL: READ-ONLY — Document What Exists
- Do NOT suggest improvements
- Do NOT propose changes
- ONLY describe what exists, where, and how it works

## Instructions
1. Read all referenced files completely
2. Use grep/find to locate relevant code
3. Trace data flow through imports and calls
4. Map architecture: Input → Processing → Output

## Output Format
# Research: [Topic]
## Summary
[2-3 sentences covering full scope]
## Key Files
- `path/file:line` — [description, role in system]
## Architecture
- Input: [where data comes from]
- Processing: [key components, data flow]
- Output: [where data goes, side effects]
## Patterns to Follow
- [Convention]: [how implemented, file reference]
## Constraints/Gotchas
- [Risk]: [why it matters, file reference]
```

### 2. Planning Prompt Pattern

Used for creating implementation plans with ISC criteria.

```markdown
# Plan: [Task Name]

## Instructions
Create a phased plan. Each phase must have ISC (Independent, Specific, Checkable) criteria.

Read the research artifact first. Then create the plan.

## ISC Methodology
Each criterion MUST be atomic and verifiable:
1. **"And"/"With" test**: Contains "and"? → split into separate criteria
2. **Independent failure test**: Can part A pass while B fails? → separate
3. **Scope word test**: Uses "all", "every"? → enumerate specifically
4. **Domain boundary test**: Crosses UI/API/data? → one per boundary

Minimum 4 criteria per phase.

## Output Format
# Plan: [Task Name]
## Goal
[One sentence]
## Current State
[2-3 bullets]
## Desired End State
[2-3 bullets]
## What We're NOT Doing
[Explicit scope exclusions — prevents creep]
## Phase 1: [Name]
**Changes:**
- File: `path/file` → [specific change]
**ISC Criteria:**
- [ ] [Specific verifiable condition]
- [ ] [Specific test command]
## Testing Strategy
[Per-phase + cumulative verification]
```

### 3. Implementation Prompt Pattern

Used for executing a plan step by step.

```markdown
# Implement: [Task Name]

## Instructions
Read the plan completely. Execute each phase in order.

For each phase:
1. Read relevant files fresh (don't assume from plan)
2. Implement following the plan's INTENT, adapting to reality
3. Run lint and tests
4. If failures: fix (max 3 attempts), then note and continue
5. Commit: `git add -A && git commit -m "type(scope): description"`
6. Verify ISC criteria
7. Move to next phase

## Enforcement
⛔ ENFORCEMENT: Follow plan intent, not plan letter.
If reality diverges from plan, follow reality. Note the deviation.

⛔ ENFORCEMENT: Max 3 fix attempts per failure.
If still failing after 3 attempts, commit what works and note the issue.

## Output Format (per phase)
## Phase N: [Name] — ✅ Complete
### Changes
- `file:line` → [what changed]
### Verification
- [✅/❌] ISC-1: [criterion] → [result]
- [✅/❌] Lint passes
- [✅/❌] Tests pass
### Commit
`abc1234 type(scope): description`
```

### 4. Agent System Prompt Pattern

Used for defining subagent behavior.

```markdown
---
name: agent-name
description: What this agent does
tools: read, grep, find, ls, bash
model: provider/model-name
---

[1-2 sentences: what this agent does and why.]

## Instructions
1. [Primary directive]
2. [Secondary directive]
3. [Output requirement]

## Output Format
[Exact structure — subagent responses should be <1KB]

## Constraints
- [Boundary 1]
- [Boundary 2]
```

### 5. Chain Step Prompt Pattern

Used for individual steps in a chain pipeline.

```markdown
## agent-name
output: artifact.md
reads: previous-artifact.md
model: provider/model

[Context: what this step does and why, in 1-2 sentences.]

**MANDATORY OUTPUT FORMAT:**
[Exact structure the next step expects]

**Steps:**
1. [Read artifacts from previous steps]
2. [Core work of this step]
3. [Produce output artifact]

**⛔ ENFORCEMENT:** [Critical rule that prevents cascading failure]

TASK: {task}
PREVIOUS: {previous}
```

## Markdown-First Design

Use markdown for ALL prompt structure. Never XML tags.

❌ `<instructions>Do something</instructions>`
✅ `## Instructions\nDo something`

Markdown provides semantic clarity without token waste or special parsing.

## Advanced Patterns

### Parallel Tool Calling
```markdown
## Parallel Execution
Make all independent tool calls in parallel. Sequential only when results depend
on previous calls. Never guess parameters — read files first.
```

### Prevent Overengineering
```markdown
## Constraints
- Implement minimum complexity for current task
- Do not add unrequested features or refactor surrounding code
- Reuse existing abstractions — follow DRY
- Clean up temporary files when done
```

### Self-Fix Protocol
```markdown
## Error Handling
If lint or tests fail:
1. Read error output carefully
2. Fix the specific issue
3. Re-run verification
4. Max 3 attempts — if still failing, commit what works, note the issue
```

### Human Verification Gates
```markdown
## Verification
After automated checks pass, inform the human:

Phase [N] Complete — Ready for Manual Verification

Automated: [list what passed]
Manual needed: [list what the human should check]
```

## Quick Reference: Transformations

| ❌ Avoid | ✅ Use Instead |
|----------|---------------|
| "You are a senior engineer" | "Extract all function signatures from..." |
| "CRITICAL: You MUST use this" | "Use this tool when..." |
| "Don't use markdown" | "Write in flowing prose paragraphs" |
| "NEVER do X" | "Do Y instead" |
| "Think about this carefully" | "Evaluate this" / "Consider this" |
| "You should probably..." | "Do X" (imperative) |
| 10 examples | 1-3 examples |
| "Make it better" | "Change X to achieve Y" |
| Loading everything upfront | Just-in-time reference loading |
| "Handle appropriately" | "When X occurs, do Y" |

## Key References

- **Advanced Context Engineering for Coding Agents** — Frequent Intentional Compaction, research/plan/implement, human leverage points (`docs/advanced-context-engineering-for-coding-agents.md`)
- **12-Factor Agents** — Own your prompts (F2), own your context window (F3), small focused agents (F10), compact errors (F9) (`.ai/ref-docs/github.com/humanlayer/12-factor-agents/`)
- **Pi Documentation** — Skills, extensions, subagents (`.ai/ref-docs/github.com/badlogic/pi-mono/`)
- **Implementation Chain** — Production exemplar of chain step prompting (`dotfiles/home/dot_pi/agent/agents/implementation.chain.md`)
