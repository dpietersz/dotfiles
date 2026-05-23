---
title: "CLI Recipes & Scripting"
domain: "zellij.dev"
source: "https://zellij.dev/documentation/cli-recipes.html"
scraped_at: "2026-05-23T10:32:42Z"
etag: "W/\"69f9a63d-92b7\""
---

  1. [**1.** Introduction](https://zellij.dev/documentation/introduction.html)
  2.     1. [**1.1.** Installation](https://zellij.dev/documentation/installation.html)
    2. [**1.2.** Integration](https://zellij.dev/documentation/integration.html)
    3. [**1.3.** FAQ](https://zellij.dev/documentation/faq.html)
  3. [**2.** Commands](https://zellij.dev/documentation/commands.html)
  4. [**3.** Rebinding Keys](https://zellij.dev/documentation/rebinding-keys.html)
  5.     1. [**3.1.** Keybinding Presets](https://zellij.dev/documentation/keybinding-presets.html)
    2. [**3.2.** Changing Modifiers](https://zellij.dev/documentation/changing-modifiers.html)
  6. [**4.** Configuration](https://zellij.dev/documentation/configuration.html)
  7.     1. [**4.1.** Options](https://zellij.dev/documentation/options.html)
    2. [**4.2.** Keybindings](https://zellij.dev/documentation/keybindings.html)
    3.       1. [**4.2.1.** Modes](https://zellij.dev/documentation/keybindings-modes.html)
      2. [**4.2.2.** Binding and Overriding Keys](https://zellij.dev/documentation/keybindings-binding.html)
      3. [**4.2.3.** Keys](https://zellij.dev/documentation/keybindings-keys.html)
      4. [**4.2.4.** Possible Actions](https://zellij.dev/documentation/keybindings-possible-actions.html)
      5. [**4.2.5.** Shared Bindings](https://zellij.dev/documentation/keybindings-shared.html)
    4. [**4.3.** Themes](https://zellij.dev/documentation/themes.html)
    5.       1. [**4.3.1.** List of Themes](https://zellij.dev/documentation/theme-list.html)
      2. [**4.3.2.** Legacy Themes](https://zellij.dev/documentation/legacy-themes.html)
    6. [**4.4.** CLI Configuration](https://zellij.dev/documentation/command-line-options.html)
    7. [**4.5.** Migrating from old YAML config files](https://zellij.dev/documentation/migrating-yaml-config.html)
  8. [**5.** Controlling Zellij through the CLI](https://zellij.dev/documentation/controlling-zellij-through-cli.html)
  9.     1. [**5.1.** Zellij Run & Edit](https://zellij.dev/documentation/zellij-run-and-edit.html)
    2. [**5.2.** Zellij Action](https://zellij.dev/documentation/cli-actions.html)
    3. [**5.3.** Zellij Plugin & Pipe](https://zellij.dev/documentation/zellij-plugin-and-pipe.html)
    4. [**5.4.** Zellij Subscribe](https://zellij.dev/documentation/zellij-subscribe.html)
    5. [**5.5.** CLI Recipes & Scripting](https://zellij.dev/documentation/cli-recipes.html)
    6. [**5.6.** Programmatic Control](https://zellij.dev/documentation/programmatic-control.html)
  10. [**6.** Layouts](https://zellij.dev/documentation/layouts.html)
  11.     1. [**6.1.** Creating a Layout](https://zellij.dev/documentation/creating-a-layout.html)
    2.       1. [**6.1.1.** Swap Layouts](https://zellij.dev/documentation/swap-layouts.html)
    3. [**6.2.** Including Configuration in Layouts](https://zellij.dev/documentation/layouts-with-config.html)
    4. [**6.3.** Examples](https://zellij.dev/documentation/layout-examples.html)
    5. [**6.4.** Migrating from old YAML layouts](https://zellij.dev/documentation/migrating-yaml-layouts.html)
  12. [**7.** Plugins](https://zellij.dev/documentation/plugins.html)
  13.     1. [**7.1.** Loading Plugins](https://zellij.dev/documentation/plugin-loading.html)
    2. [**7.2.** Plugin API](https://zellij.dev/documentation/plugin-api.html)
    3.       1. [**7.2.1.** Events](https://zellij.dev/documentation/plugin-api-events.html)
      2. [**7.2.2.** Commands](https://zellij.dev/documentation/plugin-api-commands.html)
      3. [**7.2.3.** Type Reference](https://zellij.dev/documentation/plugin-api-types.html)
      4. [**7.2.4.** Permissions](https://zellij.dev/documentation/plugin-api-permissions.html)
      5. [**7.2.5.** Configuration](https://zellij.dev/documentation/plugin-api-configuration.html)
      6. [**7.2.6.** Reading from the Filesystem](https://zellij.dev/documentation/plugin-api-file-system.html)
      7. [**7.2.7.** Logging](https://zellij.dev/documentation/plugin-api-logging.html)
      8. [**7.2.8.** Workers for Async Tasks](https://zellij.dev/documentation/plugin-api-workers.html)
      9. [**7.2.9.** Pipes for communicating with and between plugins](https://zellij.dev/documentation/plugin-pipes.html)
    4. [**7.3.** Developing a Plugin](https://zellij.dev/documentation/plugin-development.html)
    5.       1. [**7.3.1.** Development Environment](https://zellij.dev/documentation/plugin-dev-env.html)
      2. [**7.3.2.** Plugin Lifecycle](https://zellij.dev/documentation/plugin-lifecycle.html)
      3. [**7.3.3.** Rendering a UI](https://zellij.dev/documentation/plugin-ui-rendering.html)
      4. [**7.3.4.** Upgrading and Backwards Compatibility](https://zellij.dev/documentation/plugin-upgrading.html)
    6. [**7.4.** Plugin Aliases](https://zellij.dev/documentation/plugin-aliases.html)
    7.       1. [**7.4.1.** The tab-bar alias](https://zellij.dev/documentation/tab-bar-alias.html)
      2. [**7.4.2.** The status-bar alias](https://zellij.dev/documentation/status-bar-alias.html)
      3. [**7.4.3.** The strider alias](https://zellij.dev/documentation/strider-alias.html)
      4. [**7.4.4.** The compact-bar alias](https://zellij.dev/documentation/compact-bar-alias.html)
      5. [**7.4.5.** The session-manager alias](https://zellij.dev/documentation/session-manager-alias.html)
      6. [**7.4.6.** The welcome-screen alias](https://zellij.dev/documentation/welcome-screen-alias.html)
      7. [**7.4.7.** The filepicker alias](https://zellij.dev/documentation/filepicker-alias.html)
    8. [**7.5.** Example Plugins](https://zellij.dev/documentation/plugin-examples.html)
    9. [**7.6.** Developing a Plugin in Other Languages](https://zellij.dev/documentation/plugin-other-languages.html)
  14. [**8.** Session Resurrection](https://zellij.dev/documentation/session-resurrection.html)
  15. [**9.** Web Client](https://zellij.dev/documentation/web-client.html)
  16. [**10.** Compatibility](https://zellij.dev/documentation/compatibility.html)


  * Light
  * Rust
  * Coal
  * Navy
  * Ayu


# Zellij User Guide
[ ](https://zellij.dev/documentation/print.html "Print this book")
# [CLI Recipes & Scripting](https://zellij.dev/documentation/cli-recipes.html#cli-recipes--scripting)
This page provides task-oriented examples for controlling Zellij from the command line and shell scripts. For a full reference of all available actions, see [CLI Actions](https://zellij.dev/documentation/cli-actions.html). For patterns oriented toward non-interactive, machine-driven control (output polling, event loops, concurrency), see [Programmatic Control](https://zellij.dev/documentation/programmatic-control.html).
* * *
  * [Targeting Specific Panes and Tabs](https://zellij.dev/documentation/cli-recipes.html#targeting-specific-panes-and-tabs)
  * [Sending Input to Another Pane](https://zellij.dev/documentation/cli-recipes.html#sending-input-to-another-pane)
  * [Watching Pane Output in Real Time](https://zellij.dev/documentation/cli-recipes.html#watching-pane-output-in-real-time)
  * [Starting and Controlling Background Sessions](https://zellij.dev/documentation/cli-recipes.html#starting-and-controlling-background-sessions)
  * [Scripting Pane and Tab Creation](https://zellij.dev/documentation/cli-recipes.html#scripting-pane-and-tab-creation)
  * [Inspecting Session State](https://zellij.dev/documentation/cli-recipes.html#inspecting-session-state)
  * [Controlling Floating Panes](https://zellij.dev/documentation/cli-recipes.html#controlling-floating-panes)
  * [Borderless Panes](https://zellij.dev/documentation/cli-recipes.html#borderless-panes)
  * [Toggling Pane Visibility](https://zellij.dev/documentation/cli-recipes.html#toggling-pane-visibility)
  * [Changing Pane Colors](https://zellij.dev/documentation/cli-recipes.html#changing-pane-colors)
  * [Blocking Panes](https://zellij.dev/documentation/cli-recipes.html#blocking-panes)
  * [Scrollback and Screen Capture](https://zellij.dev/documentation/cli-recipes.html#scrollback-and-screen-capture)
  * [Session Management](https://zellij.dev/documentation/cli-recipes.html#session-management)
  * [Working with Plugins from the CLI](https://zellij.dev/documentation/cli-recipes.html#working-with-plugins-from-the-cli)
  * [Layout Overrides at Runtime](https://zellij.dev/documentation/cli-recipes.html#layout-overrides-at-runtime)
  * [Inline Layouts](https://zellij.dev/documentation/cli-recipes.html#inline-layouts)


* * *
## [Targeting Specific Panes and Tabs](https://zellij.dev/documentation/cli-recipes.html#targeting-specific-panes-and-tabs)
Many CLI actions accept `--pane-id` or `--tab-id` flags, allowing commands to be directed at specific panes or tabs without changing focus. This eliminates the need to switch focus before issuing a command.
### [Pane IDs](https://zellij.dev/documentation/cli-recipes.html#pane-ids)
Every terminal pane exposes its ID through the `$ZELLIJ_PANE_ID` environment variable. Pane IDs are specified as `terminal_N`, `plugin_N`, or a bare integer `N` (equivalent to `terminal_N`).
Discover all pane IDs in the current session:

```

__
zellij action list-panes

```

**Sample output:**

```

__
PANE_ID      TYPE      TITLE
terminal_1   terminal  /bin/bash
plugin_0     plugin    tab-bar
terminal_2   terminal  vim main.rs

```

Or as JSON for structured processing:

```

__
zellij action list-panes --json

```

**Sample output:**

```

__
[
  {
    "id": 1,
    "is_plugin": false,
    "is_focused": true,
    "title": "/bin/bash",
    "is_floating": false,
    "tab_id": 0,
    "tab_name": "Tab #1",
    "pane_command": "bash",
    "pane_cwd": "/home/user/project"
  }
]

```

_(JSON output includes many additional fields - see[Inspecting Session State](https://zellij.dev/documentation/cli-recipes.html#inspecting-session-state) for full details)_
### [Tab IDs](https://zellij.dev/documentation/cli-recipes.html#tab-ids)
Tab IDs can be discovered with:

```

__
zellij action list-tabs

```

**Sample output:**

```

__
TAB_ID  POSITION  NAME
0       0         Tab #1
1       1         editor
2       2         logs

```

Or as JSON:

```

__
zellij action list-tabs --json

```

**Sample output:**

```

__
[
  {
    "position": 0,
    "name": "Tab #1",
    "active": true,
    "tab_id": 0
  }
]

```

_(JSON output includes many additional fields - see[Inspecting Session State](https://zellij.dev/documentation/cli-recipes.html#inspecting-session-state) for full details)_
Or get the current tab info:

```

__
zellij action current-tab-info

```

**Sample output:**

```

__
name: Tab #1
id: 0
position: 0

```

### [Examples](https://zellij.dev/documentation/cli-recipes.html#examples)
Clear a specific pane without focusing it:

```

__
zellij action clear --pane-id terminal_3

```

Scroll to the top of a specific pane:

```

__
zellij action scroll-to-top --pane-id terminal_5

```

Focus a specific pane by its ID:

```

__
zellij action focus-pane-id terminal_3

```

Close a specific tab by its ID:

```

__
zellij action close-tab --tab-id 3

```

## [Sending Input to Another Pane](https://zellij.dev/documentation/cli-recipes.html#sending-input-to-another-pane)
Commands can be sent directly to any pane by ID. There is no need to change focus first.
Send keystrokes to a specific pane:

```

__
zellij action send-keys --pane-id terminal_3 "Enter" "ctrl c"

```

Write a string of characters one-by-one to a specific pane:

```

__
zellij action write-chars --pane-id terminal_3 "echo hello"

```

Paste text (using bracketed paste mode) to a specific pane (faster and more robust than write-chars):

```

__
zellij action paste --pane-id terminal_3 "multi-line\ntext content"

```

## [Watching Pane Output in Real Time](https://zellij.dev/documentation/cli-recipes.html#watching-pane-output-in-real-time)
The [zellij subscribe](https://zellij.dev/documentation/zellij-subscribe.html) command streams the rendered output of one or more panes to stdout. This is useful for monitoring builds, logs, or any running process without keeping the pane visible.
Monitor a pane's output:

```

__
zellij subscribe --pane-id terminal_1

```

Filter live output for errors using JSON mode and `jq`:

```

__
zellij subscribe --pane-id terminal_1 --format json | jq --unbuffered 'select(.event == "pane_update") | .viewport[] | select(test("ERROR"))'

```

Use JSON format with `jq` for structured processing:

```

__
zellij subscribe --pane-id terminal_1 --format json | jq 'select(.event == "pane_update") | .viewport[]'

```

Monitor multiple panes simultaneously:

```

__
zellij subscribe --pane-id terminal_1 --pane-id terminal_2 --format json

```

## [Starting and Controlling Background Sessions](https://zellij.dev/documentation/cli-recipes.html#starting-and-controlling-background-sessions)
A Zellij session can be created in the background without attaching to it. This is useful for headless workflows, CI pipelines, and scripted environments.
Create a background session:

```

__
zellij attach --create-background my-session

```

Create a background session with a specific [layout](https://zellij.dev/documentation/creating-a-layout.html):

```

__
zellij attach --create-background my-session options --default-layout compact

```

Create a background session with a custom layout file:

```

__
zellij attach --create-background my-session options --default-layout /path/to/layout.kdl

```

Once a background session is running, actions can be issued against it using the global `--session` flag:
Send keystrokes to a pane in the background session:

```

__
zellij --session my-session action paste "make build" --pane-id terminal_1 &&
zellij --session my-session action send-keys --pane-id terminal_1 "Enter"

```

Open a new pane in the background session:

```

__
PANE_ID=$(zellij --session my-session action new-pane)
zellij --session my-session action paste "npm test" --pane-id $PANE_ID &&
zellij --session my-session action send-keys --pane-id $PANE_ID "Enter"

```

Subscribe to a pane's output in the background session (see [Zellij Subscribe](https://zellij.dev/documentation/zellij-subscribe.html)):

```

__
zellij --session my-session subscribe --pane-id terminal_1 --format json

```

Dump the screen of a specific pane in the background session:

```

__
zellij --session my-session action dump-screen --pane-id terminal_1 --full

```

### [Full Scripted Workflow Example](https://zellij.dev/documentation/cli-recipes.html#full-scripted-workflow-example)

```

__
#!/bin/bash

# Create a background session with a layout
zellij attach --create-background ci-runner options --default-layout compact

# Open a pane and capture its ID
BUILD_PANE=$(zellij --session ci-runner action new-pane --name "build")

# Start a build
zellij --session ci-runner action paste --pane-id $BUILD_PANE "cargo build 2>&1" &&
zellij --session ci-runner action send-keys --pane-id $BUILD_PANE "Enter"

# Monitor the build output for relevant lines, exit when the pane closes
zellij --session ci-runner subscribe --pane-id $BUILD_PANE --format json \
  | jq --unbuffered 'select(.event == "pane_update") | .viewport[] | select(test("error|warning|Finished"))'

```

## [Scripting Pane and Tab Creation](https://zellij.dev/documentation/cli-recipes.html#scripting-pane-and-tab-creation)
Several CLI actions return the ID of the created pane or tab, making it possible to chain commands in scripts.
Actions that return a pane ID:
  * `new-pane`
  * `edit`
  * `launch-plugin`
  * `launch-or-focus-plugin`
  * `toggle-floating-panes` (when a new floating pane is created, this happens when no floating panes exist in that tab)
  * `show-floating-panes` (when a new floating pane is created, this happens when no floating panes exist in that tab)


Actions that return a tab ID:
  * `new-tab`
  * `go-to-tab-name --create` (when a new tab is created)


Capture a new pane ID and send commands to it:

```

__
PANE_ID=$(zellij action new-pane --name "my worker")
zellij action paste --pane-id $PANE_ID "python worker.py" &&
zellij action send-keys --pane-id $PANE_ID "Enter"

```

Create a floating pane with specific coordinates and use its ID:

```

__
PANE_ID=$(zellij action new-pane --floating --width 80 --height 24 --x 10% --y 10%)
zellij action paste --pane-id $PANE_ID "htop" &&
zellij action send-keys --pane-id $PANE_ID "Enter"

```

Open a pane in a specific tab (by tab ID) without switching focus to that tab:

```

__
zellij action new-pane --tab-id 2 --name "background task" -- cargo build

```

Create a tab and capture its ID:

```

__
TAB_ID=$(zellij action new-tab --name "tests" --layout /path/to/test-layout.kdl)

```

## [Inspecting Session State](https://zellij.dev/documentation/cli-recipes.html#inspecting-session-state)
Information about the current session can be queried for use in scripts or external status bars. For a full reference of these commands, see the [CLI Actions](https://zellij.dev/documentation/cli-actions.html) page.
### [Listing Panes](https://zellij.dev/documentation/cli-recipes.html#listing-panes)
List all panes with full details:

```

__
zellij action list-panes --all

```

**Sample output:**

```

__
TAB_ID  TAB_POS  TAB_NAME  PANE_ID      TYPE      TITLE          COMMAND        CWD                      FOCUSED  FLOATING  EXITED  X  Y   ROWS  COLS
0       0        Tab #1    terminal_1   terminal  /bin/bash      bash           /home/user/project       true     false     false   0  1   24    80
0       0        Tab #1    plugin_0     plugin    tab-bar        zellij:tab-bar -                        false    false     false   0  0   1     80
1       1        Tab #2    terminal_2   terminal  vim main.rs    vim main.rs    /home/user/project/src   true     false     false   0  1   24    80

```

Get JSON output for programmatic use:

```

__
zellij action list-panes --json | jq '.[] | select(.is_focused == true)'

```

**Sample output:**

```

__
{
  "id": 1,
  "is_plugin": false,
  "is_focused": true,
  "is_fullscreen": false,
  "is_floating": false,
  "is_suppressed": false,
  "title": "/bin/bash",
  "exited": false,
  "exit_status": null,
  "is_held": false,
  "pane_x": 0,
  "pane_content_x": 1,
  "pane_y": 1,
  "pane_content_y": 2,
  "pane_rows": 24,
  "pane_content_rows": 22,
  "pane_columns": 80,
  "pane_content_columns": 78,
  "cursor_coordinates_in_pane": [0, 5],
  "terminal_command": null,
  "plugin_url": null,
  "is_selectable": true,
  "tab_id": 0,
  "tab_position": 0,
  "tab_name": "Tab #1",
  "pane_command": "bash",
  "pane_cwd": "/home/user/project"
}

```

### [Listing Tabs](https://zellij.dev/documentation/cli-recipes.html#listing-tabs)
List all tabs with state and layout info:

```

__
zellij action list-tabs --state --layout

```

**Sample output:**

```

__
TAB_ID  POSITION  NAME    ACTIVE  FULLSCREEN  SYNC_PANES  FLOATING_VIS  SWAP_LAYOUT  LAYOUT_DIRTY
0       0         Tab #1  true    false       false       false         default      false
1       1         editor  false   false       false       false         -            false
2       2         logs    false   false       false       true          default      true

```

Get JSON output:

```

__
zellij action list-tabs --json

```

**Sample output:**

```

__
[
  {
    "position": 0,
    "name": "Tab #1",
    "active": true,
    "panes_to_hide": 0,
    "is_fullscreen_active": false,
    "is_sync_panes_active": false,
    "are_floating_panes_visible": false,
    "other_focused_clients": [],
    "active_swap_layout_name": "default",
    "is_swap_layout_dirty": false,
    "viewport_rows": 24,
    "viewport_columns": 80,
    "display_area_rows": 26,
    "display_area_columns": 80,
    "selectable_tiled_panes_count": 2,
    "selectable_floating_panes_count": 0,
    "tab_id": 0,
    "has_bell_notification": false,
    "is_flashing_bell": false
  }
]

```

### [Current Tab Info](https://zellij.dev/documentation/cli-recipes.html#current-tab-info)
Get information about the currently active tab:

```

__
zellij action current-tab-info

```

**Sample output:**

```

__
name: Tab #1
id: 0
position: 0

```

Get full details as JSON:

```

__
zellij action current-tab-info --json

```

**Sample output:**

```

__
{
  "position": 0,
  "name": "Tab #1",
  "active": true,
  "panes_to_hide": 0,
  "is_fullscreen_active": false,
  "is_sync_panes_active": false,
  "are_floating_panes_visible": false,
  "other_focused_clients": [],
  "active_swap_layout_name": "default",
  "is_swap_layout_dirty": false,
  "viewport_rows": 24,
  "viewport_columns": 80,
  "display_area_rows": 26,
  "display_area_columns": 80,
  "selectable_tiled_panes_count": 2,
  "selectable_floating_panes_count": 0,
  "tab_id": 0,
  "has_bell_notification": false,
  "is_flashing_bell": false
}

```

### [Other Queries](https://zellij.dev/documentation/cli-recipes.html#other-queries)
List connected clients:

```

__
zellij action list-clients

```

Query all tab names:

```

__
zellij action query-tab-names

```

## [Controlling Floating Panes](https://zellij.dev/documentation/cli-recipes.html#controlling-floating-panes)
Create a floating pane with specific coordinates:

```

__
zellij action new-pane --floating --x 10% --y 10% --width 80% --height 80%

```

Show or hide all floating panes:

```

__
zellij action show-floating-panes
zellij action hide-floating-panes

```

Check whether floating panes are currently visible:

```

__
zellij action are-floating-panes-visible && echo "visible" || echo "hidden"

```

Pin a floating pane so it stays on top:

```

__
zellij action toggle-pane-pinned --pane-id terminal_5

```

Reposition and resize a floating pane:

```

__
zellij action change-floating-pane-coordinates --pane-id terminal_5 --x 20 --y 10 --width 50% --height 50%

```

## [Borderless Panes](https://zellij.dev/documentation/cli-recipes.html#borderless-panes)
A pane can be created without a border using the `--borderless` flag. Combined with `--pinned`, this creates a persistent overlay that appears as part of the terminal UI itself - with no visible frame separating it from the rest of the screen.
For example, a small pane pinned to the top-right corner that continuously displays the current git branch and status:

```

__
zellij action new-pane --floating --borderless true --pinned true \
--width "20%" --height 1 --x "75%" --y 2 \
-- bash -c 'while true; do printf "\r%-40s" "$(git -C /home/user/project branch --show-current) $(git -C /home/user/project status --short | wc -l) changed"; sleep 5; done'

```

This creates a single-line overlay that stays on top of all other panes, has no border, and continuously refreshes - functioning like a custom status bar element.
Another example - a persistent resource monitor pinned to a corner:

```

__
zellij action new-pane --floating --borderless true --pinned true \
    --width 30 --height 5 --x "100%" --y "100%" \
    -- watch -n2 -t "free -h | head -3"

```

Toggle the borderless state of an existing pane:

```

__
zellij action toggle-pane-borderless --pane-id terminal_5

```

Explicitly set the borderless state:

```

__
zellij action set-pane-borderless --pane-id terminal_5 --borderless true

```

## [Toggling Pane Visibility](https://zellij.dev/documentation/cli-recipes.html#toggling-pane-visibility)
A tiled pane can be floated and a floating pane can be embedded. This is useful for background tasks - a long-running process can be kept in a floating pane whose visibility is toggled as needed, keeping the main workspace uncluttered.
Float a tiled pane or embed a floating pane:

```

__
zellij action toggle-pane-embed-or-floating --pane-id terminal_3

```

Toggle the visibility of all floating panes in the current tab:

```

__
zellij action toggle-floating-panes

```

A common pattern is to start a background task in a floating pane, hide floating panes to keep the workspace clean, and show them again when the task needs attention:

```

__
# Start a long-running build in a floating pane
PANE_ID=$(zellij action new-pane --floating --name "build")
zellij action paste --pane-id $PANE_ID "cargo build --release 2>&1" &&
zellij action send-keys --pane-id $PANE_ID "Enter"

# Hide floating panes to focus on other work
zellij action hide-floating-panes

# Later, show them again to check progress
zellij action show-floating-panes

```

## [Changing Pane Colors](https://zellij.dev/documentation/cli-recipes.html#changing-pane-colors)
The foreground and background colors of a pane can be changed at runtime with `set-pane-color`. Colors are specified as hex (eg. `"#00e000"`) or rgb notation (eg. `"rgb:00/e0/00"`). This can be used to visually distinguish panes, flash a pane to get the user's attention, or color-code panes by purpose.
Set both foreground and background:

```

__
zellij action set-pane-color --pane-id terminal_3 --fg "#00e000" --bg "#001a3a"

```

Set only the background:

```

__
zellij action set-pane-color --pane-id terminal_3 --bg "#3a0000"

```

Reset colors back to the terminal defaults:

```

__
zellij action set-pane-color --pane-id terminal_3 --reset

```

Flash a pane red briefly to get attention (from a script):

```

__
zellij action set-pane-color --pane-id terminal_3 --bg "#5a0000"
sleep 1
zellij action set-pane-color --pane-id terminal_3 --reset

```

When no `--pane-id` is specified, the command defaults to the pane identified by the `$ZELLIJ_PANE_ID` environment variable, making it easy to use from within a pane's own shell:

```

__
zellij action set-pane-color --bg "#001a3a"

```

## [Blocking Panes](https://zellij.dev/documentation/cli-recipes.html#blocking-panes)
A pane can be opened with blocking flags that cause the calling process to wait until the command in the pane completes. This is powerful for scripting multi-step workflows where each step depends on the previous one.
### [Waiting for a Command to Finish](https://zellij.dev/documentation/cli-recipes.html#waiting-for-a-command-to-finish)
Block until the command exits and the user closes the pane (by pressing `Ctrl-c`):

```

__
zellij action new-pane --blocking -- cargo test

```

Or equivalently with `zellij run`:

```

__
zellij run --blocking -- cargo test

```

The calling shell will not continue until the pane has been closed. The user can review the output, then press `Ctrl-c` to close the pane and unblock.
### [Waiting for Success or Failure](https://zellij.dev/documentation/cli-recipes.html#waiting-for-success-or-failure)
The `--block-until-exit-success` flag unblocks only when the command exits with status 0. If it fails, the pane stays open and the user can press `Enter` to retry - the calling process remains blocked until the command succeeds (or the pane is closed manually):

```

__
zellij action new-pane --block-until-exit-success -- cargo build
echo "Build succeeded, continuing..."

```

If `cargo build` fails, the pane will display the error and wait. The user can fix the issue in another pane, then go back and press `Enter` to retry. The script only continues once the build passes.
This retry can also be triggered remotely from another pane or script:

```

__
zellij action send-keys --pane-id terminal_3 "Enter"

```

Similarly, `--block-until-exit-failure` unblocks only when the command exits with a non-zero status:

```

__
zellij action new-pane --block-until-exit-failure -- ./run-server.sh
echo "Server crashed, running cleanup..."

```

And `--block-until-exit` unblocks when the command exits regardless of its status:

```

__
zellij action new-pane --block-until-exit -- ./my-task.sh
echo "Task finished (exit status does not matter), moving on..."

```

### [Scripted Multi-Step Workflows with Human Intervention](https://zellij.dev/documentation/cli-recipes.html#scripted-multi-step-workflows-with-human-intervention)
These flags are especially useful for workflows that may require human intervention at certain steps. The script pauses at each blocking pane, and the user can inspect, fix, and retry as needed before the script continues:

```

__
#!/bin/bash

# Step 1: run tests - retry until they pass
zellij action new-pane --block-until-exit-success --name "tests" -- cargo test

# Step 2: build release - retry until it succeeds
zellij action new-pane --block-until-exit-success --name "release build" -- cargo build --release

# Step 3: deploy - wait for it to finish regardless of outcome
zellij action new-pane --block-until-exit --name "deploy" -- ./deploy.sh

echo "Pipeline complete."

```

At each step, if the command fails, the pane remains open. The user can investigate the failure, make fixes in other panes, and press `Enter` in the blocking pane to retry. The script advances only after each step succeeds (or completes, for `--block-until-exit`).
### [Blocking Panes in New Tabs](https://zellij.dev/documentation/cli-recipes.html#blocking-panes-in-new-tabs)
The same blocking flags are available on `new-tab` for its initial command:

```

__
zellij action new-tab --block-until-exit-success -- cargo test

```

## [Scrollback and Screen Capture](https://zellij.dev/documentation/cli-recipes.html#scrollback-and-screen-capture)
Dump the viewport of the focused pane to stdout:

```

__
zellij action dump-screen

```

Dump full scrollback with ANSI styling to a file:

```

__
zellij action dump-screen --path /tmp/capture.txt --full --ansi

```

Dump a specific pane's content:

```

__
zellij action dump-screen --pane-id terminal_3 --full

```

Open the scrollback of a specific pane in the default editor:

```

__
zellij action edit-scrollback --pane-id terminal_3

```

## [Session Management](https://zellij.dev/documentation/cli-recipes.html#session-management)
Rename the current session:

```

__
zellij action rename-session "my-project"

```

Save session state immediately (for [session resurrection](https://zellij.dev/documentation/session-resurrection.html)):

```

__
zellij action save-session

```

Switch to a different session:

```

__
zellij action switch-session other-session

```

Detach from the current session:

```

__
zellij action detach

```

## [Working with Plugins from the CLI](https://zellij.dev/documentation/cli-recipes.html#working-with-plugins-from-the-cli)
Launch a new plugin instance:

```

__
zellij action launch-plugin file:/path/to/plugin.wasm --floating

```

Send data to a plugin via [pipe](https://zellij.dev/documentation/zellij-plugin-and-pipe.html#zellij-pipe):

```

__
echo "some data" | zellij pipe --name my-pipe --plugin "my-plugin-alias"

```

Reload a plugin during development (see [Plugin Development](https://zellij.dev/documentation/plugin-development.html)):

```

__
zellij action start-or-reload-plugin file:/path/to/plugin.wasm

```

## [Layout Overrides at Runtime](https://zellij.dev/documentation/cli-recipes.html#layout-overrides-at-runtime)
Replace the current tab's [layout](https://zellij.dev/documentation/creating-a-layout.html) with a different one:

```

__
zellij action override-layout /path/to/new-layout.kdl

```

Keep existing panes that do not fit the new layout:

```

__
zellij action override-layout /path/to/layout.kdl --retain-existing-terminal-panes --retain-existing-plugin-panes

```

Apply the layout only to the active tab:

```

__
zellij action override-layout /path/to/layout.kdl --apply-only-to-active-tab

```

## [Inline Layouts](https://zellij.dev/documentation/cli-recipes.html#inline-layouts)
Instead of referencing a layout file, a raw KDL layout string can be passed directly on the command line using `--layout-string`. This is useful for scripted or dynamic layouts without creating temporary files.
Start a new tab with an inline layout:

```

__
zellij action new-tab --layout-string 'layout { pane split_direction="vertical" { pane; pane; }; }'

```

Override the current tab's layout inline:

```

__
zellij action override-layout --layout-string 'layout { pane split_direction="vertical" { pane; pane; pane; }; }'

```

Start a new session with an inline layout:

```

__
zellij --layout-string 'layout { pane split_direction="vertical" { pane; pane; }; }'

```
[ ](https://zellij.dev/documentation/zellij-subscribe.html "Previous chapter") [ ](https://zellij.dev/documentation/programmatic-control.html "Next chapter")
[ ](https://zellij.dev/documentation/zellij-subscribe.html "Previous chapter") [ ](https://zellij.dev/documentation/programmatic-control.html "Next chapter")
