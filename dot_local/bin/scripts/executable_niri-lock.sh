#!/bin/bash
# niri-lock — launch hyprlock once, and on unlock inject a REAL input event so
# niri's idle clock resets.
#
# Why this exists (root cause, evidence in journal 2026-06-09 13:39):
# On niri, locking via ext-session-lock leaves the idle timer stuck. When you
# return and unlock — especially via the FINGERPRINT sensor, which fprintd reads
# directly so the compositor sees ZERO input — niri keeps reporting the OLD
# (pre-lock) idle-since timestamp. swayidle therefore still believes the session
# has been idle for >20 min, so after every suspend/resume it re-fires its
# overdue `systemctl suspend`, which re-locks via before-sleep. The result is the
# "unlock → 30s → locked again → unlock → locked again" cascade. See
# niri-wm/niri#2006 (idle stuck while locked).
#
# The previous fix injected `wtype -k Shift_L`, but wtype uses the Wayland
# virtual-keyboard protocol, which niri does NOT count as activity for idle —
# that's why it never worked. ydotool injects through /dev/uinput (kernel evdev),
# which is indistinguishable from a real keyboard at the libinput layer, so niri
# resets idle-since and the pending suspend no longer re-fires.
#
# ydotoold is started by niri-idle-daemon.sh; /dev/uinput is granted to this user
# via a logind uaccess ACL (the same plumbing vibetyper/voquill use).
set -uo pipefail

# Never stack a second locker on a live one: niri-wm/niri#2986 — restarting a
# locker during an active lock wedges niri into an unrecoverable blank state.
if pidof hyprlock >/dev/null 2>&1; then
    exit 0
fi

hyprlock   # blocks until the user authenticates (fingerprint or password)

# Genuine evdev Shift tap (key code 42, down then up) via uinput. Harmless to the
# focused app, but it clears niri's stale idle-since so idle-driven suspend won't
# immediately re-fire now that you're back.
YDOTOOL_SOCKET="${YDOTOOL_SOCKET:-${XDG_RUNTIME_DIR:-/run/user/$(id -u)}/.ydotool_socket}" \
    ydotool key 42:1 42:0 2>/dev/null || true
