#!/bin/bash
# init_hooks script: runs INSIDE the notetaking-toolbox container after creation.

set -e

echo "=== Exporting GUI apps from notetaking-toolbox ==="

APPS=(
  anytype
  legcord
)

for app in "${APPS[@]}"; do
  echo "Exporting $app..."
  distrobox-export --app "$app" 2>/dev/null || echo "Warning: $app not exportable (not installed?)"
done

echo "=== notetaking-toolbox export complete ==="
