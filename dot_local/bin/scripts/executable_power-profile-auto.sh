#!/bin/bash
# power-profile-auto — switch the power profile on AC/battery transitions.
#   battery → power-saver,  AC → balanced
#
# Acts only on a power-source CHANGE (and once at login to set the baseline), so
# manual overrides via the noctalia widget / keybinds are respected in between —
# e.g. plug in → balanced, then bump to Performance by hand; it won't be undone
# until the next plug/unplug. Sets via net.hadess.PowerProfiles (the same D-Bus
# interface noctalia reads), so the widget stays in sync. Silent (no notify).
#
# Spawned from niri config (spawn-at-startup). Fedora has no `powerprofilesctl`
# (tuned-ppd backs net.hadess.PowerProfiles), so we drive the D-Bus directly. An
# active in-session user may set the profile without a polkit prompt.
set -uo pipefail

PIDFILE="${XDG_RUNTIME_DIR:-/run/user/$(id -u)}/power-profile-auto.pid"
if [ -r "$PIDFILE" ] && kill -0 "$(cat "$PIDFILE" 2>/dev/null)" 2>/dev/null; then
    exit 0
fi
echo $$ > "$PIDFILE"
trap 'rm -f "$PIDFILE"' EXIT TERM INT

on_ac() {
    local ps
    for ps in /sys/class/power_supply/*; do
        [ -r "$ps/type" ] || continue
        [ "$(cat "$ps/type" 2>/dev/null)" = "Mains" ] || continue
        [ "$(cat "$ps/online" 2>/dev/null)" = "1" ] && return 0
    done
    return 1
}

set_profile() {
    busctl --system set-property net.hadess.PowerProfiles /net/hadess/PowerProfiles \
        net.hadess.PowerProfiles ActiveProfile s "$1" 2>/dev/null
}

apply() { [ "$1" = ac ] && set_profile balanced || set_profile power-saver; }

prev=$(on_ac && echo ac || echo bat)
apply "$prev"                       # baseline at login
while sleep 15; do                  # 15s lag on plug/unplug is fine
    cur=$(on_ac && echo ac || echo bat)
    if [ "$cur" != "$prev" ]; then
        prev=$cur
        apply "$cur"
    fi
done
