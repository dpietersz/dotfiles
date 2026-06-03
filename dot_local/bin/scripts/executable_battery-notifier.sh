#!/bin/bash
# battery-notifier — escalating-but-funny low-battery notifications.
#
# Polled by battery-notifier.timer every 30s. No-ops if no battery present
# (desktop, remote container) so it's safe to enable image-wide. Notifies
# ONCE per bucket entry: state file at $XDG_RUNTIME_DIR/battery-notifier.bucket
# is wiped on charge, so a discharge → charge → discharge cycle re-fires.
#
# Aggregation: trusts UPower's DisplayDevice for total %, which already does
# the weighted-by-capacity math for dual-battery ThinkPads (T480/T580 etc.
# where BAT0/BAT1 don't discharge in lockstep). Falls back to a per-battery
# weighted average from /sys/class/power_supply if upower CLI is missing.
#
# Catalog: ${XDG_CONFIG_HOME:-$HOME/.config}/battery-notifier/messages.toml
# Sounds: freedesktop stereo theme (ships with Bluefin).

set -euo pipefail

CATALOG="${XDG_CONFIG_HOME:-$HOME/.config}/battery-notifier/messages.toml"
STATE_DIR="${XDG_RUNTIME_DIR:-/tmp}"
STATE_FILE="$STATE_DIR/battery-notifier.bucket"
SOUND_DIR="/usr/share/sounds/freedesktop/stereo"

[[ -r "$CATALOG" ]] || exit 0
command -v notify-send >/dev/null 2>&1 || exit 0

# --test <bucket> — preview a bucket regardless of real battery state.
# Usage: battery-notifier.sh --test panic   # also: chill nudge concern doom
# State file is NOT touched, so production polling is unaffected.
TEST_MODE=0
TEST_BUCKET=""
if [[ "${1:-}" == "--test" ]]; then
  TEST_MODE=1
  TEST_BUCKET="${2:?--test requires bucket name: chill|nudge|concern|panic|doom}"
fi

# ── read battery state ─────────────────────────────────────────────────────

read_upower() {
  # Aggregated across all batteries. Returns "PCT STATE" or empty on failure.
  local out pct state
  out=$(timeout 5 upower -i /org/freedesktop/UPower/devices/DisplayDevice 2>/dev/null) || return 1
  pct=$(awk -F: '/percentage:/ {gsub(/[ %]/,"",$2); print $2; exit}' <<<"$out")
  state=$(awk -F: '/state:/ {gsub(/^ +| +$/,"",$2); print $2; exit}' <<<"$out")
  [[ -n "$pct" && -n "$state" ]] || return 1
  printf '%s %s\n' "$pct" "$state"
}

read_sys() {
  # Weighted-by-energy_full fallback. Picks state="discharging" if ANY
  # battery is discharging (matches UPower semantics on T580-style splits
  # where the idle battery shows "Not charging" / "Unknown").
  local total_now=0 total_full=0 any_discharging=0 b cap full status
  shopt -s nullglob
  for b in /sys/class/power_supply/BAT*; do
    [[ -r "$b/capacity" ]] || continue
    cap=$(<"$b/capacity")
    full=$(cat "$b/energy_full" 2>/dev/null || cat "$b/charge_full" 2>/dev/null || echo 100)
    status=$(<"$b/status")
    total_now=$(( total_now + cap * full ))
    total_full=$(( total_full + 100 * full ))
    [[ "$status" == "Discharging" ]] && any_discharging=1
  done
  shopt -u nullglob
  (( total_full > 0 )) || return 1
  local pct=$(( total_now * 100 / total_full ))
  local state="unknown"
  (( any_discharging )) && state="discharging"
  printf '%s %s\n' "$pct" "$state"
}

if (( TEST_MODE )); then
  case "$TEST_BUCKET" in
    chill)   pct=18 ;;
    nudge)   pct=13 ;;
    concern) pct=8  ;;
    panic)   pct=4  ;;
    doom)    pct=1  ;;
    *) echo "unknown bucket: $TEST_BUCKET" >&2; exit 1 ;;
  esac
  state=discharging
else
  reading=$(read_upower || read_sys || true)
  [[ -n "$reading" ]] || exit 0
  pct="${reading% *}"
  state="${reading#* }"
  state="${state,,}"  # lowercase for compare
