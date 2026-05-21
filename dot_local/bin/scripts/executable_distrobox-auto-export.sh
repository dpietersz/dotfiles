#!/bin/bash
# Generic distrobox init_hooks: export GUI apps from the container to the host
# AND copy their icons into the host's user icon theme so the host launcher
# shows proper icons instead of a generic fallback.
#
# Source of truth: /etc/distrobox-export.list (declared by boxkit at build time).
# Auto-discovery is intentionally NOT used as a fallback because the base toolbox
# images ship many .desktop entries for system utilities (avahi, qv4l2, electron,
# bssh/bvnc, ...) that we don't want on the host. If a toolbox lacks a list, the
# fix is to add one in boxkit, not to widen this script.
#
# Runs inside the container. $HOME is mounted from the host by distrobox, so
# anything we write under $HOME/.local/share/... lands on the host filesystem.

set -e

echo "=== distrobox auto-export ==="

if [ ! -f /etc/distrobox-export.list ]; then
  echo "WARN: /etc/distrobox-export.list not found in this image."
  echo "      Declare exports in boxkit (see scripts/browser-toolbox.sh for the"
  echo "      pattern) and rebuild. Skipping export for this run."
  exit 0
fi

HOST_ICON_BASE="$HOME/.local/share/icons/hicolor"
mkdir -p "$HOST_ICON_BASE"

# Copy every icon file the app references (Icon= key in its .desktop) from the
# container's hicolor theme + /usr/share/pixmaps into the host's user icon dir.
# `cp -n` preserves any user-customized icon that already exists on host.
copy_app_icons() {
  local desktop_file="$1"
  local icon_name copied=0
  [ -f "$desktop_file" ] || return 0

  icon_name=$(grep -m1 '^Icon=' "$desktop_file" | cut -d= -f2- | tr -d '\r')
  [ -z "$icon_name" ] && return 0
  # Absolute path icons resolve through the mounted FS already — nothing to do.
  case "$icon_name" in /*) return 0 ;; esac

  shopt -s nullglob
  local src dest rel size_apps
  for src in /usr/share/icons/hicolor/*/apps/"$icon_name".png \
             /usr/share/icons/hicolor/*/apps/"$icon_name".svg \
             /usr/share/icons/hicolor/*/apps/"$icon_name".xpm \
             /usr/share/icons/hicolor/scalable/apps/"$icon_name".svg; do
    rel="${src#/usr/share/icons/hicolor/}"
    dest="$HOST_ICON_BASE/$rel"
    mkdir -p "$(dirname "$dest")"
    cp -n "$src" "$dest" && copied=$((copied + 1))
  done

  # Legacy /usr/share/pixmaps location — dump into 48x48/apps as a reasonable size.
  for src in /usr/share/pixmaps/"$icon_name".png \
             /usr/share/pixmaps/"$icon_name".svg \
             /usr/share/pixmaps/"$icon_name".xpm; do
    size_apps="$HOST_ICON_BASE/48x48/apps"
    mkdir -p "$size_apps"
    cp -n "$src" "$size_apps/" && copied=$((copied + 1))
  done
  shopt -u nullglob

  if [ "$copied" -gt 0 ]; then
    echo "    copied $copied icon file(s) for Icon=$icon_name"
  else
    echo "    WARN: no icon files found for Icon=$icon_name"
  fi
}

export_app() {
  local app="$1"
  local desktop="/usr/share/applications/${app}.desktop"

  echo "  exporting: $app"
  if ! distrobox-export --app "$app" 2>/dev/null; then
    echo "    WARN: distrobox-export --app $app failed (missing in image?)"
    return 0
  fi

  copy_app_icons "$desktop"
}

while IFS= read -r line || [ -n "$line" ]; do
  line="${line%%#*}"
  app="$(echo "$line" | xargs)"
  [ -z "$app" ] && continue
  export_app "$app"
done < /etc/distrobox-export.list

# Refresh the host's icon cache for hicolor if the tool is available.
# Cache update is a best-effort optimization; missing the binary doesn't break
# icon resolution, GTK/Qt will fall back to a directory scan.
if command -v gtk-update-icon-cache >/dev/null 2>&1; then
  gtk-update-icon-cache -t -q "$HOST_ICON_BASE" 2>/dev/null || true
fi

echo "=== distrobox auto-export done ==="
