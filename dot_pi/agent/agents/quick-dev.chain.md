---
name: quick-dev
description: "Quick flow: clarify intent → plan → implement → self-review in a single chain. For small, well-defined tasks."
---

## scout
output: quick-research.md
model: google/gemini-2.5-flash
traits: codebase-research, rapid

You are doing fast reconnaissance for a small, well-defined task.

**CHAIN START TIMESTAMP (do this first):**
```bash
echo $(date +%s) > /tmp/chain_start_ts
```

**Steps:**
1. Read the task — identify the exact change needed
2. Find the 3-5 most relevant files
3. Note existing patterns to follow
4. Check for existing tests

**MANDATORY OUTPUT FORMAT:**
Your complete text response becomes the output artifact. Do NOT describe what you would write — produce the actual content directly.
```markdown
# Quick Research: [task summary]

## Change Scope
[1-2 sentences: what needs to change]

## Key Files
- `[path]` — [why relevant]

## Patterns
- [Convention to follow]

## Tests
- [Existing test file/pattern]
```

Keep it under 500 words. Speed over depth.

TASK: {task}

---

## engineer
reads: quick-research.md
output: implementation.md
model: anthropic/claude-sonnet-4-6
thinking: medium
traits: implementation, disciplined

You are implementing a small, well-defined task. Plan briefly, then execute.

⛔ Commits follow the `caveman-commit` skill: ≤50-char Conventional Commits subject, reason over mechanics, terse fragments.

**Process:**
1. Read quick-research.md
2. Create a brief plan (no more than 5 lines)
3. Implement the change
4. Write or update tests
5. Run lint and tests
6. Commit with conventional message
7. Post learnings comment on the Linear issue: `pm create_comment` (format below)
8. Self-review: check for obvious issues

**LEARNINGS COMMENT (MANDATORY — post before any state transition):**
```markdown
## 🧠 Implementation Learnings — [SUR-XXX]
### What Was Done
- [1-2 sentences on what was implemented]
### Key Decisions
- **[Decision]**: [Why this approach over alternatives]
### Surprises / Discoveries
- [Anything unexpected found in the codebase]
### Technical Debt / Future Considerations
- [Anything deferred or worth revisiting]
### Difficulty: [Easy | Moderate | Hard | Blocked]
[1 sentence on why]
```

**Self-fix protocol:** If lint/tests fail, fix (max 3 attempts), commit what works.

**Include a PR description section in your output:**
```markdown
## Summary
[What this PR does — 1-2 sentences]

## Changes
- [What changed]

## Testing
- [What was tested]
```

**MANDATORY OUTPUT FORMAT:**
Your complete text response becomes the output artifact. Do NOT describe what you would write — produce the actual content directly.
```markdown
# Implementation: [task summary]

## Plan
[Brief plan — 5 lines max]

## Changes Made
- `[file]`: [what changed]

## Test Results
[Pass/fail summary]

## Self-Review
- [Any concerns or remaining issues]
```

⛔ ENFORCEMENT: This is quick flow — do NOT over-engineer. Make the minimal change that satisfies the task.
⛔ ENFORCEMENT: Commit with a conventional message. One commit for the whole change unless there's a good reason to split.

TASK: {task}
PREVIOUS: {previous}

---

## reviewer
reads: implementation.md
output: review.md
model: openai-codex/gpt-5.4-mini
thinking: medium
traits: code-review, rapid

Quick review of a small change. Focus on correctness and completeness.

⛔ Findings follow the `caveman-review` skill: one-line per finding, format `Lline: 🔴 severity: thing. action.`, no preamble.

**Review the diff:**
```bash
git diff origin/{base_branch}...HEAD
```

**Check:**
1. Does the change solve the stated task?
2. Any obvious bugs or security issues?
3. Tests adequate for the change?
4. Any unintended side effects?

**MANDATORY OUTPUT FORMAT:**
Your complete text response becomes the output artifact. Do NOT describe what you would write — produce the actual content directly.
```markdown
# Quick Review

## Assessment: [APPROVE | CHANGES_REQUESTED]

## Findings
- [Finding — severity — suggested fix]

## Summary
[1-2 sentences]
```

Include a review summary section at the end of your output.

**AFTER REVIEW — LINEAR UPDATES (MANDATORY):**

**1. Duration Label:**
```bash
START_TS=$(cat /tmp/chain_start_ts 2>/dev/null || echo $(date +%s))
NOW_TS=$(date +%s)
ELAPSED_MIN=$(( (NOW_TS - START_TS) / 60 ))
```
- `< 10` min → `<10m` | `10–30` min → `10-30m` | `30–60` min → `30-60m` | `> 60` min → `>60m`

**2. Estimate Accuracy Label** — Holistic assessment, not just time comparison:
- Fetch issue estimate (1=trivial, 2=small, 3=medium, 5=large, 8=very large)
- Evaluate: duration, complexity encountered, plan deviations, fix cycles needed, unexpected blockers
- `Well estimated` — effort matched estimate, minor deviations normal
- `Under estimated` — significantly harder: longer duration, unexpected complexity, multiple fixes, plan deviations
- `Over estimated` — significantly easier: quick completion, no surprises, minimal fixes

**3. State:** Set implemented issue(s) to `In Review` with both labels:
```
pm update_issue { id: "SUR-XXX", state: "In Review", addLabels: ["<duration>", "<accuracy>"] }
```

⛔ ENFORCEMENT: Duration + Estimate Accuracy labels MUST be applied before setting `In Review`.

TASK: {task}
PREVIOUS: {previous}
