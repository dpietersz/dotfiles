---
name: code-review
description: Comprehensive production-grade code review command. Launches parallel sub-agents to research the codebase (architecture/scope, security, quality enforcement), runs the build and test suite, then works through every review concern systematically — fixing critical issues, incorrect docstrings, TODOs, and incomplete implementations inline. No corners cut. Run before merging to validate everything is production-ready.
disable-model-invocation: true
---

# Production-Grade Code Review

**Standard**: Every review is evaluated as if the code ships to production tomorrow. Superficial reviews are a failure. Thoroughness is non-negotiable.

**Fix policy**: This review fixes issues directly — it does not just report them. See Phase 4 for the exact fix policy. The goal is to hand back code that is genuinely production-ready, not a list of things to do later.

---

## Phase 1: Parallel Research

Launch **three sub-agents simultaneously** using the Task tool. All three run in parallel. Do not proceed until all three have returned.

### Sub-agent 1: Scope, Architecture & Intent

> Research this codebase and the changes under review. Return a structured summary covering:
>
> 1. **What is under review** — identify the changed files (use `git diff --name-only HEAD`, `git diff --staged --name-only`, or the files/PR the user specified). List every file in scope.
> 2. **Intent of the changes** — what is this change trying to accomplish? Read commit messages, PR description, or surrounding context.
> 3. **Architecture map** — for each changed file: what module/package does it belong to, what calls INTO it (callers/dependents), what does it call OUT to (imports/dependencies), and are there related test files?
> 4. **Codebase conventions** — linter configs, formatter settings, naming patterns, error handling style, logging conventions, test framework and patterns in use.
> 5. **Build and test commands** — exact commands to build and run the test suite (check `Makefile`, `justfile`, `package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`, etc.).
> 6. **Delegation strategy** — based on file count and complexity, recommend how to split the review across `@code-reviewer` sub-agents (which files together, what focus areas).
>
> Be exhaustive. The review will only cover what you identify here.

### Sub-agent 2: Security Deep-Dive

> Conduct a focused security analysis of the changed files. Read the diff carefully. Return a structured report covering:
>
> 1. **Input validation** — untrusted data sanitized before use, boundary checks, type coercion, missing validation at API boundaries
> 2. **Authentication & authorization** — auth bypass paths, privilege escalation, missing permission checks, insecure session handling
> 3. **Injection vulnerabilities** — SQL injection, command injection, template injection, XSS, path traversal, SSRF, open redirect
> 4. **Cryptography** — weak algorithms, hardcoded secrets or keys, improper key management, insecure random number generation
> 5. **Sensitive data exposure** — PII in logs, tokens in responses, insecure storage, missing redaction, over-broad API responses
> 6. **Dependencies** — new dependencies added: known CVEs, abandoned packages, typosquatting risk, license issues
> 7. **Infrastructure & configuration** — debug mode, permissive CORS, missing security headers, overly broad IAM permissions, exposed ports
>
> For each finding: file path, line number, severity (🔴🟠🟡), what the vulnerability is, and what an attacker could do with it.

### Sub-agent 3: Quality Enforcement

> Conduct a thorough quality audit of the changed files. This is zero-tolerance enforcement — every item found must be reported with file path and line number. Return findings in these categories:
>
> 1. **Incorrect or missing docstrings/comments** — functions, classes, or modules that lack documentation; docstrings that don't match the actual implementation; parameter descriptions that are wrong or missing; return value documentation that is absent or inaccurate. Every public API surface must be documented correctly.
> 2. **TODOs, FIXMEs, HACKs, and placeholder code** — any `TODO`, `FIXME`, `HACK`, `XXX`, `temp`, `temporary`, `placeholder`, `stub`, or similar markers. These are unacceptable in production code. Each one must be resolved.
> 3. **Incomplete implementations** — functions that raise `NotImplementedError`, return hardcoded stubs, have empty bodies, or are clearly unfinished. Dead code paths. Commented-out code blocks.
> 4. **Logic errors and bugs** — off-by-one errors, null/nil/undefined handling gaps, race conditions, incorrect conditionals, missing edge case handling, error paths that silently swallow failures.
> 5. **Test coverage gaps** — new code paths without tests, missing edge case tests, tests that test implementation rather than behavior, tests that always pass regardless of correctness.
> 6. **Code quality** — excessive complexity, deeply nested logic, god functions, misleading variable/function names, copy-paste duplication, missing abstractions, resource leaks (unclosed handles, leaked connections, abandoned timers).
> 7. **Technical debt markers** — deprecated API usage, outdated patterns with modern alternatives, hardcoded values that should be configurable.
>
> Be exhaustive. Nothing gets a pass because it's "minor". Every finding needs a file path and line number.

**Wait for all three sub-agents to complete before proceeding.**

---

## Phase 2: Build & Test Validation

Using the build and test commands from Sub-agent 1, run the full build and test suite now:

```bash
# Examples — use whatever the project actually uses:
go build ./... && go test ./... && go vet ./...
npm run build && npm test
pytest && mypy . && ruff check .
cargo build && cargo test && cargo clippy
```

