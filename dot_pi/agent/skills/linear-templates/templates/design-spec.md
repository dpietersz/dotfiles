# Design Spec Template

Appended to the issue description after the main body is approved. Research-driven: code examples, patterns, CLI commands, package versions.

```markdown
--- SPEC START ---

## 1. Functional Requirements

1.1 Core Behavior
- FR-1: When <trigger>, the system MUST <behavior>.
- FR-2: <Next requirement>.

1.2 Inputs
- Source: <UI/API/event>.
- Fields: <name> (type, constraints), <name> (type, constraints).

1.3 Outputs
- Response shape / side effects / state changes.

## 2. Non-Functional Requirements

- NFR-1: Performance constraint (e.g. P95 < 300ms for endpoint X).
- NFR-2: Security, auth, permissions.
- NFR-3: Observability (logs/metrics/traces).

## 3. Domain Rules

- DR-1: Business rule 1.
- DR-2: Edge case handling.

## 4. Constraints & Exclusions

- C-1: Tech constraints (e.g. must use existing service Y).
- C-2: Explicitly NOT in scope.

## 5. Test Cases (High-Level)

- TC-1: Scenario, input, expected outcome.
- TC-2: Scenario, input, expected outcome.

--- SPEC END ---
```
