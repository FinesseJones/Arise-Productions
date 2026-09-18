# DaVinci Resolve & Slate MCP Configuration

## ✅ unofficial-davinci-mcp Installed

You successfully installed `unofficial-davinci-mcp` via pip with both extras:
- `unofficial-davinci-mcp[beats]` - For beat-synced cuts and music shortening
- `unofficial-davinci-mcp[voice]` - For voice-related features

This MCP can control your **licensed DaVinci Resolve** desktop app via the Resolve API.

## ✅ Slate MCP Configured

You also have `slate-mcp.mjs` which connects to the **Slate** app (prompt studio). I've added it to `.mcp.json`.

## Key Difference: Two Different MCPs for Two Different Apps

| MCP | Controls | Installed Via | Purpose |
|-----|----------|---------------|---------|
| **unofficial-davinci-mcp** | DaVinci Resolve | pip install Python package | AI-driven video editing in Resolve |
| **slate-mcp.mjs** | Slate app | Node.js script (file you have) | AI prompt studio for filmmaking |

---

## How unofficial-davinci-mcp Works with Your Licensed DaVinci Resolve

### What It Does
- **Controls your licensed DaVinci Resolve** via the Resolve API
- Performs: beat-synced cuts, music shortening, color matching, dialogue tightening, captions, loudness QC
- Works with **both Resolve Studio and free edition**
- Requires DaVinci Resolve to be running

### How to Configure

Since you installed it via pip, it's a Python module. To use it as an MCP server, you need to configure it in `.mcp.json`.

**Current status**: The pip installation installs the Python package, but to use it as an MCP server, you need to run it as a server.

**Check if it has an MCP server mode**:
```bash
python -m unofficial_davinci_mcp --help
```

If it has an MCP server mode, add it to `.mcp.json`. If not, you may need to use it differently (as a Python library called from a custom MCP server).

---

## How slate-mcp.mjs Works

### What It Does
- **Controls the Slate app** (prompt studio you just installed)
- Performs: list projects, get project, create project, list shots, get/set shot prompts, manage characters/locations/lookbook
- Requires Slate app to be running
- Connects via localhost control server

### Already Configured ✅
I've added it to `.mcp.json`:
```json
"slate-mcp": {
  "command": "node",
  "args": ["/Volumes/FinesseJones1 External 1/Archive/Downloads/slate-mcp.mjs"],
  "optional": true
}
```

### To Use:
1. Launch Slate.app (you just installed it)
2. Slate will start a localhost control server
3. The slate-mcp.mjs will connect to it
4. MCP tools will be available to control Slate

---

## Summary

| Tool | Status | What It Controls |
|------|--------|------------------|
| **Licensed DaVinci Resolve** | ✅ Installed on your system | Video editing software |
| **unofficial-davinci-mcp** | ✅ Installed via pip | Controls DaVinci Resolve via API |
| **Slate** | ✅ Installed via curl | AI prompt studio app |
| **slate-mcp.mjs** | ✅ Configured in .mcp.json | Controls Slate app |

---

## Next Steps

1. **Test unofficial-davinci-mcp**:
   ```bash
   python -m unofficial_davinci_mcp --help
   ```
   This will show if it has an MCP server mode.

2. **Configure unofficial-davinci-mcp** in `.mcp.json` (if it has MCP server mode)

3. **Test slate-mcp**:
   - Launch Slate.app
   - The MCP should connect automatically

4. **Start DaVinci Resolve** when using unofficial-davinci-mcp (it needs Resolve running)

---

**Last Updated**: 2026-09-18
