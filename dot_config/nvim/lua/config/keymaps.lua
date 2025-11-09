-- Keymaps are automatically loaded on the VeryLazy event
-- Default keymaps that are always set: https://github.com/LazyVim/LazyVim/blob/main/lua/lazyvim/config/keymaps.lua
-- Add any additional keymaps here

-- Y to EOL
vim.keymap.set("n", "Y", "y$", { desc = "Yank to end of line" })

-- Center screen when jumping
vim.keymap.set("n", "n", "nzzzv", { desc = "Next search result (centred)" })
vim.keymap.set("n", "N", "Nzzzv", { desc = "Previous search result (centred)" })
vim.keymap.set("n", "<C-d>", "<C-d>zz", { desc = "Half page down (centred)" })
vim.keymap.set("n", "<C-u>", "<C-u>zz", { desc = "Half page up (centred)" })

-- Buffer navigation
vim.keymap.set("n", "<S-l>", ":bnext<CR>", { desc = "Next buffer" })
vim.keymap.set("n", "<S-h>", ":bprevious<CR>", { desc = "Previous buffer" })
vim.keymap.set("n", "bl", ":bnext<CR>", { desc = "Next buffer" })
vim.keymap.set("n", "bh", ":bprevious<CR>", { desc = "Previous buffer" })
vim.keymap.set("n", "bdd", ":bdelete!<enter>", { desc = "Delete buffer" })
vim.keymap.set("n", "bf", vim.lsp.buf.format, { desc = "[f]ormat buffer" })
vim.keymap.set("n", "bo", "<cmd>only<CR>", { desc = "Only current buffer" })

-- Splitting & Resizing
vim.keymap.set("n", "<leader>sv", ":vsplit<CR>", { desc = "Split window vertically" })
vim.keymap.set("n", "<leader>sh", ":split<CR>", { desc = "Split window horizontally" })
vim.keymap.set("n", "<C-Up>", ":resize +2<CR>", { desc = "Increase window height" })
vim.keymap.set("n", "<C-Down>", ":resize -2<CR>", { desc = "Decrease window height" })
vim.keymap.set("n", "<C-Left>", ":vertical resize -2<CR>", { desc = "Decrease window width" })
vim.keymap.set("n", "<C-Right>", ":vertical resize +2<CR>", { desc = "Increase window width" })

-- Better window navigation
-- Ctrl+hjkl for seamless Tmux/Neovim navigation (handled by vim-tmux-navigator)
-- These are defined in the tmux-navigator.lua plugin file

-- Move lines up/down with Alt+j/k
vim.keymap.set("n", "<A-j>", ":m .+1<CR>==", { desc = "Move line down" })
vim.keymap.set("n", "<A-k>", ":m .-2<CR>==", { desc = "Move line up" })
vim.keymap.set("v", "<A-j>", ":m '>+1<CR>gv=gv", { desc = "Move selection down" })
vim.keymap.set("v", "<A-k>", ":m '<-2<CR>gv=gv", { desc = "Move selection up" })
vim.keymap.set("i", "<A-j>", "<Esc>:m .+1<CR>==gi", { desc = "Move line down" })
vim.keymap.set("i", "<A-k>", "<Esc>:m .-2<CR>==gi", { desc = "Move line up" })

-- Better indenting in visual mode
vim.keymap.set("v", "<", "<gv", { desc = "Indent left and reselect" })
vim.keymap.set("v", ">", ">gv", { desc = "Indent right and reselect" })

-- Quick config editing
vim.keymap.set("n", "<leader>rc", ":e ~/.config/nvim/init.lua<CR>", { desc = "Edit config" })

-- This is going to get me cancelled
vim.keymap.set("i", "jj", "<Esc>")

-- Start a search and replace command for the word under the cursor
vim.keymap.set(
  "n",
  "<leader>sr",
  [[:%s/\<<C-r><C-w>\>/<C-r><C-w>/gI<Left><Left><Left>]],
  { desc = "[S]earch & [R]eplace" }
)

-- disable annoying commandline type
vim.keymap.set("n", "q:", ":q")

-- Put cursor at and of selection after yank
vim.keymap.set("v", "y", "myy`y")

