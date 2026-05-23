---
title: "Session Resurrection"
domain: "zellij.dev"
source: "https://zellij.dev/documentation/session-resurrection.html"
scraped_at: "2026-05-23T10:32:42Z"
etag: "W/\"69f9a63d-3a41\""
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
# [Session Resurrection](https://zellij.dev/documentation/session-resurrection.html#session-resurrection)
![zellij-session-manager-resurrection](https://zellij.dev/documentation/img/zellij-session-manager-resurrection.png) Zellij includes built-in session resurrection capabilities. This means that by default, each Zellij session is serialized and kept in the user's cache folder waiting to be recreated after an intentional quit or an unintentional crash.
These exited resurrectable sessions can be listed through the CLI or the built-in `session-manager`. They can be resurrected through the CLI by attaching to them or through the `session-manager` by selecting them in the `EXITED` section.
## [What is Resurrected and how to Configure](https://zellij.dev/documentation/session-resurrection.html#what-is-resurrected-and-how-to-configure)
By default, Zellij serializes the session layout (panes and tabs) and the command running in each pane (it will re-run them in command panes). Through configuration it's possible to have Zellij also serialize and resurrect the pane viewport and scrollback.
Zellij does not immediately run resurrected commands, but rather places them behind a "Press `ENTER` to run..." banner so as to prevent uncomfortable accidents with things like `rm -rf`.
### [`session_serialization`](https://zellij.dev/documentation/session-resurrection.html#session_serialization)
To disable session serialization (and thus also resurrection), set `session_serialization false` in the [config](https://zellij.dev/documentation/configuration.html).
### [`pane_viewport_serialization`](https://zellij.dev/documentation/session-resurrection.html#pane_viewport_serialization)
When `session_serialization` is enabled, setting `pane_viewport_serialization` to `true` in the [config](https://zellij.dev/documentation/configuration.html) will also serialize the pane viewport (the part of the terminal visible on screen).
### [`scrollback_lines_to_serialize`](https://zellij.dev/documentation/session-resurrection.html#scrollback_lines_to_serialize)
When `pane_viewport_serialization` is enabled, setting `scrollback_lines_to_serialize` to `0` in the [config](https://zellij.dev/documentation/configuration.html) will serialize all scrollback and to any other number will serialize line number up to that scrollback. Note that this might incur higher resource utilization (and certainly a higher cache folder usage...)
### [`post_command_discovery_hook`](https://zellij.dev/documentation/session-resurrection.html#post_command_discovery_hook)
When Zellij attempts to discover commands running inside panes so that it can serialize them, it can sometimes be inaccurate. This can happen when (for example) commands are run inside some sort of wrapper. To get around this, it's possible to define a `post_command_discovery_hook`. This is a command that will run in the context of te user's default shell and be provided the `$RESURRECT_COMMAND` that has just been discovered for a specific pane and not yet serialized. Whatever this command sends over `STDOUT` will be serialized in place of the discovered command.
Example:

```

__
post_command_discovery_hook "echo \"$RESURRECT_COMMAND\" | sed 's/^sudo\\s\\+//'" // strip sudo from commands

```

## [Resurrecting Sessions through the CLI](https://zellij.dev/documentation/session-resurrection.html#resurrecting-sessions-through-the-cli)
To list exited sessions, use `zellij list-sessions` (or `zellij ls`) for short:
![zellij-list-sessions-output](https://zellij.dev/documentation/img/zellij-ls-resurrection.png)
Then, in order to resurrect a session, one can `attach` to it. If you'd like to immediately run all resurrected commands and skip the "Press `ENTER` to run..." banner, you can issue the `--force-run-commands` flag.
## [Resurrecting Sessions through the session-manager](https://zellij.dev/documentation/session-resurrection.html#resurrecting-sessions-through-the-session-manager)
Sessions can also be resurrected and switched to from within a Zellij session using the `session-manager`. To do this, press `<TAB>` to toggle the `EXITED` sessions and select one with `<ENTER>`.
## [Permanently Deleting Sessions](https://zellij.dev/documentation/session-resurrection.html#permanently-deleting-sessions)
Resurrectable sessions can be permanently deleted with the `zellij delete-session` or `zellij delete-all-sessions` CLI commands. They can also be deleted from the `session-manager`.
## [Session files in the cache](https://zellij.dev/documentation/session-resurrection.html#session-files-in-the-cache)
Zellij serializes the session data into a [layout](https://zellij.dev/documentation/layouts.html) every 1 second and saves it to the system's cache folder. These layouts can later be examined, altered and even shared as is across machines. They can be loaded with `zellij --layout session-layout.kdl` just like any other layout. They are intentionally Human readable to facilitate their re-use.
[ ](https://zellij.dev/documentation/plugin-other-languages.html "Previous chapter") [ ](https://zellij.dev/documentation/web-client.html "Next chapter")
[ ](https://zellij.dev/documentation/plugin-other-languages.html "Previous chapter") [ ](https://zellij.dev/documentation/web-client.html "Next chapter")
