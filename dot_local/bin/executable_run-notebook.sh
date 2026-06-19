#!/bin/bash
# run-notebook.sh — submit a Databricks notebook as a one-time job run on a
# cluster, poll it to completion, and print the run URL + result. Wraps the
# `databricks` CLI (auth via a profile in ~/.databrickscfg) and mirrors how
# our ADF pipelines run notebooks (notebook_task on an existing cluster).
#
# Usage:
#   run-notebook.sh [options] <workspace-notebook-path>
#
# Options:
#   -c, --cluster ID    Cluster to run on. Default: $DATABRICKS_CLUSTER_ID, else
#                       the first currently RUNNING cluster in the workspace.
#   -p, --profile NAME  databricks CLI profile (default: $DATABRICKS_CONFIG_PROFILE
#                       or DEFAULT).
#   -P, --param K=V     Notebook widget parameter, repeatable (-> base_parameters).
#   -s, --start         If the chosen cluster is TERMINATED, start it and wait.
#   -n, --no-wait       Submit and exit immediately (print run URL, skip polling).
#   -h, --help          Show this help.
#
# Examples:
#   run-notebook.sh "/Repos/d.pietersz@hilversum.nl/Lakehouse/azure-databricks/notebooks/00 Generiek/Kalender/kalender"
#   run-notebook.sh -c 0217-135543-hae8yc52 -s -P "Aantal jaar historie=10" "/Repos/.../kalender"
#
# Notes:
#   * Pass the WORKSPACE path (no .py extension). A trailing ".py" is stripped
#     for convenience so you can paste a repo-relative-ish path.
#   * print() output is shown per-cell on the run page (URL printed below).
#     get-run-output only returns the notebook exit value, so that's what this
#     prints on completion (plus the error/trace on failure).
set -euo pipefail

PROFILE="${DATABRICKS_CONFIG_PROFILE:-DEFAULT}"
CLUSTER="${DATABRICKS_CLUSTER_ID:-}"
START=0
WAIT=1
declare -a PARAMS=()
NB=""

log()  { printf '%s\n' "$*" >&2; }
err()  { printf 'error: %s\n' "$*" >&2; }
die()  { err "$*"; exit 1; }

usage() { sed -n '2,40p' "$0" | sed 's/^# \{0,1\}//'; exit "${1:-0}"; }

# --- parse args -------------------------------------------------------------
while [[ $# -gt 0 ]]; do
  case "$1" in
    -c|--cluster) CLUSTER="${2:-}"; shift 2 ;;
    -p|--profile) PROFILE="${2:-}"; shift 2 ;;
    -P|--param)   PARAMS+=("${2:-}"); shift 2 ;;
    -s|--start)   START=1; shift ;;
    -n|--no-wait) WAIT=0; shift ;;
    -h|--help)    usage 0 ;;
    --)           shift; break ;;
    -*)           die "unknown option: $1 (see --help)" ;;
    *)            [[ -z "$NB" ]] || die "unexpected extra argument: $1"; NB="$1"; shift ;;
  esac
