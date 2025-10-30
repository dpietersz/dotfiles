# How to Verify the Security Remediation

This guide shows you how to verify that the security remediation was successful and how to update your local clones of the repository.

## Verifying the Remediation

To verify that all sensitive data has been removed from the git history, run these commands in your dotfiles repository:

### Check for Phone Number

```bash
cd /var/home/pietersz/dotfiles
git log -p | grep -c "0634646487" || echo "0 occurrences"
```

**Expected result**: `0 occurrences` (clean)

### Check for Work Email References

```bash
git log -p | grep -c "salonintel" || echo "0 occurrences"
```

**Expected result**: `0 occurrences` (clean)

### Check for Azure SSH Key References

```bash
git log -p | grep -c "id_rsa_azure_hvs" || echo "0 occurrences"
```

**Expected result**: `0 occurrences` (clean)

### Check for Databricks References

```bash
git log -p | grep -c "databricks" || echo "0 occurrences"
```

**Expected result**: `0 occurrences` (clean)

### Verify Current HEAD is Clean

```bash
git show HEAD:dot_config/espanso/match/base.yml | grep -E "0634646487|dimitri" || echo "✅ Clean"
```

**Expected result**: `✅ Clean`

## Updating Local Clones

If you have other local clones of this repository on different machines, you'll need to update them after the force push to the remote repository.

### Step 1: Fetch the Updated History

```bash
cd /path/to/your/other/clone
git fetch origin
```

### Step 2: Reset to the New Remote State

```bash
git reset --hard origin/main
```

This will discard any local changes and align your clone with the rewritten history on the remote.

## Troubleshooting

### If You Have Uncommitted Changes

If you have uncommitted changes in your local clone, stash them first:

```bash
git stash
git reset --hard origin/main
git stash pop  # Reapply your changes if needed
```

### If You Have Local Commits

If you have local commits that aren't on the remote, you'll need to rebase them:

```bash
git fetch origin
git rebase origin/main
```

### If Reset Fails

If you encounter issues with the reset, you can delete and re-clone the repository:

```bash
cd /path/to/parent/directory
rm -rf dotfiles
git clone https://github.com/your-username/dotfiles.git
```

## Backup Information

The original repository (before remediation) is backed up at:

```
~/dotfiles.backup
```

This backup is available if you need to reference the original state for any reason.

## Next Steps

Once you've verified the remediation and updated all your local clones, the security remediation process is complete. See [Security Remediation Explanation](../explanation/security-remediation.md) for more context on why this was necessary.