Capture all output. Note:
- Build errors (must be fixed — code that doesn't build cannot be reviewed)
- Test failures (must be investigated — failing tests indicate broken behaviour)
- Linter/type-checker warnings (must be assessed — many are real bugs)
- Static analysis findings (add to the review findings pool)

If the build fails entirely, stop and report:
> "The build is broken. Fix the build errors before the review can proceed."

---

## Phase 3: Create Task List

Using findings from all three sub-agents and the build/test results, create a task for each review concern area. Use the TodoWrite tool to track these.

Each task should be scoped to a logical concern, not a single file. Examples:
- "Review authentication module — security findings from Sub-agent 2"
- "Fix all TODOs and incomplete implementations across changed files"
- "Correct docstrings in [module] — 7 incorrect/missing found"
- "Address test coverage gaps in [feature]"
- "Resolve build warnings and linter findings"
- "Architecture review — integration points and breaking changes"

Also create a final task: "Synthesize findings and produce review report."

---

## Phase 4: Review Execution

For each task, mark it in-progress and work through it systematically. The fix policy below is **non-negotiable**.

### Fix Policy (MANDATORY — No Exceptions)

**Fix immediately and directly — do not defer to "remaining issues":**

| Category | Action |
|----------|--------|
| 🔴 **CRITICAL security vulnerabilities** | Fix the code directly. Re-run affected tests. |
| 🔴 **Correctness bugs** (broken behaviour, data corruption risk) | Fix the code directly. Add a regression test. |
| **Incorrect docstrings** | Rewrite to accurately describe the implementation. Every parameter, return value, and side effect must be correct. |
| **Missing docstrings** on public APIs | Write them. No public function, class, or module ships without documentation. |
| **TODOs / FIXMEs / HACKs** | Either implement the missing piece properly, or if genuinely out of scope, remove the marker and document the decision in a proper comment explaining *why* it's deferred and *what* the correct solution is. Bare `TODO: fix this` is never acceptable. |
| **Placeholder / stub implementations** | Implement properly or raise a clear, intentional `NotImplementedError` with a docstring explaining the interface contract. |
| **Commented-out code** | Delete it. Version control exists for a reason. |
| **Build errors introduced by the change** | Fix them. |
| **Test failures caused by the change** | Fix the code or fix the test (with justification). |

**Document but do not fix (report in final output):**

| Category | Action |
|----------|--------|
| 🟠 **High-priority issues** (performance, maintainability) | Document with file:line, impact, and specific fix recommendation |
| 🟡 **Medium suggestions** | Document with file:line and benefit |
| 🔵 **Low-priority notes** | Document briefly |
| Pre-existing issues not introduced by this change | Flag separately — do not conflate with the current review scope |

### Delegation During Execution

For deep file-level analysis of specific modules, invoke `@code-reviewer` sub-agents with full context:

```
@code-reviewer: Review these files for production readiness.

Files: [file list]

Context from codebase exploration:
- Architecture: [module structure from Sub-agent 1]
- Callers: [what depends on these files]
- Patterns: [conventions this codebase follows]
- Change intent: [what this change is trying to accomplish]
- Security findings: [relevant findings from Sub-agent 2]
- Quality findings: [relevant findings from Sub-agent 3]

Focus: [security / performance / correctness / all]

Return findings in severity-tiered format (🔴🟠🟡🔵) with file paths and line numbers.
```

Fire multiple `@code-reviewer` instances in parallel for large changesets. Pass the full Sub-agent 1 context — subagents without context produce shallow reviews.

### Penetration Testing (Conditional)

Invoke `@penetration-tester` only when Sub-agent 2 or `@code-reviewer` identifies:
- Public-facing API changes with potential auth bypass
- User input handling with injection risk
- Cryptographic operations with implementation concerns
- Infrastructure configuration with exposure risk
- A 🔴 CRITICAL security finding that needs runtime validation

Do **not** invoke for: internal tooling, pure refactoring, documentation changes, test-only changes.

### After Each Task

- Mark the task completed
- Record: what was found, what was fixed (with file:line), what is documented for the report

---

## Phase 5: Report

### Text Summary (always output)

```
## Code Review Complete

**Files Reviewed:** [count]
**Build:** PASS / FAIL
**Tests:** PASS / [N] failing
**Issues Found:** [count total]
**Fixed Inline:** [count] (critical bugs, docstrings, TODOs, incomplete implementations)
**Remaining:** [count] (high/medium/low — documented below)

### Fixed During Review
- [Description] — [file:line] — [what was done]

### Remaining Issues

#### 🟠 High Priority (SHOULD fix before merge)
- [Description] — [file:line] — [recommended fix]

#### 🟡 Medium Priority (COULD fix)
- [Description] — [file:line] — [benefit]

#### 🔵 Low Priority (NICE to fix)
- [Description] — [file:line]

### Pre-existing Issues (not introduced by this change)
- [Description] — [file:line] — [severity]

### Positive Observations
- [What was done well — be specific]

### Overall Assessment

| Aspect        | Rating       | Notes |
|---------------|--------------|-------|
| Security      | 🔴🟠🟡🟢   | [note] |
| Correctness   | 🔴🟠🟡🟢   | [note] |
| Performance   | 🔴🟠🟡🟢   | [note] |
| Maintainability | 🔴🟠🟡🟢 | [note] |
| Test Coverage | 🔴🟠🟡🟢   | [note] |
| Documentation | 🔴🟠🟡🟢   | [note] |

**Recommendation**: APPROVE / REQUEST CHANGES / BLOCK

- **APPROVE** — No critical or high issues remain. Code is production-ready.
- **REQUEST CHANGES** — High-priority issues documented. Fixable without redesign.
- **BLOCK** — Critical issues remain unfixed. Must not merge.
```

### Markdown Export (ask first)

After the text summary, ask the user:

> "Would you like me to export the full review report to `code-review-report.md`? It includes per-file breakdowns, all findings with file references, fix details, and recommendations — useful as context for follow-up work in a fresh session."

If yes, write a detailed report to `code-review-report.md` in the project root containing:
- Full summary with stats
- Per-task breakdown: what was reviewed, what was found, what was fixed
- All remaining issues with full details, severity, and specific fix recommendations
- Security findings from Sub-agent 2 with exploitability assessment
- Quality findings from Sub-agent 3 with resolution status
- Build and test results
- Positive observations
- Recommendations for any unresolved issues
