-- Noctalia v5 scripted widget: active kitty session name (sticky).
--
-- Shows the session_name of the currently keyboard-focused kitty window.
-- Sticky UX, by design:
--   * Focused window is a kitty session  -> show that session's name.
--   * Focus moves to a non-kitty window   -> KEEP the last kitty name (don't blank).
--   * Focused kitty window has no session  -> KEEP the last name.
-- The bar text only changes when you actually switch to a *different* kitty
-- session, so it never flickers or disappears as you move between windows.
--
-- Replaces the previous broken config, which pointed `script` at a command
-- string — a scripted widget loads a Lua *file*, it does not run a command.
--
-- How it reads the session from outside kitty: niri reports the focused
-- window's app_id + pid; kitty's `listen_on unix:/tmp/kitty` creates one RC
-- socket per process at /tmp/kitty-<pid>, so we query that socket and take the
-- `is_focused` window's session_name (kitty exposes it in `@ ls`).

local POLL_MS = 2500    -- responsive without being chatty; text only redraws on change
local TIMEOUT_MS = 4000
local GLYPH = "app-window"

local CHECK = [[
fw=$(niri msg --json focused-window 2>/dev/null)
case "$(printf '%s' "$fw" | jq -r '.app_id // ""')" in
  *kitty*) ;;
  *) printf KEEP; exit 0 ;;
esac
pid=$(printf '%s' "$fw" | jq -r '.pid // empty')
sock="/tmp/kitty-$pid"
[ -S "$sock" ] || { printf KEEP; exit 0; }
kc=kitten; command -v kitten >/dev/null 2>&1 || kc="kitty +kitten"
name=$($kc @ --to "unix:$sock" ls 2>/dev/null \
  | jq -r '[.[].tabs[].windows[] | select(.is_focused==true) | .session_name] | map(select(. != null and . != "")) | first // ""')
if [ -n "$name" ]; then printf 'SESSION:%s' "$name"; else printf KEEP; fi
]]

local last = nil
local inflight = false

barWidget.setUpdateInterval(POLL_MS)
barWidget.setVisible(false) -- hidden until we've seen a kitty session at least once

local function show(name)
  local label = name:gsub("^z%-", "") -- drop the canonical "z-" prefix for a cleaner label
  barWidget.setGlyph(GLYPH)
  barWidget.setText(label)
  barWidget.setColor("on_surface")
  barWidget.setGlyphColor("on_surface")
  barWidget.setVisible(true)
end

local function poll()
  if inflight then
    return
  end
  inflight = true
  local ok = noctalia.runAsync(CHECK, function(r)
    inflight = false
    if r.timedOut then
      return
    end
    local payload = r.stdout:match("SESSION:(.*)")
    if payload then
      local name = payload:gsub("%s+$", "") -- trim trailing whitespace/newline
      if name ~= "" and name ~= last then
        last = name
        show(name)
      end
    end
    -- "KEEP" (or unchanged name): do nothing -> sticky last value
  end, TIMEOUT_MS)
  if not ok then
    inflight = false
  end
end

poll() -- immediate check on load

function update()
  poll()
end

function onClick()
  noctalia.runAsync("kitty-session --list") -- open the session switcher
end
