#!/bin/bash

# Encore Cloud Setup Script for Unified 3D Production Studio

echo "🎬 Encore Cloud Setup for Unified 3D Production Studio"
echo "======================================================"
echo ""

# Set PATH
export PATH="/Users/finessejones1/.encore/bin:$PATH"

cd /Applications/Coding/Unified-3D-Production-Studio/backend

echo "✅ You're logged in to Encore"
echo ""
echo "📱 Opening Encore Cloud in your browser..."
echo "   URL: https://app.encore.cloud/create-app"
echo ""

# Open browser
open https://app.encore.cloud/create-app

echo "Please follow these steps in the browser:"
echo ""
echo "1️⃣  Choose 'Import existing repository' or 'Create new app'"
echo "2️⃣  App Name: unified-3d-studio"
echo "3️⃣  Connect to your GitHub repository (optional)"
echo "4️⃣  Copy the App ID that gets generated"
echo ""
echo "After creating the app, come back here and paste your App ID:"
read -p "Enter your App ID: " APP_ID

echo ""
echo "📝 Updating encore.app file with App ID: $APP_ID"
echo "{\"id\": \"$APP_ID\", \"lang\": \"typescript\"}" > encore.app

echo ""
echo "✅ App configuration updated!"
echo ""
echo "🚀 Starting Encore backend locally..."
echo ""

encore run
