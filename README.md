# gridiron-meta

Shared Claude Code configuration for the Gridiron multi-repo project.

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
