---
title: "Jobs"
description: "Share uploaded Harbor jobs and trials"
domain: "www.harborframework.com"
source: "https://www.harborframework.com/docs/sharing/jobs"
scraped_at: "2026-06-08T07:02:40Z"
etag: "\"cd24d47bc420e8e287006ff7ed75ced0\""
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
[Tasks and Datasets](https://www.harborframework.com/docs/sharing/sharing)[Jobs](https://www.harborframework.com/docs/sharing/jobs)
Agents
Training Workflows
Tutorials
Reward Kit
Contributing
[](https://github.com/laude-institute/harbor)
JobsUpload an existing job
Sharing
# Jobs
Copy Markdown
Share uploaded Harbor jobs and trials
Jobs are run results. Upload a job to [Harbor Hub](https://hub.harborframework.com/jobs) to get a shareable link, then download the full job or a single trial by ID. Run `harbor auth login` first.
## [Upload an existing job](https://www.harborframework.com/docs/sharing/jobs#upload-an-existing-job)

```
harbor upload jobs/my-job
harbor upload jobs/my-job --public
harbor upload jobs/my-job --private
harbor upload jobs/my-job --share-org my-org --share-user alice
```

New uploads are private unless you pass `--public`. Re-uploading is idempotent: without a visibility flag, Harbor keeps the server-side visibility unchanged; with `--public` or `--private`, it updates visibility.
Useful flags:
  * `-c, --concurrency <n>`: max concurrent trial uploads.
  * `--share-org <org>`: share with an organization. Repeatable.
  * `--share-user <username>`: share with a GitHub user. Repeatable.
  * `-y, --yes`: confirm shares with orgs you are not a member of.


## [Upload while running](https://www.harborframework.com/docs/sharing/jobs#upload-while-running)

```
harbor run -d "my-org/my-dataset@latest" -a "<agent>" -m "<model>" --upload
harbor run -d "my-org/my-dataset@latest" -a "<agent>" -m "<model>" --upload --public
harbor run -d "my-org/my-dataset@latest" -a "<agent>" -m "<model>" --upload --share-org my-org
```

`--upload` streams trials as they finish and finalizes the job archive at the end. `--public`, `--private`, `--share-org`, and `--share-user` require `--upload`.
If a run finishes but upload does not, rerun:

```
harbor upload <job-dir>
```

## [Resume with upload](https://www.harborframework.com/docs/sharing/jobs#resume-with-upload)

```
harbor job resume -p jobs/my-job --upload
harbor job resume -p jobs/my-job --upload --private --share-user alice
```

This fills in missing trials and finalizes a partially uploaded job.
## [Share an uploaded job](https://www.harborframework.com/docs/sharing/jobs#share-an-uploaded-job)
Find job IDs from the job page in Harbor Hub.

```
harbor job share <job-id> --org my-org
harbor job share <job-id> --user alice --user bob
```

Private jobs are visible to the owner and explicit shares. Public jobs are visible to everyone. Shares add access; they do not replace public/private visibility.
## [Download results](https://www.harborframework.com/docs/sharing/jobs#download-results)
Use job and trial download commands for uploaded results. Top-level `harbor download` is for tasks and datasets. Job and trial IDs are easy to find from the matching job and trial pages in Harbor Hub.

```
harbor job download <job-id>
harbor trial download <trial-id>
```

Defaults:
  * Jobs download to `./jobs/<job-name>`.
  * Trials download to `./trials/<trial-name>`.
  * Use `-o, --output-dir <dir>` to choose a parent directory.
  * Use `--overwrite` to replace an existing local job or trial directory.


[Tasks and Datasets Share published Harbor tasks and datasets](https://www.harborframework.com/docs/sharing/sharing)[Agents Using popular agents and integrating your own](https://www.harborframework.com/docs/agents)
[Upload an existing job](https://www.harborframework.com/docs/sharing/jobs#upload-an-existing-job)[Upload while running](https://www.harborframework.com/docs/sharing/jobs#upload-while-running)[Resume with upload](https://www.harborframework.com/docs/sharing/jobs#resume-with-upload)[Share an uploaded job](https://www.harborframework.com/docs/sharing/jobs#share-an-uploaded-job)[Download results](https://www.harborframework.com/docs/sharing/jobs#download-results)
