-- Browse kitty's scrollback in nvim with full vim motions: navigate, visual
-- select, `y` to copy, and paste selections back to the command line.
-- Triggered from kitty.conf maps (kitty_mod+h = full scrollback,
-- kitty_mod+g = last command output). Requires kitty `allow_remote_control yes`.
return {
  "mikesmithgh/kitty-scrollback.nvim",
  enabled = true,
  lazy = true,
  cmd = {
    "KittyScrollbackGenerateKittens",
    "KittyScrollbackCheckHealth",
    "KittyScrollbackGenerateCommandLineEditing",
  },
  event = { "User KittyScrollbackLaunch" },
  config = function()
    require("kitty-scrollback").setup()
  end,
}
