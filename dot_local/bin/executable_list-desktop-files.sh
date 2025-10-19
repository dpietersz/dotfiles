#!/usr/bin/env bash
#
# List all desktop files and their app names for distrobox-export
#

set -euo pipefail

echo "🔍 Scanning for desktop files..."
echo ""

# Find all .desktop files in standard locations
desktop_files=$(find /usr/share/applications /usr/local/share/applications -name "*.desktop" 2>/dev/null | sort)

if [ -z "$desktop_files" ]; then
    echo "❌ No desktop files found!"
    exit 1
fi

echo "📋 Desktop files found:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
printf "%-40s | %s\n" "APP NAME (for --app)" "DISPLAY NAME"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

while IFS= read -r desktop_file; do
    # Get the app name (filename without .desktop extension)
    app_name=$(basename "$desktop_file" .desktop)
    
    # Get the display name from the desktop file
    display_name=$(grep -m 1 "^Name=" "$desktop_file" 2>/dev/null | cut -d'=' -f2- || echo "N/A")
    
    printf "%-40s | %s\n" "$app_name" "$display_name"
done <<< "$desktop_files"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💡 Usage: distrobox-export --app <APP NAME>"
echo "   Example: distrobox-export --app $app_name"
echo ""

