# Security Audit Workflow Guide

## Overview

The security audit workflow is a **critical component** of the dotfiles management system. It ensures that no sensitive information (credentials, API keys, tokens, passwords, personal data) is accidentally leaked to the public repository.

**This is a PUBLIC repository.** Any leaked credentials will be exposed to the entire internet.

## Security Audit Agent

The `@security-auditor` subagent is responsible for:

1. **Pre-Modification Audit**: Evaluates planned changes for security threats BEFORE modifications begin
2. **Post-Modification Audit**: Verifies actual changes for security threats AFTER modifications complete
3. **Threat Assessment**: Identifies credentials, secrets, sensitive paths, and personal information
4. **Mitigation Options**: Provides concrete options to mitigate security threats
5. **Commit Blocking**: Has the power to block `@git-manager` from committing unsafe changes

## Output Format: Dual Communication Strategy

The security-auditor uses a **dual output approach** to serve both users and agents:

### User-Facing Output (Formatted Text)

**Purpose**: Clear, actionable reports for human users

**Format**:
- Emoji indicators for quick status recognition (✅ ❌ ⚠️)
- Color-coded risk levels (🔴 🟠 🟡 🟢)
- Readable sections with clear hierarchy
- Mitigation options with trade-offs explained
- Actionable recommendations

**Example:**
```
🔍 SECURITY AUDIT - PRE-MODIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Status: BLOCKED ❌
Risk Level: CRITICAL 🔴

Issues Found: 1
Issue: GitHub tokens are credentials and will be exposed in public repository
...
```

### Internal Output (JSON for Agent Coordination)

**Purpose**: Structured data for agent-to-agent communication

**Format**:
- Structured JSON with all audit details
- Machine-readable for programmatic processing
- Used by @dotfiles-manager, @git-manager, and other agents
- Enables workflow automation and decision-making

**Example:**
```json
{
  "phase": "PRE_MODIFICATION",
  "status": "BLOCKED",
  "risk_level": "CRITICAL",
  "issues": [...],
  "recommendation": "..."
}
```

### Communication Flow

```
User Request
    ↓
@security-auditor (audit)
    ├─ Output 1: Formatted text → User (readable report)
    └─ Output 2: JSON → Agents (structured data)
    ↓
User sees clear report with options
Agents process JSON for workflow decisions
```

## Workflow Integration

### Primary Agent Workflow

The `@dotfiles-manager` (primary agent) now includes security auditing in every workflow:

```
1. Understand Request
   ↓
2. PRE-MODIFICATION SECURITY AUDIT ⚠️
   → Invoke @security-auditor with plan
   → Wait for approval
   → If BLOCKED: Stop and report
   → If REQUIRES_MITIGATION: Wait for user to choose mitigation
   → If APPROVED: Continue
   ↓
3. Route to Subagent (nvim-config, shell-config, etc.)
   ↓
4. Coordinate Workflow
   ↓
5. Validate & Verify
   ↓
6. POST-MODIFICATION SECURITY AUDIT ⚠️
   → Invoke @security-auditor with modified files
   → Wait for approval
   → If BLOCKED: Stop and report
   → If CONDITIONAL: Explain and ask for confirmation
   → If APPROVED: Continue
   ↓
7. Prepare for Commit
   ↓
8. Invoke @git-manager (ONLY after security approval)
```

### Subagent Workflow

All subagents that modify files should invoke `@security-auditor`:

- **@app-installer**: Pre/post security audit for installations
- **@nvim-config**: Pre/post security audit for config changes
- **@shell-config**: Pre/post security audit for config changes
- **@ui-config**: Pre/post security audit for config changes
- **@app-config**: Pre/post security audit for config changes
- **@script-creator**: Pre/post security audit for script creation
- **@custom-scripts**: Pre/post security audit for script creation
- **@mise-manager**: Pre/post security audit for tool management
- **@key-encryptor**: Pre/post security audit for key encryption
- **@documentation**: Pre/post security audit for documentation

### Git Manager Constraint

The `@git-manager` agent now has a **CRITICAL RULE**:

```
⚠️ NEVER commit without explicit approval from @security-auditor
```

This prevents any unsafe changes from being committed to the public repository.

## Security Threat Categories

### CRITICAL (Always Blocks)

These issues will ALWAYS block modifications and commits:

- **Credentials**: SSH keys, API keys, tokens, passwords
- **Secrets**: Private encryption keys, certificates
- **Sensitive Paths**: Home directory paths, system paths
- **Personal Info**: Email addresses, phone numbers, real names

**Example**: Attempting to add a GitHub token to git config will be BLOCKED.

### HIGH (Requires Mitigation)

These issues require a mitigation strategy before proceeding:

- Hardcoded environment variables with sensitive values
- Exposed system architecture details
- Privilege escalation vectors
- Unencrypted sensitive data

**Example**: Hardcoding `/home/pietersz/...` paths requires mitigation (use `$HOME` or chezmoi templates).

### MEDIUM (Requires Review)

These issues require review but may proceed with confirmation:

- Best practice violations
- Potential information disclosure
- Security-relevant comments that expose intent

### LOW (Informational)

These are suggestions and warnings:

- Minor security considerations
- Hardening suggestions
- Best practice recommendations

## Pre-Modification Audit Example

