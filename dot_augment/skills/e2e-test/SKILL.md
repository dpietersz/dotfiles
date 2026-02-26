---
name: e2e-test
description: Comprehensive end-to-end testing command. Launches parallel subagents to research the codebase (structure, database schema, potential bugs), then uses the agent-browser CLI to test every user journey — taking screenshots, validating UI/UX, and querying the database to verify records. Run after implementation to validate everything before code review.
---

# End-to-End Application Testing

> **Requires:** `agent-browser` skill — load it for CLI reference during testing.

## Pre-flight Check

### 1. Platform Check

agent-browser requires **Linux, WSL, or macOS**. Check the platform:
```bash
uname -s
```
- `Linux` or `Darwin` → proceed
- Anything else → stop with:

> "agent-browser only supports Linux, WSL, and macOS. It cannot run on native Windows. Please run this command from WSL or a Linux/macOS environment."

### 2. Frontend Check

Verify the application has a browser-accessible frontend. Check for:
- A `package.json` with a dev/start script serving a UI
- Frontend framework files (`pages/`, `app/`, `src/components/`, `index.html`, etc.)
- Web server configuration

If no frontend is detected, stop with:
> "This application doesn't appear to have a browser-accessible frontend. E2E browser testing requires a UI to visit."

### 3. agent-browser Installation

```bash
agent-browser --version
```

If not found, install automatically:
```bash
npm install -g agent-browser
agent-browser install --with-deps
```

If installation fails, stop with:
> "Failed to install agent-browser. Please install it manually with `npm install -g agent-browser && agent-browser install --with-deps`, then re-run this command."

---

## Phase 1: Parallel Research

Launch **three subagents simultaneously**. All three run in parallel.

### Subagent 1: Application Structure & User Journeys

> Research this codebase thoroughly. Return a structured summary covering:
>
> 1. **How to start the application** — exact commands to install dependencies and run the dev server, including the URL and port it serves on
> 2. **Authentication/login** — if the app has protected routes, how to create a test account or log in (credentials from .env.example, seed data, or sign-up flow)
> 3. **Every user-facing route/page** — each URL path and what it renders
> 4. **Every user journey** — complete flows a user can take (e.g., "sign up → create profile → view public page"). For each journey, list the specific steps, interactions (clicks, form fills, navigation), and expected outcomes
> 5. **Key UI components** — forms, modals, dropdowns, pickers, toggles, and other interactive elements that need testing
>
> Be exhaustive. Testing will only cover what you identify here.

### Subagent 2: Database Schema & Data Flows

> Research this codebase's database layer. Read `.env.example` to understand environment variables for database connections. DO NOT read `.env` directly. Return a structured summary covering:
>
> 1. **Database type and connection** — what database is used (Postgres, MySQL, SQLite, etc.) and the environment variable name for the connection string (from .env.example)
> 2. **Full schema** — every table, its columns, types, and relationships
> 3. **Data flows per user action** — for each user-facing action (form submit, button click, etc.), document exactly what records are created, updated, or deleted and in which tables
> 4. **Validation queries** — for each data flow, provide the exact query to verify records are correct after the action

### Subagent 3: Bug Hunting

> Analyze this codebase for potential bugs, issues, and code quality problems. Focus on:
>
> 1. **Logic errors** — incorrect conditionals, off-by-one errors, missing null checks, race conditions
> 2. **UI/UX issues** — missing error handling in forms, no loading states, broken responsive layouts, accessibility problems
> 3. **Data integrity risks** — missing validation, potential orphaned records, incorrect cascade behavior
> 4. **Security concerns** — SQL injection, XSS, missing auth checks, exposed secrets
>
> Return a prioritized list with file paths and line numbers.

**Wait for all three subagents to complete before proceeding.**

---

## Phase 2: Start the Application

Using Subagent 1's startup instructions:

1. Install dependencies if needed
2. Start the dev server **in the background** (e.g., `npm run dev &`)
3. Wait for the server to be ready
4. Open the app and confirm it loads:
   ```bash
   agent-browser open <url>
   agent-browser screenshot e2e-screenshots/00-initial-load.png
   ```

---

## Phase 3: Create Task List

Using the user journeys from Subagent 1 and findings from Subagent 3, create a task for each user journey. Each task should include:

- **Subject:** The journey name (e.g., "Test profile creation flow")
- **Description:** Steps to execute, expected outcomes, database records to verify, and any related bug findings from Subagent 3

