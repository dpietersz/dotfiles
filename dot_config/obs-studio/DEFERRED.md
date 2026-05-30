# OBS Studio — deferred-items runbook

Companion to [`README.md`](./README.md). Covers the four items intentionally **not** auto-deployed by chezmoi. Each section is "do this manually when you actually need it" — not "follow this on day one."

Why manual: the OBS RPM already covers the recording-for-YouTube core (Studio Mode, scene transitions, RNNoise, replay buffer, hotkeys). Everything below is an enhancement whose value-to-fragility ratio doesn't justify automation across two laptops.

---

## 1. Third-party OBS plugins (manual install)

Plugin install paths on Linux: OBS scans `~/.config/obs-studio/plugins/<plugin>/bin/64bit/<plugin>.so` for the binary and `~/.config/obs-studio/plugins/<plugin>/data/` for data files. Per-plugin commands below.

**Pin versions** — if a release breaks, downgrade rather than chase the upstream change. Commands use the versions current at 2026-05-30.

### 1a. Source Record (per-source separate recordings)

Cleanest archive layout of the four — drops straight in.

```bash
TAG=0.4.8
mkdir -p ~/.config/obs-studio/plugins
cd /tmp
curl -sfLO "https://github.com/exeldro/obs-source-record/releases/download/${TAG}/source-record-${TAG}-ubuntu-22.04.tar.gz"
tar -xzf "source-record-${TAG}-ubuntu-22.04.tar.gz" -C ~/.config/obs-studio/plugins/
# Verify
ls ~/.config/obs-studio/plugins/source-record/bin/64bit/source-record.so
```

Restart OBS. Add a Source Record filter to any source → record that source to its own file alongside the main recording. Critical for multi-cam editing where you want clean per-source takes.

### 1b. Advanced Scene Switcher (automated scene/action engine)

Needs non-trivial relocation because the upstream tar.xz uses Debian `lib/x86_64-linux-gnu/obs-plugins/` layout with a sub-plugin tree.

```bash
TAG=1.34.1
cd /tmp && rm -rf ass-extract && mkdir ass-extract && cd ass-extract
curl -sfLO "https://github.com/WarmUpTill/SceneSwitcher/releases/download/${TAG}/advanced-scene-switcher-${TAG}-x86_64-linux-gnu.tar.xz"
tar -xJf "advanced-scene-switcher-${TAG}-x86_64-linux-gnu.tar.xz"

# Relocate into OBS user-plugin layout
DEST=~/.config/obs-studio/plugins/advanced-scene-switcher
mkdir -p "$DEST/bin/64bit" "$DEST/data"
cp -r lib/x86_64-linux-gnu/obs-plugins/* "$DEST/bin/64bit/"
[[ -d share/obs/obs-plugins/advanced-scene-switcher ]] && \
  cp -r share/obs/obs-plugins/advanced-scene-switcher/* "$DEST/data/"

# Verify
ls "$DEST/bin/64bit/advanced-scene-switcher.so" "$DEST/bin/64bit/advanced-scene-switcher-lib.so.1"
```

Restart OBS. Tools menu → "Advanced Scene Switcher." Heavy plugin, learn it deliberately — start with macro-based scene switching.

### 1c. Move Transition (animated source positioning)

Ships as Debian `.deb` — extract with `ar` then untar.

```bash
TAG=3.2.1
cd /tmp && rm -rf mt-extract && mkdir mt-extract && cd mt-extract
curl -sfLO "https://github.com/exeldro/obs-move-transition/releases/download/${TAG}/move-transition-${TAG}-x86_64-linux-gnu.deb"
ar x "move-transition-${TAG}-x86_64-linux-gnu.deb"
# Detect compression (zst or gz; varies)
DATA_TAR=$(ls data.tar.*)
case "$DATA_TAR" in
  *.zst) tar --use-compress-program=unzstd -xf "$DATA_TAR" ;;
  *.gz)  tar -xzf "$DATA_TAR" ;;
  *.xz)  tar -xJf "$DATA_TAR" ;;
esac

DEST=~/.config/obs-studio/plugins/move-transition
mkdir -p "$DEST/bin/64bit" "$DEST/data"
cp usr/lib/x86_64-linux-gnu/obs-plugins/move-transition.so "$DEST/bin/64bit/"
[[ -d usr/share/obs/obs-plugins/move-transition ]] && \
  cp -r usr/share/obs/obs-plugins/move-transition/* "$DEST/data/"

ls "$DEST/bin/64bit/move-transition.so"
```

Add as a transition in OBS → enables animated source moves between scenes. Nice polish.

### 1d. Input Overlay (keystroke / mouse visualizer)

`.deb` again. Same extraction pattern.

