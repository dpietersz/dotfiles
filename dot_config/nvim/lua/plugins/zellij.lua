return {
  "swaits/zellij-nav.nvim",
  lazy = true,
  event = "VeryLazy",
  keys = {
    -- Use Alt+hjkl for seamless Zellij/Neovim navigation (no terminal conflicts)
    { "<M-h>", "<cmd>ZellijNavigateLeft<cr>", { silent = true, desc = "Navigate left (Zellij/Nvim)" } },
    { "<M-j>", "<cmd>ZellijNavigateDown<cr>", { silent = true, desc = "Navigate down (Zellij/Nvim)" } },
    { "<M-k>", "<cmd>ZellijNavigateUp<cr>", { silent = true, desc = "Navigate up (Zellij/Nvim)" } },
    { "<M-l>", "<cmd>ZellijNavigateRight<cr>", { silent = true, desc = "Navigate right (Zellij/Nvim)" } },
  },
  opts = {},
}
