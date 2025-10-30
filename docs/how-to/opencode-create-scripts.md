# How to Create Custom Scripts with OpenCode

This guide shows you how to use OpenCode to create custom automation scripts and add them to your dotfiles.

## Prerequisites

- OpenCode installed and running
- Clear idea of what you want to automate
- Basic understanding of shell scripting (helpful but not required)

## Quick Start

```bash
# Open OpenCode
opencode

# Ask to create a script
I want to create a script that extracts any archive file automatically
```

OpenCode will:
1. Understand what you want to automate
2. Create the script with proper structure
3. Add it to your dotfiles in the right location
4. Make it executable and available in your shell

## Step-by-Step: Create an Archive Extraction Script

Let's walk through a concrete example: creating a script to extract any archive type.

### Step 1: Describe What You Want

In OpenCode, type:

```
I want to create a script called 'extract' that automatically detects the archive type and extracts it. It should handle tar, zip, rar, 7z, and gzip files.
```

Include:
- **Script name**: extract
- **What it does**: Automatically extract archives
- **What it handles**: tar, zip, rar, 7z, gzip
- **How it's used**: `extract file.tar.gz`

### Step 2: Review the Script

OpenCode will show you the script it will create:

```bash
#!/bin/bash
# Extract any archive file automatically

set -euo pipefail

if [ $# -eq 0 ]; then
    echo "Usage: extract <file>"
    exit 1
fi

file="$1"

case "$file" in
    *.tar.gz|*.tgz) tar xzf "$file" ;;
    *.tar.bz2|*.tbz2) tar xjf "$file" ;;
    *.tar) tar xf "$file" ;;
    *.zip) unzip "$file" ;;
    *.rar) unrar x "$file" ;;
    *.7z) 7z x "$file" ;;
    *) echo "Unsupported format: $file"; exit 1 ;;
esac
```

### Step 3: Approve or Adjust

If the script looks good, say:
```
Yes, create this script
```

If you want to adjust:
```
Can you also add error handling and show a success message?
```

### Step 4: Verify the Script

OpenCode will confirm:
```
✓ Script created at ~/.local/bin/scripts/extract
✓ Made executable
✓ Available in your shell as 'extract'
```

You can verify:
```bash
# Check the script exists
ls -la ~/.local/bin/scripts/extract

# Test it
extract archive.tar.gz

# See the script content
cat ~/.local/bin/scripts/extract
```

## Common Script Creation Tasks

### Create a Git Helper Script

```
I want to create a script called 'git-quick-commit' that stages all changes and commits with a message in one command. Usage: git-quick-commit "my message"
```

OpenCode will create a script that:
- Stages all changes
- Commits with your message
- Shows the result

### Create a System Utility Script

```
I want to create a script called 'backup-notes' that backs up my notes directory to a timestamped archive
```

OpenCode will create a script that:
- Creates a backup with timestamp
- Stores it in a backup directory
- Shows completion status

### Create a Development Helper Script

```
I want to create a script called 'dev-setup' that sets up my development environment by:
1. Installing dependencies
2. Creating necessary directories
3. Setting up environment variables
```

OpenCode will create a script with all these steps.

### Create a Monitoring Script

```
I want to create a script called 'check-disk' that monitors disk usage and alerts if any partition is over 80% full
```

OpenCode will create a script that:
- Checks disk usage
- Compares against threshold
- Alerts if needed

## Understanding Script Locations

Scripts are stored in different locations depending on their purpose:

| Location | Purpose | Example |
|----------|---------|---------|
| `~/.local/bin/scripts/` | Personal utility scripts | `extract`, `backup-notes` |
| `~/.local/bin/` | Executable commands | Symlinked from scripts/ |
| `~/.config/shell/` | Shell functions | Sourced in shell config |
| `.chezmoiscripts/` | Setup/installation scripts | Run during chezmoi apply |

## Tips for Better Results

### Be Specific About Behavior

❌ **Vague**: "Create a script"
✅ **Specific**: "Create a script that extracts tar.gz files and shows a success message"

