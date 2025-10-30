return {
  "nvim-mini/mini.files",
  version = false,
  dependencies = {
    { "nvim-mini/mini.icons", opts = {} },
  },
  keys = {
    {
      "<C-b>",
      function()
        require("mini.files").toggle()
      end,
      desc = "Toggle mini file explorer",
    },
    {
      "<leader>ef",
      function()
        require("mini.files").open(vim.api.nvim_buf_get_name(0), false)
        require("mini.files").reveal_cwd()
      end,
      desc = "Toggle into currently opened file",
    },
  },
  opts = {
    -- Customization, see `:h mini.files-customization`
    content = {
      filter = nil,
      sort = nil,
    },
    mappings = {
      close = "q",
      go_in = "L",
      go_in_plus = "l",
      go_out = "H",
      go_out_plus = "h",
      reset = "=",
      reveal_cwd = "@",
      show_help = "g?",
      synchronize = "=",
      trim_left = "<",
      trim_right = ">",
    },
    options = {
      -- Whether to delete permanently or move to trash
      permanent_delete = false,
      -- Whether to use for editing directories to mimic `vim.fn.browse()`
      use_as_default_explorer = false,
    },
    windows = {
      max_number = math.huge,
      preview = true,
      width_focus = 50,
      width_nofocus = 15,
      width_preview = 25,
    },
  },
}
