#!/bin/bash
#
# Gridiron Development Environment Setup
# Run this once after cloning gridiron-meta to set up your workspace.
#
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "=== Gridiron Workspace Setup ==="
echo ""

# Detect OS
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" || "$OSTYPE" == "win32" ]]; then
    IS_WINDOWS=true
else
    IS_WINDOWS=false
fi

# --- 1. Clone sibling repos if not present ---
echo "Checking for project repositories..."

REPOS=("gridiron" "gridiron-engine" "gridiron-web")
ORG="merciless-creations"

for repo in "${REPOS[@]}"; do
    if [ -d "$repo" ]; then
        echo "  [OK] $repo already exists"
    else
        echo "  [CLONE] Cloning $repo..."
        git clone "git@github.com:$ORG/$repo.git" || git clone "https://github.com/$ORG/$repo.git"
    fi
done
echo ""

# --- 2. Link shared commands to user config ---
echo "Setting up Claude Code shared commands..."

if [ "$IS_WINDOWS" = true ]; then
    CLAUDE_DIR="$USERPROFILE/.claude"
    COMMANDS_TARGET="$CLAUDE_DIR/commands"
    COMMANDS_SOURCE="$SCRIPT_DIR/.claude/commands"

    mkdir -p "$CLAUDE_DIR"

    if [ -L "$COMMANDS_TARGET" ] || [ -d "$COMMANDS_TARGET" ]; then
        echo "  [SKIP] ~/.claude/commands already exists"
        echo "         If you need to update it, remove it first and re-run setup"
    else
        # Use Windows junction via cmd (works without admin)
        cmd //c "mklink /J \"$(cygpath -w "$COMMANDS_TARGET")\" \"$(cygpath -w "$COMMANDS_SOURCE")\""
        echo "  [OK] Created junction to shared commands"
    fi
else
    CLAUDE_DIR="$HOME/.claude"
    COMMANDS_TARGET="$CLAUDE_DIR/commands"
    COMMANDS_SOURCE="$SCRIPT_DIR/.claude/commands"

    mkdir -p "$CLAUDE_DIR"

    if [ -L "$COMMANDS_TARGET" ] || [ -d "$COMMANDS_TARGET" ]; then
        echo "  [SKIP] ~/.claude/commands already exists"
        echo "         If you need to update it, remove it first and re-run setup"
    else
        ln -s "$COMMANDS_SOURCE" "$COMMANDS_TARGET"
        echo "  [OK] Created symlink to shared commands"
    fi
fi
echo ""

# --- 3. Build and register MCP server ---
echo "Setting up MCP server..."

if [ -d "mcp-server" ]; then
    cd mcp-server

    if [ ! -d "node_modules" ]; then
        echo "  [INSTALL] Installing dependencies..."
        npm install
    else
        echo "  [OK] Dependencies already installed"
    fi

    if [ ! -f "dist/index.js" ]; then
        echo "  [BUILD] Building MCP server..."
        npm run build
    else
        echo "  [OK] MCP server already built"
    fi

    # Check if already registered
    if claude mcp list 2>/dev/null | grep -q "gridiron-context"; then
        echo "  [OK] MCP server already registered"
    else
        echo "  [REGISTER] Registering MCP server with Claude Code..."
        if [ "$IS_WINDOWS" = true ]; then
            MCP_PATH="$(cygpath -w "$SCRIPT_DIR/mcp-server/dist/index.js")"
        else
            MCP_PATH="$SCRIPT_DIR/mcp-server/dist/index.js"
        fi
        claude mcp add gridiron-context node "$MCP_PATH"
        echo "  [OK] MCP server registered"
    fi

    cd ..
else
    echo "  [WARN] mcp-server directory not found, skipping"
fi
echo ""

# --- Done ---
echo "=== Setup Complete ==="
echo ""
echo "Next steps:"
echo "  1. Restart Claude Code to pick up the MCP server"
echo "  2. Open any project folder (gridiron, gridiron-engine, gridiron-web)"
echo "  3. Type / to see available slash commands"
echo ""
echo "Available commands: /dev, /plan, /qa, /requirements, /review"
echo ""
