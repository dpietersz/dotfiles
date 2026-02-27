---
name: dev-research
description: Development-focused research for codebase understanding, library internals, implementation examples, and architecture decisions. Uses Librarian for code research with GitHub permalinks, Oracle for strategic technical advice, and Explore for fast codebase navigation. USE WHEN user asks about code implementation, library internals, GitHub examples, architecture decisions, or "how does X work in code".
---

# Dev-Research Skill

Development-focused research system for codebase understanding, library analysis, implementation examples, and strategic technical decisions.

## When to Use This Skill

**USE this skill when:**
- User asks "how does library X work?"
- User wants to find code implementation examples
- User asks about library internals or source code
- User needs architecture decisions or code review
- User wants GitHub code examples
- User asks "why was this changed?" (code history)
- User needs strategic technical advice

**DO NOT use this skill when:**
- User wants general web research → Use `research` skill
- User asks about current events or news → Use `research` skill
- User wants to "research topic X" broadly → Use `research` skill

---

## Available Agents

### Librarian (`@librarian`)
**Purpose:** Codebase understanding and multi-repository analysis

**Use for:**
- "How does library X implement Y?"
- "Show me the source code for Z"
- "Find examples of pattern X in open source"
- Looking up official documentation via Context7 MCP
- Finding implementation examples with GitHub permalinks

### Oracle (`@oracle`)
**Purpose:** Strategic technical advisor with deep reasoning

**Use for:**
- Architecture decisions
- Code review and analysis
- Engineering guidance
- Complex technical questions
- Refactoring roadmaps

**Key Features:**
- Pragmatic minimalism approach
- Effort estimates (Quick/Short/Medium/Large)
- Single clear recommendation

### Explore (`@explore`)
**Purpose:** Fast codebase exploration

**Use for:**
- "Where is X implemented?"
- "Which files contain Y?"
- "Find the code that does Z"
- Quick file and pattern searches

---

## Workflow Routing

### Implementation Questions
**Trigger:** "How does X implement Y?", "Show me the source of Z"
→ **Use:** `@librarian`

### Strategic/Architecture Questions
**Trigger:** "Should I use X or Y?", "Review this design", "Best approach for..."
→ **Use:** `@oracle`

### Code Location Questions
**Trigger:** "Where is X?", "Find files with Y", "Which file has Z?"
→ **Use:** `@explore`

### Comprehensive Research
**Trigger:** Complex questions needing multiple perspectives
→ **Use:** `@librarian` + `@oracle` in parallel

---

## MCP Servers Used

| MCP Server | Purpose | URL |
|------------|---------|-----|
| **context7** | Official documentation lookup | https://mcp.context7.com/mcp |

---

## Request Classification

| Type | Trigger Examples | Agent |
|------|------------------|-------|
| **CONCEPTUAL** | "How do I use X?", "Best practice for Y?" | @librarian |
| **IMPLEMENTATION** | "How does X implement Y?", "Show me source of Z" | @librarian |
| **CONTEXT/HISTORY** | "Why was this changed?", "History of X?" | @librarian |
| **STRATEGIC** | "Should I use X?", "Review this architecture" | @oracle |
| **LOCATION** | "Where is X?", "Find files with Y" | @explore |
| **COMPREHENSIVE** | Complex/ambiguous requests | @librarian + @oracle |

---

## Key Principles

1. **Evidence-based answers** - Every claim needs a GitHub permalink or source
2. **Parallel execution** - Launch multiple searches simultaneously
3. **Pragmatic advice** - Simple solutions over complex ones
4. **Fast responses** - Speed matters, don't over-research
5. **Clear recommendations** - One path forward, not endless options
