/**
 * Todo Extension — Task tracking for multi-step work
 *
 * Registers a `todo` tool for the LLM to manage todos and a `/todos` command
 * for users. State is stored in tool result details for proper branching support.
 *
 * Based on pi's todo.ts example with enforcement via promptGuidelines.
 */

import { StringEnum } from "@mariozechner/pi-ai";
import type { ExtensionAPI, ExtensionContext, Theme } from "@mariozechner/pi-coding-agent";
import { matchesKey, Text, truncateToWidth } from "@mariozechner/pi-tui";
import { Type } from "@sinclair/typebox";

interface Todo {
	id: number;
	text: string;
	status: "pending" | "in_progress" | "completed";
}

interface TodoDetails {
	action: string;
	todos: Todo[];
	nextId: number;
	error?: string;
}

const TodoParams = Type.Object({
	action: StringEnum(["list", "add", "update", "clear"] as const),
	text: Type.Optional(Type.String({ description: "Todo text (for add)" })),
	id: Type.Optional(Type.Number({ description: "Todo ID (for update)" })),
	status: Type.Optional(StringEnum(["in_progress", "completed"] as const, { description: "New status (for update)" })),
});

function formatTodo(t: Todo): string {
	const icon = t.status === "completed" ? "[x]" : t.status === "in_progress" ? "[>]" : "[ ]";
	return `${icon} #${t.id}: ${t.text}`;
}

class TodoListComponent {
	private todos: Todo[];
	private theme: Theme;
	private onClose: () => void;
	private cachedWidth?: number;
	private cachedLines?: string[];

	constructor(todos: Todo[], theme: Theme, onClose: () => void) {
		this.todos = todos;
		this.theme = theme;
		this.onClose = onClose;
	}

	handleInput(data: string): void {
		if (matchesKey(data, "escape") || matchesKey(data, "ctrl+c")) {
			this.onClose();
		}
	}

	render(width: number): string[] {
		if (this.cachedLines && this.cachedWidth === width) return this.cachedLines;

		const lines: string[] = [""];
		const th = this.theme;
		const title = th.fg("accent", " Todos ");
		lines.push(th.fg("borderMuted", "─".repeat(3)) + title + th.fg("borderMuted", "─".repeat(Math.max(0, width - 10))));
		lines.push("");

		if (this.todos.length === 0) {
			lines.push(truncateToWidth(`  ${th.fg("dim", "No todos yet.")}`, width));
		} else {
			const done = this.todos.filter((t) => t.status === "completed").length;
			const inProg = this.todos.filter((t) => t.status === "in_progress").length;
			lines.push(truncateToWidth(`  ${th.fg("muted", `${done}/${this.todos.length} completed${inProg ? `, ${inProg} in progress` : ""}`)}`, width));
			lines.push("");
			for (const todo of this.todos) {
				const check = todo.status === "completed" ? th.fg("success", "✓")
					: todo.status === "in_progress" ? th.fg("warning", "●")
					: th.fg("dim", "○");
				const id = th.fg("accent", `#${todo.id}`);
				const text = todo.status === "completed" ? th.fg("dim", todo.text) : th.fg("text", todo.text);
				lines.push(truncateToWidth(`  ${check} ${id} ${text}`, width));
			}
		}

		lines.push("");
		lines.push(truncateToWidth(`  ${th.fg("dim", "Press Escape to close")}`, width));
		lines.push("");

		this.cachedWidth = width;
		this.cachedLines = lines;
		return lines;
	}

	invalidate(): void {
		this.cachedWidth = undefined;
		this.cachedLines = undefined;
	}
}

