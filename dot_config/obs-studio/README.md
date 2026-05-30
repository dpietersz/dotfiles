# OBS Studio — first-launch runbook

Managed system layer lives in `bluefin-udx` (RPM `obs-studio` + `obs-studio-plugin-vaapi` + signed `kmod-v4l2loopback` + `/etc/modules-load.d/v4l2loopback.conf` + `/etc/modprobe.d/v4l2loopback.conf`). This repo (dotfiles, user layer) owns: the niri portal config (`~/.config/xdg-desktop-portal/portals.conf`), this runbook, and the `Mod+Shift+O` niri toggle that resizes the focused window to 1920×1080 for OBS Window Capture.

OBS profile files (`basic.ini`), scene collections, and plugins are **deliberately not** auto-deployed — they encode user-, monitor-, and mic-specific values. Apply the settings below by hand on each machine.

## Post-rebase verification (run once per machine)

```bash
rpm -q obs-studio obs-studio-plugin-vaapi kmod-v4l2loopback
lsmod | grep v4l2loopback                          # module loaded at boot
systemctl --user is-active xdg-desktop-portal-gnome  # MUST be active — silent killer if not
cat /sys/class/video4linux/video*/name             # confirm one node is "OBS Virtual Camera"
```

If `xdg-desktop-portal-gnome` is `inactive`: `systemctl --user enable --now xdg-desktop-portal-gnome.service`.

