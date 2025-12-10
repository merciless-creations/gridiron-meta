# System Architecture

## High-Level Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  gridiron-web   │────▶│    gridiron     │────▶│ gridiron-engine │
│   (Frontend)    │     │     (API)       │     │  (Simulation)   │
│                 │     │                 │     │                 │
│  React 18       │     │  .NET 8 API     │     │  State Machine  │
│  TypeScript     │     │  EF Core        │     │  NuGet Package  │
│  TailwindCSS    │     │  Azure SQL      │     │  C#             │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │
        │                       ▼
        │               ┌─────────────┐
        │               │  Azure SQL  │
        │               │  Database   │
        │               └─────────────┘
        │
        ▼
┌─────────────────┐
│  Azure AD B2C   │
│  (Auth)         │
└─────────────────┘
```

## Component Communication

### Frontend → API

- REST API calls via Axios
- JWT tokens from Azure AD B2C
- TanStack Query for caching and state management
- API URL configured via `VITE_API_URL` environment variable
- Development proxy: `/api/*` → `http://localhost:5000`

### API → Engine

- Direct project reference (development) or NuGet package (production)
- Engine provides `IGameEngine` interface
- API maps persistence entities to engine domain objects
- Engine returns `GameResult` with play-by-play data
- API persists results back to database

### API → Database

- Entity Framework Core 8
- Repository pattern (see Architecture Principles)
- All database access through `DataAccessLayer` project only
- Repositories: `ITeamRepository`, `IPlayerRepository`, `IGameRepository`

## API Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                        Gridiron.WebApi                         │
├────────────────────────────────────────────────────────────────┤
│  Controllers/                                                   │
│  ├── TeamsController.cs      - Team CRUD endpoints             │
│  ├── PlayersController.cs    - Player CRUD endpoints           │
│  ├── GamesController.cs      - Game simulation endpoints       │
│  └── ...                                                       │
├────────────────────────────────────────────────────────────────┤
│  Services (injected via DI)                                    │
│  ├── Game management services                                  │
│  ├── Player generation services                                │
│  └── Team builder services                                     │
├────────────────────────────────────────────────────────────────┤
│  DataAccessLayer (Repository Pattern)                          │
│  ├── ITeamRepository         - Team data access interface      │
│  ├── IPlayerRepository       - Player data access interface    │
│  ├── IGameRepository         - Game data access interface      │
│  └── GridironDbContext       - EF Core context (internal only) │
└────────────────────────────────────────────────────────────────┘
```

## Engine Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                       Gridiron.Engine                          │
├────────────────────────────────────────────────────────────────┤
│  Api/                                                          │
│  ├── IGameEngine             - Public interface                │
│  └── GameEngine              - Implementation                  │
├────────────────────────────────────────────────────────────────┤
│  Domain/                                                       │
│  ├── Team                    - Clean domain object             │
│  ├── Player                  - Clean domain object             │
│  └── Game                    - Game state                      │
├────────────────────────────────────────────────────────────────┤
│  Simulation/                                                   │
│  ├── Configuration/                                            │
│  │   └── GameProbabilities.cs  - ALL probability constants     │
│  ├── Decision/                                                 │
│  │   ├── TimeoutContext.cs     - Decision context structs      │
│  │   └── TimeoutDecisionEngine.cs - "Should we do X?"          │
│  ├── Mechanics/                                                │
│  │   └── TimeoutMechanic.cs    - "Execute X, update state"     │
│  └── StateMachine/                                             │
│       └── 19 game states with Stateless library                │
└────────────────────────────────────────────────────────────────┘
```

## Data Flow: Game Simulation

1. **Frontend**: User clicks "Simulate Game"
2. **API Controller**: Receives request, loads teams from repository
3. **API Service**: Maps EF entities to engine domain objects
4. **Engine**: `SimulateGame(homeTeam, awayTeam, options)`
   - State machine processes play-by-play
   - Each play: Context → Decision → Mechanic → State Update
5. **Engine**: Returns `GameResult` with all plays, stats, final score
6. **API Service**: Maps results back to EF entities
7. **API Repository**: Persists game, stats, player updates
8. **API Controller**: Returns game summary to frontend
9. **Frontend**: Displays results, updates UI via React Query

## Authentication & Authorization

- **Provider**: Azure AD B2C
- **Frontend**: MSAL library for token acquisition
- **API**: JWT Bearer authentication
- **Tokens**: Stored in browser, sent with each API request

## Deployment Architecture

- **Frontend**: Azure Static Web Apps
- **API**: Azure App Service
- **Database**: Azure SQL
- **Engine**: Bundled with API (NuGet package or project reference)

## Key Design Decisions

1. **Repository Pattern**: All database access through interfaces for testability
2. **Outcome-First Engine**: Simulation determines results, not presentation
3. **State Machine**: Explicit game states prevent invalid transitions
4. **Deterministic Seeds**: Every simulation is reproducible
5. **Centralized Constants**: All probabilities in `GameProbabilities.cs`
6. **Decision vs Mechanic**: Separate "should we?" from "do it"
