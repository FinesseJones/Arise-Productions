# Unreal Engine & OpenMontage Solutions

## 🔴 Unreal Engine Space Issue - DIAGNOSED

### The Problem
Your external drive has **952GB free** (correct), but Epic Games Launcher is trying to install to:
```
/Volumes/FinesseJones1 External 1/Projects/Projects In Progress/UE_5.7
```

This specific folder only has **15GB available** because it's on a different partition or the folder is full with other projects.

### Solution: Change Unreal Engine Installation Location

**In Epic Games Launcher:**

1. Open Epic Games Launcher
2. Click **Settings** (gear icon, top right)
3. Go to **Engine Installation Folders**
4. **Add a new folder** on your external drive with more space:
   - Click **Add**
   - Browse to: `/Volumes/FinesseJones1 External 1/Director Finesse Jones/Film Making/`
   - Or create a new folder: `/Volumes/FinesseJones1 External 1/UnrealEngine/`
5. **Set the new folder as default** for engine installations
6. **Retry the UE 5.7 installation**

### Alternative: Install to Your Film Making Folder

Since you already have many production tools in:
```
/Volumes/FinesseJones1 External 1/Director Finesse Jones/Film Making/
```

Use that folder for Unreal Engine:
1. In Epic Games Launcher → Settings → Engine Installation Folders
2. Add: `/Volumes/FinesseJones1 External 1/Director Finesse Jones/Film Making/UnrealEngine/`
3. Set as default
4. Install UE 5.7 there

### Note on Existing UnrealEditor.app

You already have `UnrealEditor.app` at:
```
/Volumes/FinesseJones1 External 1/Director Finesse Jones/Film Making/UnrealEditor.app
```

This might be an older version or a manual installation. The Epic Games Launcher is trying to install UE 5.7 to a different location.

**Decision**: Either:
- Use the existing UnrealEditor.app (update Arise Production path if needed)
- Or install UE 5.7 via Epic Games Launcher to the corrected location

---

## ✅ Unreal Editor Path - ALREADY CORRECT

The command you tried to run:
```bash
"UNREAL_EDITOR_PATH": "/Volumes/FinesseJones1 External 1/Director Finesse Jones/Film Making/UnrealEditor.app"
```

This is a **JSON configuration snippet**, not a shell command. That's why you got "command not found".

**The path is already correct** in `.mcp.json`:
```json
"UNREAL_EDITOR_PATH": "/Volumes/FinesseJones1 External 1/Director Finesse Jones/Film Making/UnrealEditor.app"
```

No changes needed there. The UnrealEditor.app IS at that location.

---

## ✅ OpenMontage - Already Installed as CLI Tool

### Why You Don't See an "App"

OpenMontage is **NOT a macOS .app file**. It's a:
- **Python-based CLI tool**
- **Git repository** at `/Users/finessejones1/OpenMontage`
- **Command-line tool** for video composition

### How to Use OpenMontage

OpenMontage is used via terminal commands:

```bash
cd /Users/finessejones1/OpenMontage

# Activate the virtual environment
source .venv/bin/activate

# Run OpenMontage commands
npx hyperframes --help
```

### OpenMontage Includes HyperFrames

OpenMontage already includes HyperFrames functionality. You don't need a separate HyperFrames installation.

### If You Want a GUI App

OpenMontage doesn't have a macOS .app GUI. It's a CLI tool. For a GUI experience:
- Use the OpenMontage CLI commands
- Or use Arise Production as the GUI that coordinates tools
- Or use the Wasserman apps (which are GUI apps)

---

## Summary

| Issue | Status | Solution |
|-------|--------|----------|
| Unreal Engine Space | 🔴 Folder-specific space issue | Change Epic Games Launcher installation folder to: `/Volumes/FinesseJones1 External 1/Director Finesse Jones/Film Making/UnrealEngine/` |
| Unreal Editor Path | ✅ Already correct | No changes needed in `.mcp.json` |
| OpenMontage "App" | ✅ It's a CLI tool, not an app | Use via terminal: `cd /Users/finessejones1/OpenMontage && source .venv/bin/activate` |

---

## Next Steps

1. **Open Epic Games Launcher**
2. **Change Engine Installation Folder** to your Film Making folder
3. **Retry UE 5.7 installation**
4. **Test Unreal Engine MCP** with the existing UnrealEditor.app
5. **Use OpenMontage** via terminal commands (it's a CLI tool, not an app)

---

**Last Updated**: 2026-09-18
