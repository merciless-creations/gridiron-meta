# Simulation Engine Philosophy

## Core Principle: Outcome-First Simulation

The engine determines **what happened and who did it**. Nothing else.

The play-by-play engine is the core of Gridiron. Scott built the state machine. Claude writes supporting systems under Scott's direction.

---

## Inputs That Matter

- The 11 players on the field for each side
- Each player's attributes (speed, strength, awareness, technique, etc.)
- Each player's current state (fatigue, injury status, confidence)
- Player intelligence and discipline (affects decision-making, penalties)
- Coaching staff influence (scheme effectiveness, play-calling tendencies, adjustments)
- Game situation (down, distance, field position, score, time)

## Inputs That Do NOT Matter During Simulation

- Formations
- Specific play names
- Audibles
- Pre-snap reads
- Motion and shifts
- Broadcast-style presentation details

**These are rendering concerns.** They can be derived, inferred, or generated after the outcome is determined. The simulation engine does not model them.

---

## Why This Matters

### 1. Performance

Less state to track means faster simulation. Leagues with many games need speed.

### 2. Flexibility

Presentation can evolve independently. Add formation graphics later without touching the engine.

### 3. Clarity

The engine answers one question: "Given these players and this situation, what happened?" Everything else is downstream.

### 4. Determinism

Outcome logic stays pure. No presentation concerns leak into game mechanics.

---

## What the Engine Produces

For each play, the engine outputs:

- **Play type** (run, pass, punt, field goal, etc.)
- **Primary actors** (ball carrier, passer, receiver, tackler, etc.)
- **Outcome** (yards gained/lost, touchdown, turnover, penalty, etc.)
- **Player state changes** (fatigue, injury, stats)
- **Game state changes** (down, distance, field position, clock, score)

The frontend or a separate rendering layer can then dress this up with formation names, play diagrams, announcer-style descriptions, or whatever presentation is desired.

---

## Coaching Influence

Coaches and staff affect simulation through:

- **Scheme fit** (players performing better/worse in certain systems)
- **Play-calling tendencies** (run/pass ratio, aggressiveness on 4th down, etc.)
- **In-game adjustments** (halftime changes, responding to opponent tendencies)
- **Player development** (offseason progression, practice effects)

These are modeled as modifiers to player effectiveness, not as explicit play selection.

---

## Player Attributes That Drive Outcomes

### Physical

- Speed, acceleration, strength, agility, stamina, durability

### Skill

- Throwing accuracy, catching, route running, blocking, tackling, coverage, pass rush, ball carrier vision

### Mental

- Intelligence (reads, adjustments)
- Discipline (penalties, assignments)
- Awareness (reaction to the play)
- Composure (pressure situations)

The engine uses these to resolve each play. Attribute weights vary by play type and player role.

---

## Decision vs Mechanic Separation

Separate **decision logic** ("should we do X?") from **game mechanics** ("X was chosen, execute it"):

```
┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
│      CONTEXT        │     │  DECISION ENGINE    │     │    GAME MECHANIC    │
│                     │     │                     │     │                     │
│  "What's the        │────▶│  "What should       │────▶│  "Do it.            │
│   situation?"       │     │   we do?"           │     │   Update state."    │
│                     │     │                     │     │                     │
│  Game state,        │     │  Probabilistic,     │     │  Pure rule          │
│  player attributes, │     │  situational,       │     │  enforcement,       │
│  score, time, etc.  │     │  coach tendencies   │     │  deterministic      │
└─────────────────────┘     └─────────────────────┘     └─────────────────────┘
```

### This Pattern Applies To:

| Mechanism | Context | Decision | Mechanic |
|-----------|---------|----------|----------|
| Timeouts | Game situation, score, time | Call timeout? | Execute timeout |
| Penalties | Play result + fouls called | Accept/decline? | Enforce penalty |
| Fourth down | Field position, score, time | Go/punt/FG? | Execute play type |
| Play calling | Down, distance, situation | Run/pass? | Execute play |
| Onside kick | Score, time remaining | Onside? | Execute kick type |
| Two-point | Score differential, time | 2pt/PAT? | Execute conversion |
| Fair catch | Punt hang time, coverage | Fair catch? | Signal/return |

### File Organization

- **Context structs**: `Simulation/Decision/` (e.g., `TimeoutContext`)
- **Decision engines**: `Simulation/Decision/` (e.g., `TimeoutDecisionEngine`)
- **Game mechanics**: `Simulation/Mechanics/` (e.g., `TimeoutMechanic`)

---

## State Machine

The simulation state machine is Scott's domain. It manages:

- Game flow (kickoff → drives → scoring → halftime → etc.)
- Play resolution
- Clock management
- Penalty enforcement
- Turnover handling
- End-of-game scenarios

**When working near the state machine, consult Scott before making changes.**

---

## What NOT to Model

Do NOT add complexity for:

- Formation names
- Specific play names
- Audibles or pre-snap reads
- Motion/shifts
- Broadcast-style presentation

These are rendering concerns. The engine outputs what happened; presentation adds the flavor.
