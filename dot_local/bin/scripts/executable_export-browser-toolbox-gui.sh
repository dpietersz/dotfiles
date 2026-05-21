#!/bin/bash
# init_hooks script: runs INSIDE the browser-toolbox container after creation.
# Exports GUI apps to the host so they appear in the host application launcher
# as "browser-toolbox-<app>.desktop".

set -e

echo "=== Exporting GUI apps from browser-toolbox ==="

APPS=(
  chromium
  helium
  org.qutebrowser.qutebrowser
  Polypane
  zen
)

for app in "${APPS[@]}"; do
  echo "Exporting $app..."
  distrobox-export --app "$app" 2>/dev/null || echo "Warning: $app not exportable (not installed?)"
done

echo "=== browser-toolbox export complete ==="
