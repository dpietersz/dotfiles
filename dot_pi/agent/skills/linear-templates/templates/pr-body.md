# PR Body Template

Used when creating GitHub PRs that resolve Linear issues.

**PR title format**: `[Minion] [Primary issue title or summary]`

## Chain Artifact Mode (Orchestrated PR Creation)

When the implementation chain writes the PR body as an artifact (`/tmp/minion/pr-body.json`), the chain writes **only the body content** — the orchestrator appends the footer deterministically during PR creation. The artifact format is:

```json
{"body": "<markdown body content without footer>"}
```

**Do NOT include the footer** (`---\n*Created by Minion AI Agent — implementation chain*`) in the artifact. The orchestrator's `CreatePRWorker` appends it.

## Body Template

```markdown
## Context & Motivation
[WHY this change exists. Link primary issue. 2-3 sentences.]

## What Changed
[HIGH-LEVEL architectural summary. 2-3 sentences.]

## Issues Resolved
- [SUR-XXX] [Title] — [1-line what it does]

## Key Design Decisions
- **[Decision]**: [Rationale]

## How to Verify
- [Step-by-step for reviewer]
- Lint: ✅/❌ | Tests: ✅/❌ | Code review: ✅/❌

## Risks & Follow-ups
- [Deferred items, known limitations]
```

## Footer (appended by orchestrator)

The orchestrator's `CreatePRWorker` appends this footer to every PR body:

```markdown

---
*Created by Minion AI Agent — implementation chain*
```
