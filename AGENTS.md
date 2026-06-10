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
- `.chezmoitemplates/bun-npm-version.tmpl` — Reusable helper that renders latest npm package versions via Bun for `run_onchange_` triggers
- `.chezmoiscripts/run_onchange_after_02a-install-bun-globals.sh.tmpl` — Bun-managed global CLI installs/updates; latest-version comments force rerun when upstream versions change
- `.chezmoiscripts/run_onchange_after_17-configure-localsend.sh.tmpl` — Deep-merges managed `flutter.ls_*` keys into LocalSend's host-side `shared_preferences.json` (LocalSend itself runs inside `data-toolbox`; firewall port 53317 opened by `run_once_after_09-configure-firewall-localsend.sh.tmpl`)
- `.chezmoiscripts/run_once_after_10-enable-fingerprint-pam.sh.tmpl` — Gated on `hasFingerprintReader`. Layers `fprintd`/`fprintd-pam` if missing (Bluefin reboot), enables `authselect with-fingerprint`, hints at `fprintd-enroll`.
- `.chezmoiscripts/run_once_after_11-install-hyprlock-stack.sh.tmpl` — Gated on `hasFingerprintReader`, but now largely redundant: `hyprlock` + `swayidle` are baked into both bluefin-udx images (common.yml), so the binaries exist on every Bluefin machine regardless. The idle/lock STACK runs on **all** niri machines (not just fingerprint ones): `niri-idle-daemon.sh` (swayidle supervisor) is spawned unconditionally, hyprlock is the locker via `Ctrl+Alt+L` and the idle chain, and noctalia's own idle behaviors are disabled in `dot_config/noctalia/config.toml.tmpl`. Deploy of `.config/hypr/` + the idle scripts is gated on `.isBluefin` in `.chezmoiignore.tmpl`; hyprlock auths by fingerprint where a sensor exists (the `fingerprint {}` block in `hyprlock.conf.tmpl`) and by password otherwise. Suspend is owned by `niri-lock.sh`'s lock-scoped timer, not swayidle (niri#2006).

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

## Bun Global CLI Pattern

Use this pattern for npm-distributed CLIs that should stay current across machines:

1. Add package to `.chezmoiscripts/run_onchange_after_02a-install-bun-globals.sh.tmpl` in two places:
   - latest-version comment: `# latest <pkg>: {{ includeTemplate "bun-npm-version.tmpl" (dict "package" "<pkg>") }}`
   - `BUN_GLOBAL_PKGS=(...)`
2. Keep script as `run_onchange_`, not `run_after_`; rendered latest-version comments make chezmoi rerun when upstream publishes a new version.
3. Install with `bun install -g "${pkg}@latest"`; do not add npm/npx fallback installs for managed global CLIs.
4. If a CLI command name differs from package name, update consumers to call the Bun-global binary from `~/.bun/bin`/PATH.
5. Use `run_once_` only for one-time cleanup/migration, e.g. removing legacy npm globals.

## Dotfiles & Chezmoi

**Multi-OS support** via `.chezmoi.toml.tmpl` data variables:

| Variable | Detection |
|----------|-----------|
| `isMacOS` | `chezmoi.os == "darwin"` |
| `isBluefin` | `/etc/os-release` contains `VARIANT_ID="bluefin"` |
| `isBazzite` | `/etc/os-release` contains `VARIANT_ID="bazzite"` |
| `remote` | SSH_CONNECTION, CODESPACES, or container detected |
| `hasFingerprintReader` | `lsusb` contains a libfprint-supported sensor ID (e.g. Synaptics `06cb:00f9` on ThinkPad P14s Gen 5) |

**Auto-commit**: On local machines (`not .remote`), chezmoi auto-commits and auto-pushes changes.

**Key patterns**:
- `dot_` prefix → dotfiles (`dot_bashrc` → `~/.bashrc`)
- `.tmpl` suffix → chezmoi template (rendered per-machine)
- `private_` prefix → file mode 0600
- `executable_` prefix → file mode 0755
- `.chezmoiexternals/` → downloads (mise binary, fonts) on first apply

## Pi Agent Configuration

Agent config in `dot_pi/agent/` deploys to `~/.pi/agent/` via chezmoi.

**Subagents** (11 agents with trait composition, mixed current models; see `dot_pi/agent/agents/README.md`):
- `scout` — Fast codebase recon
- `eagle-scout` — Deep research with progress tracking
- `planner` — Implementation planning (high thinking)
- `engineer` — General implementation
- `lead-engineer` — Complex architecture-sensitive implementation
- `researcher` — Web research synthesis
- `code-reviewer` / `reviewer` — Code review and design alignment
- `project-manager` — Linear PM specialist
- `context-builder` — Context + meta-prompt generation

**Extensions**: minion-subagents (trait composition + chains), auth-sync (OAuth token sync), context-window, ref-docs, custom tools (pm-tool, docsfetch, fabric, webfetch)

**Skills**: prompting, advanced-context-engineering, agent-design, chain-design, skill-design, agents-md, excalidraw-diagram, linear-templates, pi-customization

## Context Engineering

- **Trait composition**: Base agent + 1-3 traits creates a dynamic specialist without a new agent file. Traits in `dot_pi/agent/traits.yaml` cover expertise, personality, and approach.
- **Presets**: Named trait+agent combos — `security-auditor`, `careful-implementer`, `deep-researcher`, `quick-scout`, `senior-implementer`. Use ad-hoc traits when the task is unique.
- **Subagent delegation**: Each subagent runs in isolated context window. Delegate exploration/review/planning/PM/broad file inspection to keep main session lean (target 40-60% utilization). Returns compressed findings (<1KB for scouts).
- **Progressive disclosure**: Skills load on-demand. Only descriptions are always in context.
