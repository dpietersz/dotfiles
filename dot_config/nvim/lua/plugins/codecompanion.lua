return {
  "olimorris/codecompanion.nvim",
  event = "VeryLazy",
  dependencies = {
    "nvim-lua/plenary.nvim",
    "nvim-treesitter/nvim-treesitter",
    "ravitemer/mcphub.nvim", -- MCPHub integration
    "echasnovski/mini.diff",
    "HakonHarnes/img-clip.nvim",
    "j-hui/fidget.nvim",
  },
  opts = {
    strategies = {
      chat = { adapter = "gemini" },
      inline = { adapter = "anthropic" },
      cmd = { adapter = "gemini" },
    },
    display = {
      diff = {
        enabled = true,
        provider = "mini_diff",
      },
      action_palette = {
        width = 95,
        height = 10,
        prompt = "Prompt ",
        provider = "snacks",
        opts = {
          show_default_actions = true,
          show_default_prompt_library = true,
        },
      },
    },
    adapters = {
      openai = function()
        return require("codecompanion.adapters").extend("openai", {
          schema = {
            model = { default = "gpt-4" },
          },
        })
      end,
      gemini = function()
        return require("codecompanion.adapters").extend("gemini", {
          schema = {
            model = { default = "gemini-2.0-flash" },
          },
        })
      end,
      opts = {
        show_defaults = true,
        show_model_choices = true,
      },
    },
  },
  config = function(_, opts)
    require("codecompanion").setup(vim.tbl_deep_extend("force", {
      extensions = {
        mcphub = {
          callback = "mcphub.extensions.codecompanion",
          opts = {
            auto_approve = true,
            make_vars = true,
            make_slash_commands = true,
            show_result_in_chat = true,
          },
        },
      },
    }, opts))
  end,
  keys = {
    -- CodeCompanion under <leader>ac* (no conflicts with OpenCode)
    { "<leader>acc", "<cmd>CodeCompanionChat Toggle<cr>", desc = "CodeCompanion: Toggle chat", mode = { "n", "v" } },
    { "<leader>acn", "<cmd>CodeCompanionChat<cr>", desc = "CodeCompanion: New chat", mode = { "n", "v" } },
    { "<leader>aca", "<cmd>CodeCompanionActions<cr>", desc = "CodeCompanion: Actions", mode = { "n", "v" } },
    { "<leader>aci", "<cmd>CodeCompanion<cr>", desc = "CodeCompanion: Inline", mode = { "n", "v" } },
  },
}
