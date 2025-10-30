# How to Modify Any Configuration with OpenCode

This guide shows you how to use OpenCode to modify any configuration file in your dotfiles—whether it's Neovim, shell, UI, or application settings.

## Prerequisites

- OpenCode installed and running
- Basic familiarity with what you want to change
- Understanding of which tool/app you're configuring

## Quick Start

```bash
# Open OpenCode
opencode

# Describe what you want to change
I want to add a new keybinding to Neovim for searching with Telescope
```

OpenCode will:
1. Understand what you want to change
2. Find the relevant configuration files
3. Make the changes safely
4. Show you what was modified

## Step-by-Step: Add a Neovim Keybinding

Let's walk through a concrete example: adding a new keybinding to Neovim.

### Step 1: Describe Your Goal

In OpenCode, type:

```
I want to add a keybinding in Neovim to toggle the file tree with Ctrl+b
```

Be specific about:
- **What tool**: Neovim
- **What you want**: Add a keybinding
- **The keybinding**: Ctrl+b
- **What it does**: Toggle the file tree

### Step 2: Review the Proposed Changes

OpenCode will show you:
- Which file it will modify (e.g., `~/.config/nvim/lua/config/keymaps.lua`)
- The exact changes it will make
- Where the keybinding will be added

Example output:
```
I'll add this to ~/.config/nvim/lua/config/keymaps.lua:

vim.keymap.set("n", "<C-b>", ":NvimTreeToggle<CR>", { noremap = true })
```

### Step 3: Approve or Adjust

If the changes look good, say:
```
Yes, make this change
```

If you want to adjust:
```
Can you also add a description comment above the keybinding?
```

### Step 4: Verify the Change

OpenCode will confirm the change was made. You can verify by:

```bash
# Check the modified file
cat ~/.config/nvim/lua/config/keymaps.lua | grep -A2 "C-b"

# Or open it in your editor
nvim ~/.config/nvim/lua/config/keymaps.lua
```

## Common Configuration Tasks

### Modify Shell Aliases

```
I want to add a new shell alias: 'll' should show all files with details
```

OpenCode will modify `~/.config/shell/40-aliases.sh` and add:
```bash
alias ll='ls -lah'
```

### Change Niri Window Manager Settings

```
I want to change the Niri window manager to use a different font size
```

OpenCode will modify `~/.config/niri/config.kdl` and adjust the font settings.

### Update Starship Prompt Configuration

```
I want to add the Rust module to my Starship prompt
```

OpenCode will modify `~/.config/starship.toml` and enable the Rust module.

### Configure Git Settings

```
I want to set my git user email to my work email
```

OpenCode will modify `~/.gitconfig` with your email.

## Understanding Configuration Locations

OpenCode knows where configurations live:

| Tool | Location | File |
|------|----------|------|
| Neovim | `~/.config/nvim/` | `lua/config/keymaps.lua`, `lua/config/options.lua` |
| Shell | `~/.config/shell/` | `40-aliases.sh`, `30-functions.sh` |
| Niri | `~/.config/niri/` | `config.kdl` |
| Starship | `~/.config/` | `starship.toml` |
| Git | `~/` | `.gitconfig` |
| Waybar | `~/.config/waybar/` | `config.jsonc`, `style.css` |
| Kitty | `~/.config/kitty/` | `kitty.conf` |

## Tips for Better Results

### Be Specific

❌ **Vague**: "Change my Neovim config"
✅ **Specific**: "Add a keybinding to toggle the file tree with Ctrl+b"

### Provide Context

❌ **No context**: "Add a function"
✅ **With context**: "Add a shell function to extract tar files automatically"

### Ask for Explanations

```
I want to add this keybinding, but can you explain what each part does?
```

OpenCode will explain the syntax and what each part means.

### Request Multiple Changes

```
I want to:
1. Add a keybinding for Telescope find files
2. Add a keybinding for Telescope grep
3. Add a keybinding for Telescope buffers

Can you do all three?
```

## Handling Conflicts

If OpenCode finds conflicting settings:

```
I found two places where this setting exists. Which one should I modify?
- Option A: ~/.config/nvim/lua/config/keymaps.lua
- Option B: ~/.config/nvim/after/plugin/keymaps.lua
```

Choose the one that makes sense for your setup. Usually:
- Use `lua/config/` for core settings
- Use `after/plugin/` for plugin-specific settings

## Reverting Changes

If you want to undo a change:

```bash
# See what changed
git diff ~/.config/nvim/

# Revert the file
git checkout ~/.config/nvim/lua/config/keymaps.lua

# Or use chezmoi to restore from dotfiles
chezmoi apply
```

## Advanced: Modifying Multiple Files

For complex changes affecting multiple files:

```
I want to:
1. Add a new keybinding in Neovim
2. Add a corresponding shell alias
3. Update the documentation

Can you handle all three?
```

OpenCode will coordinate changes across multiple files and show you all modifications before applying them.

## When to Use OpenCode vs Manual Editing

**Use OpenCode when:**
- You want to make a specific, well-defined change
- You want OpenCode to find the right location
- You want to understand what's being changed
- You're making changes to multiple files

**Use manual editing when:**
- You're exploring and experimenting
- You need to make many small tweaks
- You're learning the configuration structure
- You want full control over the exact changes

## Troubleshooting

**OpenCode can't find the file?**
- Be more specific about which tool/app
- Provide the full path if you know it
- Ask: "Where is the Neovim keybindings file?"

**Changes didn't apply?**
- Check if the file was actually modified: `git diff`
- Verify the syntax is correct
- Restart the application to load new config

**Want to see what changed?**
```bash
# View all changes
git status

# See specific changes
git diff ~/.config/nvim/
```

## Next Steps

- **Learn about agents**: [OpenCode Agents Reference](../reference/opencode-agents.md)
- **Understand the architecture**: [OpenCode Architecture](../explanation/opencode-architecture.md)
- **Install applications**: [How to Install Applications](./opencode-install-app.md)

---

**Last Updated**: October 30, 2025
