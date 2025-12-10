import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to docs folder (relative to compiled dist folder)
const docsPath = join(__dirname, "..", "docs");

// Create the MCP server
const server = new McpServer({
  name: "gridiron-context",
  version: "1.0.0",
});

// Helper to read doc files
function readDocFile(filename: string): string {
  const filePath = join(docsPath, filename);
  if (existsSync(filePath)) {
    return readFileSync(filePath, "utf-8");
  }
  return `Document not found: ${filename}`;
}

// =============================================================================
// RESOURCES - Project Documentation
// =============================================================================

// --- Project Overview ---
server.resource(
  "gridiron://project/overview",
  "Gridiron Project Overview - Vision, repos, tech stack",
  { mimeType: "text/markdown" },
  async () => ({
    contents: [{
      uri: "gridiron://project/overview",
      mimeType: "text/markdown",
      text: readDocFile("project-overview.md"),
    }],
  })
);

server.resource(
  "gridiron://project/repos",
  "Repository Structure - All repos and their purposes",
  { mimeType: "text/markdown" },
  async () => ({
    contents: [{
      uri: "gridiron://project/repos",
      mimeType: "text/markdown",
      text: readDocFile("repository-map.md"),
    }],
  })
);

server.resource(
  "gridiron://project/architecture",
  "System Architecture - How components interact",
  { mimeType: "text/markdown" },
  async () => ({
    contents: [{
      uri: "gridiron://project/architecture",
      mimeType: "text/markdown",
      text: readDocFile("architecture.md"),
    }],
  })
);

// --- Coding Guidelines ---
server.resource(
  "gridiron://guidelines/csharp",
  "C# Coding Guidelines - Backend API patterns",
  { mimeType: "text/markdown" },
  async () => ({
    contents: [{
      uri: "gridiron://guidelines/csharp",
      mimeType: "text/markdown",
      text: readDocFile("guidelines-csharp.md"),
    }],
  })
);

server.resource(
  "gridiron://guidelines/typescript",
  "TypeScript/React Guidelines - Frontend patterns",
  { mimeType: "text/markdown" },
  async () => ({
    contents: [{
      uri: "gridiron://guidelines/typescript",
      mimeType: "text/markdown",
      text: readDocFile("guidelines-typescript.md"),
    }],
  })
);

server.resource(
  "gridiron://guidelines/testing",
  "Testing Guidelines - All repos",
  { mimeType: "text/markdown" },
  async () => ({
    contents: [{
      uri: "gridiron://guidelines/testing",
      mimeType: "text/markdown",
      text: readDocFile("guidelines-testing.md"),
    }],
  })
);

server.resource(
  "gridiron://guidelines/git",
  "Git Workflow - Branching, commits, PRs",
  { mimeType: "text/markdown" },
  async () => ({
    contents: [{
      uri: "gridiron://guidelines/git",
      mimeType: "text/markdown",
      text: readDocFile("guidelines-git.md"),
    }],
  })
);

server.resource(
  "gridiron://guidelines/architecture-principles",
  "Architecture Principles - Repository pattern, data access rules",
  { mimeType: "text/markdown" },
  async () => ({
    contents: [{
      uri: "gridiron://guidelines/architecture-principles",
      mimeType: "text/markdown",
      text: readDocFile("architecture-principles.md"),
    }],
  })
);

// --- Simulation Engine ---
server.resource(
  "gridiron://engine/philosophy",
  "Simulation Philosophy - Outcome-first approach",
  { mimeType: "text/markdown" },
  async () => ({
    contents: [{
      uri: "gridiron://engine/philosophy",
      mimeType: "text/markdown",
      text: readDocFile("engine-philosophy.md"),
    }],
  })
);

server.resource(
  "gridiron://engine/statistical-targets",
  "Statistical Targets - NFL statistics to match",
  { mimeType: "text/markdown" },
  async () => ({
    contents: [{
      uri: "gridiron://engine/statistical-targets",
      mimeType: "text/markdown",
      text: readDocFile("statistical-targets.md"),
    }],
  })
);

