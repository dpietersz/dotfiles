return {
  -- Override nvim-cmp keybindings
  -- Use Ctrl+Y (C-y) to accept completions instead of Enter
  -- This keeps Enter free for normal newline insertion
  {
    "hrsh7th/nvim-cmp",
    ---@param opts cmp.ConfigSchema
    opts = function(_, opts)
      local cmp = require("cmp")

      -- Override the default keymaps
      opts.mapping = cmp.mapping.preset.insert({
        ["<C-b>"] = cmp.mapping.scroll_docs(-4),
        ["<C-f>"] = cmp.mapping.scroll_docs(4),
        ["<C-Space>"] = cmp.mapping.complete(),
        ["<C-e>"] = cmp.mapping.abort(),
        -- Use Ctrl+Y to accept completion instead of Enter
        ["<C-y>"] = cmp.mapping.confirm({ select = true }),
        -- Keep Enter free for normal newline insertion
        -- (it will not be mapped to accept completion)
      })

      return opts
    end,
  },
}
