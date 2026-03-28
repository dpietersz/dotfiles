# Personal Dotfiles — Chezmoi-managed configs for macOS, Bluefin, Bazzite, Fedora & containers

## Architecture

Chezmoi source state in repo root → `chezmoi apply` deploys to `~/`. Templates (`.tmpl`) render per-machine variants using data from `.chezmoi.toml.tmpl` (OS detection, remote/local, hardware model). Secrets loaded from `pass` (GPG-encrypted password store) at shell startup — never committed. External tools (mise, fonts) fetched via `.chezmoiexternals/`. Run-on-change scripts auto-install packages and extension deps when configs change.

## Repository Structure

```
.chezmoi.toml.tmpl          # Chezmoi config: OS/env detection, template variables
.chezmoiignore.tmpl         # Files to exclude from apply (per-OS)
.chezmoiexternals/          # External resources: mise binary, fonts
.chezmoiscripts/            # 32 run-on-change/run-once scripts (install, setup)
dot_config/
├── shell/                  # Modular shell config (00-env → 50-fabric)
├── mise/config.toml.tmpl   # 40+ dev tools managed by mise
├── nvim/                   # Neovim (LazyVim) config
├── ghostty/                # Ghostty terminal config
├── niri/                   # Niri window manager (Linux)
├── opencode/               # OpenCode AI agent config
├── bash/                   # Bash-specific configs
└── zsh/                    # Zsh-specific configs
dot_pi/agent/               # Pi coding agent configuration
├── agents/                 # 11 subagent definitions
├── extensions/             # Custom tools (pm-tool, docsfetch, fabric, webfetch)
├── skills/                 # 9 skills (prompting, agent-design, chain-design, etc.)
├── standards/              # Code quality and security rules
└── traits.yaml             # Behavioral trait composition for subagents
private_dot_ssh/            # SSH config (templated)
private_dot_gnupg/          # GPG config
docs/                       # Diátaxis docs (how-to, reference, explanation)
```

## Key Files

- `.chezmoi.toml.tmpl` — Template variables: `isMacOS`, `isBluefin`, `isBazzite`, `remote`, `hardwareModel`
- `.chezmoiignore.tmpl` — OS-conditional exclusions (Linux-only configs skipped on macOS)
- `dot_config/shell/00-env.sh.tmpl` — All environment variables + secrets via `pass`
- `dot_config/shell/40-aliases.sh` — Shell aliases
- `dot_config/mise/config.toml.tmpl` — Tool versions (node 22.21.0, python 3.12.12, neovim 0.11.4, etc.)
- `dot_pi/agent/settings.json` — Pi agent: model, theme, packages
- `dot_pi/agent/traits.yaml` — Trait definitions for subagent behavioral composition
- `setup.sh` — Bootstrap: installs chezmoi, applies dotfiles
- `.chezmoiscripts/run_onchange_after_01-install-packages.sh.tmpl` — Auto `mise install` on config change

## Tech Stack

- **Dotfile manager**: chezmoi (templating, externals, run-on-change scripts)
- **Tool manager**: mise (40+ tools: node, python, go, terraform, kubectl, etc.)
- **Secrets**: pass (GPG-encrypted password store, loaded at shell startup)
- **Shells**: bash (primary), zsh (secondary)
- **Editor**: Neovim (LazyVim) + Ghostty terminal
- **AI agents**: pi (with minion-subagents, traits, custom tools), Claude Code, OpenCode, Gemini CLI
- **Linux WM**: niri (Wayland compositor), waybar, swayosd
- **Fonts**: Departure Mono, Meslo Nerd Font, Monaspace (via `.chezmoiexternals/`)

## Build/Test Commands

```bash
./setup.sh                            # Bootstrap new machine
chezmoi apply                         # Apply dotfiles (⚠️ only when instructed)
chezmoi diff                          # Preview changes before applying
chezmoi edit-config                   # Edit chezmoi config
chezmoi data                          # Show template variables
```

## Conventions

- **Shell scripts**: `#!/bin/bash`, `set -euo pipefail`, `command -v` for checks, 2-space indent
- **Chezmoi naming**: `dot_` (dotfiles), `executable_` (scripts), `private_` (private), `.tmpl` (templates)
- **Shell config**: Modular files in `dot_config/shell/` — numbered prefixes control load order (`00-env`, `10-path`, `20-tools`, `30-functions`, `40-aliases`, `50-fabric`)
- **Lua (Neovim)**: 2-space indent, 120 max width (see `dot_config/nvim/stylua.toml`)
- **Template variables**: Use chezmoi data (`{{ .isMacOS }}`, `{{ if .remote }}`)
- **Commits**: Conventional commits (`type(scope): description`)
- **Secrets**: Never committed. All secrets loaded from `pass` in `00-env.sh.tmpl` (interactive shells only)
- **Generated files**: Listed in `.chezmoiignore` (lazy-lock.json, node_modules, .venv)

## Dotfiles & Chezmoi

**Multi-OS support** via `.chezmoi.toml.tmpl` data variables:

| Variable | Detection |
|----------|-----------|
| `isMacOS` | `chezmoi.os == "darwin"` |
| `isBluefin` | `/etc/os-release` contains `VARIANT_ID="bluefin"` |
| `isBazzite` | `/etc/os-release` contains `VARIANT_ID="bazzite"` |
| `remote` | SSH_CONNECTION, CODESPACES, or container detected |

**Auto-commit**: On local machines (`not .remote`), chezmoi auto-commits and auto-pushes changes.

**Key patterns**:
- `dot_` prefix → dotfiles (`dot_bashrc` → `~/.bashrc`)
- `.tmpl` suffix → chezmoi template (rendered per-machine)
- `private_` prefix → file mode 0600
- `executable_` prefix → file mode 0755
- `.chezmoiexternals/` → downloads (mise binary, fonts) on first apply

## Pi Agent Configuration

Agent config in `dot_pi/agent/` deploys to `~/.pi/agent/` via chezmoi.

**Subagents** (11 agents with trait composition):
- `scout` — Fast codebase recon (haiku)
- `eagle-scout` — Deep research (sonnet, with progress tracking)
- `planner` — Implementation planning (opus, high thinking)
- `engineer` — General implementation (sonnet)
- `lead-engineer` — Complex architecture (opus)
- `researcher` — Web research synthesis (sonnet)
- `code-reviewer` / `reviewer` — Code review (codex/sonnet)
- `project-manager` — Linear PM specialist (gpt-5.4-mini)
- `context-builder` — Context + meta-prompt generation

**Extensions**: minion-subagents (trait composition + chains), auth-sync (OAuth token sync), context-window, ref-docs, custom tools (pm-tool, docsfetch, fabric, webfetch)

**Skills**: prompting, advanced-context-engineering, agent-design, chain-design, skill-design, agents-md, excalidraw-diagram, linear-templates, pi-customization

## Context Engineering

- **Trait composition**: Add behavioral traits to shape subagent behavior without extra context loading. Traits defined in `dot_pi/agent/traits.yaml` across three dimensions: expertise, personality, approach.
- **Presets**: Named trait+agent combos — `security-auditor`, `careful-implementer`, `deep-researcher`, `quick-scout`, `senior-implementer`
- **Subagent delegation**: Each subagent runs in isolated context window. Returns compressed findings (<1KB for scouts). Keeps main session lean (target 40-60% utilization).
- **Progressive disclosure**: Skills load on-demand. Only descriptions are always in context.
