#!/bin/bash
# niri-idle-daemon — power-aware idle supervisor for niri machines using the
# fingerprint lockscreen stack (hyprlock).
#
# noctalia v5's own idle daemon is disabled on these machines (see
# dot_config/noctalia/config.toml.tmpl), so this script owns the idle chain.
# It picks timeouts based on AC vs battery and relaunches swayidle when the
# power source changes:
#
#   Battery:  blank 5m  → lock 10m → suspend 20m  (suspend = 10m after lock)
#   AC:       blank 15m → lock 30m → suspend 60m  (suspend = 30m after lock)
#
# Spawned from niri config via spawn-at-startup on every niri (Bluefin) machine.
# hyprlock authenticates by fingerprint where a sensor exists, password otherwise.
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
# Because the suspend fires AT unlock, no post-unlock reset can prevent it. So
# swayidle does NOT drive suspend here. niri-lock.sh arms a lock-scoped suspend
# timer instead and kills it on unlock, so unlocking always cancels the pending
# suspend. niri-lock.sh also injects a real evdev event via ydotool on unlock so
# niri clears its stale idle-since and swayidle re-arms (a fingerprint unlock
# sends zero compositor input; wtype's virtual-keyboard protocol is not counted
# by niri as activity, which is why the earlier wtype attempt failed), plus a
# short debounce to swallow the spurious re-lock niri emits at unlock.
#
# hypridle is NOT an option: niri does not implement hyprland-lock-notify-v1
# (niri#3459), so hypridle cannot lock before sleep on niri.
#
# NOTE: there is intentionally NO fprintd restart on resume. An earlier image
# hook (`/usr/lib/systemd/system-sleep/50-fprintd-resume.sh`) did that and
# CAUSED "Device was already claimed" by racing hyprlock's sensor claim; removed.
# ──────────────────────────────────────────────────────────────────────────────

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOCK="$SCRIPT_DIR/niri-lock.sh"
RUNDIR="${XDG_RUNTIME_DIR:-/run/user/$(id -u)}"

# Single-instance guard (this supervisor). Survives chezmoi re-apply; a fresh
# niri launch starts exactly one.
PIDFILE="$RUNDIR/niri-idle-daemon.pid"
if [ -r "$PIDFILE" ] && kill -0 "$(cat "$PIDFILE" 2>/dev/null)" 2>/dev/null; then
    echo "[niri-idle-daemon] already running; nothing to do."
    exit 0
fi
echo $$ > "$PIDFILE"

# ydotoold provides the uinput socket niri-lock.sh uses to reset niri's idle on
# unlock. Single-instance; default socket at $XDG_RUNTIME_DIR/.ydotool_socket.
if ! pgrep -u "$USER" -x ydotoold >/dev/null 2>&1; then
    ydotoold &>/dev/null &
fi

# On wall power? Canonical signal is a type=Mains supply reporting online (USB-C
# charging registers here too on this ThinkPad).
on_ac() {
    local ps
    for ps in /sys/class/power_supply/*; do
        [ -r "$ps/type" ] || continue
        [ "$(cat "$ps/type" 2>/dev/null)" = "Mains" ] || continue
        [ "$(cat "$ps/online" 2>/dev/null)" = "1" ] && return 0
    done
    return 1
}

SWAY=""
start_swayidle() {
    local mon lock
    if on_ac; then
        mon=900;  lock=1800      # AC:      blank 15m, lock 30m
    else
        mon=300;  lock=600       # Battery: blank 5m,  lock 10m
    fi
    # swayidle does NOT drive suspend — niri-lock.sh owns it (see header). It
    # reads the power state itself to pick the suspend delay.
    swayidle -w \
        timeout "$mon"  'niri msg action power-off-monitors' resume 'true' \
        timeout "$lock" "$LOCK" \
        before-sleep "$LOCK" &
    SWAY=$!
}

cleanup() { [ -n "$SWAY" ] && kill "$SWAY" 2>/dev/null; rm -f "$PIDFILE"; }
trap cleanup EXIT TERM INT

start_swayidle
prev=$(on_ac && echo ac || echo bat)

# Re-pick timeouts when the power source changes. Polling (≤20s lag) is plenty —
# timer reconfiguration on plug/unplug need not be instant — and avoids udev
# orphan handling.
while sleep 20; do
    cur=$(on_ac && echo ac || echo bat)
    if [ "$cur" != "$prev" ]; then
        prev=$cur
        kill "$SWAY" 2>/dev/null
        start_swayidle
    fi
done
