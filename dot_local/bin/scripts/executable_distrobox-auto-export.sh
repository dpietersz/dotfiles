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
  patch_host_desktop_env "$app"
}

# BRIDGE: remove once ghcr.io/dpietersz/udx-toolbox bakes the same env vars
# into each in-container /usr/share/applications/<app>.desktop at image build
# time (boxkit task already handed off). Until that image rolls out, this
# host-side patcher keeps Storage Explorer + other distrobox Electron apps
# able to reach the host's gnome-keyring. Grep for "BRIDGE:" to find me.
#
# distrobox-export drops the exported .desktop file in
# $HOME/.local/share/applications/${CONTAINER}-${app}.desktop. Electron-family
# GUI apps (Storage Explorer, Vibe Typer, etc.) inside a distrobox with
# init=true talk to the *container's* dbus-broker on /run/user/$UID/bus, not
# the host's — so they can't reach the host's gnome-keyring-daemon and refuse
# to start with "name is not activatable" / "no password manager service".
# The host's bus is bind-mounted inside the container at
# /run/host/run/user/$UID/bus; pointing DBUS_SESSION_BUS_ADDRESS there gives
# every exported GUI app access to the host keyring.
# XDG_CURRENT_DESKTOP=niri:GNOME is the Chromium tag chain that makes
# Electron's KeyStorageLinux pick gnome-libsecret instead of falling back to
# the plaintext "basic" backend; harmless on real GNOME (already wins).
patch_host_desktop_env() {
  local app="$1"
  local container="${CONTAINER_ID:-${HOSTNAME:-}}"
  [ -z "$container" ] && return 0
  local host_desktop="$HOME/.local/share/applications/${container}-${app}.desktop"
  [ -f "$host_desktop" ] || return 0

  # Idempotent: only inject if our marker isn't already present.
  if grep -q 'DBUS_SESSION_BUS_ADDRESS=unix:path=/run/host/run/user' "$host_desktop"; then
    return 0
  fi

  # distrobox-export emits one Exec= line of shape:
  #   Exec=/usr/bin/distrobox-enter  -n <name>  --   env <VARS> <cmd> <args>
  # Inject our two env assignments right after the literal "env " token so
  # they apply to the in-container child without breaking any vars the
  # original launcher already sets.
  sed -i -E \
    -e 's|(/usr/bin/distrobox-enter[[:space:]]+-n[[:space:]]+[^[:space:]]+[[:space:]]+--[[:space:]]+)env[[:space:]]+|\1env DBUS_SESSION_BUS_ADDRESS=unix:path=/run/host/run/user/1000/bus XDG_CURRENT_DESKTOP=niri:GNOME |' \
    -e 's|(/usr/bin/distrobox-enter[[:space:]]+-n[[:space:]]+[^[:space:]]+[[:space:]]+--[[:space:]]+)([^e ][^[:space:]]*)|\1env DBUS_SESSION_BUS_ADDRESS=unix:path=/run/host/run/user/1000/bus XDG_CURRENT_DESKTOP=niri:GNOME \2|' \
    "$host_desktop"
  echo "    patched DBUS+XDG env into $host_desktop"
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
