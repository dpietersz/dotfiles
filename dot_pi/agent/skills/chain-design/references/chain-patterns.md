# Chain Patterns — Distilled from Implementation Chain

Analysis of `implementation.chain.md` — our production 7-step chain that demonstrates all advanced patterns. Load this when designing complex chains.

**Source**: `dotfiles/home/dot_pi/agent/agents/implementation.chain.md`

## Architecture Overview

```
Step 1: engineer (haiku-4-5)      → Branch setup          → git branch
Step 2: scout (sonnet-4-6)     → Codebase research     → research.md
Step 3: planner (opus-4-6:high)→ Implementation plan   → plan.md + Linear update
Step 4: engineer (opus-4-6:med)  → Execute plan          → commits + implementation.md
Step 5: code-reviewer      → Code review           → review.md
Step 6: engineer (haiku-4-5)     → PR creation           → PR
Step 7: reviewer           → Bot triage            → Linear updates
```

## Pattern 1: Escalating Model Cost

The chain uses progressively more expensive models where quality matters most:

| Step | Model | Cost | Justification |
|------|-------|------|---------------|
| Branch setup | haiku-4-5 | $ | Deterministic git operations |
| Research | sonnet-4-6 | $$ | Broad search, doesn't need deepest reasoning |
| Planning | opus-4-6:high | $$$$ | Highest leverage artifact — bad plan = bad code |
| Implementation | opus-4-6:medium | $$$ | Needs quality but also speed |
| PR creation | haiku-4-5 | $ | Template-following |
| Review triage | codex-4-6:high | $$$ | Deep code understanding needed |

**Principle**: Invest tokens where the leverage is highest. Planning is the #1 investment.

## Pattern 2: Structured Artifact Handoff

Each step produces a mandatory-format artifact consumed by the next step:

### research.md structure
```markdown
# Research: [task name]
## Summary (2-3 sentences)
## Key Files (path:line + description)
## Architecture (Input → Processing → Output)
## Patterns to Follow
## Constraints/Gotchas
## Implementation Order Recommendation
```

### plan.md structure
```markdown
# Plan: [task name]
## Goal (one sentence)
## Current State (2-3 bullets)
## Desired End State (2-3 bullets)
## What We're NOT Doing (scope exclusion)
## Phase N: [name]
  **Changes:** file → specific change
  **ISC Criteria:** 4+ checkable items
  **Commit:** conventional format
## Testing Strategy
## Risk Mitigation
```

### review.md structure
```markdown
# Code Review: [task name]
## Plan Deviations
## Findings Fixed
## Design Notes
## Remaining Concerns
```

**Key insight**: The artifact IS the compaction. The next step starts with a fresh context and reads only this dense, structured document — not the full exploration that produced it.

## Pattern 3: Multi-Artifact Reads

Later steps read multiple artifacts for comprehensive context:
```
## engineer
reads: plan.md, implementation.md, review.md
```

The PR creation step reads plan (intent), implementation (what happened), and review (what was fixed) to build a comprehensive PR description without re-analyzing code.

## Pattern 4: Enforcement Blocks

Critical rules use visual enforcement blocks:

```
⛔ ENFORCEMENT: You MUST NOT set any issue to `Done`.
Only `In Progress` (start) and `In Review` (after commit).
The final reviewer step owns the `Done` transition.
```

```
⛔ ENFORCEMENT: You MUST post a learnings comment BEFORE
setting any issue to `In Review`. No comment = no status transition.
```

Rules for enforcement blocks:
- Max 2-3 per step (overuse dilutes impact)
- Only for rules that cause cascading failures if violated
- Explain WHY the rule exists (helps the LLM generalize)
- Be specific about what's allowed, not just what's forbidden

## Pattern 5: Self-Fix Protocol

The implementation step includes a bounded error recovery:

```
If lint or tests fail:
1. Read error output carefully
2. Fix the specific issue
3. Re-run verification
4. Max 3 fix attempts — if still failing, commit what works and note the issue
```

From 12-Factor Agents Factor 9: Compact errors. Limit retries. Escalate or move on.

## Pattern 6: Per-Phase Lifecycle

Each implementation phase follows a strict lifecycle:
1. Set Linear issue to `In Progress`
2. Read files fresh (don't assume from plan)
3. Implement, adapting to reality
4. Lint + test
5. Self-fix if needed (max 3)
6. Commit with conventional message
7. Post learnings comment
8. Set Linear issue to `In Review`

This lifecycle is repeated for every phase — deterministic harness around creative implementation.

## Pattern 7: Learnings Propagation

The implementation step posts structured learnings comments per phase:

```markdown
## 🧠 Implementation Learnings — [SUR-XXX]
### What Was Done
### Key Decisions
### Surprises / Discoveries
### Technical Debt / Future Considerations
### Difficulty: [Easy | Moderate | Hard | Blocked]
```

These are consumed by the final step to create a comprehensive retrospective. This maintains team mental alignment — the most important function of the entire chain (per Blake Smith's framing).

## Pattern 8: Review as Mental Alignment

The code review step prioritizes mental alignment over bug-finding:

1. **Mental model alignment** — Does code match plan? Would reading the plan give a correct mental model?
2. **Correctness** — Does the change solve the problem?
3. **Design coherence** — Do abstractions make sense?
4. **Bug prevention** — Race conditions, error handling, security
5. **Style consistency** — Only flag style that hurts readability

This is the hierarchy. Style nitpicks are the LOWEST priority. Mental alignment is the HIGHEST.

## Pattern 9: Progressive Context Variables

Chain steps use variables strategically:

- **First step**: Only gets `{task}` — the original user request
- **Middle steps**: Get `{previous}` (last step's output) + read specific artifacts
- **Later steps**: Read multiple artifacts from `{chain_dir}` for comprehensive context

The key is that EACH step gets exactly the context it needs — no more. The `reads:` config controls which artifacts load.

## Pattern 10: Deterministic + Agent Hybrid

Some steps are deterministic (git operations, file creation) wrapped in an agent step. The agent handles the creative parts while following a deterministic harness:

- Branch naming follows a strict template: `minion/[ISSUE-ID]-[kebab-case-summary]`
- Commits follow conventional commit format
- PR body follows a rigid template
- But implementation adapts to what the agent finds in the code

This is the "blueprints" pattern from Stripe's Minions: fixed workflow steps mixed with LLM agent loops.
