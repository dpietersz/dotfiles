---
title: "Best practices"
description: "Tips for getting the most out of Paseo and mobile-first agent workflows."
domain: "paseo.sh"
source: "https://paseo.sh/docs/best-practices"
scraped_at: "2026-05-23T07:01:47Z"
---

[![Paseo](https://paseo.sh/logo.svg)Paseo](https://paseo.sh/)
[![Paseo](https://paseo.sh/logo.svg)Paseo](https://paseo.sh/)
[Getting started](https://paseo.sh/docs)[Why Paseo?](https://paseo.sh/docs/why)[Providers](https://paseo.sh/docs/providers)[Supported providers](https://paseo.sh/docs/supported-providers)[Custom providers](https://paseo.sh/docs/custom-providers)[CLI](https://paseo.sh/docs/cli)[Paseo MCP](https://paseo.sh/docs/mcp)[Git worktrees](https://paseo.sh/docs/worktrees)[Schedules](https://paseo.sh/docs/schedules)[Skills](https://paseo.sh/docs/skills)[Voice](https://paseo.sh/docs/voice)[Configuration](https://paseo.sh/docs/configuration)[Security](https://paseo.sh/docs/security)[Best practices](https://paseo.sh/docs/best-practices)
Alternatives
[Conductor](https://paseo.sh/docs/alternatives/conductor)[Superset](https://paseo.sh/docs/alternatives/superset)[OpenChamber](https://paseo.sh/docs/alternatives/openchamber)[Happy Coder](https://paseo.sh/docs/alternatives/happy-coder)
#  [#](https://paseo.sh/docs/best-practices#best-practices)Best practices
What I've learned from using Paseo daily. Not rules, just patterns that have worked for me.
##  [#](https://paseo.sh/docs/best-practices#agents-replace-typing-not-thinking)Agents replace typing, not thinking
Your role has changed. You're no longer the one writing code line by line. You're the one making decisions: what to build, how it should work, what the architecture looks like. The agent executes, but you direct.
You can't just say "implement feature X" and walk away. You still have to do the hard part: deciding what to build, how it fits into the system, what trade-offs to make. Thinking is not optional. At least for now, agents replace the typing, not the thinking.
##  [#](https://paseo.sh/docs/best-practices#verification-loops)Verification loops
The agent needs a way to verify its work. TDD is one implementation of this pattern: get the agent to write a failing test, verify it fails for the right reasons, then tell it to make the test pass. The agent can loop on its own because it knows what "done" means.
##  [#](https://paseo.sh/docs/best-practices#invest-in-tooling)Invest in tooling
It's not just test runners. For web apps, something like Playwright MCP lets the agent take screenshots and verify UI changes. For a SaaS app I built a CLI that wraps all the business logic so the agent could launch jobs, check statuses, and scrape data without going through the UI.
Code is cheap with coding agents. I would have never written that CLI before because it felt like wasted effort. Now I bootstrap tooling first. It pays off exponentially.
##  [#](https://paseo.sh/docs/best-practices#agents-are-cheap)Agents are cheap
Don't be shy about running multiple agents. Paseo lets you launch agents in isolated worktrees. Kick one off with voice while walking, then kick off another. They work independently. You get a notification when they're done.
##  [#](https://paseo.sh/docs/best-practices#use-voice-extensively)Use voice extensively
It's much more natural to use voice to communicate ideas and pull them out of your brain. The agent will parse and organize your thoughts better than if you try to write the perfect prompt. You don't need to organize anything. Just talk.
Current speech-to-text models are really good. They catch accents, acronyms, technical terms. And even when they don't, the LLM will infer what you meant.
##  [#](https://paseo.sh/docs/best-practices#understand-the-type-of-work)Understand the type of work
Sometimes you need to plan: design a spec, verify it, get the agent to follow through. Maybe it takes a couple of agents to work through it. Other times it's conversational: kick off a single agent and start talking, asking questions. Match your approach to the task.
##  [#](https://paseo.sh/docs/best-practices#iterate-and-refactor-often)Iterate and refactor often
Don't expect perfect. Expect working. Make it work, make it correct, make it beautiful. Each iteration gets you closer. With tests, refactoring is cheap.
I don't let myself add too many features before stopping to refactor. Sometimes I kick off an agent and have it trace code paths, explain dependencies, show me how modules connect. I make mental notes during code review and circle back.
##  [#](https://paseo.sh/docs/best-practices#use-agents-to-check-agents)Use agents to check agents
If an agent implements something and you ask it to review its own work, it will never find issues. Launch a separate agent with a fresh context to review the first agent's code. It will catch things the first agent missed or glossed over. An agent might say it's done when it's not. Another agent can detect that.
##  [#](https://paseo.sh/docs/best-practices#learn-your-agents-quirks)Learn your agents' quirks
People argue about which model is better. That's the wrong question. Each model has strengths and weaknesses. Knowing them is more useful than chasing benchmarks. Benchmarks don't mean anything. You need to try the models yourself to form an opinion.
I use Claude Code as my main driver because it's quick and uses tools well. But sometimes it jumps to conclusions and gives up too easily. Codex is frustratingly slow but goes deep, doesn't stop, and is methodical. It's also stubborn and too serious. These aren't good or bad traits, just differences you learn to work around. Use the right model for the job.
[View this page on GitHub](https://github.com/getpaseo/paseo/blob/main/public-docs/best-practices.md)
