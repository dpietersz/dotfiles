---
title: "Layouts"
domain: "zellij.dev"
source: "https://zellij.dev/documentation/layouts.html"
scraped_at: "2026-05-23T10:32:42Z"
etag: "W/\"69f9a63d-311f\""
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
# [Layouts](https://zellij.dev/documentation/layouts.html#layouts)
Layouts are text files that define an arrangement of Zellij panes and tabs.
You can read more about [creating a layout](https://zellij.dev/documentation/creating-a-layout.html)
### [Example](https://zellij.dev/documentation/layouts.html#example)
A basic layout can look like this:

```

__
// layout_file.kdl

layout {
    pane
    pane split_direction="vertical" {
        pane
        pane command="htop"
    }
}

```

Which would create the following layout:
![basic-layout-example](https://zellij.dev/documentation/img/basic-layout-example.png)
### [Applying a Layout](https://zellij.dev/documentation/layouts.html#applying-a-layout)
A layout can be applied when Zellij starts:

```

__
$ zellij --layout /path/to/layout_file.kdl

```

Or by setting it up in the [configuration](https://zellij.dev/documentation/configuration.html).
A layout can also be applied inside a running session with the same command:

```

__
$ zellij --layout /path/to/layout_file.kdl

```

In this case, Zellij will start this layout as one or more new tabs in the current session.
A layout can also be applied from a remote URL:

```

__
$ zellij --layout https://example.com/layout_file.kdl

```

For security reasons, remote layouts will have all their commands suspended behind a `Waiting ro run <command>` banner - prompting the user to run each one.
### [Layout default directory](https://zellij.dev/documentation/layouts.html#layout-default-directory)
By default Zellij will load the `default.kdl` layout, found in the `layouts` directory (a subdirectory of the `config` directory [config/layouts]).
If not found, Zellij will start with one pane and one tab.
Layouts residing in the default directory can be accessed by their bare name:

```

__
zellij --layout [layout_name]

```

### [Runtime Layout Override](https://zellij.dev/documentation/layouts.html#runtime-layout-override)
The layout of a running tab can be overridden without restarting the session. This is done via the `override-layout` CLI action or the `OverrideLayout` keybinding action:

```

__
$ zellij action override-layout /path/to/new-layout.kdl

```

Options allow retaining existing panes that do not fit the new layout:

```

__
$ zellij action override-layout /path/to/layout.kdl --retain-existing-terminal-panes --apply-only-to-active-tab

```

This enables dynamic workspace reorganization. For the full reference, see [override-layout in CLI actions](https://zellij.dev/documentation/cli-actions.html#override-layout) and [OverrideLayout in keybinding actions](https://zellij.dev/documentation/keybindings-possible-actions.html#overridelayout).
### [Layout Configuration Language](https://zellij.dev/documentation/layouts.html#layout-configuration-language)
Zellij uses [KDL](https://kdl.dev) as its configuration language.
[ ](https://zellij.dev/documentation/programmatic-control.html "Previous chapter") [ ](https://zellij.dev/documentation/creating-a-layout.html "Next chapter")
[ ](https://zellij.dev/documentation/programmatic-control.html "Previous chapter") [ ](https://zellij.dev/documentation/creating-a-layout.html "Next chapter")
