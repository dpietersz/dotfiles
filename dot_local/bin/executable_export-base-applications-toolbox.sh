#!/bin/bash
# Export all applications from base-applications-toolbox to the host
# This script can be run manually to export/re-export applications

set -e

echo "📤 Exporting applications from base-applications-toolbox to host..."
echo ""

# Check if container exists
if ! distrobox list | grep -q "base-applications-toolbox"; then
    echo "❌ base-applications-toolbox container not found"
    echo "   Create it first with: distrobox assemble create"
    exit 1
fi

# List of applications to export
# Note: App names verified with: find /usr/share/applications -name "*.desktop"
APPS=(
    "beekeeper-studio"
    "StorageExplorer"
    "teams-for-linux"
    "zen"
    "legcord"
    "com.obsproject.Studio"
    "bruno"
    "polypane"
    "anytype"
    "vivaldi-snapshot"
    "cursor"
    "zed"
    "obsidian"
    "emacs"
)

# Export each application
EXPORTED=0
FAILED=0

for app in "${APPS[@]}"; do
    echo "📤 Exporting $app..."
    if distrobox enter base-applications-toolbox -- bash -c "distrobox-export --app $app" 2>/dev/null; then
        echo "   ✅ $app exported successfully"
        ((EXPORTED++))
    else
        echo "   ⚠️  $app not found or already exported"
        ((FAILED++))
    fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Export complete!"
echo "   Exported: $EXPORTED applications"
echo "   Skipped: $FAILED applications"
echo ""
echo "💡 Exported applications are now available in your application menu!"
echo ""
echo "To unexport an application, run:"
echo "   distrobox enter base-applications-toolbox"
echo "   distrobox-export --app <app-name> --delete"

