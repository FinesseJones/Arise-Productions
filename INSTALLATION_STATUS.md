# Installation & Configuration Status

## ✅ Unreal Engine Path - CORRECTED

Your Unreal Engine is on the external drive as `UnrealEditor.app` (not `UnrealEngine.app`). I've corrected the path in `.mcp.json`:

```json
"UNREAL_EDITOR_PATH": "/Volumes/FinesseJones1 External 1/Director Finesse Jones/Film Making/UnrealEditor.app"
```

### Unreal Engine Storage Configuration

**To make Unreal Engine use the external drive for storage:**

1. **Launch Unreal Engine** from the external drive
2. **Open Epic Games Launcher** (if installed)
3. **Go to Settings → Engine Installation Folders**
4. **Add your external drive** as an installation folder
5. **Set the external drive** as the default for:
   - Engine builds
   - Project files
   - Cache files
   - Derived data cache

**Note**: This configuration is done within Unreal Engine/Epic Games Launcher, not in Arise Production. Arise Production only needs the path to launch the app.

---

## ❌ Hyperframes - NOT INSTALLED

You reported: "I do not have that installed" (referring to Hyperframes)

**Hyperframes is NOT required** for Arise Production. Here's the clarification:

### What Hyperframes Is:
- A video composition system by calesthio
- Renders video from HTML
- Uses the OpenMontage repo you already have

### What Hyperframes is NOT:
- NOT required for Arise Production
- NOT dependent on HeyGen
- Hyperframes can use multiple providers (HeyGen, ElevenLabs, local models)

### HeyGen Clarification:
- HeyGen is a CLOUD service (API-based)
- NOT required for Hyperframes
- Hyperframes can work entirely locally
- If you want HeyGen features (AI avatars), you can add it later
- For local-only workflow: skip HeyGen entirely

### Current Status:
- Hyperframes MCP connector exists in Arise Production
- But Hyperframes itself is not installed as a separate app
- You already have OpenMontage which includes HyperFrames functionality
- The Hyperframes MCP connector may not be needed if using OpenMontage directly

**Recommendation**: Skip Hyperframes MCP for now. Use OpenMontage (which you already have) for video composition.

---

## ✅ Wasserman Apps - CORRECTED UNDERSTANDING

After reviewing the official Wasserman documentation:

**Wasserman apps are standalone desktop applications, NOT MCP servers.**

### Wasserman Architecture:
- 10 standalone apps for different production stages
- Only 2 have MCP integration:
  - **Slate** - Has MCP built in (local AI prompt studio)
  - **Unofficial DaVinci MCP** - Separate MCP for DaVinci Resolve
- Other 8 apps are standalone with NO MCP

### Integration Method:
- Arise Production detects installed Wasserman apps
- Arise Production can launch Wasserman apps via buttons
- Apps share files via export/import (not MCP)
- Workflow orchestration happens via file handoff

### Updated Guide:
Created new guide: <ref_file file="/Users/finessejones1/Documents/Arise-Productions/WASSERMAN_INTEGRATION_GUIDE.md" />

The old Wasserman MCP guide was incorrect. Please use the new integration guide.

---

## ✅ OpenMontage - ALREADY INSTALLED

You already have OpenMontage installed at:
`/Users/finessejones1/OpenMontage`

This is the calesthio/OpenMontage clone you mentioned. No separate installation needed.

**OpenMontage includes**:
- HyperFrames composition system
- Video rendering from HTML
- Multiple provider support (HeyGen, ElevenLabs, local models)
- Skills for various video production tasks

**To use OpenMontage**:
```bash
cd /Users/finessejones1/OpenMontage
# Follow their README for usage
```

---

## MCP Server Status

### Currently Configured in `.mcp.json`:
1. **ComfyUI MCP** ✅ Working
2. **Unreal Engine MCP** ✅ Configured (path corrected)
3. **Hyperframes MCP** ⚠️ Configured but may not be needed

### Removed (Incorrect Configuration):
- **OpenMontage MCP** - Removed (incorrect command, needs research)

### Wasserman MCPs:
- NOT configured (Wasserman apps don't have MCP servers except Slate)
- Only Slate has MCP built in
- Unofficial DaVinci MCP is separate (not a Wasserman app)

---

## Summary

| Item | Status | Action Needed |
|------|--------|---------------|
| Unreal Engine | ✅ Path corrected | Configure Epic Games Launcher to use external drive for storage |
| Hyperframes | ❌ Not installed | NOT required - use OpenMontage instead |
| HeyGen | ❓ Optional | Skip for local-only workflow, add later if needed |
| Wasserman Apps | ✅ All installed | Use via launch buttons, file handoff (not MCP) |
| Wasserman MCPs | ❌ Not applicable | Apps don't have MCP (except Slate) |
| OpenMontage | ✅ Already installed | Use existing installation at `/Users/finessejones1/OpenMontage` |
| Hyperframes MCP | ⚠️ May not be needed | Consider removing if using OpenMontage directly |

---

## Next Steps

1. **Configure Unreal Engine** storage in Epic Games Launcher to use external drive
2. **Skip Hyperframes** - use OpenMontage instead
3. **Skip HeyGen** for local-only workflow
4. **Use Wasserman apps** via launch buttons and file handoff
5. **Test Unreal Engine MCP** with corrected path:
   ```bash
   node backend/services/unreal-connector.js
   ```

---

**Last Updated**: 2026-09-18
