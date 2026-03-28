# Linear State Transition Rules

Consolidated rules for managing Linear issue states across all chain steps.

## Workflow States
`Backlog → Todo → In Progress → In Review → Done` (also: Waiting, Canceled, Duplicate)

## Rules by Role

### Setup (branch creation)
- Parent/epic issue → `In Progress`
- TARGET sub-issues (being worked on) → `Todo` or `In Progress`
- Non-target sub-issues → leave unchanged

### Implementation (per phase)
- Set sub-issue to `In Progress` before starting work
- Set sub-issue to `In Review` after committing + posting learnings comment
- ⛔ NEVER set any issue to `Done` during implementation

### PR Creation
- All TARGET sub-issues → `In Review`
- Parent issue → `In Review` ONLY if REMAINING_OPEN == 0 (all other sub-issues are done)
- If other sub-issues remain open → leave parent in `In Progress`

### Review Triage (final step)
- TARGET sub-issues → `Done`
- Parent issue → `Done` ONLY after re-fetching ALL sub-issues and confirming EVERY one is `Done`
- ⛔ NEVER blindly set parent to `Done` — it cascades and auto-closes all sub-issues in Linear

## Critical Enforcement

⛔ Only the final reviewer step owns the `Done` transition for sub-issues.
⛔ Always re-fetch before closing a parent — verify current state, don't trust cached data.
⛔ Post a learnings comment BEFORE setting any issue to `In Review`.
