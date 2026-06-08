---
title: "Built"
description: "Reference for all built-in criterion functions"
domain: "www.harborframework.com"
source: "https://www.harborframework.com/docs/rewardkit/built-in-criteria"
scraped_at: "2026-06-08T07:02:40Z"
etag: "\"e844f98a72218102f6cf3524fd200411\""
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
Built-in CriteriaFile criteria
Reward Kit
# Built-in Criteria
Copy Markdown
Reference for all built-in criterion functions
Rewardkit ships with built-in criteria for common rubrics. Use them from any Python file in your tests directory:

```
import rewardkit as rk

rk.file_exists("output.txt")
rk.command_succeeds("python main.py", weight=2.0)
```

All criteria accept optional `weight` (default 1.0) and `isolated` (default false) parameters in addition to the ones listed below.
## [File criteria](https://www.harborframework.com/docs/rewardkit/built-in-criteria#file-criteria)  
| Criterion  | Parameters  | Description  |  
| --- | --- | --- |  
| `file_exists`  | `path`  | File exists in workspace  |  
| `file_not_exists`  | `path`  | File does not exist  |  
| `file_contains`  | `path, text`  | File contains a substring  |  
| `file_contains_regex`  | `path, pattern`  | File content matches a regex pattern  |  
| `file_matches`  | `path, expected`  | File content equals expected text (whitespace-stripped)  |  
| `files_equal`  | `path1, path2`  | Two files have identical content  |  
| `diff_ratio`  | `path, expected`  | Similarity ratio between file content and expected text (returns 0.0–1.0)  |  
## [Command criteria](https://www.harborframework.com/docs/rewardkit/built-in-criteria#command-criteria)  
| Criterion  | Parameters  | Description  |  
| --- | --- | --- |  
| `command_succeeds`  | `cmd, cwd?, timeout?`  | Command exits with code 0  |  
| `command_output_contains`  | `cmd, text, cwd?, timeout?`  | Command stdout contains text  |  
| `command_output_matches`  | `cmd, expected, cwd?, timeout?`  | Command stdout equals expected (stripped)  |  
| `command_output_matches_regex`  | `cmd, pattern, cwd?, timeout?`  | Command stdout matches a regex  |  
Default timeout is 30 seconds. The `cwd` parameter is relative to the workspace.
## [Data format criteria](https://www.harborframework.com/docs/rewardkit/built-in-criteria#data-format-criteria)  
| Criterion  | Parameters  | Description  |  
| --- | --- | --- |  
| `json_key_equals`  | `path, key, expected`  | Top-level JSON key equals a value  |  
| `json_path_equals`  | `path, json_path, expected`  | Dot-separated path into JSON equals a value  |  
| `csv_cell_equals`  | `path, row, col, expected`  | CSV cell at row/col equals a value  |  
| `xlsx_cell_equals`  | `path, cell, expected, sheet?`  | Excel cell equals a value  |  
| `sqlite_query_equals`  | `db_path, query, expected`  | SQL query result equals a value  |  
`xlsx_cell_equals` requires the `documents` extra: `uv add   harbor-rewardkit[documents]`
For `csv_cell_equals`, row numbering depends on the column type. When `col` is an **integer** , a raw CSV reader is used and row 0 is the header row. When `col` is a **string** (column name), row 0 is the first data row after the header.
## [HTTP criteria](https://www.harborframework.com/docs/rewardkit/built-in-criteria#http-criteria)  
| Criterion  | Parameters  | Description  |  
| --- | --- | --- |  
| `http_status_equals`  | `url, status?, timeout?`  | HTTP response has the expected status code (default 200)  |  
| `http_response_contains`  | `url, text, timeout?`  | HTTP response body contains text  |  
## [Image criteria](https://www.harborframework.com/docs/rewardkit/built-in-criteria#image-criteria)  
| Criterion  | Parameters  | Description  |  
| --- | --- | --- |  
| `image_similarity`  | `path1, path2`  | Pixel-level similarity ratio (returns 0.0–1.0)  |  
| `image_size_equals`  | `path, width, height`  | Image has the expected dimensions  |  
Image criteria require the `image` extra: `uv add harbor-rewardkit[image]`
## [Trajectory criteria](https://www.harborframework.com/docs/rewardkit/built-in-criteria#trajectory-criteria)
These criteria inspect the agent's ATIF trajectory file (default path: `/logs/trajectory.json`).  
| Criterion  | Parameters  | Description  |  
| --- | --- | --- |  
| `trajectory_tool_used`  | `tool_name, min_count?, path?`  | Agent used a specific tool at least `min_count` times (default 1)  |  
| `trajectory_tool_not_used`  | `tool_name, path?`  | Agent did not use a specific tool  |  
| `trajectory_turn_count`  | `max_turns, path?`  | Penalizes exceeding a turn budget — returns 1.0 at `max_turns`, linearly decays to 0.0 at double  |  
## [Optional extras](https://www.harborframework.com/docs/rewardkit/built-in-criteria#optional-extras)  
| Extra  | Criteria  | Install  |  
| --- | --- | --- |  
| `documents`  | `xlsx_cell_equals`  | `uv add harbor-rewardkit[documents]`  |  
| `image`  |  `image_similarity`, `image_size_equals`  | `uv add harbor-rewardkit[image]`  |  
| `all`  | All of the above  | `uv add harbor-rewardkit[all]`  |  
[Judge Criteria Evaluating agent outputs with LLMs or agent CLIs via TOML configuration](https://www.harborframework.com/docs/rewardkit/judge-criteria)[Motivation & Design Why Reward Kit exists and its design](https://www.harborframework.com/docs/rewardkit/motivation)
[File criteria](https://www.harborframework.com/docs/rewardkit/built-in-criteria#file-criteria)[Command criteria](https://www.harborframework.com/docs/rewardkit/built-in-criteria#command-criteria)[Data format criteria](https://www.harborframework.com/docs/rewardkit/built-in-criteria#data-format-criteria)[HTTP criteria](https://www.harborframework.com/docs/rewardkit/built-in-criteria#http-criteria)[Image criteria](https://www.harborframework.com/docs/rewardkit/built-in-criteria#image-criteria)[Trajectory criteria](https://www.harborframework.com/docs/rewardkit/built-in-criteria#trajectory-criteria)[Optional extras](https://www.harborframework.com/docs/rewardkit/built-in-criteria#optional-extras)
