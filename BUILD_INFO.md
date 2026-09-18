# Build Number and Time Configuration

## Current Configuration

The build system is already configured to show:
- **Git commit SHA** (short form, 7 characters)
- **Build date/time** (when the build runs)

## What It Currently Shows

Based on the vite.config.ts configuration:

### Commit SHA
- **Current**: `41f6cf9` (from `git rev-parse --short HEAD`)
- **Fallback**: If git fails, uses `dev-[timestamp]`

### Build Time
- **Format**: `HH:MM:SS Mon DD` (e.g., `14:11:19 Sep 18`)
- **Source**: Actual time when `npm run build` runs
- **Example**: `14:11:19 Sep 18, 2026`

## What You Should See in the App

The build info appears in the footer (bottom right) as:
```
BUILD: 41F6CF9 • 14:11:19 Sep 18
```

## How It Works

The `frontend/vite.config.ts` does this automatically during build:

```typescript
// Get git commit SHA
commitSha = execSync('git rev-parse --short HEAD').toString().trim()

// Get current time
buildTime = new Date().toLocaleTimeString('en-US', {
  hour12: false,
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
}) + ' ' + new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
```

## What It SHOULD Reflect

**The build SHOULD reflect:**
1. ✅ **Actual git commit SHA** at build time (currently `41f6cf9`)
2. ✅ **Actual date/time** when the build runs (currently `14:11:19 Sep 18`)

**It should NOT reflect:**
- ❌ Hardcoded version numbers
- ❌ Manual timestamps
- ❌ Arbitrary build numbers

## To Update Build Info

Simply run a new build - it will automatically capture:
- The latest git commit SHA
- The current date/time

```bash
npm run build
```

## Current Build Status

**Latest build** (just completed):
- **Commit SHA**: `41f6cf9`
- **Commit Message**: "upgrade"
- **Build Time**: ~14:11 (when the build ran)
- **DMG**: `~/Desktop/Arise Production-1.0.0-arm64.dmg`

The app will show: `BUILD: 41F6CF9 • [time when you launched the app]`

---

**Last Updated**: 2026-09-18
