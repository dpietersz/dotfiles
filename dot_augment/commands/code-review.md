---
description: Orchestrate a production-grade code review using the code-review skill with explore, code-reviewer, and optionally penetration-tester subagents.
argument-hint: [file-path, PR number, or "staged" for staged changes]
---

Use the code-review skill to conduct a thorough, production-grade code review.

$ARGUMENTS

If no arguments provided, review the current staged changes (`git diff --staged`).

Follow the full code-review skill workflow:
1. Use the explore subagent to map the codebase architecture around the changed files
2. Delegate file-level review to code-reviewer subagents (in parallel for large PRs)
3. Run the build and test suite
4. Synthesize all findings into a unified assessment
5. Invoke penetration-tester only if security trigger conditions are met

Return the full review with severity-tiered findings (🔴🟠🟡🔵) and a final APPROVE / REQUEST CHANGES / BLOCK recommendation.
