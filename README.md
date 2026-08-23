# 🎬 Arise Production Studio

**A Product of THE AI CONTENT FOUNDRY, LLC**  
*© 2026 Arise Production. All rights reserved.*

A next-generation virtual production studio and single pane of glass powered by 10 Model Context Protocol (MCP) microservices, NVIDIA NIM AI models, real-time WebSocket orchestration, and Unreal Engine 5 / Three.js 3D blockout.

---

## 🌟 Supported Production Formats

Arise Production Studio natively supports multi-format creation:
1. **🎬 Feature Films (Long-Form):** 90–150 min multi-act structures, full multi-shot manifests, and scene continuity.
2. **📱 Short-Form Content (9:16 Vertical):** TikToks, YouTube Shorts, and Instagram Reels with rapid hook-to-punchline pacing.
3. **📺 Episodic TV Series:** Multi-season and episodic arc tracking, cold opens, act breaks, and cross-episode bibles.

### 🔗 Media Ingestion Engine
* **YouTube Ingestion:** Paste any YouTube link to auto-extract scene beats, character dialogues, and 3D camera paths.
* **Social Media Ingestion:** Ingest TikTok, Instagram Reels, and Twitter/X videos.
* **Direct Script / Media Upload:** Ingest `.mp4`, `.mov`, `.wav`, `.fountain`, `.fdx`, and `.pdf` files.

---

## 🏛️ The 10 Core MCP Stages

1. **ScriptBreak (`/mcp/script`):** Screenplay parsing, scene bibles, character extraction.
2. **Cork Board (`/mcp/structure`):** 3-Act narrative index cards and emotional intensity arcs.
3. **Master Canvas (`/mcp/plan`):** Art department moodboards and color palettes.
4. **Blockout 3D (`/mcp/previs`):** 3D camera choreography, focal lengths (18mm–85mm), Three.js/UE5 viewports.
5. **Motion Previs Studio (`/mcp/motion`):** 52-point skeletal tracking and optical motion solve.
6. **Storyboard Reference Studio (`/mcp/boards`):** Shot-by-shot PDF animatics and framing guides.
7. **Slate Prompt (`/mcp/prompt`):** Continuity-locked generative prompt packs.
8. **Circle Take (`/mcp/dailies`):** Dailies review, take scoring, and automated reshoot loops.
9. **Stem Studio (`/mcp/sound`):** Dialogue, Foley, Music, and SFX stem separation at -24 LKFS.
10. **DaVinci MCP (`/mcp/edit`):** EDL cuts, ACEScc color decision lists, and broadcast mastering.

---

## 🚀 Quick Start

### 1. Install & Launch Full Stack
```bash
# Clone repository
git clone https://github.com/FinesseJones/Unified-3D-Production-Studio.git
cd Unified-3D-Production-Studio

# Install dependencies
npm run install:all

# Start Backend API & WebSocket Gateway (:4000)
node server.js

# Start Frontend Studio (:5002)
npm run dev
```

### 2. Run as Native Desktop App
```bash
npm run desktop
```

### 3. Build Permanent macOS `.dmg` Installer
```bash
npm run desktop:build
```

---

## 🤖 NVIDIA Free NIM AI Models

Set your free NVIDIA API Key in `.env`:
```bash
NVIDIA_API_KEY=nvapi-your-key-here
```
Powered by `meta/llama-3.1-70b-instruct`, `meta/llama-3.3-70b-instruct`, and `nvidia/nemotron-4-340b-instruct`.

---

## ⚖️ Legal & Copyright
**© 2026 Arise Production. A product of THE AI CONTENT FOUNDRY, LLC. All rights reserved.**  
All produced 3D blockouts, scripts, prompt slates, and audio stems are copywritten under Arise Productions.
