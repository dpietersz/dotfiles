#!/bin/bash
# Hook script to export GUI applications from daily-driver-arch container to host
# This script is called by distrobox after container initialization

set -e

echo "=== Exporting GUI applications from daily-driver-arch ==="

# List of GUI applications to export
# These are the applications installed in the container
APPS_TO_EXPORT=(
    "obsidian"
    "anytype"
    "polypane"
    "storageexplorer"
    "bruno"
    "cursor"
    "teams"
    "zed"
    "zen-browser"
    "chromium-browser"
    "qutebrowser"
    "beekeeper-studio"
)

# Export each application
for app in "${APPS_TO_EXPORT[@]}"; do
    echo "Exporting $app..."
    distrobox-export --app "$app" 2>/dev/null || echo "Warning: Could not export $app (may not be installed)"
done

echo "=== GUI application export complete ==="
echo "Applications are now available on your host system"

