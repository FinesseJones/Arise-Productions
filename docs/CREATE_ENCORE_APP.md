# Create Encore App - Step by Step

You're authenticated with Encore! Now let's create your app.

## Method 1: Web Interface (Easiest)

1. **Open in browser:** https://app.encore.cloud/create-app

2. **Click "Create new app"**

3. **Fill in details:**
   - **App name:** `unified-3d-production-studio`
   - **Choose:** "Empty app" or "From template"

4. **After creation, you'll see your App ID** (like `unified-3d-production-studio-abcd`)

5. **Update your backend:**
   ```bash
   cd /Applications/Coding/Unified-3D-Production-Studio/backend
   echo '{"id": "YOUR-APP-ID-HERE", "lang": "typescript"}' > encore.app
   ```

6. **Start Encore:**
   ```bash
   export PATH="/Users/finessejones1/.encore/bin:$PATH"
   encore run
   ```

## Method 2: Terminal (Interactive)

Run this in a NEW Terminal window (not in this chat):

```bash
cd /Applications/Coding/Unified-3D-Production-Studio/backend
rm encore.app
export PATH="/Users/finessejones1/.encore/bin:$PATH"
encore app create
```

Follow the prompts to:
- Enter app name: `unified-3d-production-studio`
- Confirm creation

The `encore.app` file will be created automatically.

## After Creating the App

Run these commands:

```bash
cd /Applications/Coding/Unified-3D-Production-Studio/backend
export PATH="/Users/finessejones1/.encore/bin:$PATH"

# Start locally
encore run

# Or deploy to cloud
git add .
git commit -m "Initial deployment"
git push encore
```

## Need the App ID?

If you created the app via web interface, find your App ID at:
https://app.encore.cloud/

Look for your app `unified-3d-production-studio` in the dashboard.

---

**Current Status:**
- ✅ Authenticated: `lady-stock-alias-glad`
- ⏳ Waiting for app creation
- 📍 Location: https://app.encore.cloud/create-app
