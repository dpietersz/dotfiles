return {
  "NickvanDyke/opencode.nvim",
  dependencies = {
    { "folke/snacks.nvim", opts = { input = {}, picker = {} } },
  },
  keys = {
    -- Core OpenCode commands under <leader>a* namespace
    {
      "<leader>ac",
      function()
        require("opencode").ask("@this: ", { submit = true })
      end,
      desc = "OpenCode: Ask about this",
      mode = { "n", "x" },
    },
    {
      "<leader>ap",
      function()
        require("opencode").select()
      end,
      desc = "OpenCode: Select prompt",
      mode = { "n", "x" },
    },
    {
      "<leader>a+",
      function()
        require("opencode").prompt("@this")
      end,
      desc = "OpenCode: Add this to context",
      mode = { "n", "x" },
    },
    {
      "<leader>aw",
      function()
        require("opencode").toggle()
      end,
      desc = "OpenCode: Toggle window",
    },
    {
      "<leader>am",
      function()
        require("opencode").command()
      end,
      desc = "OpenCode: Command menu",
    },

    -- Session management
    {
      "<leader>aN",
      function()
        require("opencode").command("session_new")
      end,
      desc = "OpenCode: New session",
    },
    {
      "<leader>aI",
      function()
        require("opencode").command("session_interrupt")
      end,
      desc = "OpenCode: Interrupt session",
    },

    -- Agent management
    {
      "<leader>aA",
      function()
        require("opencode").command("agent_cycle")
      end,
      desc = "OpenCode: Cycle agent",
    },

    -- Navigation in messages (optional - can use different keys if preferred)
    {
      "<S-C-u>",
      function()
        require("opencode").command("messages_half_page_up")
      end,
      desc = "OpenCode: Messages scroll up",
    },
    {
      "<S-C-d>",
      function()
        require("opencode").command("messages_half_page_down")
      end,
      desc = "OpenCode: Messages scroll down",
    },
  },
  config = function()
    -- Enable auto-reload for OpenCode file changes
    vim.opt.autoread = true

    -- Optional: OpenCode configuration
    vim.g.opencode_opts = {
      -- Your configuration here (see opencode.json docs)
      -- Example:
      -- auto_reload = true,
      -- embedded = {
      --   window = {
      --     width = 0.3,
      --   },
      -- },
    }

    vim.notify("OpenCode loaded. Ensure opencode CLI is running.", vim.log.levels.INFO)
  end,
}
