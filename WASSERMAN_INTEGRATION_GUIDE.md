# Wasserman Filmmaker Suite - Integration Guide

## ⚠️ IMPORTANT CORRECTION

**Wasserman apps do NOT have MCP servers.**

After reviewing the official Wasserman Filmmaker Suite documentation, the apps are standalone desktop applications. Only two MCP-related tools exist:

1. **Slate** - Has MCP built in (local AI prompt studio)
2. **Unofficial DaVinci MCP** - Separate MCP for DaVinci Resolve (not a Wasserman app)

All other Wasserman apps (ScriptBreak, Cork Board, Master Canvas, Blockout, Motion Previs Studio, Storyboard Reference Studio, Circle Take, Stem Studio, Call Sheet) are standalone apps with NO MCP integration.

---

## Wasserman Filmmaker Suite Overview

**Ten tools for AI-native filmmaking — from the script to the final mix.**

The Wasserman Filmmaker Suite consists of standalone desktop applications that work together to cover the entire script-to-post workflow:

1. **ScriptBreak** - Script breakdown: scenes, elements, bibles, shot lists, prompt packs
2. **Cork Board** - Story structure: index cards on a wall, acts, arcs, outlines
3. **Master Canvas** - Pre-production planning: prompts, boards, assets
4. **Blockout** - Scene staging: camera choreography, motion reference export
5. **Motion Previs Studio** - Motion capture from footage: pose extraction, camera solve
6. **Storyboard Reference Studio** - Reference to boards: shots, animatics, prompts
7. **Slate** - Prompt studio: local AI assistance, MCP built in
8. **Circle Take** - Dailies QC: local quality gates, selects, reshoot lists
9. **Stem Studio** - Audio separation: dialogue, music, effects stems
10. **Call Sheet** - Suite launcher: menu bar launcher for all apps
11. **Unofficial DaVinci MCP** - DaVinci Resolve MCP (separate tool)

**Installation**:
```bash
curl -fsSL https://raw.githubusercontent.com/wassermanproductions/wassermans-filmmaker-suite/main/install.sh | bash
```

---

## How to Use Wasserman Apps with Arise Production

Since Wasserman apps are standalone desktop applications (not MCP servers), the integration with Arise Production is via:

1. **Tool Detection** - Arise Production detects installed Wasserman apps
2. **Launch Integration** - Arise Production can launch Wasserman apps via buttons
3. **File Handoff** - Apps can share files (export from one, import to another)
4. **Workflow Orchestration** - Arise Production coordinates the production pipeline

### Step 1: Tool Detection

Arise Production's Tool Detection Panel automatically detects installed Wasserman apps:
- ✅ ScriptBreak.app
- ✅ Cork Board.app
- ✅ Master Canvas.app
- ✅ Blockout.app
- ✅ Motion Previs Studio v4.app
- ✅ Storyboard Reference Studio.app
- ✅ Circle Take.app
- ✅ Stem Studio.app
- ✅ Call Sheet.app (if installed)
- ✅ Slate.app (if installed)

### Step 2: Launch Integration

1. Open Arise Production
2. Click "Tools" in the navigation bar
3. View the Tool Detection Panel
4. Click "Launch" button next to any Wasserman app

### Step 3: File Handoff Workflow

Example production pipeline:

1. **ScriptBreak** → Export script breakdown → Import to **Cork Board**
2. **Cork Board** → Export scene list → Import to **Master Canvas**
3. **Master Canvas** → Export prompt package → Import to **Slate**
4. **Slate** → Export prompts → Use with video generators
5. **Blockout** → Export motion reference → Use with Seedance/Veo/Kling
6. **Motion Previs Studio** → Export motion data → Import to **Blockout**
7. **Storyboard Reference Studio** → Export animatics → Use as reference
8. **Circle Take** → Import generated takes → QC and select
9. **Stem Studio** → Import audio → Separate stems
10. **Unofficial DaVinci MCP** → Import footage → Edit in DaVinci Resolve

---

## MCP Integration (Only 2 Tools)

### Slate MCP

Slate has MCP built in for local AI assistance. To configure:

1. Install Slate.app
2. Launch Slate
3. Configure Slate's MCP settings (per Slate documentation)
4. Slate's MCP works with local models (Claude Code, Codex, Ollama, LM Studio, vLLM)

### Unofficial DaVinci MCP

This is a separate MCP for DaVinci Resolve, not a Wasserman app. Configuration:
- See: https://github.com/wassermanproductions/unofficial-davinci-mcp
- Allows AI agents to run DaVinci Resolve operations
- Works with Resolve Studio and free edition

---

## Launching Wasserman Apps from Arise Production

The Tool Detection Panel shows installed Wasserman apps and provides launch buttons:

1. Open Arise Production
2. Click **"Tools"** in the navigation bar
3. View the **Tool Detection Panel**
4. Click the **"Launch"** button next to any Wasserman app

---

## Troubleshooting

### App Won't Launch
- Verify the app is installed in `/Applications/`
- Check file permissions
- Try launching the app manually first

### File Handoff Not Working
- Check export format from source app
- Check import format in destination app
- Verify file paths are accessible

### Workflow Gaps
- Review each app's documentation for supported formats
- Check version compatibility between apps
- Use Call Sheet to manage app versions and updates

---

## Next Steps

1. **Install missing Wasserman apps** (Slate, Call Sheet)
2. **Configure Slate MCP** if using local AI assistance
3. **Install Unofficial DaVinci MCP** if using DaVinci Resolve
4. **Test file handoff** between apps
5. **Integrate workflow** into Arise Production pipeline

---

## References

- Wasserman Filmmaker Suite: https://github.com/wassermanproductions/wassermans-filmmaker-suite
- Wasserman Installation: https://raw.githubusercontent.com/wassermanproductions/wassermans-filmmaker-suite/main/install.sh
- Unofficial DaVinci MCP: https://github.com/wassermanproductions/unofficial-davinci-mcp
- MCP Documentation: https://modelcontextprotocol.io
