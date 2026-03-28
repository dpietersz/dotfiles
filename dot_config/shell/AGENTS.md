# Shell Config — Modular shell configuration shared between bash and zsh

## Architecture

Numbered files loaded in order by `~/.bashrc` and `~/.zshrc`. Each file has a single responsibility. Templates (`.tmpl`) render per-OS variants via chezmoi. Secrets loaded from `pass` at interactive shell startup — never committed or exported in non-interactive shells.

## Files (load order)

| File | Purpose |
|------|---------|
| `00-env.sh.tmpl` | Environment variables, XDG dirs, secrets via `pass` (interactive only) |
| `10-path.sh.tmpl` | PATH management (`prepend_path` helper) |
| `20-tools.sh.tmpl` | Tool initialization (mise, zoxide, fzf, starship, direnv) |
| `30-functions.sh` | Shell functions (snake_case naming) |
| `40-aliases.sh` | Aliases: navigation, git, kubectl, editors, ls (eza) |
| `50-fabric.sh` | Fabric AI pattern shortcuts and helper functions |

## Key Patterns

- **Secrets**: `pass show Sites/...` calls in `00-env.sh.tmpl`, guarded by `[[ $- == *i* ]]` (interactive only) and `command -v pass` check
- **OS-conditional**: `{{ if .isMacOS }}` blocks for macOS-specific config (e.g., `BASH_SILENCE_DEPRECATION_WARNING`)
- **Remote detection**: `{{ if not .remote }}` guards secrets from loading in containers/SSH
- **Tool checks**: Always `command -v tool >/dev/null` before aliasing or initializing

## Conventions

- **Naming**: Numbered prefix controls load order. Use `.tmpl` suffix only when templates needed.
- **Functions**: snake_case (see `30-functions.sh`)
- **Aliases**: lowercase, short (see `40-aliases.sh`)
- **New env vars**: Add to `00-env.sh.tmpl`
- **New aliases**: Add to `40-aliases.sh`
- **New tool init**: Add to `20-tools.sh.tmpl`
- **New function**: Add to `30-functions.sh`
