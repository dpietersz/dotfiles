return {
  "MeanderingProgrammer/markdown.nvim",
  name = "render-markdown", -- Only needed if you have another plugin named markdown.nvim
  dependencies = { "nvim-treesitter/nvim-treesitter", "nvim-mini/mini.nvim" }, -- if you use the mini.nvim suite
  -- dependencies = { "nvim-treesitter/nvim-treesitter", "nvim-tree/nvim-web-devicons" }, -- if you prefer nvim-web-devicons
  config = function()
    require("render-markdown").setup({
      file_types = { "markdown", "codecompanion", "Avante" }, -- Added for codecompanion and Avante chat
      latex = {
        enabled = false,
        command = "pandoc",
      },
    })
  end,
}
