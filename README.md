# Arise Production Studio

**Version**: 1.0.0
**Status**: Production Tool Detection & UI Enhancement
**License**: UNLICENSED
**Author**: THE AI CONTENT FOUNDRY, LLC

---

## Overview

Arise Production Studio is a desktop-first production tool launcher and detection system for professional 4K 3D film production. It provides centralized access to local production tools, MCP server management, and enhanced UI for tool detection and health monitoring.

**IMPORTANT**: This is currently a tool detection and management shell, NOT a full video editing suite. Core production features (timeline, media bin, inspector) are implemented as components but not yet integrated into the UI.

---

## What Works ✅

### UI/UX Enhancements
- **4K Typography**: Optimized font sizes (14px-48px) for 4K displays
- **WCAG AA Contrast**: Professional dark mode with accessibility compliance
- **Viewport Controls**: 3D viewport mode, resolution, aspect ratio, grid/safe area controls
- **Advanced Viewport Features**: Safe area overlays, grid overlays, layer visibility/locking
- **Tool Detection Panel**: Real-time detection of installed production tools
- **Rendering Engine Selector**: Choose between Remotion and FFmpeg
- **Theme Presets**: 5 professional themes (auto-loads on startup, no UI to switch)
- **Keyboard Shortcuts Panel**: Shows shortcut list (UI only, shortcuts not functional)

### Navigation
- **13 Navigation Views**: Command Center, 3D Soundstage, Ideas, Tools, Plot, Cast, Acts, Beats, Campus, Screening, Suites, Vault, Distribution
- **Cross-Room Navigation**: Navigate between all production rooms
- **Dropdown Menu**: Access to additional views (Arise Cinema)

### Backend Integration
- **Tool Detection Service**: Detects FFmpeg, FFprobe, Remotion, ComfyUI, OpenMontage, Hyperframes, Unreal Engine
- **MCP Health Check**: Monitor MCP server status
- **API Endpoints**: 17 endpoints for tools, Remotion, and MCP operations
- **Remotion Integration**: Real Remotion API for programmatic rendering
- **Companion Mode**: Mobile companion architecture for desktop-hosted tools

### MCP Servers
- **ComfyUI MCP**: ✅ Connected and working
- **OpenMontage MCP**: Configured but not running
- **Unreal Engine MCP**: Configured but not running
- **Hyperframes MCP**: Configured but not running

---

## What Does NOT Work ❌

### Dead Code Components (Files Exist But Not Integrated)

The following components were created but are NOT integrated into the UI:

- **Timeline**: Professional timeline component - NOT integrated
- **MediaBin**: Asset management component - NOT integrated
- **InspectorPanel**: Property editing component - NOT integrated
- **DualMonitorSupport**: Multi-display management - NOT integrated
- **CustomLayout**: Panel arrangement system - NOT integrated
- **LazyLoad**: Performance optimization wrapper - NOT used
- **useKeyboardShortcuts**: Keyboard hook - NOT used
- **Design Tokens**: Design system - NOT used
- **Base Components**: Reusable UI library - NOT used

### Non-Functional Features

- **Keyboard Shortcuts**: UI panel exists but shortcuts don't actually work (hook not wired up)
- **Theme Switching**: Theme presets code exists but no UI to switch themes
- **Wasserman MCPs**: Guide written but no actual configuration in `.mcp.json`

### Missing Production Workflow

- No actual video editing capability (timeline not integrated)
- No asset management (media bin not integrated)
- No property editing (inspector not integrated)
- Cannot create production timeline
- Cannot manage media assets
- Cannot edit properties

---

## Installation

### Prerequisites

- macOS (Windows/Linux support planned)
- Node.js 18+
- Electron (installed via npm)
- Production tools (optional):
  - FFmpeg/FFprobe
  - Remotion
  - ComfyUI
  - OpenMontage
  - Hyperframes
  - Unreal Engine
  - Wasserman Filmmaker Suite apps

### Install Dependencies

```bash
npm install
npm install --prefix frontend
npm install --prefix backend
npm install --prefix desktop
```

### Build Desktop App

```bash
npm run desktop:build
```

This creates `desktop/dist/Arise Production-1.0.0-arm64.dmg`

### Install DMG

1. Open the DMG
2. Drag "Arise Production" to Applications
3. Launch from Applications folder

---

## Usage

### Launching the App

```bash
# Development mode
npm run dev

# Desktop mode
npm run desktop

# Backend server only
npm run server
```

### Tool Detection

1. Open Arise Production
2. Click "Tools" in the navigation bar
3. View the Tool Detection Panel for tool status
4. Click "Launch" buttons to open detected tools

### MCP Health Monitoring