### Provide Examples of Usage

```
I want to create a script called 'myip' that shows my public IP address.
Usage: myip
Output: 192.0.2.1
```

### Ask for Error Handling

```
Create a script that processes files, but handle errors gracefully if a file doesn't exist
```

OpenCode will add proper error checking.

### Request Documentation

```
Create a script with comments explaining what each section does
```

OpenCode will add clear comments throughout.

## Script Structure

OpenCode creates scripts with proper structure:

```bash
#!/bin/bash
# Brief description of what the script does

set -euo pipefail  # Error handling

# Function definitions
function helper_function() {
    # Implementation
}

# Main logic
main() {
    # Implementation
}

# Run main function
main "$@"
```

This structure ensures:
- **Proper shebang** for bash execution
- **Error handling** with `set -euo pipefail`
- **Clear organization** with functions
- **Proper argument passing** with `"$@"`

## Managing Scripts

### Update a Script

```
I want to update my 'extract' script to also handle .xz files
```

OpenCode will:
- Find the existing script
- Add support for .xz files
- Test the update

### Remove a Script

```
I want to remove the 'old-script' since I'm not using it anymore
```

OpenCode will:
- Remove the script file
- Update your dotfiles
- Verify it's no longer available

### List Your Scripts

```
What scripts do I have?
```

OpenCode will list all scripts in your dotfiles.

### Test a Script

```
I created a script. Can you test it to make sure it works?
```

OpenCode can:
- Run the script with test inputs
- Show the output
- Verify it works correctly

## Advanced: Scripts with Dependencies

For scripts that need other tools:

```
I want to create a script that uses ripgrep and fzf for searching. Can you ensure they're installed?
```

OpenCode will:
- Create the script
- Ensure dependencies are installed
- Add error messages if dependencies are missing

## Advanced: Scheduled Scripts

For scripts that should run automatically:

```
I want to create a backup script that runs every night at 2 AM
```

OpenCode will:
- Create the script
- Set up a cron job or systemd timer
- Ensure it runs at the right time

## Environment-Specific Scripts

### Local Machine Only

```
I want to create a script that only works on my local machine
```

OpenCode will add it to local-only configuration.

### Remote/Container Only

```
I want to create a script for my DevContainer environment
```

OpenCode will add it to container-only configuration.

### All Environments

```
I want this script available everywhere
```

OpenCode will add it to universal configuration.

## Troubleshooting

**Script not found after creation?**
```bash
# Check if it exists
ls -la ~/.local/bin/scripts/

# Check if it's executable
ls -la ~/.local/bin/scripts/my-script

# Make it executable if needed
chmod +x ~/.local/bin/scripts/my-script

# Refresh your shell
source ~/.bashrc
```

**Script has errors?**
```bash
# Run with bash debugging
bash -x ~/.local/bin/scripts/my-script

# Check for syntax errors
bash -n ~/.local/bin/scripts/my-script
```

**Want to see what was created?**
```bash
# View the script
cat ~/.local/bin/scripts/my-script

# See all changes
git diff
```

**Script needs dependencies?**
```
My script needs ripgrep. Can you ensure it's installed?
```

OpenCode can add the dependency to your configuration.

## When to Use OpenCode vs Manual Script Creation

**Use OpenCode when:**
- You want the script tracked in your dotfiles
- You want it available on all machines
- You want OpenCode to handle structure and best practices
- You want proper error handling and documentation

**Use manual creation when:**
- You're experimenting with a script
- You need full control over the implementation
- You're testing before adding to dotfiles
- You want to learn shell scripting

## Next Steps

- **Modify configurations**: [How to Modify Any Configuration](./opencode-modify-config.md)
- **Install applications**: [How to Install Applications](./opencode-install-app.md)
- **Manage encrypted keys**: [How to Manage Encrypted Keys](./opencode-manage-keys.md)
- **Learn about agents**: [OpenCode Agents Reference](../reference/opencode-agents.md)

---

**Last Updated**: October 30, 2025
