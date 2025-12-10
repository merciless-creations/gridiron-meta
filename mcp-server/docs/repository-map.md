# Repository Map

## gridiron (API Backend)

**Purpose**: C# .NET 8 API backend for the Gridiron game

**Tech Stack**:
- Language: C# 12
- Framework: .NET 8
- Database: Azure SQL
- ORM: Entity Framework Core 8
- State Machine: Stateless library
- Testing: MSTest (839 tests)

**Architecture**: Controllers → Services → Repositories

**Key Projects**:
```
gridiron/
├── Gridiron.WebApi/           - REST API endpoints
├── DomainObjects/             - Domain models (Players, Teams, Games)
├── DataAccessLayer/           - EF Core persistence, repositories
├── GameManagement/            - Player/team builder services
├── Gridiron.WebApi.Tests/     - API unit tests
├── Gridiron.IntegrationTests/ - Integration tests
├── GameManagement.Tests/      - Service tests
└── Diagram/                   - C4 architecture diagrams
```

**GitHub Project**: [Project 1 (Gridiron Roadmap)](https://github.com/orgs/merciless-creations/projects/1)

---

## gridiron-engine (Simulation Engine)

**Purpose**: State machine-based NFL football simulation engine

**Tech Stack**:
- Language: C#
- Framework: .NET
- Pattern: State Machine (19 states) with Stateless library
- Distribution: NuGet package on GitHub Packages
- Testing: 800+ unit tests

**Key Features**:
- Probability-driven play outcomes based on player skills
- Deterministic simulation with seed support
- Complete NFL-style rules (downs, scoring, penalties)
- Penalty system with realistic enforcement
- Injury tracking and player availability
- Game clock management

**Key Directories**:
```
gridiron-engine/
├── src/
│   ├── Gridiron.Engine/
│   │   ├── Api/                 - Public API (IGameEngine)
│   │   ├── Domain/              - Clean domain objects
│   │   └── Simulation/
│   │       ├── Configuration/   - GameProbabilities.cs (ALL constants here)
│   │       ├── Decision/        - Decision engines
│   │       └── Mechanics/       - Game mechanics
│   └── Gridiron.Validator/      - Statistical validation tool
└── tests/
    └── Gridiron.Engine.Tests/
```

**Philosophy**: Outcome-first simulation - determines what happened and who did it, not formations or play names.

**GitHub Project**: [Project 2 (Engine Roadmap)](https://github.com/orgs/merciless-creations/projects/2)

---

## gridiron-web (Frontend)

**Purpose**: React/TypeScript web frontend

**Tech Stack**:
- Framework: React 18
- Language: TypeScript
- Build Tool: Vite
- Styling: TailwindCSS
- Routing: React Router v6
- State Management: TanStack Query (React Query)
- HTTP Client: Axios
- Auth: Azure AD B2C / MSAL
- Testing: Vitest (unit), Playwright (E2E)
- Hosting: Azure Static Web Apps

**Design System**: Dark mode by default, sports broadcast aesthetic (ESPN, sportsbook-inspired)

**Key Directories**:
```
gridiron-web/
├── src/
│   ├── api/           - API client and React Query hooks
│   ├── components/    - Reusable UI components
│   ├── pages/         - Route pages
│   ├── types/         - TypeScript type definitions
│   └── test/mocks/    - MSW handlers for testing
├── e2e/               - Playwright E2E tests
└── public/            - Static assets
```

**GitHub Project**: [Project 3 (Web Roadmap)](https://github.com/orgs/merciless-creations/projects/3)

---

## gridiron-meta (Shared Configuration)

**Purpose**: Shared Claude Code configuration and tooling

**Contains**:
```
gridiron-meta/
├── .claude/
│   └── commands/      - Shared slash commands
│       ├── dev.md     - Development agent persona
│       ├── plan.md    - Planning agent persona
│       ├── qa.md      - QA/Testing agent persona
│       ├── requirements.md - Requirements gathering persona
│       └── review.md  - Code review agent persona
├── mcp-server/        - This MCP server
├── CLAUDE.md          - Shared project instructions
└── README.md          - Setup instructions
```

**Parent Project**: [Goal To Go Football (Project 4)](https://github.com/orgs/merciless-creations/projects/4)

---

## Workspace Structure

```
C:\projects\GoalToGoFootball/     <- Workspace root
├── gridiron-meta/                <- This repo (clone first)
│   ├── gridiron/                 <- API backend (clone inside)
│   ├── gridiron-engine/          <- Simulation engine (clone inside)
│   └── gridiron-web/             <- Frontend (clone inside)
├── .claude/                      <- Workspace-level Claude config
├── CLAUDE.md                     <- Inherited by all child repos
└── README.md
```

This nesting enables CLAUDE.md inheritance - instructions in the parent folder are automatically loaded when running Claude Code from any child repo.
