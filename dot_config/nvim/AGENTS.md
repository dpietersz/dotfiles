# Neovim Config — LazyVim-based configuration with custom plugins

## Architecture

LazyVim framework bootstrapped via `lua/config/lazy.lua`. Plugin specs in `lua/plugins/*.lua` are auto-loaded by lazy.nvim. Config files in `lua/config/` set options, keymaps, and autocmds. Theme: `unokai` with transparent background.

## Repository Structure

```
init.lua                    # Entry point: loads config.lazy
lua/config/
├── lazy.lua                # Bootstrap lazy.nvim + LazyVim
├── options.lua             # Editor settings, LSP config, theme
├── keymaps.lua             # Custom key mappings
└── autocmds.lua            # Auto-commands
lua/plugins/                # Plugin specifications (one file per concern)
after/queries/blade/        # Custom Tree-sitter queries for Blade templates
stylua.toml                 # Lua formatter config (2 spaces, 120 width)
mcpservers.json             # MCP server configuration
```

## Key Files

- `lua/config/options.lua` — All editor settings: leader=`<Space>`, localleader=`/`, 2-space tabs, LSP config (intelephense for PHP, pyright for Python)
- `lua/config/keymaps.lua` — Custom keybindings beyond LazyVim defaults
- `lua/plugins/lsp.lua` — LSP server configuration and overrides
- `lua/plugins/completion.lua` — Completion engine setup
- `lua/plugins/codecompanion.lua` — AI code companion integration
- `lua/plugins/mcphub.lua` — MCP Hub plugin config
- `stylua.toml` — StyLua config: 2-space indent, 120 column width

## Conventions

- **Lua style**: 2-space indent, max 120 column width (enforced by `stylua.toml`)
- **Plugin files**: One file per concern in `lua/plugins/` (e.g., `git.lua`, `lsp.lua`, `completion.lua`)
- **LazyVim patterns**: Follow LazyVim conventions — return plugin spec tables from each file
- **Key mappings**: Use `<leader>` (Space) prefix. Document non-obvious mappings in comments.
- **No lazy-lock.json**: Excluded via `.chezmoiignore` (generated file)
