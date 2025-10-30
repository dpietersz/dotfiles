return {
  "ravitemer/mcphub.nvim",
  cmd = "MCPHub",
  dependencies = {
    "nvim-lua/plenary.nvim",
  },
  build = function()
    -- mcp-hub is installed via mise for persistence on immutable systems (Bluefin, etc.)
    -- Try multiple methods to find mcp-hub since Neovim's subprocess may not have full PATH
    local function find_mcp_hub()
      -- Method 1: Check if mcp-hub is in PATH
      local path_check = vim.fn.system("command -v mcp-hub 2>/dev/null")
      if vim.v.shell_error == 0 then
        return true
      end

      -- Method 2: Check mise installation directly
      local home = vim.fn.expand("~")
      local mise_path = home .. "/.local/share/mise/installs/node/*/bin/mcp-hub"
      local mise_check = vim.fn.glob(mise_path)
      if mise_check ~= "" then
        return true
      end

      -- Method 3: Check npm global bin
      local npm_path = home .. "/.local/share/npm/bin/mcp-hub"
      local npm_check = vim.fn.filereadable(npm_path)
      if npm_check == 1 then
        return true
      end

      return false
    end

    if not find_mcp_hub() then
      vim.notify(
        "mcp-hub not found. Please run:\n  chezmoi apply\n\n"
          .. "This will install mcp-hub via mise for persistence on immutable systems.",
        vim.log.levels.WARN
      )
    end
  end,
  config = function()
    require("mcphub").setup({
      port = 3000,
      config = vim.fn.expand("~/.config/nvim/mcpservers.json"),
      extensions = {
        codecompanion = {
          enabled = true,
          make_vars = true,
          make_slash_commands = true,
          show_result_in_chat = true,
        },
      },
      on_error = function(err)
        vim.notify("MCPHub error: " .. tostring(err), vim.log.levels.ERROR)
      end,
    })

    -- Native Resources & Tools
    local mcphub_api = require("mcphub")
    if not mcphub_api or not mcphub_api.add_resource then
      vim.notify("MCPHub API not available", vim.log.levels.WARN)
      return
    end

    -- 1. LSP Diagnostics Resource
    mcphub_api.add_resource("neovim", {
      name = "Diagnostics: Current File",
      description = "Get LSP diagnostics for the current file.",
      uri = "neovim://diagnostics/current",
      mimeType = "text/plain",
      handler = function(req, res)
        local buf_info = req.editor_info.last_active
        if not buf_info or buf_info.bufnr == 0 then
          return res:error("No active buffer")
        end

        local diagnostics = vim.diagnostic.get(buf_info.bufnr)
        local filename = buf_info.filename or "[No Name]"
        local text = string.format("LSP Diagnostics for: %s\n%s\n", filename, string.rep("-", 40 + #filename))

        if #diagnostics == 0 then
          text = text .. "No diagnostics found.\n"
        else
          for _, diag in ipairs(diagnostics) do
            local severity = vim.diagnostic.severity[diag.severity] or "Unknown"
            text = text
              .. string.format(
                "\n[%s] Line %d: %s\n  Source: %s\n",
                severity,
                diag.lnum + 1,
                diag.message,
                diag.source or "N/A"
              )
          end
        end
        return res:text(text):send()
      end,
    })

    -- 2. Workspace TODO Comments Resource
    local has_todo_comments, todo_config = pcall(function()
      if package.loaded["todo-comments"] and package.loaded["todo-comments"].config then
        return package.loaded["todo-comments"].config.options
      end
      return nil
    end)

    if has_todo_comments and todo_config then
      mcphub_api.add_resource("neovim", {
        name = "Workspace TODO Comments",
        description = "Get all TODO comments from the workspace.",
        uri = "neovim://todos/workspace",
        mimeType = "text/plain",
        handler = function(req, res)
          local keywords = todo_config.keywords or {}
          local search_opts = todo_config.search or {}

          if not search_opts.command or not search_opts.args then
            return res:error("todo-comments.nvim search config missing")
          end

          -- Build keyword regex
          local terms = {}
          for main_kw, kw_cfg in pairs(keywords) do
            table.insert(terms, main_kw)
            if kw_cfg.alt then
              for _, alt in ipairs(kw_cfg.alt) do
                table.insert(terms, alt)
              end
            end
          end

          local pattern = string.gsub(search_opts.pattern or "(KEYWORDS)", "%(KEYWORDS%)", table.concat(terms, "|"))

          -- Build ripgrep command
          local cmd_parts = { search_opts.command }
          vim.list_extend(cmd_parts, search_opts.args)
          vim.list_extend(cmd_parts, {
            "--iglob=!**/.git/**",
            "--iglob=!**/node_modules/**",
            "--iglob=!**/.next/**",
            "--iglob=!**/dist/**",
            "--iglob=!**/build/**",
            "-e",
            "'" .. pattern .. "'",
            vim.fn.getcwd(),
          })

          local results = vim.fn.systemlist(table.concat(cmd_parts, " "))

          if vim.v.shell_error ~= 0 or #results == 0 then
            return res:text("No TODO comments found in workspace."):send()
          end

          local text = "Workspace TODO Comments:\n" .. string.rep("-", 70) .. "\n" .. table.concat(results, "\n")
          return res:text(text):send()
        end,
      })
    end

    -- Git helpers
    local function get_git_root()
      local root = vim.fn.systemlist("git rev-parse --show-toplevel")[1]
      if vim.v.shell_error ~= 0 then
        return nil
      end
      return vim.fn.trim(root)
    end

    local function get_git_commits(root, count)
      local cmd = string.format("git -C %s log -n %d --oneline", vim.fn.shellescape(root), count)
      local commits = vim.fn.systemlist(cmd)
      if vim.v.shell_error ~= 0 then
        return { success = false, error = "Failed to get commits" }
      end
      if #commits == 0 then
        return { success = true, text = "No commits found." }
      end
      return {
        success = true,
        text = string.format(
          "Recent Commits (last %d):\n%s\n%s",
          count,
          string.rep("-", 50),
          table.concat(commits, "\n")
        ),
      }
    end

    -- 3. Git Repository Status Resource
    mcphub_api.add_resource("neovim", {
      name = "Git Repository Status",
      description = "Current Git branch and status.",
      uri = "neovim://git/status",
      mimeType = "text/plain",
      handler = function(req, res)
        local root = get_git_root()
        if not root then
          return res:text("Not in a Git repository."):send()
        end

        local branch = vim.fn.systemlist("git branch --show-current")[1] or "(unknown)"
        local status = vim.fn.systemlist("git status --porcelain")
        local remote = vim.fn.systemlist("git remote get-url origin")[1] or "(no remote)"

        local text = string.format(
          "Git Repository Status:\n  Path: %s\n  Remote: %s\n  Branch: %s\n%s\n",
          root,
          remote,
          branch,
          string.rep("-", 30)
        )

        if #status == 0 then
          text = text .. "Working tree clean."
        else
          text = text .. "Changes:\n" .. table.concat(status, "\n")
        end
        return res:text(text):send()
      end,
    })

    -- 4. Recent Git Commits Resource (Default: 5)
    mcphub_api.add_resource("neovim", {
      name = "Recent Git Commits",
      description = "Last 5 commits from the repository.",
      uri = "neovim://git/recent_commits",
      mimeType = "text/plain",
      handler = function(req, res)
        local root = get_git_root()
        if not root then
          return res:error("Not in a Git repository.")
        end
        local result = get_git_commits(root, 5)
        if result.success then
          return res:text(result.text):send()
        else
          return res:error(result.error)
        end
      end,
    })

    -- 5. Recent Git Commits Resource Template (Variable Count)
    mcphub_api.add_resource_template("neovim", {
      name = "Recent Git Commits by Count",
      description = "Get N recent commits. Usage: neovim://git/recent_commits/count/{N}",
      uriTemplate = "neovim://git/recent_commits/count/{commit_count}",
      mimeType = "text/plain",
      handler = function(req, res)
        local root = get_git_root()
        if not root then
          return res:error("Not in a Git repository.")
        end

        local count = tonumber(req.params.commit_count)
        if not count or count <= 0 or count >= 100 then
          return res:error("commit_count must be between 1 and 99.")
        end

        local result = get_git_commits(root, count)
        if result.success then
          return res:text(result.text):send()
        else
          return res:error(result.error)
        end
      end,
    })

    -- 6. Tool: Prepare Conventional Commit Context
    mcphub_api.add_tool("neovim", {
      name = "prepare_conventional_commit_context",
      description = "Stages all changes and provides context for generating conventional commit messages.",
      inputSchema = {
        type = "object",
        properties = {},
      },
      handler = function(req, res)
        local root = get_git_root()
        if not root then
          return res:error("Not in a Git repository.")
        end

        -- Stage all changes
        vim.fn.system("git -C " .. vim.fn.shellescape(root) .. " add .")

        -- Get staged diff
        local diff = vim.fn.systemlist("git -C " .. vim.fn.shellescape(root) .. " diff --staged")
        local diff_text = #diff > 0 and table.concat(diff, "\n") or "No staged changes."

        -- Get recent commits
        local commits_result = get_git_commits(root, 5)
        local commits_text = commits_result.success and commits_result.text or "Could not fetch commits."

        local context = string.format(
          "GIT CONTEXT FOR CONVENTIONAL COMMIT (Repo: %s):\n\n"
            .. "STAGED DIFF:\n%s\n%s\n\n"
            .. "RECENT COMMITS:\n%s\n%s\n",
          root,
          string.rep("=", 50),
          diff_text,
          string.rep("=", 50),
          commits_text
        )
        return res:text(context):send()
      end,
    })

    -- 7. Tool: Search Neovim Help
    mcphub_api.add_tool("neovim", {
      name = "search_neovim_help",
      description = "Search Neovim help pages and return content.",
      inputSchema = {
        type = "object",
        properties = {
          query = {
            type = "string",
            description = 'Help tag to search (e.g., "options", "lua-guide")',
          },
        },
        required = { "query" },
      },
      handler = function(req, res)
        local query = req.params.query
        if not query or vim.fn.trim(query) == "" then
          return res:error("Query cannot be empty.")
        end

        local success, content = pcall(function()
          local orig_tab = vim.api.nvim_get_current_tabpage()
          local orig_win = vim.api.nvim_get_current_win()

          vim.cmd("tabnew")
          local help_tab = vim.api.nvim_get_current_tabpage()

          local help_success = pcall(vim.cmd, "help " .. query)
          if not help_success then
            vim.cmd("tabclose")
            if vim.api.nvim_tabpage_is_valid(orig_tab) then
              vim.api.nvim_set_current_tabpage(orig_tab)
              if vim.api.nvim_win_is_valid(orig_win) then
                vim.api.nvim_set_current_win(orig_win)
              end
            end
            error("Help tag not found: " .. query)
          end

          local lines = vim.api.nvim_buf_get_lines(0, 0, -1, false)
          vim.cmd("tabclose")

          if vim.api.nvim_tabpage_is_valid(orig_tab) then
            vim.api.nvim_set_current_tabpage(orig_tab)
            if vim.api.nvim_win_is_valid(orig_win) then
              vim.api.nvim_set_current_win(orig_win)
            end
          end

          return table.concat(lines, "\n")
        end)

        if success and content and #content > 0 then
          return res:text(content):send()
        else
          return res:error("No help content found for: " .. query)
        end
      end,
    })
  end,
}
