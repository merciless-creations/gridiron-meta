# gridiron-meta

Shared Claude Code configuration for the Gridiron multi-repo project.

## Quick Start

```bash
# 1. Build and register the MCP server (one-time setup)
cd mcp-server
npm install && npm run build
claude mcp add gridiron-context node dist/index.js

# 2. Link shared slash commands to your user config (one-time setup)
# Windows:
mklink /J "%USERPROFILE%\.claude\commands" "C:\path\to\gridiron-meta\.claude\commands"
# macOS/Linux:
ln -s /path/to/gridiron-meta/.claude/commands ~/.claude/commands

# 3. Restart Claude Code to pick up changes
```

## What This Repo Contains

```
gridiron-meta/
├── .claude/
│   └── commands/           # Shared slash commands for Claude Code
│       ├── dev.md          # /dev - Development agent persona
│       ├── plan.md         # /plan - Planning agent persona
│       ├── qa.md           # /qa - QA agent persona
│       ├── requirements.md # /requirements - Requirements agent persona
│       └── review.md       # /review - Code review agent persona
├── mcp-server/             # MCP server for project context
│   ├── src/index.ts        # Server implementation
│   ├── docs/               # Project documentation (17 files)
│   └── README.md           # MCP server details
├── .gitignore              # Excludes gridiron-* subdirectories
├── CLAUDE.md               # Shared project instructions (auto-inherited)
└── README.md               # This file
```

## Understanding Claude Code's Inheritance Model

Claude Code has **different inheritance rules** for different types of configuration:

| Config Type | Inherits from parent directories? | Scope |
|-------------|-----------------------------------|-------|
| `CLAUDE.md` | **YES** - walks up directory tree | Project-specific |
| Slash commands (`.claude/commands/`) | **NO** - project or user level only | Project OR User |
| Settings | NO - explicit hierarchy | Enterprise > Local > Shared > User |

### CLAUDE.md Inheritance (Automatic)

When you run `claude` from any directory, it automatically loads ALL `CLAUDE.md` files from the current directory up to the filesystem root. This means:

```
C:\projects\gridiron-meta\           <- CLAUDE.md loaded (shared instructions)
C:\projects\gridiron-meta\gridiron-engine\   <- CLAUDE.md loaded (repo-specific)
```

Both files are merged into context. **No setup required** - this just works.

### Slash Commands (Manual Setup Required)

Unlike `CLAUDE.md`, slash commands do **NOT** inherit from parent directories. Commands are only loaded from:

1. **Project level**: `./.claude/commands/` in the current repo
2. **User level**: `~/.claude/commands/` (available in ALL projects)

Since our repos are nested inside `gridiron-meta/`, the shared commands in `gridiron-meta/.claude/commands/` would NOT be available when working in `gridiron-engine/`.

**Solution**: Symlink/junction the shared commands to your user-level directory.

## Setup Instructions

### Prerequisites

- Clone this repo as your workspace root
- Clone the child repos inside it:

```
gridiron-meta/          <- This repo
├── gridiron/           <- git clone gridiron repo here
├── gridiron-engine/    <- git clone gridiron-engine repo here
└── gridiron-web/       <- git clone gridiron-web repo here
```

### Enable Shared Commands (Required)

The shared slash commands (`/dev`, `/plan`, `/qa`, `/requirements`, `/review`) need to be linked to your user-level Claude config.

#### Windows (Junction)

```cmd
mklink /J "%USERPROFILE%\.claude\commands" "C:\path\to\gridiron-meta\.claude\commands"
```

Example:
```cmd
mklink /J "C:\Users\scott\.claude\commands" "C:\projects\gridiron-meta\.claude\commands"
```

#### macOS/Linux (Symlink)

```bash
ln -s /path/to/gridiron-meta/.claude/commands ~/.claude/commands
```

Example:
```bash
ln -s ~/projects/gridiron-meta/.claude/commands ~/.claude/commands
```

### Verify Setup

After creating the link, run `claude` from any of the child repos and type `/` to see available commands. You should see:

- `/dev` - Development agent
- `/plan` - Planning agent
- `/qa` - QA agent
- `/requirements` - Requirements gathering agent
- `/review` - Code review agent

Plus any repo-specific commands defined in that repo's `.claude/commands/` directory.

## Using the Slash Commands

Type the slash command at the start of your message to activate that "persona" for the conversation:

### `/dev [your task]` - Development mode
- "Implement the player stats API endpoint from issue #45"
- "Fix the bug where games don't save scores"
- Focuses on: clean code, following existing patterns, testing, building

### `/plan [what to plan]` - Planning mode  
- "How should we implement the team roster management feature?"
- "Analyze the codebase for adding multiplayer support"
- Focuses on: exploring code, breaking down work, identifying risks, NO implementation

### `/qa [what to test]` - QA/Testing mode
- "Review test coverage for the game simulation engine"
- "Check if the player creation tests are deterministic"
- Focuses on: finding edge cases, ensuring deterministic tests, test coverage

### `/requirements [vague idea]` - Requirements refinement mode
- "We need a way for users to manage their teams"
- "Add playoff bracket functionality"
- Focuses on: asking clarifying questions, defining acceptance criteria, breaking into sub-tasks

### `/review [PR or changes]` - Code review mode
- "Review the changes in PR #23"
- "Check the latest commits for issues"
- Focuses on: finding bugs, checking completeness, verifying tests exist

### Typical Workflow

