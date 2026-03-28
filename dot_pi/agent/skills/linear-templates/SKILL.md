---
name: linear-templates
description: Templates for creating Linear content — issues, comments, project updates, PR bodies, and state transition rules. Use when creating Linear issues, writing issue comments, posting project updates, creating PRs with Linear issue links, refining epics, or managing Linear workflow states.
---

# Linear Templates

Reusable templates for all content posted to Linear or referencing Linear issues. Each template is a separate file in `templates/` — load only what you need.

## Template Index

### Issue Creation
| Template | File | When to use |
|----------|------|-------------|
| Story | [story.md](templates/story.md) | Feature with user value |
| Bug | [bug.md](templates/bug.md) | Something is broken |
| Technical Task | [task.md](templates/task.md) | Tech debt, refactoring, infra |
| Design Spec | [design-spec.md](templates/design-spec.md) | Append to issue after approval |

### Comments on Issues
| Template | File | When to use |
|----------|------|-------------|
| Learnings Comment | [learnings-comment.md](templates/learnings-comment.md) | After implementing an issue |
| Clarification Questions | [clarification-questions.md](templates/clarification-questions.md) | Before finalizing issue scope |

### Project Updates
| Template | File | When to use |
|----------|------|-------------|
| Pre-flight Brief | [preflight-brief.md](templates/preflight-brief.md) | Before starting implementation |
| Retrospective | [retrospective.md](templates/retrospective.md) | After implementation complete |

### Pull Requests
| Template | File | When to use |
|----------|------|-------------|
| PR Body | [pr-body.md](templates/pr-body.md) | Creating a GitHub PR for Linear issues |

### Rules & Conventions
| Reference | File | When to use |
|-----------|------|-------------|
| State Transitions | [state-transitions.md](templates/state-transitions.md) | Any Linear state change |
| Issue Titles | [title-rules.md](templates/title-rules.md) | Creating or renaming issues |
| Duration Labels | [duration-labels.md](templates/duration-labels.md) | After chain completion |

## Usage

Load the specific template you need:
```
Read the story template at [skill directory]/templates/story.md
```

Do NOT load all templates at once — each template is self-contained. Load only what the current task requires.

## Conventions

- **Issue titles**: `[Verb] [What] [Context]` — see [title-rules.md](templates/title-rules.md)
- **Story dependency principle**: each story must be independently completable in sequence
- **INVEST criteria**: Independent, Negotiable, Valuable, Estimable, Small, Testable
- **Labels**: `Improvement`, `Feature`, `Bug`, `Delegated` — no type prefix in titles
- **State flow**: `Backlog → Todo → In Progress → In Review → Done` (also: Waiting, Canceled, Duplicate)
