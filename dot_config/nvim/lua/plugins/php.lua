return {
  -- Blade syntax highlighting (Tree-sitter)
  -- TODO: Install php actor in dotfiles
  -- cd ~/.local/share/nvim/lazy/phpactor
  -- composer install --no-dev --optimize-autoloader

  {
    "EmranMR/tree-sitter-blade",
    dependencies = { "nvim-treesitter/nvim-treesitter" },
    ft = "blade",
    build = function()
      vim.cmd("TSInstall blade")
    end,
    config = function()
      vim.treesitter.language.register("blade", "blade")
      vim.filetype.add({
        pattern = { [".*%.blade%.php"] = "blade" },
      })
    end,
  },

  -- Blade navigation (jump between views/components)
  {
    "ricardoramirezr/blade-nav.nvim",
    dependencies = { "hrsh7th/nvim-cmp" },
    ft = { "blade", "php" },
    opts = {
      close_tag_on_complete = true,
    },
  },

  -- Laravel.nvim - Main Laravel support (Snacks picker integration)
  {
    "adalessa/laravel.nvim",
    dependencies = {
      "folke/snacks.nvim",
      "tpope/vim-dotenv",
      "MunifTanjim/nui.nvim",
      "nvim-neotest/nvim-nio",
    },
    cmd = { "Laravel", "Sail", "Artisan", "Composer", "Npm", "Yarn" },
    keys = {
      { "<leader>la", ":Laravel artisan<cr>", desc = "Laravel: Artisan" },
      { "<leader>lr", ":Laravel routes<cr>", desc = "Laravel: Routes" },
      { "<leader>lm", ":Laravel related<cr>", desc = "Laravel: Related files" },
    },
    event = { "BufReadPre *.php", "BufReadPre *.blade.php" },
    opts = {
      lsp_server = "intelephense",
      features = { null_ls = { enable = false } },
    },
    config = function(_, opts)
      require("laravel").setup(opts)

      -- Snacks Picker integration (replaces Telescope)
      local snacks = require("snacks.picker")

      local function pick_routes()
        local routes = vim.fn.systemlist("php artisan route:list --columns=method,uri,name,action")
        if vim.v.shell_error ~= 0 or not routes or #routes == 0 then
          vim.notify("Failed to load routes from Artisan.", vim.log.levels.ERROR)
          return
        end
        table.remove(routes, 1) -- Remove header

        snacks.pick({
          title = "Laravel Routes",
          items = routes,
          format_item = function(line)
            return line:gsub("%s+", " "):gsub("|", "│")
          end,
          action = function(selected)
            if not selected then
              return
            end
            vim.fn.setreg("+", selected)
            vim.notify("Copied route to clipboard:\n" .. selected)
          end,
        })
      end

      local function pick_related()
        local cwd = vim.fn.getcwd()
        local found = vim.fn.systemlist("find " .. cwd .. " -type f -iname '*.php'")
        snacks.pick({
          title = "Laravel Related Files",
          items = found,
          format_item = function(f)
            return vim.fn.fnamemodify(f, ":~:.")
          end,
          action = function(f)
            if not f then
              return
            end
            vim.cmd("edit " .. f)
          end,
        })
      end

      local function pick_artisan()
        local cmd_list = {
          "route:list",
          "migrate",
          "db:seed",
          "make:model",
          "make:controller",
          "make:request",
          "optimize:clear",
          "config:cache",
          "tinker",
        }
        snacks.pick({
          title = "Laravel Artisan Commands",
          items = cmd_list,
          action = function(choice)
            if not choice then
              return
            end
            vim.cmd("!php artisan " .. choice)
            vim.notify("Ran: php artisan " .. choice)
          end,
        })
      end

      -- Override Laravel.nvim's Telescope commands
      vim.api.nvim_create_user_command("LaravelRoutes", pick_routes, {})
      vim.api.nvim_create_user_command("LaravelRelated", pick_related, {})
      vim.api.nvim_create_user_command("LaravelArtisan", pick_artisan, {})
    end,
  },

  -- PHPActor - Refactoring & context actions
  {
    "phpactor/phpactor",
    ft = "php",
    build = "composer install --no-dev --optimize-autoloader",
    keys = {
      { "<leader>lp", "<cmd>PhpactorContextMenu<cr>", desc = "PHPActor: Context menu", ft = "php" },
      { "<leader>ln", "<cmd>PhpactorClassNew<cr>", desc = "PHPActor: New class", ft = "php" },
    },
  },

  -- vim-projectionist - Laravel file navigation patterns
  {
    "tpope/vim-projectionist",
    dependencies = { "tpope/vim-dispatch" },
    ft = { "php", "blade" },
    config = function()
      vim.g.projectionist_ask = "builtin"

      vim.g.projectionist_heuristics = {
        artisan = {
          ["*"] = {
            start = "php artisan serve",
            console = "php artisan tinker",
          },
          ["app/*.php"] = {
            type = "source",
            alternate = {
              "tests/Unit/{}Test.php",
              "tests/Feature/{}Test.php",
            },
          },
          ["tests/Feature/*Test.php"] = {
            type = "test",
            alternate = "app/{}.php",
          },
          ["tests/Unit/*Test.php"] = {
            type = "test",
            alternate = "app/{}.php",
          },
          ["app/Models/*.php"] = {
            type = "model",
          },
          ["app/Http/Controllers/*.php"] = {
            type = "controller",
          },
          ["routes/*.php"] = {
            type = "route",
          },
          ["database/migrations/*.php"] = {
            type = "migration",
          },
        },
      }
    end,
  },
}
