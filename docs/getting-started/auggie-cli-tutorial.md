# Tutorial: Your First Auggie CLI Multi-Agent Operation

In this tutorial, we'll walk through using the Auggie CLI multi-agent system to modify your Neovim configuration. By the end, you'll understand how to use the orchestrator, security auditing, and specialized commands to safely manage your dotfiles.

## What You'll Accomplish

We'll add Rust language support to your Neovim configuration using the security-first multi-agent workflow. You'll see:

- How the primary orchestrator routes requests
- How security auditing protects your public repository
- How specialized commands handle specific domains
- How workflow commands coordinate multi-step operations

## Prerequisites

- Auggie CLI installed and configured
- This dotfiles repository cloned locally
- Basic familiarity with command line operations

## Step 1: Start with the Primary Orchestrator

The primary orchestrator (`/dotfiles-manager`) is your entry point for any dotfiles task. It analyzes your request and recommends the best approach.

Let's ask it to help us add Rust support to Neovim:

```bash
auggie /dotfiles-manager "Add Rust treesitter support to neovim"
```

**What you should see**: The orchestrator will analyze your request and provide:
- A breakdown of what needs to be done
- Recommended commands to run
- Security considerations
- Expected outcomes

**Example output**:
```
## Analysis
This request involves modifying Neovim configuration to add Rust language support via treesitter.

## Implementation Plan
1. Pre-modification security audit
2. Modify treesitter configuration in dot_config/nvim/lua/plugins/treesitter.lua
3. Post-modification security audit
4. Commit changes with conventional commit format

## Recommended Commands
1. auggie /security:security-auditor "pre-audit Add Rust to treesitter ensure_installed"
2. auggie /config:nvim-config "Add Rust to treesitter ensure_installed"
3. auggie /security:security-auditor "post-audit dot_config/nvim/lua/plugins/treesitter.lua"
4. auggie /utils:git-manager "commit feat(nvim): add Rust treesitter support"

## Expected Outcome
Rust language support will be available in Neovim with syntax highlighting and code navigation.

## Security Considerations
Low risk - adding language support to treesitter configuration.
```

**Notice**: The orchestrator provides a complete plan with security-first workflow.

## Step 2: Run the Pre-Modification Security Audit

Before making any changes, we always run a security audit. This protects your public repository from accidentally exposing sensitive information.

```bash
auggie /security:security-auditor "pre-audit Add Rust to treesitter ensure_installed"
```

**What you should see**: A JSON-formatted security assessment:

```json
{
  "audit_type": "pre-audit",
  "risk_level": "LOW",
  "decision": "APPROVE",
  "threats_found": [],
  "recommendations": [
    "Proceed with treesitter configuration modification",
    "Ensure only language names are added to ensure_installed array"
  ],
  "approval_conditions": [],
  "summary": "Low risk modification to treesitter configuration. No security threats detected."
}
```

**Notice**: The security auditor gives explicit approval with `"decision": "APPROVE"`.

## Step 3: Make the Configuration Change

Now we use the Neovim specialist to make the actual change:

```bash
auggie /config:nvim-config "Add Rust to treesitter ensure_installed"
```

**What you should see**: The specialist will:
1. Read the current treesitter configuration
2. Add "rust" to the ensure_installed array
3. Validate the Lua syntax
4. Report the changes made

**Example output**:
```
## Configuration Change Applied

### File Modified
- dot_config/nvim/lua/plugins/treesitter.lua

### Changes Made
Added "rust" to treesitter ensure_installed array:

```lua
return {
  "nvim-treesitter/nvim-treesitter",
  opts = {
    ensure_installed = {
      "bash",
      "lua",
      "markdown",
      "rust",  -- Added this line
      "vim",
      "vimdoc",
    },
  },
}
```

### Validation
✅ Lua syntax validated
✅ LazyVim conventions followed
✅ No conflicts detected
```

**Notice**: The specialist provides detailed information about what was changed and validates the syntax.

## Step 4: Run the Post-Modification Security Audit

After making changes, we audit the actual modifications:

```bash
auggie /security:security-auditor "post-audit dot_config/nvim/lua/plugins/treesitter.lua"
```

**What you should see**: Another security assessment of the actual changes:

```json
{
  "audit_type": "post-audit",
  "risk_level": "LOW",
  "decision": "APPROVE",
  "threats_found": [],
  "recommendations": [
    "Changes are safe to commit",
    "No sensitive information detected"
  ],
  "approval_conditions": [],
  "summary": "Post-modification audit passed. Safe to commit changes."
}
```

**Notice**: The auditor confirms the changes are safe to commit.

## Step 5: Commit the Changes

Finally, we use the git manager to commit with proper conventional commit format:

```bash
auggie /utils:git-manager "commit feat(nvim): add Rust treesitter support"
```

**What you should see**: A properly formatted git commit:

```
## Git Operation: COMMIT

### Current Status
On branch main
Changes to be committed:
  modified:   dot_config/nvim/lua/plugins/treesitter.lua

### Changes Made
Staged and committed changes to treesitter configuration

### Commit Details
- Type: feat
- Scope: nvim
- Message: feat(nvim): add Rust treesitter support

  - Add rust to treesitter ensure_installed
  - Enable Rust syntax highlighting and navigation
- Files: dot_config/nvim/lua/plugins/treesitter.lua

### Repository State
Working directory clean, all changes committed

### Next Steps
Changes are ready. Restart Neovim to see Rust language support.
```

**Notice**: The git manager creates a properly formatted conventional commit with detailed description.

## Step 6: Verify the Result

Let's check that our change was applied correctly:

```bash
# View the modified file
cat dot_config/nvim/lua/plugins/treesitter.lua

# Check git log
git log --oneline -1
```

You should see "rust" in the ensure_installed array and a clean commit message.

## Alternative: Using Workflow Commands

Instead of running each step manually, you could have used the workflow command:

```bash
auggie /workflows:modify-config "nvim Add Rust treesitter support"
```

This single command would have executed all the steps automatically with the same security-first approach.

## What You've Learned

✅ **Primary Orchestrator**: Routes requests and provides implementation plans
✅ **Security-First Workflow**: Always audit before and after changes
✅ **Specialized Commands**: Handle specific domains with deep expertise
✅ **Conventional Commits**: Maintain clean git history
✅ **Workflow Commands**: Automate multi-step operations

## Next Steps

Now that you understand the basic workflow, try these exercises:

1. **Add another language**: Use the same process to add Python or JavaScript support
2. **Modify shell config**: Try `auggie /dotfiles-manager "Add docker aliases"`
3. **Use workflow commands**: Try `auggie /workflows:modify-config "shell Add git aliases"`

## Troubleshooting

**Security audit blocks changes**: If you see `"decision": "BLOCK"`, review the threats_found and follow the mitigation strategies.

**Syntax errors**: The specialists validate syntax, but if you see errors, check the file manually and re-run the command.

**Git conflicts**: If commits fail, check `git status` and resolve any conflicts before retrying.

## Summary

You've successfully used the Auggie CLI multi-agent system to safely modify your dotfiles with:
- Security auditing to protect your public repository
- Specialized expertise for domain-specific changes
- Proper git workflow with conventional commits
- Clear feedback at every step

The same pattern works for any dotfiles modification: orchestrate → audit → implement → audit → commit.