# 🎬 Arise Production Studio

**A Product of THE AI CONTENT FOUNDRY, LLC**  
*© 2026 Arise Production. All rights reserved.*

A next-generation virtual production studio and single-pane-of-glass workspace powered by 10 Model Context Protocol (MCP) microservices, NVIDIA NIM AI models (Llama 3.1 70B), real-time WebSocket state synchronization, Three.js 3D spatial viewports, and automated conform pipelines.

---

## 📖 Documentation & Architecture

* 📘 **[Master Operational Manual →](./docs/INSTRUCTIONS.md)** *(Complete guide covering 10 MCP departments, document ingestion matrix, 5 studio modes, NVIDIA NIM setup, and autonomous director commands)*
* 📱 **[Multi-Platform Installation Guide (Mac, iOS, Android) →](./docs/INSTALLATION.md)**
* 🏗️ **[System Architecture & Data Flows →](./docs/ARCHITECTURE.md)**
* ⚡ **[Quick Start Reference →](./docs/QUICK_START.md)**

---

## 🌟 Core Capabilities

1. **🎬 Multi-Format Production Management:**
   * **Feature Films (Long-Form):** 90–150 min 3-act narrative structures (Save the Cat), multi-shot manifests, and scene continuity.
   * **Short-Form Content (9:16 Vertical):** Dynamic mobile video, TikToks, and Instagram Reels with rapid pacing.
   * **Episodic TV Series:** Multi-season and episodic arc tracking, cold opens, and cross-episode bibles.

2. **📝 Screenwriting & AI Script Doctoring (Stage 01):**
   * Hollywood Fountain screenplay syntax editor with live element formatting (`Scene`, `Action`, `Character`, `Dialogue`, `Transition`).
   * Inline AI Script Doctor: Raise Stakes, Deepen Subtext, Next Beat, and Polish Dialogue powered by Llama 3.1 70B.
   * Real-time page estimators, word counts, and estimated runtime metrics.

3. **🏛️ 40-Beat Sheet Narrative Matrix (Stage 02):**
   * Complete Save-the-Cat 3-Act structure breakdown with dynamic emotional tension monitoring.

4. **📑 1-Click Production Pitch Bible Generator:**
   * Generates exportable pitch decks with Master One-Pagers, 40-Beat Sheets, Character Dossiers, and Unreal DP / Dolby Atmos specs.

5. **🏛️ 10 Domain-Specific MCP Departments:**
   * **01 ScriptBreak (`/mcp/script`):** Screenplay parsing, scene bibles, character extraction.
   * **02 Cork Board (`/mcp/structure`):** 3-Act narrative index cards and emotional intensity arcs.
   * **03 Master Canvas (`/mcp/plan`):** ACEScg color bibles, PBR textures, 3-point lighting setups, and wardrobe matrices.
   * **04 Blockout 3D (`/mcp/previs`):** Virtual cinematography, Cooke anamorphic prime lenses (18mm–135mm), and 3D vector coordinates.
   * **05 Motion Previs (`/mcp/motion`):** 52-point skeletal kinematics tracking, optical vectors, and 60 FPS motion solves.
   * **06 Storyboard Lab (`/mcp/boards`):** 4-Panel visual storyboards with aspect ratio selectors (`2.39:1`, `16:9`, `9:16`).
   * **07 Slate Prompt (`/mcp/prompt`):** FLUX.1 Dev diffusion prompt matrices with ControlNet Depth V2 and IP-Adapter character likeness locks.
   * **08 Circle Take (`/mcp/dailies`):** 4K HDR dailies review, take scoring, and technical QC verification.
   * **09 Stem Studio (`/mcp/sound`):** Dolby Atmos 5.1 4-track stem mixing console at -24.0 LKFS.
   * **10 DaVinci MCP (`/mcp/edit`):** Multi-track NLE timeline assembler, 3D LUT film profiles (Kodak 2383, Fuji Eterna, ACEScc), and `.EDL` / `.XML` exports.

---

## 🧠 AI Orchestration & Creative Engines

* **NVIDIA NIM AI Models:**
  * `meta/llama-3.1-70b-instruct` (Default free tier model for departmental co-pilots and pitch generation).
  * `meta/llama-3.3-70b-instruct` (Structural parsing and camera vector calculations).
* **Creative Connectors & Protocols:**
  * **Unreal Engine 5 (`:30010`):** Virtual camera parameter synchronization.
  * **OpenMontage:** Timeline EDL/XML assembly for DaVinci Resolve 19.
  * **Hyperframes:** 60 FPS neural motion synthesis.
  * **ComfyUI (`:8188`):** FLUX.1 Dev diffusion and IP-Adapter character likeness consistency.

---

## 🚀 Quick Start

### 1. Launch the Native macOS Application
Open **Finder** &rarr; **Applications** &rarr; Double-click **Arise Production.app**.

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

---

## ⚖️ Legal & Copyright
**© 2026 Arise Production. A product of THE AI CONTENT FOUNDRY, LLC. All rights reserved.**  
This repository and its codebase are proprietary and unlicensed for external distribution without explicit authorization from THE AI CONTENT FOUNDRY, LLC.
