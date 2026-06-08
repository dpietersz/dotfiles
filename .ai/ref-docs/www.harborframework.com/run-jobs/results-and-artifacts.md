---
title: "Artifact Collection"
description: "Collecting files from the sandbox after a trial completes"
domain: "www.harborframework.com"
source: "https://www.harborframework.com/docs/run-jobs/results-and-artifacts"
scraped_at: "2026-06-08T07:02:40Z"
etag: "\"45763bf385432c027a6fa3d17ec847c5\""
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
Artifact CollectionConvention directory (zero configuration)
Run Jobs
# Artifact Collection
Copy Markdown
Collecting files from the sandbox after a trial completes
Harbor can automatically collect files from the sandbox environment after each trial completes. This is useful for preserving model outputs, logs, generated files, or any other byproducts of the agent's work.
## [Convention directory (zero configuration)](https://www.harborframework.com/docs/run-jobs/results-and-artifacts#convention-directory-zero-configuration)
Any files written to `/logs/artifacts/` inside the sandbox are collected automatically with no configuration needed. For Docker environments, this directory is volume-mounted directly to the host. For remote environments (Daytona, Modal, E2B, Tensorlake, etc.), files are downloaded after the trial finishes.
For example, if your task's test script or agent writes files to `/logs/artifacts/`:

```
# Inside the sandbox
echo "result" > /logs/artifacts/output.txt
cp model.pt /logs/artifacts/model.pt
```

These files will appear in the trial output directory at `<trial_dir>/artifacts/`.
## [Config-driven artifact collection](https://www.harborframework.com/docs/run-jobs/results-and-artifacts#config-driven-artifact-collection)
To collect files from arbitrary paths in the sandbox (not just `/logs/artifacts/`), add an `artifacts` field to your job configuration.
### [Simple form](https://www.harborframework.com/docs/run-jobs/results-and-artifacts#simple-form)
List the paths you want to collect. Each file is saved with its basename under the trial's `artifacts/` directory.
job.yaml

```
artifacts:
  - /app/hello.txt
  - /workspace/output.csv
  - /data/results
```

This saves `hello.txt`, `output.csv`, and the `results/` directory to `<trial_dir>/artifacts/`.
### [Object form](https://www.harborframework.com/docs/run-jobs/results-and-artifacts#object-form)
Use the object form to control where files are saved within the `artifacts/` directory.
job.yaml

```
artifacts:
  - source: /app/hello.txt
    destination: workspace/hello.txt
  - source: /app
    destination: full-workspace
```

This saves `/app/hello.txt` to `<trial_dir>/artifacts/workspace/hello.txt` and copies the entire `/app` directory to `<trial_dir>/artifacts/full-workspace/`.
### [Full example](https://www.harborframework.com/docs/run-jobs/results-and-artifacts#full-example)
job.yaml

```
jobs_dir: jobs
n_attempts: 1
orchestrator:
  type: local
  n_concurrent_trials: 1
environment:
  type: docker
  force_build: true
  delete: true
agents:
  - name: oracle
tasks:
  - path: examples/tasks/hello-world

artifacts:
  - /app/hello.txt
```

## [How collection works](https://www.harborframework.com/docs/run-jobs/results-and-artifacts#how-collection-works)
Artifact collection runs after the agent finishes and after verification completes. It is **best-effort** -- failures to collect an artifact will never cause the trial to fail.
The collection process:
  1. **Convention directory** (`/logs/artifacts/`): For Docker, this is already on disk via volume mount. For remote environments, the directory is downloaded.
  2. **Config-driven paths** : Each path is probed to determine whether it is a file or directory, then downloaded accordingly.
  3. **Manifest** : A `manifest.json` file is written to the artifacts directory listing what was collected.


## [Output structure](https://www.harborframework.com/docs/run-jobs/results-and-artifacts#output-structure)
After collection, the trial directory contains:

```
<trial_dir>/
├── artifacts/
│   ├── manifest.json       # Collection manifest
│   ├── output.txt          # Files from /logs/artifacts/
│   └── hello.txt           # Config-driven artifact
├── agent/
├── verifier/
├── config.json
└── result.json
```

The manifest tracks each artifact's source, destination, type (file or directory), and whether collection succeeded:
manifest.json

```
[
  {
    "source": "/logs/artifacts",
    "destination": "artifacts",
    "type": "directory",
    "status": "ok"
  },
  {
    "source": "/app/hello.txt",
    "destination": "artifacts/hello.txt",
    "type": "file",
    "status": "ok"
  }
]
```

## [Viewing artifacts](https://www.harborframework.com/docs/run-jobs/results-and-artifacts#viewing-artifacts)
Artifacts are viewable in the Harbor results viewer. Run `harbor view` and navigate to a trial to see collected artifacts under the Artifacts tab.
## [Environment support](https://www.harborframework.com/docs/run-jobs/results-and-artifacts#environment-support)
Artifact collection works across all environment types:  
| Environment  | Convention directory  | Config-driven paths  |  
| --- | --- | --- |  
| Docker  | Volume-mounted (no download needed)  | Downloaded after trial  |  
| Daytona  | Downloaded after trial  | Downloaded after trial  |  
| Modal  | Downloaded after trial  | Downloaded after trial  |  
| E2B  | Downloaded after trial  | Downloaded after trial  |  
| Tensorlake  | Downloaded after trial  | Downloaded after trial  |  
[Evals Running a dataset](https://www.harborframework.com/docs/run-jobs/run-evals)[Sandboxes Horizontal scaling using cloud sandboxes](https://www.harborframework.com/docs/run-jobs/cloud-sandboxes)
[Convention directory (zero configuration)](https://www.harborframework.com/docs/run-jobs/results-and-artifacts#convention-directory-zero-configuration)[Config-driven artifact collection](https://www.harborframework.com/docs/run-jobs/results-and-artifacts#config-driven-artifact-collection)[Simple form](https://www.harborframework.com/docs/run-jobs/results-and-artifacts#simple-form)[Object form](https://www.harborframework.com/docs/run-jobs/results-and-artifacts#object-form)[Full example](https://www.harborframework.com/docs/run-jobs/results-and-artifacts#full-example)[How collection works](https://www.harborframework.com/docs/run-jobs/results-and-artifacts#how-collection-works)[Output structure](https://www.harborframework.com/docs/run-jobs/results-and-artifacts#output-structure)[Viewing artifacts](https://www.harborframework.com/docs/run-jobs/results-and-artifacts#viewing-artifacts)[Environment support](https://www.harborframework.com/docs/run-jobs/results-and-artifacts#environment-support)
