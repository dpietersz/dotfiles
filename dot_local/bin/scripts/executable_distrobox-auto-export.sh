#!/bin/bash
# Generic distrobox init_hooks: export GUI apps from the container to the host.
#
# Source of truth (in priority order):
#   1) /etc/distrobox-export.list  — declared by boxkit at build time.
#   2) Auto-discover /usr/share/applications/*.desktop, filtering NoDisplay=true.
#
# Runs inside the container. Symbol that lands on the host as
# "<box-name>-<app>.desktop" once distrobox-export succeeds.

set -e

echo "=== distrobox auto-export ==="

export_app() {
  local app="$1"
  echo "  exporting: $app"
  distrobox-export --app "$app" 2>/dev/null || echo "  WARN: $app not exportable"
}

if [ -f /etc/distrobox-export.list ]; then
  echo "Using /etc/distrobox-export.list (boxkit declaration)"
  while IFS= read -r app || [ -n "$app" ]; do
    case "$app" in
      ""|\#*) continue ;;
    esac
    export_app "$app"
  done < /etc/distrobox-export.list
else
  echo "No /etc/distrobox-export.list — falling back to auto-discovery"
  shopt -s nullglob
  for desktop in /usr/share/applications/*.desktop; do
    grep -qE '^NoDisplay=true' "$desktop" && continue
    grep -qE '^Type=Application' "$desktop" || continue
    app="$(basename "$desktop" .desktop)"
    export_app "$app"
  done
fi

echo "=== distrobox auto-export done ==="
