# How-to: Fingerprint unlock on Bluefin + niri

End-to-end setup for fingerprint authentication on the noctalia/niri lockscreen.
Written against the **ThinkPad P14s Gen 5** (Synaptics `06cb:00f9`, Match-on-Chip),
but the process applies to any libfprint-supported sensor on Bluefin.

## Prerequisites

- [ ] You are on Bluefin (rpm-ostree) with niri + noctalia v5
- [ ] Hardware has a supported fingerprint sensor — check with `lsusb`
- [ ] `chezmoi apply` has been run at least once on the machine

## What chezmoi does automatically

When the `.hasFingerprintReader` data var resolves true (USB-probed via known
sensor IDs in `.chezmoi.toml.tmpl`), `chezmoi apply` will:

1. Layer `fprintd` + `fprintd-pam` if missing
   (`.chezmoiscripts/run_once_after_10-enable-fingerprint-pam.sh.tmpl`)
2. Enable `authselect with-fingerprint` — wires `pam_fprintd.so` into
   `/etc/pam.d/system-auth`
3. Layer `hyprlock` + `swayidle`
   (`.chezmoiscripts/run_once_after_11-install-hyprlock-stack.sh.tmpl`)
4. Replace noctalia's lockscreen with hyprlock (PAM service:
   `/etc/pam.d/hyprlock` → `login` → `system-auth`)
5. Hand idle timing (screen-off → lock → suspend) to swayidle via
   `dot_local/bin/scripts/niri-idle-daemon.sh`
6. Disable noctalia's own idle behaviors to prevent double-fire

Each rpm-ostree layer step requires **one reboot**; the scripts exit non-zero
on a fresh layer so they re-run after reboot.

## Step 1: Enroll a finger

After the reboots are done:

```bash
fprintd-enroll                              # default: right-index-finger
fprintd-enroll -f left-index-finger         # extra finger
fprintd-list "$USER"                        # confirm
fprintd-verify                              # quick sanity check
```

Touch/swipe the sensor when prompted — repeat ~5 times per finger.

## Step 2: Test the lockscreen

```bash
loginctl lock-session                       # or Ctrl+Alt+L
```

Hyprlock should display "Touch the fingerprint sensor or type password".
Touch the sensor — unlock should be ~1 second.

---

## Gotcha: `Enroll result: enroll-duplicate`

**Symptom**: `fprintd-enroll` fails immediately with `enroll-duplicate` even
though `fprintd-list "$USER"` says "no fingers enrolled".

**Cause**: Match-on-Chip (MoC) sensors like the Synaptics `06cb:00f9` store
fingerprint templates on the sensor's own flash, not on disk. fprintd
maintains a host-side mapping of *which* on-chip template belongs to *which*
user — but the chip itself can hold orphan templates from:

- Windows enrollment (most common — laptop arrived from Lenovo configured)
- A prior Linux install (templates survive OS reinstalls)
- A different Linux user on the same machine

**Why `fprintd-delete` doesn't help**: it only deletes entries fprintd knows
about. Empty mapping = no-op. The orphan templates persist on the chip.

**Why D-Bus `ClearStorage` doesn't help**: fprintd 1.94.5 on Fedora does NOT
expose that method. Verify with:

```bash
busctl introspect net.reactivated.Fprint /net/reactivated/Fprint/Device/0 \
    | grep -iE 'method|ClearStorage'
```

If there's no `ClearStorage` line, you're stuck. (libfprint upstream supports
the operation; fprintd just doesn't bind it.)

### Fix: BIOS-level fingerprint reset

The sensor's flash is wiped from the Lenovo UEFI menu:

1. Reboot. At the Lenovo splash, press **F1** (or **Enter** for the boot menu
   then **F1** for Setup).
2. **Security** → **Fingerprint** (sometimes nested under "I/O Port Access"
   or "Biometric").
3. Select **Reset Fingerprint Data** (wording varies: "Clear" / "Erase").
   Confirm with **Y**.
4. **F10** → Save & Exit.
5. Back in Bluefin: `fprintd-enroll` will now succeed.

This is the canonical Lenovo path — there is no userspace workaround for
this fprintd version.

---

## Gotcha: Fingerprint stops responding after ~10 min locked

**Known upstream issue**: [hyprlock #702](https://github.com/hyprwm/hyprlock/issues/702).
After the session has been locked for ~5-10 minutes, the fingerprint sensor
stops responding to touches. Password still works.

**Workaround**: unlock with password, then `sudo systemctl restart fprintd`.

We have NOT wired an automatic mitigation for this. If it becomes a daily
annoyance, options are:

- A systemd `--user` timer that restarts `fprintd.service` on a 5-minute
  cadence while locked (needs polkit rule allowing the user to restart it)
- A `before-lock` hook in swayidle that pings `fprintd.service`
- Upstream fix when it lands

---

## Stuck device: `Call failed: Device already in use by another user`

**Symptom**: D-Bus calls return this even though no app should be using the
sensor.

**Cause**: A prior `Claim` call (often from a failed enrollment attempt)
left the device locked. The Claim doesn't auto-release on process exit if
the bus connection drops mid-call.

**Fix**:

```bash
sudo systemctl restart fprintd
```

---

## Verifying the chezmoi stack

Quick health-check:

```bash
chezmoi data | grep -i finger              # hasFingerprintReader: true
authselect list-enabled | grep with-fingerprint
rpm -q fprintd fprintd-pam hyprlock swayidle
fprintd-list "$USER" | grep -i "Fingerprints for user"
pgrep -u "$USER" -x swayidle               # swayidle running
grep -i fprintd /etc/pam.d/system-auth     # pam_fprintd.so should be present
```

All five should return positive results on a fingerprint-enabled machine.

## Disabling the stack on a specific machine

`hasFingerprintReader` is derived from `lsusb`, not configurable. To force-disable:

1. Add the machine's sensor ID to an exclusion in `.chezmoi.toml.tmpl`, OR
2. Add `.config/hypr/` and `.local/bin/scripts/niri-idle-daemon.sh` to that
   machine's local `.chezmoiignore` (not the templated one in the repo).

For now there's no use case for this — the only practical reason to disable
would be a sensor that's supported by libfprint but unreliable.
