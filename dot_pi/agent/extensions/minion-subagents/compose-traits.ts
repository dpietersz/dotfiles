/**
 * Trait composition engine for the trait-composed agent system.
 *
 * Loads traits from traits.yaml, resolves trait keys to prompt fragments,
 * and renders the agent-template.hbs with context + traits into a
 * composed system prompt.
 *
 * Design principles (from Advanced Context Engineering):
 * - Trait fragments are pre-compacted behavioral instructions (3-5 lines each)
 * - Composition adds ~15-20 lines of overhead — context budget aware
 * - Backward compatible: no traits = original system prompt unchanged
 *
 * 12-Factor alignment:
 * - F2 Own Your Prompts: traits are first-class prompt code
 * - F3 Own Your Context Window: targeted injection, not bloat
 * - F10 Small Focused Agents: traits keep agents focused on specific roles
 */

import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { parse as parseYaml } from "yaml";

// ── Types ──────────────────────────────────────────────────────────

export interface TraitDefinition {
	name: string;
	prompt_fragment: string;
}

export interface TraitPreset {
	description: string;
	agent: string;
	traits: string[];
}

export interface TraitsConfig {
	expertise: Record<string, TraitDefinition>;
	personality: Record<string, TraitDefinition>;
	approach: Record<string, TraitDefinition>;
	presets: Record<string, TraitPreset>;
}

export interface ResolvedTraits {
	expertise: TraitDefinition[];
	personality: TraitDefinition[];
	approach: TraitDefinition[];
}

// ── Cached State ───────────────────────────────────────────────────

let cachedTraits: TraitsConfig | null = null;
let cachedTemplate: string | null = null;

// ── YAML Parsing ───────────────────────────────────────────────────

function parseTraitsYaml(content: string): TraitsConfig {
	const raw = parseYaml(content) as Record<string, unknown>;

	const result: TraitsConfig = {
		expertise: {},
		personality: {},
		approach: {},
		presets: {},
	};

	// Parse trait dimensions (expertise, personality, approach)
	for (const dimension of ["expertise", "personality", "approach"] as const) {
		const section = raw[dimension] as Record<string, { name?: string; prompt_fragment?: string }> | undefined;
		if (!section) continue;
		for (const [key, def] of Object.entries(section)) {
			result[dimension][key] = {
				name: def.name ?? key,
				prompt_fragment: (def.prompt_fragment ?? "").trim(),
			};
		}
	}

	// Parse presets
	const presets = raw.presets as Record<string, { description?: string; agent?: string; traits?: string[] }> | undefined;
	if (presets) {
		for (const [key, def] of Object.entries(presets)) {
			result.presets[key] = {
				description: def.description ?? "",
				agent: def.agent ?? "",
				traits: def.traits ?? [],
			};
		}
	}

	return result;
}

// ── Template Renderer (lightweight — no Handlebars dependency) ─────

