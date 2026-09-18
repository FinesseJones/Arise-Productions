# MCP & Wasserman Apps Status Report

## ✅ Terminal Commands - CORRECTED

The terminal commands I gave included `#` comments which caused errors. Here are the CLEAN commands:

### Unreal Engine MCP
```bash
node backend/services/unreal-connector.js
```

### Hyperframes MCP
```bash
node backend/services/hyperframes-connector.js
```

**Note**: Run these from the Arise-Productions directory, not from the OpenMontage directory.

---

## ✅ Unreal Engine Path - Updated but Awaiting Your Move

I updated the path in `.mcp.json` to:
- `/Volumes/FinesseJones1 External 1/Director Finesse Jones/Film Making/UnrealEngine.app`

**YOU MUST FIRST**:
1. Move Unreal Engine to your external drive
2. Then update the path in `.mcp.json` to match the actual location
3. Test with the Unreal Engine MCP connector

---

## ❌ OpenMontage MCP - REMOVED (Incorrect Configuration)

I removed the OpenMontage MCP from `.mcp.json` because:
- The MCP command I gave was incorrect
- OpenMontage IS installed at `/Users/finessejones1/OpenMontage`
- But OpenMontage may not have an MCP server, or it uses a different setup
- Need to check OpenMontage documentation for actual MCP configuration

**Status**: OpenMontage is installed but MCP configuration needs research.

---

## ✅ Wasserman Apps - ALL INSTALLED in /Applications/

All 7 Wasserman apps are installed:
- ✅ Blockout.app
- ✅ Circle Take.app
- ✅ Cork Board.app
- ✅ Master Canvas.app
- ✅ Motion Previs Studio v4.app
- ✅ ScriptBreak.app
- ✅ Storyboard Reference Studio.app
- ✅ Whisper Transcription.app (bonus)

### Wasserman MCP Configuration Status

**CURRENT STATUS**: NOT CONFIGURED

The Wasserman guide I created was based on the assumption that each app has an MCP server. However:

**YOU REPORTED**: "I see Blockout but no settings to click on and get the mcp info"

This suggests:
- The Wasserman apps may NOT have MCP servers
- OR the MCP info is hidden/not obvious
- OR the MCP setup is different than documented

**NEXT STEPS**:
1. Launch each Wasserman app
2. Check Settings/Preferences for MCP configuration
3. Check the app's documentation
4. Determine if MCP is actually available
5. If NO MCP: Remove Wasserman MCP section from documentation
6. If YES MCP: Configure in `.mcp.json`

---

## ❓ HeyGen - Decision Needed

You asked: "not sure if I need to have heygen installed"

**HeyGen Status**:
- HeyGen is a CLOUD service (API-based)
- NOT a local desktop app
- NO installation needed on your machine
- Works via API calls to `api.heygen.com`

**Do you need HeyGen?**
- HeyGen provides: AI avatars, video generation, voice cloning, lip-sync
- Useful for: Marketing videos, explainer videos, talking head videos
- Alternative: Use local tools (Remotion, FFmpeg) for video generation

**Recommendation**:
- If you want AI avatars: Set up HeyGen API key
- If you want local-only: Skip HeyGen, use Remotion/FFmpeg
- Current status: HeyGen NOT configured in Arise Production

---

## Summary

| Item | Status | Action Needed |
|------|--------|---------------|
| Unreal Engine MCP | ⚠️ Path updated, awaiting move | Move Unreal Engine to external drive |
| Hyperframes MCP | ✅ Configured | Start with: `node backend/services/hyperframes-connector.js` |
| OpenMontage MCP | ❌ Removed (incorrect) | Research actual MCP setup or skip |
| Wasserman Apps | ✅ All 7 installed | Check each app for MCP configuration |
| Wasserman MCPs | ❌ Not configured | Determine if MCP exists, then configure |
| ComfyUI MCP | ✅ Working | No action needed |
| HeyGen | ❓ Decision needed | Decide if AI avatars needed |

---

## Next Steps

1. **Move Unreal Engine** to external drive
2. **Test MCP commands** (without `#` comments):
   ```bash
   node backend/services/unreal-connector.js
   node backend/services/hyperframes-connector.js
   ```
3. **Check Wasserman apps** for MCP configuration:
   - Launch each app
   - Look in Settings/Preferences
   - Check documentation
4. **Decide on HeyGen** - do you need AI avatars?
5. **Report back** on Wasserman MCP availability

---

**Last Updated**: 2026-09-18