Also create a final task: "Responsive testing across viewports."

---

## Phase 4: User Journey Testing

For each task, mark it in-progress and execute the following.

### 4a. Browser Testing

Use the `agent-browser` CLI for all browser interaction. Load the `agent-browser` skill for the full command reference.

**Key commands:**
```bash
agent-browser open <url>              # Navigate to a page
agent-browser snapshot -i             # Get interactive elements with refs (@e1, @e2...)
agent-browser click @eN               # Click element by ref
agent-browser fill @eN "text"         # Clear field and type
agent-browser select @eN "option"     # Select dropdown option
agent-browser press Enter             # Press a key
agent-browser screenshot <path>       # Save screenshot
agent-browser screenshot --annotate   # Screenshot with numbered element labels
agent-browser set viewport W H        # Set viewport (e.g., 375 812 for mobile)
agent-browser wait --load networkidle # Wait for page to settle
agent-browser console                 # Check for JS errors
agent-browser errors                  # Check for uncaught exceptions
agent-browser get text @eN            # Get element text
agent-browser get url                 # Get current URL
agent-browser close                   # End session
```

> **Critical:** Refs become invalid after navigation or DOM changes. Always re-snapshot after page navigation, form submissions, or dynamic content updates (modals, tabs, theme changes).

For each step in a user journey:

1. Snapshot to get current refs
2. Perform the interaction
3. Wait for the page to settle
4. **Take a screenshot** — save to a descriptive path under `e2e-screenshots/` organized by journey (e.g., `e2e-screenshots/profile-creation/03-form-submitted.png`)
5. **Analyze the screenshot** — view the image and check for visual correctness, UX issues, broken layouts, missing content, error states
6. Check `agent-browser console` and `agent-browser errors` periodically for JavaScript issues

Be thorough. Go through EVERY interaction, EVERY form field, EVERY button.

### 4b. Database Validation

After any interaction that should modify data (form submits, deletions, updates):

1. Query the database to verify records using the connection info from Subagent 2:
   - **Postgres:** `psql "$DATABASE_URL" -c "SELECT * FROM table WHERE ..."`
   - **SQLite:** `sqlite3 db.sqlite "SELECT * FROM table WHERE ..."`
   - **Other:** Write a small ad hoc script in the application's language, run it, then delete it
2. Verify:
   - Records created/updated/deleted as expected
   - Values match what was entered in the UI
   - Relationships between records are correct
   - No orphaned or duplicate records

### 4c. Issue Handling

When an issue is found (UI bug, database mismatch, JS error):

1. **Document it:** what was expected vs what happened, screenshot path, relevant DB query results
2. **Fix the code** — make the correction directly
3. **Re-run the failing step** to verify the fix worked
4. **Take a new screenshot** confirming the fix

### 4d. Responsive Testing

For the responsive testing task, revisit key pages at these viewports:

```bash
agent-browser set viewport 375 812    # Mobile
agent-browser set viewport 768 1024   # Tablet
agent-browser set viewport 1440 900   # Desktop
```

At each viewport, screenshot every major page. Analyze for layout issues, overflow, broken alignment, and touch target sizes on mobile.

After completing each journey, mark its task as completed.

---

## Phase 5: Cleanup

After all testing is complete:
1. Stop the dev server background process
2. Close the browser session: `agent-browser close`

---

## Phase 6: Report

### Text Summary (always output)

```
## E2E Testing Complete

**Journeys Tested:** [count]
**Screenshots Captured:** [count]
**Issues Found:** [count] ([count] fixed, [count] remaining)

### Issues Fixed During Testing
- [Description] — [file:line]

### Remaining Issues
- [Description] — [severity: high/medium/low] — [file:line]

### Bug Hunt Findings (from code analysis)
- [Description] — [severity] — [file:line]

### Screenshots
All saved to: `e2e-screenshots/`
```

### Markdown Export (ask first)

After the text summary, ask the user:

> "Would you like me to export the full testing report to a markdown file? It includes per-journey breakdowns, all screenshot references, database validation results, and detailed findings."

If yes, write a detailed report to `e2e-test-report.md` in the project root containing:
- Full summary with stats
- Per-journey breakdown: steps taken, screenshots, database checks, issues found
- All issues with full details, fix status, and file references
- Bug hunt findings from the code analysis subagent
- Recommendations for any unresolved issues
