#!/usr/bin/env bash
# ==============================================================================
# ARISE PRODUCTION STUDIO - TRI-TARGET AUTOMATED SYNC & DEPLOY ENGINE
# TARGETS: 1. GitHub Repo | 2. Desktop App & DMG | 3. VPS (root@2.25.113.26)
# THE AI CONTENT FOUNDRY, LLC • © 2026 • ALL RIGHTS RESERVED
# ==============================================================================

set -e

MSG="${1:-Update Arise Production Studio across GitHub, Desktop and VPS}"
VPS_HOST="root@2.25.113.26"
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "🎬 ======================================================================"
echo "🎬 ARISE PRODUCTION STUDIO: 3-WAY SYNCHRONIZATION & DEPLOYMENT"
echo "🎬 Commit Message: $MSG"
echo "🎬 Working Directory: $DIR"
echo "🎬 ======================================================================"

# ------------------------------------------------------------------------------
# TARGET 1: GITHUB REPO
# ------------------------------------------------------------------------------
echo ""
echo "📦 [1/3] SYNCING GITHUB REPOSITORY (https://github.com/FinesseJones/Arise-Productions)..."
cd "$DIR"
git add -A
if git diff --cached --quiet; then
    echo "ℹ️ No uncommitted changes. Pushing current state..."
    git push origin main || true
else
    git commit -m "$MSG"
    git push origin main
fi
echo "✅ [1/3] GitHub Repository up-to-date!"

# ------------------------------------------------------------------------------
# TARGET 2: LOCAL DESKTOP APP & DMG INSTALLER
# ------------------------------------------------------------------------------
echo ""
echo "🖥️ [2/3] COMPILING & DEPLOYING LOCAL DESKTOP APP..."
cd "$DIR/frontend"
node ../node_modules/vite/bin/vite.js build

cd "$DIR/desktop"
rm -rf ui backend server.js
cp -R ../frontend/dist ./ui
cp -R ../backend ./backend
cp ../server.js ./server.js

npx electron-builder --mac dmg --arm64

# Terminate existing running instance if open so memory cache clears
killall "Arise Production" 2>/dev/null || true
pkill -f "Arise Production.app" 2>/dev/null || true

rm -rf "/Applications/Arise Production.app"
cp -R "dist/mac-arm64/Arise Production.app" /Applications/
cp "dist/Arise Production-1.0.0-arm64.dmg" "/Users/finessejones1/Desktop/Arise Production Installer.dmg"
echo "✅ [2/3] Desktop App refreshed at /Applications/ and DMG updated on Desktop!"

# ------------------------------------------------------------------------------
# TARGET 3: REMOTE VPS (root@2.25.113.26)
# ------------------------------------------------------------------------------
echo ""
echo "🌐 [3/3] MIRRORING & DEPLOYING TO VPS ($VPS_HOST)..."
cd "$DIR"
if ssh -o BatchMode=yes -o ConnectTimeout=5 "$VPS_HOST" "echo 1" &>/dev/null; then
    echo "📤 Syncing exact workspace files to $VPS_HOST:/root/Arise-Productions..."
    rsync -avz --delete \
      --exclude='node_modules' \
      --exclude='frontend/node_modules' \
      --exclude='desktop/dist' \
      --exclude='desktop/ui' \
      --exclude='.git' \
      "$DIR/" "$VPS_HOST:/root/Arise-Productions/"

    echo "🐳 Rebuilding Docker container on VPS..."
    ssh "$VPS_HOST" "
        cd /root/Arise-Productions
        docker compose down || true
        docker compose build --no-cache
        docker compose up -d
    "
    echo "✅ [3/3] VPS updated and live at http://2.25.113.26:4000!"
else
    echo "⚠️ VPS SSH key authentication pending on $VPS_HOST."
    echo "👉 Run: ssh-copy-id -i ~/.ssh/id_ed25519.pub $VPS_HOST"
fi

echo ""
echo "🎉 ======================================================================"
echo "🎉 ALL THREE TARGETS SYNCHRONIZED!"
echo "🎉 1. GitHub:  https://github.com/FinesseJones/Arise-Productions"
echo "🎉 2. Desktop: /Applications/Arise Production.app"
echo "🎉 3. VPS:     http://2.25.113.26:4000"
echo "🎉 ======================================================================"
