# OBS Studio — first-launch runbook

Managed system layer lives in `bluefin-udx` (RPM `obs-studio` + `obs-studio-plugin-vaapi` + signed `kmod-v4l2loopback` + `/etc/modules-load.d/v4l2loopback.conf` + `/etc/modprobe.d/v4l2loopback.conf`). This repo (dotfiles, user layer) owns: the niri portal config, the PRIME-offload launcher wrapper, and this runbook.

OBS profile files (`basic.ini`), scene collections, and plugins are **deliberately not** auto-deployed yet — they encode user-, monitor-, and mic-specific values that benefit from being applied against the actually-installed `obs-studio` rather than guessed. Iterate after first launch.

## Post-rebase verification (run once per machine)

Before launching OBS the first time, confirm the system half landed:

```bash
rpm -q obs-studio obs-studio-plugin-vaapi kmod-v4l2loopback
lsmod | grep v4l2loopback                      # module loaded at boot
systemctl --user status xdg-desktop-portal-gnome  # MUST be active — silent killer if not
v4l2-ctl --list-devices | grep -i 'OBS Virtual Camera'
```

If `xdg-desktop-portal-gnome` is inactive, OBS will show a black frame when you pick the screen-capture source. Fix:

```bash
systemctl --user enable --now xdg-desktop-portal-gnome.service
```

## Launch

Always launch via `obs` — the wrapper at `~/.local/bin/scripts/obs` handles the NVIDIA PRIME offload env vars on the P14s so OBS composites on the dGPU. On the T580 the wrapper is a no-op (`exec /usr/bin/obs`).

```bash
obs
```

If OBS launches via a `.desktop` file (Wofi / Niri overview), it bypasses the wrapper and runs `/usr/bin/obs` directly — only matters on NVIDIA, and only manifests as frame drops, not a hard failure.

## First-launch settings (apply once per machine via OBS UI)

These are the values the research validated as the recording-for-YouTube defaults. OBS persists them under `~/.config/obs-studio/basic/profiles/<ProfileName>/basic.ini` — once applied they survive.

### Settings → Video

| Field | Value |
|---|---|
| Base (Canvas) Resolution | `2560x1440` (record at native, scale on output) |
| Output (Scaled) Resolution | `1920x1080` |
| Downscale Filter | `Lanczos` |
| Common FPS Values | `60` |

### Settings → Output (Advanced mode)

**P14s (NVIDIA):**

| Field | Value |
|---|---|
| Output Mode | Advanced |
| Recording → Type | Standard |
| Recording Path | `~/Videos/obs/` (create the dir first) |
| Recording Format | `Matroska Video (.mkv)` |
| Audio Track | 1, 2, 3 (all enabled) |
| Encoder | `NVIDIA NVENC HEVC` (or `AV1` if dGPU is Ada-gen — check `nvidia-smi --query-gpu=name --format=csv,noheader`) |
| Rate Control | `CQP` |
| CQ Level | `16` |
| Preset | `P5: Slow (Good Quality)` |
| Profile | `main` (HEVC) / `main` (AV1) |
| Look-ahead | on |
| Psycho Visual Tuning | on |

**T580 (Intel iGPU, VAAPI):**

| Field | Value |
|---|---|
| Encoder | `FFmpeg VAAPI` |
| Codec | `hevc_vaapi` |
| Rate Control | `CQP` |
| CQ Level | `22` (VAAPI quality scale differs from NVENC; tune by eye) |
| Profile | `main` |

### Settings → Output → Remux (after recording)

Turn ON `Automatically remux to MP4`. Records as MKV (crash-safe), delivers MP4 (player-friendly).

### Settings → Audio

| Field | Value |
|---|---|
| Sample Rate | `48 kHz` (NOT 44.1 — must match Resolve timeline) |
| Channels | `Stereo` |

### Settings → Advanced

| Field | Value |
|---|---|
| Color Format | `NV12` (8-bit) — switch to `P010` only if recording HEVC 10-bit |
| YUV Color Space | `709` |
| YUV Color Range | `Partial` |

**Color range trap:** YouTube assumes BT.709 Limited. If you record Full range and upload, blacks crush and whites blow on YouTube's transcoded version. This single setting is the most-common ruined-first-video mistake.

### Audio → Advanced Audio Properties (right-click any audio meter)