1. Click "Tools" in navigation bar
2. View MCP health status in Tool Detection Panel
3. Status shows: Healthy, Unhealthy, or Missing

### Rendering Engine Selection

1. Click "Tools" in navigation bar
2. Use Rendering Engine Selector to choose Remotion or FFmpeg
3. View engine capabilities and availability

---

## Configuration

### Tool Paths

Edit `/Users/finessejones1/.arise/config.json`:

```json
{
  "tools": {
    "unrealEngine": "/path/to/UnrealEditor.app",
    "ffmpeg": "/path/to/ffmpeg",
    "ffprobe": "/path/to/ffprobe",
    "remotion": "remotion",
    "comfyMCP": "/path/to/comfy-mcp",
    "openmontageMCP": "/path/to/python",
    "hyperframes": "/path/to/.hyperframes"
  },
  "remotion": {
    "projectPath": "/path/to/remotion-projects"
  },
  "companionMode": {
    "enabled": true,
    "port": 30100
  }
}
```

### MCP Servers

Edit `.mcp.json` in project root:

```json
{
  "mcpServers": {
    "comfy-mcp": {
      "command": "/path/to/comfy-mcp",
      "env": {
        "COMFY_BIN": "/path/to/comfy"
      },
      "optional": true
    }
  }
}
```

---

## Architecture

### Frontend
- **Framework**: React 19 + Vite + TypeScript
- **Styling**: Tailwind CSS v4
- **3D**: Three.js + React Three Fiber
- **State**: React hooks (no global state management yet)

### Backend
- **Framework**: Node.js + Express
- **API**: REST endpoints for tools, Remotion, MCP
- **MCP**: Model Context Protocol servers
- **Socket**: WebSocket for real-time updates

### Desktop
- **Framework**: Electron
- **Platform**: macOS (Windows/Linux planned)
- **Architecture**: Main process + Renderer process

---

## File Structure

```
arise-productions/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/       # UI components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom hooks
│   │   └── index.css        # Global styles
│   ├── tailwind.config.js    # Tailwind configuration
│   └── package.json
├── backend/                 # Node.js backend
│   ├── api/                 # API endpoints
│   ├── services/            # Business logic
│   └── package.json
├── desktop/                 # Electron desktop app
│   ├── main.js              # Electron main process
│   ├── preload.cjs          # Preload script
│   └── package.json
├── arise-remotion-projects/  # Remotion project (separate)
└── server.js                # Main server entry point
```

---

## Current Limitations

### Not Yet Implemented

- Timeline video editing UI
- Media bin asset management UI
- Inspector panel property editing UI
- Working keyboard shortcuts
- Theme switching UI
- Wasserman MCP configuration
- State management for production data
- Actual video editing workflow
- Real-time collaboration
- Multi-user project management

### Known Issues

- Sidebar navigation may not work (runtime issue, code is correct)
- Keyboard shortcuts panel exists but shortcuts don't work
- Theme presets exist but no UI to switch them
- Some MCP servers are configured but not running

---

## Roadmap

See [UPGRADE_ROADMAP.md](./UPGRADE_ROADMAP.md) for detailed upgrade plan to:
- Integrate dead code components
- Wire up keyboard shortcuts
- Create theme switching UI
- Configure Wasserman MCPs
- Start MCP servers
- Create actual production workflow
- Implement state management

---

## Verification

Run verification scripts to check installation:

```bash
# Verify UI/UX improvements
node backend/verify-ui-ux.js

# Verify Phase 2-5 integration
node backend/verify-phase2-5.js

# Verify integrations
node backend/verify-integrations.js
```

---

## No Slop Compliance

This project follows the No Slop Playbook:
- ✅ Real implementations only (no mocks/stubs)
- ✅ Errors thrown when tools missing (no silent fallback)
- ✅ No test/CI detection in production code
- ✅ Evidence-based reporting
- ✅ Verifiable truth in all claims
- ✅ Failures honestly reported

---

## Documentation

- [UI/UX Transformation Summary](./UI_UX_TRANSFORMATION.md)
- [Integration Summary](./INTEGRATION_SUMMARY.md)
- [Phase 2-5 Implementation](./PHASE2-5_IMPLEMENTATION.md)
- [No Slop Audit Report](./NO_SLO_AUDIT_REPORT.md)
- [Wasserman MCP Guide](./WASSERMAN_MCP_GUIDE.md)
- [Upgrade Roadmap](./UPGRADE_ROADMAP.md)

---

## Support

For issues or questions:
- Check verification scripts first
- Review documentation above
- Check configuration files
- Ensure backend server is running

---

## License

UNLICENSED - All rights reserved by THE AI CONTENT FOUNDRY, LLC

---

**Last Updated**: 2026-09-18
