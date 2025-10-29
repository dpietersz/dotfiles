---
description: Check dotfiles compatibility with current environment
agent: dotfiles-manager
---

Check if the dotfiles are compatible with the current environment.

Analyze:
1. Current OS (Fedora, Bluefin-dx, macOS, or remote)
2. Required tools availability (bash, zsh, neovim, etc.)
3. Mise configuration for tool versions
4. Environment-specific configurations
5. Remote vs local detection

Report:
- Environment type detected
- Compatible configurations
- Missing tools or dependencies
- Recommendations for the current environment