**User sees this (formatted output):**
```
🔍 SECURITY AUDIT - PRE-MODIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Status: BLOCKED ❌
Risk Level: CRITICAL 🔴

Issues Found: 1

Issue: GitHub tokens are credentials and will be exposed in public repository
Type: credential_exposure
Affected Files:
  - dot_config/git/config

Mitigation Options:
  1. Use SSH keys instead (stored encrypted in .encrypted/)
     Trade-offs: Requires SSH key setup and GitHub SSH configuration

  2. Use GitHub CLI authentication (stored locally, not in repo)
     Trade-offs: Requires GitHub CLI installation on each machine

  3. Use environment variables (not stored in repo)
     Trade-offs: Must be set manually on each machine, not portable

Recommendation: Use option 1 (SSH keys with encryption) - most secure and portable approach

❌ AUDIT FAILED - Changes cannot proceed until issues are resolved
```

**Agents communicate with this (internal JSON):**
```json
{
  "phase": "PRE_MODIFICATION",
  "status": "BLOCKED",
  "risk_level": "CRITICAL",
  "issues": [
    {
      "type": "credential_exposure",
      "severity": "CRITICAL",
      "description": "GitHub tokens are credentials and will be exposed in public repo",
      "affected_files": ["dot_config/git/config"],
      "mitigation_options": [
        {"option": 1, "description": "Use SSH keys instead (stored encrypted in .encrypted/)", "trade_offs": "Requires SSH key setup"},
        {"option": 2, "description": "Use GitHub CLI authentication (stored locally, not in repo)", "trade_offs": "Requires GitHub CLI installation"},
        {"option": 3, "description": "Use environment variables (not stored in repo)", "trade_offs": "Must be set manually on each machine"}
      ]
    }
  ],
  "recommendation": "Use option 1 (SSH keys with encryption)"
}
```

**Workflow:**
1. User: "Add my GitHub token to git config"
2. @dotfiles-manager invokes @security-auditor with plan
3. @security-auditor returns formatted output to user + JSON to agents
4. User sees clear, actionable report with mitigation options
5. User chooses mitigation option 1
6. @dotfiles-manager receives JSON confirmation and proceeds with SSH key setup instead

## Post-Modification Audit Example

**User sees this (formatted output):**
```
🔍 SECURITY AUDIT - POST-MODIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Status: APPROVED ✅
Risk Level: LOW 🟢

Files Audited: 2
  - dot_config/nvim/init.lua
  - dot_config/shell/aliases.sh

Issues Found: None

Summary: All changes are safe for public repository. No credentials, secrets, or sensitive information detected. Configuration changes follow best practices.

✅ COMMIT APPROVED - Safe to commit to public repository
```

**Agents communicate with this (internal JSON):**
```json
{
  "phase": "POST_MODIFICATION",
  "status": "APPROVED",
  "risk_level": "LOW",
  "files_audited": [
    "dot_config/nvim/init.lua",
    "dot_config/shell/aliases.sh"
  ],
  "issues_found": [],
  "commit_approved": true,
  "summary": "All changes are safe for public repository"
}
```

**Workflow:**
1. @dotfiles-manager invokes @security-auditor with modified files list
2. @security-auditor audits files and returns formatted output to user + JSON to agents
3. User sees clear approval status
4. @dotfiles-manager receives JSON confirmation
5. @dotfiles-manager proceeds to @git-manager for commit

## Using the Security Audit Command

You can manually invoke the security audit:

```bash
opencode /audit-changes
```

This allows you to audit changes at any time without going through the full workflow.

## Best Practices

1. **Always wait for security audit approval** before proceeding
2. **Provide detailed plans** to the security auditor
3. **Choose appropriate mitigation options** when offered
4. **Never bypass security checks** - they protect the public repository
5. **Report any false positives** so the security auditor can be improved
6. **Keep sensitive data encrypted** using the key-encryptor agent
7. **Use environment variables** for sensitive configuration
8. **Use chezmoi templates** for paths and environment-specific values

## Sensitive Data Handling

### Credentials & Secrets

**NEVER store in repository:**
- SSH keys (unless encrypted in .encrypted/)
- API keys
- Tokens
- Passwords
- Private certificates

**ALWAYS use:**
- Encrypted storage (.encrypted/ directory)
- Environment variables
- Local-only configuration (not in repo)

### Personal Information

**NEVER expose:**
- Real names
- Email addresses
- Phone numbers
- Home directory paths
- System paths

**ALWAYS use:**
- Chezmoi templates ({{ .chezmoi.homeDir }})
- Environment variables ($HOME)
- Relative paths

### System Architecture

**Be careful with:**
- System configuration details
- Security-relevant comments
- Architecture decisions that expose security intent

## Troubleshooting

### "BLOCKED: Credential exposure detected"

**Solution**: Use one of the provided mitigation options:
1. Store credentials encrypted in .encrypted/
2. Use environment variables
3. Use local-only configuration

### "REQUIRES_MITIGATION: Hardcoded path detected"

**Solution**: Use chezmoi templates or environment variables:
- Instead of: `/home/pietersz/...`
- Use: `{{ .chezmoi.homeDir }}/...` or `$HOME/...`

### "CONDITIONAL: Best practice violation"

**Solution**: Review the recommendation and either:
1. Follow the recommendation
2. Confirm you want to proceed anyway
3. Choose an alternative approach

## Questions?

Refer to:
- `.opencode/agent/security-auditor.md` - Full security auditor documentation
- `.opencode/agent/dotfiles-manager.md` - Primary agent workflow
- `.opencode/OPENCODE_AGENT_BEST_PRACTICES.md` - General agent best practices

