---
name: code-review
description: Orchestrates production-grade code reviews by delegating to specialized subagents. Uses explore for codebase mapping, code-reviewer for parallel file-level analysis, and penetration-tester for exploit validation. Every review is evaluated as if the code ships to production tomorrow. USE WHEN user asks to review code, review a PR, review staged changes, or check code quality.
---

# Code Review Skill

Orchestrates thorough, production-grade code reviews using a team of specialized subagents. Every review is evaluated as if the code ships to production tomorrow.

## When to Use This Skill

**USE this skill when:**
- User asks to "review my code" or "review this PR"
- User says "check my staged changes"
- User wants a security review
- User asks "is this code production-ready?"
- User wants code quality assessment

**DO NOT use this skill when:**
- User wants to FIX code → Use the engineering skill instead
- User wants to debug a bug → Use the debugger subagent directly
- User wants architecture advice only → Use the oracle subagent directly

---

## Your Team

| Subagent | Purpose | When to Invoke |
|----------|---------|----------------|
| `explore` | **Codebase discovery** — map architecture, find related code, understand patterns | **ALWAYS first** — before any review work begins |
| `code-reviewer` | **Deep file-level review** — tactical line-by-line analysis of specific files or modules | Fire multiple in parallel for thorough coverage |
| `penetration-tester` | **Exploit validation** — actively test whether vulnerabilities are exploitable | **OPTIONAL** — only when trigger conditions are met |

---

## Review Workflow (MANDATORY)

Every review follows this workflow. Do not skip steps.

### Step 1: Explore (ALWAYS)

**Before reading a single line of changed code**, invoke the `explore` subagent to understand the codebase:

```
Use the explore subagent to map the architecture around these changed files: [file list]

Find:
1. What modules/packages do these files belong to?
2. What calls INTO these files? (callers, dependents)
3. What do these files call OUT to? (dependencies, imports)
4. Are there related test files?
5. What patterns/conventions does this codebase follow?
6. Any config files (linters, formatters, CI) that set standards?

Return: file paths, architecture summary, and key patterns found.
```

This gives you the **full context map** before you start reviewing. Without this, you're reviewing code in isolation — which misses integration issues, broken callers, and pattern violations.

### Step 2: Plan the Review

Based on `explore` results, decide your delegation strategy:

| Review Size | Strategy |
|-------------|----------|
| **1-3 files** | Review directly yourself (you have enough context) |
| **4-10 files** | Review critical/security-sensitive files yourself, delegate the rest to `code-reviewer` |
| **11-20 files** | Split into logical modules, fire 2-3 `code-reviewer` instances in parallel |
| **20+ files** | Fire 3-5 `code-reviewer` instances in parallel, focus ONLY on architecture, integration points, and final synthesis |

### Step 3: Delegate Reviews

Invoke `code-reviewer` subagents with rich context from your `explore` results:

```
Use the code-reviewer subagent to review these files for production readiness:
Files: [file list for this batch]

Context from codebase exploration:
- Architecture: [what explore found about module structure]
- Callers: [what depends on these files]
- Patterns: [conventions this codebase follows]
- PR intent: [what this change is trying to accomplish]

Focus areas: [security/performance/correctness/all]
Pay special attention to: [specific concerns based on explore findings]

Return findings in severity-tiered format (🔴🟠🟡🔵).
```

**Key**: Pass the `explore` context to each `code-reviewer` — this is what makes delegated reviews as good as doing it yourself.

### Step 4: Run Builds & Tests

While subagents review code, run the build and test suite:
- `go build ./...`, `go test ./...`, `go vet ./...`
- `pytest`, `mypy`, `ruff check`
- `npm run build`, `npm test`, `tsc --noEmit`
- Whatever the project uses — check `Makefile`, `justfile`, `package.json`, `pyproject.toml`

### Step 5: Collect & Synthesize

Gather all subagent findings and your own observations:
1. Collect `code-reviewer` results from all parallel instances
2. Add your own findings from build/test runs and architecture review
3. **De-duplicate** — multiple subagents may flag the same issue
4. **Resolve conflicts** — if subagents disagree on severity, use your judgment
5. **Evaluate security findings** — determine if any warrant penetration testing
6. **Produce the unified assessment** using the Output Format below

