# Encore Cloud Setup Guide

## Step 1: Create App on Encore Cloud

Since you're already logged in with GitHub, follow these steps:

### Via Web Interface (Recommended)

1. **Visit:** https://app.encore.cloud/create-app

2. **Choose:** "Import existing repository" or "Create from scratch"

3. **App Details:**
   - **App Name:** `unified-3d-studio` (or your preferred name)
   - **Repository:** Connect to your GitHub repository
   - **Framework:** TypeScript/Node.js backend

4. **After creation, you'll get an app ID** like `unified-3d-studio-abcd`

### Via Command Line (Alternative)

If you prefer the command line, run this in Terminal:

```bash
cd /Applications/Coding/Unified-3D-Production-Studio/backend
export PATH="/Users/finessejones1/.encore/bin:$PATH"
encore app init
```

This will:
- Prompt you for an app name
- Create the app on Encore Cloud
- Update the `encore.app` file with the new app ID

## Step 2: Update the encore.app File

Once you have your app ID from Step 1, update the file:

```bash
cd /Applications/Coding/Unified-3D-Production-Studio/backend
echo '{"id": "YOUR-APP-ID-HERE", "lang": "typescript"}' > encore.app
```

Replace `YOUR-APP-ID-HERE` with your actual app ID.

## Step 3: Start Encore Backend

```bash
export PATH="/Users/finessejones1/.encore/bin:$PATH"
cd /Applications/Coding/Unified-3D-Production-Studio/backend
encore run
```

## Step 4: Deploy to Encore Cloud

```bash
cd /Applications/Coding/Unified-3D-Production-Studio/backend
git add .
git commit -m "Initial Encore Cloud deployment"
git remote add encore encore://YOUR-APP-ID-HERE
git push encore
```

## Current Status

✅ Encore CLI installed at `/Users/finessejones1/.encore/bin/encore`
✅ Logged in with GitHub account
⏳ Waiting for app creation on Encore Cloud

## Need Help?

If you encounter issues:
1. Check https://encore.dev/docs/deploy/deploying
2. Ensure your backend code follows Encore patterns
3. Run `encore auth whoami` to verify authentication
