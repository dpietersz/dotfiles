# SOP: Renewing an Expired GPG Key (and Re-syncing Dotfiles)

Your GPG key lives in two places: on each machine's local keyring **and** encrypted in this repo at `.encrypted/gpg-private.asc.age` (bootstrapped by `.chezmoiscripts/run_once_after_01-decrypt-keys.sh.tmpl`). When the key expires you must renew it locally *and* update the encrypted blob, otherwise new machines will bootstrap with an already-expired key.

## Prerequisites

- [ ] You have your GPG passphrase
- [ ] You have your dotfiles age passphrase
- [ ] You are on a machine that already has the secret key in its keyring
- [ ] You are in your dotfiles directory: `cd ~/dotfiles`

---

## Key Facts to Remember

- **Renewing primary ≠ renewing subkeys.** You must renew each separately.
- **`--quick-set-expire FPR 1y '*'` is unreliable.** Use explicit subkey fingerprints instead.
- **Fingerprint never changes on renewal.** So `.chezmoi.toml.tmpl` and bootstrap refs do not need updating — only the encrypted blob.
- **The bootstrap skip-guard returns true for expired keys** (`gpg --list-secret-keys FPR` exits 0 even if expired). So simply re-running `chezmoi apply` on another machine will NOT re-import a renewed key — you must manually re-import from the updated encrypted blob.

---

## Step 1: Identify All Keys and Subkeys

```bash
gpg --list-keys --with-colons --with-subkey-fingerprint YOUR_PRIMARY_FPR | grep -E "^(pub|sub|fpr):"
```

Look at column 2 of each `pub:` / `sub:` line:

- `u` = ultimately valid (good)
- `e` = expired (needs renewal)
- `r` = revoked

Record the **primary fingerprint** (after the first `fpr:`) and every **subkey fingerprint** (after each subsequent `fpr:`).

The primary fingerprint is also stored in `.chezmoi.toml.tmpl` as `gpgKeyId` — you can source it from there if you don't want to type it:

```bash
PRIMARY=$(grep gpgKeyId ~/dotfiles/.chezmoi.toml.tmpl | cut -d'"' -f2)
```

Subkey fingerprints aren't stored anywhere — read them from the `fpr:` line immediately after each `sub:` line in the colon dump above.

---

## Step 2: Renew the Primary Key

```bash
gpg --quick-set-expire YOUR_PRIMARY_FPR 1y
```

Choose a duration: `1y`, `2y`, `5y`, or `0` (never). Prompts for your GPG passphrase.

---

## Step 3: Renew Each Subkey Explicitly

**Do not use the `*` wildcard** — it silently skips subkeys in some gpg versions.

Pass the subkey fingerprint(s) after the duration:

```bash
gpg --quick-set-expire YOUR_PRIMARY_FPR 1y YOUR_SUBKEY_FPR
```

Repeat for every subkey (sign `[S]`, encrypt `[E]`, authenticate `[A]`) if you have multiples.

---

## Step 4: Verify All Keys Show `u`

```bash
gpg --list-keys --with-colons --with-subkey-fingerprint YOUR_PRIMARY_FPR | grep -E "^(pub|sub):"
```

Expected — every line starts with `pub:u:` or `sub:u:`. No `e`.

Also sanity-check with an operation that actually uses the encryption subkey — decrypt any pass entry or gpg-encrypted file. No `secret key ... expired` warning → you're good.

---

## Step 5: Re-export the Updated Secret Key

```bash
gpg --export-secret-keys --armor YOUR_PRIMARY_FPR > /tmp/gpg-private.asc
```

This exports the primary **and all subkeys** with their new expiry.

---

## Step 6: Re-encrypt for Dotfiles

Write to a `.new` file first so the old blob isn't clobbered until verified:

```bash
cd ~/dotfiles
age -p -o .encrypted/gpg-private.asc.age.new /tmp/gpg-private.asc
```

Enter your dotfiles age passphrase (twice).

---

## Step 7: Verify Round-Trip

```bash
age -d .encrypted/gpg-private.asc.age.new > /tmp/gpg-private.verify
diff /tmp/gpg-private.asc /tmp/gpg-private.verify && echo "OK"
```

Must print `OK`.

---

## Step 8: Swap In and Shred Temp Files

```bash
mv .encrypted/gpg-private.asc.age.new .encrypted/gpg-private.asc.age
rm -P /tmp/gpg-private.asc /tmp/gpg-private.verify
```

---

## Step 9: Commit and Push

```bash
git add .encrypted/gpg-private.asc.age
git commit -m "chore(keys): renew GPG key expiration"
git push
```

---

## Step 10: Update Other Machines

On each other machine that has the (now-expired) key imported:

```bash
# Pull latest dotfiles
cd ~/dotfiles
git pull

# Re-import the renewed key (the bootstrap guard skips this automatically)
echo "$YOUR_AGE_PASSPHRASE" | age -d .encrypted/gpg-private.asc.age | gpg --import --batch
```

Verify:
```bash
gpg --list-keys --with-colons --with-subkey-fingerprint YOUR_PRIMARY_FPR | grep -E "^(pub|sub):"
# All lines should show :u:
```

---

## Troubleshooting

### Decryption still reports "secret key ... expired"

The subkey used for encryption wasn't renewed. Check the exact subkey ID referenced in an encrypted file:

```bash
gpg --list-packets path/to/any/encrypted/file.gpg | grep keyid
```

Then run Step 3 with that subkey fingerprint.

### `--list-keys` shows primary but no subkey

Subkey may be expired and hidden from default output. Use `--with-colons` (Step 1) — it always lists subkeys regardless of state.

### `--quick-set-expire ... '*'` didn't renew subkeys

Known gpg quirk. Always pass explicit subkey fingerprints.

### Bootstrap on a new machine re-imported the old expired key

The old blob was still committed. Ensure Step 9 landed on `origin/main` before bootstrapping elsewhere.

---

## Quick Reference

```bash
# Full renewal + dotfiles sync in one block
FPR=$(grep gpgKeyId ~/dotfiles/.chezmoi.toml.tmpl | cut -d'"' -f2)
SUB=$(gpg --list-keys --with-colons --with-subkey-fingerprint "$FPR" \
      | awk -F: '/^sub:/{getline; print $10}')

gpg --quick-set-expire "$FPR" 1y
gpg --quick-set-expire "$FPR" 1y "$SUB"
gpg --list-keys --with-colons --with-subkey-fingerprint "$FPR" | grep -E "^(pub|sub):"

gpg --export-secret-keys --armor "$FPR" > /tmp/gpg-private.asc
cd ~/dotfiles
age -p -o .encrypted/gpg-private.asc.age.new /tmp/gpg-private.asc
age -d .encrypted/gpg-private.asc.age.new > /tmp/gpg-private.verify
diff /tmp/gpg-private.asc /tmp/gpg-private.verify && echo "OK"
mv .encrypted/gpg-private.asc.age.new .encrypted/gpg-private.asc.age
rm -P /tmp/gpg-private.asc /tmp/gpg-private.verify
git add .encrypted/gpg-private.asc.age
git commit -m "chore(keys): renew GPG key expiration"
git push
```

---

**Related docs:** [`add-encrypted-keys.md`](./add-encrypted-keys.md) · [`opencode-manage-keys.md`](./opencode-manage-keys.md)
