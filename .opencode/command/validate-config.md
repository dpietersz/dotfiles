---
description: Validate all configuration files for syntax errors
agent: dotfiles-manager
---

Validate all configuration files in the dotfiles repository for syntax errors.

Check:
1. Lua files in dot_config/nvim/ for syntax errors
2. Shell scripts in dot_config/shell/ and dot_local/bin/scripts/ for bash syntax
3. TOML files (mise config) for valid TOML syntax
4. YAML files for valid YAML syntax
5. JSON files for valid JSON syntax

Run validation tools and report any errors found. Suggest fixes for any issues.

