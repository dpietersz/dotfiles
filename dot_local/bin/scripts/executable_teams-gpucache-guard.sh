#!/bin/bash
# teams-gpucache-guard — wipe teams-for-linux's Electron GPU/shader caches when
# the booted OS image changes, so a stale shader cache can't break video render.
#
# THE BUG (upstream, not ours):
#   teams-for-linux is Electron. Electron caches compiled GPU shaders under
#   ~/.config/teams-for-linux/{GPUCache,DawnGraphiteCache,DawnWebGPUCache}. After
#   the GPU stack updates (NVIDIA driver / Mesa bump), those cached shaders no
#   longer match the new driver and the renderer paints BLANK — incoming meeting
#   video never shows. Audio is unaffected (no GPU), so the call actually
#   connects and Teams throws its generic "couldn't connect / clear cache &
#   restart" overlay even though you ARE in the meeting. Clearing the cache forces
#   a rebuild and fixes it. Electron declined to auto-fix this
#   (electron/electron#40366); upstream's standing remedy is "delete GPUCache".
#
# WHY KEY ON THE IMAGE VERSION:
#   On this atomic, auto-updating image every GPU/driver bump arrives bundled in a
#   new image version (/etc/os-release IMAGE_VERSION), applied on the reboot that
#   follows a nightly update — exactly when the user hits the broken video. Keying
#   the wipe on IMAGE_VERSION catches NVIDIA, Mesa and Electron bumps in one shot,
#   works identically on both laptops (NVIDIA P14s + Intel T580), needs no sudo,
#   and pulls in no dependency beyond /etc/os-release. Wiping is cheap: Teams just
#   recompiles its shader cache on next launch (a one-time first-frame cost).
#
# Runs as a oneshot user service Before=graphical-session.target (see
# dot_config/systemd/user/teams-gpucache-guard.service), so it fires once per
# login before niri brings Teams up. Sibling-in-spirit to refresh-fontconfig-
# cache.service (stale font cache after image update) and the Helium-Widevine
# sync (binary-in-image, state-in-~/.config).
set -euo pipefail

CONFIG_DIR="${XDG_CONFIG_HOME:-$HOME/.config}/teams-for-linux"
STATE_DIR="${XDG_STATE_HOME:-$HOME/.local/state}/teams-gpucache-guard"
STAMP_FILE="$STATE_DIR/booted-image-version"

# Nothing installed yet → nothing to guard.
[ -d "$CONFIG_DIR" ] || { echo "[teams-gpucache-guard] no $CONFIG_DIR, skipping"; exit 0; }

# Current booted image version. Fall back to the ostree manifest digest if the
# key is ever absent, so the guard still has a stable signal to compare.
CURRENT=""
if [ -r /etc/os-release ]; then
    CURRENT="$(. /etc/os-release 2>/dev/null; echo "${IMAGE_VERSION:-${OSTREE_VERSION:-}}")"
fi
[ -n "$CURRENT" ] || CURRENT="$(cat /run/ostree-booted 2>/dev/null || echo unknown)"

PREVIOUS=""
[ -f "$STAMP_FILE" ] && PREVIOUS="$(cat "$STAMP_FILE" 2>/dev/null || true)"

mkdir -p "$STATE_DIR"

if [ "$CURRENT" = "$PREVIOUS" ]; then
    echo "[teams-gpucache-guard] image unchanged ($CURRENT), GPU cache left intact"
    exit 0
fi

# Image changed (or first run). Don't yank the cache out from under a running
# Teams — this normally runs pre-session so Teams isn't up, but a chezmoi-apply
# invocation could race it. If it's running, just re-stamp and let the next login
# do the wipe.
# Match the actual binary path (…/teams-for-linux/teams-for-linux[.real]), not a
# loose "/teams-for-linux" substring that would also hit shells or this script.
if pgrep -f 'teams-for-linux/teams-for-linux(\.real)?' >/dev/null 2>&1; then
    echo "[teams-gpucache-guard] teams-for-linux is running; deferring wipe to next login"
    echo "$CURRENT" > "$STAMP_FILE"
    exit 0
fi

# Wipe the top-level Electron GPU/shader caches plus any per-partition GPUCache.
wiped=0
for dir in "$CONFIG_DIR/GPUCache" "$CONFIG_DIR/DawnGraphiteCache" "$CONFIG_DIR/DawnWebGPUCache"; do
    if [ -d "$dir" ]; then rm -rf "$dir" && wiped=$((wiped + 1)); fi
done
if [ -d "$CONFIG_DIR/Partitions" ]; then
    while IFS= read -r -d '' pgc; do
        rm -rf "$pgc" && wiped=$((wiped + 1))
    done < <(find "$CONFIG_DIR/Partitions" -maxdepth 2 -type d -name GPUCache -print0 2>/dev/null)
fi

echo "$CURRENT" > "$STAMP_FILE"
echo "[teams-gpucache-guard] image $PREVIOUS -> $CURRENT; cleared $wiped GPU cache dir(s)"
