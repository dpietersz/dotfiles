#!/bin/bash
# Polls rpm-ostree for a non-booted deployment (= reboot pending) and fires a
# desktop notification once per unique staged deployment. Dedupe by ostree
# commit checksum stored in $XDG_RUNTIME_DIR so the timer can fire hourly
# without nagging.
set -euo pipefail

command -v rpm-ostree >/dev/null 2>&1 || exit 0
command -v jq >/dev/null 2>&1 || exit 0
command -v notify-send >/dev/null 2>&1 || exit 0

STATE_DIR="${XDG_RUNTIME_DIR:-/run/user/$(id -u)}"
STATE_FILE="$STATE_DIR/notify-pending-reboot.last"

STATUS_JSON="$(rpm-ostree status --json 2>/dev/null || true)"
[ -n "$STATUS_JSON" ] || exit 0

# Catch ANY non-booted deployment at slot 0 (covers both rpm-ostreed-automatic
# staging and manual `rpm-ostree install` layering). Checksum is the dedupe key.
PENDING="$(printf '%s' "$STATUS_JSON" | jq -r '
  if .deployments[0].booted == false
  then (.deployments[0].checksum // "")
  else ""
  end
')"

if [ -z "$PENDING" ]; then
  rm -f "$STATE_FILE"
  exit 0
fi

LAST="$(cat "$STATE_FILE" 2>/dev/null || true)"
[ "$PENDING" = "$LAST" ] && exit 0

VERSION="$(printf '%s' "$STATUS_JSON" | jq -r '.deployments[0].version // "unknown"')"
ORIGIN="$(printf '%s' "$STATUS_JSON" | jq -r '.deployments[0]."container-image-reference" // .deployments[0].origin // "rpm-ostree"')"
SHORT_ORIGIN="${ORIGIN##*/}"

notify-send \
  -u normal \
  -i system-software-update \
  -a "rpm-ostree" \
  "Reboot pending" \
  "${SHORT_ORIGIN} ${VERSION} is staged. Reboot when convenient."

echo "$PENDING" > "$STATE_FILE"
