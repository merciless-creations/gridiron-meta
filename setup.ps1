#
# Gridiron Development Environment Setup (PowerShell)
# Run this once after cloning gridiron-meta to set up your workspace.
#
# Usage: .\setup.ps1
#

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

Write-Host "=== Gridiron Workspace Setup ===" -ForegroundColor Cyan
Write-Host ""

# --- 1. Clone sibling repos if not present ---
Write-Host "Checking for project repositories..." -ForegroundColor Yellow

$repos = @("gridiron", "gridiron-engine", "gridiron-web")
$org = "merciless-creations"

foreach ($repo in $repos) {
    if (Test-Path $repo) {
        Write-Host "  [OK] $repo already exists" -ForegroundColor Green
    } else {
        Write-Host "  [CLONE] Cloning $repo..." -ForegroundColor Blue
        try {
            git clone "git@github.com:${org}/${repo}.git"
        } catch {
            git clone "https://github.com/${org}/${repo}.git"
        }
    }
}
Write-Host ""

# --- 2. Link shared commands to user config ---
Write-Host "Setting up Claude Code shared commands..." -ForegroundColor Yellow

$claudeDir = "$env:USERPROFILE\.claude"
$commandsTarget = "$claudeDir\commands"
$commandsSource = "$ScriptDir\.claude\commands"

if (-not (Test-Path $claudeDir)) {
    New-Item -ItemType Directory -Path $claudeDir | Out-Null
}

if (Test-Path $commandsTarget) {
    Write-Host "  [SKIP] ~/.claude/commands already exists" -ForegroundColor Gray
    Write-Host "         If you need to update it, remove it first and re-run setup" -ForegroundColor Gray
} else {
    # Create junction (doesn't require admin)
    cmd /c "mklink /J `"$commandsTarget`" `"$commandsSource`""
    Write-Host "  [OK] Created junction to shared commands" -ForegroundColor Green
}
Write-Host ""

# --- 3. Build and register MCP server ---
Write-Host "Setting up MCP server..." -ForegroundColor Yellow

$mcpDir = "$ScriptDir\mcp-server"
if (Test-Path $mcpDir) {
    Set-Location $mcpDir

    if (-not (Test-Path "node_modules")) {
        Write-Host "  [INSTALL] Installing dependencies..." -ForegroundColor Blue
        npm install
    } else {
        Write-Host "  [OK] Dependencies already installed" -ForegroundColor Green
    }

    if (-not (Test-Path "dist\index.js")) {
        Write-Host "  [BUILD] Building MCP server..." -ForegroundColor Blue
        npm run build
    } else {
        Write-Host "  [OK] MCP server already built" -ForegroundColor Green
    }

    # Check if already registered
    $mcpList = claude mcp list 2>$null
    if ($mcpList -match "gridiron-context") {
        Write-Host "  [OK] MCP server already registered" -ForegroundColor Green
    } else {
        Write-Host "  [REGISTER] Registering MCP server with Claude Code..." -ForegroundColor Blue
        $mcpPath = "$ScriptDir\mcp-server\dist\index.js"
        claude mcp add gridiron-context node "$mcpPath"
        Write-Host "  [OK] MCP server registered" -ForegroundColor Green
    }

    Set-Location $ScriptDir
} else {
    Write-Host "  [WARN] mcp-server directory not found, skipping" -ForegroundColor Yellow
}
Write-Host ""

# --- Done ---
Write-Host "=== Setup Complete ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor White
Write-Host "  1. Restart Claude Code to pick up the MCP server"
Write-Host "  2. Open any project folder (gridiron, gridiron-engine, gridiron-web)"
Write-Host "  3. Type / to see available slash commands"
Write-Host ""
Write-Host "Available commands: /dev, /plan, /qa, /requirements, /review" -ForegroundColor Green
Write-Host ""
