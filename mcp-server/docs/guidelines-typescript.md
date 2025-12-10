# TypeScript/React Guidelines (gridiron-web)

## General Principles

- Functional components with hooks
- TypeScript strict mode - avoid `any`
- TailwindCSS for styling (no separate CSS files unless necessary)
- Component files colocated with their concerns

## Project Structure

```
gridiron-web/
├── src/
│   ├── api/                 # API client and React Query hooks
│   │   ├── client.ts        # Axios configuration
│   │   ├── teams.ts         # Teams API hooks
│   │   ├── players.ts       # Players API hooks
│   │   └── games.ts         # Games API hooks
│   ├── components/          # Reusable UI components
│   │   ├── Layout.tsx
│   │   ├── Navigation.tsx
│   │   └── __tests__/       # Component tests
│   ├── pages/               # Route pages
│   │   ├── HomePage.tsx
│   │   ├── TeamsPage.tsx
│   │   └── __tests__/       # Page tests
│   ├── types/               # TypeScript type definitions
│   │   ├── Player.ts
│   │   ├── Team.ts
│   │   └── Game.ts
│   └── test/mocks/          # MSW mock handlers
├── e2e/                     # Playwright E2E tests
└── public/                  # Static assets
```

## Naming Conventions

- **Components**: PascalCase (`PlayerCard.tsx`, `TeamRoster.tsx`)
- **Hooks**: camelCase with `use` prefix (`usePlayer`, `useTeams`)
- **Utilities**: camelCase (`formatDate.ts`, `calculateStats.ts`)
- **Types/Interfaces**: PascalCase (`Player`, `GameState`, `TeamStats`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`, `MAX_ROSTER_SIZE`)

## Component Patterns

### Functional Components

```tsx
interface PlayerCardProps {
  player: Player;
  onSelect?: (player: Player) => void;
}

export function PlayerCard({ player, onSelect }: PlayerCardProps) {
  return (
    <div
      className="bg-card p-4 rounded-lg border border-subtle"
      onClick={() => onSelect?.(player)}
    >
      <h3 className="text-lg font-bold">{player.name}</h3>
      <span className="text-muted">{player.position}</span>
    </div>
  );
}
```

### Custom Hooks

```tsx
export function useTeams() {
  return useQuery({
    queryKey: ['teams'],
    queryFn: () => api.get<Team[]>('/api/teams').then(res => res.data),
  });
}

export function useTeam(id: number) {
  return useQuery({
    queryKey: ['teams', id],
    queryFn: () => api.get<Team>(`/api/teams/${id}`).then(res => res.data),
    enabled: !!id,
  });
}
```

## State Management

### TanStack Query (React Query)

Use for all server state:

```tsx
// Fetching
const { data: teams, isLoading, error } = useTeams();

// Mutations
const mutation = useMutation({
  mutationFn: (team: CreateTeamDto) => api.post('/api/teams', team),
  onSuccess: () => queryClient.invalidateQueries(['teams']),
});
```

### Local State

Use React state for UI-only state:

```tsx
const [isOpen, setIsOpen] = useState(false);
const [selectedTab, setSelectedTab] = useState<'roster' | 'stats'>('roster');
```

## API Integration

### Axios Client Setup

```tsx
// src/api/client.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth interceptor
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Type Definitions

Mirror C# models:

```tsx
// src/types/Player.ts
export interface Player {
  id: number;
  firstName: string;
  lastName: string;
  position: Position;
  number: number;
  speed: number;
  strength: number;
  // ... other attributes
}

export type Position = 'QB' | 'RB' | 'WR' | 'TE' | 'OL' | 'DL' | 'LB' | 'CB' | 'S' | 'K' | 'P';
```

## Styling with TailwindCSS

### Custom Theme Colors

Defined in `tailwind.config.js`:

```css
/* Dark theme base */
--bg-primary: #0a0a0f;
--bg-secondary: #12121a;
--bg-card: #1e1e2a;
--text-primary: #ffffff;
--text-secondary: #a0a0b0;
--accent-primary: #00d4aa;
--accent-win: #22c55e;
--accent-loss: #ef4444;
```

### Common Patterns

```tsx
// Card container
<div className="bg-card rounded-lg border border-subtle p-4">

// Primary button
<button className="bg-accent-primary text-white px-4 py-2 rounded hover:opacity-90">

// Stats with positive/negative colors
<span className={score > 0 ? 'text-accent-win' : 'text-accent-loss'}>
  {score > 0 ? '+' : ''}{score}
</span>
```

## Testing

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

### Integration Tests (MSW)

```tsx
// src/test/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/teams', () => {
    return HttpResponse.json([
      { id: 1, name: 'Falcons', city: 'Atlanta' }
    ]);
  }),
];
```

### E2E Tests (Playwright)

```tsx
// e2e/navigation.spec.ts
import { test, expect } from '@playwright/test';

test('should navigate between pages', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Teams');
  await expect(page).toHaveURL('/teams');
});
```

## Anti-Patterns to Avoid

- Light/white backgrounds as defaults
- Excessive whitespace (embrace data density)
- Generic card layouts without sports context
- Burying stats behind clicks—surface key numbers immediately
- Using `any` type
- Inline styles instead of Tailwind classes
- Class components instead of functional
