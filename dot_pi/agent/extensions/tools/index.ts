/**
 * Tools Extension Loader
 *
 * Dynamically discovers and loads all tool modules from the tools/ directory.
 * Each tool is a .ts file that exports a `register(pi)` function.
 *
 * Provides a `/tools` command to list all registered custom tools with descriptions.
 *
 * To add a new tool:
 *   1. Create a new .ts file in this directory (e.g. my-tool.ts)
 *   2. Create a matching .txt file with the tool description (e.g. my-tool.txt)
 *      The .txt file tells the LLM what the tool does and when to use it.
 *   3. In the .ts file, export a `register(pi: ExtensionAPI)` function
 *   4. Load the description: `readFileSync(join(__dirname, "my-tool.txt"), "utf8")`
 *   5. The tool will be auto-discovered on next /reload or restart
 */

import type { ExtensionAPI, ExtensionContext } from "@mariozechner/pi-coding-agent";
import { DynamicBorder } from "@mariozechner/pi-coding-agent";
import { Container, SelectList, Text, type SelectItem } from "@mariozechner/pi-tui";
import { readdirSync } from "node:fs";
import { dirname, join, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

interface ToolModule {
  register: (pi: ExtensionAPI) => void;
}

export default async function (pi: ExtensionAPI) {
  const loadedTools: Array<{ name: string; file: string }> = [];

  // Discover and load all tool files in this directory
  const files = readdirSync(__dirname).filter(
    (f) => f.endsWith(".ts") && f !== "index.ts"
  );

  for (const file of files) {
    const toolPath = join(__dirname, file);
    try {
      // Dynamic import - jiti intercepts this for .ts files
      const mod = (await import(pathToFileURL(toolPath).href)) as ToolModule;
      if (typeof mod.register === "function") {
        mod.register(pi);
        loadedTools.push({ name: basename(file, ".ts"), file });
      } else {
        console.error(`[tools] ${file}: no register() export found, skipping`);
      }
    } catch (err) {
      console.error(`[tools] Failed to load ${file}:`, err);
    }
  }

  // /tools command - list all custom tools
  pi.registerCommand("tools", {
    description: "List all custom tools",
    handler: async (_args, ctx) => {
      if (!ctx.hasUI) {
        ctx.ui.notify("Tools command requires interactive mode", "error");
        return;
      }

      const allTools = pi.getAllTools();

      // Built-in tool names to filter out
      const builtIn = new Set(["read", "bash", "edit", "write", "grep", "find", "ls"]);
      const customTools = allTools.filter((t) => !builtIn.has(t.name));

      if (customTools.length === 0) {
        ctx.ui.notify("No custom tools registered", "info");
        return;
      }

      const items: SelectItem[] = customTools.map((t) => ({
        value: t.name,
        label: t.name,
        description: t.description.split("\n")[0].slice(0, 80),
      }));

      await ctx.ui.custom<string | null>((tui, theme, _kb, done) => {
        const container = new Container();
        container.addChild(new DynamicBorder((str) => theme.fg("accent", str)));
        container.addChild(
          new Text(
            theme.fg("accent", theme.bold(` Custom Tools (${customTools.length})`)),
            0,
            0
          )
        );

        const selectList = new SelectList(items, Math.min(items.length, 15), {
          selectedPrefix: (text) => theme.fg("accent", text),
          selectedText: (text) => theme.fg("accent", text),
          description: (text) => theme.fg("muted", text),
          scrollInfo: (text) => theme.fg("dim", text),
          noMatch: (text) => theme.fg("warning", text),
        });

        selectList.onSelect = (item) => done(item.value as string);
        selectList.onCancel = () => done(null);

        container.addChild(selectList);
        container.addChild(
          new Text(
            theme.fg("dim", "Press esc to close"),
            0,
            0
          )
        );
        container.addChild(new DynamicBorder((str) => theme.fg("accent", str)));

        return {
          render(width: number) {
            return container.render(width);
          },
          invalidate() {
            container.invalidate();
          },
          handleInput(data: string) {
            selectList.handleInput(data);
            tui.requestRender();
          },
        };
      });
    },
  });
}
