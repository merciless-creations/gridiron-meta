# Architecture Principles

## THE GOLDEN RULE

**ONLY the DataAccessLayer project may communicate with ANY database.**

This is a non-negotiable architectural principle. No exceptions.

---

## What This Means

### ALLOWED (DataAccessLayer Project Only)

- Contains `GridironDbContext` (Entity Framework DbContext)
- Contains Repository interfaces (`ITeamRepository`, `IPlayerRepository`, `IGameRepository`)
- Contains Repository implementations (`TeamRepository`, `PlayerRepository`, `GameRepository`)
- Uses `DbContext`, `DbSet<T>`, LINQ queries, Entity Framework Core
- ALL database queries, inserts, updates, and deletes happen here

### FORBIDDEN (All Other Projects)

- **NEVER** reference `GridironDbContext` directly
- **NEVER** use `DbContext`, `DbSet<T>`, or Entity Framework directly
- **NEVER** write LINQ queries against the database
- **NEVER** use `Include()`, `FirstOrDefaultAsync()`, `ToListAsync()`, or any EF methods
- **NEVER** access `context.Teams`, `context.Players`, `context.Games` directly

---

## Repository Pattern

### What is a Repository?

A repository is an abstraction layer between your application and the database. It provides a clean API for data access without exposing database implementation details.

### Benefits

1. **Separation of Concerns** - Data access logic isolated in one place
2. **Testability** - Easy to mock repositories for unit tests
3. **Maintainability** - Change database implementation without touching application code
4. **Clear Contract** - Repository interfaces define what data operations are available
5. **Future-Proofing** - Easy to swap Entity Framework for Dapper, MongoDB, etc.

---

## Repository Structure

```
/gridiron
└── DataAccessLayer/
    ├── GridironDbContext.cs                  # EF Core DbContext
    └── Repositories/
        ├── ITeamRepository.cs                # Team data interface
        ├── TeamRepository.cs                 # Team data implementation
        ├── IPlayerRepository.cs              # Player data interface
        ├── PlayerRepository.cs               # Player data implementation
        ├── IGameRepository.cs                # Game data interface
        ├── GameRepository.cs                 # Game data implementation
        ├── IPlayerDataRepository.cs          # Player generation data interface
        └── DatabasePlayerDataRepository.cs   # Player generation data implementation
```

---

## Available Repository Methods

### ITeamRepository

```csharp
Task<List<Team>> GetAllAsync()
Task<Team?> GetByIdAsync(int teamId)
Task<Team?> GetByIdWithPlayersAsync(int teamId)
Task<Team?> GetByCityAndNameAsync(string city, string name)
Task<Team> AddAsync(Team team)
Task UpdateAsync(Team team)
Task DeleteAsync(int teamId)
```

### IPlayerRepository

```csharp
Task<List<Player>> GetAllAsync()
Task<List<Player>> GetByTeamIdAsync(int teamId)
Task<Player?> GetByIdAsync(int playerId)
Task<Player> AddAsync(Player player)
Task UpdateAsync(Player player)
Task DeleteAsync(int playerId)
```

### IGameRepository

```csharp
Task<List<Game>> GetAllAsync()
Task<Game?> GetByIdAsync(int gameId)
Task<Game?> GetByIdWithTeamsAsync(int gameId)
Task<Game> AddAsync(Game game)
Task UpdateAsync(Game game)
Task DeleteAsync(int gameId)
```

---

## Correct Usage

```csharp
// In WebApi, Console, or any other project
public class MyService
{
    private readonly ITeamRepository _teamRepository;  // Use repository interface

    public MyService(ITeamRepository teamRepository)
    {
        _teamRepository = teamRepository;
    }

    public async Task DoSomething()
    {
        var team = await _teamRepository.GetByIdAsync(1);  // Call repository method
    }
}
```

## Incorrect Usage

```csharp
// NEVER DO THIS!
public class MyService
{
    private readonly GridironDbContext _context;  // Direct DbContext reference

    public MyService(GridironDbContext context)
    {
        _context = context;  // FORBIDDEN
    }

    public async Task DoSomething()
    {
        var team = await _context.Teams.FindAsync(1);  // Direct database access
    }
}
```

---

## Adding New Data Operations

When you need a new database query:

**DON'T** add it to a controller or service
**DO** add it to the appropriate repository in DataAccessLayer

### Example: Need to find players by position

1. **Add method to interface** (`DataAccessLayer/Repositories/IPlayerRepository.cs`):
```csharp
Task<List<Player>> GetByPositionAsync(Positions position);
```

2. **Implement in repository** (`DataAccessLayer/Repositories/PlayerRepository.cs`):
```csharp
public async Task<List<Player>> GetByPositionAsync(Positions position)
{
    return await _context.Players
        .Where(p => p.Position == position)
        .ToListAsync();
}
```

3. **Use in your application**:
```csharp
var quarterbacks = await _playerRepository.GetByPositionAsync(Positions.QB);
```

---

## Code Review Checklist

### Red Flags

If you see ANY of these in WebApi, Console, or other projects:
- `using Microsoft.EntityFrameworkCore;`
- `using DataAccessLayer;` (should be `using DataAccessLayer.Repositories;`)
- `GridironDbContext _context`
- `.Include()`, `.FirstOrDefaultAsync()`, `.ToListAsync()`, etc.
- `_context.Teams`, `_context.Players`, `_context.Games`

### Green Lights

- `using DataAccessLayer.Repositories;`
- `ITeamRepository`, `IPlayerRepository`, `IGameRepository`
- Calling repository methods like `GetByIdAsync()`, `AddAsync()`, etc.

---

## Why This Matters

### Violating this principle causes:

1. **Tight Coupling** - Application code becomes dependent on EF Core
2. **Difficult Testing** - Can't easily mock database for unit tests
3. **Scattered Data Logic** - Queries spread across the codebase
4. **Migration Hell** - Changing databases requires touching every file
5. **Performance Issues** - Duplicate queries, N+1 problems
6. **Security Risks** - Easier to accidentally expose sensitive data

### Following this principle provides:

1. **Clean Architecture** - Clear separation between layers
2. **Easy Testing** - Mock repositories in unit tests
3. **Centralized Logic** - All queries in one place
4. **Flexibility** - Swap databases without breaking app code
5. **Performance** - Optimize queries in one location
6. **Security** - Control data access at repository level
