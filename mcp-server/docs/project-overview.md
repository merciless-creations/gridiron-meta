# Gridiron - Goal To Go Football

## Project Vision

Gridiron is a web-based NFL franchise management simulation game. Think Out of the Park Baseball, but for football and 100% browser/mobile accessible.

A deep, authentic NFL front office experience where players act as General Managers—drafting, trading, signing, and building rosters across multiple seasons. The simulation runs play-by-play with a state machine engine. Multiplayer leagues allow multiple human GMs competing in the same league.

## Core Gameplay Loop

1. **Manage** — Roster moves, contracts, trades, draft prep, coaching/scheme adjustments
2. **Simulate** — Advance the game clock; the engine processes play-by-play outcomes
3. **Results** — Review box scores, standings, stats, injuries, progression

No real-time gameplay. All interaction is asynchronous management followed by simulation advancement.

## Repositories

| Repository | Purpose | Tech Stack | Project Board |
|------------|---------|------------|---------------|
| [gridiron](https://github.com/merciless-creations/gridiron) | C# .NET API backend | C# 12, .NET 8, EF Core, Azure SQL | [Project 1](https://github.com/orgs/merciless-creations/projects/1) |
| [gridiron-engine](https://github.com/merciless-creations/gridiron-engine) | Game simulation engine | C#, State Machine, NuGet package | [Project 2](https://github.com/orgs/merciless-creations/projects/2) |
| [gridiron-web](https://github.com/merciless-creations/gridiron-web) | React/TypeScript frontend | React 18, Vite, TailwindCSS | [Project 3](https://github.com/orgs/merciless-creations/projects/3) |
| gridiron-meta | Shared configuration | Claude Code commands, MCP server | [Project 4](https://github.com/orgs/merciless-creations/projects/4) |

## Organization

- **GitHub Org**: merciless-creations
- **Parent Project Board**: [Goal To Go Football (Project 4)](https://github.com/orgs/merciless-creations/projects/4)

## League Structure

- NFL-based structure (conferences, divisions, schedule, playoffs, draft, free agency, salary cap)
- Variable league sizes (not locked to 32 teams)
- Multiple human GMs per league
- Fictional generated players (no real NFL data)

## Monetization

Monthly subscription model.

## Data Model Concepts

- **League** — Container for teams, schedule, settings
- **Team** — Franchise with roster, cap space, draft picks
- **Player** — Generated fictional players with attributes, contracts, progression
- **Contract** — Salary, years, guarantees, cap implications
- **Draft** — Annual draft class, pick trading, scouting
- **Game** — Scheduled matchup, simulated play-by-play, box score
- **Season** — Schedule, standings, playoffs, offseason phases

## Development Context

This project is mature. Scott directs architecture and writes critical systems (like the state machine). Claude writes implementation code under Scott's guidance. Respect existing patterns in the codebase.

## Project Stats

- **Backend**: 40,800+ C# lines, 839 tests (100% pass rate)
- **Engine**: 800+ unit tests, 19 game states
- **Frontend**: React 18, Vitest + Playwright tests
