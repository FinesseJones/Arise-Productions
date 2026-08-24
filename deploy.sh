#!/usr/bin/env bash
# ==============================================================================
# ARISE PRODUCTION STUDIO - 1-CLICK AUTOMATED VPS DEPLOYMENT SCRIPT
# THE AI CONTENT FOUNDRY, LLC • © 2026 • ALL RIGHTS RESERVED
# ==============================================================================

set -e

echo "🎬 ======================================================================"
echo "🎬 ARISE PRODUCTION STUDIO - VPS DEPLOYMENT ENGINE"
echo "🎬 © 2026 THE AI CONTENT FOUNDRY, LLC"
echo "🎬 ======================================================================"

# 1. Check Git
if ! command -v git &> /dev/null; then
    echo "❌ Git is required. Installing git..."
    if command -v apt-get &> /dev/null; then
        sudo apt-get update && sudo apt-get install -y git
    fi
fi

# 2. Check if Docker is available
if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
    echo "🐳 Docker & Docker Compose detected! Deploying via Container..."
    docker-compose down || true
    docker-compose build --no-cache
    docker-compose up -d
    echo "✅ Docker Container deployed successfully!"
elif command -v docker &> /dev/null && docker compose version &> /dev/null; then
    echo "🐳 Docker Compose (plugin) detected! Deploying via Container..."
    docker compose down || true
    docker compose build --no-cache
    docker compose up -d
    echo "✅ Docker Container deployed successfully!"
else
    # 3. Fallback: Deploy via Node.js / PM2
    echo "📦 Deploying via Node.js Native Runtime..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        echo "📥 Node.js not detected. Installing Node.js 20 LTS..."
        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
        sudo apt-get install -y nodejs
    fi

    # Install root dependencies
    echo "📥 Installing backend dependencies..."
    npm install --omit=dev

    # Install frontend dependencies and build SPA
    echo "🔨 Building frontend bundle..."
    cd frontend && npm install && npm run build && cd ..

    # Start or restart via PM2
    if command -v pm2 &> /dev/null; then
        echo "🚀 Restarting via PM2..."
        pm2 reload ecosystem.config.cjs || pm2 start ecosystem.config.cjs
        pm2 save
    else
        echo "📥 Installing PM2 process manager globally..."
        sudo npm install -g pm2
        pm2 start ecosystem.config.cjs
        pm2 save
        pm2 startup || true
    fi
    echo "✅ Node.js server deployed successfully via PM2!"
fi

# Get Public IP
PUBLIC_IP=$(curl -s -4 ifconfig.me || curl -s -4 icanhazip.com || echo "your-vps-ip")

echo ""
echo "🎉 ======================================================================"
echo "🎉 ARISE PRODUCTION STUDIO IS LIVE AND READY TO ACCESS ANYWHERE!"
echo "🎉 "
echo "🎉 👉 Open in any browser: http://${PUBLIC_IP}:4000"
echo "🎉 👉 WebSocket Endpoint:  ws://${PUBLIC_IP}:4000/ws"
echo "🎉 ======================================================================"
