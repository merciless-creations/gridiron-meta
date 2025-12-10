# Gridiron MCP Server

An MCP (Model Context Protocol) server that provides Claude with comprehensive context about the Gridiron multi-repo project, including coding guidelines, architecture documentation, simulation engine details, and project roadmap.

## What This Server Provides

### Resources (Documentation)

| Category | URI | Description |
|----------|-----|-------------|
| **Project** | | |
| | `gridiron://project/overview` | Project vision, repos, tech stack |
| | `gridiron://project/repos` | Repository structure and purposes |
| | `gridiron://project/architecture` | System architecture overview |
| **Guidelines** | | |
| | `gridiron://guidelines/csharp` | C# coding guidelines for backend |
| | `gridiron://guidelines/typescript` | TypeScript/React guidelines for frontend |
| | `gridiron://guidelines/testing` | Testing standards across all repos |
| | `gridiron://guidelines/git` | Git workflow, branching, PRs |
| | `gridiron://guidelines/architecture-principles` | Repository pattern, data access rules |
| **Engine** | | |
| | `gridiron://engine/philosophy` | Outcome-first simulation approach |
| | `gridiron://engine/statistical-targets` | NFL statistics to match |
| | `gridiron://engine/attribute-mappings` | Player attributes to probabilities |
| **Frontend** | | |
| | `gridiron://frontend/design-system` | Colors, typography, component patterns |
| **Agents** | | |
| | `gridiron://agents/dev` | Development agent persona |
| | `gridiron://agents/plan` | Planning agent persona |
| | `gridiron://agents/qa` | QA/Testing agent persona |
| | `gridiron://agents/review` | Code review agent persona |
| | `gridiron://agents/requirements` | Requirements gathering persona |
| **Roadmap** | | |
| | `gridiron://roadmap` | Project milestones and phases |

### Tools (Dynamic Operations)

| Tool | Description |
|------|-------------|
| `get_repo_info` | Get detailed info about a specific repository |
| `get_github_project` | Get the correct GitHub Project for issue assignment |
| `list_resources` | List all available documentation resources |
| `get_tech_stack` | Get the complete technology stack |
| `get_hard_rules` | Get absolute rules that must never be violated |
| `get_constants_info` | Get info about simulation constants location |

---

## Installation

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+
- Claude Code CLI installed

### Step 1: Install Dependencies

```bash
cd C:\projects\GoalToGoFootball\gridiron-meta\mcp-server
npm install
```

### Step 2: Build the Server

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` folder.

### Step 3: Register with Claude Code

**Option A: User-level (available in all projects)**

```bash
claude mcp add gridiron-context -- node "C:/projects/GoalToGoFootball/gridiron-meta/mcp-server/dist/index.js"
```

**Option B: Project-level (shared via `.mcp.json`)**

```bash
claude mcp add gridiron-context --scope project -- node "C:/projects/GoalToGoFootball/gridiron-meta/mcp-server/dist/index.js"
```

> **Important**: Use absolute paths. The path must point to the compiled `dist/index.js` file.

### Step 4: Verify Installation

```bash
# List all registered MCP servers
claude mcp list

# Get details for this server
claude mcp get gridiron-context
```

Within Claude Code, you can also check:
```
/mcp
```

---

## Usage

Once registered, the MCP server provides context to Claude automatically. You can:

1. **Reference resources**: Claude can access project documentation when answering questions
2. **Use tools**: Ask Claude to get repo info, check project assignments, etc.

### Example Queries

- "What's the architecture of the Gridiron project?"
- "Show me the C# coding guidelines"
- "Which GitHub project should I assign this API issue to?"
- "What are the statistical targets for rushing yards?"
- "What's the tech stack for the frontend?"

---

## Development

### Watch Mode

For active development, use watch mode to recompile on changes:

```bash
npm run dev
```

> Note: You'll need to restart your Claude Code session to pick up changes.

### Adding New Documentation

1. Add a markdown file to the `docs/` folder
2. Add a corresponding `server.resource()` call in `src/index.ts`
3. Rebuild: `npm run build`

### Adding New Tools

1. Add a `server.tool()` call in `src/index.ts`
2. Define the parameter schema (JSON Schema format)
3. Implement the handler function
4. Rebuild: `npm run build`

---

## Documentation Structure

```
mcp-server/
├── src/
│   └── index.ts              # Server implementation
├── docs/
│   ├── project-overview.md   # Project vision and scope
│   ├── repository-map.md     # All repos and their purposes
│   ├── architecture.md       # System architecture
│   ├── guidelines-csharp.md  # C# coding standards
│   ├── guidelines-typescript.md # TypeScript/React standards
│   ├── guidelines-testing.md # Testing practices
│   ├── guidelines-git.md     # Git workflow
│   ├── architecture-principles.md # Repository pattern rules
│   ├── engine-philosophy.md  # Outcome-first simulation
│   ├── statistical-targets.md # NFL statistics targets
│   ├── attribute-mappings.md # Player attributes
│   ├── frontend-design.md    # UI design system
│   ├── agent-dev.md          # Dev agent persona
│   ├── agent-plan.md         # Planning agent persona
│   ├── agent-qa.md           # QA agent persona
│   ├── agent-review.md       # Review agent persona
│   ├── agent-requirements.md # Requirements agent persona
│   └── roadmap.md            # Project milestones
├── dist/                     # Compiled output (git-ignored)
├── package.json
├── tsconfig.json
└── README.md
```

---

## Troubleshooting

### Server not showing in Claude Code

1. Verify build completed: Check `dist/index.js` exists
2. Verify path is absolute and correct
3. Check `claude mcp list` for errors
4. Restart Claude Code session

### Changes not taking effect

MCP servers are loaded when Claude Code starts. After making changes:

1. Rebuild: `npm run build`
2. Restart your Claude Code session

### "Cannot find module" errors

```bash
# Clean and rebuild
rm -rf dist node_modules
npm install
npm run build
```

### Debug logging

The server logs to stderr. You can see logs when running the server directly:

```bash
node dist/index.js
```

---

## Updating Documentation

The `docs/` folder contains all project knowledge. To update:

1. Edit the relevant markdown file in `docs/`
2. Rebuild: `npm run build`
3. Restart Claude Code to pick up changes

No code changes needed for documentation updates—just edit the markdown files.

---

## Key Project Rules

The MCP server enforces awareness of these critical rules:

### Git Workflow
- **NEVER** commit directly to main/master
- Always use feature branches
- Wait for PR approval before merging

### Architecture
- **ONLY** DataAccessLayer may access the database
- Use repository pattern for all data access
- Controllers → Services → Repositories

### Testing
- **ALL** tests must be deterministic
- Use fixed seeds for simulation tests
- No conditional assertions based on random outcomes

### Simulation Engine
- Do **NOT** model formations or play names
- Engine determines outcomes only
- Presentation is a separate concern

---

## Related Documentation

- [gridiron-meta README](../README.md) - Shared config setup
- [Project CLAUDE.md](../../CLAUDE.md) - Shared project instructions
- [gridiron README](../../gridiron/README.md) - API backend
- [gridiron-engine README](../../gridiron-engine/README.md) - Simulation engine
- [gridiron-web README](../../gridiron-web/README.md) - Frontend
