# 📱 Arise Production Studio — Multi-Platform Installation Guide

**A Product of THE AI CONTENT FOUNDRY, LLC**  
*© 2026 Arise Production. All rights reserved.*

This guide provides step-by-step instructions to install and run **Arise Production Studio** on **macOS (MacBook/Mac Mini/Mac Studio)**, **Apple Devices (iPhone & iPad)**, and **Android Devices (Phones & Tablets)**, along with a complete verification of all attached AI models and tools.

---

## 💻 1. macOS (MacBook & Mac Desktop) Installation

### Option A: Launch the Installed Real App (Instant)
The native macOS app has been compiled and installed directly into your `/Applications` directory:
1. Open **Finder** &rarr; Go to **Applications**.
2. Double-click **Arise Production.app** (or press `Cmd + Space` and search for **"Arise Production"**).
3. The native studio window will launch in standalone 60 FPS mode with native macOS titlebar, menu items, and file dialogs.

### Option B: Run or Build from Source (Terminal)
```bash
# Clone the repository
git clone https://github.com/FinesseJones/Unified-3D-Production-Studio.git
cd Unified-3D-Production-Studio

# Install all dependencies (Frontend, Backend, Desktop)
npm run install:all

# Run the native Desktop App
npm run desktop

# Build a fresh macOS .dmg installer
npm run desktop:build
```

---

## 🍏 2. Apple Devices (iPhone & iPad) Installation

You can install Arise Production as a **standalone native app** on iOS/iPadOS with full-screen hardware-accelerated 3D viewports:

1. **Find your Mac's Local IP Address** (or use your deployed production URL):
   * On your Mac terminal, check `ipconfig getifaddr en0` (e.g. `192.168.1.50`).
2. **Open Safari** on your iPhone or iPad:
   * Navigate to `http://<your-mac-ip>:5002` (e.g. `http://192.168.1.50:5002`).
3. **Install as Native Home Screen App**:
   * Tap the **Share** button (the square icon with an upward arrow at the bottom of Safari).
   * Scroll down and select **"Add to Home Screen"**.
   * Confirm the name **"Arise Studio"** and tap **Add** in the top-right corner.
4. **Launch & Use**:
   * An official gold 3D **Arise Production** logo will appear on your iPhone/iPad Home Screen.
   * Tapping it launches the studio in full-screen standalone mode (no Safari browser bars or URL bars).

---

## 🤖 3. Android Devices (Phones & Tablets) Installation

You can install Arise Production directly onto any Android device:

### Option A: Progressive Web App (PWA) Install
1. On your Android phone/tablet, open **Google Chrome**.
2. Navigate to your studio URL: `http://<your-mac-ip>:5002` (or your live domain).
3. Chrome will automatically prompt you with a banner: **"Add Arise Studio to Home screen"**.
   * Alternatively, tap the three-dot menu (**⋮**) in the top-right corner &rarr; select **"Install App"** (or **"Add to Home screen"**).
4. Tap **Install**.
5. The app will install into your Android App Drawer and Home Screen as a native app, supporting touch gestures, 3D viewport rotation, and AI Co-Pilot chat.

---

## 🧠 4. Verification of Attached AI Models & Engines

The following AI models and local creative engines are verified and wired into the studio pipeline:

### 1. NVIDIA NIM Cloud Models (Free Tier)
*Configured in `backend/ai/nvidia-client.js` with endpoint `integrate.api.nvidia.com`:*
* **`meta/llama-3.1-70b-instruct`:** Powers all 10 Department Room AI Co-Pilots (Screenwriter AI, Virtual DP AI, Story Architect AI, Prompt Engineer AI, Sound Supervisor AI, Colorist AI).
* **`meta/llama-3.3-70b-instruct`:** Powers deep screenplay structural breakdown and 3D camera coordinate solvers `[x,y,z]`.
* **`nvidia/nemotron-4-340b-instruct`:** Master architectural reasoning, multi-department project continuity, and character bibles.

### 2. Local ComfyUI MCP Server (`:8188`)
*Configured in `.mcp.json` and `backend/workers/comfy-bridge.js`:*
* **Runtime:** `/Users/finessejones1/dyad-apps/unified-3-d-production-studio/backend/comfy-mcp-env/bin/comfy-mcp`
* **Models Supported:** Flux.1, SDXL, Wan 2.1, ControlNet Depth, and IP-Adapter character consistency embeddings.

### 3. Local Unreal Engine 5 (`:30010`)
*Configured in `.mcp.json` and `backend/services/unreal-connector.js`:*
* **Path:** `/Applications/Film Making/UnrealEditor.app` & `/Users/Shared/UnrealEngine`
* **Features:** Remote Control Web Server, CineCameraActor focal lengths (18mm–85mm), Lumen real-time lighting, and Live Link.

### 4. Local OpenMontage
*Configured in `.mcp.json` and `backend/services/openmontage-connector.js`:*
* **Path:** `/Users/finessejones1/OpenMontage`
* **Features:** Multi-track timeline assembly, style definitions, and EDL/XML timeline export for Blackmagic DaVinci Resolve.

### 5. Local Hyperframes
*Configured in `.mcp.json` and `backend/services/hyperframes-connector.js`:*
* **Path:** `/Users/finessejones1/.hyperframes` & `~/.osaurus/skills/hyperframes*`
* **Features:** 60 FPS neural video keyframe interpolation, 3D transitions, liquid glass widgets, and kinetic captions.

---

## ⚖️ Legal & Copyright
**© 2026 Arise Production. A product of THE AI CONTENT FOUNDRY, LLC. All rights reserved.**
