# C# Coding Guidelines (gridiron & gridiron-engine)

## General Principles

- Follow existing patterns in the codebase
- Keep methods focused and reasonably sized
- Match existing indentation and formatting
- Don't add comments unless logic is non-obvious
- Don't add TODO comments - create issues instead

## Architecture Pattern

**Controllers → Services → Repositories**

```csharp
// Controller - HTTP concerns only
[HttpGet("{id}")]
public async Task<ActionResult<TeamDto>> GetTeam(int id)
{
    var team = await _teamRepository.GetByIdAsync(id);
    if (team == null) return NotFound();
    return Ok(MapToDto(team));
}

// Service - Business logic
public class GameService
{
    private readonly ITeamRepository _teamRepository;
    private readonly IGameEngine _engine;
    // ...
}

// Repository - Data access only
public class TeamRepository : ITeamRepository
{
    private readonly GridironDbContext _context;
    // ...
}
```

## Database Access Rules

### THE GOLDEN RULE

**ONLY the DataAccessLayer project may communicate with ANY database.**

This is non-negotiable. No exceptions.

### Forbidden Outside DataAccessLayer

- `GridironDbContext` references
- `using Microsoft.EntityFrameworkCore;`
- `DbContext`, `DbSet<T>`, Entity Framework directly
- LINQ queries against the database
- `Include()`, `FirstOrDefaultAsync()`, `ToListAsync()`

### Allowed Everywhere

- Repository interfaces (`ITeamRepository`, etc.)
- Calling repository methods (`GetByIdAsync()`, `AddAsync()`)

### Adding New Data Operations

1. Add method to repository interface
2. Implement in repository class
3. Use repository method in your code

```csharp
// 1. Interface (DataAccessLayer/Repositories/IPlayerRepository.cs)
Task<List<Player>> GetByPositionAsync(Positions position);

// 2. Implementation (DataAccessLayer/Repositories/PlayerRepository.cs)
public async Task<List<Player>> GetByPositionAsync(Positions position)
{
    return await _context.Players
        .Where(p => p.Position == position)
        .ToListAsync();
}

// 3. Usage (anywhere)
var quarterbacks = await _playerRepository.GetByPositionAsync(Positions.QB);
```

## Naming Conventions

- **Classes**: PascalCase (`PlayerService`, `TeamRepository`)
- **Methods**: PascalCase (`GetPlayerById`, `SimulateGame`)
- **Variables**: camelCase (`playerCount`, `homeTeam`)
- **Constants**: UPPER_SNAKE_CASE or PascalCase (`MAX_PLAYERS`, `DefaultTimeout`)
- **Interfaces**: Prefix with `I` (`IPlayerRepository`, `IGameEngine`)
- **Async methods**: Suffix with `Async` (`GetByIdAsync`, `SaveChangesAsync`)

## Async/Await

- Use async/await for I/O operations
- Avoid `.Result` and `.Wait()` - they can cause deadlocks
- Use `ConfigureAwait(false)` in library code

```csharp
// Good
var team = await _repository.GetByIdAsync(id);

// Bad - can deadlock
var team = _repository.GetByIdAsync(id).Result;
```

## Dependency Injection

Register services in `Program.cs`:

```csharp
// DbContext (only accessed by repositories)
builder.Services.AddDbContext<GridironDbContext>(options => ...);

// Repositories
builder.Services.AddScoped<ITeamRepository, TeamRepository>();
builder.Services.AddScoped<IPlayerRepository, PlayerRepository>();
builder.Services.AddScoped<IGameRepository, GameRepository>();

// Services
builder.Services.AddScoped<IGameService, GameService>();
```

## Error Handling

- Use exceptions for exceptional cases
- Return `null` or appropriate results for expected "not found" cases
- Let middleware handle unhandled exceptions

```csharp
public async Task<Team?> GetByIdAsync(int id)
{
    return await _context.Teams.FindAsync(id);
    // Returns null if not found - not an exception
}
```

## Testing

- Use MSTest framework
- Deterministic tests only (fixed seeds, mocks)
- Test naming: `MethodName_Scenario_ExpectedResult`

```csharp
[TestMethod]
public async Task GetByIdAsync_WithValidId_ReturnsTeam()
{
    // Arrange
    var repository = new TeamRepository(_context);

    // Act
    var result = await repository.GetByIdAsync(1);

    // Assert
    Assert.IsNotNull(result);
    Assert.AreEqual("Falcons", result.Name);
}
```

## Engine-Specific Guidelines

### Centralized Constants

All probability values go in `GameProbabilities.cs`:

```csharp
public static class GameProbabilities
{
    public static class Passing
    {
        public const double BASE_COMPLETION_RATE = 0.65;
        public const double PRESSURE_PENALTY = 0.20;
    }

    public static class Rushing
    {
        public const double BASE_YARDS = 3.0;
        public const double FUMBLE_RATE = 0.015;
    }
}

// Usage
var rate = GameProbabilities.Passing.BASE_COMPLETION_RATE;
```

### Decision vs Mechanic Separation

```
CONTEXT → DECISION ENGINE → GAME MECHANIC
"What's the situation?" → "What should we do?" → "Do it. Update state."
```

- **Context structs**: `Simulation/Decision/` (e.g., `TimeoutContext`)
- **Decision engines**: `Simulation/Decision/` (e.g., `TimeoutDecisionEngine`)
- **Game mechanics**: `Simulation/Mechanics/` (e.g., `TimeoutMechanic`)

### Rule Providers

For rules that differ by league type (NFL vs NCAA):

```csharp
public interface IOvertimeRules
{
    OvertimeResult ResolveOvertime(Game game);
}

public class NFLRegularSeasonRules : IOvertimeRules { ... }
public class NFLPlayoffRules : IOvertimeRules { ... }
public class NCAACollegeRules : IOvertimeRules { ... }
```
