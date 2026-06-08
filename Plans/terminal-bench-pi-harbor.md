# Terminal-Bench + Harbor for Pi harness

## Goal

Make Terminal-Bench repeatable for benchmarking this Pi agent harness from dotfiles, on Bluefin now and macOS later.

## Findings

- Terminal-Bench is a Harbor-native dataset. Harbor runs tasks in sandboxed environments, then runs verifier tests and writes rewards/logs under `jobs/`.
- Harbor install is `uv tool install harbor`.
- Harbor already ships a built-in `pi` agent, but its adapter currently installs `@mariozechner/pi-coding-agent@latest` (`0.73.1` on npm), while this harness uses `@earendil-works/pi-coding-agent` (`0.78.1` locally). Use a custom adapter instead of Harbor built-in `-a pi`.
- Pi can run headless:
  - `pi --print "prompt"`
  - `pi --print --mode json --no-session "prompt"`
  - `pi --mode rpc` for integration.
- Pi non-interactive modes ignore project-local inputs unless trusted or passed `--approve` in latest docs. For Terminal-Bench containers, use a dedicated uploaded config dir and avoid relying on interactive trust.
- Pi can use tools in headless mode (`read`, `bash`, `edit`, `write`; optional `grep`, `find`, `ls`). This matches Terminal-Bench needs.
- Pi cannot safely use host subscription/OAuth auth inside Harbor containers unless auth files are copied or mounted. Prefer API keys via environment variables for repeatable benchmarking. Copying `~/.pi/agent/auth.json` should be explicit opt-in only.
- Terminal-Bench is repeatable enough for harness regression testing if model, task set, agent config, version, timeouts, concurrency, and env are pinned. Absolute results will still vary because hosted LLMs are nondeterministic and models can change server-side.

## Implementation plan

1. Add chezmoi-managed Harbor install script:
   - `.chezmoiscripts/run_onchange_after_02c-install-harbor.sh.tmpl`
   - skip remote hosts
   - use brew-provided `uv` on Bluefin/macOS, fallback to mise-managed `uv` if present
   - run `uv tool install --upgrade harbor`

2. Add custom Harbor Pi adapter:
   - `dot_config/harbor/agents/pi_earendil.py` -> `~/.config/harbor/agents/pi_earendil.py`
   - install Node 22 via nvm in the task container
   - install `@earendil-works/pi-coding-agent` (version configurable)
   - optionally upload tracked dotfiles Pi config from `dot_pi/agent` or host `~/.pi/agent`
   - install `minion-subagents` dependency if present
   - run `pi --print --mode json --no-session` with selected provider/model/thinking
   - pass API-key provider env vars from host to container
   - write `/logs/agent/pi.jsonl` and parse token/cost from `message_end` events

3. Add repeatable wrapper script:
   - `dot_local/bin/scripts/executable_pi-terminal-bench`
   - supports smoke/oracle and Pi runs
   - defaults: Terminal-Bench 2, one task, one concurrent trial, jobs under `~/benchmarks/terminal-bench/jobs`
   - accepts model, task glob, task count, concurrency, thinking, config dir, package version, jobs dir
   - prints exact Harbor command before running

4. Validate locally:
   - install Harbor now with `uv tool install --upgrade harbor`
   - run `harbor --version` and `harbor run --help`
   - run cheap Oracle smoke on one small task if Docker can build/pull
   - run adapter smoke with a tiny local Harbor task if full Terminal-Bench pull is too slow
   - optionally run one Terminal-Bench task with Pi using an API-key model (`openai/gpt-4o-mini` or configured model)

## Validation results

Ran on ThinkPad P14 / Bluefin:

```bash
uv tool install --upgrade harbor
harbor --version  # 0.13.1

./dot_local/bin/scripts/executable_pi-terminal-bench oracle \
  --task-pattern '*openssl*' \
  --tasks 1 \
  --concurrency 1 \
  --jobs-dir "$PWD/.tmp/harbor-jobs"
# Result: reward 1.0, no exceptions, runtime ~56s

./dot_local/bin/scripts/executable_pi-terminal-bench pi \
  --model openai/gpt-4o-mini \
  --thinking off \
  --task-pattern '*openssl*' \
  --tasks 1 \
  --concurrency 1 \
  --jobs-dir "$PWD/.tmp/harbor-jobs" \
  --agent-import "$PWD/dot_config/harbor/agents/pi_earendil.py:PiEarendil"
# Result: adapter ran, no infrastructure exceptions, reward 0.0, runtime ~2m46s
```

The Pi trial failed the verifier because `gpt-4o-mini` issued dependent OpenSSL commands in parallel in one turn; Pi executed sibling tool calls in parallel, so certificate creation ran before key generation was usable. This is useful benchmark signal, not adapter failure. Use stronger models and/or a stable benchmark system prompt if comparing harness versions.

## Repeatability guidance

Use fixed commands for comparisons:

```bash
pi-terminal-bench oracle --tasks 1 --task-pattern openssl-selfsigned-cert
pi-terminal-bench pi --model openai/gpt-4o-mini --thinking off --tasks 1 --task-pattern openssl-selfsigned-cert
```

For meaningful harness comparisons:

- keep same model and provider
- keep same task subset or full dataset version
- keep same Pi package version and config source
- run multiple attempts (`--attempts 3+`) for noisy tasks
- compare Harbor `result.json`, token/cost, and verifier logs
- store jobs in timestamped dirs and commit/share summaries, not secrets