Set tracks for each source:

| Source | Track 1 (Mix) | Track 2 (Mic) | Track 3 (Desktop) |
|---|---|---|---|
| Mic/Aux | ✓ | ✓ |   |
| Desktop Audio | ✓ |   | ✓ |

You cannot un-mix audio in post. Multi-track is the single biggest reversibility win.

## Mic filter chain (apply to your mic source, in this order)

Right-click the mic source → Filters → Add (each in order):

| # | Filter | Setting | Value |
|---|---|---|---|
| 1 | Noise Gate | Close Threshold | `-40 dB` |
|   |   | Open Threshold | `-32 dB` |
|   |   | Attack Time | `5 ms` |
|   |   | Hold Time | `100 ms` |
|   |   | Release Time | `150 ms` |
| 2 | Noise Suppression | Method | `RNNoise (Very High Quality)` |
| 3 | VST 2.x Plugin | Plugin | `ReaEQ` (install ReaPlugs separately — closed-source freeware from reaper.fm; not in brew) |
|   |   | Filter | HPF 12 dB/oct at 100 Hz; -2 dB at 250 Hz; +2 dB at 3 kHz |
| 4 | Compressor | Ratio | `3:1` |
|   |   | Threshold | `-18 dB` |
|   |   | Attack | `10 ms` |
|   |   | Release | `100 ms` |
|   |   | Output Gain | `+2 dB` |
| 5 | Limiter | Threshold | `-1.0 dB` |
|   |   | Release | `60 ms` |

**Tune Close threshold ~5 dB above your room noise floor.** Aim for 3–6 dB compressor gain reduction on normal speech.

Loudness normalization (target −14 LUFS integrated for YouTube) happens in **post** (DaVinci Resolve Fairlight), not in OBS. OBS cannot meter LUFS live.

## Virtual camera

After launch, OBS → `Start Virtual Camera`. Confirm:

```bash
v4l2-ctl --list-devices    # should show "OBS Virtual Camera"
```

In Teams / Zoom / browser-based meeting apps, the camera picker should list it. The system modprobe config (`/etc/modprobe.d/v4l2loopback.conf`) sets `exclusive_caps=1` which is what Chromium-family apps need to recognize the device.

## Verify your first test recording

Record 30 seconds, then:

```bash
mediainfo ~/Videos/obs/<file>.mkv
```

Confirm:
- `Frame rate mode: Constant` (CFR, not VFR — Resolve hates VFR)
- `Sampling rate: 48.0 kHz`
- `Color range: Limited` (BT.709)
- `Color primaries: BT.709`

If any of those are wrong, fix the setting before recording any real take.

## Deferred items (not in this commit)

Tracking for follow-up after first launch on each machine:

- **OBS profile auto-deploy** — once the manually-applied profile is stable, capture `~/.config/obs-studio/basic/profiles/<name>/basic.ini` as a chezmoi `.tmpl` with `.hasNvidia` gates for the encoder block
- **Scene collection auto-deploy** — Intro / Main-Code / Main-Code+Cam / Talking-Head / BRB / Outro with the mic filter chain baked into the source filters, exported to `~/.config/obs-studio/basic/scenes/YouTube.json`
- **Plugin install script** — `.chezmoiscripts/run_onchange_after_22-install-obs-plugins.sh.tmpl` (next free slot after `21-configure-audio-routing`) pulling pinned releases of Move Transition, Advanced Scene Switcher, Source Record, Input Overlay from GitHub with SHA256 verification, extracted to `~/.config/obs-studio/plugins/`
- **ReaPlugs** — closed-source freeware (`reaper.fm/reaplugs/`), not in brew/mise. One-time manual download to `~/.vst/` (or wherever OBS scans). Document in a chezmoi-managed onboarding doc rather than auto-install.

## References

- Bluefin-udx OBS bake: `~/dev/Projects/bluefin-udx/RECIPE.md` Phase 3d
- niri portal docs: <https://github.com/YaLTeR/niri/wiki/Screencasting>
- Fedora OBS package: <https://packages.fedoraproject.org/pkgs/obs-studio/obs-studio/>
- OBS Fedora RPM missing browser source (accepted trade-off): <https://discussion.fedoraproject.org/t/obs-doesnt-have-browser-source-or-virtual-camera-or-custom-panels-or-individual-audios-s/76607>
