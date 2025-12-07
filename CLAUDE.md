# gridiron-meta

Shared configuration for the Gridiron multi-repo project. See [README.md](README.md) for setup instructions.

## Shared Slash Commands

This repo provides shared Claude Code slash commands available across all Gridiron repos:

- `/dev` - Development agent persona
- `/plan` - Planning agent persona
- `/qa` - QA agent persona
- `/requirements` - Requirements gathering agent persona
- `/review` - Code review agent persona

**Important**: These commands require a one-time setup (symlink/junction to ~/.claude/commands). See README.md.

---

# Project Instructions

## GitHub Issue Management

When creating issues for this multi-repo project, always:

1. **Assign issues to the correct GitHub Project:**
   - Parent/epic issues → Project 4 (Goal To Go Football): https://github.com/orgs/merciless-creations/projects/4
   - gridiron (API) issues → Project 1 (Gridiron Roadmap): https://github.com/orgs/merciless-creations/projects/1
   - gridiron-web issues → Project 3 (Web Roadmap): https://github.com/orgs/merciless-creations/projects/3
   - gridiron-engine issues → Project 2 (Engine Roadmap): https://github.com/orgs/merciless-creations/projects/2

2. **Link sub-issues to parent issues** using GitHub's sub-issue feature

3. **Repository mapping:**
   - gridiron = C# .NET API backend
   - gridiron-web = React/TypeScript frontend
   - gridiron-engine = Game simulation engine
