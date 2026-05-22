#!/bin/bash
# niri-idle-daemon — swayidle wrapper driving the idle chain on niri machines
# that use the fingerprint lockscreen stack (hyprlock).
#
# noctalia v5's own idle daemon is disabled on these machines (see
# dot_config/noctalia/config.toml.tmpl), so this script owns:
#   90s   → blank monitors (resumes on input)
#   180s  → hyprlock (fingerprint + password)
#   900s  → systemctl suspend
#   sleep → ensure hyprlock is up before suspending (no flash of unlocked desktop)
#
# Spawned from niri config via spawn-at-startup, gated on .hasFingerprintReader.
# Single-instance guard so chezmoi-apply re-launches don't double up.

set -euo pipefail

if pgrep -u "$USER" -x swayidle >/dev/null 2>&1; then
    echo "[niri-idle-daemon] swayidle already running; nothing to do."
    exit 0
fi

# `niri msg action power-off-monitors` toggles DPMS off; any input wakes it.
# Note: niri auto-restores monitors on input — no explicit `resume` needed for
# screen-off. We still pass `resume true` so swayidle marks the timeout reusable.

exec swayidle -w \
    timeout 90  'niri msg action power-off-monitors' \
                resume 'true' \
    timeout 180 'hyprlock' \
    timeout 900 'systemctl suspend' \
    before-sleep 'hyprlock'
