#!/bin/bash

set -euo pipefail

# Install superfile
bash -c "$(curl -sLo- https://superfile.dev/install.sh)"

# Install mcp-hub to persistent user directory (works on Bluefin/atomic systems)
# - Uses ~/.local/share/npm instead of /usr/local (which is immutable on Bluefin)
# - ~/.local/share/npm/bin is already in PATH (configured in dot_config/shell/10-path.sh.tmpl)
# - --no-save prevents creating package.json/package-lock.json
echo "[mcp-hub] Installing to ~/.local/share/npm..."
npm install --prefix "$HOME/.local/share/npm" --no-save mcp-hub@latest

# Verify installation
if [[ -f "$HOME/.local/share/npm/bin/mcp-hub" ]]; then
  echo "[mcp-hub] ✓ Installation successful: $HOME/.local/share/npm/bin/mcp-hub"
else
  echo "[mcp-hub] ✗ Installation failed: binary not found at $HOME/.local/share/npm/bin/mcp-hub"
  exit 1
fi
