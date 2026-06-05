---
description: Generate terse Conventional Commit messages
argument-hint: "[instructions]"
---

Generate a terse Conventional Commit message for the relevant/staged changes.

Rules:
- Format: `<type>(<scope>): <imperative summary>`; scope optional.
- Subject ≤50 chars when possible, hard cap 72.
- Body only for non-obvious why, breaking changes, migrations, security fixes, reverts, or issue refs.
- No AI attribution, no filler, no trailing period.
- Output only a copy-ready commit message in a code block.

Additional instructions: $ARGUMENTS
