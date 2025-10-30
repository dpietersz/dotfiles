#!/bin/bash

set -euo pipefail

# Install superfile
bash -c "$(curl -sLo- https://superfile.dev/install.sh)"

# Install mcp-hub to persistent user directory (works on Bluefin/atomic systems)
# - Uses ~/.local/share/npm instead of /usr/local (which is immutable on Bluefin)
# - ~/.local/share/npm/bin is in PATH (configured in dot_config/shell/10-path.sh.tmpl)
echo "[mcp-hub] Installing to ~/.local/share/npm..."
npm install --prefix "$HOME/.local/share/npm" --no-save mcp-hub@latest

# Create symlink from bin to node_modules/.bin for PATH compatibility
NPM_BIN_DIR="$HOME/.local/share/npm/bin"
NPM_NODE_MODULES_BIN="$HOME/.local/share/npm/node_modules/.bin"

if [[ -d "$NPM_NODE_MODULES_BIN" ]]; then
  mkdir -p "$NPM_BIN_DIR"
  ln -sf "$NPM_NODE_MODULES_BIN" "$NPM_BIN_DIR" 2>/dev/null || true
  echo "[mcp-hub] ✓ Installation successful: $NPM_BIN_DIR/mcp-hub"
else
  echo "[mcp-hub] ✗ Installation failed: node_modules/.bin not found"
  exit 1
fi
