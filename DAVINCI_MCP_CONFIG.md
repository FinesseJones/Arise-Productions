# unofficial-davinci-mcp Configuration - FIXED

## ✅ Problem: Python Path Issue

The `unofficial-davinci-mcp` was installed via pip into the pipx langflow virtual environment, not the system Python. That's why:
- `python -m unofficial_davinci_mcp` failed (command not found)
- `python3 -m unofficial_davinci_mcp` failed (module not found)

## ✅ Solution: Configured Correct Path in .mcp.json

I've configured the MCP to use the correct Python path where the package is actually installed:

```json
"davinci-mcp": {
  "command": "/Users/finessejones1/.local/pipx/venvs/langflow/bin/python",
  "args": ["-m", "unofficial_davinci_mcp"],
  "optional": true
}
```

## What unofficial-davinci-mcp Does

**Controls your licensed DaVinci Resolve** via the Resolve API with 37 tools:

### Capabilities (both Studio and Free Edition)
- **Reference color matching** - Match clips to reference, bake .cube LUTs
- **Beat-aware music cutting** - Cut music to length on musical boundaries
- **Dialogue tightening** - Detect dead air, return cut plan
- **Loudness measurement** - EBU R128 LUFS, loudness range, true-peak
- **Mix planning** - Dialogue normalize + music bed + ducking
- **Timeline assembly** - Validate edit plans, snap to beat grid
- **FCPXML/EDL generation** - Import into Resolve in one action
- **Marker generation** - CSV marker manifests

### Studio-Only Features (Live Control)
- **Project summary** - Read current project, timelines, markers
- **Render status** - Check render progress and queue
- **Import media** - Import into media pool
- **Create timeline** - Build timeline in the app
- **Append to timeline** - Add clips to active timeline
- **Add markers** - Add markers to timeline
- **Apply LUT** - Apply .cube LUT to clips
- **Set grade** - Set ASC CDL grade on clips
- **Render** - Configure and start render jobs

## Two Tiers, Auto-Detected

The MCP detects at startup whether it can drive:
- **DaVinci Resolve Studio** (live) - Drives the running app via scripting API
- **Free Resolve / not running** (interchange) - Writes files you import in one action

## Requirements

1. **DaVinci Resolve** (Studio or Free) must be installed
2. **ffmpeg** must be on PATH (`brew install ffmpeg`)
3. **DaVinci Resolve must be running** for live Studio features

## How to Use

1. **Start DaVinci Resolve** (launch the app)
2. **The MCP will auto-detect** the tier (Studio vs Free)
3. **Call `resolve_capabilities` first** to verify setup
4. **Use the 37 tools** to control Resolve

## Example Workflow

> *"Cut these clips to the music, give it a warm look, and set dialogue at −16 LUFS."*

The MCP would:
1. `resolve_capabilities` - Check tier and setup
2. `probe_media` - Analyze media files
3. `beat_grid` - Find tempo and beats
4. `assemble_edit` - Validate edit plan
5. `generate_fcpxml` - Write timeline (or `resolve_create_timeline` on Studio)
6. `color_match` - Match to reference, bake LUT
7. `mix_plan` - Plan dialogue normalize + music + ducking

## Current MCP Configuration Status

| MCP | Status | Controls |
|-----|--------|----------|
| **comfy-mcp** | ✅ Working | ComfyUI |
| **unreal-engine-mcp** | ✅ Configured | Unreal Engine |
| **hyperframes-mcp** | ✅ Configured | Hyperframes |
| **slate-mcp** | ✅ Configured | Slate app |
| **davinci-mcp** | ✅ Configured | DaVinci Resolve |

---

## Next Steps

1. **Start DaVinci Resolve** (Studio or Free)
2. **Test the MCP** by calling `resolve_capabilities`
3. **Verify ffmpeg is on PATH**: `which ffmpeg`
4. **Test a simple operation** like `probe_media`

---

**Last Updated**: 2026-09-18
