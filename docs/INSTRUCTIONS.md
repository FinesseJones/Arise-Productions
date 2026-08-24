# 🎬 ARISE PRODUCTION STUDIO
## Comprehensive Master Operational & Installation Manual

**A Product of THE AI CONTENT FOUNDRY, LLC**  
*© 2026 Arise Production. All Rights Reserved.*

---

## 📑 Table of Contents
1. [🏛️ Studio Architecture & Copyright Notice](#1-studio-architecture--copyright-notice)
2. [💻 MacBook & macOS Installation Guide](#2-macbook--macos-installation-guide)
3. [📱 Mobile & Multi-Device Installation (iOS, iPadOS, Android)](#3-mobile--multi-device-installation-ios-ipados-android)
4. [⚡ NVIDIA NIM AI Engine & API Key Setup](#4-nvidia-nim-ai-engine--api-key-setup)
5. [📥 Production Creation & Media Ingestion (YouTube / Social)](#5-production-creation--media-ingestion-youtube--social)
6. [📂 Cross-Department Document Ingestion Matrix (Stages 01–10)](#6-cross-department-document-ingestion-matrix-stages-0110)
7. [🎛️ The 5 Integrated Studio Modes](#7-the-5-integrated-studio-modes)
8. [🔌 Local Creative Engine Connectors (Unreal, ComfyUI, OpenMontage, Hyperframes)](#8-local-creative-engine-connectors)
9. [🤖 Autonomous Director Command Reference](#9-autonomous-director-command-reference)
10. [🎨 Aesthetic Customization & Color Palettes](#10-aesthetic-customization--color-palettes)

---

## 1. Studio Architecture & Copyright Notice

Arise Production is an all-in-one virtual production studio and single pane of glass powered by:
* **10 Model Context Protocol (MCP) microservices** covering the complete filmmaking lifecycle.
* **102 NVIDIA NIM Free Tier AI models** powering bespoke department AI Co-Pilots.
* **4 Local Creative Engines** (Unreal Engine 5.4, ComfyUI FLUX/SDXL, OpenMontage, Hyperframes).
* **5 Core Studio Modes** (3D Soundstage, 3D Campus, 4K Video Screening Room, Studio Suites, Data Vault).

> **Legal & Ownership Notice:**  
> © 2026 Arise Production. A product of **THE AI CONTENT FOUNDRY, LLC**.  
> Any and all scripts, 3D camera tracks, ControlNet depth tensors, audio stems, and conformed cuts produced in this studio carry proof-of-ownership watermarks.

---

## 2. MacBook & macOS Installation Guide

### Option A: Launch Pre-Installed Native App (Zero Terminal Required)
The app is fully installed on your MacBook:
1. Open **Finder** &rarr; **Applications**.
2. Double-click **`Arise Production.app`** (or press `Cmd + Space` and type *Arise Production*).
3. The app starts its own internal WebSocket server, database, and UI automatically. When you close the app (`Cmd + Q`), all processes shut down cleanly.

### Option B: Install from Desktop DMG
A self-contained macOS installer DMG is on your Desktop:
1. Double-click **`/Users/finessejones1/Desktop/Arise Production Installer.dmg`** (162 MB).
2. Drag the **Arise Production** icon into your **Applications** folder.
3. Eject the DMG and launch the app.

---

## 3. Mobile & Multi-Device Installation (iOS, iPadOS, Android)

Arise Production includes a Progressive Web App (PWA) manifest with custom high-resolution app icons for iPhone, iPad, and Android.

### 🍏 Apple Devices (iPhone & iPad)
1. Open **Safari** on your iPhone or iPad.
2. Navigate to your studio address (e.g. `http://<your-mac-ip>:5055` or your hosted domain).
3. Tap the **Share** button (the square with an arrow pointing up at the bottom of the screen).
4. Scroll down and tap **Add to Home Screen**.
5. Tap **Add**. The golden 3D **Arise Production** icon will appear on your home screen and open in full-screen standalone mode.

### 🤖 Android Devices (Phones & Tablets)
1. Open **Google Chrome** on your Android device.
2. Navigate to your studio address.
3. Tap the **three dots menu (⋮)** in the top-right corner.
4. Tap **Install App** (or **Add to Home screen**).
5. Tap **Install**. The app will install with its 512x512 adaptive icon and launch as a native Android app.

---

## 4. NVIDIA NIM AI Engine & API Key Setup

Arise Production uses **NVIDIA NIM Free Tier AI Models** (running on NVIDIA's cloud infrastructure at zero compute cost).

### Step 1: Obtain a Free API Key
1. Visit [https://build.nvidia.com](https://build.nvidia.com).
2. Sign in or create a free NVIDIA developer account.
3. Click **Get API Key** and copy your `nvapi-...` key.

### Step 2: Activate Your Key (3 Methods)
* **Method 1 (1-Click in App):** Launch Arise Production &rarr; Click the AI model button in the top header &rarr; Click **`📋 Paste`** &rarr; Click **Save Key**.
* **Method 2 (.env File):** Edit `/Users/finessejones1/dyad-apps/unified-3-d-production-studio/.env`:
  ```bash
  NVIDIA_API_KEY=nvapi-your-key-here
  NVIDIA_DEFAULT_MODEL=meta/llama-3.1-70b-instruct
  ```
* **Method 3 (Terminal):**
  ```bash
  echo "NVIDIA_API_KEY=nvapi-your-key-here" > /Users/finessejones1/dyad-apps/unified-3-d-production-studio/.env
  ```

### Verified Models Catalog (102 Active Free Tier Models)
* **`meta/llama-3.1-70b-instruct` (Default Primary):** Hollywood screenwriting, dialogue bibles, and scene breakdown.
* **`meta/llama-3.3-70b-instruct`:** 3D camera vector solves, spatial geometry, and complex multi-shot continuity.
* **`meta/llama-3.2-90b-vision-instruct`:** Multimodal vision parsing, storyboard references, and lighting styles.
* **`nvidia/nemotron-4-340b-instruct`:** Massive 340B model for full-season episodic TV bibles and lore continuity.
* **`meta/llama-3.1-405b-instruct`:** Maximum reasoning powerhouse for intricate multi-act thematic logic.
* **`mistralai/mistral-large`:** Multilingual international dialogue and international distribution.
* **`deepseek-ai/deepseek-v4-flash-0731`:** Ultra-fast sub-second generation for real-time script brainstorming.

---

## 5. Production Creation & Media Ingestion (YouTube / Social)

### 1. Create a Production from Scratch
1. Click **`+ New Production`** on the studio home screen.
2. Select your production format:
   * **🎬 Feature Film (Long-Form):** 16:9 Theatrical widescreen, multi-act structures.
   * **📱 Short-Form Content (9:16 Vertical):** TikToks, YouTube Shorts, Instagram Reels.
   * **📺 Episodic TV Series:** Multi-season and episode tracking with 2.39:1 Cinema Scope.
3. Enter your project title (e.g. *"Neon Horizon"*).
4. Click **Generate 10-Stage Pipeline**.  
   *(NVIDIA Llama 3.1 70B automatically generates bespoke loglines, character bibles, and scene shots for your exact title — zero mock data).*

### 2. Ingest from External Media Links
1. In the **Create Production** modal, paste any link in the **Media Ingestion URL** box:
   * **YouTube URL:** `https://youtube.com/watch?v=...`
   * **TikTok / IG Reel URL:** Social video links.
2. Click **Generate 10-Stage Pipeline**.
3. The AI Ingestion Engine analyzes the video narrative, extracts principal characters, and generates a conformed 10-stage production manifest.

---

## 6. Cross-Department Document Ingestion Matrix (Stages 01–10)

You can upload reference files and documents to guide the AI across every production department:

| Department / Stage | Supported File Types | How the AI Uses the Document |
| :--- | :--- | :--- |
| **📝 01. Screenwriting** | `.fountain`, `.fdx`, `.pdf`, `.docx`, `.txt` | Parses scene sluglines, dialogue, character motivations, and prop bibles. |
| **🎨 02. Storyboard & Concept** | Lookbooks (`.pdf`), `.png`, `.jpg`, `.csv` | Generates 4-panel visual storyboard prompts and lens framing guides. |
| **🎥 03. Virtual DP & Previs** | Studio Floorplans (`.pdf`), Lens Charts, `.json` | Computes Unreal 5.4 CineCamera focal lengths, apertures, and 3D paths. |
| **🏛️ 04. Set Blockout & 3D** | CAD Blueprints, Set Schematics, `.fbx`, `.obj` | Constructs 3D spatial volumes, LED wall coordinates, and lighting fixtures. |
| **⚡ 05. Motion & Stunts** | Stunt Videos (`.mp4`), `.bvh`, `.fbx` | Solves 52-point skeletal motion vectors and 60 FPS Hyperframes neural keyframes. |
| **🎨 06. Generative VFX** | Headshots (`.jpg`), Depth Passes, `.safetensors` | Calibrates IP-Adapter facial likeness and runs ComfyUI FLUX/SDXL depth passes. |
| **🎙️ 07. 5.1 Sound & Scoring** | Voice Audio (`.wav`), Music (`.mp3`), ADR `.csv` | Clones character voices (ElevenLabs) and mixes a 5.1 surround master. |
| **✂️ 08. Editorial & Conform** | `.edl`, `.xml`, `.aaf`, Lined Scripts (`.pdf`) | Assembles multi-track timeline (V1/V2, A1/A2) and outputs DaVinci Resolve EDLs. |
| **🌈 09. Color Grading** | 3D `.cube` LUTs, `.3dl`, `.cdl`, Look Stills | Applies ACEScg color space transforms and Kodak 2383 / Fuji film print emulation. |
| **🌍 10. Legal & Delivery** | Release Forms (`.pdf`), `.srt`, `.vtt` | Embeds copyright metadata (© 2026), subtitles, and exports 4K master files. |

### How to Upload Documents into the App
* **Data Vault:** Click **`Data Vault & History`** in the top bar &rarr; Drag and drop files directly into the vault.
* **Room AI Chat:** Paste text, scene excerpts, or camera tables directly into the Room AI Chat box.
* **Studio Suites:** Open **`Studio Suites`** &rarr; Use the dedicated import buttons in Screenwriting, Editing, or Color.

---

## 7. The 5 Integrated Studio Modes

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  [3D Soundstage]  [3D Campus]  [Video Screening]  [Studio Suites]  [Data Vault & History]│
└────────────────────────────────────────────────────────────────────────────────────────┘
```

1. **🚀 3D Soundstage:** Split-screen interface with an interactive 3D spatial canvas on the left (camera orbit, focal length 18–135mm) and a specialized Department AI Co-Pilot with 1-click prompt chips on the right.
2. **🏛️ 3D Campus:** An architectural visualization of all 10 production departments with real-time GPU telemetry, shot queues, and building status.
3. **🎥 4K Video Screening Room:** Integrated screening room with frame-by-frame stepping (`<` and `>`), SMPTE timecode readout, 16:9 / 2.39:1 / 9:16 aspect ratio switching, take selector (Previs, Unreal Pass, Master Grade), and MP4 export.
4. **🎬 Studio Suites (Merged Original Studio):** Complete deep-dive suites for Screenwriting, Multi-Track Editing (V1/V2, A1/A2), Casting Desk, Budget Tracker, Sound Design, VFX, Color Grading, Scheduling, and Analytics.
5. **📁 Data Vault & History Ledger:** Centralized archive for all cross-department files (`.fountain`, `.json`, `.wav`, `.edl`, `.cube`) with search, filter chips, action logs, and instant downloads.

---

## 8. Local Creative Engine Connectors

| Local Engine | Mac Location | Studio Connector Port |
| :--- | :--- | :--- |
| **🎮 Unreal Engine 5** | `/Applications/Film Making/UnrealEditor.app` | Remote Control HTTP (`:30010`) |
| **🎬 OpenMontage** | `/Users/finessejones1/OpenMontage` | DaVinci Resolve EDL / XML Bridge |
| **⚡ Hyperframes** | `~/.hyperframes` & `~/.osaurus/skills` | 60 FPS Neural Keyframe Synthesizer |
| **🎨 ComfyUI MCP** | `backend/comfy-mcp-env/bin/comfy-mcp` | ControlNet & FLUX/SDXL Bridge (`:8188`) |

---

## 9. Autonomous Director Command Reference

Type natural language commands into the **Director Command Bar** at the bottom of the studio:

* `"board scene 1"` — Automatically generates storyboard prompts and visual framing for Scene 1.
* `"solve camera shot 2"` — Computes 3D Unreal Engine CineCamera focal length, aperture, and trajectory.
* `"compile prompts"` — Compiles ComfyUI FLUX prompt slates with ControlNet depth weights.
* `"mix audio scene 1"` — Synthesizes ElevenLabs vocal stems and Foley beds into a 5.1 surround mix.
* `"conform edit"` — Compiles multi-track timeline cuts into a DaVinci Resolve `.edl` file.
* `"apply film grade"` — Applies ACEScg Kodak 2383 3D LUT profiles across all shots.
* `"run full pipeline"` — Executes end-to-end autonomous handoff from Stage 01 through Stage 10.

---

## 10. Aesthetic Customization & Color Palettes

The studio features **Option 4: Royal Amethyst & Rose Copper** (Cosmic Avant-Garde):
* **Nebula Void Backdrop:** `#080512`
* **Electric Amethyst Accents:** `#8B5CF6` / `#A855F7`
* **Luminous Rose Gold Glow:** `#FB7185` / `#F43F5E`
* **Cosmic Indigo Cards:** `#140E2E` with `#3B2D71` subtle borders
* **Starlight Gold Highlights:** `#FDE047`

To customize colors, edit `frontend/src/index.css` and restart the app.

---

## ⚖️ Legal & Copyright Notice

**Arise Production** is a proprietary software suite created by and for **THE AI CONTENT FOUNDRY, LLC**.  
*Copyright © 2026 THE AI CONTENT FOUNDRY, LLC. All Rights Reserved.*
