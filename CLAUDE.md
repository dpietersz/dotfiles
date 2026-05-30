<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

`dotfiles` is Dimitri's personal [chezmoi](https://www.chezmoi.io/)-managed source tree. `chezmoi apply` renders templates (`.tmpl`) per-machine using data from `.chezmoi.toml.tmpl` (OS detection, remote flag, hardware probes), drops files into `~`, runs install scripts in `.chezmoiscripts/`, and on local machines auto-commits and auto-pushes. It must work on macOS, Bluefin/Bluefin-DX, Bazzite, generic Fedora, Debian devcontainers, and Codespaces — all from the same source.

It is **the user-scope layer** of a three-repo personal ecosystem. Most "I want X" requests do not belong in this repo. Read the next section before adding anything.

## The three-repo ecosystem (READ THIS FIRST)

This repo is one of three tightly-coupled personal repos. Always think holistically — a change here often implies a change in one of the others, or it implies the change belongs in one of the others instead of here.

```
┌─────────────────────┐     ┌──────────────────────┐     ┌──────────────────────┐
│   bluefin-udx       │     │     dotfiles         │     │      boxkit          │
│ (~/dev/Projects/    │     │   (THIS REPO)        │     │ (~/dev/Projects/     │
│   bluefin-udx)      │     │                      │     │   boxkit)            │
│                     │     │                      │     │                      │
│ Bootc image         │ ──> │ chezmoi user config  │ ──> │ distrobox toolbox    │
│ System packages     │     │ Per-machine layer    │     │ images for GUI apps  │
│ rpm-ostree layer    │     │ mise / brew / pass   │     │ with no Fedora pkg   │
└─────────────────────┘     └──────────────────────┘     └──────────────────────┘
       ▲                              │                              ▲
       │                              │                              │
       │      provides bootstrap      │  chezmoi pulls toolbox       │
       │      (pass, gpg, git, ...)   │  images + exports apps       │
       └──────────────────────────────┴──────────────────────────────┘
                  (toolbox apps appear on host with correct icons)
```

### Division of responsibility

| Layer | Owns | Examples |
|---|---|---|
| **bluefin-udx** | System packages requiring `sudo`/reboot, screen-share/portal/PAM/polkit integration, bootstrap tools that must exist before chezmoi can run | `kitty`, `niri`, `waybar`, `mate-polkit`, `teams-for-linux`, `pass`, `gnupg2`, `age`, `git`, `chromium`, `zen-browser`, `zed`, `beekeeper-studio` |
| **dotfiles (THIS REPO)** | User-scope config (`~/.config/`), `mise`-managed CLI tools, brew packages, secrets via `pass`, per-machine variants via templates, **toolbox creation + app auto-export to host**, OS-conditional install scripts | Neovim, starship, ripgrep, bat, eza, language runtimes, distrobox `.ini` files, niri/waybar config, shell config |
| **boxkit** | GUI apps with no acceptable Fedora source (no maintained COPR/RPM, and Dimitri refuses Flatpak/AppImage as primary delivery). Produces `udx-toolbox` (Arch) and `playwright-toolbox` (Ubuntu). | `ghcr.io/dpietersz/udx-toolbox` (Storage Explorer, Obsidian, Polypane, Bruno, LocalSend, Anytype, Legcord, Ferdium), `ghcr.io/dpietersz/playwright-toolbox` |