1. `/requirements` - Start with vague idea, get clear specs
2. `/plan` - Create implementation plan
3. `/dev` - Actually write the code
4. `/qa` - Verify test coverage
5. `/review` - Final check before merge

## How It Works Together

When you run `claude` from `gridiron-engine/`:

1. **CLAUDE.md files loaded** (automatic):
   - `gridiron-meta/CLAUDE.md` - shared project instructions
   - `gridiron-engine/CLAUDE.md` - engine-specific instructions

2. **Slash commands available**:
   - `~/.claude/commands/*` - your user commands (linked to gridiron-meta)
   - `gridiron-engine/.claude/commands/*` - repo-specific commands (if any)

3. **Skills available**:
   - `gridiron-engine/.claude/skills/*` - repo-specific skills

## Updating Shared Commands

Since the commands are linked (not copied), any changes you make to `gridiron-meta/.claude/commands/` are immediately available everywhere:

1. Edit the command file in `gridiron-meta/.claude/commands/`
2. Commit and push to `gridiron-meta`
3. Other team members pull the changes

No need to update the symlink/junction - it always points to the current files.

## Troubleshooting

### Commands not showing up

1. Verify the link exists: `ls ~/.claude/commands/`
2. Check it's a link, not a copy: modify a file in gridiron-meta and verify it appears in ~/.claude/commands
3. Restart Claude Code after creating the link

### "Junction created" but commands still missing

On Windows, make sure you used `/J` (junction), not `/D` (symlink, requires admin).

### Permission denied on Windows

Junctions (`/J`) don't require admin. Symlinks (`/D`) do. Use junctions.

## Related Repositories

| Repo | Description | Project Board |
|------|-------------|---------------|
| [gridiron](https://github.com/merciless-creations/gridiron) | C# .NET API backend | [Project 1](https://github.com/orgs/merciless-creations/projects/1) |
| [gridiron-engine](https://github.com/merciless-creations/gridiron-engine) | Game simulation engine | [Project 2](https://github.com/orgs/merciless-creations/projects/2) |
| [gridiron-web](https://github.com/merciless-creations/gridiron-web) | React/TypeScript frontend | [Project 3](https://github.com/orgs/merciless-creations/projects/3) |

Parent project board: [Goal To Go Football](https://github.com/orgs/merciless-creations/projects/4)

---

## MCP Server

The MCP (Model Context Protocol) server provides Claude Code with comprehensive project context including documentation, coding guidelines, and tools.

### What It Provides

**Resources (17 total):**
| Resource | URI | Description |
|----------|-----|-------------|
| Project Overview | `gridiron://project/overview` | High-level project description |
| Repository Map | `gridiron://project/repos` | All repos with purposes |
| Architecture | `gridiron://project/architecture` | Multi-repo architecture |
| C# Guidelines | `gridiron://guidelines/csharp` | .NET coding standards |
| TypeScript Guidelines | `gridiron://guidelines/typescript` | TS/React patterns |
| Testing Guidelines | `gridiron://guidelines/testing` | Deterministic test rules |
| Git Guidelines | `gridiron://guidelines/git` | Commit message format |
| Architecture Principles | `gridiron://guidelines/architecture-principles` | Core design decisions |
| Engine Philosophy | `gridiron://engine/philosophy` | Outcome-first simulation |
| Statistical Targets | `gridiron://engine/statistical-targets` | NFL-derived targets |
| Attribute Mappings | `gridiron://engine/attribute-mappings` | Player attribute system |
| Frontend Design | `gridiron://frontend/design-system` | UI component patterns |
| Roadmap | `gridiron://roadmap` | Project phases and status |
| Agent Personas | `gridiron://agents/*` | Dev, Plan, QA, Review, Requirements |

**Tools (6 total):**
| Tool | Description |
|------|-------------|
| `get_repo_info` | Get details about a specific repository |
| `get_github_project` | Get the GitHub project board for a repo |
| `list_resources` | List all available resources |
| `get_tech_stack` | Get technology stack for a repo |
| `get_hard_rules` | Get mandatory rules that must never be broken |
| `get_constants_info` | Get info about magic numbers and constants |

### Installation

```bash
cd mcp-server
npm install
npm run build
```

### Register with Claude Code

```bash
claude mcp add gridiron-context node dist/index.js
```

This registers the server at user scope (available in all projects).

### Verify Installation

After restarting Claude Code:

```bash
claude mcp list
```

You should see `gridiron-context` in the list.

### Using the MCP Server

Once registered, Claude Code automatically has access to all resources and tools. You can:

- Ask about project architecture and it will reference the correct patterns
- Request coding guidelines and get repo-specific standards
- Query the roadmap and get current project status
- Use tools to get dynamic information about repos

Example prompts that leverage MCP context:
- "What are the testing guidelines for this project?"
- "Show me the statistical targets for the simulation engine"
- "What's the architecture for the multi-repo setup?"
- "Get info about the gridiron-engine repo"

### Development

To modify the MCP server:

```bash
cd mcp-server
npm run dev    # Watch mode for TypeScript
```

Documentation files are in `mcp-server/docs/`. Edit these to update the context Claude receives.

### Troubleshooting

**MCP server not appearing in `claude mcp list`:**
- Ensure you ran `npm run build` first
- Check that `dist/index.js` exists
- Try removing and re-adding: `claude mcp remove gridiron-context && claude mcp add gridiron-context node dist/index.js`

**Changes not reflected:**
- MCP servers are loaded on Claude Code startup
- Restart Claude Code after making changes

**Build errors:**
- Ensure Node.js 18+ is installed
- Run `npm install` to install dependencies
