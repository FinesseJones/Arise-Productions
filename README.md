# 🎬 Arise Production Studio

**A Product of THE AI CONTENT FOUNDRY, LLC**  
*© 2026 Arise Production. All rights reserved.*

A next-generation virtual production studio and single pane of glass powered by 10 Model Context Protocol (MCP) microservices, NVIDIA NIM AI models, real-time WebSocket orchestration, Unreal Engine 5, OpenMontage, Hyperframes, and ComfyUI.

---

## 📖 Documentation & Guides

* 📘 **[Master Operational & Categorized Instructions Manual →](./INSTRUCTIONS.md)**  
  *(Complete guide covering 10 MCP departments, document ingestion matrix, 5 studio modes, NVIDIA NIM setup, and autonomous director commands)*
* 📱 **[Multi-Platform Installation Guide (Mac, iOS, Android) →](./INSTALLATION.md)**

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

## 🏛️ The 10 Core MCP Departments

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

## 🧠 Verified AI Models & Creative Engines

### 1. NVIDIA NIM Cloud Models (Free Tier)
* **`meta/llama-3.1-70b-instruct`:** Powers all 10 Department Room AI Co-Pilots (Screenwriter AI, Virtual DP AI, Story Architect AI, Prompt Engineer AI, Sound Supervisor AI, Colorist AI).
* **`meta/llama-3.3-70b-instruct`:** Powers deep screenplay structural breakdown and 3D camera coordinate solvers `[x,y,z]`.
* **`nvidia/nemotron-4-340b-instruct`:** Master architectural reasoning, multi-department project continuity, and character bibles.

### 2. Local Creative Engines Attached
* 🎮 **Unreal Engine 5 (`:30010`):** `/Applications/Film Making/UnrealEditor.app` & `/Users/Shared/UnrealEngine`
* 🎬 **OpenMontage:** `/Users/finessejones1/OpenMontage` (EDL/XML timeline generation for DaVinci Resolve)
* ⚡ **Hyperframes:** `/Users/finessejones1/.hyperframes` & `~/.osaurus/skills/hyperframes*` (60 FPS neural motion synthesis)
* 🎨 **ComfyUI MCP (`:8188`):** `backend/comfy-mcp-env/bin/comfy-mcp` (ControlNet depth passes & IP-Adapter character consistency)

---

## 🚀 Quick Start

### 1. Launch the Installed macOS Native App
Open **Finder** &rarr; **Applications** &rarr; Double-click **Arise Production.app** (or search in Spotlight with `Cmd + Space`).

### 2. Run from Source
```bash
# Clone repository
git clone https://github.com/FinesseJones/Unified-3D-Production-Studio.git
cd Unified-3D-Production-Studio

# Install all dependencies
npm run install:all

# Start Backend API & WebSocket Gateway (:4000)
node server.js

# Start Frontend Studio (:5002)
npm run dev
```

### 3. Apple & Android Device Setup
* **Apple iPhone / iPad:** Open Safari &rarr; Navigate to your studio URL &rarr; Tap **Share** &rarr; **Add to Home Screen**.
* **Android Phones / Tablets:** Open Chrome &rarr; Navigate to your studio URL &rarr; Tap **Install App**.

---

## ⚖️ Legal & Copyright
**© 2026 Arise Production. A product of THE AI CONTENT FOUNDRY, LLC. All rights reserved.**  
All produced 3D blockouts, scripts, prompt slates, and audio stems are copywritten under Arise Productions.
