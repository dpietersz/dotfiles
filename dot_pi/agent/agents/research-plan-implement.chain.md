---
name: research-plan-implement
description: "Research → Plan → Implement. Thorough codebase research, detailed planning with ISC criteria, then autonomous implementation. No PR step."
---

## eagle-scout
output: research.md
model: opencode-go/kimi-k2.6
thinking: medium
traits: codebase-research, analytical, thorough

Research the codebase to build a complete understanding of areas relevant to this task. Document what exists — do not suggest changes.

**Steps:**
1. Read any directly mentioned files completely first
2. Use grep/find to locate relevant code, patterns, conventions
3. Read key files and trace imports/dependencies
4. Check for AGENTS.md and project conventions
5. Look for existing tests and patterns to follow
6. Map cross-component connections and data flows

**LINEAR ISSUE UPDATE (MANDATORY):**
If the task references a Linear issue ID:
1. Assign to Minion: `pm assign_to_minion`
2. Set state to `In Progress`: `pm update_issue`

TASK: {task}

## planner
reads: research.md
output: plan.md
model: openai-codex/gpt-5.5
thinking: high
traits: planning, analytical, systematic

Create a detailed implementation plan from the research findings. Resolve all open questions — the plan must be complete and actionable.

Read research.md completely before planning.

TASK: {task}
RESEARCH: {previous}

## lead-engineer
reads: plan.md
progress: true
model: opencode/claude-opus-4-8
thinking: high
traits: implementation, disciplined, systematic

Implement the plan. Read plan.md completely first, then execute phase by phase.

For each phase:
1. Read all files you'll modify
2. Implement following the plan's intent, adapting to reality
3. Run verification (tests, linting) after each phase
4. Check off ISC criteria in plan.md
5. Commit: `git add -A && git commit -m "type(scope): description"`

If something doesn't match the plan, adapt and document the deviation.

TASK: {task}
PLAN: {previous}
