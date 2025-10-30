# How to Manage Encrypted Keys with OpenCode

This guide shows you how to securely add, validate, and manage encrypted keys in your dotfiles using OpenCode.

## Prerequisites

- OpenCode installed and running
- A private key file (SSH key, GPG key, API key, etc.)
- Understanding of what the key is for
- Basic familiarity with encryption concepts

## Quick Start

```bash
# Open OpenCode
opencode

# Ask to add a key
I want to add my SSH key to the dotfiles
```

OpenCode will:
1. Guide you through the encryption process
2. Securely add the key to your dotfiles
3. Ensure it's available where needed

## Step-by-Step: Add an SSH Key

Let's walk through a concrete example: adding an SSH key.

### Step 1: Prepare Your Key

Have your key file ready. For SSH keys, it's typically:
```bash
~/.ssh/id_ed25519
```

### Step 2: Ask OpenCode to Add It

In OpenCode, type:

```
I want to add my SSH key to the dotfiles so it's available on all machines
```

Include:
- **Key type**: SSH, GPG, API key, etc.
- **What it's for**: Authentication, signing, API access
- **Where it's used**: GitHub, servers, APIs

### Step 3: Review the Encryption Plan

OpenCode will show you:
- Which key file it will encrypt
- Where it will be stored (`.encrypted/` directory)
- How it will be decrypted on new machines

Example output:
```
I'll encrypt your SSH key:
- Source: ~/.ssh/id_ed25519
- Encrypted: .encrypted/ssh_id_ed25519.age
- Decryption: Automatic on setup via chezmoi

This key will be available on all machines after bootstrap.
```

### Step 4: Approve the Encryption

If the plan looks good, say:
```
Yes, encrypt and add this key
```

OpenCode will:
1. Encrypt your key using age encryption
2. Add it to the `.encrypted/` directory
3. Update chezmoi configuration to decrypt it on new machines

### Step 5: Verify the Key is Secure

OpenCode will confirm:
```
✓ Key encrypted successfully
✓ Added to .encrypted/ssh_id_ed25519.age
✓ Will be decrypted to ~/.ssh/id_ed25519 on new machines
```

You can verify:
```bash
# Check the encrypted file exists
ls -la .encrypted/ssh_id_ed25519.age

# Verify it's encrypted (should be binary/unreadable)
file .encrypted/ssh_id_ed25519.age

# Check chezmoi configuration
cat .chezmoi.toml.tmpl | grep ssh
```

## Common Key Management Tasks

### Add a GPG Key

```
I want to add my GPG private key to the dotfiles for signing commits
```

OpenCode will:
- Encrypt your GPG key
- Store it in `.encrypted/gpg-private.asc.age`
- Configure it to be available for git signing

### Add an API Key

```
I want to add my GitHub API token to the dotfiles
```

OpenCode will:
- Encrypt the token
- Store it securely
- Make it available as an environment variable

### Add Multiple Keys

```
I want to add:
1. My SSH key for GitHub
2. My SSH key for work servers
3. My GPG key for signing

Can you handle all three?
```

OpenCode will encrypt and manage all of them.

### Validate a Key is Working

```
I added my SSH key. Can you verify it's working correctly?
```

OpenCode will:
- Check the key file exists and is readable
- Test SSH connection if possible
- Verify permissions are correct

## Understanding Key Encryption

### How Keys Are Encrypted

Your dotfiles use **age encryption** for security:

1. **Your key** is encrypted with your age key
2. **Encrypted file** is stored in `.encrypted/`
3. **On new machines**, chezmoi decrypts it during setup
4. **Your age key** is kept secure (not in the repo)

### Key Storage Locations

| Key Type | Encrypted File | Decrypted Location |
|----------|----------------|-------------------|
| SSH | `.encrypted/ssh_id_ed25519.age` | `~/.ssh/id_ed25519` |
| GPG | `.encrypted/gpg-private.asc.age` | `~/.gnupg/private-keys-v1.d/` |
| API Token | `.encrypted/api-token.age` | `~/.config/app/token` |
| Cosign | `.encrypted/cosign.key.age` | `~/.cosign/cosign.key` |

### Security Considerations

- **Encrypted files** are safe to commit to git
- **Your age key** must be kept secure (not in repo)
- **Decrypted keys** are only available after chezmoi setup
- **Permissions** are automatically set correctly (600 for private keys)

## Tips for Better Results

### Be Clear About Key Purpose

❌ **Vague**: "Add a key"
✅ **Specific**: "Add my SSH key for GitHub authentication"

### Provide Context

```
I want to add my work SSH key. It's for accessing our internal servers.
```

This helps OpenCode set up the key correctly.

### Ask for Verification

```
I added my SSH key. Can you verify it works by testing the connection?
```

OpenCode can test the key to ensure it's working.

### Request Key Rotation

```
I want to rotate my API key. Can you help me replace the old one?
```

OpenCode can help you update to a new key.

## Managing Existing Keys

### Update a Key

```
I want to replace my SSH key with a new one
```

OpenCode will:
- Encrypt the new key
- Replace the old encrypted file
- Verify the new key works

### Remove a Key

```
I want to remove my old API key since I'm not using it anymore
```

OpenCode will:
- Remove the encrypted file
- Update chezmoi configuration
- Ensure it's no longer available

### List All Keys

```
What keys do I have in my dotfiles?
```

OpenCode will list all encrypted keys and their purposes.

## Troubleshooting

**Key not available after setup?**
```bash
# Check if the encrypted file exists
ls -la .encrypted/

# Check if chezmoi is configured to decrypt it
cat .chezmoi.toml.tmpl | grep -A5 "encrypted"

# Try applying chezmoi manually
chezmoi apply
```

**SSH key not working?**
```bash
# Check permissions (should be 600)
ls -la ~/.ssh/id_ed25519

# Test the key
ssh -i ~/.ssh/id_ed25519 -T git@github.com

# Check if ssh-agent has the key
ssh-add -l
```

**Want to see what's encrypted?**
```bash
# List all encrypted files
ls -la .encrypted/

# Check what chezmoi will decrypt
chezmoi status | grep encrypted
```

**Encryption failed?**
```
The encryption failed. Can you show me the error?
```

OpenCode will show the error and help you resolve it.

## Advanced: Custom Key Locations

For keys that need special handling:

```
I want to add a key that needs to be in a custom location: ~/.config/myapp/secret.key
```

OpenCode can:
- Encrypt the key
- Configure chezmoi to decrypt it to the custom location
- Set appropriate permissions

## Environment-Specific Keys

### Local Machine Only

```
I want to add a key that's only for my local machine, not in containers
```

OpenCode will add it to local-only configuration.

### Remote/Container Only

```
I want to add a key that's only for my DevContainer
```

OpenCode will add it to container-only configuration.

### All Environments

```
I want this key available everywhere (local and remote)
```

OpenCode will add it to universal configuration.

## When to Use OpenCode vs Manual Key Management

**Use OpenCode when:**
- You want the key tracked in your dotfiles
- You want it available on all machines
- You want OpenCode to handle encryption
- You want verification that it works

**Use manual management when:**
- You're testing a key temporarily
- You need special encryption methods
- You want full control over the process
- You're managing keys outside dotfiles

## Next Steps

- **Modify configurations**: [How to Modify Any Configuration](./opencode-modify-config.md)
- **Install applications**: [How to Install Applications](./opencode-install-app.md)
- **Create scripts**: [How to Create Custom Scripts](./opencode-create-scripts.md)
- **Learn about agents**: [OpenCode Agents Reference](../reference/opencode-agents.md)

---

**Last Updated**: October 30, 2025
