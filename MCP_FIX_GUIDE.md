# MCP Fix & Configuration Guide

## Terminal Command Errors - CORRECTED COMMANDS

The commands I gave you included `#` comments which you copied as part of the command. Here are the CLEAN commands:

### Unreal Engine MCP
```bash
node backend/services/unreal-connector.js
```

### Hyperframes MCP
```bash
node backend/services/hyperframes-connector.js
```

### OpenMontage MCP (CORRECTED)
The previous command was wrong. OpenMontage IS installed at `/Users/finessejones1/OpenMontage` but the MCP command needs to be determined from their documentation.

---

## Unreal Engine Path Update

I updated the path in `.mcp.json` from:
- OLD: `/Volumes/FinesseJones1 External 1/Director Finesse Jones/Film Making/UnrealEditor.app`
- NEW: `/Volumes/FinesseJones1 External 1/Director Finesse Jones/Film Making/UnrealEngine.app`

**BUT**: You need to FIRST move Unreal Engine to your external drive, then update the path to match the actual location.

### Steps to Move Unreal Engine:
1. Open Finder
2. Navigate to current Unreal Engine location
3. Move `UnrealEditor.app` to your external drive
4. Update the path in `.mcp.json` to match the new location
5. Test with the Unreal Engine MCP connector

---

## OpenMontage Status

OpenMontage IS installed as a standalone repo at `/Users/finessejones1/OpenMontage` (calesthio/OpenMontage clone).

The MCP command I gave was incorrect. The actual OpenMontage MCP command needs to be determined from their documentation. Let me check their setup.