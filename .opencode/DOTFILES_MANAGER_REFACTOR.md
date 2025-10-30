# Dotfiles Manager Refactor Summary

## Overview

The `@dotfiles-manager` agent has been refactored from a **hands-on implementer** to a **pure orchestrator** following the best practices defined in `OPENCODE_AGENT_BEST_PRACTICES.md`. Additionally, a new `@opencode-config` subagent has been created to manage OpenCode agent configurations.

## Key Changes to @dotfiles-manager

### 1. Permissions Changed to Read-Only

**Before:**
```yaml
tools:
  read: true
  edit: true
  bash: true
permissions:
  edit: allow
  bash: allow
```

**After:**
```yaml
tools:
  read: true
permissions:
  read: allow
```

**Impact:** The agent can no longer directly modify files or execute bash commands. This forces proper delegation to specialized subagents.

### 2. Role Redefined as Pure Orchestrator

**Before:**
- "Your responsibility is understanding user requests, routing them to specialized subagents, and ensuring all changes maintain consistency..."
- Mixed planning and implementation responsibilities

**After:**
- "Your sole responsibility is **planning, coordinating, and overseeing** changes through specialized subagents."
- "You do NOT make changes yourself—you delegate all implementation work to appropriate subagents and provide high-level guidance to the user."
- Clear separation of concerns

### 3. Focus Areas Refocused on Orchestration

**Before:**
1. Config Management
2. Application Installation
3. Custom Scripts
4. Security
5. Documentation
6. Git Operations
7. Environment Awareness
8. Quality Assurance

**After:**
1. **Planning** - Understand requests and create detailed plans
2. **Coordination** - Route work to appropriate subagents
3. **Oversight** - Monitor progress and ensure consistency
4. **User Communication** - Present plans, ask for approval, report results
5. **Decision Support** - Help users choose between options
6. **Quality Assurance** - Verify subagent outputs
7. **Environment Awareness** - Consider local vs remote
8. **Workflow Management** - Ensure proper sequencing

### 4. Process Restructured into 6 Phases

**Before:** 7 steps mixing planning and implementation

**After:** 6 distinct phases with clear responsibility boundaries:

1. **Phase 1: Planning & Analysis** (YOU DO THIS)
   - Understand the request
   - Create implementation plan
   - Present plan to user

2. **Phase 2: Pre-Modification Security Audit** (DELEGATE TO @security-auditor)
   - Invoke security audit
   - Handle results (APPROVED/BLOCKED/REQUIRES_MITIGATION)

3. **Phase 3: Implementation** (DELEGATE TO SUBAGENTS)
   - Invoke appropriate subagents
   - Coordinate multiple subagents if needed

4. **Phase 4: Verification** (YOU DO THIS)
   - Read modified files
   - Verify correctness
   - Report findings

5. **Phase 5: Post-Modification Security Audit** (DELEGATE TO @security-auditor)
   - Final security check
   - Block or approve for commit

6. **Phase 6: Commit** (DELEGATE TO @git-manager)
   - Prepare for commit
   - Invoke git-manager only after security approval

### 5. New Subagent: @opencode-config

A new subagent has been created to manage OpenCode agent configurations:

**Location:** `.opencode/agent/opencode-config.md`

**Responsibilities:**
- Create new OpenCode agents
- Modify existing OpenCode agents
- Ensure compliance with OPENCODE_AGENT_BEST_PRACTICES.md
- Manage YAML frontmatter
- Design system prompts
- Validate agent definitions

**Key Distinction:**
- Manages agents in `.opencode/agent/` (dotfiles-specific)
- Manages agents in `dot_config/opencode/agent/` (system-wide)
- Understands the difference between dotfiles-specific and system-wide agents

### 6. Updated Subagent List

Added `@opencode-config` to the Configuration Management section:

```yaml
### Configuration Management
- **@nvim-config** - Modifies Neovim configuration
- **@shell-config** - Modifies shell configuration
- **@ui-config** - Modifies UI configuration
- **@app-config** - Modifies application configuration
- **@opencode-config** - Modifies OpenCode agent configurations ← NEW
```

### 7. Improved User Communication Pattern

New section explaining how to interact with users:

1. **Clarify** - Ask questions if request is ambiguous
2. **Plan** - Create detailed step-by-step plan
3. **Present** - Show plan to user with options
4. **Approve** - Get user confirmation before proceeding
5. **Execute** - Invoke subagents in correct order
6. **Report** - Provide progress updates
7. **Verify** - Confirm all changes are correct
8. **Finalize** - Prepare for commit with user confirmation

### 8. Enhanced Examples

Examples now show the full orchestration workflow:

**Before:**
```
User: "Install lazydocker"
→ Route to @app-installer
→ app-installer checks mise/config.toml
→ Adds lazydocker to tools
→ Verify and commit
```

**After:**
```
User: "Install lazydocker"

YOU (dotfiles-manager):
1. Create plan: "Will add lazydocker to mise/config.toml"
2. Present plan to user, ask for approval
3. Call @security-auditor for pre-modification audit
4. Call @app-installer to add lazydocker
5. Read modified files to verify changes
6. Call @security-auditor for post-modification audit
7. Call @git-manager to commit changes
8. Report final status to user
```

### 9. Clearer Constraints

**Before:** 8 constraints mixing different concerns

**After:** 12 critical rules with emphasis on orchestration:

