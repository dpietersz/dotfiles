---
description: Orchestrate a production-grade code review using the code-review skill. Launches parallel subagents for architecture/scope, security, and quality enforcement — then fixes critical issues, incorrect docstrings, TODOs, and incomplete implementations inline. No corners cut.
argument-hint: [file-path, PR number, or "staged" for staged changes]
---

Use the code-review skill to conduct a thorough, production-grade code review.

$ARGUMENTS

If no arguments provided, review the current staged changes (`git diff --staged`).

Follow the full code-review skill workflow:
1. Launch three subagents in parallel: scope/architecture/intent, security deep-dive, quality enforcement
2. Run the build and test suite — fix build errors before proceeding
3. Create a task list from all findings, one task per concern area
4. Work through each task systematically — fix inline: critical bugs, incorrect docstrings, TODOs, placeholder code, commented-out code, build failures
5. Document but defer: high/medium/low issues that don't block correctness
6. Invoke penetration-tester only if security trigger conditions are met
7. Produce the structured report with APPROVE / REQUEST CHANGES / BLOCK recommendation