done
[[ $# -gt 0 && -z "$NB" ]] && NB="$1"

[[ -n "$NB" ]] || usage 1
NB="${NB%.py}"   # workspace notebook paths carry no extension

command -v databricks >/dev/null || die "databricks CLI not found on PATH"
command -v jq >/dev/null || die "jq not found on PATH"

declare -a P=(--profile "$PROFILE")

# --- cluster resolution -----------------------------------------------------
cluster_state() {
  databricks clusters get "$1" "${P[@]}" -o json 2>/dev/null | jq -r '.state // "UNKNOWN"'
}

first_running_cluster() {
  databricks clusters list "${P[@]}" -o json 2>/dev/null \
    | jq -r '(if type=="object" then .clusters else . end)
             | map(select(.state=="RUNNING")) | .[0].cluster_id // empty'
}

ensure_running() {
  local id="$1" state
  state="$(cluster_state "$id")"
  if [[ "$state" == "RUNNING" ]]; then return 0; fi
  if [[ "$state" == "TERMINATED" || "$state" == "TERMINATING" || "$state" == "ERROR" ]]; then
    [[ $START -eq 1 ]] || die "cluster $id is $state — re-run with --start to start it"
    log "→ starting cluster $id ($state) ..."
    databricks clusters start "$id" "${P[@]}" >/dev/null 2>&1 || true
  else
    log "→ cluster $id is $state, waiting for RUNNING ..."
  fi
  local i
  for i in $(seq 1 180); do        # up to ~15 min
    state="$(cluster_state "$id")"
    [[ "$state" == "RUNNING" ]] && { log "→ cluster $id is RUNNING"; return 0; }
    [[ "$state" == "TERMINATED" || "$state" == "ERROR" ]] && die "cluster $id entered $state while starting"
    sleep 5
  done
  die "timed out waiting for cluster $id to reach RUNNING"
}

if [[ -z "$CLUSTER" ]]; then
  CLUSTER="$(first_running_cluster)"
  [[ -n "$CLUSTER" ]] || die "no RUNNING cluster found — pass --cluster ID (optionally with --start)"
  log "→ using running cluster: $CLUSTER"
fi
ensure_running "$CLUSTER"

# --- build submit payload ---------------------------------------------------
params_json='{}'
for kv in "${PARAMS[@]:-}"; do
  [[ -n "$kv" ]] || continue
  [[ "$kv" == *=* ]] || die "bad --param '$kv' (expected KEY=VALUE)"
  params_json="$(jq -n --argjson acc "$params_json" --arg k "${kv%%=*}" --arg v "${kv#*=}" \
                 '$acc + {($k): $v}')"
done

submit_json="$(jq -n \
  --arg run_name "adhoc: ${NB##*/}" \
  --arg cluster  "$CLUSTER" \
  --arg nbpath   "$NB" \
  --argjson params "$params_json" \
  '{
     run_name: $run_name,
     tasks: [{
       task_key: "notebook",
       existing_cluster_id: $cluster,
       notebook_task: ({ notebook_path: $nbpath }
         + (if ($params|length) > 0 then { base_parameters: $params } else {} end))
     }]
   }')"

# --- submit -----------------------------------------------------------------
log "→ submitting: $NB"
RUN_ID="$(databricks jobs submit --no-wait "${P[@]}" --json "$submit_json" -o json | jq -r '.run_id')"
[[ -n "$RUN_ID" && "$RUN_ID" != "null" ]] || die "submit failed (no run_id returned)"

run_json="$(databricks jobs get-run "$RUN_ID" "${P[@]}" -o json)"
URL="$(jq -r '.run_page_url // empty' <<<"$run_json")"
log "→ run_id: $RUN_ID"
[[ -n "$URL" ]] && log "→ run page: $URL"

if [[ $WAIT -eq 0 ]]; then
  log "→ --no-wait: not polling. Check the run page above."
  exit 0
fi

# --- poll to completion -----------------------------------------------------
# In a real terminal we overwrite a single status line with \r; when piped
# (e.g. invoked from a script or an agent) we log only on state changes.
lcs="" rs="" msg="" last=""
while true; do
  run_json="$(databricks jobs get-run "$RUN_ID" "${P[@]}" -o json)"
  lcs="$(jq -r '.state.life_cycle_state // empty' <<<"$run_json")"
  rs="$(jq -r '.state.result_state // empty' <<<"$run_json")"
  msg="$(jq -r '.state.state_message // empty' <<<"$run_json")"
  if [[ -t 2 ]]; then
    printf '\r  %-16s %-10s %-45.45s' "$lcs" "$rs" "$msg" >&2
  elif [[ "$lcs|$rs" != "$last" ]]; then
    log "  $lcs${rs:+ ($rs)}${msg:+ — $msg}"; last="$lcs|$rs"
  fi
  case "$lcs" in
    TERMINATED|SKIPPED|INTERNAL_ERROR) [[ -t 2 ]] && printf '\n' >&2; break ;;
  esac
  sleep 5
done

# --- result + notebook output ----------------------------------------------
task_run_id="$(jq -r '.tasks[0].run_id // empty' <<<"$run_json")"
if [[ -n "$task_run_id" ]]; then
  out_json="$(databricks jobs get-run-output "$task_run_id" "${P[@]}" -o json 2>/dev/null || true)"
  if [[ -n "$out_json" ]]; then
    result="$(jq -r '.notebook_output.result // empty' <<<"$out_json")"
    [[ -n "$result" ]] && { log ""; log "notebook exit value:"; printf '%s\n' "$result"; }
    error="$(jq -r '.error // empty' <<<"$out_json")"
    if [[ -n "$error" ]]; then
      log ""; err "notebook error: $error"
      jq -r '.error_trace // empty' <<<"$out_json" >&2
    fi
  fi
fi

log ""
if [[ "$rs" == "SUCCESS" ]]; then
  log "✓ $rs"
  exit 0
else
  err "✗ ${rs:-$lcs} ${msg:+— $msg}"
  exit 1
fi
