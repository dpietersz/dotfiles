---
title: "Submit to a leaderboard"
description: "Upload evaluation jobs to Harbor Hub and submit them to an official leaderboard"
domain: "www.harborframework.com"
source: "https://www.harborframework.com/docs/leaderboard/submit"
scraped_at: "2026-06-08T07:02:40Z"
etag: "\"689bc6b28fdfb2f85a4db80b5d781411\""
---

[harbor](https://www.harborframework.com/)
[harbor](https://www.harborframework.com/)
`⌘``K`
[docs](https://www.harborframework.com/docs)[news](https://www.harborframework.com/news)[](https://hub.harborframework.com)[](https://discord.gg/6xWPKhGDbA)[Motivation](https://www.harborframework.com/docs)[Getting Started](https://www.harborframework.com/docs/getting-started)[Core Concepts](https://www.harborframework.com/docs/core-concepts)[Migrating from Terminal-Bench](https://www.harborframework.com/docs/migration)
Run Jobs
Leaderboard
[Submit to a leaderboard](https://www.harborframework.com/docs/leaderboard/submit)
Tasks
Datasets
Sharing
Agents
Training Workflows
Tutorials
Reward Kit
Contributing
[](https://github.com/laude-institute/harbor)
Submit to a leaderboardWorkflow
Leaderboard
# Submit to a leaderboard
Copy Markdown
Upload evaluation jobs to Harbor Hub and submit them to an official leaderboard
After you run a benchmark and upload the job to [Harbor Hub](https://hub.harborframework.com/), use `harbor leaderboard submit` to enter the official review queue for a leaderboard. Harbor checks your job against leaderboard rules and either accepts it as a **pending** submission or explains what to fix.
Available leaderboards
Only `terminal-bench/terminal-bench-2-1` can be submitted through Harbor today. Additional leaderboards will be supported soon; use `--leaderboard` with the slug published for each benchmark when they launch.
Before you start
Sign in with `harbor auth login`, finish your eval run, and upload the job with `harbor upload`. You need the job id from the upload output and a `metadata.yaml` file that describes your agent and models.
## [Workflow](https://www.harborframework.com/docs/leaderboard/submit#workflow)

```
flowchart LR
  RUN["harbor run"]
  UP["harbor upload"]
  SUB["harbor leaderboard submit"]
  RUN --> UP --> SUB
```

  1. **Run the benchmark** using the dataset and settings required by the leaderboard. Many leaderboards require at least five attempts per task; pass `-k 5` (or higher) on `harbor run` when that applies.



```
harbor run -d terminal-bench/terminal-bench-2-1 -a claude-code -m anthropic/claude-opus-4-1 -k 5
```

  1. **Upload the job** so Harbor Hub has your config, results, and trial artifacts.



```
harbor upload jobs/<job_name>/
```

When upload finishes, note the job id in the **View at** link (the UUID at the end of the URL).
  1. **Submit to the leaderboard** with that job id, the leaderboard slug, and your metadata file.



```
harbor leaderboard submit \
  --leaderboard terminal-bench/terminal-bench-2-1 \
  --job-id <JOB_UUID> \
  --metadata ./metadata.yaml
```

If submission succeeds, the CLI prints a **submission id**. That submission stays pending until leaderboard admins review and publish it.
## [Sign in](https://www.harborframework.com/docs/leaderboard/submit#sign-in)

```
harbor auth login
harbor auth status
```

You must be signed in as the owner of every job you submit. Jobs created by another account cannot be attached to your submission.
## [Command reference](https://www.harborframework.com/docs/leaderboard/submit#command-reference)

```
harbor leaderboard submit --help
```
  
| Flag  | Short  | When you need it  | Description  |  
| --- | --- | --- | --- |  
| `--leaderboard`  | `-l`  | Always  | Leaderboard slug (for example `terminal-bench/terminal-bench-2-1`).  |  
| `--job-id`  | `-j`  | New submissions; adding jobs  | Job id from `harbor upload`. Use multiple times for several jobs in one submission.  |  
| `--metadata`  | `-m`  | New submissions; changing metadata  | Path to `metadata.yaml`.  |  
| `--submission`  | `-s`  | Updating an existing entry  | Submission id from a previous successful submit.  |  
| `--output`  | `-o`  | Optional  | Save a detailed validation report as JSON.  |  
### [New submission](https://www.harborframework.com/docs/leaderboard/submit#new-submission)
Provide at least one job and metadata:

```
harbor leaderboard submit -l terminal-bench/terminal-bench-2-1 -j <JOB_UUID> -m ./metadata.yaml
```

### [Add another job to a pending submission](https://www.harborframework.com/docs/leaderboard/submit#add-another-job-to-a-pending-submission)
Use the same submission id and pass another job id. You do not need to pass metadata again unless you want to change it.

```
harbor leaderboard submit \
  -l terminal-bench/terminal-bench-2-1 \
  -s <SUBMISSION_UUID> \
  -j <ANOTHER_JOB_UUID>
```

Every job on a submission must use the same dataset version. Trial counts and coverage rules apply across **all** jobs on that submission together.
### [Update metadata only](https://www.harborframework.com/docs/leaderboard/submit#update-metadata-only)

```
harbor leaderboard submit -l terminal-bench/terminal-bench-2-1 -s <SUBMISSION_UUID> -m ./metadata.yaml
```

## [metadata.yaml](https://www.harborframework.com/docs/leaderboard/submit#metadatayaml)
Describe the agent and models you evaluated. Harbor checks the file format before submitting.

```
agent_url: https://github.com/example/my-agent
agent_display_name: My Agent
agent_org_display_name: My Org

models:
  - model_name: claude-opus-4-1
    model_provider: anthropic
    model_display_name: Claude Opus 4.1
    model_org_display_name: Anthropic
```
  
| Field  | Description  |  
| --- | --- |  
| `agent_url`  | Link to your agent (repository or product page).  |  
| `agent_display_name`  | Name shown on the leaderboard.  |  
| `agent_org_display_name`  | Organization shown for the agent.  |  
| `models`  | One or more models used in the run. Each entry needs `model_name`, `model_provider`, `model_display_name`, and `model_org_display_name`.  |  
The metadata file can live anywhere on disk; Harbor does not pick it up from the job folder automatically.
## [Validation](https://www.harborframework.com/docs/leaderboard/submit#validation)
Harbor validates your submission before it is accepted. Typical requirements include:
  * The leaderboard exists and your jobs belong to you.
  * Each job is uploaded with complete trial results for the leaderboard dataset.
  * Task versions match what the leaderboard dataset expects.
  * At least five trials per task (across all jobs on the submission when you attach more than one job).
  * Standard job and trial settings (no custom timeout or resource overrides).
  * Trajectories for trials that passed, when the leaderboard requires them.


If validation fails, the CLI lists what failed. Fix the underlying run or upload, then submit again.
When validation passes, you may see an **unofficial accuracy** figure based on completed trials. That number is informational only; admins still review the full submission.
After static validation, Harbor Hub queues **dynamic validation** (LLM analyze of trajectories). That runs on a separate worker service, not inside the CLI. Until it completes, `dynamic_status` on the submission may stay `pending` or `running`.
To keep a copy of the full report:

```
harbor leaderboard submit -l terminal-bench/terminal-bench-2-1 -j <JOB_UUID> -m ./metadata.yaml -o ./validation-report.json
```

## [After a successful submit](https://www.harborframework.com/docs/leaderboard/submit#after-a-successful-submit)
  * Your job is linked to the pending submission and made **public** so reviewers can inspect it.
  * You can add more jobs to the same pending submission with `--submission` and another `--job-id`.
  * You generally **cannot edit or delete** a job after it is part of a submission. Upload corrections as a new job and attach it, or start a new submission if the leaderboard allows it.


Only **pending** submissions can be updated. Published or rejected submissions cannot be changed through this command.
## [Multiple jobs in one submission](https://www.harborframework.com/docs/leaderboard/submit#multiple-jobs-in-one-submission)
Shard a large run, rerun failed tasks, or upload incrementally:

```
harbor leaderboard submit -l terminal-bench/terminal-bench-2-1 -j <JOB_A> -j <JOB_B> -m ./metadata.yaml
```

Or attach jobs one at a time with the same `--submission` id. Minimum trials per task and dataset consistency are evaluated over the combined set of jobs.
## [Troubleshooting](https://www.harborframework.com/docs/leaderboard/submit#troubleshooting)  
| What you see  | What to do  |  
| --- | --- |  
| Not authenticated  | Run `harbor auth login`.  |  
| No leaderboard matches slug  | Check the slug matches Harbor Hub exactly (for example `terminal-bench/terminal-bench-2-1`).  |  
| Job not found or not accessible  | Confirm the job id from your upload and that you own the job.  |  
| No trials uploaded  | Upload the job again and ensure trials finished successfully.  |  
| Already linked to another pending submission  | That job is already on a different open submission for this leaderboard. Finish or withdraw that submission first, or submit a different job.  |  
| Minimum trials per task  | Run more trials per task (often at least five) on the correct dataset version, then upload and submit again.  |  
| Different dataset version than the submission  | All jobs on one submission must use the same dataset revision. Check `config.json` / dataset pins on each job.  |  
## [See also](https://www.harborframework.com/docs/leaderboard/submit#see-also)
  * [Run evals](https://www.harborframework.com/docs/run-jobs/run-evals)
  * [Results and artifacts](https://www.harborframework.com/docs/run-jobs/results-and-artifacts)
  * [Running Terminal-Bench](https://www.harborframework.com/docs/tutorials/running-terminal-bench)


[Sandboxes Horizontal scaling using cloud sandboxes](https://www.harborframework.com/docs/run-jobs/cloud-sandboxes)[Task Structure Creating and running tasks for agentic environments](https://www.harborframework.com/docs/tasks)
[Workflow](https://www.harborframework.com/docs/leaderboard/submit#workflow)[Sign in](https://www.harborframework.com/docs/leaderboard/submit#sign-in)[Command reference](https://www.harborframework.com/docs/leaderboard/submit#command-reference)[New submission](https://www.harborframework.com/docs/leaderboard/submit#new-submission)[Add another job to a pending submission](https://www.harborframework.com/docs/leaderboard/submit#add-another-job-to-a-pending-submission)[Update metadata only](https://www.harborframework.com/docs/leaderboard/submit#update-metadata-only)[metadata.yaml](https://www.harborframework.com/docs/leaderboard/submit#metadatayaml)[Validation](https://www.harborframework.com/docs/leaderboard/submit#validation)[After a successful submit](https://www.harborframework.com/docs/leaderboard/submit#after-a-successful-submit)[Multiple jobs in one submission](https://www.harborframework.com/docs/leaderboard/submit#multiple-jobs-in-one-submission)[Troubleshooting](https://www.harborframework.com/docs/leaderboard/submit#troubleshooting)[See also](https://www.harborframework.com/docs/leaderboard/submit#see-also)
