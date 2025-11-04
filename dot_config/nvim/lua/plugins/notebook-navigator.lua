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
      local nn = require("notebook-navigator")
      nn.setup({
        cell_markers = {
          "# COMMAND ----------",
          "# %%",
        },
        syntax_highlight = true,
        cell_highlight_group = "Folded",
        repl_provider = "auto",
        activate_hydra_keys = nil,
      })
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
      return nn.minihipatterns_spec
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
      return nn.miniai_spec
    end,
  },
}