export default function (pi: ExtensionAPI) {
	let todos: Todo[] = [];
	let nextId = 1;

	const reconstructState = (ctx: ExtensionContext) => {
		todos = [];
		nextId = 1;
		for (const entry of ctx.sessionManager.getBranch()) {
			if (entry.type !== "message") continue;
			const msg = entry.message;
			if (msg.role !== "toolResult" || msg.toolName !== "todo") continue;
			const details = msg.details as TodoDetails | undefined;
			if (details) {
				todos = details.todos;
				nextId = details.nextId;
			}
		}
	};

	// session_start fires with event.reason in {startup, reload, new, resume, fork}
	// since pi 0.65 — covers what the removed session_switch and session_fork used
	// to fire for. session_tree still exists as its own event.
	pi.on("session_start", async (_event, ctx) => reconstructState(ctx));
	pi.on("session_tree", async (_event, ctx) => reconstructState(ctx));

	pi.registerTool({
		name: "todo",
		label: "Todo",
		description: "Manage todos for tracking multi-step work. Actions: list, add (text), update (id + status), clear.",
		promptSnippet: "Manage todos for tracking multi-step work. Actions: list, add (text), update (id + status), clear.",
		promptGuidelines: [
			"Create todos BEFORE starting any multi-step task (2+ steps). This is mandatory for user visibility and drift prevention.",
			"Mark each todo in_progress before starting it (only ONE at a time). Mark completed IMMEDIATELY when done (never batch).",
			"If scope changes during work, update todos before proceeding.",
		],
		parameters: TodoParams,

		async execute(_toolCallId, params, _signal, _onUpdate, _ctx) {
			switch (params.action) {
				case "list":
					return {
						content: [{ type: "text", text: todos.length ? todos.map(formatTodo).join("\n") : "No todos" }],
						details: { action: "list", todos: [...todos], nextId } as TodoDetails,
					};

				case "add": {
					if (!params.text) {
						return {
							content: [{ type: "text", text: "Error: text required for add" }],
							details: { action: "add", todos: [...todos], nextId, error: "text required" } as TodoDetails,
						};
					}
					const newTodo: Todo = { id: nextId++, text: params.text, status: "pending" };
					todos.push(newTodo);
					return {
						content: [{ type: "text", text: `Added #${newTodo.id}: ${newTodo.text}` }],
						details: { action: "add", todos: [...todos], nextId } as TodoDetails,
					};
				}

				case "update": {
					if (params.id === undefined || !params.status) {
						return {
							content: [{ type: "text", text: "Error: id and status required for update" }],
							details: { action: "update", todos: [...todos], nextId, error: "id and status required" } as TodoDetails,
						};
					}
					const todo = todos.find((t) => t.id === params.id);
					if (!todo) {
						return {
							content: [{ type: "text", text: `Todo #${params.id} not found` }],
							details: { action: "update", todos: [...todos], nextId, error: `#${params.id} not found` } as TodoDetails,
						};
					}
					todo.status = params.status;
					return {
						content: [{ type: "text", text: `#${todo.id} → ${todo.status}` }],
						details: { action: "update", todos: [...todos], nextId } as TodoDetails,
					};
				}

				case "clear": {
					const count = todos.length;
					todos = [];
					nextId = 1;
					return {
						content: [{ type: "text", text: `Cleared ${count} todos` }],
						details: { action: "clear", todos: [], nextId: 1 } as TodoDetails,
					};
				}

				default:
					return {
						content: [{ type: "text", text: `Unknown action: ${params.action}` }],
						details: { action: "list", todos: [...todos], nextId, error: `unknown: ${params.action}` } as TodoDetails,
					};
			}
		},

		renderCall(args, theme) {
			let text = theme.fg("toolTitle", theme.bold("todo ")) + theme.fg("muted", args.action);
			if (args.text) text += ` ${theme.fg("dim", `"${args.text}"`)}`;
			if (args.id !== undefined) text += ` ${theme.fg("accent", `#${args.id}`)}`;
			if (args.status) text += ` → ${theme.fg("warning", args.status)}`;
			return new Text(text, 0, 0);
		},

		renderResult(result, { expanded }, theme) {
			const details = result.details as TodoDetails | undefined;
			if (!details) {
				const text = result.content[0];
				return new Text(text?.type === "text" ? text.text : "", 0, 0);
			}
			if (details.error) return new Text(theme.fg("error", `Error: ${details.error}`), 0, 0);

			const todoList = details.todos;
			if (details.action === "list" || details.action === "add" || details.action === "update") {
				if (todoList.length === 0) return new Text(theme.fg("dim", "No todos"), 0, 0);
				const done = todoList.filter((t) => t.status === "completed").length;
				let text = theme.fg("muted", `${done}/${todoList.length} completed`);
				const display = expanded ? todoList : todoList.slice(0, 8);
				for (const t of display) {
					const check = t.status === "completed" ? theme.fg("success", "✓")
						: t.status === "in_progress" ? theme.fg("warning", "●")
						: theme.fg("dim", "○");
					const itemText = t.status === "completed" ? theme.fg("dim", t.text) : theme.fg("muted", t.text);
					text += `\n${check} ${theme.fg("accent", `#${t.id}`)} ${itemText}`;
				}
				if (!expanded && todoList.length > 8) text += `\n${theme.fg("dim", `... ${todoList.length - 8} more`)}`;
				return new Text(text, 0, 0);
			}

			if (details.action === "clear") return new Text(theme.fg("success", "✓ ") + theme.fg("muted", "Cleared all todos"), 0, 0);
			const fallback = result.content[0];
			return new Text(fallback?.type === "text" ? fallback.text : "", 0, 0);
		},
	});

	pi.registerCommand("todos", {
		description: "Show all todos on the current branch",
		handler: async (_args, ctx) => {
			if (!ctx.hasUI) {
				ctx.ui.notify("/todos requires interactive mode", "error");
				return;
			}
			await ctx.ui.custom<void>((_tui, theme, _kb, done) => {
				return new TodoListComponent(todos, theme, () => done());
			});
		},
	});
}
