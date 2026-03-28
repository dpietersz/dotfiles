# Agent Model Mapping

Model assignments based on [OMI OpenCode agent-model matching guide](https://github.com/code-yeongyu/oh-my-openagent/blob/dev/docs/guide/agent-model-matching.md).

**Principle**: Models aren't just smarter/dumber — they think differently. Match model personality to agent role.

## Current Mapping

| Agent | Model | Thinking | Tier |
|---|---|---|---|
| **lead-engineer** | `anthropic/claude-opus-4-6` | high | Anthropic — complex implementation |
| **engineer** (impl) | `anthropic/claude-sonnet-4-6` | medium | Anthropic — standard implementation |
| **worker** | `anthropic/claude-sonnet-4-6` | medium | Anthropic — general implementation |
| **planner** | `openai-codex/gpt-5.4` | high | OpenAI — strategic planning |
| **eagle-scout** | `openai-codex/gpt-5.2` | medium | OpenAI — deep research |
| **reviewer** | `openai-codex/gpt-5.3-codex` | medium | OpenAI — code review |
| **code-reviewer** | `openai-codex/gpt-5.3-codex` | medium | OpenAI — deep code review |
| **context-builder** | `openai-codex/gpt-5.2` | low | OpenAI — context aggregation |
| **project-manager** | `openai-codex/gpt-5.2` | medium | OpenAI — PM orchestration |
| **linear** | `openai-codex/gpt-5.2` | low | OpenAI — Linear API operations |
| **researcher** | `google/gemini-2.5-flash` | — | Google — web research |
| **scout** | `google/gemini-2.5-flash` | — | Google — fast codebase grep |
| **engineer** (utility) | `google/gemini-2.5-flash` | — | Google — branch/PR setup |

## Tier Strategy

| Tier | Model | Thinking | Use for |
|---|---|---|---|
| **Strategic planning** | `openai-codex/gpt-5.4` | high | Planner — highest-leverage artifact |
| **Deep reasoning** | `openai-codex/gpt-5.2` | medium | Eagle-scout, project-manager |
| **Light reasoning** | `openai-codex/gpt-5.2` | low | Context-builder, linear |
| **Code review** | `openai-codex/gpt-5.3-codex` | medium | Reviewer, code-reviewer |
| **Complex implementation** | `anthropic/claude-opus-4-6` | high | Lead-engineer |
| **Standard implementation** | `anthropic/claude-sonnet-4-6` | medium | Engineer (impl), worker |
| **Utility / speed** | `google/gemini-2.5-flash` | — | Scout, researcher, engineer (utility) |

## Previous Mapping (for rollback)

| Agent | Previous Model | Previous Thinking | Current Model | Current Thinking |
|---|---|---|---|---|
| lead-engineer | `claude-opus-4-6` | medium | `anthropic/claude-opus-4-6` | high |
| engineer | `anthropic/claude-sonnet-4-6` | medium | `anthropic/claude-sonnet-4-6` | medium |
| worker | `anthropic/claude-sonnet-4-6` | medium | `anthropic/claude-sonnet-4-6` | medium |
| planner | `claude-opus-4-6` | high | `openai-codex/gpt-5.4` | high |
| eagle-scout | `anthropic/claude-sonnet-4-6` | medium | `openai-codex/gpt-5.2` | medium |
| reviewer | `openai-codex/gpt-5.3-codex` | high | `openai-codex/gpt-5.3-codex` | medium |
| code-reviewer | `anthropic/claude-opus-4-6` | (via :high) | `openai-codex/gpt-5.3-codex` | medium |
| context-builder | `claude-sonnet-4-6` | — | `openai-codex/gpt-5.2` | low |
| project-manager | `anthropic/claude-sonnet-4-6` | — | `openai-codex/gpt-5.2` | medium |
| linear | `anthropic/claude-sonnet-4-6` | — | `openai-codex/gpt-5.2` | low |
| researcher | `anthropic/claude-sonnet-4-6` | medium | `google/gemini-2.5-flash` | — |
| scout | `anthropic/claude-haiku-4-5` | — | `google/gemini-2.5-flash` | — |

## Distribution

**Anthropic: 3 agents** (implementation only) · **OpenAI: 7 agents** (reasoning + review) · **Google: 3 agents** (utility/speed)
