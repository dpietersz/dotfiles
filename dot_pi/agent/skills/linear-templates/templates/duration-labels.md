# Duration Labels

Applied to ALL TARGET issues after chain completion. Calculate elapsed time from chain start timestamp.

| Elapsed | Label |
|---------|-------|
| < 10 minutes | `<10m` |
| 10–30 minutes | `10-30m` |
| 30–60 minutes | `30-60m` |
| > 60 minutes | `>60m` |

**Implementation**:
```bash
START_TS=$(cat /tmp/chain_start_ts 2>/dev/null || echo $(date +%s))
NOW_TS=$(date +%s)
ELAPSED_MIN=$(( (NOW_TS - START_TS) / 60 ))
```

Apply via: `pm update_issue { id: "SUR-XXX", addLabels: ["<matching label>"] }`

⛔ Apply to every TARGET issue. Do not apply to parent/epic issues unless standalone.
