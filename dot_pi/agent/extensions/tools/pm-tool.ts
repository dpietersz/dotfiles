/**
 * pm-tool — Linear Project Management Tool
 *
 * Manages issues, projects, documents, milestones, comments, and more
 * via the Linear GraphQL API. Authenticates as @Minion using OAuth
 * client_credentials with actor=app mode.
 *
 * Auth env vars:
 *   LINEAR_ACCESS_TOKEN  — OAuth access token (client_credentials, 30-day)
 *   LINEAR_CLIENT_ID     — OAuth app client ID (for token refresh)
 *   LINEAR_CLIENT_SECRET — OAuth app client secret (for token refresh)
 *   LINEAR_APP_USER_ID   — Minion's user ID in the workspace
 */

import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import {
  truncateHead,
  DEFAULT_MAX_BYTES,
  DEFAULT_MAX_LINES,
  formatSize,
} from "@mariozechner/pi-coding-agent";
import { Type, type Static } from "@sinclair/typebox";
import { Text } from "@mariozechner/pi-tui";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const LINEAR_API = "https://api.linear.app/graphql";
const DESCRIPTION = readFileSync(join(__dirname, "pm-tool.txt"), "utf8").trim();

// ── Auth & GraphQL Client ──────────────────────────────────────────────────

let _accessToken: string | null = null;

function getAccessToken(): string {
  if (_accessToken) return _accessToken;
  const token = process.env.LINEAR_ACCESS_TOKEN;
  if (!token) throw new Error("LINEAR_ACCESS_TOKEN not set");
  _accessToken = token;
  return token;
}

function getAppUserId(): string {
  return process.env.LINEAR_APP_USER_ID ?? "";
}

/** Refresh the token using client_credentials grant */
async function refreshToken(): Promise<string> {
  const clientId = process.env.LINEAR_CLIENT_ID;
  const clientSecret = process.env.LINEAR_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error("LINEAR_CLIENT_ID/SECRET not set, cannot refresh token");

  const resp = await fetch("https://api.linear.app/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=client_credentials&scope=read,write,app:assignable&client_id=${clientId}&client_secret=${clientSecret}`,
  });
  if (!resp.ok) throw new Error(`Token refresh failed (${resp.status}): ${await resp.text()}`);
  const data = await resp.json();
  _accessToken = data.access_token;
  return _accessToken!;
}

interface GqlResult<T = any> {
  data?: T;
  errors?: Array<{ message: string; extensions?: any }>;
}

