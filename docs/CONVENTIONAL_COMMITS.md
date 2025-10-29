# Conventional Commits Guide

This repository uses **Conventional Commits** for all git commits. This enables automated changelog generation and semantic versioning.

## Commit Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type

**Required.** Must be one of:

| Type | Purpose | Changelog | Example |
|------|---------|-----------|---------|
| `feat` | New feature | ✅ Features | `feat(nvim): add telescope keybindings` |
| `fix` | Bug fix | ✅ Fixes | `fix(shell): correct alias syntax` |
| `docs` | Documentation only | ❌ Hidden | `docs: update README` |
| `style` | Code style (no logic change) | ❌ Hidden | `style(nvim): format lua files` |
| `refactor` | Code refactoring | ❌ Hidden | `refactor(shell): simplify function` |
| `perf` | Performance improvement | ✅ Performance | `perf(nvim): optimize plugin loading` |
| `test` | Test changes | ❌ Hidden | `test: add validation tests` |
| `chore` | Build, deps, tooling | ❌ Hidden | `chore(deps): update mise tools` |
| `ci` | CI/CD configuration | ❌ Hidden | `ci: add github actions workflow` |
| `revert` | Revert previous commit | ✅ Reverts | `revert: undo nvim config change` |

### Scope

**Optional but recommended.** Indicates what part of the repo is affected:

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

### Subject

**Required.** Concise description (50 chars max):

✅ **Good:**
- `add telescope keybindings`
- `fix shell alias syntax error`
- `update neovim plugins`

❌ **Bad:**
- `Update` (too vague)
- `Fixed a bug in the shell configuration that was causing issues with aliases` (too long)
- `ADDED NEW FEATURE` (all caps)

**Rules:**
- Use imperative mood ("add" not "added" or "adds")
- Don't capitalize first letter
- No period at the end
- Be specific and descriptive

### Body

**Optional.** Detailed explanation of the change:

- Explain **what** and **why**, not how
- Wrap at 72 characters
- Separate from subject with blank line
- Use bullet points for multiple changes

**Example:**
```
feat(nvim): add telescope keybindings

- Add <leader>ff for find files
- Add <leader>fg for find grep
- Add <leader>fb for find buffers

This improves navigation speed and consistency with other editors.
```

### Footer

**Optional.** Reference issues or breaking changes:

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

**Example:**
```
feat(nvim): add telescope keybindings

Add telescope keybindings for improved navigation.

Closes #42
```

---

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

---

## Changelog Generation

Commits are automatically categorized for changelog generation:

### Included in Changelog
- `feat` - New Features
- `fix` - Bug Fixes
- `perf` - Performance Improvements
- `revert` - Reverted Changes

### Excluded from Changelog
- `docs` - Documentation
- `style` - Code style
- `refactor` - Refactoring
- `test` - Tests
- `chore` - Maintenance
- `ci` - CI/CD

---

## Tips for Good Commits

1. **Atomic commits**: One logical change per commit
2. **Descriptive scopes**: Use specific scopes for clarity
3. **Clear subjects**: Future you will thank you
4. **Explain why**: Use body for context and reasoning
5. **Reference issues**: Link to related issues/PRs
6. **Test before committing**: Ensure changes work

---

## Tools

### Generate Commit Message

Use the `git-llm` script to generate conventional commits:

```bash
git add .
git-llm
```

This uses AI to analyze staged changes and generate a proper conventional commit message.

### View Commit History

```bash
# View recent commits
git log --oneline -10

# View commits by type
git log --grep="^feat" --oneline
git log --grep="^fix" --oneline

# View commits with scope
git log --grep="(nvim)" --oneline
```

---

## References

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [Angular Commit Guidelines](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#commit)

