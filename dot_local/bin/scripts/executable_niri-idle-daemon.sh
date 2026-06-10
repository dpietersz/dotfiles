#!/bin/bash
# niri-idle-daemon — swayidle wrapper driving the idle chain on niri machines
# that use the fingerprint lockscreen stack (hyprlock).
#
# noctalia v5's own idle daemon is disabled on these machines (see
# dot_config/noctalia/config.toml.tmpl), so this script owns:
#   90s    → blank monitors (resume on input)
#   180s   → hyprlock via niri-lock.sh (which also arms the suspend timer)
#   sleep  → ensure hyprlock is up before suspending (no flash of unlocked desktop)
# Suspend itself is owned by niri-lock.sh (lock-scoped timer), NOT swayidle.
#
# Spawned from niri config via spawn-at-startup, gated on .hasFingerprintReader.
# Single-instance guard so chezmoi-apply re-launches don't double up.
#
# ──────────────────────────────────────────────────────────────────────────────
# The lock cascade and its real fix (journal-confirmed 2026-06-10 10:07):
#
# On niri, swayidle's idle-suspend timer does NOT advance while the session is
# locked via ext-session-lock (niri#2006). Zero suspends fire during the locked
# period; the pending suspend instead fires at the EXACT moment you unlock, and
# before-sleep re-locks — so you unlock, land straight back on a lock screen,
# suspend, resume, and must unlock again. That is the cascade.
#
# Because the suspend fires AT unlock, no post-unlock reset can prevent it (the
# suspend is already in flight before hyprlock exits). So swayidle must not drive
# suspend at all. niri-lock.sh arms a lock-scoped suspend timer instead and kills
# it on unlock, making unlocking always cancel the pending suspend.
#
# niri-lock.sh also injects a real evdev event via ydotool (/dev/uinput) on
# unlock, so niri clears its stale idle-since and swayidle re-arms its
# screen-off/lock timers for the next cycle — a fingerprint unlock otherwise
# sends zero compositor input. The earlier `wtype -k Shift_L` attempt failed
# because wtype's virtual-keyboard protocol is not counted by niri as activity.
#
# hypridle is NOT an option: niri does not implement hyprland-lock-notify-v1
# (niri#3459), so hypridle cannot lock before sleep on niri. swayidle stays as
# the screen-off/lock driver.
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
# NOTE: swayidle does NOT drive suspend. On niri the idle-suspend timer is frozen
# while the session is locked and fires at unlock, causing an unlock→suspend→relock
# cascade (niri#2006, reproduced 2026-06-10). Suspend is instead armed by
# niri-lock.sh when we lock and cancelled on unlock. swayidle only blanks the
# screen and locks.
exec swayidle -w \
    timeout 90  'niri msg action power-off-monitors' \
                resume 'true' \
    timeout 180 "$LOCK" \
    before-sleep "$LOCK"