/** Execute a GraphQL query/mutation, auto-refresh on 401 */
async function gql<T = any>(query: string, variables?: Record<string, any>): Promise<T> {
  let token = getAccessToken();

  const doRequest = async (t: string): Promise<GqlResult<T>> => {
    const resp = await fetch(LINEAR_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${t}`,
      },
      body: JSON.stringify({ query, variables }),
    });
    if (resp.status === 401) throw { status: 401 };
    if (!resp.ok) throw new Error(`Linear API error (${resp.status}): ${await resp.text()}`);
    return resp.json();
  };

  let result: GqlResult<T>;
  try {
    result = await doRequest(token);
  } catch (err: any) {
    if (err?.status === 401) {
      token = await refreshToken();
      result = await doRequest(token);
    } else throw err;
  }

  if (result.errors?.length) {
    const msg = result.errors.map((e) => e.message).join("; ");
    throw new Error(`GraphQL error: ${msg}`);
  }
  if (!result.data) throw new Error("No data returned from Linear API");
  return result.data;
}

// ── Resolver helpers ───────────────────────────────────────────────────────

// Cache for teams, states, labels (fetched once per session)
let _teamsCache: any[] | null = null;

async function getTeams(): Promise<any[]> {
  if (_teamsCache) return _teamsCache;
  const data = await gql(`{
    teams { nodes { id name key
      states { nodes { id name type position } }
      labels { nodes { id name color } }
    } }
  }`);
  _teamsCache = data.teams.nodes;
  return _teamsCache!;
}

async function resolveTeamId(team?: string): Promise<string> {
  if (!team) {
    const teams = await getTeams();
    if (teams.length === 1) return teams[0].id;
    throw new Error(`Multiple teams found. Specify team name/key: ${teams.map((t: any) => t.key).join(", ")}`);
  }
  if (isUUID(team)) return team;
  const teams = await getTeams();
  const found = teams.find(
    (t: any) => t.key.toLowerCase() === team.toLowerCase() || t.name.toLowerCase() === team.toLowerCase()
  );
  if (!found) throw new Error(`Team not found: "${team}". Available: ${teams.map((t: any) => `${t.name} (${t.key})`).join(", ")}`);
  return found.id;
}

async function resolveStateId(state: string, teamId: string): Promise<string> {
  if (isUUID(state)) return state;
  const teams = await getTeams();
  const team = teams.find((t: any) => t.id === teamId);
  if (!team) throw new Error(`Team ${teamId} not found`);
  const found = team.states.nodes.find((s: any) => s.name.toLowerCase() === state.toLowerCase());
  if (!found) throw new Error(`State "${state}" not found. Available: ${team.states.nodes.map((s: any) => s.name).join(", ")}`);
  return found.id;
}

async function resolveLabelIds(labels: string[], teamId: string): Promise<string[]> {
  const teams = await getTeams();
  const team = teams.find((t: any) => t.id === teamId);
  if (!team) return labels; // fallback to raw IDs
  return labels.map((l) => {
    if (isUUID(l)) return l;
    const found = team.labels.nodes.find((lb: any) => lb.name.toLowerCase() === l.toLowerCase());
    if (!found) throw new Error(`Label "${l}" not found. Available: ${team.labels.nodes.map((lb: any) => lb.name).join(", ")}`);
    return found.id;
  });
}

async function resolveAssigneeId(assignee: string): Promise<string> {
  if (assignee.toLowerCase() === "minion") return getAppUserId();
  if (isUUID(assignee)) return assignee;
  const data = await gql(`{ users { nodes { id name } } }`);
  const found = data.users.nodes.find((u: any) => u.name.toLowerCase() === assignee.toLowerCase());
  if (!found) throw new Error(`User "${assignee}" not found. Available: ${data.users.nodes.map((u: any) => u.name).join(", ")}`);
  return found.id;
}

async function resolveProjectId(project: string): Promise<string> {
  if (isUUID(project)) return project;
  const data = await gql(`{ projects(first: 50) { nodes { id name } } }`);
  const found = data.projects.nodes.find(
    (p: any) => p.name.toLowerCase() === project.toLowerCase()
  );
  if (!found) throw new Error(`Project "${project}" not found. Available: ${data.projects.nodes.map((p: any) => p.name).join(", ")}`);
  return found.id;
}

function isUUID(s: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}

async function resolveProjectFromMilestone(milestoneId: string): Promise<string> {
  const data = await gql(`{ projectMilestone(id: "${milestoneId}") { project { id } } }`);
  if (!data.projectMilestone?.project?.id) {
    throw new Error(`Could not resolve project for milestone "${milestoneId}"`);
  }
  return data.projectMilestone.project.id;
}

// ── Output formatters ──────────────────────────────────────────────────────

function fmtIssue(i: any): string {
  const lines = [
    `[${i.identifier}] ${i.title}`,
    `  id: ${i.id}`,
    `  url: ${i.url}`,
    `  state: ${i.state?.name ?? "—"} | priority: ${fmtPriority(i.priority)} | assignee: ${i.assignee?.name ?? "unassigned"}`,
  ];
  if (i.delegate?.name) lines.push(`  delegate: ${i.delegate.name}`);
  if (i.project?.name) lines.push(`  project: ${i.project.name}`);
  if (i.projectMilestone?.name) lines.push(`  milestone: ${i.projectMilestone.name}`);
  if (i.cycle?.name || i.cycle?.number) lines.push(`  cycle: ${i.cycle?.name ?? `#${i.cycle?.number}`}`);
  if (i.labels?.nodes?.length) lines.push(`  labels: ${i.labels.nodes.map((l: any) => l.name).join(", ")}`);
  if (i.dueDate) lines.push(`  due: ${i.dueDate}`);
  if (i.estimate) lines.push(`  estimate: ${i.estimate}`);
  if (i.description) {
    lines.push(`  description: ${i.description}`);
  }
  return lines.join("\n");
}

function fmtIssueBrief(i: any): string {
  const state = i.state?.name ?? "—";
  const assignee = i.assignee?.name ?? "—";
  const pri = fmtPriority(i.priority);
  const est = i.estimate != null ? ` | est:${i.estimate}` : "";
  const milestone = i.projectMilestone?.name ? ` | ms:${i.projectMilestone.name}` : "";
  return `[${i.identifier}] ${i.title}  (${state} | ${pri} | ${assignee}${est}${milestone})  id:${i.id}`;
}

function fmtPriority(p: number | undefined): string {
  return { 0: "none", 1: "urgent", 2: "high", 3: "normal", 4: "low" }[p ?? 0] ?? `p${p}`;
}

function fmtProject(p: any): string {
  const lines = [
    `[Project] ${p.name}`,
    `  id: ${p.id}`,
    `  url: ${p.url}`,
    `  status: ${p.status?.name ?? p.state ?? "—"} | priority: ${fmtPriority(p.priority)} | lead: ${p.lead?.name ?? "—"}`,
  ];
  if (p.startDate) lines.push(`  start: ${p.startDate}`);
  if (p.targetDate) lines.push(`  target: ${p.targetDate}`);
  if (p.description) lines.push(`  summary: ${p.description}`);
  if (p.content) {
    lines.push(`  brief: ${p.content}`);
  }
  return lines.join("\n");
}

function fmtComment(c: any): string {
  const author = c.botActor?.name ?? c.user?.name ?? "unknown";
  const date = c.createdAt ? new Date(c.createdAt).toISOString().slice(0, 16) : "";
  return `[${date}] ${author}: ${c.body ?? ""}  id:${c.id}`;
}

function fmtDocument(d: any): string {
  return `[Doc] ${d.title}  id:${d.id}${d.content ? "\n  " + d.content : ""}`;
}

function fmtLink(l: any): string {
  return `[Link] ${l.label ?? l.url} → ${l.url}  id:${l.id}`;
}

function fmtMilestone(m: any): string {
  return `[Milestone] ${m.name}${m.targetDate ? ` (target: ${m.targetDate})` : ""}  id:${m.id}${m.description ? "\n  " + m.description : ""}`;
}

function fmtProjectUpdate(u: any): string {
  const date = u.createdAt ? new Date(u.createdAt).toISOString().slice(0, 16) : "";
  const health = u.health ?? "—";
  const author = u.user?.name ?? "—";
  return `[${date}] health:${health} by:${author}\n  ${u.body ?? ""}  id:${u.id}`;
}

// ── Issue fragments ────────────────────────────────────────────────────────

const ISSUE_LIST_FIELDS = `id identifier title url priority dueDate estimate sortOrder
  state { name type } assignee { name } delegate { name }
  project { name } cycle { number name }
  projectMilestone { id name }
  labels { nodes { name } }`;

const ISSUE_DETAIL_FIELDS = `${ISSUE_LIST_FIELDS} description createdAt updatedAt
  team { name key } parent { identifier title }
  children { nodes { identifier title state { name } sortOrder } }
  relations { nodes { type relatedIssue { identifier title } } }`;

// ── Action handlers ────────────────────────────────────────────────────────

type ActionHandler = (params: Record<string, any>) => Promise<string>;

const actions: Record<string, ActionHandler> = {
  // ── Issues ─────────────────────────────────────────────────

  async viewer() {
    const data = await gql(`{ viewer { id name email active } }`);
    const v = data.viewer;
    return `Authenticated as: ${v.name} (${v.email})\nid: ${v.id}\nactive: ${v.active}`;
  },

  async list_issues(p) {
    const limit = p.limit ?? 25;
    const filters: string[] = [];
    let teamId: string | undefined;

    if (p.team) {
      teamId = await resolveTeamId(p.team);
      filters.push(`team: { id: { eq: "${teamId}" } }`);
    }
    if (p.state) {
      if (!teamId) teamId = await resolveTeamId();
      const stateId = await resolveStateId(p.state, teamId);
      filters.push(`state: { id: { eq: "${stateId}" } }`);
    }
    if (p.assignee) {
      const uid = await resolveAssigneeId(p.assignee);
      filters.push(`assignee: { id: { eq: "${uid}" } }`);
    }
    if (p.label) {
      filters.push(`labels: { name: { eq: "${p.label}" } }`);
    }
    if (p.project) {
      filters.push(`project: { name: { eq: "${p.project}" } }`);
    }
    if (p.estimate !== undefined) {
      filters.push(`estimate: { eq: ${p.estimate} }`);
    }
    if (p.priority !== undefined) {
      filters.push(`priority: { eq: ${p.priority} }`);
    }
    if (p.milestone) {
      filters.push(`projectMilestone: { name: { eq: "${p.milestone}" } }`);
    }
    if (p.createdAfter) {
      filters.push(`createdAt: { gte: "${p.createdAfter}" }`);
    }
    if (p.updatedAfter) {
      filters.push(`updatedAt: { gte: "${p.updatedAfter}" }`);
    }
    if (p.hasBlocking) {
      filters.push(`hasBlockingRelations: { eq: true }`);
    }
    if (p.parentId) {
      const pid = await resolveIssueId(p.parentId);
      filters.push(`parent: { id: { eq: "${pid}" } }`);
    }

    const filterStr = filters.length ? `filter: { ${filters.join(", ")} }` : "";
    const orderBy = p.orderBy === "createdAt" ? "createdAt" : "updatedAt";
    const data = await gql(`{ issues(first: ${limit}, ${filterStr}, orderBy: ${orderBy}) { nodes { ${ISSUE_LIST_FIELDS} } } }`);
    if (!data.issues.nodes.length) return "No issues found.";
    let issues = data.issues.nodes;
    if (p.orderBy === "sortOrder") {
      issues = issues.sort((a: any, b: any) => a.sortOrder - b.sortOrder);
    }
    return issues.map(fmtIssueBrief).join("\n");
  },

  async search_issues(p) {
    if (!p.query) throw new Error("query is required");
    const limit = p.limit ?? 15;
    const data = await gql(
      `query ($term: String!) { searchIssues(term: $term, first: ${limit}) { nodes { ${ISSUE_LIST_FIELDS} } } }`,
      { term: p.query }
    );
    if (!data.searchIssues.nodes.length) return `No issues found for "${p.query}".`;
    return data.searchIssues.nodes.map(fmtIssueBrief).join("\n");
  },

  async get_issue(p) {
    if (!p.id) throw new Error("id is required (UUID or identifier like SUR-42)");
    const isIdent = /^[A-Z]+-\d+$/i.test(p.id);
    const query = isIdent
      ? `query ($id: String!) { issueVcsBranchSearch(branchName: $id) { ${ISSUE_DETAIL_FIELDS} } }`
      : `query ($id: String!) { issue(id: $id) { ${ISSUE_DETAIL_FIELDS} } }`;

    // For identifiers, use a filter-based approach instead
    if (isIdent) {
      const [teamKey, numStr] = p.id.split("-");
      const num = parseInt(numStr);
      const data = await gql(`{ issues(filter: { team: { key: { eq: "${teamKey.toUpperCase()}" } }, number: { eq: ${num} } }) { nodes { ${ISSUE_DETAIL_FIELDS} } } }`);
      if (!data.issues.nodes.length) throw new Error(`Issue ${p.id} not found`);
      const issue = data.issues.nodes[0];
      let out = fmtIssue(issue);
      if (issue.children?.nodes?.length) {
        const sorted = [...issue.children.nodes].sort((a: any, b: any) => a.sortOrder - b.sortOrder);
        out += "\n  sub-issues:";
        for (const c of sorted) out += `\n    [${c.identifier}] ${c.title} (${c.state?.name}) sort:${c.sortOrder}`;
      }
      if (issue.relations?.nodes?.length) {
        out += "\n  relations:";
        for (const r of issue.relations.nodes) out += `\n    ${r.type}: [${r.relatedIssue.identifier}] ${r.relatedIssue.title}`;
      }
      return out;
    }

    const data = await gql(query, { id: p.id });
    const issue = data.issue;
    let out = fmtIssue(issue);
    if (issue.children?.nodes?.length) {
      const sorted = [...issue.children.nodes].sort((a: any, b: any) => a.sortOrder - b.sortOrder);
      out += "\n  sub-issues:";
      for (const c of sorted) out += `\n    [${c.identifier}] ${c.title} (${c.state?.name}) sort:${c.sortOrder}`;
    }
    if (issue.relations?.nodes?.length) {
      out += "\n  relations:";
      for (const r of issue.relations.nodes) out += `\n    ${r.type}: [${r.relatedIssue.identifier}] ${r.relatedIssue.title}`;
    }
    return out;
  },

  async create_issue(p) {
    if (!p.title) throw new Error("title is required");
    const teamId = await resolveTeamId(p.team);
    const input: Record<string, any> = { title: p.title, teamId };

    if (p.description) input.description = p.description;
    if (p.priority !== undefined) input.priority = p.priority;
    if (p.dueDate) input.dueDate = p.dueDate;
    if (p.estimate) input.estimate = p.estimate;
    if (p.sortOrder !== undefined) input.sortOrder = p.sortOrder;
    if (p.project) input.projectId = await resolveProjectId(p.project);
    if (p.cycle) input.cycleId = p.cycle;
    if (p.parent) input.parentId = p.parent;
    if (p.milestone) {
      input.projectMilestoneId = p.milestone;
      if (!input.projectId) input.projectId = await resolveProjectFromMilestone(p.milestone);
    }

    if (p.state) input.stateId = await resolveStateId(p.state, teamId);
    if (p.assignee) input.assigneeId = await resolveAssigneeId(p.assignee);
    if (p.labels?.length) input.labelIds = await resolveLabelIds(p.labels, teamId);

    const data = await gql(
      `mutation ($input: IssueCreateInput!) { issueCreate(input: $input) { success issue { ${ISSUE_LIST_FIELDS} } } }`,
      { input }
    );
    if (!data.issueCreate.success) throw new Error("Issue creation failed");
    return `Created: ${fmtIssueBrief(data.issueCreate.issue)}`;
  },

  async update_issue(p) {
    if (!p.id) throw new Error("id is required");
    const issueId = await resolveIssueId(p.id);
    const input: Record<string, any> = {};

    if (p.title) input.title = p.title;
    if (p.description !== undefined) input.description = p.description;
    if (p.priority !== undefined) input.priority = p.priority;
    if (p.dueDate !== undefined) input.dueDate = p.dueDate || null;
    if (p.estimate !== undefined) input.estimate = p.estimate;
    if (p.project !== undefined) input.projectId = p.project ? await resolveProjectId(p.project) : null;
    if (p.cycle !== undefined) input.cycleId = p.cycle || null;
    if (p.milestone !== undefined) {
      input.projectMilestoneId = p.milestone || null;
      if (p.milestone && !input.projectId) {
        // Auto-resolve project from milestone if not already set in this call
        const issueCheck = await gql(`{ issue(id: "${issueId}") { project { id } } }`);
        if (!issueCheck.issue.project?.id) {
          input.projectId = await resolveProjectFromMilestone(p.milestone);
        }
      }
    }
    if (p.sortOrder !== undefined) input.sortOrder = p.sortOrder;

    if (p.state) {
      // Need teamId to resolve state — get from the issue
      const issueData = await gql(`{ issue(id: "${issueId}") { team { id } } }`);
      input.stateId = await resolveStateId(p.state, issueData.issue.team.id);
    }
    if (p.assignee !== undefined) {
      input.assigneeId = p.assignee ? await resolveAssigneeId(p.assignee) : null;
    }
    if (p.labels?.length) {
      const issueData = await gql(`{ issue(id: "${issueId}") { team { id } } }`);
      input.labelIds = await resolveLabelIds(p.labels, issueData.issue.team.id);
    }
    if (p.addLabels?.length) {
      const issueData = await gql(`{ issue(id: "${issueId}") { team { id } } }`);
      input.addedLabelIds = await resolveLabelIds(p.addLabels, issueData.issue.team.id);
    }
    if (p.removeLabels?.length) {
      const issueData = await gql(`{ issue(id: "${issueId}") { team { id } } }`);
      input.removedLabelIds = await resolveLabelIds(p.removeLabels, issueData.issue.team.id);
    }

    const data = await gql(
      `mutation ($id: String!, $input: IssueUpdateInput!) { issueUpdate(id: $id, input: $input) { success issue { ${ISSUE_LIST_FIELDS} } } }`,
      { id: issueId, input }
    );
    if (!data.issueUpdate.success) throw new Error("Issue update failed");
    return `Updated: ${fmtIssueBrief(data.issueUpdate.issue)}`;
  },

  async assign_to_minion(p) {
    if (!p.id) throw new Error("id is required");
    const issueId = await resolveIssueId(p.id);
    const minionId = getAppUserId();
    if (!minionId) throw new Error("LINEAR_APP_USER_ID not set");

    // App actor assigns as delegate, not assignee
    const data = await gql(
      `mutation ($id: String!, $input: IssueUpdateInput!) { issueUpdate(id: $id, input: $input) { success issue { ${ISSUE_LIST_FIELDS} delegate { name } } } }`,
      { id: issueId, input: { delegateId: minionId } }
    );
    if (!data.issueUpdate.success) throw new Error("Assignment failed");
    return `Assigned to Minion (delegate): ${fmtIssueBrief(data.issueUpdate.issue)}`;
  },

  async delete_issue(p) {
    if (!p.id) throw new Error("id is required");
    const issueId = await resolveIssueId(p.id);
    const data = await gql(`mutation { issueArchive(id: "${issueId}") { success } }`);
    if (!data.issueArchive.success) throw new Error("Archive failed");
    return `Archived issue ${p.id}`;
  },

  async reorder_issues(p) {
    if (!p.issues?.length) throw new Error("issues is required — array of issue IDs in desired order");
    const ids: string[] = p.issues;
    const results: string[] = [];
    // Assign sortOrder values with gaps for future insertions
    for (let i = 0; i < ids.length; i++) {
      const issueId = await resolveIssueId(ids[i]);
      const sortOrder = (i + 1) * 100; // 100, 200, 300, ...
      const data = await gql(
        `mutation ($id: String!, $input: IssueUpdateInput!) { issueUpdate(id: $id, input: $input) { success issue { identifier title sortOrder } } }`,
        { id: issueId, input: { sortOrder } }
      );
      if (!data.issueUpdate.success) {
        results.push(`❌ ${ids[i]}: failed`);
      } else {
        const iss = data.issueUpdate.issue;
        results.push(`✅ ${iss.identifier}: ${iss.title} → sort:${iss.sortOrder}`);
      }
    }
    return `Reordered ${ids.length} issues:\n${results.join("\n")}`;
  },

  // ── Comments ───────────────────────────────────────────────

  async create_comment(p) {
    if (!p.issueId) throw new Error("issueId is required");
    if (!p.body) throw new Error("body is required");
    const issueId = await resolveIssueId(p.issueId);
    const data = await gql(
      `mutation ($input: CommentCreateInput!) { commentCreate(input: $input) { success comment { id body createdAt user { name } botActor { name } } } }`,
      { input: { issueId, body: p.body } }
    );
    if (!data.commentCreate.success) throw new Error("Comment creation failed");
    return `Comment added: ${fmtComment(data.commentCreate.comment)}`;
  },

  async list_comments(p) {
    if (!p.issueId) throw new Error("issueId is required");
    const issueId = await resolveIssueId(p.issueId);
    const limit = p.limit ?? 20;
    const data = await gql(`{ issue(id: "${issueId}") { comments(first: ${limit}) { nodes { id body createdAt user { name } botActor { name } } } } }`);
    if (!data.issue.comments.nodes.length) return "No comments.";
    return data.issue.comments.nodes.map(fmtComment).join("\n");
  },

  // ── Projects ───────────────────────────────────────────────

  async list_projects(p) {
    const limit = p.limit ?? 25;
    const data = await gql(`{ projects(first: ${limit}, orderBy: updatedAt) { nodes { id name url state priority description
      lead { name } startDate targetDate status { name } } } }`);
    if (!data.projects.nodes.length) return "No projects found.";
    return data.projects.nodes.map((proj: any) => {
      const status = proj.status?.name ?? proj.state ?? "—";
      const lead = proj.lead?.name ?? "—";
      return `[Project] ${proj.name}  (${status} | lead:${lead})  id:${proj.id}`;
    }).join("\n");
  },

  async get_project(p) {
    if (!p.id) throw new Error("id is required");
    const data = await gql(`{ project(id: "${p.id}") {
      id name url state priority description content startDate targetDate createdAt updatedAt
      lead { name } status { name }
      teams { nodes { name key } }
      members { nodes { name } }
      documents { nodes { id title } }
      projectMilestones { nodes { id name targetDate } }
      projectUpdates(first: 5) { nodes { id body health createdAt user { name } } }
      externalLinks { nodes { id url label } }
    } }`);
    const proj = data.project;
    let out = fmtProject(proj);
    if (proj.teams?.nodes?.length) out += `\n  teams: ${proj.teams.nodes.map((t: any) => t.name).join(", ")}`;
    if (proj.members?.nodes?.length) out += `\n  members: ${proj.members.nodes.map((m: any) => m.name).join(", ")}`;
    if (proj.documents?.nodes?.length) {
      out += "\n  documents:";
      for (const d of proj.documents.nodes) out += `\n    ${d.title}  id:${d.id}`;
    }
    if (proj.projectMilestones?.nodes?.length) {
      out += "\n  milestones:";
      for (const m of proj.projectMilestones.nodes) out += `\n    ${m.name}${m.targetDate ? ` (${m.targetDate})` : ""}  id:${m.id}`;
    }
    if (proj.externalLinks?.nodes?.length) {
      out += "\n  links:";
      for (const l of proj.externalLinks.nodes) out += `\n    ${l.label ?? l.url} → ${l.url}  id:${l.id}`;
    }
    if (proj.projectUpdates?.nodes?.length) {
      out += "\n  recent updates:";
      for (const u of proj.projectUpdates.nodes) {
        const date = new Date(u.createdAt).toISOString().slice(0, 10);
        out += `\n    [${date}] health:${u.health ?? "—"} ${u.body ?? ""}  id:${u.id}`;
      }
    }
    return out;
  },

  async create_project(p) {
    if (!p.name) throw new Error("name is required");
    const input: Record<string, any> = { name: p.name };

    if (p.teamIds?.length) {
      input.teamIds = p.teamIds;
    } else if (p.team) {
      input.teamIds = [await resolveTeamId(p.team)];
    } else {
      input.teamIds = [await resolveTeamId()];
    }

    if (p.description) input.description = p.description;
    if (p.content) input.content = p.content;
    if (p.leadId) input.leadId = p.leadId;
    if (p.startDate) input.startDate = p.startDate;
    if (p.targetDate) input.targetDate = p.targetDate;
    if (p.priority !== undefined) input.priority = p.priority;

    const data = await gql(
      `mutation ($input: ProjectCreateInput!) { projectCreate(input: $input) { success project { id name url state status { name } } } }`,
      { input }
    );
    if (!data.projectCreate.success) throw new Error("Project creation failed");
    const proj = data.projectCreate.project;
    return `Created: [Project] ${proj.name}  id:${proj.id}  url:${proj.url}`;
  },

  async update_project(p) {
    if (!p.id) throw new Error("id is required");
    const input: Record<string, any> = {};
    if (p.name) input.name = p.name;
    if (p.description !== undefined) input.description = p.description;
    if (p.content !== undefined) input.content = p.content;
    if (p.leadId) input.leadId = p.leadId;
    if (p.statusId) input.statusId = p.statusId;
    if (p.startDate !== undefined) input.startDate = p.startDate || null;
    if (p.targetDate !== undefined) input.targetDate = p.targetDate || null;
    if (p.priority !== undefined) input.priority = p.priority;

    const data = await gql(
      `mutation ($id: String!, $input: ProjectUpdateInput!) { projectUpdate(id: $id, input: $input) { success project { id name url description content status { name } } } }`,
      { id: p.id, input }
    );
    if (!data.projectUpdate.success) throw new Error("Project update failed");
    const proj = data.projectUpdate.project;
    return `Updated: [Project] ${proj.name}  id:${proj.id}`;
  },

  // ── Project Documents ──────────────────────────────────────

  async create_document(p) {
    if (!p.projectId) throw new Error("projectId is required");
    if (!p.title) throw new Error("title is required");
    const input: Record<string, any> = { projectId: p.projectId, title: p.title };
    if (p.content) input.content = p.content;

    const data = await gql(
      `mutation ($input: DocumentCreateInput!) { documentCreate(input: $input) { success document { id title } } }`,
      { input }
    );
    if (!data.documentCreate.success) throw new Error("Document creation failed");
    return `Created: ${fmtDocument(data.documentCreate.document)}`;
  },

  async update_document(p) {
    if (!p.id) throw new Error("id is required");
    const input: Record<string, any> = {};
    if (p.title) input.title = p.title;
    if (p.content !== undefined) input.content = p.content;

    const data = await gql(
      `mutation ($id: String!, $input: DocumentUpdateInput!) { documentUpdate(id: $id, input: $input) { success document { id title } } }`,
      { id: p.id, input }
    );
    if (!data.documentUpdate.success) throw new Error("Document update failed");
    return `Updated: ${fmtDocument(data.documentUpdate.document)}`;
  },

  async list_documents(p) {
    if (!p.projectId) throw new Error("projectId is required");
    const data = await gql(`{ project(id: "${p.projectId}") { documents { nodes { id title content } } } }`);
    if (!data.project.documents.nodes.length) return "No documents.";
    return data.project.documents.nodes.map(fmtDocument).join("\n");
  },

  // ── Project External Links ─────────────────────────────────

  async create_link(p) {
    if (!p.projectId) throw new Error("projectId is required");
    if (!p.url) throw new Error("url is required");
    if (!p.label) throw new Error("label is required");
    const input = { projectId: p.projectId, url: p.url, label: p.label };

    const data = await gql(
      `mutation ($input: EntityExternalLinkCreateInput!) { entityExternalLinkCreate(input: $input) { success entityExternalLink { id url label } } }`,
      { input }
    );
    if (!data.entityExternalLinkCreate.success) throw new Error("Link creation failed");
    const l = data.entityExternalLinkCreate.entityExternalLink;
    return `Created: ${fmtLink(l)}`;
  },

  async delete_link(p) {
    if (!p.id) throw new Error("id is required");
    const data = await gql(`mutation { entityExternalLinkDelete(id: "${p.id}") { success } }`);
    if (!data.entityExternalLinkDelete.success) throw new Error("Link deletion failed");
    return `Deleted link ${p.id}`;
  },

  async list_links(p) {
    if (!p.projectId) throw new Error("projectId is required");
    const data = await gql(`{ project(id: "${p.projectId}") { externalLinks { nodes { id url label } } } }`);
    if (!data.project.externalLinks.nodes.length) return "No links.";
    return data.project.externalLinks.nodes.map(fmtLink).join("\n");
  },

  // ── Project Updates ────────────────────────────────────────

  async create_project_update(p) {
    if (!p.projectId) throw new Error("projectId is required");
    if (!p.body) throw new Error("body is required");
    const input: Record<string, any> = { projectId: p.projectId, body: p.body };
    if (p.health) input.health = p.health;

    const data = await gql(
      `mutation ($input: ProjectUpdateCreateInput!) { projectUpdateCreate(input: $input) { success projectUpdate { id body health createdAt user { name } } } }`,
      { input }
    );
    if (!data.projectUpdateCreate.success) throw new Error("Project update creation failed");
    return `Created: ${fmtProjectUpdate(data.projectUpdateCreate.projectUpdate)}`;
  },

  async list_project_updates(p) {
    if (!p.projectId) throw new Error("projectId is required");
    const limit = p.limit ?? 10;
    const data = await gql(`{ project(id: "${p.projectId}") { projectUpdates(first: ${limit}) { nodes { id body health createdAt user { name } } } } }`);
    if (!data.project.projectUpdates.nodes.length) return "No project updates.";
    return data.project.projectUpdates.nodes.map(fmtProjectUpdate).join("\n\n");
  },

  // ── Milestones ─────────────────────────────────────────────

  async create_milestone(p) {
    if (!p.projectId) throw new Error("projectId is required");
    if (!p.name) throw new Error("name is required");
    const input: Record<string, any> = { projectId: p.projectId, name: p.name };
    if (p.description) input.description = p.description;
    if (p.targetDate) input.targetDate = p.targetDate;

    const data = await gql(
      `mutation ($input: ProjectMilestoneCreateInput!) { projectMilestoneCreate(input: $input) { success projectMilestone { id name targetDate description } } }`,
      { input }
    );
    if (!data.projectMilestoneCreate.success) throw new Error("Milestone creation failed");
    return `Created: ${fmtMilestone(data.projectMilestoneCreate.projectMilestone)}`;
  },

  async update_milestone(p) {
    if (!p.id) throw new Error("id is required");
    const input: Record<string, any> = {};
    if (p.name) input.name = p.name;
    if (p.description !== undefined) input.description = p.description;
    if (p.targetDate !== undefined) input.targetDate = p.targetDate || null;

    const data = await gql(
      `mutation ($id: String!, $input: ProjectMilestoneUpdateInput!) { projectMilestoneUpdate(id: $id, input: $input) { success projectMilestone { id name targetDate description } } }`,
      { id: p.id, input }
    );
    if (!data.projectMilestoneUpdate.success) throw new Error("Milestone update failed");
    return `Updated: ${fmtMilestone(data.projectMilestoneUpdate.projectMilestone)}`;
  },

  async list_milestones(p) {
    if (!p.projectId) throw new Error("projectId is required");
    const data = await gql(`{ project(id: "${p.projectId}") { projectMilestones { nodes { id name targetDate description } } } }`);
    if (!data.project.projectMilestones.nodes.length) return "No milestones.";
    return data.project.projectMilestones.nodes.map(fmtMilestone).join("\n");
  },

  // ── Reference Data ─────────────────────────────────────────

  async list_teams() {
    const teams = await getTeams();
    return teams.map((t: any) => {
      const states = t.states.nodes.sort((a: any, b: any) => a.position - b.position).map((s: any) => `${s.name}(${s.type})`).join(", ");
      const labels = t.labels.nodes.map((l: any) => l.name).join(", ");
      return `[Team] ${t.name} (${t.key})  id:${t.id}\n  states: ${states}\n  labels: ${labels}`;
    }).join("\n\n");
  },

  async list_labels(p) {
    const teamId = await resolveTeamId(p?.team);
    const teams = await getTeams();
    const team = teams.find((t: any) => t.id === teamId);
    return team.labels.nodes.map((l: any) => `${l.name}  id:${l.id}  color:${l.color ?? "—"}`).join("\n");
  },

  async list_states(p) {
    const teamId = await resolveTeamId(p?.team);
    const teams = await getTeams();
    const team = teams.find((t: any) => t.id === teamId);
    return team.states.nodes
      .sort((a: any, b: any) => a.position - b.position)
      .map((s: any) => `${s.name} (${s.type})  id:${s.id}`)
      .join("\n");
  },
};

// ── Issue ID resolver (handles identifiers like SUR-42) ────────────────────

async function resolveIssueId(id: string): Promise<string> {
  if (isUUID(id)) return id;
  if (/^[A-Z]+-\d+$/i.test(id)) {
    const [teamKey, numStr] = id.split("-");
    const num = parseInt(numStr);
    const data = await gql(`{ issues(filter: { team: { key: { eq: "${teamKey.toUpperCase()}" } }, number: { eq: ${num} } }) { nodes { id } } }`);
    if (!data.issues.nodes.length) throw new Error(`Issue ${id} not found`);
    return data.issues.nodes[0].id;
  }
  return id; // assume UUID-like
}

// ── Tool parameter schema ──────────────────────────────────────────────────

const ParameterSchema = Type.Object({
  action: Type.String({ description: "Action to perform. See tool description for full list." }),
  params: Type.Optional(
    Type.Record(Type.String(), Type.Any(), {
      description: "Action-specific parameters as key/value pairs.",
    })
  ),
});

type PmToolParams = Static<typeof ParameterSchema>;

// ── Tool registration ──────────────────────────────────────────────────────

export function register(pi: ExtensionAPI) {
  pi.registerTool({
    name: "pm",
    label: "Linear PM",
    description: DESCRIPTION,
    promptSnippet: "Manage Linear project management via the pm-tool.",
    promptGuidelines: [
      "Delegate Linear operations to the `project-manager` subagent. Use pm directly only for simple single-step tasks; always delegate for multi-step workflows.",
    ],
    parameters: ParameterSchema,

    async execute(toolCallId, params, signal, onUpdate, ctx) {
      const { action, params: actionParams = {} } = params;

      const handler = actions[action];
      if (!handler) {
        const available = Object.keys(actions).join(", ");
        return {
          content: [{ type: "text", text: `Unknown action "${action}". Available: ${available}` }],
          details: { error: true, action },
          isError: true,
        };
      }

      try {
        const result = await handler(actionParams);
        const totalLines = result.split("\n").length;
        const totalBytes = Buffer.byteLength(result, "utf8");

        return {
          content: [{ type: "text", text: result }],
          details: { action, lines: totalLines, bytes: totalBytes },
        };
      } catch (err: any) {
        return {
          content: [{ type: "text", text: `pm/${action} error: ${err.message}` }],
          details: { error: true, action },
          isError: true,
        };
      }
    },

    renderCall(args, theme) {
      let text = theme.fg("toolTitle", theme.bold("pm "));
      text += theme.fg("accent", args.action ?? "?");
      const p = args.params as Record<string, any> | undefined;
      if (p) {
        const preview = Object.entries(p)
          .filter(([_, v]) => v !== undefined && v !== null)
          .slice(0, 3)
          .map(([k, v]) => {
            const vs = typeof v === "string" ? (v.length > 30 ? v.slice(0, 30) + "…" : v) : JSON.stringify(v);
            return `${k}=${vs}`;
          })
          .join(" ");
        if (preview) text += " " + theme.fg("muted", preview);
      }
      return new Text(text, 0, 0);
    },

    renderResult(result, { expanded, isPartial }, theme) {
      if (isPartial) return new Text(theme.fg("warning", "Calling Linear…"), 0, 0);

      const details = result.details as Record<string, any> | undefined;

      if (details?.error) {
        const errorText = result.content?.filter((c: any) => c.type === "text").map((c: any) => c.text).join("") || "Unknown error";
        return new Text(theme.fg("error", errorText), 0, 0);
      }

      const action = details?.action ?? "";
      const lines = details?.lines ?? 0;
      const bytes = details?.bytes ?? 0;

      let text = theme.fg("success", "✓ ");
      text += theme.fg("accent", action);
      text += theme.fg("dim", ` (${lines} lines, ${formatSize(bytes)})`);

      if (expanded) {
        const content = result.content?.filter((c: any) => c.type === "text").map((c: any) => c.text).join("");
        if (content) {
          const preview = content.split("\n").slice(0, 30).join("\n");
          text += "\n" + theme.fg("muted", preview);
          if (content.split("\n").length > 30) {
            text += "\n" + theme.fg("warning", `... (${content.split("\n").length - 30} more lines)`);
          }
        }
      }

      return new Text(text, 0, 0);
    },
  });
}