function renderTemplate(template: string, data: {
	agentName: string;
	contextBody: string;
	hasTraits: boolean;
	expertiseTraits: TraitDefinition[];
	personalityTraits: TraitDefinition[];
	approachTraits: TraitDefinition[];
}): string {
	let result = template;

	// Simple variable replacement
	result = result.replace(/\{\{agentName\}\}/g, data.agentName);
	result = result.replace(/\{\{\{contextBody\}\}\}/g, data.contextBody);

	// Conditional blocks: {{#if hasTraits}}...{{/if}}
	if (data.hasTraits) {
		result = result.replace(/\{\{#if hasTraits\}\}/g, "");
		result = result.replace(/\{\{\/if\}\}/g, "");
	} else {
		result = result.replace(/\{\{#if hasTraits\}\}[\s\S]*?\{\{\/if\}\}/g, "");
	}

	// Conditional array checks: {{#if expertiseTraits.length}}...{{/if}}
	for (const [name, arr] of [
		["expertiseTraits", data.expertiseTraits],
		["personalityTraits", data.personalityTraits],
		["approachTraits", data.approachTraits],
	] as const) {
		const pattern = new RegExp(`\\{\\{#if ${name}\\.length\\}\\}([\\s\\S]*?)\\{\\{/if\\}\\}`, "g");
		if (arr.length > 0) {
			result = result.replace(pattern, "$1");
		} else {
			result = result.replace(pattern, "");
		}
	}

	// Each blocks: {{#each expertiseTraits}}...{{/each}}
	for (const [name, arr] of [
		["expertiseTraits", data.expertiseTraits],
		["personalityTraits", data.personalityTraits],
		["approachTraits", data.approachTraits],
	] as const) {
		const pattern = new RegExp(`\\{\\{#each ${name}\\}\\}([\\s\\S]*?)\\{\\{/each\\}\\}`, "g");
		const match = pattern.exec(result);
		if (match) {
			const itemTemplate = match[1]!;
			const expanded = arr
				.map((trait) => {
					let item = itemTemplate;
					item = item.replace(/\{\{name\}\}/g, trait.name);
					item = item.replace(/\{\{\{prompt_fragment\}\}\}/g, trait.prompt_fragment);
					return item;
				})
				.join("");
			result = result.slice(0, match.index) + expanded + result.slice(match.index + match[0].length);
		}
	}

	// Clean up any double blank lines
	result = result.replace(/\n{3,}/g, "\n\n");

	return result.trim();
}

// ── Public API ─────────────────────────────────────────────────────

/**
 * Find and load traits.yaml. Searches:
 * 1. ~/.pi/agent/traits.yaml (deployed via chezmoi)
 * 2. Fallback: adjacent to this extension
 */
export function loadTraits(): TraitsConfig {
	if (cachedTraits) return cachedTraits;

	const candidates = [
		path.join(os.homedir(), ".pi", "agent", "traits.yaml"),
	];

	for (const candidate of candidates) {
		if (fs.existsSync(candidate)) {
			try {
				const content = fs.readFileSync(candidate, "utf-8");
				cachedTraits = parseTraitsYaml(content);
				return cachedTraits;
			} catch {
				continue;
			}
		}
	}

	// Return empty config if no traits found (backward compat)
	cachedTraits = { expertise: {}, personality: {}, approach: {}, presets: {} };
	return cachedTraits;
}

/**
 * Load the agent composition template.
 */
export function loadTemplate(): string {
	if (cachedTemplate) return cachedTemplate;

	const candidates = [
		path.join(os.homedir(), ".pi", "agent", "agents", "agent-template.hbs"),
	];

	for (const candidate of candidates) {
		if (fs.existsSync(candidate)) {
			try {
				cachedTemplate = fs.readFileSync(candidate, "utf-8");
				return cachedTemplate;
			} catch {
				continue;
			}
		}
	}

	// Fallback: minimal template (just concat)
	cachedTemplate = "# {{agentName}}\n\n{{{contextBody}}}\n\n{{#if hasTraits}}\n---\n\n## Behavioral Profile\n\n{{#each expertiseTraits}}\n### Expertise: {{name}}\n\n{{{prompt_fragment}}}\n\n{{/each}}\n{{#each personalityTraits}}\n### {{name}}\n\n{{{prompt_fragment}}}\n\n{{/each}}\n{{#each approachTraits}}\n### {{name}}\n\n{{{prompt_fragment}}}\n\n{{/each}}\n{{/if}}";
	return cachedTemplate;
}

/**
 * Resolve trait keys to definitions, grouped by dimension.
 */
export function resolveTraits(traitKeys: string[]): ResolvedTraits {
	const traits = loadTraits();
	const resolved: ResolvedTraits = { expertise: [], personality: [], approach: [] };

	for (const key of traitKeys) {
		const normalized = key.trim().toLowerCase();
		if (traits.expertise[normalized]) {
			resolved.expertise.push(traits.expertise[normalized]!);
		} else if (traits.personality[normalized]) {
			resolved.personality.push(traits.personality[normalized]!);
		} else if (traits.approach[normalized]) {
			resolved.approach.push(traits.approach[normalized]!);
		}
		// Unknown traits are silently skipped (backward compat)
	}

	return resolved;
}

/**
 * Resolve a preset name to agent + traits.
 * Returns null if preset not found.
 */
export function resolvePreset(name: string): { agent: string; traits: string[] } | null {
	const traits = loadTraits();
	const preset = traits.presets[name];
	if (!preset) return null;
	return { agent: preset.agent, traits: preset.traits };
}

/**
 * Compose a system prompt from agent context + traits via template.
 *
 * If no traits are provided, returns the original system prompt unchanged.
 * This ensures backward compatibility with existing chains and agent calls.
 */
export function composeSystemPrompt(
	agentName: string,
	agentSystemPrompt: string,
	traitKeys: string[],
): string {
	if (!traitKeys || traitKeys.length === 0) {
		return agentSystemPrompt;
	}

	const resolved = resolveTraits(traitKeys);
	const hasTraits =
		resolved.expertise.length > 0 ||
		resolved.personality.length > 0 ||
		resolved.approach.length > 0;

	if (!hasTraits) {
		return agentSystemPrompt;
	}

	const template = loadTemplate();
	return renderTemplate(template, {
		agentName,
		contextBody: agentSystemPrompt,
		hasTraits,
		expertiseTraits: resolved.expertise,
		personalityTraits: resolved.personality,
		approachTraits: resolved.approach,
	});
}

/**
 * Get all available trait keys (for surfacing in system prompt).
 */
export function getAvailableTraits(): {
	expertise: string[];
	personality: string[];
	approach: string[];
	presets: Record<string, TraitPreset>;
} {
	const traits = loadTraits();
	return {
		expertise: Object.keys(traits.expertise),
		personality: Object.keys(traits.personality),
		approach: Object.keys(traits.approach),
		presets: traits.presets,
	};
}

/**
 * Clear cached state (for testing or hot-reload).
 */
export function clearTraitCache(): void {
	cachedTraits = null;
	cachedTemplate = null;
}
