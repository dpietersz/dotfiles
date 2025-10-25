# Agent Guidelines for Dotfiles Repository

## Project Overview
This is a **chezmoi-managed dotfiles repository** supporting local, containerized, and cloud development environments (DevPod, VS Code Dev Containers, GitHub Codespaces). Do NOT run `chezmoi apply` unless explicitly instructed.

## Build/Test Commands
- **Bootstrap:** `./setup` (installs chezmoi, applies dotfiles, installs tools via mise)
- **Apply changes:** `chezmoi apply` (⚠️ only run when explicitly instructed)
- **No linting/testing:** This repo contains configuration files, not application code

## Code Style & Conventions

### Shell Scripts (bash)
- Use `#!/bin/bash` (NOT `#!/usr/bin/env bash`)
- Use `set -euo pipefail` for error handling
- Use `command -v` for command checks (NOT `which`)
- Indent: 2 spaces
- Comment headers: `# ------------------ Section ------------------`

### Lua (Neovim config)
- Indent: 2 spaces, max line width: 120 (see `dot_config/nvim/stylua.toml`)
- Use LazyVim conventions (see `dot_config/nvim/lua/`)

### Templates (chezmoi `.tmpl` files)
- Use chezmoi template syntax: `{{ .chezmoi.os }}`, `{{ if .remote }}`
- Check `.chezmoi.toml.tmpl` for available variables

## Naming Conventions
- Chezmoi file prefixes: `dot_` for dotfiles, `executable_` for scripts, `private_` for private files
- Shell functions: snake_case (see `dot_config/shell/30-functions.sh`)
- Aliases: lowercase (see `dot_config/shell/40-aliases.sh`)

## Key Patterns
- Tools managed via **mise** (see `dot_config/mise/config.toml`)
- Modular shell configs sourced from `dot_config/shell/`, `dot_config/bash/`, `dot_config/zsh/`
- Remote/local detection via `.chezmoi.toml.tmpl` (`{{ if .remote }}`)
- Generated files (lazy-lock.json, etc.) listed in `.chezmoiignore`
