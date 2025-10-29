# Git Agent Summary - @git-manager

## Overview

A specialized agent has been created to manage **all git operations** for the dotfiles repository using **Conventional Commits** format for automated changelog generation.

---

## Agent Details

### Location
- **Agent Definition**: `.opencode/agent/git-manager.md`
- **Conventional Commits Guide**: `docs/CONVENTIONAL_COMMITS.md`

### Temperature
- **0.2** (Very deterministic - ensures consistent commit formatting)

### Permissions
- **bash**: ask (for git commands)
- **read**: allow (for analyzing changes)

---

## Key Responsibilities

✅ **Commit Management**
- Stage changes with user confirmation
- Generate conventional commit messages
- Analyze staged changes
- Create descriptive subjects and bodies
- Reference related issues

✅ **Push Operations**
- Verify branch is up-to-date
- Confirm push destination
- Execute git push
- Report results

✅ **Branch Management**
- Create branches with descriptive names
- Switch between branches
- Delete branches safely

✅ **History Operations**
- View commit history
- Filter by type or scope
- Display formatted output
- Revert commits when needed

✅ **Validation**
- Validate commit message format
- Verify commit type is valid
- Ensure scope is appropriate
- Check subject length (50 chars max)

---

## Conventional Commits Format

### Basic Structure

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Commit Types

**Included in Changelog** (appear in automated changelog):
- `feat` - New features
- `fix` - Bug fixes
- `perf` - Performance improvements
- `revert` - Reverted changes

**Excluded from Changelog** (internal/maintenance):
- `docs` - Documentation only
- `style` - Code style (no logic change)
- `refactor` - Code refactoring
- `test` - Test changes
- `chore` - Build, deps, tooling
- `ci` - CI/CD configuration

### Scopes

**Configuration Scopes:**
- `nvim` - Neovim configuration
- `shell` - Shell configuration (bash, zsh)
- `niri` - Niri window manager
- `waybar` - Waybar status bar
- `alacritty` - Alacritty terminal
- `kitty` - Kitty terminal
- `starship` - Starship prompt
- `git` - Git configuration
- `k9s` - K9s kubernetes UI
- `mise` - Mise tool manager

**System Scopes:**
- `chezmoi` - Chezmoi configuration
- `bootstrap` - Bootstrap/setup scripts
- `encryption` - Key encryption/management
- `scripts` - Custom shell scripts
- `docs` - Documentation

**Other Scopes:**
- `deps` - Dependencies
- `ci` - CI/CD
- `repo` - Repository-wide changes

### Subject Rules

✅ **Good:**
- Use imperative mood ("add" not "added")
- 50 characters max
- No period at end
- Specific and descriptive

❌ **Bad:**
- Too vague ("Update")
- Too long (exceeds 50 chars)
- All caps
- Ends with period

### Body (Optional)

- Explain **what** and **why**, not how
- Wrap at 72 characters
- Separate from subject with blank line
- Use bullet points for multiple changes

### Footer (Optional)

**Breaking Changes:**
```
BREAKING CHANGE: description of what broke
```

**Issue References:**
```
Closes #123
Fixes #456
Related-to #789
```

---

## Examples

### Feature Commit

```
feat(nvim): add telescope keybindings

- Add <leader>ff for find files
- Add <leader>fg for find grep
- Add <leader>fb for find buffers

This improves navigation speed and consistency with other editors.

Closes #42
```

### Bug Fix Commit

```
fix(shell): correct alias syntax error

The git alias was using incorrect quoting syntax,
causing it to fail when executed.
```

### Documentation Commit

```
docs: update conventional commits guide

- Add examples for each commit type
- Clarify scope usage
- Add changelog generation info
```

### Refactoring Commit

```
refactor(shell): simplify function logic

Removed unnecessary nested conditions and improved readability.
```

### Dependency Update

```
chore(deps): update neovim to 0.10.0

Updated mise configuration to use latest stable version.
```

---

## Workflow

### Commit Workflow

1. **User Request**: "Commit the changes I made to neovim config"

2. **Analysis Phase**:
   - @git-manager runs `git diff --cached`
   - Analyzes what's being committed
   - Determines commit type (feat, fix, docs, etc.)
   - Identifies scope (nvim, shell, etc.)

3. **Message Generation**:
   - Creates imperative subject (50 chars max)
   - Generates body explaining what and why
   - Adds footer with issue references if applicable

4. **Confirmation**:
   - Shows user the complete commit message
   - Asks for confirmation before committing

5. **Execution**:
   - Commits with the message
   - Reports success/failure

6. **Summary**:
   - Shows what was committed
   - Suggests next steps

### Push Workflow

1. **User Request**: "Push my changes to main"

2. **Verification**:
   - Checks working directory is clean
   - Verifies branch is up-to-date

3. **Confirmation**:
   - Shows current branch
   - Shows remote destination
   - Gets user confirmation

4. **Execution**:
   - Runs `git push`
   - Reports results

---

## Critical Rules

⚠️ **ONLY Agent for Git**
- @git-manager is the ONLY agent that performs git operations
- No other agent should commit, push, or perform git operations

⚠️ **Conventional Commits ALWAYS**
- Every commit MUST follow conventional commits format
- Validates format before committing

⚠️ **Always Ask Before Executing**
- Never commits without user confirmation
- Shows full message before confirming

⚠️ **No Force Operations**
- Never uses `git push --force` without explicit permission
- Asks explicitly for force push/rebase

⚠️ **Atomic Commits**
- One logical change per commit
- Suggests splitting if changes are unrelated

---

## Integration with Other Agents

```
User Request
    ↓
@dotfiles-manager
    ├─ Routes config changes to config agents
    ├─ Routes installation to install agents
    ├─ Routes scripts to custom-scripts
    ├─ Routes documentation to documentation
    └─ Routes git operations to @git-manager
```

**Important**: After other agents make changes, @git-manager handles all git operations.

---

## Total Agent Count

The OpenCode system now includes:

- **1 Primary Agent**: dotfiles-manager
- **4 Config Agents**: nvim-config, shell-config, ui-config, app-config
- **3 Install Agents**: app-installer, mise-manager, script-creator
- **1 Utility Agent**: custom-scripts
- **2 Security Agents**: key-encryptor, key-validator
- **1 Documentation Agent**: documentation
- **1 Git Agent**: git-manager

**Total: 13 specialized agents**

---

## Getting Started with @git-manager

### Step 1: Make Changes
```bash
# Make your changes to configs, scripts, etc.
# Stage them with git add
git add .
```

### Step 2: Commit with Agent
```
You: "Commit the changes I made to neovim config"

@git-manager will:
1. Analyze staged changes
2. Generate conventional commit message
3. Ask for confirmation
4. Commit with message
```

### Step 3: Push with Agent
```
You: "Push my changes to main"

@git-manager will:
1. Verify status
2. Confirm destination
3. Execute push
4. Report results
```

---

## Documentation References

- **`docs/CONVENTIONAL_COMMITS.md`** - Complete conventional commits guide
- **`.opencode/agent/git-manager.md`** - Git manager agent specification
- **`.opencode/WORKFLOW_GUIDE.md`** - Workflow examples (Tasks 8-9)
- **`.opencode/INDEX.md`** - Navigation guide

---

## Summary

Your OpenCode agent system now includes a **dedicated git agent** that:

✅ Manages all git operations
✅ Uses conventional commits for automated changelog generation
✅ Validates commit message format
✅ References issues in commits
✅ Handles atomic commits
✅ Is the ONLY agent authorized for git operations

**You can now maintain your entire dotfiles repository with agents, including git operations!**

