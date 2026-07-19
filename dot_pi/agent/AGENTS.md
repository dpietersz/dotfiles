# Pi Agent Configuration — Subagents, traits, tools, and skills for the pi coding agent

## Architecture

Chezmoi deploys this directory to `~/.pi/agent/`. The minion-subagents extension provides trait-composed subagent execution: agent context (markdown `.md`) + behavioral traits (`traits.yaml`) + template (`agent-template.hbs`) are composed at runtime into a system prompt. Each subagent runs in an isolated context window and returns compressed findings. Custom tools (pm-tool, docsfetch, fabric, webfetch) extend the agent's capabilities.

## Repository Structure

```
agents/                     # 11 subagent definitions (markdown frontmatter)
extensions/
├── auth-sync/              # OAuth token sync across machines via daemon
├── caveman-mode.ts         # Always-on full Caveman response compression
├── context-window.ts       # /ctx command — visual context usage overlay
├── minion-subagents/       # Subagent framework (execution, chains, traits, TUI)
├── ref-docs.ts             # Injects cached doc indexes into system prompt
├── todo.ts                 # Session-scoped todo tool + /todos UI for multi-step work
└── tools/                  # Custom tools (auto-discovered by index.ts)
skills/                     # 9 skills loaded on-demand via progressive disclosure
standards/                  # Code quality and security rules
themes/                     # Managed custom themes (Gruvbox Dark)
settings.json               # Starter/reference preferences; runtime file is merge-managed
traits.yaml                 # Behavioral trait definitions (expertise, personality, approach)
```

## Key Files

- `settings.json` — Starter/reference provider/model (`openai-codex` / `gpt-5.5`), theme (`gruvbox-dark`), thinking level (`high`), installed packages
- `themes/gruvbox-dark.json` — Managed Pi Gruvbox theme; deployed to `~/.pi/agent/themes/`
- `.chezmoiscripts/run_onchange_after_02e-configure-pi-theme.sh.tmpl` — Atomically merges the selected theme into Pi's mutable runtime settings
- `traits.yaml` — Three trait dimensions (expertise, personality, approach) + presets (security-auditor, careful-implementer, deep-researcher, etc.)
- `agents/agent-template.hbs` — Handlebars template composing agent context + traits into system prompt
- `extensions/caveman-mode.ts` — Injects always-on Caveman full-mode brevity rules into the system prompt
- `extensions/minion-subagents/index.ts` — Main extension: `subagent` tool, `/agents`, `/chain`, `/run` commands
- `extensions/minion-subagents/compose-traits.ts` — Trait resolution and system prompt composition
- `extensions/tools/index.ts` — Auto-discovers `.ts` tool modules in the tools directory
- `extensions/tools/playwright.ts` — Compact browser automation via managed Playwright distrobox; use for frontend verification, screenshots, responsive checks, and bounded E2E flows without MCP tool bloat
- `extensions/tools/pm-tool.ts` — Linear project management (requires `LINEAR_ACCESS_TOKEN`)
- `extensions/todo.ts` — Todo tracking for 2+ step work; use before acting on multi-step requests
- `standards/code-quality.md` — Code quality rules injected via load-context

## Subagent Model Mapping

| Agent | Model | Thinking | Purpose |
|-------|-------|----------|---------|
| scout | google/gemini-3.5-flash | — | Fast codebase recon |
| eagle-scout | opencode-go/kimi-k2.6 | medium | Deep multi-file research |
| planner | openai-codex/gpt-5.5 | high | Implementation planning |
| engineer | opencode-go/kimi-k2.6 | medium | General implementation |
| lead-engineer | opencode/claude-opus-4-8 | high | Complex architecture |
| researcher | google/gemini-3.5-flash | — | Web research synthesis |
| code-reviewer | openai-codex/gpt-5.4-mini | medium | Code review |
| reviewer | openai-codex/gpt-5.4-mini | medium | General review |
| project-manager | openai-codex/gpt-5.4-mini | medium | Linear PM operations |
| context-builder | openai-codex/gpt-5.4-mini | low | Context + meta-prompt generation |

## Conventions

- **Agent files**: Markdown with YAML frontmatter (`name`, `description`, `model`, `thinking`, `tools`, `skills`)
- **Tool files**: `.ts` file + matching `.txt` description file. Export `register(pi)` function.
- **Skills**: Directory with `SKILL.md` (YAML frontmatter: `name`, `description`). Optional `references/` subdirectory.
- **Traits**: Imperative voice, 3-5 lines max per fragment, positive framing
- **Trait dimensions**: `expertise` (domain focus), `personality` (thinking style), `approach` (work methodology)

## Context Engineering

- **Subagent delegation**: Each subagent gets a fresh context window — no inherited noise. Prefer delegation for exploration, review, planning, PM work, broad file inspection, and any task that would otherwise load many files into the main context.
- **Trait composition**: Base agent + traits = dynamic on-the-fly specialist. Example: `{ agent: "scout", traits: ["security", "skeptical", "thorough"], task: "audit auth module" }` creates a security-auditor scout without a new agent file.
- **Dynamic subagent creation**: Choose the smallest base agent that matches execution shape (`scout`, `eagle-scout`, `planner`, `engineer`, `reviewer`, etc.), then add 1-3 traits for domain focus, thinking style, and work method. Traits are compact prompt overlays, not role-play.
- **Chains**: `research-plan-implement` for ACE/FCA workflow (research.md → plan.md → implementation) and `quick-dev` for small well-defined tasks. Chain steps should use traits to specialize each isolated context.
- **Presets**: Named trait combos — `security-auditor` (scout + security, skeptical, thorough), `careful-implementer` (engineer + implementation, disciplined, systematic). Presets are shortcuts; ad-hoc trait composition is encouraged when the task shape is unique.
- **Progressive disclosure**: Skills load on-demand. Only descriptions always in context.
- **Target**: 40-60% context utilization. Delegate exploration to keep main session lean.
- **Intent gate**: answer/research requests stay read-only; implement only when explicitly asked. Clarify when scope is ambiguous or interpretations differ materially.
- **Todo discipline**: For 2+ step tasks, create todos first, keep exactly one `in_progress`, mark completion immediately, and update todos when scope changes.
- **High-leverage review**: Prefer reviewing research and plans before code. Bad research creates thousands of bad lines; bad plans create hundreds.
- **Browser verification**: Use the `playwright` tool after frontend changes to inspect real pages, check responsive viewports, capture screenshots, and validate short E2E flows. Return artifact paths, not large DOM dumps.