server.resource(
  "gridiron://engine/attribute-mappings",
  "Attribute Mappings - Player attributes to probabilities",
  { mimeType: "text/markdown" },
  async () => ({
    contents: [{
      uri: "gridiron://engine/attribute-mappings",
      mimeType: "text/markdown",
      text: readDocFile("attribute-mappings.md"),
    }],
  })
);

// --- Frontend Design ---
server.resource(
  "gridiron://frontend/design-system",
  "Frontend Design System - Colors, typography, components",
  { mimeType: "text/markdown" },
  async () => ({
    contents: [{
      uri: "gridiron://frontend/design-system",
      mimeType: "text/markdown",
      text: readDocFile("frontend-design.md"),
    }],
  })
);

// --- Agent Personas ---
server.resource(
  "gridiron://agents/dev",
  "Development Agent Persona",
  { mimeType: "text/markdown" },
  async () => ({
    contents: [{
      uri: "gridiron://agents/dev",
      mimeType: "text/markdown",
      text: readDocFile("agent-dev.md"),
    }],
  })
);

server.resource(
  "gridiron://agents/plan",
  "Planning Agent Persona",
  { mimeType: "text/markdown" },
  async () => ({
    contents: [{
      uri: "gridiron://agents/plan",
      mimeType: "text/markdown",
      text: readDocFile("agent-plan.md"),
    }],
  })
);

server.resource(
  "gridiron://agents/qa",
  "QA/Testing Agent Persona",
  { mimeType: "text/markdown" },
  async () => ({
    contents: [{
      uri: "gridiron://agents/qa",
      mimeType: "text/markdown",
      text: readDocFile("agent-qa.md"),
    }],
  })
);

server.resource(
  "gridiron://agents/review",
  "Code Review Agent Persona",
  { mimeType: "text/markdown" },
  async () => ({
    contents: [{
      uri: "gridiron://agents/review",
      mimeType: "text/markdown",
      text: readDocFile("agent-review.md"),
    }],
  })
);

server.resource(
  "gridiron://agents/requirements",
  "Requirements Agent Persona",
  { mimeType: "text/markdown" },
  async () => ({
    contents: [{
      uri: "gridiron://agents/requirements",
      mimeType: "text/markdown",
      text: readDocFile("agent-requirements.md"),
    }],
  })
);

// --- Roadmap ---
server.resource(
  "gridiron://roadmap",
  "Project Roadmap and Milestones",
  { mimeType: "text/markdown" },
  async () => ({
    contents: [{
      uri: "gridiron://roadmap",
      mimeType: "text/markdown",
      text: readDocFile("roadmap.md"),
    }],
  })
);

// =============================================================================
// TOOLS - Dynamic Operations
// =============================================================================

