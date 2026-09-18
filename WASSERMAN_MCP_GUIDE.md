# Wasserman Filmmaker Suite - Integration Guide

## ⚠️ IMPORTANT CORRECTION

**Wasserman apps do NOT have MCP servers.**

After reviewing the official Wasserman Filmmaker Suite documentation, the apps are standalone desktop applications. Only two MCP-related tools exist:

1. **Slate** - Has MCP built in (local AI prompt studio)
2. **Unofficial DaVinci MCP** - Separate MCP for DaVinci Resolve (not a Wasserman app)

All other Wasserman apps (ScriptBreak, Cork Board, Master Canvas, Blockout, Motion Previs Studio, Storyboard Reference Studio, Circle Take, Stem Studio, Call Sheet) are standalone apps with NO MCP integration.

---

## What Wasserman Apps Actually Are

1. **ScriptBreak** - Screenplay breakdown and prompt packs
2. **Cork Board** - Narrative structure on index cards
3. **Master Canvas** - Pre-production canvas
4. **Blockout** - 3D scene staging and motion reference export
5. **Motion Previs Studio** - Motion capture from footage
6. **Storyboard Reference Studio** - Reference-to-boards conversion
7. **Circle Take** - Dailies QC with local AI quality gates
8. **Stem Studio** - Audio stem separation
9. **Slate** - Prompt studio with local AI and MCP
10. **Unofficial DaVinci MCP** - Agent-driven DaVinci Resolve control

## Current Status

### Installed on Your System ✅
- ScriptBreak.app
- Cork Board.app
- Master Canvas.app
- Blockout.app
- Storyboard Reference Studio.app
- Circle Take.app
- Stem Studio.app

### Not Installed ❌
- Slate.app
- Motion Previs Studio.app
- Call Sheet.app

## How to Use Wasserman MCPs

### Step 1: Start the MCP Server

Each Wasserman app has its own MCP server. To use them:

1. **Launch the Wasserman app** (e.g., ScriptBreak.app)
2. **Check the MCP documentation** in the app's menu or documentation
3. **Note the MCP server configuration** (command, args, env variables)

### Step 2: Configure MCP in Arise Production

Add the MCP server to your `.mcp.json` file:

```json
{
  "mcpServers": {
    "scriptbreak-mcp": {
      "command": "/Applications/ScriptBreak.app/Contents/MacOS/scriptbreak-mcp",
      "args": [],
      "env": {},
      "optional": true
    }
  }
}
```

### Step 3: Connect via Arise Production

1. Open Arise Production
2. Click the **"Tools"** button in the navigation bar
3. Open the **Tool Detection Panel**
4. The MCP server will be detected if running
5. Use the **MCP Health Check** to verify connection

### Step 4: Use MCP Tools

Once connected, you can:

- **Call MCP tools** via the backend API
- **Automate workflows** using agent commands
- **Exchange data** between Arise Production and Wasserman tools

## Individual MCP Setup

### ScriptBreak MCP
```json
{
  "scriptbreak-mcp": {
    "command": "/Applications/ScriptBreak.app/Contents/MacOS/scriptbreak-mcp",
    "optional": true
  }
}
```

### Cork Board MCP
```json
{
  "corkboard-mcp": {
    "command": "/Applications/Cork Board.app/Contents/MacOS/corkboard-mcp",
    "optional": true
  }
}
```

### Master Canvas MCP
```json
{
  "mastercanvas-mcp": {
    "command": "/Applications/Master Canvas.app/Contents/MacOS/mastercanvas-mcp",
    "optional": true
  }
}
```

### Blockout MCP
```json
{
  "blockout-mcp": {
    "command": "/Applications/Blockout.app/Contents/MacOS/blockout-mcp",
    "optional": true
  }
}
```

### Storyboard Reference Studio MCP
```json
{
  "storyboard-mcp": {
    "command": "/Applications/Storyboard Reference Studio.app/Contents/MacOS/storyboard-mcp",
    "optional": true
  }
}
```

### Circle Take MCP
```json
{
  "circletake-mcp": {
    "command": "/Applications/Circle Take.app/Contents/MacOS/circletake-mcp",
    "optional": true
  }
}
```

### Stem Studio MCP
```json
{
  "stemstudio-mcp": {
    "command": "/Applications/Stem Studio.app/Contents/MacOS/stemstudio-mcp",
    "optional": true
  }
}
```

## Launching Wasserman Apps from Arise Production

The Tool Detection Panel shows installed Wasserman apps and provides launch buttons:

1. Open Arise Production
2. Click **"Tools"** in the navigation bar
3. View the **Tool Detection Panel**
4. Click the **"Launch"** button next to any Wasserman app

## Troubleshooting

### MCP Server Not Detected
- Ensure the Wasserman app is running
- Check that the MCP server is enabled in the app's settings
- Verify the MCP command path is correct in `.mcp.json`

### MCP Health Check Fails
- Check that the MCP server is responding
- Verify environment variables are set correctly
- Check network/firewall settings

### App Won't Launch
- Verify the app is installed in `/Applications/`
- Check file permissions
- Try launching the app manually first

## Next Steps

1. **Install missing Wasserman apps** (Slate, Motion Previs Studio, Call Sheet)
2. **Configure MCP servers** for installed apps
3. **Test MCP connections** using the Tool Detection Panel
4. **Integrate MCP tools** into your production workflows

## References

- Wasserman Filmmaker Suite: https://github.com/wassermanproductions/wassermans-filmmaker-suite
- MCP Documentation: https://modelcontextprotocol.io
