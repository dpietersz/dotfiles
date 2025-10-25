return {
  "folke/todo-comments.nvim",
  event = "VeryLazy",
  dependencies = { "nvim-lua/plenary.nvim" },
  opts = {
    signs = true,
    sign_priority = 8,

    keywords = {
      FIX = { icon = " ", color = "error", alt = { "FIXME", "BUG", "FIXIT", "ISSUE" } },
      TODO = { icon = " ", color = "info" },
      HACK = { icon = " ", color = "warning" },
      WARN = { icon = " ", color = "warning", alt = { "WARNING", "XXX" } },
      PERF = { icon = " ", alt = { "OPTIM", "PERFORMANCE", "OPTIMIZE" } },
      NOTE = { icon = " ", color = "hint", alt = { "INFO" } },
    },

    merge_keywords = true,

    highlight = {
      before = "",
      keyword = "wide",
      after = "fg",
      pattern = [[.*<(KEYWORDS)\s*:]],
      comments_only = true,
      max_line_len = 400,
      exclude = {},
    },

    colors = {
      error = { "DiagnosticError", "ErrorMsg", "#DC2626" },
      warning = { "DiagnosticWarn", "WarningMsg", "#FBBF24" },
      info = { "DiagnosticInfo", "#2563EB" },
      hint = { "DiagnosticHint", "#10B981" },
      default = { "Identifier", "#7C3AED" },
    },

    search = {
      command = "rg",
      args = {
        "--color=never",
        "--no-heading",
        "--with-filename",
        "--line-number",
        "--column",
      },
      pattern = [[\b(KEYWORDS):]], -- ripgrep regex
    },
  },

  keys = {
    -- View all TODOs in Snacks picker
    {
      "<leader>ft",
      function()
        local todo = require("todo-comments")
        local snacks = require("snacks.picker")

        local results =
          vim.fn.systemlist('rg --no-heading --with-filename --line-number --column "(TODO|FIX|HACK|WARN|NOTE):"')
        if vim.v.shell_error ~= 0 or #results == 0 then
          vim.notify("No TODO comments found in workspace", vim.log.levels.INFO)
          return
        end

        snacks.pick({
          title = "TODO Comments",
          items = results,
          format_item = function(line)
            return line
          end,
          action = function(selected)
            if not selected then
              return
            end
            local file, lnum, col = selected:match("([^:]+):(%d+):(%d+):")
            if file and lnum then
              vim.cmd("edit " .. file)
              vim.api.nvim_win_set_cursor(0, { tonumber(lnum), tonumber(col or 1) - 1 })
            end
          end,
        })
      end,
      desc = "Search TODOs (Snacks Picker)",
    },

    -- Jump between TODOs quickly
    {
      "]t",
      function()
        require("todo-comments").jump_next()
      end,
      desc = "Next TODO comment",
    },
    {
      "[t",
      function()
        require("todo-comments").jump_prev()
      end,
      desc = "Previous TODO comment",
    },
  },
}
