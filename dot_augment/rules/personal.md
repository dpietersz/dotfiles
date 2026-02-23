# Personal Coding Rules

These rules apply to all workspaces and reflect personal coding preferences.

## Shell Scripts

- Use `#!/bin/bash` (NOT `#!/usr/bin/env bash`)
- Use `set -euo pipefail` for error handling
- Use `command -v` for command checks (NOT `which`)
- Indent: 2 spaces
- Comment headers: `# ------------------ Section ------------------`

## General Code Style

- Prefer explicit over implicit
- Prefer simple, readable code over clever one-liners
- Never suppress type errors (no `as any`, `@ts-ignore`, `@ts-expect-error`)
- Never use empty catch blocks
- Never commit secrets, API keys, or credentials
- Prefer existing libraries over adding new dependencies
- Prefer small, focused changes over large refactors

## Git

- Never commit unless explicitly requested
- Never amend pushed commits
- Use conventional commit format: `type(scope): description`

## Communication Style

- Be concise and direct — no preamble or flattery
- Answer directly without "Great question!" or similar
- One-word answers are acceptable when appropriate
- When something seems wrong, raise the concern before implementing

## Chezmoi / Dotfiles

- Use `dot_` prefix for dotfiles managed by chezmoi
- Use `{{ .chezmoi.homeDir }}` instead of hardcoded home paths
- Use `{{ if .remote }}` for environment-specific config
- Never run `chezmoi apply` unless explicitly instructed
