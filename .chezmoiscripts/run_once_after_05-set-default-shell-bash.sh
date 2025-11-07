#!/bin/bash
{{- if .remote }}
# Skip on remote environments
exit 0
{{- end }}

set -euo pipefail

# Set bash as default shell

# Check if bash is installed
if ! command -v bash >/dev/null 2>&1; then
  echo "Error: bash is not installed"
  exit 1
fi

# Get the path to bash
BASH_PATH=$(which bash)

{{- if .isMacOS }}
# macOS: Use chsh to change default shell
CURRENT_SHELL=$(dscl . -read ~/ UserShell | awk '{print $2}')
if [ "$CURRENT_SHELL" = "$BASH_PATH" ]; then
  echo "bash is already the default shell"
  exit 0
fi

echo "Setting bash as default shell..."
chsh -s "$BASH_PATH"

echo "✓ bash set as default shell"
echo "⚠️  You need to log out and log back in for the change to take effect"

{{- else }}
# Linux: Use usermod and getent

# Check if bash is already in /etc/shells
if ! grep -q "^${BASH_PATH}$" /etc/shells 2>/dev/null; then
  echo "Adding bash to /etc/shells..."
  echo "$BASH_PATH" | sudo tee -a /etc/shells >/dev/null
fi

# Check if bash is already the default shell
CURRENT_SHELL=$(getent passwd "$USER" | cut -d: -f7)
if [ "$CURRENT_SHELL" = "$BASH_PATH" ]; then
  echo "bash is already the default shell"
  exit 0
fi

# Set bash as default shell
echo "Setting bash as default shell..."
sudo usermod -s "$BASH_PATH" "$USER"

echo "✓ bash set as default shell"
echo "⚠️  You need to log out and log back in for the change to take effect"

{{- end }}
