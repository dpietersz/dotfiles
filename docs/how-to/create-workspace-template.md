# How-To: Create a Workspace Template (Mod+E)

A **workspace template** is a TOML file that declares a set of browser
windows and applications, grouped into niri columns and tab-groups, ready
to spawn into the next available empty workspace with one keystroke.

Use it for "I'm starting work on Project X" stacks where you want the same
arrangement of tabs and apps every time — for example, the Hilversum
template restores the full Citrix + Azure dev tools + Teams setup.

---

## TL;DR

1. Drop a new `.toml` file under `dot_config/workspace-templates/`.
2. `chezmoi apply`.
3. Press `Mod+E`, pick `[ OPEN ] <your template>` in the fzf popup.

Reopen the same template later → the engine focuses the existing workspace
(idempotent). Press `Mod+E` again → `[ CLOSE ]` tears it down cleanly.

---

## The user-facing flow

| Key / step | What happens |
|---|---|
| `Mod+E` | Floating kitty popup with fzf. Lists every template under `~/.config/workspace-templates/*.toml`. |
| Enter on `[ OPEN  ] <name>` | Popup closes instantly. Engine claims the next empty workspace, names it `<name>`, spawns all declared windows and arranges them. Notifications: "opening 'X'…" then "'X' ready". |
| Enter on `[ CLOSE ] <name>` | Closes every window on workspace `<name>` (by window-id — does **not** kill PIDs, so other workspaces' windows from the same app survive). Unsets the workspace name. Notification: "'X' closed". |
| `Mod+E` again while open | Same template shown as `[ CLOSE ]`. Opening the template a second time just focuses the existing workspace — no double-spawn. |

Inside a tab-group column, `Mod+J` / `Mod+K` cycle through the tabs and
**wrap** at the ends.

---

## Template schema

Templates live at `dot_config/workspace-templates/<slug>.toml` in the
dotfiles repo (target: `~/.config/workspace-templates/<slug>.toml`).

```toml
name        = "Display name shown in fzf and used as the niri workspace name"
description = "Optional one-liner shown in the fzf preview pane"

[[columns]]
tab-group = "Optional documentation label, no functional effect"
tabs = [
  { helium  = "https://example.com/url-for-this-helium-window" },
  { command = ["bin", "arg1", "arg2"] },
  { command = ["other-bin"], app_id = "expected-niri-app-id" },
]
```

### Field reference

| Key | Where | Required | Notes |
|---|---|---|---|
| `name` | top level | yes | Used both for the fzf label and as the niri workspace name. Keep it short — it's visible in your status bar. |
| `description` | top level | no | Free text. Surfaces in the fzf preview pane. |
| `[[columns]]` | array | yes | Each entry is one niri column. Declared order = left-to-right in the workspace. |
| `tab-group` | per column | no | Documentation only. Whether the column gets niri's tabbed display is decided automatically: columns with **2+ tabs** become tabbed, single-tab columns stay normal. |
| `tabs` | per column | yes | Array of inline tables. Each entry becomes one window in the column. Multiple `tabs` in the same column form a niri tab-group, in declared order. |
| `helium`  | per tab | one-of | URL string. Spawns a fresh Helium window pointing at this URL (one URL per window — that's how each tab becomes its own niri tab). |
| `command` | per tab | one-of | List of strings. Spawned via `subprocess.Popen`; `~` and `$HOME` expand. No shell, no PATH magic — give a real binary on PATH or an absolute path. |
| `app_id`  | per `command` tab | no | niri `app_id` hint. See *App-ID hint* below. |

Exactly one of `helium` or `command` per tab.

### App-ID hint — when to use it

For `command` tabs, the optional `app_id` field changes spawn behaviour
in two useful ways:

1. **Single-instance apps** (Teams, Storage Explorer) won't open a second
   window when re-launched. Without an `app_id` hint, the engine waits up
   to 20 s for a new window that will never appear and the tab is skipped.
   With the hint, the engine first looks for an already-running window
   matching the app_id; if it finds one on another workspace, it **moves**
   that window to this workspace instead of trying to spawn a fresh copy.

2. **Splash-screen apps** (Storage Explorer again) show a transient window
   then replace it with the real main window — often with a different
   app_id. The engine catches this regardless via a stability check (a
   1.5-s hold; if the first window dies in that window, it waits for the
   next one). The app_id hint is not required for splash handling.

When **not** to set `app_id`:
- VS Code opened on a specific folder. If you set `app_id = "code"` and a
  VS Code window happens to be open on a different folder, the engine
  would claim that window and you'd land on the wrong folder. For
  folder-specific VS Code, use `code -n <folder>` and **omit** `app_id`
  so a fresh window always spawns.

---

## Worked example: Hilversum

`dot_config/workspace-templates/gemeente-hilversum.toml`:

```toml
name        = "Hilversum"
description = "Citrix · Dev tools tab-group · Teams"

[[columns]]                                        # column 1: single Helium tab
tabs = [
  { helium = "https://werkplek.hilversum.nl" },
]

[[columns]]                                        # column 2: 8-tab tab-group
tab-group = "Development tools"
tabs = [
  { helium  = "https://dev.azure.com/Hilversum-IM/Proces%20en%20Data" },
  { helium  = "https://app.powerbi.com" },
  { helium  = "https://adf.azure.com/en/home" },
  { helium  = "https://adb-5244239616138753.13.azuredatabricks.net" },
  { command = ["code", "-n", "~/dev/Repos/dev.azure.com/Hilversum-IM/Lakehouse"] },
  { command = ["launch-storage-explorer"], app_id = "storageexplorer" },
  { helium  = "https://portal.azure.com" },
  { helium  = "https://outlook.office.com" },
]

[[columns]]                                        # column 3: single command
tabs = [
  { command = ["teams-for-linux"], app_id = "teams-for-linux" },
]
```

Result:

```
[ Citrix ]   [ Dev tools (tabbed: Azure DevOps · Power BI · ADF · Databricks · VS Code · Storage Explorer · Portal · Outlook) ]   [ Teams ]
```

---

## Adding a new template

1. Pick a short, distinctive `name`. Avoid spaces if you'll type the
   workspace name often (it's allowed though — Hilversum is one word).

2. Decide the column layout. Each `[[columns]]` is one niri column.
   Most templates want 1–3 columns. Anything you'd group as "tabs in one
   logical pane" goes inside one column's `tabs` array.

3. For each tab, decide `helium` or `command`:
   - URL → `helium = "https://..."`
   - App available as `bin` on PATH → `command = ["bin"]`
   - App via host-exported distrobox `.desktop` → write a wrapper script
     under `dot_local/bin/scripts/executable_launch-<app>` and use it as
     the command. (See `launch-storage-explorer` for the pattern — the
     auto-exported `.desktop` files have `Path=/opt/...` paths that exist
     only inside the container, so `gtk-launch` from the host fails.)
   - App is single-instance (Teams, etc.) → set `app_id` to its niri
     `app_id` so the engine can claim an existing window instead of
     trying to spawn a second one. Find the app_id with:
     ```bash
     niri msg --json windows | jq -r '.[] | "\(.app_id)\t\(.title)"' | sort -u
     ```

4. Save under `dot_config/workspace-templates/<slug>.toml`.

5. `chezmoi apply`.

6. `workspace-template list` — your template should show as
   `CLOSED <name> <description>`.

7. `Mod+E` → pick `[ OPEN ] <name>`. Watch the construction (~10 s).

---

## What's where

| Component | File | What it does |
|---|---|---|
| Engine | `dot_local/bin/scripts/executable_workspace-template` | Python. Implements `list` / `open <name>` / `close <name>` / `picker` subcommands. |
| fzf popup wrapper | `dot_local/bin/scripts/executable_niri-workspace-template-popup` | Bash. Execs the picker subcommand. Spawned by `Mod+E` inside a floating kitty. |
| Storage Explorer launcher | `dot_local/bin/scripts/executable_launch-storage-explorer` | Bash. Bypasses the broken host-exported `.desktop` by calling `distrobox-enter` directly with the DBUS/XDG env injection. |
| niri keybinding | `dot_config/niri/config.kdl.tmpl` | `Mod+E` spawns the popup; window-rule floats it at 900×500. |
| Templates | `dot_config/workspace-templates/*.toml` | One file per template. |

---

## Behaviour notes

- **Idempotent.** Opening a template whose workspace already exists just
  focuses it — no double-spawn.
- **Background detach.** The picker uses `setsid -f` to fully detach the
  open/close worker so the kitty popup closes instantly when you press
  Enter; you don't sit watching the popup during the ~10 s of construction.
- **Tab-group construction.** All windows for a column spawn first as
  separate small columns, then get merged via `consume-or-expel-window-left`
  (the action behind `Mod+[`). Deferring the merges to after all spawns
  settle means splash-screen race conditions can't break the layout.
- **Safe close.** `[ CLOSE ]` uses `niri msg action close-window --id <wid>`
  per window. It does **not** kill PIDs — Helium runs every browser window
  under one master PID, and killing that would close every Helium window
  across every workspace, including your active one.
- **Zellij SIGWINCH kick.** At the end of every `open` and `close` the
  engine fires `pkill -WINCH zellij` so any zellij session whose cached
  dimensions desynced during the window-event storm re-detects size from
  its current client.

---

## Troubleshooting

### A tab gets `skipped: colN.tabM` in the notification

The window for that tab didn't appear within the 20 s timeout. Common
causes:

- The command exited immediately (typo, missing binary). Run it manually
  in a terminal first.
- The app is single-instance and was already running, and you forgot the
  `app_id` hint.
- A splash screen took longer than expected. Increase
  `WINDOW_WAIT_TIMEOUT_S` in the engine if this is reproducible.

### VS Code opens but on the wrong folder

You probably have `app_id = "code"` set on the VS Code tab. Drop the
hint and use `code -n <folder>` to force a new window on the right
folder — see the [App-ID hint](#app-id-hint--when-to-use-it) section.

### Tab-group exists but doesn't show the tabbed indicator

The column needs 2+ windows to flip into tabbed display. If your template
declares 2 tabs but one was skipped, the surviving single tab stays in
normal display. Fix the skipped tab.

### zellij main session looks shrunk after running Mod+E

Defensive `pkill -WINCH zellij` should auto-fix this. If it didn't, run
this from the affected zellij pane:

```bash
kill -WINCH $(pgrep -f 'zellij.*main' | head -1)
```

Last resort:

```bash
zellij kill-session main
# close kitty, open a new one — main session is recreated fresh
```

---

## See also

- niri keybindings reference: `docs/reference/niri-keybindings.md`
- Existing fzf popup pattern (Mod+P, Mod+G, Mod+F, Mod+C, Mod+T): see
  the `niri-*-popup` scripts under `dot_local/bin/scripts/`.
