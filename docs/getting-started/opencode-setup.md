# Getting Started with OpenCode

Welcome! OpenCode is an AI-powered agent system that helps you manage your dotfiles, configurations, and knowledge system. In this tutorial, you'll learn the basics and complete your first task.

## What You'll Learn

In about 5 minutes, you'll:
- Understand what OpenCode agents do
- Run your first command
- See how agents help you make changes

## What is OpenCode?

OpenCode is a system of specialized AI agents that help you:

- **Modify configurations** - Change Neovim, shell, UI settings without manual editing
- **Install applications** - Add tools and manage dependencies
- **Manage encrypted keys** - Securely add and validate private keys
- **Create scripts** - Generate custom automation scripts
- **Maintain your knowledge system** - Organize notes and ideas using atomic note-taking

Think of it as having an expert assistant who understands your dotfiles and can help you make changes safely.

## Your First Task: Create a Fleeting Note

Let's start with the simplest task: capturing an idea using the note-taking system.

### Step 1: Open OpenCode

```bash
opencode
```

You should see the OpenCode interface with a prompt ready for input.

### Step 2: Create a Fleeting Note

Type this command:

```
/create-fleeting
```

Press Enter. OpenCode will ask you clarifying questions about your idea.

### Step 3: Answer the Questions

The agent will ask you questions like:
- "What's the core idea you want to capture?"
- "Why is this important to you?"
- "How does this relate to other things you know?"

Answer naturally—the agent is helping you think through your idea.

### Step 4: See the Result

After you answer the questions, the agent will summarize your refined understanding. You now have a clear fleeting note ready to be processed later.

## What Just Happened?

You used the **note-clarifier** agent, which:
1. Asked questions to help you articulate your idea
2. Helped you discover what you actually think
3. Created a clear summary you can work with later

This is the first step in the atomic note-taking workflow.

## Next Steps

Now that you've seen OpenCode in action, you can:

1. **Learn more workflows** - Read [How to Use OpenCode Agents](../how-to/opencode-modify-config.md)
2. **Understand the system** - Check [OpenCode Architecture](../explanation/opencode-architecture.md)
3. **Look up agents** - See [OpenCode Agents Reference](../reference/opencode-agents.md)

## Common Commands

Here are some other commands you can try:

| Command | What it does |
|---------|-------------|
| `/daily-review` | Process your inbox and create permanent notes |
| `/process-fleeting` | Convert a fleeting note to a permanent note |
| `/find-links` | Find connections between your notes |
| `/validate-note` | Check if a note meets quality standards |

## Need Help?

- **In OpenCode**: Press `Ctrl+x h` for help
- **Switch models**: Press `Ctrl+x m` to use a different AI model
- **View documentation**: See the [How-To Guides](../how-to/) for specific tasks

## Key Concepts

### Agents

Agents are specialized AI assistants with specific roles. Each agent has:
- A clear purpose (e.g., clarifying ideas, finding connections)
- Specific tools it can use (read, edit, bash)
- A temperature setting that controls how creative or focused it is

### Commands

Commands are shortcuts to common workflows. They invoke agents with pre-written prompts to guide you through specific tasks.

### Tools

Agents use tools to interact with your system:
- **read** - Read files and notes
- **edit** - Create and modify files
- **bash** - Execute shell commands

## Troubleshooting

**OpenCode won't start?**
- Make sure you have `ANTHROPIC_API_KEY` set: `echo $ANTHROPIC_API_KEY`
- Check that OpenCode is installed: `which opencode`

**Agent seems confused?**
- Be specific in your requests
- Provide context about what you're trying to do
- Try again—agents can improve with more information

**Want to use a different AI model?**
- Press `Ctrl+x m` in OpenCode to switch models
- Or use the CLI: `opencode -m anthropic/claude-sonnet-4-5`

## What's Next?

You're ready to explore! Here are some paths:

**If you want to modify configurations:**
→ Read [How to Modify Any Configuration](../how-to/opencode-modify-config.md)

**If you want to understand the agent system:**
→ Read [OpenCode Architecture](../explanation/opencode-architecture.md)

**If you want a quick reference:**
→ Check [OpenCode Agents Reference](../reference/opencode-agents.md)

---

**Last Updated**: October 30, 2025
