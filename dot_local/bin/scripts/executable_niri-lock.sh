#!/bin/bash
# niri-lock — lock with hyprlock, and drive idle-suspend from a LOCK-SCOPED timer
# that is cancelled the moment you unlock.
#
# Why this exists (reproduced 2026-06-10 10:07, journal-confirmed):
# On niri, swayidle's idle-suspend timer does NOT run while the session is locked
# via ext-session-lock (niri#2006). The pending suspend instead fires at the
# exact moment you UNLOCK, and before-sleep then re-locks — so you unlock, get
# thrown straight back to a lock screen, suspend, resume, and have to unlock
# again. No post-unlock reset can prevent this: by the time hyprlock exits the
# suspend is already in flight.
#
# Fix: do not let swayidle drive suspend (its `timeout … systemctl suspend` is
# removed in niri-idle-daemon.sh). Instead, when we lock, arm a background timer
# that suspends ONLY if we are still locked after the delay. Unlock kills the
# timer, so unlocking always cancels the pending suspend → the cascade cannot
# happen. Staying away the full delay still suspends (fires while locked, the
# correct moment), so battery behaviour is preserved.
#
# The post-unlock ydotool tap is kept for a different reason: a fingerprint
# unlock sends ZERO input to the compositor, so without a real evdev event niri
# never clears its idle-since and swayidle won't re-arm its screen-off/lock
# timers for the next cycle. ydotool (/dev/uinput, granted via logind uaccess)
# is a real keypress to niri; wtype (virtual-keyboard protocol) is not, which is
# why the previous wtype-based attempt never worked.
set -uo pipefail

# Seconds locked before we suspend. Overridable for fast testing.
SUSPEND_AFTER="${NIRI_LOCK_SUSPEND_AFTER:-1020}"

# Never stack a second locker on a live one: niri#2986 — restarting a locker
# during an active lock wedges niri into an unrecoverable blank state.
if pidof hyprlock >/dev/null 2>&1; then
    exit 0
fi

# Debounce the spurious re-lock. niri freezes idle while locked and dumps the
# accumulated idle at the moment you unlock, so swayidle re-fires the lock
# timeout 0.3s after you return — throwing you back to a second lock screen. If
# we unlocked less than 4s ago, this invocation IS that spurious re-fire; skip.
STAMP="${XDG_RUNTIME_DIR:-/run/user/$(id -u)}/niri-lock.lastunlock"
if [ -r "$STAMP" ]; then
    now=$(date +%s); last=$(cat "$STAMP" 2>/dev/null || echo 0)
    [ $((now - last)) -lt 4 ] && exit 0
fi

# Arm the lock-scoped suspend. Re-checks pidof at fire time so a race with unlock
# can't suspend a session you've already returned to.
( sleep "$SUSPEND_AFTER"; pidof hyprlock >/dev/null 2>&1 && systemctl suspend ) &
SUSPEND_TIMER=$!

hyprlock   # blocks until the user authenticates (fingerprint or password)

# Unlocked → cancel the pending suspend, and stamp the unlock time so the
# spurious re-lock that swayidle fires next gets debounced above.
kill "$SUSPEND_TIMER" 2>/dev/null || true
date +%s > "$STAMP" 2>/dev/null || true

# Real evdev Shift tap so niri clears its stale idle-since and swayidle re-arms
# its screen-off/lock timers for the next idle cycle.
YDOTOOL_SOCKET="${YDOTOOL_SOCKET:-${XDG_RUNTIME_DIR:-/run/user/$(id -u)}/.ydotool_socket}" \
    ydotool key 42:1 42:0 2>/dev/null || true