```bash
TAG=5.0.6
cd /tmp && rm -rf io-extract && mkdir io-extract && cd io-extract
curl -sfLO "https://github.com/univrsal/input-overlay/releases/download/${TAG}/input-overlay-${TAG}-x86_64-linux-gnu.deb"
ar x "input-overlay-${TAG}-x86_64-linux-gnu.deb"
DATA_TAR=$(ls data.tar.*)
case "$DATA_TAR" in
  *.zst) tar --use-compress-program=unzstd -xf "$DATA_TAR" ;;
  *.gz)  tar -xzf "$DATA_TAR" ;;
  *.xz)  tar -xJf "$DATA_TAR" ;;
esac

DEST=~/.config/obs-studio/plugins/input-overlay
mkdir -p "$DEST/bin/64bit" "$DEST/data"
cp usr/lib/x86_64-linux-gnu/obs-plugins/input-overlay.so "$DEST/bin/64bit/"
[[ -d usr/share/obs/obs-plugins/input-overlay ]] && \
  cp -r usr/share/obs/obs-plugins/input-overlay/* "$DEST/data/"
```

**Wayland caveat:** input-overlay reads via uiohook which has historically been X11-focused. On Wayland the keystroke capture may be partial or broken. Test before relying on it for a real take.

**Wayland-native alternative:** [`wshowkeys`](https://git.sr.ht/~sircmpwn/wshowkeys) — host-side overlay you can window-capture from OBS as a separate source. Less integrated than Input Overlay but actually works under Wayland.

### Maintenance

Re-run the relevant block when:
- An OBS major version bump breaks plugin ABI (rebuild against new OBS)
- You want a newer plugin version (bump `TAG=`)
- A new release reverses your manual mitigation (e.g. an `.so.1` shared lib name change)

There's no `chezmoi apply` involved — these live entirely in `~/.config/obs-studio/plugins/` which is `.chezmoiignore`-d for plugin paths.

---

## 2. ReaPlugs (ReaEQ for the mic filter chain)

Closed-source freeware from Cockos. Not in brew/mise/Fedora. Manual install, one time.

```bash
# Download from https://www.reaper.fm/reaplugs/  (always check for newer version)
cd /tmp
curl -sfLO "https://www.reaper.fm/files/reaplugs/reaplugs-x86_64-linux.tar.xz"
mkdir -p ~/.vst
tar -xJf reaplugs-x86_64-linux.tar.xz -C ~/.vst/
ls ~/.vst/ReaPlugs/
```

OBS scan path for VSTs: `~/.vst/`, `~/.vst3/`, `/usr/lib/vst/`. After install:

1. Restart OBS
2. Right-click mic → Filters → drag your existing **Compressor** down by one slot
3. `+` → **VST 2.x Plugin** → name `ReaEQ` → from the Plugin dropdown choose `~/.vst/ReaPlugs/reaeq.so`
4. Click **Open plugin interface**
5. Configure: HPF 12 dB/oct at 100 Hz, −2 dB shelf at 250 Hz, +2 dB shelf at 3 kHz
6. Drag this filter to slot 3 (between Noise Suppression and Compressor)

Final mic chain becomes: Noise Gate → RNNoise → ReaEQ → Compressor → Limiter (matches the upstream EposVox-validated chain).

**Why not auto-install:** Cockos's license requires manual download. Mirroring is technically prohibited.

---

## 3. OBS profile auto-deploy (when stable)

**Trigger:** after ~5 real recordings where you've stopped tweaking encoder/audio/color settings. Premature snapshot ships the test-take profile that you'll then re-edit, defeating the point.

### Procedure

```bash
# 1. Identify your current profile name
ls ~/.config/obs-studio/basic/profiles/
# typical: "Untitled" if you never renamed it, or the name you set

PROFILE_NAME="Untitled"   # edit to match

# 2. Copy the live profile into dotfiles
mkdir -p ~/dotfiles/dot_config/obs-studio/basic/profiles/${PROFILE_NAME}
cp ~/.config/obs-studio/basic/profiles/${PROFILE_NAME}/basic.ini \
   ~/dotfiles/dot_config/obs-studio/basic/profiles/${PROFILE_NAME}/basic.ini.tmpl

# 3. Edit the .tmpl — wrap the encoder block in .hasNvidia gates
${EDITOR:-nvim} ~/dotfiles/dot_config/obs-studio/basic/profiles/${PROFILE_NAME}/basic.ini.tmpl
```

### Encoder block to templatize

Find the section that looks like:

```ini
[AdvOut]
RecEncoder=jim_hevc_nvenc
RecRescale=false
...
[jim_hevc_nvenc]
preset2=p5
tune=hq
rate_control=CQP
cqp=16
```

Wrap with a Go-template gate:

```gotmpl
[AdvOut]
{{ if .hasNvidia -}}
RecEncoder=jim_hevc_nvenc
{{- else -}}
RecEncoder=ffmpeg_vaapi
{{- end }}
RecRescale=false
...
{{ if .hasNvidia -}}
[jim_hevc_nvenc]
preset2=p5
tune=hq
rate_control=CQP
cqp=16
{{- else -}}
[ffmpeg_vaapi]
codec=hevc_vaapi
rate_control=CQP
cqp=22
profile=main
{{- end }}
```

Keep the rest verbatim (Video, Audio, AdvOut tracks — all machine-agnostic).

### Update `.chezmoiignore.tmpl`

Currently the `.config/obs-studio/` directory is ignored on macOS + server only. The profile under it should remain user-layer on Linux — no change needed unless you want to exclude experimental sub-profiles. Default behavior is fine.

### Apply on T580

```bash
ssh t580
chezmoi update    # pull + apply
ls ~/.config/obs-studio/basic/profiles/${PROFILE_NAME}/basic.ini
```

Profile lands. OBS picks it up on next launch. Encoder branch resolves to `ffmpeg_vaapi` on T580 (Intel iGPU, `.hasNvidia=false`), `jim_hevc_nvenc` on P14s.

### Trap

If you ever **change the profile name in OBS**, chezmoi will create a *second* profile directory beside the renamed live one. Either delete the chezmoi-managed dir + re-snapshot, or use `chezmoi forget` on the obsolete path.

---

## 4. Scene collection auto-deploy (when stable)

**Trigger:** after you've used your scene collection (Intro / Main-Code / Talking-Head / BRB / Outro etc.) across several real takes without rearranging it. Scene collection edits are frequent for the first month; auto-deploying too early creates merge pain.

### Procedure

```bash
# 1. Find your scene collection file
ls ~/.config/obs-studio/basic/scenes/
# typical: "Untitled.json" or your collection name

COLLECTION="YouTube"   # edit to match

# 2. Copy into dotfiles
mkdir -p ~/dotfiles/dot_config/obs-studio/basic/scenes
cp ~/.config/obs-studio/basic/scenes/${COLLECTION}.json \
   ~/dotfiles/dot_config/obs-studio/basic/scenes/${COLLECTION}.json
```

### Things to scrub before committing

Scene collection JSON embeds machine-specific values that will break on the T580. Open the JSON and check for:

| Field | What to do |
|---|---|
| `pulse-output-capture` source `device_id` | Use the symbolic name (`alsa_output.pci-...analog-stereo.monitor`) — these vary by machine. Either delete the source on T580 and let it pick its own, or document the per-machine swap. |
| `pulse-input-capture` source `device_id` | Same — mic device names differ between laptops. |
| `pipewire-screen-capture-source` `restore_token` | Portal token is **per-session**. Will be re-prompted on first launch on each machine. Safe to leave; OBS will re-pair on first use. |
| `v4l2_input` source `device` | If using a V4L2 webcam source with `/dev/videoN`, the device path may differ after the bluefin-udx `video_nr=10` change. Prefer the device name (`Integrated Camera`) over the path. |
| Window-Capture portal tokens | Same as screen-capture — re-paired on first use. |

### Templating

For minor per-machine differences (e.g. monitor index in display-capture source), wrap the JSON value in a Go-template:

```jsonc
"monitor": {{ if .hasExternalMonitor }}1{{ else }}0{{ end }}
```

Save as `.json.tmpl`. Renders correctly on each machine.

For larger machine divergence (e.g. T580 needs entirely different webcam source than P14s), **split into two scene collections** and template the choice via `chezmoiignore` rather than try to template inside the JSON. Easier to maintain.

### Apply on T580

```bash
ssh t580
chezmoi update
# Launch OBS, switch to the new collection via Scene Collection menu
```

### Trap

If OBS is open during `chezmoi apply` and it overwrites the scene JSON, **OBS will write the in-memory state back on exit and clobber your changes.** Always close OBS before applying a scene-collection update.

---

## What's NOT in this runbook (and why)

- **Auto-update for plugins** — quarterly review cycle, manual per the per-plugin commands above. A polling script that checks GitHub release APIs creates more noise than value for 4 plugins across 2 machines.
- **Streaming-specific config** (Twitch/YouTube live keys, restream, OBS websocket auth) — out of scope for "first YouTube video" recording-only workflow. Add when you actually start streaming.
- **Browser source workarounds** — the Fedora RPM doesn't ship browser-source. Mitigation paths: build overlays in DaVinci Resolve in post (the YouTuber-pro path), or use `wshowkeys` + window-capture for keystroke visualization. Documented in the `README.md` "Critical pushback" section.

---

## When you do follow this runbook

Drop a one-line note in the commit message of any change it produced — e.g. `feat(obs): snapshot Untitled profile after 7 stable recordings`. The note tells future-you why the file appeared and what triggered the change.
