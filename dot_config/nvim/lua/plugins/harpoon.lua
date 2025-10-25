return {
  "ThePrimeagen/harpoon",
  branch = "harpoon2",
  dependencies = {
    "nvim-lua/plenary.nvim",
    "folke/snacks.nvim", -- Snacks picker dependency
  },
  keys = {
    -- Add file
    {
      "<leader>ha",
      function()
        require("harpoon"):list():add()
      end,
      desc = "Harpoon: Add file",
    },
    -- Toggle menu
    {
      "<leader>hh",
      function()
        require("harpoon").ui:toggle_quick_menu(require("harpoon"):list())
      end,
      desc = "Harpoon: Toggle menu",
    },
    -- Quick selects
    {
      "<leader>hs",
      function()
        require("harpoon"):list():select(1)
      end,
      desc = "Harpoon: Select 1",
    },
    {
      "<leader>hd",
      function()
        require("harpoon"):list():select(2)
      end,
      desc = "Harpoon: Select 2",
    },
    {
      "<leader>hf",
      function()
        require("harpoon"):list():select(3)
      end,
      desc = "Harpoon: Select 3",
    },
    {
      "<leader>hg",
      function()
        require("harpoon"):list():select(4)
      end,
      desc = "Harpoon: Select 4",
    },

    -- Previous/Next navigation
    {
      "<leader>hp",
      function()
        require("harpoon"):list():prev()
      end,
      desc = "Harpoon: Previous",
    },
    {
      "<leader>hn",
      function()
        require("harpoon"):list():next()
      end,
      desc = "Harpoon: Next",
    },

    -- Snacks picker integration
    {
      "<leader>fh",
      function()
        local harpoon = require("harpoon")
        local items = {}
        for _, item in ipairs(harpoon:list().items) do
          table.insert(items, item.value)
        end

        require("snacks.picker").pick({
          title = "Harpoon Files",
          items = items,
          format_item = function(item)
            return vim.fn.fnamemodify(item, ":~:.") -- relative path display
          end,
          action = function(selected)
            if not selected then
              return
            end
            vim.cmd("edit " .. vim.fn.fnameescape(selected))
          end,
        })
      end,
      desc = "Search Harpoon files (Snacks picker)",
    },
  },
  config = function()
    require("harpoon"):setup({})
  end,
}