**Hard rules** (Dimitri's preferences, baked into the architecture):
- **No Flatpak. No AppImage as primary delivery.** Anything that can't be a Fedora RPM goes into a boxkit toolbox, then gets pulled + auto-exported by this repo.
- **Atomic OS = no `rpm-ostree install` from chezmoi.** If a package needs `sudo`, bake it in `bluefin-udx`. If it can live as `mise`/`brew`/toolbox, it belongs here.
- **One image, two laptops, zero drift.** Per-machine logic belongs in chezmoi templates here (gated on `.isBluefin`, `.hardwareModel`, `.hasFingerprintReader`, `.hasNvidia`), never in `bluefin-udx`.

### The integration handshake (how the three repos cooperate)

1. **bluefin-udx** boots on the host → provides `pass`, `gpg`, `age`, `ssh`, `git`, `jq`, `curl`, `distrobox`, `podman` so chezmoi's first apply works.
2. **chezmoi apply** in this repo runs the numbered scripts in `.chezmoiscripts/`:
   - `run_once_before_08-decrypt-keys` → unlocks GPG/SSH from `.encrypted/`
   - `run_once_before_10-clone-password-store` → clones `pass` store (all secrets live here, never in repo)
   - `run_onchange_after_01-install-packages` → `mise install`
   - `run_onchange_after_01b/c-brew-bundle-*` → brew bundles
   - `run_after_11-create-toolboxes` → reads `dot_config/distrobox/*.ini.tmpl`, uses `skopeo inspect` to detect ghcr digest bumps, recreates stale boxes
3. Each box's `init_hooks` runs `~/.local/bin/scripts/distrobox-auto-export.sh` inside the container → reads `/etc/distrobox-export.list` (defined inside the **boxkit** image) → calls `distrobox-export` for each `.desktop` so apps + icons appear in the host launcher (niri/wofi).
4. Result: an app baked into a **boxkit** toolbox image appears on the host with the correct icon, with zero manual `distrobox-export` calls.

So a request of the form "I want app X" routes as:
- **Needs sudo / reboot / system integration (portal, PAM, polkit)** → `bluefin-udx`, add to `recipes/common.yml`, document in `RECIPE.md`.
- **Fedora RPM exists OR clean brew/mise package** → here, add to brew bundle or `dot_config/mise/config.toml.tmpl`.
- **GUI app with no Fedora RPM (and not Flatpak/AppImage)** → `boxkit` (`udx-toolbox`), then ensure it's in `/etc/distrobox-export.list` there — auto-export wiring here will surface it on the host.

### Cross-repo authoritative docs to consult

- `~/dev/Projects/bluefin-udx/CLAUDE.md` — full bake doctrine, division-of-responsibility table, niri/Electron keyring trap
- `~/dev/Projects/bluefin-udx/RECIPE.md` — package manifest with bake-reason taxonomy
- `~/dev/Projects/bluefin-udx/MAINTENANCE.md` — quarterly review checklist
- `~/dev/Projects/boxkit/QUICK_START.md` — `udx-toolbox` usage, NVIDIA `--nvidia` passthrough, `/etc/distrobox-export.list` contract
- `~/dev/Projects/boxkit/AGENTS.md` — ContainerFile / scripts / packages conventions

## Repository layout

```
.chezmoi.toml.tmpl          # OS/env detection + template data (isMacOS, isBluefin, isBazzite,
                            #   remote, hardwareModel, hasFingerprintReader, hasNvidia)
.chezmoiignore.tmpl         # Per-OS exclusions (Linux configs skipped on macOS, etc.)
.chezmoiexternals/          # External fetches: mise binary, fonts
.chezmoiscripts/            # Ordered install scripts (see "Script ordering" below)
.chezmoiremove              # Files chezmoi must remove on apply
.encrypted/                 # GPG/SSH/age secrets, age-encrypted, decrypted by 08-decrypt-keys
dot_config/
├── shell/                  # Modular shell config (00-env → 50-fabric, numeric load order)
├── mise/config.toml.tmpl   # All CLI tool versions
├── distrobox/*.ini.tmpl    # Toolbox definitions — consumed by run_after_11-create-toolboxes
├── nvim/                   # Neovim (LazyVim)
├── ghostty/, kitty/        # Terminals
├── niri/, waybar/          # Wayland WM stack (Linux only)
├── noctalia/config.toml.tmpl  # Status bar; idle/lock disabled on machines using hyprlock
└── opencode/, gemini/, codex/, augment/, pi/  # AI agent configs
dot_local/bin/scripts/      # Host-side helper scripts including distrobox-auto-export.sh
dot_pi/agent/               # Pi coding agent config (subagents, traits, skills)
private_dot_gnupg/, private_dot_ssh/   # Mode-0600 private dirs
.opencode/, .gemini/, .claude/, .augment/, .ai/   # AI agent configs (repo-scope and templated)
docs/                       # Diátaxis docs
setup.sh                    # Bootstrap: installs chezmoi + applies
```

## Script ordering (.chezmoiscripts/)

Chezmoi runs scripts in lexical order grouped by phase. Numeric prefixes are load order, NOT file count. When adding a script, fit it into the existing sequence.

- **`run_once_before_*`** — bootstrap (homebrew, kitty, tmux, niri, nushell, **pass**, gpg-pinentry, **decrypt-keys**, ssh-agent, **clone-password-store**). These must finish before `dot_config/shell/00-env.sh.tmpl` can load secrets from `pass`.
- **`run_once_after_*`** — one-shot installs/enables (espanso, tpm, default-shell, cli-tools, android-sdk, syncthing-service, firewall, **fingerprint-pam**, **hyprlock-stack**, fabric).
- **`run_onchange_after_*`** — re-runs when content hash changes (`mise install`, brew bundles, llm, pi-extension-deps, espanso-service, nushell-starship, pai-pulse-service).
- **`run_after_*`** — runs every apply (toolbox creation, tailscale, syncthing config, vibe-typer, minion-daemon). `run_after_11-create-toolboxes` runs every apply on purpose because remote `ghcr.io` digest bumps are invisible to chezmoi's content-hash gating; the `skopeo inspect` check is ~1s per box.

## Build/test commands

```bash
./setup.sh                 # Bootstrap a new machine end-to-end
chezmoi diff               # Preview what apply would change — ALWAYS run this first
chezmoi apply              # Apply (auto-commits + auto-pushes on local machines)
chezmoi data               # Dump template variables (debugging template gates)
chezmoi edit-config        # Edit .chezmoi.toml at the rendered location
chezmoi cd                 # cd into the source dir
chezmoi execute-template < path/to/file.tmpl   # Render a single template
```

There are **no unit tests**. Validation is `chezmoi diff` + applying on a real machine. The CI surface is the `.devcontainer/` Debian container — it proves the repo still applies cleanly in a minimal Linux env.

## Template gates (most-used)

```gotmpl
{{ if .isMacOS }}...{{ end }}
{{ if .isBluefin }}...{{ end }}
{{ if .isBazzite }}...{{ end }}
{{ if not .remote }}...{{ end }}              # Skip on SSH/Codespaces/devcontainer
{{ if .hasFingerprintReader }}...{{ end }}    # ThinkPad P14s Gen 5 etc.
{{ if .hasNvidia }}true{{ else }}false{{ end }}  # Used in distrobox .ini for --nvidia passthrough
```

Detection lives in `.chezmoi.toml.tmpl`. `hasFingerprintReader` does an `lsusb` probe for libfprint-supported sensor IDs; `hasNvidia` does an `lspci` probe.

## When making changes

1. **Adding a CLI tool** → `dot_config/mise/config.toml.tmpl` (preferred) or a brew bundle file. Never add via `rpm-ostree`. Never add it to `bluefin-udx` unless it needs `sudo` or has to exist before chezmoi runs.
   - **npm-published CLIs** (no brew/mise option, e.g. `@getpaseo/cli`, `@augmentcode/auggie`, `mcp-hub`) → append the package name to the `PKGS` array in `.chezmoiscripts/run_onchange_after_13-install-npm-globals.sh.tmpl`. **Always use `bun install -g`, never `npm install --prefix`.** Bun globals land in `~/.bun/bin/` (already on PATH via `dot_config/shell/10-path.sh.tmpl:21`); the `npm --prefix` pattern produces a broken bin symlink (`bin/.bin` nested under PATH'd `bin/`) and gets stomped when bun later writes to the same `node_modules`. Do not create a new per-package installer script — the existing one is the single point of entry.
2. **Adding a GUI app**:
   - Has a Fedora RPM + needs PAM/portal/polkit integration → it belongs in `bluefin-udx/recipes/common.yml`. Stop and go there.
   - Has a Fedora RPM and is integration-clean → brew or `mise`, here.
   - No Fedora RPM and Dimitri won't accept Flatpak/AppImage → it belongs in `boxkit` (`ContainerFiles/udx-toolbox`). After adding it there, make sure its `.desktop` is in the boxkit `/etc/distrobox-export.list`. Auto-export here will pick it up on the next apply.
3. **Adding a per-machine variant** → use a template gate, never branch by hostname.
4. **Adding a secret** → store in `pass`, source it in `dot_config/shell/00-env.sh.tmpl` behind an interactive-shell guard. Never commit.
5. **Adding an encrypted file** → put under `.encrypted/`, decrypted by `run_once_before_08-decrypt-keys`. Never commit unencrypted secrets.
6. **Adding a toolbox** → add an `.ini.tmpl` in `dot_config/distrobox/`, ensure the image exists in `boxkit`, optionally add to `SKIP_INIS` in `run_after_11-create-toolboxes` if a different script owns its lifecycle (Playwright is the existing example).
7. **Anything system-scope** (PAM, polkit, portal, kernel module, `/etc/`, anything needing `sudo`) → not here. Push to `bluefin-udx/files/system/` or `recipes/common.yml`.

## Two non-obvious traps (don't break these)

- **Fingerprint + hyprlock pairing** (Linux laptops with `hasFingerprintReader`): `run_once_after_10-enable-fingerprint-pam` layers `fprintd`/`fprintd-pam` and runs `authselect with-fingerprint`. `run_once_after_11-install-hyprlock-stack` then installs `hyprlock` + `swayidle` because noctalia v5's built-in lockscreen is password-only under Wayland's session-lock protocol and can't share the fingerprint sensor with fprintd. On these machines the locker is `hyprlock`, idle is owned by `swayidle` via `dot_local/bin/scripts/niri-idle-daemon.sh`, and noctalia's own idle behaviors are disabled in `dot_config/noctalia/config.toml.tmpl`. The lock keybind `Ctrl+Alt+L` in niri swaps to `hyprlock`. The three pieces are a matched set — if you remove one, remove all three.
- **LocalSend lives inside `data-toolbox`, not on the host.** `run_onchange_after_17-configure-localsend` deep-merges managed `flutter.ls_*` keys into the host-side `shared_preferences.json`; `run_once_after_09-configure-firewall-localsend` opens port 53317 on the host firewall. Don't move the binary; the config and firewall hole live here, the binary lives in the boxkit image.

## Conventions

- **Shell scripts**: `#!/bin/bash` + `set -euo pipefail`, `command -v` for capability checks, 2-space indent. Skip cleanly on `.remote` and on non-applicable OSes (return 0, don't error).
- **Chezmoi naming**: `dot_` (→ `.`), `executable_` (mode 0755), `private_` (mode 0600), `.tmpl` (template).
- **Shell config layout**: Numeric prefixes in `dot_config/shell/` control load order (`00-env`, `10-path`, `20-tools`, `30-functions`, `40-aliases`, `50-fabric`). Add files at the right tier — don't reorder existing ones.
- **Lua (Neovim)**: 2 spaces, 120 width (see `dot_config/nvim/stylua.toml`).
- **Commits**: Conventional (`type(scope): description`). Auto-committed on local machines, so write the message in the diff stage.
- **Generated noise**: List in `.chezmoiignore` (lazy-lock.json, node_modules, .venv).
