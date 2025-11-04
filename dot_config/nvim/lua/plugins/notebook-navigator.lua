return {
  -- NotebookNavigator.nvim with integrated mini.hipatterns and mini.ai support
  {
    "GCBallesteros/NotebookNavigator.nvim",
    dependencies = {
      "nvim-mini/mini.hipatterns",
      "nvim-mini/mini.ai",
    },
    event = "VeryLazy",
    ft = { "python", "jupyter" },
    keys = {
      {
        "]h",
        function()
          require("notebook-navigator").move_cell("d")
        end,
        desc = "Next cell",
        ft = { "python", "jupyter" },
      },
      {
        "[h",
        function()
          require("notebook-navigator").move_cell("u")
        end,
        desc = "Previous cell",
        ft = { "python", "jupyter" },
      },
    },
    config = function()
      -- Suppress NotebookNavigator REPL warning by redirecting vim.notify
      local original_notify = vim.notify
      vim.notify = function(msg, level, opts)
        if msg:find("No supported REPLs available") then
          return
        end
        return original_notify(msg, level, opts)
      end

      local nn = require("notebook-navigator")
      nn.setup({
        cell_markers = {
          python = "# COMMAND ----------",
        },
        syntax_highlight = true,
        cell_highlight_group = "Folded",
        repl_provider = "none",
        activate_hydra_keys = nil,
      })

      -- Restore original vim.notify
      vim.notify = original_notify
    end,
  },

  -- mini.hipatterns integration with NotebookNavigator
  {
    "nvim-mini/mini.hipatterns",
    event = "VeryLazy",
    dependencies = {
      "GCBallesteros/NotebookNavigator.nvim",
    },
    opts = function()
      local nn = require("notebook-navigator")
      return {
        highlighters = {
          cells = nn.minihipatterns_spec,
        },
      }
    end,
  },

  -- mini.ai integration with NotebookNavigator for cell textobjects
  {
    "nvim-mini/mini.ai",
    event = "VeryLazy",
    dependencies = {
      "GCBallesteros/NotebookNavigator.nvim",
    },
    opts = function()
      local nn = require("notebook-navigator")
      return nn.miniai_spec()
    end,
  },
}
