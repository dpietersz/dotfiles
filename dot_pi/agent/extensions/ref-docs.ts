/**
 * ref-docs - Make the LLM aware of locally cached documentation
 *
 * Scans .ai/ref-docs/ (project) and ~/.pi/.ai/ref-docs/ (global) for
 * documentation fetched by the docsfetch tool. Reads the _index.md files
 * to extract domain, page titles, and descriptions, then injects a
 * summary into the system prompt so the LLM knows what reference docs
 * are available and can read specific pages when needed.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";

interface DocSite {
  domain: string;
  title: string;
  description: string;
  scrapedAt: string;
  dir: string;
  scope: "project" | "global";
  pages: Array<{ title: string; file: string; description: string }>;
}

function parseFrontmatter(content: string): Record<string, string> {
  const fm: Record<string, string> = {};
  if (!content.startsWith("---")) return fm;
  const endIdx = content.indexOf("\n---", 3);
  if (endIdx === -1) return fm;
  const block = content.slice(4, endIdx);
  for (const line of block.split("\n")) {
    const match = line.match(/^(\w[\w_]*)\s*:\s*"?(.*?)"?\s*$/);
    if (match) fm[match[1]] = match[2];
  }
  return fm;
}

function parseIndexPages(content: string): Array<{ title: string; file: string; description: string }> {
  const pages: Array<{ title: string; file: string; description: string }> = [];
  // Match lines like: - [Title](./filename.md) - Description
  // or: - [Title](./filename.md)
  const re = /^- \[([^\]]+)\]\(\.\/([^)]+)\)(?:\s*-\s*(.*))?$/gm;
  let match;
  while ((match = re.exec(content)) !== null) {
    pages.push({
      title: match[1],
      file: match[2],
      description: (match[3] || "").trim(),
    });
  }
  return pages;
}

/**
 * Recursively find all directories containing _index.md under refDocsDir.
 * This supports both flat domains (e.g., opencode.ai/) and nested paths
 * (e.g., github.com/owner/repo/).
 */
function findIndexDirs(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;

  const indexPath = path.join(dir, "_index.md");
  if (fs.existsSync(indexPath)) {
    results.push(dir);
  }

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    results.push(...findIndexDirs(path.join(dir, entry.name)));
  }

  return results;
}

function scanRefDocs(baseDir: string, scope: "project" | "global"): DocSite[] {
  const sites: DocSite[] = [];
  const refDocsDir = path.join(baseDir, ".ai", "ref-docs");

  if (!fs.existsSync(refDocsDir)) return sites;

  for (const domainDir of findIndexDirs(refDocsDir)) {
    const indexPath = path.join(domainDir, "_index.md");

    try {
      const content = fs.readFileSync(indexPath, "utf8");
      const fm = parseFrontmatter(content);
      const pages = parseIndexPages(content);

      // Derive the relative path from refDocsDir as fallback domain
      const relativePath = path.relative(refDocsDir, domainDir);

      sites.push({
        domain: fm.domain || relativePath,
        title: fm.title || `${relativePath} Documentation`,
        description: fm.description || "",
        scrapedAt: fm.scraped_at || "",
        dir: domainDir,
        scope,
        pages,
      });
    } catch {
      // skip unreadable
    }
  }

  return sites;
}

export default function refDocsExtension(pi: ExtensionAPI) {
  let docSites: DocSite[] = [];

  // Scan for ref-docs on session start
  pi.on("session_start", async (_event, ctx) => {
    const projectSites = scanRefDocs(ctx.cwd, "project");
    const globalDir = path.join(os.homedir(), ".pi");
    const globalSites = scanRefDocs(globalDir, "global");

    // Dedupe by domain — keep the most recently scraped version
    const byDomain = new Map<string, DocSite>();
    for (const site of [...projectSites, ...globalSites]) {
      const existing = byDomain.get(site.domain);
      if (!existing) {
        byDomain.set(site.domain, site);
      } else {
        // Compare scraped_at timestamps, keep the most recent
        const existingTime = existing.scrapedAt ? new Date(existing.scrapedAt).getTime() : 0;
        const newTime = site.scrapedAt ? new Date(site.scrapedAt).getTime() : 0;
        if (newTime > existingTime) {
          byDomain.set(site.domain, site);
        }
      }
    }
    docSites = Array.from(byDomain.values());
  });

  // Inject available docs into system prompt
  pi.on("before_agent_start", async (event) => {
    if (docSites.length === 0) return;

    const sections: string[] = [];

    for (const site of docSites) {
      const loc =
        site.scope === "project"
          ? `.ai/ref-docs/${site.domain}/`
          : `~/.pi/.ai/ref-docs/${site.domain}/`;

      let section = `### ${site.domain}\n`;
      if (site.description) section += `${site.description}\n`;
      section += `Location: ${loc}\n`;
      section += `Index: ${loc}_index.md\n`;

      if (site.pages.length > 0) {
        section += "\nPages:\n";
        for (const page of site.pages) {
          section += `- ${page.file}: ${page.title}\n`;
        }
      }

      sections.push(section);
    }

    return {
      systemPrompt:
        event.systemPrompt +
        `\n\n## Reference Documentation\n\n` +
        `The following documentation has been fetched and cached locally for reference. ` +
        `Use the read tool to load specific pages when you need detailed information. ` +
        `Start with the _index.md file to see all available pages and their descriptions, ` +
        `then read individual pages as needed.\n\n` +
        sections.join("\n"),
    };
  });
}
