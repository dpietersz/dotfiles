---
description: Review code with terse actionable comments
argument-hint: "[focus]"
---

Review the relevant diff/code with caveman-review style.

Format each finding as one line:
`<file>:L<line>: <severity>: <problem>. <fix>.`

Severity:
- `🔴 bug:` broken behavior
- `🟡 risk:` fragile/racy/missing guard
- `🔵 nit:` optional style/naming/micro-optimization
- `❓ q:` genuine question

Drop filler and hedging. Keep exact symbols, paths, and line numbers. Use normal clarity for security findings or architectural rationale when one line would be ambiguous.

Focus: $ARGUMENTS
