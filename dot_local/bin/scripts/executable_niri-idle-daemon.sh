#!/bin/bash
# niri-idle-daemon — swayidle wrapper driving the idle chain on niri machines
# that use the fingerprint lockscreen stack (hyprlock).
#
# noctalia v5's own idle daemon is disabled on these machines (see
# dot_config/noctalia/config.toml.tmpl), so this script owns:
#   90s    → blank monitors (resume on input)
#   180s   → hyprlock (fingerprint + password) via niri-lock.sh
#   1200s  → systemctl suspend
#   sleep  → ensure hyprlock is up before suspending (no flash of unlocked desktop)
#
# Spawned from niri config via spawn-at-startup, gated on .hasFingerprintReader.
# Single-instance guard so chezmoi-apply re-launches don't double up.
#
# ──────────────────────────────────────────────────────────────────────────────
# The lock cascade and its real fix (evidence: journal 2026-06-09 13:39):
#
# On niri, a session locked via ext-session-lock leaves the idle timer stuck
# (niri-wm/niri#2006). When you return and unlock — especially via the
# FINGERPRINT sensor, which fprintd reads directly so the compositor sees ZERO
# input — niri keeps reporting the OLD pre-lock idle-since. swayidle therefore
# still thinks the session is >20 min idle, so after each suspend/resume it
# re-fires its overdue `systemctl suspend`, which re-locks via before-sleep. That
# is the "unlock → ~30s → locked again → unlock → locked again" loop.
#
# Fix: route every lock through niri-lock.sh, which on unlock injects a REAL
# evdev input event via ydotool (/dev/uinput). niri counts that as activity and
# clears the stale idle-since, so the pending suspend stops re-firing. The old
# `wtype -k Shift_L` hack did not work because wtype uses the Wayland
# virtual-keyboard protocol, which niri ignores for idle purposes — only
# uinput-level input resets niri's idle clock.
#
# Switching to hypridle is NOT an option here: niri does not implement
# hyprland-lock-notify-v1 (niri-wm/niri#3459), so hypridle cannot lock before
# sleep on niri. swayidle is the correct tool; the missing piece was the
# uinput-level idle reset, now provided by niri-lock.sh.
#
# NOTE: there is intentionally NO fprintd restart on resume. An earlier image
# hook (`/usr/lib/systemd/system-sleep/50-fprintd-resume.sh`) did that and
# CAUSED "Device was already claimed" by racing hyprlock's sensor claim on
# resume; it has been removed. With a single clean locker the sensor re-claims
# fine on its own.
# ──────────────────────────────────────────────────────────────────────────────

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOCK="$SCRIPT_DIR/niri-lock.sh"

if pgrep -u "$USER" -x swayidle >/dev/null 2>&1; then
    echo "[niri-idle-daemon] swayidle already running; nothing to do."
    exit 0
fi

# ydotoold provides the uinput injection socket that niri-lock.sh uses to reset
# niri's idle clock on unlock. Single-instance guard; default socket lands at
# $XDG_RUNTIME_DIR/.ydotool_socket owned by this user.
if ! pgrep -u "$USER" -x ydotoold >/dev/null 2>&1; then
    ydotoold &>/dev/null &
fi

# `niri msg action power-off-monitors` toggles DPMS off; any input wakes it.
# We pass `resume true` so swayidle marks the screen-off timeout reusable.
exec swayidle -w \
    timeout 90   'niri msg action power-off-monitors' \
                 resume 'true' \
    timeout 180  "$LOCK" \
    timeout 1200 'systemctl suspend' \
    before-sleep "$LOCK"
