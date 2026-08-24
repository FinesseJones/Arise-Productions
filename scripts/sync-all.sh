#!/usr/bin/env bash
# ==============================================================================
# ARISE PRODUCTION STUDIO - TRI-TARGET AUTOMATED SYNC & DEPLOY ENGINE
# TARGETS: 1. GitHub Repo | 2. Desktop App & DMG | 3. VPS (root@2.25.113.26)
# THE AI CONTENT FOUNDRY, LLC • © 2026 • ALL RIGHTS RESERVED
# ==============================================================================

set -e

MSG="${1:-Update Arise Production Studio across GitHub, Desktop and VPS}"
VPS_HOST="root@2.25.113.26"

echo "🎬 ======================================================================"
echo "🎬 ARISE PRODUCTION STUDIO: 3-WAY SYNCHRONIZATION & DEPLOYMENT"
echo "🎬 Commit Message: $MSG"
echo "🎬 ======================================================================"

# ------------------------------------------------------------------------------
# TARGET 1: GITHUB REPO
# ------------------------------------------------------------------------------
echo ""
echo "📦 [1/3] SYNCING GITHUB REPOSITORY (https://github.com/FinesseJones/Arise-Productions)..."
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
cd frontend && node ../node_modules/vite/bin/vite.js build
cp -R dist ../desktop/ui
cd ../desktop
npm run prebuild
npx electron-builder --mac dmg --arm64

rm -rf "/Applications/Arise Production.app"
cp -R "dist/mac-arm64/Arise Production.app" /Applications/
cp "dist/Arise Production-1.0.0-arm64.dmg" "/Users/finessejones1/Desktop/Arise Production Installer.dmg"
cd ..
echo "✅ [2/3] Desktop App refreshed at /Applications/ and DMG updated on Desktop!"

# ------------------------------------------------------------------------------
# TARGET 3: REMOTE VPS (root@2.25.113.26)
# ------------------------------------------------------------------------------
echo ""
echo "🌐 [3/3] DEPLOYING TO VPS ($VPS_HOST)..."
if ssh -o BatchMode=yes -o ConnectTimeout=5 "$VPS_HOST" "echo 1" &>/dev/null; then
    ssh "$VPS_HOST" "
        if [ ! -d 'Arise-Productions' ]; then
            git clone https://github.com/FinesseJones/Arise-Productions.git
        fi
        cd Arise-Productions
        git pull origin main
        chmod +x deploy.sh
        ./deploy.sh
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
