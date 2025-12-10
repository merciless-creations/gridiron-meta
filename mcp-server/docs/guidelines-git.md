# Git Workflow

## THE ABSOLUTE RULE

> **NEVER COMMIT OR PUSH DIRECTLY TO MASTER OR MAIN**
>
> This is non-negotiable. Violations break CI/CD and require manual cleanup.

This applies to ALL changes, no matter how small—even single-line fixes.

---

## Required Process for ALL Changes

### 1. Create a Feature Branch

```bash
git checkout master
git pull
git checkout -b feature/your-change-description
```

### 2. Make Changes and Commit

```bash
git add .
git commit -m "Description of change"
```

### 3. Push the Feature Branch

```bash
git push -u origin feature/your-change-description
```

### 4. Create a Pull Request

Create PR on GitHub for Scott to review.

### 5. Wait for Approval

Scott will merge after CI passes. Do not merge your own PRs.

---

## Branch Naming

| Prefix | Use Case |
|--------|----------|
| `feature/` | New features or enhancements |
| `fix/` | Bug fixes |
| `chore/` | Maintenance, refactoring, docs |

Examples:
- `feature/add-player-trading`
- `fix/game-clock-overtime-bug`
- `chore/update-dependencies`

---

## Checkpoint Commits

**Never miss an opportunity to commit a checkpoint.**

When you reach a stable state (tests pass, feature partially complete, architecture in place), commit it immediately. These checkpoints serve as rollback points if subsequent work goes sideways.

### Good Checkpoint Moments

- Architecture/scaffolding complete, before implementation details
- Tests written and passing, before refactoring
- One component complete, before starting the next
- After any significant milestone within a feature

### Checkpoint Commit Requirements

- Have clear commit messages describing what's complete
- Pass all existing tests
- Be atomic (don't mix unrelated changes)

---

## Commit Messages

Write clear, concise messages:

```bash
# Good
git commit -m "Add player trading endpoint to API"
git commit -m "Fix overtime clock not stopping after touchdown"
git commit -m "Update React Query to v5"

# Bad
git commit -m "changes"
git commit -m "WIP"
git commit -m "fix stuff"
```

---

## Pull Request Guidelines

### Title

Clear, descriptive title summarizing the change.

### Description

Include:
- **Summary**: What changed and why (1-3 bullet points)
- **Test Plan**: How to verify the changes work
- **Related Issues**: Link to GitHub issues

### Example PR Description

```markdown
## Summary
- Add player trading functionality between teams
- Implement trade validation (salary cap, roster limits)
- Add trade history tracking

## Test Plan
- [ ] Create trade between two teams
- [ ] Verify salary cap is enforced
- [ ] Verify roster limits are enforced
- [ ] Check trade appears in history

Closes #123
```

---

## GitHub Issue Assignment

When creating issues for this multi-repo project:

### 1. Assign to Correct Project

| Issue Type | Project |
|------------|---------|
| Parent/epic issues | [Project 4 (Goal To Go Football)](https://github.com/orgs/merciless-creations/projects/4) |
| gridiron (API) issues | [Project 1 (Gridiron Roadmap)](https://github.com/orgs/merciless-creations/projects/1) |
| gridiron-web issues | [Project 3 (Web Roadmap)](https://github.com/orgs/merciless-creations/projects/3) |
| gridiron-engine issues | [Project 2 (Engine Roadmap)](https://github.com/orgs/merciless-creations/projects/2) |

### 2. Link Sub-Issues

Use GitHub's sub-issue feature to link implementation issues to parent epics.

### 3. Create Issues with gh CLI

```bash
# API issue
gh issue create --title "Add player trading" --project "Gridiron Roadmap"

# Frontend issue
gh issue create --title "Trade UI component" --project "Web Roadmap"

# Parent epic
gh issue create --title "Player Trading Feature" --project "Goal To Go Football"
```

---

## Forbidden Git Operations

- `git push origin master` / `git push origin main`
- `git commit` directly on master/main
- `git push --force` to shared branches
- `git rebase -i` on pushed commits
- Merging your own PRs without approval

---

## When Uncertain

Ask Scott. He is precise in his requirements—do not assume or estimate. If a requirement is ambiguous, clarify before implementing.
