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
-- Ctrl+hjkl for within-Neovim navigation (always available)
vim.keymap.set("n", "<C-h>", "<C-w>h", { desc = "Move to left window" })
vim.keymap.set("n", "<C-j>", "<C-w>j", { desc = "Move to bottom window" })
vim.keymap.set("n", "<C-k>", "<C-w>k", { desc = "Move to top window" })
vim.keymap.set("n", "<C-l>", "<C-w>l", { desc = "Move to right window" })

-- Alt+hjkl for seamless Zellij/Neovim navigation (handled by zellij-nav.nvim when in Zellij)

-- Move lines up/down (Alt+Up/Down to avoid conflict with Alt+hjkl navigation)
vim.keymap.set("n", "<A-Down>", ":m .+1<CR>==", { desc = "Move line down" })
vim.keymap.set("n", "<A-Up>", ":m .-2<CR>==", { desc = "Move line up" })
vim.keymap.set("v", "<A-Down>", ":m '>+1<CR>gv=gv", { desc = "Move selection down" })
vim.keymap.set("v", "<A-Up>", ":m '<-2<CR>gv=gv", { desc = "Move selection up" })
vim.keymap.set("i", "<A-Down>", "<Esc>:m .+1<CR>==gi", { desc = "Move line down" })
vim.keymap.set("i", "<A-Up>", "<Esc>:m .-2<CR>==gi", { desc = "Move line up" })

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
