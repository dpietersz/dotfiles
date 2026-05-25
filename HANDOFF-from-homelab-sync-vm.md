# HANDOFF — sync-vm provisioned (back from homelab repo)

Date: 2026-05-25
Origin repo: `~/dev/Projects/homelab`

## VM is up

| Field | Value |
|---|---|
| Hostname (Proxmox) | `sync-vm` |
| Proxmox node | `mentat05` |
| VMID | 115 |
| LAN IP | `10.0.10.30/24` (VLAN 10 — Trusted) |
| Tailscale hostname | `sync-vm` |
| Tailscale IP | `100.73.115.117` |
| Tailscale MagicDNS | `sync-vm.tailfb822f.ts.net` |
| Tailscale tag | `tag:server` (matches existing fleet convention) |
| Cores / RAM / Disk | 2c / 2048 MB / 100 GB on `tank` zfspool |
| OS | Debian Trixie (cloned from `debian-13-trixie-genericcloud` 9305) |
| Bootstrap user | `serveradmin` (cloud-init, operator pubkey) |
| Workstation user | `pietersz` (sudoer, bash, same pubkey via copy from serveradmin) |

## Reachable

- `ssh serveradmin@10.0.10.30` — operator key
- `ssh pietersz@10.0.10.30` — operator key, passwordless sudo
- `ssh pietersz@100.73.115.117` — same, via tailscale IP

## Tailscale-SSH note (one gotcha for the iPad flow)

The role ran `tailscale up --ssh --advertise-tags=tag:server`. The
daemon is listening for tailscale-SSH connections, but the tailnet
ACL currently rejects them with:

> tailnet policy does not permit you to SSH as user "pietersz"

Two ways forward depending on what you want from the iPad:

1. **Use regular sshd over the tailscale IP** (works today). The iPad
   needs the operator ed25519 private key loaded; then
   `ssh pietersz@sync-vm.tailfb822f.ts.net` or
   `ssh pietersz@100.73.115.117` works exactly like LAN.
2. **Enable native tailscale-SSH** (cleanest UX, no key on iPad).
   Add an `sshAccess` rule in the tailscale admin ACL, e.g.:
   ```jsonc
   "ssh": [
     {
       "action": "accept",
       "src": ["dpietersz@github"],
       "dst": ["tag:server"],
       "users": ["pietersz", "serveradmin"]
     }
   ]
   ```
   This is an ACL edit in the tailscale admin console, not anything
   the homelab repo manages.

## Ready for chezmoi

The ansible role does NOT touch GPG, pass, or any user-scope tooling.
That is intentional — `chezmoi` owns it. On `sync-vm` as `pietersz`:

```bash
ssh pietersz@10.0.10.30
sudo apt install chezmoi   # or curl-script install
chezmoi init https://github.com/dpietersz/dotfiles
chezmoi apply
```

`run_once_before_08-decrypt-keys.sh.tmpl` will prompt for the fleet
age passphrase and unlock GPG + SSH like every other fleet machine.
`run_once_before_10-clone-password-store` will then clone the pass
store.

## What landed in the homelab repo

- `services.yaml` — new `sync-vm` VM block under `vms:` (mentat05,
  10.0.10.30/24, VLAN 10, role `sync-vm-bootstrap`, tags
  `[iac, sync, trusted, workstation]`).
- `ansible/roles/sync-vm-bootstrap/` — thin role (apt deps, tailscale
  up via `pass Homelab/tailscale/auth-key`, `pietersz` user creation,
  authorized_keys seed from serveradmin, sshd hardening drop-in). NO
  GPG, NO pass clone, NO host firewall — chezmoi owns user-scope.
- `ansible/playbooks/homelab/12_sync_vm_bootstrap.yml` — wraps the role,
  imported into `site.yml` (config-shaped, idempotent — drift-corrects
  on every `just apply-all`).

## Surprises (deviations from the original handoff)

1. **IP `10.0.10.50` was NOT free.** Already taken by `supabase-studio`
   in `services.yaml`. Used `10.0.10.30` instead.
2. **Pass path corrected.** Handoff said
   `pass show servers/sync-vm/tailscale-authkey`. Actual fleet
   convention is `pass Homelab/tailscale/auth-key` (single shared key
   used by every IaC VM with `tag:server`).
3. **Dropped handoff steps 6 + 7** (GPG import + pass-store clone in
   ansible). Confirmed with operator: chezmoi's
   `run_once_before_08-decrypt-keys` + `run_once_before_10-clone-password-store`
   own that lane, interactively.
4. **No host firewall** (handoff had nftables). Matches every other
   IaC VM in the fleet — UniFi VLAN rules + default-deny inter-VLAN
   are the only firewall layer.
5. **Tailscale-SSH ACL blocks the iPad flow** (see note above).
   Outside the homelab repo's scope.

## Operational notes from the work

- **Pre-existing repo portability bug** caught and worked around:
  the Justfile uses `pass homelab/...` (lowercase) but on Linux the
  pass-store directory is `Homelab/` (capital). Symptomatic of the
  repo's macOS origin (case-insensitive FS). Mitigated locally with
  `ln -s Homelab ~/.password-store/homelab` (untracked symlink — does
  not need committing, but a permanent fix in the Justfile or a rename
  in the pass-store would be cleaner long-term).
- **Proxmox token id** in Justfile is `automation@pam!ansible`, not
  `automation@pve` — irrelevant to dotfiles, but blocked the first
  `tf-apply` attempt until I read the Justfile vars.
- **Cloud-init holds the apt lock** for ~30-60s after VM boot. The
  ansible role will fail with "could not get lock /var/lib/dpkg/lock"
  if run too early. Workaround: `sudo cloud-init status --wait` before
  the playbook. (Possible future hardening: add an `apt: lock_timeout`
  or an explicit wait task to the role.)
