return {
  -- Gitsigns setup (use only if you want to override defaults)
  {
    "lewis6991/gitsigns.nvim",
    opts = {
      -- your custom settings here (optional)
    },
  },
  -- Neogit with Snacks picker and which-key/icon support
  {
    "NeogitOrg/neogit",
    dependencies = {
      "nvim-lua/plenary.nvim",
      "sindrets/diffview.nvim",
      -- Snacks for modern pickers
      "folke/snacks.nvim",
    },
    opts = {},
    keys = {
      { "<leader>gg", "<cmd>Neogit<cr>", desc = " Neogit: Open", mode = { "n" } },
      { "<leader>gc", "<cmd>Neogit commit<cr>", desc = " Neogit: Commit", mode = { "n" } },
      { "<leader>gp", "<cmd>Neogit pull<cr>", desc = " Neogit: Pull", mode = { "n" } },
      { "<leader>gP", "<cmd>Neogit push<cr>", desc = " Neogit: Push", mode = { "n" } },
    },
  },
  -- Optional: Fugitive
  {
    "tpope/vim-fugitive",
    -- No config needed unless you want custom keymaps
    keys = {
      { "<leader>gf", "<cmd>Git<cr>", desc = "󰊢 Fugitive: Git status" },
    },
  },
}
