---
description: Comprehensive end-to-end testing. Launches parallel sub-agents to research the codebase, then uses agent-browser to test every user journey — screenshots, UI/UX validation, and database verification. Run after implementation to validate everything before code review.
---

Use the e2e-test skill to conduct comprehensive end-to-end testing of this application.

Follow the full e2e-test skill workflow:
1. Pre-flight checks — platform, frontend detection, agent-browser installation
2. Launch three sub-agents in parallel: app structure/user journeys, database schema/data flows, bug hunting
3. Start the dev server in the background
4. Create a task list — one task per user journey discovered
5. Work through each journey: browser automation with agent-browser, screenshots, database validation, fix critical blockers inline
6. Responsive testing across mobile/tablet/desktop viewports
7. Produce the structured report with all fixed and remaining issues
