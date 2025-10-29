# How to Write Conventional Commits

This guide shows you how to write commits that follow the Conventional Commits standard used in this repository.

## Quick Start

```bash
# Stage your changes
git add .

# Write your commit
git commit -m "feat(nvim): add telescope keybindings"
```

## Writing a Good Commit Message

### Step 1: Choose the Type

Determine what kind of change you're making:

- **`feat`** - Adding a new feature
- **`fix`** - Fixing a bug
- **`docs`** - Documentation changes only
- **`style`** - Code formatting (no logic changes)
- **`refactor`** - Restructuring code (no behavior changes)
- **`perf`** - Performance improvements
- **`test`** - Adding or updating tests
- **`chore`** - Build, dependencies, tooling
- **`ci`** - CI/CD configuration
- **`revert`** - Reverting a previous commit

### Step 2: Choose the Scope

Identify what part of the repository you're changing:

- **Configuration**: `nvim`, `shell`, `niri`, `waybar`, `alacritty`, `kitty`, `starship`, `git`, `k9s`, `mise`
- **System**: `chezmoi`, `bootstrap`, `encryption`, `scripts`, `docs`
- **Other**: `deps`, `ci`, `repo`

### Step 3: Write the Subject

Write a concise description (50 characters max):

✅ **Good:**
- `add telescope keybindings`
- `fix shell alias syntax error`
- `update neovim plugins`

❌ **Bad:**
- `Update` (too vague)
- `Fixed a bug in the shell configuration that was causing issues with aliases` (too long)
- `ADDED NEW FEATURE` (all caps)

**Rules:**
- Use imperative mood ("add" not "added")
- Don't capitalize the first letter
- No period at the end

### Step 4: Add a Body (Optional)

For complex changes, add a body explaining the "what" and "why":

```
feat(nvim): add telescope keybindings

- Add <leader>ff for find files
- Add <leader>fg for find grep
- Add <leader>fb for find buffers

This improves navigation speed and consistency with other editors.
```

### Step 5: Add a Footer (Optional)

Reference related issues or breaking changes:

```
feat(nvim): add telescope keybindings

Add telescope keybindings for improved navigation.

Closes #42
```

## Examples by Category

### Configuration Changes

```
feat(nvim): add telescope keybindings
fix(shell): correct alias syntax
refactor(waybar): simplify module configuration
style(niri): format configuration file
```

### Installation & Tools

```
feat(mise): add lazydocker to tool versions
chore(deps): update neovim to 0.10.0
fix(bootstrap): handle missing mise installation
```

### Documentation

```
docs: add conventional commits guide
docs(nvim): document keybindings
docs: update installation instructions
```

### Scripts & Automation

```
feat(scripts): create backup utility script
fix(scripts): improve error handling in git-llm
refactor(scripts): simplify file extraction logic
```

### Encryption & Security

```
feat(encryption): add SSH key to dotfiles
fix(encryption): correct key permissions
docs(encryption): update key management guide
```

## Tips for Good Commits

1. **Atomic commits**: One logical change per commit
2. **Descriptive scopes**: Use specific scopes for clarity
3. **Clear subjects**: Future you will thank you
4. **Explain why**: Use body for context and reasoning
5. **Reference issues**: Link to related issues/PRs
6. **Test before committing**: Ensure changes work

## Using git-llm to Generate Commits

You can use the `git-llm` script to automatically generate conventional commit messages:

```bash
# Stage your changes
git add .

# Generate commit message with AI
git-llm
```

This analyzes your staged changes and generates a proper conventional commit message.

## Viewing Commit History

```bash
# View recent commits
git log --oneline -10

# View commits by type
git log --grep="^feat" --oneline
git log --grep="^fix" --oneline

# View commits with scope
git log --grep="(nvim)" --oneline
```

## See Also

- [Conventional Commits Format Reference](../reference/conventional-commits-format.md) - Detailed format specification
- [Conventional Commits Official](https://www.conventionalcommits.org/) - Official specification