```
1. YOU HAVE READ-ONLY PERMISSIONS - Cannot edit files or run bash commands
2. ALWAYS delegate implementation - Never do the work yourself
3. ALWAYS create a plan first - Present to user before invoking subagents
4. ALWAYS ask for user approval - Get confirmation before proceeding
5. ALWAYS use @security-auditor - Both pre-modification and post-modification
6. ALWAYS verify subagent work - Read files to confirm correctness
7. NEVER skip verification - Consistency and correctness are critical
8. ALWAYS report progress - Keep user informed at each phase
9. NEVER commit directly - Always use @git-manager for all git operations
10. ALWAYS consider environment compatibility - Local vs remote, OS-specific
11. ALWAYS provide decision points - Help user choose between options
12. NEVER assume - Ask clarifying questions if request is ambiguous
```

## New @opencode-config Subagent

### Purpose

Specialized agent for creating and maintaining OpenCode agent configurations. Understands:
- OpenCode agent architecture (primary vs subagents)
- YAML frontmatter specifications
- System prompt design
- Context window optimization
- Agent specialization patterns

### Key Features

1. **Dual Location Support**
   - `.opencode/agent/` - Dotfiles-specific agents
   - `dot_config/opencode/agent/` - System-wide agents

2. **Best Practices Compliance**
   - References OPENCODE_AGENT_BEST_PRACTICES.md
   - Validates against checklist
   - Ensures consistent structure

3. **Comprehensive Process**
   - Understand request
   - Research existing patterns
   - Design agent structure
   - Create/modify agent file
   - Validate
   - Document

4. **Location Guidance**
   - Clear distinction between dotfiles-specific and system-wide agents
   - Explains when to use each location
   - Considers chezmoi apply implications

### When to Use @opencode-config

- Creating new OpenCode agents
- Modifying existing OpenCode agents
- Updating agent configurations
- Ensuring agents follow best practices
- Creating system-wide agents for personal productivity

## Workflow Example

### Before (Old Approach)

```
User: "Add Rust treesitter support"
→ dotfiles-manager directly edits lua/plugins/treesitter.lua
→ dotfiles-manager validates Lua syntax
→ dotfiles-manager commits changes
```

### After (New Approach)

```
User: "Add Rust treesitter support"

1. dotfiles-manager creates plan:
   "Will modify lua/plugins/treesitter.lua to add Rust"
   
2. dotfiles-manager presents plan to user
   "This will add Rust to the treesitter ensure_installed list.
    Affected file: dot_config/nvim/lua/plugins/treesitter.lua
    Proceed? (yes/no)"
   
3. User approves

4. dotfiles-manager calls @security-auditor
   "Pre-modification audit: Will modify nvim config"
   
5. @security-auditor approves

6. dotfiles-manager calls @nvim-config
   "Add Rust treesitter support to dot_config/nvim/
    - Modify lua/plugins/treesitter.lua
    - Ensure compatibility with LazyVim structure
    - Validate Lua syntax
    - Return summary of changes"
   
7. @nvim-config modifies file and returns summary

8. dotfiles-manager reads modified file to verify

9. dotfiles-manager calls @security-auditor
   "Post-modification audit: Modified dot_config/nvim/lua/plugins/treesitter.lua"
   
10. @security-auditor approves

11. dotfiles-manager calls @git-manager
    "Commit changes: feat(nvim): add rust treesitter support"
    
12. @git-manager commits and reports success

13. dotfiles-manager reports to user:
    "✅ Successfully added Rust treesitter support
     Modified: dot_config/nvim/lua/plugins/treesitter.lua
     Committed with: feat(nvim): add rust treesitter support"
```

## Benefits of This Refactor

1. **Clear Separation of Concerns**
   - Orchestrator focuses on planning and coordination
   - Subagents focus on implementation
   - Security auditor focuses on threat detection

2. **Better User Experience**
   - Users see plans before execution
   - Users can approve or modify plans
   - Users get progress updates at each phase
   - Users understand what's happening

3. **Improved Security**
   - Mandatory security audits before and after changes
   - Clear audit results with mitigation options
   - No changes proceed without security approval

4. **Easier Maintenance**
   - Each agent has single, clear responsibility
   - Easier to debug when things go wrong
   - Easier to add new agents
   - Easier to understand agent interactions

5. **Better Scalability**
   - New subagents can be added without changing orchestrator
   - Orchestrator focuses on coordination, not implementation
   - Subagents can be specialized for specific tasks

6. **OpenCode Configuration Management**
   - New @opencode-config agent handles all agent modifications
   - Ensures consistency across all agents
   - Follows best practices automatically
   - Supports both dotfiles-specific and system-wide agents

## Migration Guide

### For Users

No changes needed! The refactored agent works the same way from the user's perspective:

```
User: "Add Rust treesitter support"
```

The agent will now:
1. Create a plan and ask for approval
2. Delegate to @nvim-config
3. Verify the changes
4. Commit when ready

### For Developers

If you're creating new subagents:

1. Use `@opencode-config` to create/modify agents
2. Ensure agents follow OPENCODE_AGENT_BEST_PRACTICES.md
3. Agents should have single, clear responsibility
4. Use read-only permissions for orchestrators
5. Use edit/bash permissions only for implementers

## Files Modified

1. `.opencode/agent/dotfiles-manager.md` - Refactored to pure orchestrator
2. `.opencode/agent/opencode-config.md` - NEW subagent for agent management

## Next Steps

1. Test the refactored dotfiles-manager with a simple request
2. Create additional specialized subagents as needed
3. Update documentation if needed
4. Monitor agent interactions for improvements

## Questions?

Refer to:
- `.opencode/OPENCODE_AGENT_BEST_PRACTICES.md` - Agent design guidelines
- `.opencode/agent/dotfiles-manager.md` - Orchestrator responsibilities
- `.opencode/agent/opencode-config.md` - Agent configuration management
- `.opencode/WORKFLOW_GUIDE.md` - Workflow documentation
