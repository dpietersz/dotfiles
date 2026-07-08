#!/bin/bash
# fontconfig-heal — detect and repair a POISONED fontconfig cache.
#
# THE BUG THIS FIXES (read before touching):
# On this ostree/composefs atomic image, /usr/share/fonts presents an epoch
# (1970) directory checksum at runtime. When `fc-cache` runs while that dir
# isn't fully materialized (early boot, login churn, or via Homebrew's
# fontconfig 2.18 which shadows the system 2.17 on PATH), it writes a cache that
# indexes /usr/share/fonts as ~EMPTY *and* stamps it with the epoch checksum.
# Because the runtime dir checksum is also epoch, that empty cache validates
# FOREVER (FcCacheTimeValid passes) and never self-heals. Real text fonts
# (Noto Serif, Liberation Serif) go invisible to fontconfig, and the ~360 Nerd
# Fonts win the generic serif/sans-serif match by glyph coverage -> monospace
# digits, wrong serif, and tofu in Helium / teams-for-linux / PDFium. Restarting
# an app "fixes" it until the next reboot; a plain `fc-cache -f` does NOT, because
# it trusts the epoch-valid empty cache as fresh.
#
# So the durable fix is NOT run-fc-cache-once — it is DETECT-AND-HEAL: check that
# a canonical baked font is actually visible and that `serif` doesn't resolve to
# a Nerd Font; if not, ERASE the poisoned user caches and force a full rescan,
# retrying until /usr/share/fonts is materialized and the rebuild sticks.
#
# Invoked from: refresh-fontconfig-cache.service (every login, before GUI apps)
# and run_onchange_after_19-fc-cache.sh.tmpl (every chezmoi apply). Idempotent:
# on a healthy system the first check passes and it exits in milliseconds.
#
# NOTE: deliberately NO `pipefail`. The health check pipes `fc-list | grep -q`;
# grep -q closes the pipe on first match, fc-list dies with SIGPIPE, and under
# pipefail the whole pipeline would report failure — a false negative that makes
# the script "heal" a perfectly healthy system on every run. Plain `set -u`.
set -u

# Always the SYSTEM fontconfig (2.17, cache-9) — NEVER Homebrew's 2.18 (cache-11)
# that sits first on PATH. Helium/Teams link the system libfontconfig and read
# the cache-9 set; brew's binary refreshes a parallel cache-11 set they ignore.
FC=/usr/bin/fc-cache
FL=/usr/bin/fc-list
FM=/usr/bin/fc-match
[ -x "$FC" ] || exit 0   # macOS / no fontconfig — CoreText handles fonts there

# CANARY: a serif family baked into the image (google-noto-vf). If it's missing
# from fc-list, the cache covering /usr/share/fonts is poisoned-empty.
CANARY="Noto Serif"

healthy() {
    # Real serif visible AND `serif` does not resolve to a Nerd Font (the symptom).
    "$FL" 2>/dev/null | grep -qi "$CANARY" \
        && ! "$FM" serif 2>/dev/null | grep -qi "nerd font"
}

USER_CACHE="${XDG_CACHE_HOME:-$HOME/.cache}/fontconfig"
healed=0

for attempt in 1 2 3 4 5; do
    if healthy; then
        [ "$healed" = 1 ] && echo "[fontconfig-heal] healed on attempt $attempt"
        break
    fi
    healed=1
    # Erasing first is essential: `fc-cache -f` alone can keep the epoch-valid
    # empty cache. Remove it, then force a full rescan of every configured dir.
    rm -f "$USER_CACHE"/*.cache-* 2>/dev/null || true
    "$FC" -f >/dev/null 2>&1 || true
    # /usr/share/fonts may still be materializing this early — back off and retry.
    healthy || sleep 3
done

if ! healthy; then
    echo "[fontconfig-heal] WARNING: '$CANARY' still not visible after 5 attempts" >&2
    exit 1
fi

# If we actually healed AND a long-running Chromium/Electron app is already up,
# it cached the bad resolution in-process for its whole lifetime. Don't force-kill
# (would drop tabs / a Teams call) — just notify so the user can restart it. On
# the login path apps aren't up yet, so this is silent.
if [ "$healed" = 1 ] && command -v notify-send >/dev/null 2>&1; then
    for app in helium teams-for-linux; do
        if pgrep -x "$app" >/dev/null 2>&1; then
            notify-send -u normal "Fonts repaired" \
                "Restart $app to pick up the fixed fonts." 2>/dev/null || true
        fi
    done
fi
exit 0
