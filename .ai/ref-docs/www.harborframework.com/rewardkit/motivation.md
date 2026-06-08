---
title: "Motivation & Design"
description: "Why Reward Kit exists and its design"
domain: "www.harborframework.com"
source: "https://www.harborframework.com/docs/rewardkit/motivation"
scraped_at: "2026-06-08T07:02:40Z"
etag: "\"a381db15a6392c0f8cba532958113056\""
---

[harbor](https://www.harborframework.com/)
[harbor](https://www.harborframework.com/)
`⌘``K`
[docs](https://www.harborframework.com/docs)[news](https://www.harborframework.com/news)[](https://hub.harborframework.com)[](https://discord.gg/6xWPKhGDbA)[Motivation](https://www.harborframework.com/docs)[Getting Started](https://www.harborframework.com/docs/getting-started)[Core Concepts](https://www.harborframework.com/docs/core-concepts)[Migrating from Terminal-Bench](https://www.harborframework.com/docs/migration)
Run Jobs
Leaderboard
Tasks
Datasets
Sharing
Agents
Training Workflows
Tutorials
Reward Kit
[Reward Kit](https://www.harborframework.com/docs/rewardkit)[Judge Criteria](https://www.harborframework.com/docs/rewardkit/judge-criteria)[Built-in Criteria](https://www.harborframework.com/docs/rewardkit/built-in-criteria)[Motivation & Design](https://www.harborframework.com/docs/rewardkit/motivation)
Contributing
[](https://github.com/laude-institute/harbor)
Motivation & DesignMotivation
Reward Kit
# Motivation & Design
Copy Markdown
Why Reward Kit exists and its design
## [Motivation](https://www.harborframework.com/docs/rewardkit/motivation#motivation)
When creating new tasks for Harbor, writing the verifier is often the most tedious part. So we looked at verifier implementations across popular benchmarks and found that they often are complicated scripts that are hard to read, extend, and reuse across tasks. This often leads to copy-and-pasting of boilerplace code between tasks causing subtle errors in verifiers during evals.
**Reward Kit** solves this. It packages common patterns into reusable components that can be shared and reused across tasks. Reward Kit gets rid of boilerplate code by enabling LLM/agent-as-a-judge evaluation and partial credit. Because independent reward components are defined through the directory structure, verifiers are easy to understand at a glance even without reading the code. Evaluating multiple criteria in parallel and in isolation is natively supported in Reward Kit.
## [Design principles](https://www.harborframework.com/docs/rewardkit/motivation#design-principles)
  * **Simplicity:** Verifiers are defined by directory structure, making them easy to read at a glance. Common checks are one-liners. Custom logic is a decorated function. Judges are reusable TOML files.
  * **Reuse and sharing:** Reward criteria are plain files in a directory. Share them across tasks and version in git.
  * **Zero boilerplate:** 20+ built-in criteria for files, commands, JSON, CSV, HTTP, images, and trajectories. LLM- and Agent-as-a-Judge is supported natively.
  * **Isolation:** Criteria can be run in isolated filesystem snapshots so they can't interfere with each other or corrupt the agent's workspace.


[Built-in Criteria Reference for all built-in criterion functions](https://www.harborframework.com/docs/rewardkit/built-in-criteria)[Contributing Contributing to Harbor](https://www.harborframework.com/docs/contributing)
[Motivation](https://www.harborframework.com/docs/rewardkit/motivation#motivation)[Design principles](https://www.harborframework.com/docs/rewardkit/motivation#design-principles)