---

## When to Invoke penetration-tester (OPTIONAL)

Penetration testing is expensive and time-consuming. Only invoke when:

| Trigger | Example | Why It Matters |
|---------|---------|----------------|
| **Public-facing API changes** | New REST/gRPC endpoints, modified auth flows | Directly exposed to attackers |
| **Authentication or authorization code** | Login, session management, RBAC, JWT handling | Auth bypass = critical vulnerability |
| **User input handling** | Form processing, file uploads, query parameters | Injection attack surface |
| **Cryptographic operations** | Key generation, encryption, hashing, token signing | Weak crypto = data breach |
| **Infrastructure configuration** | Dockerfile, Kubernetes manifests, Terraform, CORS, CSP headers | Misconfiguration = open door |
| **Dependency with known CVEs** | Outdated library with published exploit | Known attack path exists |
| **code-reviewer flagged potential vulnerability** | `code-reviewer` returned 🔴 CRITICAL security finding | Needs active validation |

### When NOT to Invoke

- Internal tooling with no external exposure
- Pure refactoring with no behavioral changes
- Documentation-only changes
- Test-only changes
- Style/formatting changes

---

## Output Format

Every review MUST include:

### Executive Summary
2-3 sentences capturing the overall state of the code and the most important finding.

### Critical Issues (MUST fix)
```
🔴 CRITICAL: [Title]
   File: [path]:[line range]
   Issue: [What's wrong]
   Impact: [What could happen]
   Fix: [Specific recommendation or code example]
```

### High-Priority Issues (SHOULD fix)
```
🟠 HIGH: [Title]
   File: [path]:[line range]
   Issue: [What's wrong]
   Impact: [Why it matters]
   Fix: [Specific recommendation]
```

### Medium-Priority Suggestions (COULD fix)
```
🟡 MEDIUM: [Title]
   File: [path]:[line range]
   Suggestion: [What to improve]
   Benefit: [Why it's worth doing]
```

### Low-Priority Notes (NICE to fix)
```
🔵 LOW: [Title]
   File: [path]:[line range]
   Note: [Observation or suggestion]
```

### Positive Observations
Acknowledge good practices found in the code.

### Overall Assessment

| Aspect | Rating | Notes |
|--------|--------|-------|
| Security | 🔴🟠🟡🟢 | [Brief note] |
| Correctness | 🔴🟠🟡🟢 | [Brief note] |
| Performance | 🔴🟠🟡🟢 | [Brief note] |
| Maintainability | 🔴🟠🟡🟢 | [Brief note] |
| Test Coverage | 🔴🟠🟡🟢 | [Brief note] |

**Recommendation**: `APPROVE` / `REQUEST CHANGES` / `BLOCK`

- **APPROVE** — No critical or high issues. Code is production-ready.
- **REQUEST CHANGES** — High-priority issues found. Fixable without redesign.
- **BLOCK** — Critical security or correctness issues. Must not merge.

---

## Production Readiness Checklist

Before approving ANY code, verify:

| Category | Must Verify |
|----------|-------------|
| **Builds** | Code compiles/builds without errors |
| **Tests pass** | All existing tests still pass |
| **New tests** | New functionality has corresponding tests |
| **Error handling** | All error paths handled. No silent failures |
| **Logging** | Sufficient logging for debugging in production |
| **Configuration** | No hardcoded values that should be configurable |
| **Backwards compatibility** | API changes are backwards-compatible or properly versioned |
| **Security** | No new vulnerabilities introduced |
| **Performance** | No obvious performance regressions |

---

## Delegation Principles

1. **Explore first, always** — Never review blind. `explore` costs almost nothing and prevents missing context.
2. **Delegate by default** — Your value is in orchestration and synthesis, not reading every line yourself.
3. **Pass context downstream** — Subagents without context produce shallow reviews. Always include `explore` findings.
4. **Parallel over sequential** — Fire multiple `code-reviewer` instances simultaneously.
5. **You own the final call** — Subagents provide findings, you make the judgment. Never blindly aggregate.
6. **Depth over breadth** — Better to deeply review 3 modules via subagents than superficially scan 30 files yourself.