If the OBS Virtual Camera node isn't there: `sudo modprobe v4l2loopback` then re-check; if still missing, secure-boot key isn't enrolled (shouldn't happen with the signed uBlue kmod, but worth checking with `mokutil --list-enrolled`).

## Launch

Run `obs` from a terminal (or `.desktop` launcher). **No wrapper, no PRIME-offload env vars.** See the [NVIDIA + Wayland gotcha](#nvidia--wayland--portal-capture-the-trap) below for why — the short version is that PRIME offload breaks PipeWire screen capture under niri, and NVENC works fine on the driver path without it.

```bash
obs
```

## First-launch settings (apply once per machine via OBS UI)

The recording-for-YouTube defaults from the upstream research; OBS persists them in `~/.config/obs-studio/basic/profiles/<name>/basic.ini` once applied.

### Settings → Video

| Field | Value |
|---|---|
| Base (Canvas) Resolution | `1920x1080` |
| Output (Scaled) Resolution | `1920x1080` |
| Downscale Filter | greyed out (Base == Output) |
| Common FPS Values | `60` |

**Why 1:1 1080p:** with Window Capture (PipeWire), we capture a specific window — not the whole 2560×1600 (16:10) panel. The `Mod+Shift+O` niri keybind resizes the focused window to exactly 1920×1080 so the capture matches the canvas with zero scaling. Pixel-perfect text, no black bars, no aspect-ratio gymnastics on a 16:10 laptop.

### Settings → Output (Advanced mode)

**P14s (NVIDIA):**

| Field | Value |
|---|---|
| Output Mode | Advanced |
| Recording → Type | Standard |
| Recording Path | `~/dev/Videos/` (or wherever you keep video archives) |
| Recording Format | `Matroska Video (.mkv)` |
| Audio Track | check 1, 2, 3 |
| Video Encoder | `NVIDIA NVENC HEVC` |
| Rate Control | `CQP` |
| CQ Level | `16` |
| Keyframe Interval | `2 s` |
| Preset | `P5: Slow (Higher Quality)` |
| Tuning | `High Quality` |
| Multipass Mode | `Two Passes (Quarter Resolution)` |
| Profile | `main` |
| Look-ahead | on |
| Psycho Visual Tuning | on |
| Max B-frames | `4` |

**T580 (Intel iGPU, VAAPI):**

| Field | Value |
|---|---|
| Encoder | `FFmpeg VAAPI` |
| Codec | `hevc_vaapi` |
| Rate Control | `CQP` |
| CQ Level | `22` (VAAPI quality scale differs from NVENC; tune by eye) |
| Profile | `main` |

### Auto-remux MKV → MP4

OBS → Settings → Output → Recording → enable `Automatically remux to MP4`. Records as MKV (crash-safe), delivers MP4 (player-friendly).

### Settings → Audio

| Field | Value |
|---|---|
| Sample Rate | `48 kHz` (must match Resolve timeline) |
| Channels | `Stereo` |

### Settings → Advanced

| Field | Value |
|---|---|
| Color Format | `NV12` (8-bit) — `P010` only if recording HEVC 10-bit |
| YUV Color Space | `Rec. 709` |
| YUV Color Range | `Limited` |

**Color range trap:** YouTube assumes BT.709 Limited. Full range upload → blacks crush, whites blow. Single most-common ruined-first-video mistake.

### Audio → Advanced Audio Properties

Right-click any audio meter → Advanced Audio Properties. Set tracks:

| Source | T1 (Mix) | T2 (Mic) | T3 (Desktop) |
|---|---|---|---|
| Mic/Aux | ✓ | ✓ |   |
| Desktop Audio | ✓ |   | ✓ |

Multi-track is the single biggest reversibility win in post.

## Mic filter chain (apply to mic source, in this order)

Right-click mic → Filters → `+`. Add in order — order = signal flow.

| # | Filter | Setting | Value |
|---|---|---|---|
| 1 | Noise Gate | Close Threshold | `-40 dB` |
|   |   | Open Threshold | `-32 dB` |
|   |   | Attack | `5 ms` |
|   |   | Hold | `100 ms` |
|   |   | Release | `150 ms` |
| 2 | Noise Suppression | Method | `RNNoise (good quality)` |
| 3 | Compressor | Ratio | `3:1` |
|   |   | Threshold | `-18 dB` |
|   |   | Attack | `10 ms` |
|   |   | Release | `100 ms` |
|   |   | Output Gain | `+2 dB` |
| 4 | Limiter | Threshold | `-1.0 dB` |
|   |   | Release | `60 ms` |

Tune Noise Gate Close ≈ 5 dB above your room noise floor. Compressor should show 3–6 dB gain reduction on normal speech.

Loudness normalization to YouTube's -14 LUFS target happens in **post** (DaVinci Resolve Fairlight). OBS cannot meter LUFS.

**Deferred:** Filter 3 should ideally be a parametric EQ before the Compressor — install [ReaPlugs](https://www.reaper.fm/reaplugs/) (closed-source freeware, not in brew), then add a `VST 2.x Plugin` filter with **ReaEQ** between Noise Suppression and Compressor: HPF 12 dB/oct at 100 Hz, -2 dB shelf at 250 Hz, +2 dB shelf at 3 kHz.

## Window Capture workflow (the actual recording pattern)

1. Open the window you want to record (kitty, browser, whatever)
2. Focus it → press `Mod+Shift+O` → niri resizes it to 1920×1080
3. In OBS: Sources → `+` → **Screen Capture (PipeWire)** → name `Window`
4. niri portal dialog → click **Window** tab → pick the resized window → **Share**
5. OBS canvas should fill with the window (1:1)
6. Add second source for second window if needed; switch scenes via Studio Mode
7. When done recording: focus the recorded window → `Mod+Shift+O` again → niri restores its prior size

## Virtual camera (Teams / Zoom / browser meetings)

OBS → `Start Virtual Camera`. In any meeting app, camera picker → "OBS Virtual Camera". The system `exclusive_caps=1` modprobe option (in bluefin-udx) is what makes Chromium-family apps detect the loopback as a real device.

## Verify your first test recording

```bash
cd ~/dev/Videos && ffprobe -hide_banner "$(ls -t *.mkv | head -1)" 2>&1 | head -40
```

Look for:

- `Video: hevc (Main)` — NVENC HEVC engaged
- `1920x1080` — canvas matches output, no scaling
- `60 fps, 60 tbr` — `tbr == fps` means CFR (Constant Frame Rate). VFR will desync in Resolve.
- `yuv420p(tv, bt709)` — `tv` = TV range = Limited. The color trap is set correctly.
- 3× `Audio: aac ... 48000 Hz` — multi-track recording

If any are off, fix the setting before any real take.

## NVIDIA + Wayland + portal capture: the trap

**Symptom:** "Screen Capture (PipeWire)" source shows a black frame. OBS log contains:

```
[pipewire] Negotiated format: BGRA, Size: ..., Modifier: 0xffffffffffffff
[pipewire] Stream ... state: "error" (error: no more input formats)
```

**Cause:** PRIME render offload (`__NV_PRIME_RENDER_OFFLOAD=1` + `__GLX_VENDOR_LIBRARY_NAME=nvidia`) makes OBS render on the dGPU. niri's compositor renders on the iGPU. The PipeWire portal hands OBS a DMA-BUF buffer from the iGPU side; OBS on the dGPU can't consume it (implicit-modifier mismatch). Frame negotiation drops to "no more input formats" and capture dies.

**Fix:** **Don't use PRIME offload.** Launch bare `obs`. OBS renders on the iGPU (same as compositor) → capture works. NVENC HEVC still works because the encoder is a driver-level NVIDIA API call, not bound to which GPU is rendering OBS itself. Verified on this machine: bare-`obs` launch, NVENC HEVC encoder present and engaged, test recording produced `Video: hevc (Main)` at 6 Mb/s CQP 16.

There used to be a `~/.local/bin/scripts/obs` wrapper in this repo that set those env vars; it was removed because it actively broke screen capture. If you see it come back in a PR, push back.

## Deferred items (track as follow-ups)

- **OBS profile auto-deploy** — once the manually-applied profile is stable, capture `~/.config/obs-studio/basic/profiles/<name>/basic.ini` as a chezmoi `.tmpl` with `.hasNvidia` gates for the encoder block
- **Scene collection auto-deploy** — Intro / Main-Code / Main-Code+Cam / Talking-Head / BRB / Outro with the mic filter chain baked into source filters, exported to `~/.config/obs-studio/basic/scenes/YouTube.json`
- **Plugin install script** — pinned releases of Move Transition, Advanced Scene Switcher, Source Record, Input Overlay from GitHub with SHA256 verification, extracted to `~/.config/obs-studio/plugins/`
- **ReaPlugs** — closed-source freeware (`reaper.fm/reaplugs/`), one-time manual download. Documents the EQ between Noise Suppression and Compressor in the mic chain
- **bluefin-udx**: add `v4l-utils` (for `v4l2-ctl`), `mediainfo` (verification CLI), and pin `video_nr=10` in `/etc/modprobe.d/v4l2loopback.conf` so the loopback lands at `/dev/video10` instead of competing with the real webcam at `/dev/video0`

## References

- bluefin-udx OBS bake: `~/dev/Projects/bluefin-udx/RECIPE.md` Phase 3d
- niri portal docs: <https://github.com/YaLTeR/niri/wiki/Screencasting>
- OBS Fedora RPM tracking: <https://packages.fedoraproject.org/pkgs/obs-studio/obs-studio/>
- OBS Fedora RPM missing browser source (accepted trade-off): <https://discussion.fedoraproject.org/t/obs-doesnt-have-browser-source-or-virtual-camera-or-custom-panels-or-individual-audios-s/76607>
