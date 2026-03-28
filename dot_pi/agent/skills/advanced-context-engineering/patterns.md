# Advanced Context Engineering — Patterns Reference

Extended reference for the `advanced-context-engineering` skill. Load when you need specific patterns for workflow design, compaction, or artifact handoff.

## 12-Factor Agent Principles (Applicable Subset)

### F2: Own Your Prompts
Treat prompts as first-class code. Don't outsource to abstractions that hide what's in the context. Full control over exactly what tokens reach the model.

### F3: Own Your Context Window
The context window is the ONLY interface with the LLM. Structure information for maximum signal-to-noise. Custom formats beat generic message arrays when you need density.

### F7: Contact Humans With Tools
Build human-in-the-loop as explicit tool calls, not conversation pauses. Use Linear comments for structured feedback.

### F8: Own Your Control Flow
Mix deterministic steps (git, lint, test, commit) with agent steps (research, implement). The agent is creative within a deterministic harness. Chains are this pattern.

### F9: Compact Errors
When a tool fails, compact the error into useful context. Max 3 retry attempts. If still failing, document and escalate — don't spin.

### F10: Small, Focused Agents
As context grows, LLMs lose focus. Keep each agent to 3-20 tool calls. Smaller scope = better performance. This is why we split into research → plan → implement rather than doing everything in one session.

## Compaction Artifact Patterns

### Research Artifact
```markdown
# Research: [topic]
## Summary (2-3 sentences)
## Key Files (path:line + description)
## Architecture (Input → Processing → Output)
## Patterns to Follow (convention + file reference)
## Constraints/Gotchas (risk + why it matters)
```

### Plan Artifact
```markdown
# Plan: [task name]
## Goal (one sentence)
## Current State / Desired End State (2-3 bullets each)
## What We're NOT Doing (scope exclusions)
## Phase N: [Name] — [Effort tag]
  Changes: file → specific change
  ISC Criteria: 4+ checkable items
  Commit: conventional format
## Testing Strategy
## Risk Mitigation
```

### Implementation Artifact
```markdown
## Phase N — ✅ Complete
### Changes (file:line → what changed)
### Verification (✅/❌ per ISC criterion + lint + tests)
### Commit (hash + message)
```

### Review Artifact
```markdown
# Code Review
## Verdict: APPROVE / REJECT
## Plan Deviations (improvement or regression?)
## Findings (severity + file:line + action)
## QA Executability (all steps agent-executable?)
```

## Context Budget Guidelines

| Component | Budget | Rationale |
|-----------|--------|-----------|
| System prompt | <5KB | Loaded every turn — keep lean |
| Skill content | On-demand | Progressive disclosure — only when needed |
| Agent context | In subprocess | Isolated — zero cost to main session |
| Trait fragments | ~200 bytes each | 3-5 lines, imperative, no filler |
| Subagent output | <1KB (scout), <1.5KB (research) | Compressed handoff for parent |
| Chain artifacts | <2KB each | Dense enough for next step, no noise |

## Decision Framework: Delegate vs Direct

```
Is this trivial (1-2 tool calls, known file)?
  YES → Do directly
  NO ↓

Does it require exploration (unknown scope)?
  YES → Delegate to scout/eagle-scout
  NO ↓

Is it specialized (PM, web research)?
  YES → Delegate to project-manager/researcher
  NO ↓

Will it use >20% of my context for exploration?
  YES → Delegate
  NO → Do directly, but compact results
```

## Chain Step Model Selection

| Step purpose | Model | Why |
|-------------|-------|-----|
| Deterministic (branch, PR) | haiku | Cheap, follows templates |
| Fast exploration | haiku (scout) | Speed over depth |
| Deep exploration | sonnet (eagle-scout) | Complex tracing needs |
| Planning | opus + high thinking | Highest-leverage artifact |
| Standard implementation | sonnet + medium | Good enough, fast |
| Complex implementation | opus + medium | Architecture decisions |
| Code review | codex + high | Deep code understanding |

## Mental Model Alignment

From Blake Smith: The most important function of code review is **mental alignment** — keeping everyone's mental model of the system current.

Applied to agent workflows:
- Plans are the primary alignment artifact. A reviewable plan beats reviewable code.
- Research documents ARE the speed-run for understanding unfamiliar code.
- Chain retrospectives (Linear project updates) keep the project owner aligned without reading code.

"I can't read 2000 lines of code daily. I CAN read 200 lines of a well-written implementation plan."

## Error Recovery Pattern

```
Attempt 1: Try the obvious fix
  FAIL → Read error carefully
Attempt 2: Try an alternative approach
  FAIL → Step back, re-read context
Attempt 3: Try one more approach
  FAIL → STOP. Document. Escalate.
    - If on a Linear issue → post comment with failure details
    - If part of a project → create issue with blocker
```

Never: leave code broken, delete failing tests, continue hoping, shotgun debug.