// Tool: Get repo info
server.tool(
  "get_repo_info",
  "Get detailed information about a specific Gridiron repository",
  {
    type: "object",
    properties: {
      repo: {
        type: "string",
        enum: ["gridiron", "gridiron-web", "gridiron-engine", "gridiron-meta"],
        description: "The repository name",
      },
    },
    required: ["repo"],
  },
  async (params: { repo: string }) => {
    const repoInfo: Record<string, object> = {
      gridiron: {
        name: "gridiron",
        description: "C# .NET 8 API backend",
        language: "C#",
        framework: ".NET 8",
        database: "Azure SQL with Entity Framework Core 8",
        testing: "MSTest (839 tests)",
        purpose: "REST API, authentication, data persistence, game management services",
        architecture: "Controllers → Services → Repositories",
        keyProjects: [
          "Gridiron.WebApi - REST API",
          "DomainObjects - Domain models",
          "DataAccessLayer - EF Core persistence",
          "GameManagement - Player/team builder services",
        ],
        githubProject: "Project 1 (Gridiron Roadmap)",
        projectUrl: "https://github.com/orgs/merciless-creations/projects/1",
        repoUrl: "https://github.com/merciless-creations/gridiron",
      },
      "gridiron-web": {
        name: "gridiron-web",
        description: "React/TypeScript frontend",
        language: "TypeScript",
        framework: "React 18",
        buildTool: "Vite",
        styling: "TailwindCSS",
        stateManagement: "TanStack Query (React Query)",
        auth: "Azure AD B2C / MSAL",
        testing: "Vitest (unit), Playwright (E2E)",
        hosting: "Azure Static Web Apps",
        purpose: "User interface, client-side logic, API integration",
        designSystem: "Dark mode, sports broadcast aesthetic",
        githubProject: "Project 3 (Web Roadmap)",
        projectUrl: "https://github.com/orgs/merciless-creations/projects/3",
        repoUrl: "https://github.com/merciless-creations/gridiron-web",
      },
      "gridiron-engine": {
        name: "gridiron-engine",
        description: "State machine-based NFL football simulation engine",
        language: "C#",
        framework: ".NET",
        testing: "800+ unit tests",
        distribution: "NuGet package on GitHub Packages",
        purpose: "Play-by-play simulation, outcome calculation, game state management",
        keyFeatures: [
          "19 game states with Stateless library",
          "Probability-driven outcomes based on player skills",
          "Deterministic simulation with seed support",
          "Penalty system, injury tracking, clock management",
        ],
        philosophy: "Outcome-first - determines what happened, not formations/play names",
        keyFiles: [
          "Simulation/Configuration/GameProbabilities.cs - All probability constants",
          "Simulation/Decision/ - Decision engines",
          "Simulation/Mechanics/ - Game mechanics",
        ],
        githubProject: "Project 2 (Engine Roadmap)",
        projectUrl: "https://github.com/orgs/merciless-creations/projects/2",
        repoUrl: "https://github.com/merciless-creations/gridiron-engine",
      },
      "gridiron-meta": {
        name: "gridiron-meta",
        description: "Shared configuration and tooling for the multi-repo project",
        purpose: "Claude Code shared commands, MCP server, cross-repo documentation",
        contains: [
          ".claude/commands/ - Shared slash commands (dev, plan, qa, requirements, review)",
          "CLAUDE.md - Shared project instructions",
          "mcp-server/ - This MCP server",
        ],
        parentProject: "Goal To Go Football (Project 4)",
        projectUrl: "https://github.com/orgs/merciless-creations/projects/4",
      },
    };

    const info = repoInfo[params.repo];
    if (!info) {
      return {
        content: [{ type: "text", text: `Unknown repository: ${params.repo}` }],
        isError: true,
      };
    }

    return {
      content: [{ type: "text", text: JSON.stringify(info, null, 2) }],
    };
  }
);

// Tool: Get GitHub project for issue assignment
server.tool(
  "get_github_project",
  "Get the correct GitHub Project for a given issue type or repository",
  {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["parent", "gridiron", "gridiron-web", "gridiron-engine"],
        description: "Issue type: 'parent' for epics, or repo name for repo-specific issues",
      },
    },
    required: ["type"],
  },
  async (params: { type: string }) => {
    const projects: Record<string, object> = {
      parent: {
        name: "Goal To Go Football",
        projectNumber: 4,
        url: "https://github.com/orgs/merciless-creations/projects/4",
        usage: "Parent/epic issues that span multiple repos",
        assignCommand: 'gh issue create --project "Goal To Go Football"',
      },
      gridiron: {
        name: "Gridiron Roadmap",
        projectNumber: 1,
        url: "https://github.com/orgs/merciless-creations/projects/1",
        usage: "API backend issues (C# .NET)",
        assignCommand: 'gh issue create --project "Gridiron Roadmap"',
      },
      "gridiron-web": {
        name: "Web Roadmap",
        projectNumber: 3,
        url: "https://github.com/orgs/merciless-creations/projects/3",
        usage: "Frontend issues (React/TypeScript)",
        assignCommand: 'gh issue create --project "Web Roadmap"',
      },
      "gridiron-engine": {
        name: "Engine Roadmap",
        projectNumber: 2,
        url: "https://github.com/orgs/merciless-creations/projects/2",
        usage: "Game simulation engine issues",
        assignCommand: 'gh issue create --project "Engine Roadmap"',
      },
    };

    const project = projects[params.type];
    if (!project) {
      return {
        content: [{ type: "text", text: `Unknown type: ${params.type}` }],
        isError: true,
      };
    }

    return {
      content: [{ type: "text", text: JSON.stringify(project, null, 2) }],
    };
  }
);