fi

if (( ! TEST_MODE )); then
  # Per-BAT floor safety net. On T480-family dual-battery laptops the EC can
  # drive one pack to 0% while the other still has charge, causing a sudden
  # shutdown even though the aggregate % looks healthy. If ANY individual
  # battery is below 5% and discharging, force the effective bucket down so
  # the user hears doom/panic before BAT0 yanks the rug.
  per_bat_floor=100
  shopt -s nullglob
  for b in /sys/class/power_supply/BAT*; do
    [[ -r "$b/capacity" && -r "$b/status" ]] || continue
    bs=$(<"$b/status")
    [[ "$bs" == "Discharging" || "$bs" == "Unknown" ]] || continue
    bc=$(<"$b/capacity")
    (( bc < per_bat_floor )) && per_bat_floor=$bc
  done
  shopt -u nullglob
  (( per_bat_floor < pct )) && pct=$per_bat_floor
fi

# ── bucket logic ───────────────────────────────────────────────────────────

bucket_for() {
  local p=$1
  if   (( p >= 21 )); then echo "none"
  elif (( p >= 16 )); then echo "chill"
  elif (( p >= 11 )); then echo "nudge"
  elif (( p >=  6 )); then echo "concern"
  elif (( p >=  3 )); then echo "panic"
  else                     echo "doom"
  fi
}

severity() {
  case "$1" in chill) echo 0;; nudge) echo 1;; concern) echo 2;; panic) echo 3;; doom) echo 4;; *) echo -1;; esac
}

current=$(bucket_for "$pct")
prev="none"
[[ -r "$STATE_FILE" ]] && prev=$(<"$STATE_FILE")

if (( ! TEST_MODE )); then
  # Charging / full / unknown → reset state, never notify.
  if [[ "$state" != "discharging" ]]; then
    [[ "$prev" != "none" ]] && echo "none" > "$STATE_FILE"
    exit 0
  fi

  # Only notify when severity STRICTLY increases. Same-bucket re-fires are
  # suppressed (no spam every 30s within 20–16%). A jump from chill → panic
  # fires panic. Going back up (e.g. brief charge-then-unplug staying in same
  # bucket) is handled by the charging reset above.
  [[ "$current" == "none" ]] && exit 0
  (( $(severity "$current") <= $(severity "$prev") )) && exit 0
fi

# ── pick message + send ────────────────────────────────────────────────────

# Minimal TOML reader: extracts the `messages = [...]` array under [bucket]
# and `sound = "..."` / `title = "..."` keys. Catalog is flat by design so a
# 30-line awk beats pulling in a TOML dep.
extract_section() {
  awk -v section="[$1]" '
    $0 == section { in_section=1; next }
    /^\[/ && in_section { exit }
    in_section { print }
  ' "$CATALOG"
}

section=$(extract_section "$current")
title=$(awk -F'"' '/^title[[:space:]]*=/ {print $2; exit}' <<<"$section")
sound=$(awk -F'"' '/^sound[[:space:]]*=/ {print $2; exit}' <<<"$section")
# Lines between [ and ] inside `messages = [ ... ]`, strip quotes/commas.
messages=$(awk '
  /^messages[[:space:]]*=[[:space:]]*\[/ { in_arr=1; next }
  in_arr && /^\]/ { exit }
  in_arr { print }
' <<<"$section" | sed -E 's/^[[:space:]]*"//; s/",?[[:space:]]*$//; /^$/d')

message=$(shuf -n1 <<<"$messages")
[[ -z "$message" ]] && message="Battery is at ${pct}%. That's all I've got."
[[ -z "$title" ]] && title="Battery"

case "$current" in
  panic|doom) urgency="critical" ;;
  *)          urgency="normal"   ;;
esac

# Optional sound — fire-and-forget so notify doesn't block.
if [[ -n "$sound" && -r "$SOUND_DIR/$sound" ]] && command -v paplay >/dev/null 2>&1; then
  ( paplay "$SOUND_DIR/$sound" >/dev/null 2>&1 & disown ) || true
fi

notify-send \
  --app-name="battery-notifier" \
  --urgency="$urgency" \
  --icon="battery-caution-symbolic" \
  --category="device" \
  "$title — ${pct}%" \
  "$message"

(( TEST_MODE )) || echo "$current" > "$STATE_FILE"
