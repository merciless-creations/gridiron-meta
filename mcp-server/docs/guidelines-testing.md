# Testing Guidelines

## Core Principle

**ALL tests must be deterministic.** Tests must produce consistent results every time they run.

## Forbidden Patterns

- Random values without fixed seeds
- Conditional assertions based on random outcomes
- Time-dependent assertions without mocking
- Tests that depend on external state

```csharp
// BAD - Non-deterministic
var result = _engine.SimulateGame(home, away);
if (result.HomeScore > result.AwayScore)
    Assert.IsTrue(result.Winner == home);
else
    Assert.IsTrue(result.Winner == away);

// GOOD - Deterministic with fixed seed
var result = _engine.SimulateGame(home, away, new SimulationOptions { RandomSeed = 12345 });
Assert.AreEqual(24, result.HomeScore);
Assert.AreEqual(17, result.AwayScore);
Assert.AreEqual(home, result.Winner);
```

---

## Backend Testing (gridiron)

### Framework: MSTest

- 839 tests, 100% pass rate
- Run with: `dotnet test`

### Test Naming Convention

```
MethodName_Scenario_ExpectedResult
```

Examples:
- `GetByIdAsync_WithValidId_ReturnsTeam`
- `SimulateGame_WithEqualTeams_ProducesRealisticScore`
- `AddPlayer_WhenRosterFull_ThrowsException`

### Test Structure

```csharp
[TestMethod]
public async Task MethodName_Scenario_ExpectedResult()
{
    // Arrange
    var repository = new TeamRepository(_context);
    var team = new Team { Name = "Test Team" };

    // Act
    var result = await repository.AddAsync(team);

    // Assert
    Assert.IsNotNull(result);
    Assert.AreEqual("Test Team", result.Name);
}
```

### Integration Tests

Location: `Gridiron.IntegrationTests/`

- Test full API endpoints
- Use test database (in-memory or SQL Server container)
- Seed test data before tests

---

## Frontend Testing (gridiron-web)

### Three Testing Layers

1. **Component Tests** - Vitest + React Testing Library
2. **API Integration Tests** - Vitest + MSW (Mock Service Worker)
3. **End-to-End Tests** - Playwright

### Running Tests

```bash
# Component/Integration tests
npm test                    # Watch mode
npm test -- --run          # Run once
npm run test:coverage      # With coverage

# E2E tests
npm run test:e2e           # Headless
npm run test:e2e:ui        # With UI
npm run test:e2e:report    # View last report
```

### Component Tests (Vitest)

```tsx
// src/components/__tests__/Navigation.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Navigation } from '../Navigation';

describe('Navigation', () => {
  it('renders all navigation links', () => {
    render(
      <BrowserRouter>
        <Navigation />
      </BrowserRouter>
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Teams')).toBeInTheDocument();
  });
});
```

### MSW Mock Handlers

```tsx
// src/test/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/teams', () => {
    return HttpResponse.json([
      { id: 1, name: 'Falcons', city: 'Atlanta' }
    ]);
  }),

  http.post('/api/games/simulate', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      id: 1,
      homeScore: 24,
      awayScore: 17,
    });
  }),
];
```

### E2E Tests (Playwright)

**Prerequisites:**
- API running on `http://localhost:5000`
- Database seeded with test data

```tsx
// e2e/navigation.spec.ts
import { test, expect } from '@playwright/test';

test('should navigate between pages', async ({ page }) => {
  await page.goto('/');

  await page.click('text=Teams');
  await expect(page).toHaveURL('/teams');

  await page.click('text=Home');
  await expect(page).toHaveURL('/');
});
```

---

## Engine Testing (gridiron-engine)

### Framework: MSTest

- 800+ unit tests
- Run with: `dotnet test`

### Deterministic Simulation

Always use fixed seeds for reproducible results:

```csharp
[TestMethod]
public void SimulateGame_WithSeed_ProducesConsistentResults()
{
    var engine = new GameEngine();
    var options = new SimulationOptions { RandomSeed = 12345 };

    var result1 = engine.SimulateGame(home, away, options);
    var result2 = engine.SimulateGame(home, away, options);

    Assert.AreEqual(result1.HomeScore, result2.HomeScore);
    Assert.AreEqual(result1.AwayScore, result2.AwayScore);
    Assert.AreEqual(result1.TotalPlays, result2.TotalPlays);
}
```

### Statistical Validation

Use `Gridiron.Validator` for large-scale validation:

```bash
dotnet run --project src/Gridiron.Validator -- --games 1000 --seed 42
```

Compare output against targets in `references/statistical-targets.md`. Acceptable variance: ±5%.

---

## CI/CD Integration

### GitHub Actions

Tests run automatically on every PR:

1. **Component Tests** (~2-3 min)
   - No backend required
   - Uses MSW mocks

2. **E2E Tests** (~5-8 min)
   - Spins up SQL Server container
   - Runs migrations and seeds data
   - Tests against real API

### Pre-commit Checks

Consider running tests before commit:

```bash
# Backend
dotnet test

# Frontend
npm test -- --run
```

---

## What to Test

### Do Test

- Component renders without crashing
- Props are displayed correctly
- User interactions (clicks, inputs)
- Conditional rendering (loading, error states)
- API error handling
- Edge cases (null, empty, boundary values)

### Don't Test

- Third-party library internals
- CSS styling (use visual regression)
- Implementation details (internal state)
- Things already covered by E2E

---

## Coverage Goals

- **Components**: 80%+ coverage
- **Pages**: 70%+ coverage
- **API hooks**: 60%+ coverage
- **Critical paths**: 90%+ (game simulation, navigation)

---

## Debugging Tests

### Backend

```bash
# Run specific test
dotnet test --filter "FullyQualifiedName~TestName"

# With verbose output
dotnet test --logger "console;verbosity=detailed"
```

### Frontend

```bash
# Run specific test file
npm test -- Navigation.test.tsx

# Run tests matching pattern
npm test -- --grep "displays teams"

# UI mode
npm run test:ui
```

### E2E

```bash
# Debug mode (pauses at each step)
npx playwright test --debug

# Run with browser visible
npx playwright test --headed

# View trace
npx playwright show-trace trace.zip
```
