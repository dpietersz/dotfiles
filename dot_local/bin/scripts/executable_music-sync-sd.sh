#!/bin/bash
# music-sync-sd.sh — sync the Hiby R1 microSD music card, then safely eject it.
#
# The card lives in the Hiby R1 for listening. Pop it into this laptop's card
# reader when you want to update it, then run this (niri: Mod+Y). It mounts the
# card, syncs the Syncthing "music" folder from sync-vm, waits until it's fully
# in sync, then unmounts it so it's SAFE to pull back into the Hiby — the whole
# point being that exFAT corrupts if you yank it mid-write.
#
# Between runs the Syncthing folder stays PAUSED, so Syncthing never errors about
# a missing card. This script resumes it, syncs, and re-pauses.
#
# Card is identified by its exFAT UUID (stable, survives relabels). Deployed by
# chezmoi; keep the values below in sync with the Syncthing folder config.
set -uo pipefail

CARD_UUID="6EDD-F264"          # exFAT volume serial of the Hiby music card
FOLDER_ID="music"              # Syncthing folder id
SUBDIR="Music"                 # sync target is <mountpoint>/Music
API="http://127.0.0.1:8384"
DEVLINK="/dev/disk/by-uuid/${CARD_UUID}"

c_blue=$'\033[1;34m'; c_grn=$'\033[1;32m'; c_red=$'\033[1;31m'; c_yel=$'\033[1;33m'; c_rst=$'\033[0m'
note() { printf '%s▶%s %s\n' "$c_blue" "$c_rst" "$*"; }
ok()   { printf '%s✓%s %s\n' "$c_grn" "$c_rst" "$*"; }
warn() { printf '%s!%s %s\n' "$c_yel" "$c_rst" "$*"; }
die()  { printf '%s✗%s %s\n' "$c_red" "$c_rst" "$*" >&2; notify "Music sync failed" "$*"; hold; exit 1; }
notify() { command -v notify-send >/dev/null 2>&1 && notify-send -a "Music Sync" "$1" "${2:-}" || true; }
hold() { printf '\n%sPress Enter to close…%s' "$c_blue" "$c_rst"; read -r _ || true; }

# Syncthing API key
CFG="$HOME/.local/state/syncthing/config.xml"
[ -f "$CFG" ] || CFG="$HOME/.config/syncthing/config.xml"
K=$(grep -oP '(?<=<apikey>)[^<]+' "$CFG" 2>/dev/null) || true
[ -n "$K" ] || die "Can't read Syncthing API key from $CFG"
api()  { curl -sf -H "X-API-Key: $K" "$API$1"; }
apip() { curl -sf -X "$1" -H "X-API-Key: $K" -H 'Content-Type: application/json' ${3:+-d "$3"} "$API$2"; }

# 1. card present?
note "Looking for the music card (UUID ${CARD_UUID})…"
[ -e "$DEVLINK" ] || die "Card not found. Insert the Hiby microSD via the reader and retry."
DEV=$(readlink -f "$DEVLINK")

# 2. mount (idempotent)
MP=$(findmnt -no TARGET "$DEV" 2>/dev/null || true)
if [ -z "$MP" ]; then
  out=$(udisksctl mount -b "$DEV" 2>&1) || die "Mount failed: $out"
  MP=$(printf '%s' "$out" | sed -n 's/^Mounted .* at \(.*\)$/\1/p' | sed 's/\.$//')
fi
[ -n "$MP" ] && [ -d "$MP" ] || die "Could not determine mountpoint."
TARGET="$MP/$SUBDIR"
[ -d "$TARGET/.stfolder" ] || warn "No .stfolder in $TARGET — first-time sync will create it."
ok "Card mounted at $MP"

# 3. resume the folder + rescan
note "Resuming + scanning the music folder…"
apip PATCH "/rest/config/folders/$FOLDER_ID" '{"paused":false}' >/dev/null || die "Couldn't resume folder (is it configured?)"
api "/rest/db/scan?folder=$FOLDER_ID" >/dev/null 2>&1 || true

# 4. wait until fully in sync (idle + nothing needed). Stall guard: if no
#    progress for STALL_LIMIT seconds we bail WITHOUT unmounting — never eject
#    mid-transfer; the card stays mounted so a retry resumes cleanly.
note "Syncing — do NOT remove the card…"
STALL_LIMIT=300
last=""; last_need=""; stall=0
while true; do
  s=$(api "/rest/db/status?folder=$FOLDER_ID") || { sleep 3; continue; }
  state=$(printf '%s' "$s" | jq -r '.state')
  needb=$(printf '%s' "$s" | jq -r '.needBytes')
  needf=$(printf '%s' "$s" | jq -r '.needFiles')
  lb=$(printf '%s' "$s" | jq -r '.localBytes'); gb=$(printf '%s' "$s" | jq -r '.globalBytes')
  pct=$(awk -v l="$lb" -v g="$gb" 'BEGIN{printf "%.1f", (g>0? l*100/g : 100)}')
  line="  ${state} — ${pct}% local, need ${needf} files ($(awk -v b="$needb" 'BEGIN{printf "%.0f", b/1e6}') MB)"
  [ "$line" != "$last" ] && { printf '%s\n' "$line"; last="$line"; }
  if [ "$state" = "idle" ] && [ "$needb" = "0" ]; then break; fi
  if [ "$state" = "error" ]; then die "Syncthing folder is in error state — open the GUI to inspect."; fi
  # stall detection: needBytes not shrinking and not idle
  if [ "$needb" = "$last_need" ] && [ "$state" != "syncing" ]; then
    stall=$((stall + 3))
  else
    stall=0; last_need="$needb"
  fi
  if [ "$stall" -ge "$STALL_LIMIT" ]; then
    warn "No progress for ${STALL_LIMIT}s (sync-vm offline? nothing to pull?). Leaving the card MOUNTED."
    warn "Card is at $TARGET — check the Syncthing GUI ($API), or just retry (Mod+Y) when sync-vm is reachable."
    notify "Music sync stalled" "Card left mounted — check Syncthing / retry."
    hold; exit 1
  fi
  sleep 3
done
newcount=$(find "$TARGET" -name '*.flac' 2>/dev/null | wc -l)
ok "In sync — ${newcount} tracks on the card."

# 5. pause the folder (so Syncthing won't error once the card is gone)
apip PATCH "/rest/config/folders/$FOLDER_ID" '{"paused":true}' >/dev/null || warn "Couldn't re-pause the folder."

# 6. flush + safe unmount
note "Flushing + unmounting…"
sync
if udisksctl unmount -b "$DEV" >/dev/null 2>&1; then
  ok "Card unmounted — SAFE TO REMOVE. Pop it back in the Hiby."
  notify "Music sync complete" "${newcount} tracks — safe to remove the card."
else
  warn "Unmount was refused (something's still using the card). Close file managers and try 'udisksctl unmount -b $DEV'."
  notify "Music synced, but unmount refused" "Eject manually before removing."
fi
hold
