return {
  "supermaven-inc/supermaven-nvim",
  event = "InsertEnter",

  opts = {
    keymaps = {
      accept_suggestion = "<C-y>", -- consistent with Augment
      clear_suggestion = "<C-x>",
      accept_word = "<C->>", -- optional, rarely used
    },
    disable_filetypes = {
      markdown = true,
      text = true,
      help = true,
      gitcommit = true,
      NeogitCommitMessage = true,
    },
  },

  config = function(_, opts)
    local ok, supermaven = pcall(require, "supermaven-nvim")
    if not ok then
      vim.notify("Supermaven not found", vim.log.levels.WARN)
      return
    end
    supermaven.setup(opts)

    -- Single keymap toggle
    vim.keymap.set("n", "<leader>ct", "<cmd>SupermavenToggle<CR>", {
      desc = "Supermaven: Toggle inline suggestions",
    })
  end,
}
