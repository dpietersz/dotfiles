return {
  "stevearc/oil.nvim",
  ---@module 'oil'
  ---@type oil.SetupOpts
  lazy = false, -- MUST be false for directory buffer hijacking
  dependencies = {
    { "nvim-mini/mini.icons", opts = {} },
  },
  keys = {
    -- Open parent directory in current window
    { "-", "<cmd>Oil<cr>", desc = "Oil: Open parent directory" },
    -- Optional: Open Oil in floating window
    -- { '<leader>-', function() require('oil').toggle_float() end, desc = 'Oil: Toggle float' },
  },
  opts = {
    default_file_explorer = true,
    columns = { "icon" },
    buf_options = {
      buflisted = false,
      bufhidden = "hide",
    },
    win_options = {
      wrap = false,
      signcolumn = "no",
      cursorcolumn = false,
      foldcolumn = "0",
      spell = false,
      list = false,
      conceallevel = 3,
      concealcursor = "nvic",
    },
    delete_to_trash = false,
    skip_confirm_for_simple_edits = false,
    prompt_save_on_select_new_entry = true,
    cleanup_delay_ms = 2000,
    lsp_file_methods = {
      enabled = true,
      timeout_ms = 1000,
      autosave_changes = false,
    },
    constrain_cursor = "editable",
    watch_for_changes = false,
    keymaps = {
      ["g?"] = { "actions.show_help", mode = "n" },
      ["<CR>"] = "actions.select",
      ["<C-s>"] = { "actions.select", opts = { vertical = true } },
      ["<C-h>"] = { "actions.select", opts = { horizontal = true } },
      ["<C-t>"] = { "actions.select", opts = { tab = true } },
      ["<C-p>"] = "actions.preview",
      ["<C-c>"] = { "actions.close", mode = "n" },
      ["<C-l>"] = "actions.refresh",
      ["-"] = { "actions.parent", mode = "n" },
      ["_"] = { "actions.open_cwd", mode = "n" },
      ["`"] = { "actions.cd", mode = "n" },
      ["~"] = { "actions.cd", opts = { scope = "tab" }, mode = "n" },
      ["gs"] = { "actions.change_sort", mode = "n" },
      ["gx"] = "actions.open_external",
      ["g."] = { "actions.toggle_hidden", mode = "n" },
      ["g\\"] = { "actions.toggle_trash", mode = "n" },
    },
    use_default_keymaps = true,
    view_options = {
      show_hidden = false,
      is_hidden_file = function(name, bufnr)
        return name:match("^%.") ~= nil
      end,
      is_always_hidden = function(name, bufnr)
        return false
      end,
      natural_order = "fast",
      case_insensitive = false,
      sort = {
        { "type", "asc" },
        { "name", "asc" },
      },
    },
    float = {
      padding = 2,
      max_width = 0,
      max_height = 0,
      border = "rounded",
      win_options = { winblend = 0 },
    },
    preview_win = {
      update_on_cursor_moved = true,
      preview_method = "fast_scratch",
      disable_preview = function(filename)
        return false
      end,
    },
    confirmation = {
      max_width = 0.9,
      min_width = { 40, 0.4 },
      max_height = 0.9,
      min_height = { 5, 0.1 },
      border = "rounded",
      win_options = { winblend = 0 },
    },
    progress = {
      max_width = 0.9,
      min_width = { 40, 0.4 },
      max_height = { 10, 0.9 },
      min_height = { 5, 0.1 },
      border = "rounded",
      minimized_border = "none",
      win_options = { winblend = 0 },
    },
    ssh = { border = "rounded" },
    keymaps_help = { border = "rounded" },
  },
}
