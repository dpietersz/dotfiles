---
title: "Evals"
description: "Running a dataset"
domain: "www.harborframework.com"
source: "https://www.harborframework.com/docs/run-jobs/run-evals"
scraped_at: "2026-06-08T07:02:40Z"
etag: "\"b24f29f444836d7d88b93e27ab215085\""
---

[harbor](https://www.harborframework.com/)
[harbor](https://www.harborframework.com/)
`⌘``K`
[docs](https://www.harborframework.com/docs)[news](https://www.harborframework.com/news)[](https://hub.harborframework.com)[](https://discord.gg/6xWPKhGDbA)[Motivation](https://www.harborframework.com/docs)[Getting Started](https://www.harborframework.com/docs/getting-started)[Core Concepts](https://www.harborframework.com/docs/core-concepts)[Migrating from Terminal-Bench](https://www.harborframework.com/docs/migration)
Run Jobs
[Run Jobs](https://www.harborframework.com/docs/run-jobs)[Evals](https://www.harborframework.com/docs/run-jobs/run-evals)[Artifact Collection](https://www.harborframework.com/docs/run-jobs/results-and-artifacts)[Sandboxes](https://www.harborframework.com/docs/run-jobs/cloud-sandboxes)
Leaderboard
Tasks
Datasets
Sharing
Agents
Training Workflows
Tutorials
Reward Kit
Contributing
[](https://github.com/laude-institute/harbor)
EvalsWhat is a dataset?
Run Jobs
# Evals
Copy Markdown
Running a dataset
## [What is a dataset?](https://www.harborframework.com/docs/run-jobs/run-evals#what-is-a-dataset)
In Harbor, a dataset is a collection of [Harbor tasks](https://www.harborframework.com/docs/tasks). A task includes an instruction, environment, and test script. Use datasets to evaluate, train, or tune prompts.
## [Viewing registered benchmarks](https://www.harborframework.com/docs/run-jobs/run-evals#viewing-registered-benchmarks)
Harbor resolves published datasets from its package registry. `harbor run -d "<org>/<dataset>"` uses the configured registry.
Use `--registry-path` or `--registry-url` only for legacy `registry.json` setups.
To list available datasets:

```
harbor dataset list
```

## [Running a benchmark](https://www.harborframework.com/docs/run-jobs/run-evals#running-a-benchmark)
> **Windows tasks.** Datasets containing tasks with `[environment].os = "windows"` require a Windows host with Docker Desktop in Windows container mode. If the daemon is in the wrong mode (or the task's image doesn't match), Harbor fails fast at start with a clear error. See [Windows tasks](https://www.harborframework.com/docs/tasks/windows-container-support).
Terminal-Bench:

```
harbor run -d terminal-bench/terminal-bench-2 -m "<model>" -a "<agent>"
```

Harbor resolves package metadata and downloads task artifacts as needed.
By default, omitted task resources use the provider's default sizing. When a task sets `cpus` or `memory_mb`, `--cpus` and `--memory` control how Harbor applies those values. See [Managing Resources](https://www.harborframework.com/docs/tasks/managing-resources) for enforcement policies, provider support, and override flags.
SWE-Bench Verified:

```
harbor run -d swe-bench/swe-bench-verified -m "<model>" -a "<agent>"
```

Omit the tag to use the latest dataset.
For dataset creation, sync, and publishing workflow:
  * [Publishing a dataset](https://www.harborframework.com/docs/datasets/publishing)
  * [Custom Metrics](https://www.harborframework.com/docs/datasets/metrics)


## [Running a local dataset](https://www.harborframework.com/docs/run-jobs/run-evals#running-a-local-dataset)
Run a local dataset with:

```
harbor run -p "<path/to/dataset>" -m "<model>" -a "<agent>"
```

## [Analyzing results](https://www.harborframework.com/docs/run-jobs/run-evals#analyzing-results)
Running the `harbor run` command creates a [job](https://www.harborframework.com/docs/core-concepts#job) which by default is stored in the `jobs` directory.
The file structure looks something like this:

```
jobs/job-name
├── config.json               # Job config
├── result.json               # Job result
├── trial-name
│   ├── config.json           # Trial config
│   ├── result.json           # Trial result
│   ├── agent                 # Agent directory, contents depend on agent implementation
│   │   ├── recording.cast
│   │   └── trajectory.json
│   └── verifier              # Verifier directory, contents depend on test.sh implementation
│       ├── ctrf.json
│       ├── reward.txt
│       ├── test-stderr.txt
│       └── test-stdout.txt
└── ...                       # More trials
```

### [Using the viewer](https://www.harborframework.com/docs/run-jobs/run-evals#using-the-viewer)
Harbor includes a web-based results viewer for browsing jobs, inspecting trials, and analyzing agent trajectories. To launch it, point it at your jobs directory:

```
harbor view jobs
```

This starts a local web server (default `http://127.0.0.1:8080`) where you can:
  * **Browse jobs** — Filter and search by agent, model, dataset, and date range.
  * **Inspect trials** — View trial results, rewards, durations, and errors for each task.
  * **View trajectories** — Step through the agent's execution including tool calls, observations, and multimodal content (text and images).
  * **Analyze performance** — See token usage breakdowns, timing metrics (environment setup, agent execution, verification), and verifier output.
  * **Compare jobs** — Select multiple jobs to view a side-by-side comparison matrix of task performance across agent/model combinations.
  * **View artifacts** — Browse files collected from the sandbox after each trial (see [Artifact Collection](https://www.harborframework.com/docs/run-jobs/results-and-artifacts)).
  * **Generate summaries** — Use AI-powered summarization to analyze job failures.


The viewer supports keyboard navigation (`j`/`k` to move between rows, `Enter` to open, `Esc` to deselect).  
| Option  | Description  |  
| --- | --- |  
|  `--port`, `-p`  | Port or port range (e.g., `8080` or `8080-8089`). Default: `8080-8089`  |  
| `--host`  | Host to bind the server to. Default: `127.0.0.1`  |  
| `--dev`  | Run frontend in development mode with hot reloading  |  
[Run Jobs Run evaluations, scale execution, and inspect outputs](https://www.harborframework.com/docs/run-jobs)[Artifact Collection Collecting files from the sandbox after a trial completes](https://www.harborframework.com/docs/run-jobs/results-and-artifacts)
[What is a dataset?](https://www.harborframework.com/docs/run-jobs/run-evals#what-is-a-dataset)[Viewing registered benchmarks](https://www.harborframework.com/docs/run-jobs/run-evals#viewing-registered-benchmarks)[Running a benchmark](https://www.harborframework.com/docs/run-jobs/run-evals#running-a-benchmark)[Running a local dataset](https://www.harborframework.com/docs/run-jobs/run-evals#running-a-local-dataset)[Analyzing results](https://www.harborframework.com/docs/run-jobs/run-evals#analyzing-results)[Using the viewer](https://www.harborframework.com/docs/run-jobs/run-evals#using-the-viewer)
