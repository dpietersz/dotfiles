-- Noctalia v5 scripted widget: "reboot required" indicator.
--
-- Shows a single glyph in the bar ONLY when an ostree/bootc deployment is
-- staged but not yet booted (i.e. an OS image update is downloaded and a
-- reboot is needed to apply it). Stays hidden otherwise. On any machine where
-- the check errors (non-ostree, rpm-ostree busy/missing), it stays hidden —
-- so it's safe to ship to every machine; it only ever appears on Bluefin when
-- a reboot is genuinely pending.
--
-- Wired up in dot_config/noctalia/config.toml.tmpl as:
--   [widget.reboot-required]  type = "scripted"  script = ".../reboot-required.lua"
--
-- Detection is read-only and needs no root:
--   rpm-ostree status --json | jq 'any staged deployment'
-- runs async off the UI thread (12ms callback budget — the heavy call happens
-- in a worker thread and only the cheap result handler runs in Lua).

local POLL_MS = 60000 -- reboot-required is not time-critical; check once a minute
local TIMEOUT_MS = 8000 -- rpm-ostree can briefly block on the daemon lock

-- Always exits 0; prints STAGED or CLEAR so the result is unambiguous and a
-- failing rpm-ostree (errored pipe) falls through to CLEAR (stay hidden).
local CHECK = [[rpm-ostree status --json 2>/dev/null | jq -e 'any(.deployments[]?; .staged == true)' >/dev/null 2>&1 && echo STAGED || echo CLEAR]]

-- Glyph (Tabler alias). Alternatives if you prefer: "refresh", "power-cycle", "alert".
local GLYPH = "update"

local staged = false
local primed = false
local inflight = false

barWidget.setUpdateInterval(POLL_MS)
barWidget.setVisible(false) -- hidden until the first check proves a reboot is pending

local function render()
  if staged then
    barWidget.setGlyph(GLYPH)
    barWidget.setColor("error")
    barWidget.setGlyphColor("error")
    barWidget.setVisible(true)
  else
    barWidget.setVisible(false)
  end
end

local function poll()
  if inflight then
    return
  end
  inflight = true
  local ok = noctalia.runAsync(CHECK, function(r)
    inflight = false
    if r.timedOut then
      return -- keep previous state; try again next tick
    end
    local nowStaged = r.stdout:find("STAGED") ~= nil
    if nowStaged ~= staged or not primed then
      staged = nowStaged
      primed = true
      render()
    end
  end, TIMEOUT_MS)
  if not ok then
    inflight = false
  end
end

-- Kick an immediate check on load so we don't wait a full interval to show.
poll()

function update()
  poll()
end

function onClick()
  noctalia.notify("Update ready", "A new system image is staged. Reboot to apply it.")
end