// Tool: List all available resources
server.tool(
  "list_resources",
  "List all available documentation resources in the MCP server",
  {},
  async () => {
    const resources = {
      project: [
        { uri: "gridiron://project/overview", title: "Project Overview", description: "Vision, repos, tech stack" },
        { uri: "gridiron://project/repos", title: "Repository Map", description: "All repos and purposes" },
        { uri: "gridiron://project/architecture", title: "System Architecture", description: "Component interactions" },
      ],
      guidelines: [
        { uri: "gridiron://guidelines/csharp", title: "C# Guidelines", description: "Backend API patterns" },
        { uri: "gridiron://guidelines/typescript", title: "TypeScript/React Guidelines", description: "Frontend patterns" },
        { uri: "gridiron://guidelines/testing", title: "Testing Guidelines", description: "All repos" },
        { uri: "gridiron://guidelines/git", title: "Git Workflow", description: "Branching, commits, PRs" },
        { uri: "gridiron://guidelines/architecture-principles", title: "Architecture Principles", description: "Repository pattern, data access" },
      ],
      engine: [
        { uri: "gridiron://engine/philosophy", title: "Simulation Philosophy", description: "Outcome-first approach" },
        { uri: "gridiron://engine/statistical-targets", title: "Statistical Targets", description: "NFL statistics to match" },
        { uri: "gridiron://engine/attribute-mappings", title: "Attribute Mappings", description: "Player attributes to probabilities" },
      ],
      frontend: [
        { uri: "gridiron://frontend/design-system", title: "Design System", description: "Colors, typography, components" },
      ],
      agents: [
        { uri: "gridiron://agents/dev", title: "Dev Agent", description: "Development persona" },
        { uri: "gridiron://agents/plan", title: "Plan Agent", description: "Planning persona" },
        { uri: "gridiron://agents/qa", title: "QA Agent", description: "Testing persona" },
        { uri: "gridiron://agents/review", title: "Review Agent", description: "Code review persona" },
        { uri: "gridiron://agents/requirements", title: "Requirements Agent", description: "Requirements refinement persona" },
      ],
      roadmap: [
        { uri: "gridiron://roadmap", title: "Roadmap", description: "Project milestones" },
      ],
    };

    return {
      content: [{ type: "text", text: JSON.stringify(resources, null, 2) }],
    };
  }
);

// Tool: Get tech stack summary
server.tool(
  "get_tech_stack",
  "Get the complete technology stack for the Gridiron project",
  {},
  async () => {
    const techStack = {
      backend: {
        language: "C# 12",
        framework: ".NET 8",
        database: "Azure SQL",
        orm: "Entity Framework Core 8",
        stateMachine: "Stateless library",
        testing: "MSTest (839+ tests)",
        hosting: "Azure",
      },
      frontend: {
        language: "TypeScript",
        framework: "React 18",
        buildTool: "Vite",
        styling: "TailwindCSS",
        routing: "React Router v6",
        stateManagement: "TanStack Query (React Query)",
        httpClient: "Axios",
        auth: "Azure AD B2C / MSAL",
        unitTesting: "Vitest + React Testing Library + MSW",
        e2eTesting: "Playwright",
        hosting: "Azure Static Web Apps",
      },
      engine: {
        language: "C#",
        framework: ".NET",
        pattern: "State machine (19 states)",
        distribution: "NuGet package on GitHub Packages",
        testing: "800+ unit tests",
        features: [
          "Probability-driven outcomes",
          "Deterministic simulation with seeds",
          "Complete NFL rules (downs, penalties, injuries)",
        ],
      },
      devOps: {
        versionControl: "Git / GitHub",
        ci: "GitHub Actions",
        projects: "GitHub Projects (4 boards)",
        organization: "merciless-creations",
      },
    };

    return {
      content: [{ type: "text", text: JSON.stringify(techStack, null, 2) }],
    };
  }
);

