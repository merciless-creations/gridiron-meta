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

# Check if any repos need cloning
$needClone = $false
foreach ($repo in $repos) {
    if (-not (Test-Path $repo)) {
        $needClone = $true
        break
    }
}

# If we need to clone, check SSH access first
$useSSH = $true
if ($needClone) {
    Write-Host "  Checking GitHub access..." -ForegroundColor Gray
    $ErrorActionPreference = "Continue"
    $sshTest = (ssh -T git@github.com 2>&1) | Out-String
    $ErrorActionPreference = "Stop"
    if ($sshTest -match "successfully authenticated") {
        Write-Host "  [OK] SSH access configured" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "  [WARN] SSH access to GitHub not configured." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "  To configure SSH (recommended):" -ForegroundColor White
        Write-Host "    1. Generate key:    ssh-keygen -t ed25519 -C `"your-email@example.com`""
        Write-Host "    2. Start agent (REQUIRES ADMIN TERMINAL):" -ForegroundColor DarkYellow
        Write-Host "                        Get-Service ssh-agent | Set-Service -StartupType Manual; Start-Service ssh-agent"
        Write-Host "    3. Add key:         ssh-add `$env:USERPROFILE\.ssh\id_ed25519"
        Write-Host "    4. Copy public key: Get-Content `$env:USERPROFILE\.ssh\id_ed25519.pub | Set-Clipboard"
        Write-Host "    5. Add to GitHub:   https://github.com/settings/keys"
        Write-Host "    6. Test:            ssh -T git@github.com"
        Write-Host ""
        $choice = Read-Host "  Use HTTPS instead? [Y/n]"
        if ($choice -eq "n" -or $choice -eq "N") {
            Write-Host ""
            Write-Host "  Setup paused. Configure SSH and re-run this script." -ForegroundColor Yellow
            exit 0
        } else {
            $useSSH = $false
            Write-Host "  [OK] Will use HTTPS (may prompt for credentials)" -ForegroundColor Green
        }
        Write-Host ""
    }
}

foreach ($repo in $repos) {
    if (Test-Path $repo) {
        Write-Host "  [OK] $repo already exists" -ForegroundColor Green
    } else {
        Write-Host "  [CLONE] Cloning $repo..." -ForegroundColor Blue
        if ($useSSH) {
            git clone "git@github.com:${org}/${repo}.git"
        } else {
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
