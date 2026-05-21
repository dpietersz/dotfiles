#!/bin/bash
# init_hooks script: runs INSIDE the data-toolbox container after creation.

set -e

echo "=== Exporting GUI apps from data-toolbox ==="

APPS=(
  beekeeper-studio
  bruno
)

for app in "${APPS[@]}"; do
  echo "Exporting $app..."
  distrobox-export --app "$app" 2>/dev/null || echo "Warning: $app not exportable (not installed?)"
done

echo "=== data-toolbox export complete ==="