// Tool: Get hard rules
server.tool(
  "get_hard_rules",
  "Get the absolute rules that must never be violated in this project",
  {},
  async () => {
    const hardRules = {
      git: {
        rule: "NEVER commit or push directly to main/master",
        reason: "Violations break CI/CD and require manual cleanup",
        process: [
          "1. Create feature branch from master",
          "2. Make changes and commit to feature branch",
          "3. Push feature branch to origin",
          "4. Create Pull Request",
          "5. Wait for approval - Scott merges after CI passes",
        ],
        branchNaming: {
          "feature/": "New features or enhancements",
          "fix/": "Bug fixes",
          "chore/": "Maintenance, refactoring, docs",
        },
      },
      architecture: {
        rule: "ONLY the DataAccessLayer project may access the database",
        reason: "Separation of concerns, testability, maintainability",
        forbidden: [
          "GridironDbContext references outside DataAccessLayer",
          "Direct use of DbContext, DbSet<T>, or Entity Framework",
          "LINQ queries against the database outside repositories",
          "Include(), FirstOrDefaultAsync(), ToListAsync() outside DAL",
        ],
        allowed: [
          "Repository interfaces (ITeamRepository, etc.)",
          "Calling repository methods like GetByIdAsync(), AddAsync()",
        ],
      },
      testing: {
        rule: "ALL tests must be deterministic",
        forbidden: [
          "Random values without fixed seeds",
          "Conditional assertions based on random outcomes",
          "Time-dependent assertions without mocking",
          "Tests that depend on external state",
        ],
        required: "Use fixed seeds: var game = new Game { RandomSeed = 12345 };",
      },
      interaction: {
        rule: "WAIT FOR EXPLICIT APPROVAL before implementing",
        process: [
          "Plan first - analyze and propose before coding",
          "Document before coding - agree on HOW before WHAT",
          "One step at a time - don't chain assumptions",
          "Ask Scott when uncertain - do not assume or estimate",
        ],
      },
      engine: {
        rule: "Do NOT model formations, play names, or presentation concerns",
        reason: "Engine outputs what happened; presentation adds flavor",
        forbidden: [
          "Formation names in simulation logic",
          "Specific play names",
          "Audibles or pre-snap reads",
          "Motion and shifts",
          "Broadcast-style presentation",
        ],
      },
    };

    return {
      content: [{ type: "text", text: JSON.stringify(hardRules, null, 2) }],
    };
  }
);

// Tool: Get simulation constants location
server.tool(
  "get_constants_info",
  "Get information about where simulation constants are defined",
  {},
  async () => {
    const constantsInfo = {
      location: "gridiron-engine/src/Gridiron.Engine/Simulation/Configuration/GameProbabilities.cs",
      rule: "ALL probability values, thresholds, and configuration constants MUST be defined here",
      structure: "Nested static classes organized by domain",
      existingDomains: [
        "Passing - completion rates, interception chances",
        "Rushing - tackle break rates, big run chances",
        "Turnovers - fumble rates, recovery rates",
        "FieldGoals - make percentages by distance",
        "Kickoffs - touchback rates, return averages",
        "Punts - gross yards, net yards, inside-20",
        "GameDecisions - play type selection weights",
        "FourthDown - go-for-it probabilities, field position thresholds",
        "Timeouts - timeout thresholds, ice kicker probability",
      ],
      usage: "Reference as GameProbabilities.DomainName.CONSTANT_NAME",
      addingNew: "When adding new simulation logic, add a new nested class to GameProbabilities.cs",
    };

    return {
      content: [{ type: "text", text: JSON.stringify(constantsInfo, null, 2) }],
    };
  }
);

// =============================================================================
// Start the server
// =============================================================================

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("Gridiron MCP server started successfully");
