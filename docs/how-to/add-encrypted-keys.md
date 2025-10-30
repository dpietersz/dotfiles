# SOP: Adding Encrypted Private Keys to Dotfiles

## Prerequisites

- [ ] You have your special dotfiles super secret passphrase ready
- [ ] You are in your dotfiles directory: `cd ~/dev/Projects/dotfiles`
- [ ] The private key file exists and you know its location
- [ ] Age is installed (via mise)

---

## Step 1: Identify the Key Files

**Determine:**
1. **Private key location:** Example: `~/.config/cosign/cosign.key`
2. **Public key location (if applicable):** Example: `~/.config/cosign/cosign.pub`
3. **Target install location:** Where should this key live on new machines?

**Document this for yourself:**
```
Private key: /path/to/private.key
Public key: /path/to/public.key (optional)
Install to: ~/.ssh/
```

---

## Step 2: Choose an Encrypted Filename

**Naming convention:**
- Use descriptive names
- Mirror the original structure if possible
- Examples:
  - SSH: `ssh_id_ed25519.age`
  - GPG: `gpg-private.asc.age`
  - Cosign: `cosign-private.key.age`

**Your filename:** `____________________.age`

---

## Step 3: Encrypt the Private Key

**Command:**
```bash
cd ~/dev/Projects/dotfiles

# Encrypt private key
age -p -o .encrypted/YOUR_FILENAME.age /path/to/private.key

# If there's a public key, encrypt it too (for consistency)
age -p -o .encrypted/YOUR_FILENAME.pub.age /path/to/public.key
```

**When prompted:** Enter your super secret dotfiles passphrase

---

## Step 4: Verify Encryption

**Test decryption:**
```bash
# Test decrypt to stdout (won't save)
age -d .encrypted/YOUR_FILENAME.age

# Enter your passphrase when prompted
# Verify the output matches your original key
```

**Compare with original:**
```bash
# Decrypt to temp file
age -d .encrypted/YOUR_FILENAME.age > /tmp/test-key

# Compare
diff /path/to/original/private.key /tmp/test-key

# Clean up
rm /tmp/test-key
```

**Expected result:** `diff` should output nothing (files are identical)

---

## Step 5: Commit to Repository

```bash
cd ~/dev/Projects/dotfiles

# Stage encrypted files
git add .encrypted/YOUR_FILENAME.age
git add .encrypted/YOUR_FILENAME.pub.age  # if applicable

# Commit with descriptive message
git commit -m "Add encrypted YOUR_KEY_NAME keys"

# Push to remote
git push
```

---

## Step 6: Update Bootstrap Script (If Needed)

**Ask yourself:** Does this key need to be automatically installed on new machines?

### If YES: Update `.chezmoiscripts/run_once_after_01-decrypt-keys.sh.tmpl`

**Add before the "Clear passphrase" section:**

```bash
# Decrypt YOUR_KEY_NAME
echo "🔓 Decrypting YOUR_KEY_NAME..."
mkdir -p "$HOME/.ssh"

echo "$DOTFILES_PASSPHRASE" | $MISE_BIN_PATH exec age -- age -d "{{ .chezmoi.sourceDir }}/.encrypted/YOUR_FILENAME.age" > "$HOME/.ssh/private.key"

# If public key exists
echo "$DOTFILES_PASSPHRASE" | $MISE_BIN_PATH exec age -- age -d "{{ .chezmoi.sourceDir }}/.encrypted/YOUR_FILENAME.pub.age" > "$HOME/.ssh/public.key"

# Set proper permissions
chmod 600 "$HOME/.ssh/private.key"
chmod 644 "$HOME/.ssh/public.key"  # if applicable

echo "✅ YOUR_KEY_NAME installed"
```

**Update the "Check if keys already exist" section:**
```bash
# Add to the condition
if [ -f "$HOME/.ssh/id_ed25519" ] && \
   gpg --list-secret-keys 207F38BA91AB8330DBF08766B4320995C8E1D17D &>/dev/null && \
   [ -f "$HOME/.ssh/private.key" ]; then
```

**Commit the script update:**
```bash
git add .chezmoiscripts/run_once_after_01-decrypt-keys.sh.tmpl
git commit -m "Update bootstrap to install YOUR_KEY_NAME"
git push
```

### If NO: Manual installation when needed

**Document the manual decryption command:**
```bash
# When you need this key on a new machine:
cd ~/dev/Projects/dotfiles
age -d .encrypted/YOUR_FILENAME.age > ~/.ssh/private.key
chmod 600 ~/.ssh/private.key
```

---

## Step 7: Test on Clean Environment

**If possible, test on your third laptop or a container:**

```bash
# Pull latest dotfiles
cd ~/dev/Projects/dotfiles
git pull

# Run chezmoi apply
chezmoi apply

# Or run the full setup
./setup
```

**Verify:**
- [ ] Prompted for passphrase (3 times + 1 for each new key)
- [ ] Key decrypted successfully
- [ ] Key installed in correct location
- [ ] Correct permissions set
- [ ] Key is functional (test with the tool that uses it)

---

## Step 8: Update Documentation

**Add to your dotfiles README.md:**

```markdown
## Encrypted Keys

The following keys are encrypted in `.encrypted/`:
- SSH keys (`ssh_id_ed25519.age`)
- GPG key (`gpg-private.asc.age`)
- YOUR_KEY_NAME (`YOUR_FILENAME.age`)

Decrypted automatically on bootstrap with your dotfiles passphrase.
```

---

## Verification Checklist

Before considering this complete:

- [ ] Encrypted file exists in `.encrypted/` directory
- [ ] Test decryption works with your passphrase
- [ ] Encrypted file committed and pushed to GitHub
- [ ] `.encrypted/` directory is in `.chezmoiignore` (already done)
- [ ] Bootstrap script updated (if needed)
- [ ] Tested on a clean environment (if possible)
- [ ] Documentation updated

---

## Security Reminders

**DO:**
- ✅ Always use your 100-character passphrase for encryption
- ✅ Test decryption immediately after encryption
- ✅ Verify with `diff` before deleting originals
- ✅ Set correct file permissions (600 for private keys)
- ✅ Keep original keys backed up elsewhere until verified

**DON'T:**
- ❌ Commit unencrypted private keys
- ❌ Use different passphrases for different keys
- ❌ Skip the verification step
- ❌ Forget to push to remote repository
- ❌ Delete original keys before testing

---

## Quick Reference Commands

```bash
# Encrypt a key
age -p -o .encrypted/FILENAME.age /path/to/key

# Test decrypt
age -d .encrypted/FILENAME.age

# Compare with original
age -d .encrypted/FILENAME.age > /tmp/test && diff /path/to/original /tmp/test && rm /tmp/test

# Manual decrypt when needed
age -d .encrypted/FILENAME.age > ~/.ssh/key && chmod 600 ~/.ssh/key
```

---

**Last updated:** October 19, 2025  
**Maintained by:** Dimitri Pietersz