-- -- In visual mode, replace selected text with clipboard content without overwriting the clipboard
vim.keymap.set("x", "<leader>r", [["_dP]], { desc = "[R]eplace selected text with clipboard" })

-- Copy to system clipboard in normal and visual modes
vim.keymap.set({ "n", "v" }, "<leader>y", [["+y]], { desc = "Cop[Y] to system clipboard" })
vim.keymap.set("n", "<leader>Y", [["+Y]], { desc = "Cop[Y] to system clipboard" })

-- Delete to black hole register in
vim.keymap.set({ "v" }, "<leader>D", [["_D]], { desc = "[D]elete to black hole" })

-- paste selection without copying it
vim.keymap.set("v", "p", '"_dP')

-- Quick movements
vim.keymap.set({ "n", "o", "x" }, "<s-h>", "^")
vim.keymap.set({ "n", "o", "x" }, "<s-l>", "g_")

-- Easy insertian of trailing ; or , from insert mode
vim.keymap.set("i", ";;", "<Esc>A;")
vim.keymap.set("i", ",,", "<Esc>A,")

-- Clear highlights on search when pressing <Esc> in normal mode
--  See `:help hlsearch`
vim.keymap.set("n", "<Esc>", "<cmd>nohlsearch<CR>")

-- ============================================================================
-- Second Brain Keybindings
-- ============================================================================

-- Quick access to today's daily note
vim.keymap.set("n", "<leader>ndt", function()
  local date = os.date("%Y-%m-%d")
  local year = os.date("%Y")
  local month = os.date("%Y-%m")
  local file = string.format("%s/second-brain/daily/%s/%s/%s.md", os.getenv("HOME"), year, month, date)
  vim.cmd("edit " .. file)
end, { desc = "Today's daily note" })

-- Create new atomic note with template
vim.keymap.set("n", "<leader>nna", function()
  local note_name = vim.fn.input("Note name (kebab-case): ")
  if note_name ~= "" then
    local file = string.format("%s/second-brain/notes/%s.md", os.getenv("HOME"), note_name)
    vim.cmd("edit " .. file)
    -- Insert template if file is new/empty
    if vim.fn.filereadable(file) == 0 or vim.fn.getfsize(file) == 0 then
      local date = os.date("%Y-%m-%d")
      local template = {
        "---",
        "title: " .. note_name:gsub("-", " "):gsub("^%l", string.upper),
        "created: " .. date,
        "updated: " .. date,
        "tags: #",
        "status: seedling",
        "confidence: medium",
        "---",
        "",
        "# " .. note_name:gsub("-", " "):gsub("^%l", string.upper),
        "",
        "## Core Concept",
        "",
        "",
        "",
        "## Details",
        "",
        "",
        "",
        "## Related Concepts",
        "",
        "",
        "",
        "## Sources",
        "",
        "- Daily note: [[daily/" .. os.date("%Y/%Y-%m/%Y-%m-%d") .. "]]",
        "",
        "## Questions / TODOs",
        "",
        "- [ ] ",
      }
      vim.api.nvim_buf_set_lines(0, 0, -1, false, template)
      vim.cmd("normal! 5G$")
    end
  end
end, { desc = "New atomic note" })

-- Create new project note
vim.keymap.set("n", "<leader>nnp", function()
  local project_name = vim.fn.input("Project name (kebab-case): ")
  if project_name ~= "" then
    local file = string.format("%s/second-brain/projects/%s.md", os.getenv("HOME"), project_name)
    vim.cmd("edit " .. file)
  end
end, { desc = "New project note" })

-- Search Second Brain notes (via Telescope)
vim.keymap.set("n", "<leader>nf", function()
  require("telescope.builtin").find_files({
    prompt_title = "Second Brain",
    cwd = os.getenv("HOME") .. "/second-brain",
  })
end, { desc = "Find in Second Brain" })

-- Grep Second Brain content
vim.keymap.set("n", "<leader>ng", function()
  require("telescope.builtin").live_grep({
    prompt_title = "Search Second Brain",
    cwd = os.getenv("HOME") .. "/second-brain",
  })
end, { desc = "Grep Second Brain" })

-- Jump to note under cursor (follow wikilink)
vim.keymap.set("n", "<leader>nl", function()
  local line = vim.api.nvim_get_current_line()
  local col = vim.api.nvim_win_get_cursor(0)[2]

  -- Find wikilink pattern [[note-name]]
  local link_start = line:sub(1, col):reverse():find("%]%]")
  local link_end = line:sub(col + 1):find("%[%[")

  if link_start and link_end then
    link_start = col - link_start + 3
    link_end = col + link_end - 2
    local link = line:sub(link_start, link_end)

    -- Handle daily note links like [[daily/2025/2025-11/2025-11-08]]
    local file
    if link:match("^daily/") then
      file = string.format("%s/second-brain/%s.md", os.getenv("HOME"), link)
    else
      file = string.format("%s/second-brain/notes/%s.md", os.getenv("HOME"), link)
    end

    vim.cmd("edit " .. file)
  else
    print("No wikilink under cursor")
  end
end, { desc = "Follow wikilink" })

-- Browse Second Brain with oil.nvim
vim.keymap.set("n", "<leader>nb", function()
  vim.cmd("edit " .. os.getenv("HOME") .. "/second-brain")
end, { desc = "Browse Second Brain" })

-- Quick access to weekly review
vim.keymap.set("n", "<leader>nrw", function()
  local year = os.date("%Y")
  local week = os.date("%V")
  local file = string.format("%s/second-brain/reviews/weekly/%s-W%s.md", os.getenv("HOME"), year, week)
  vim.cmd("edit " .. file)
end, { desc = "This week's review" })

-- Quick access to monthly review
vim.keymap.set("n", "<leader>nrm", function()
  local year_month = os.date("%Y-%m")
  local file = string.format("%s/second-brain/reviews/monthly/%s.md", os.getenv("HOME"), year_month)
  vim.cmd("edit " .. file)
end, { desc = "This month's review" })
