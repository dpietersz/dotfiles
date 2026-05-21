#!/bin/bash

set -euo pipefail

cat <<'EOF'
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Bootstrapping dotfiles via chezmoi.

On Bluefin / rpm-ostree: pass is installed via rpm-ostree
which requires a reboot. Expect this flow on a fresh machine:

  1. ./setup.sh           → installs pass, then says "reboot"
  2. systemctl reboot
  3. chezmoi apply        → decrypts keys, clones password-store,
                            renders templates with secrets, finishes.

If a previous run was interrupted and re-running does nothing,
reset chezmoi's run-once state and try again:

  chezmoi state delete-bucket --bucket=scriptState
  chezmoi apply -v
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EOF

# If pass is already set up on this machine, surface the GitHub token to
# chezmoi scripts so mise / gh / curl avoid anonymous GitHub rate limits.
# Harmless no-op on first bootstrap (pass not yet installed).
if command -v pass >/dev/null && pass show Sites/github.com/pat/host-machine >/dev/null 2>&1; then
  GITHUB_TOKEN="$(pass show Sites/github.com/pat/host-machine)"
  export GITHUB_TOKEN
  export GH_TOKEN="$GITHUB_TOKEN"
  export MISE_GITHUB_TOKEN="$GITHUB_TOKEN"
fi

if command -v chezmoi >/dev/null; then
  chezmoi init --apply --source "$PWD"
  exit 0
fi

if command -v mise >/dev/null; then
  mise exec chezmoi -- chezmoi init --apply --source "$PWD"
  exit 0
fi

sh -c "$(curl -fsLS get.chezmoi.io)" -- init --apply --source "$PWD"
