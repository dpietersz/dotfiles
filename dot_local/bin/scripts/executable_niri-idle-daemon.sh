#!/bin/bash
# niri-idle-daemon — swayidle wrapper driving the idle chain on niri machines
# that use the fingerprint lockscreen stack (hyprlock).
#
# noctalia v5's own idle daemon is disabled on these machines (see
# dot_config/noctalia/config.toml.tmpl), so this script owns:
#   90s    → blank monitors (resume on input)
#   180s   → hyprlock (fingerprint + password)
#   1200s  → systemctl suspend
#   sleep  → ensure hyprlock is up before suspending (no flash of unlocked desktop)
#
# Spawned from niri config via spawn-at-startup, gated on .hasFingerprintReader.
# Single-instance guard so chezmoi-apply re-launches don't double up.
#
# ──────────────────────────────────────────────────────────────────────────────
# Why this looks the way it does (evidence-based, see journal 21:19:04 on
# 2026-06-07): the failure was NOT lock stacking. The real bug is that
# unlocking via the FINGERPRINT SENSOR never reaches the compositor — fprintd
# reads the sensor directly, so niri/swayidle see ZERO input events. That means
# touching the sensor does not reset swayidle's idle timer. So when you returned
# at ~15 min, the `timeout 900 systemctl suspend` fired at the exact moment your
# fingerprint unlocked hyprlock: screen unlocked → suspend fired → before-sleep
# re-locked → suspend → on resume a stale fprintd claim forced a password.
#
# Two fixes here:
#   1. `wtype -k Shift_L` after hyprlock exits. When you unlock with a finger,
#      hyprlock returns and we inject one harmless synthetic keypress. THAT is a
#      real compositor input event, so swayidle resets its idle timers and the
#      pending suspend is rescheduled — returning now cancels the suspend instead
#      of racing it. (wtype is baked into the bluefin-udx image.)
#   2. Suspend bumped 900s → 1200s. With lock at 180s and the wtype reset, a
#      normal ~15 min return unlocks and resets well before the 20 min suspend,
#      so the unlock/suspend collision window effectively disappears.
#
# `pidof hyprlock ||` still guards every hyprlock launch so `before-sleep` (and
# any re-entrancy) can never stack a second locker on top of a live one.
#
# NOTE: there is intentionally NO fprintd restart on resume. An earlier image
# hook (`/usr/lib/systemd/system-sleep/50-fprintd-resume.sh`) did that and
# CAUSED "Device was already claimed" by racing hyprlock's sensor claim on
# resume; it has been removed. With a single clean locker the sensor re-claims
# fine on its own.
# ──────────────────────────────────────────────────────────────────────────────

set -euo pipefail

if pgrep -u "$USER" -x swayidle >/dev/null 2>&1; then
    echo "[niri-idle-daemon] swayidle already running; nothing to do."
    exit 0
fi

# `niri msg action power-off-monitors` toggles DPMS off; any input wakes it.
# We pass `resume true` so swayidle marks the screen-off timeout reusable.
exec swayidle -w \
    timeout 90   'niri msg action power-off-monitors' \
                 resume 'true' \
    timeout 180  'pidof hyprlock || { hyprlock; wtype -k Shift_L; }' \
    timeout 1200 'systemctl suspend' \
    before-sleep 'pidof hyprlock || hyprlock'
