-- Colorscheme plugins. The active theme is selected at runtime by
-- ~/.config/nvim/lua/config/theme.lua, which is rewritten by theme-switch
-- (see dot_config/themes/). LazyVim's `colorscheme` opt is set to the same
-- value purely for the lazy-load gate; the real switch happens in theme.lua.

return {
  { "ellisonleao/gruvbox.nvim" },
  { "rose-pine/neovim", name = "rose-pine" },
  { "rebelot/kanagawa.nvim" },

  {
    "LazyVim/LazyVim",
    opts = {
      colorscheme = "gruvbox",
    },
  },
}
