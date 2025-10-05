# Unified 3D Production Studio - Complete Installation Guide

**Vision-Driven | Creator-Led | Built To Empower Bold**

This guide will walk you through installing the Unified 3D Production Studio on your desktop for Mac, Windows, and Linux, plus integrating with Unreal Engine 5.

---

## 📋 Table of Contents
- [System Requirements](#system-requirements)
- [Mac Installation](#mac-installation)
- [Windows Installation](#windows-installation)
- [Linux Installation](#linux-installation)
- [Unreal Engine 5 Integration](#unreal-engine-5-integration)
- [Troubleshooting](#troubleshooting)

---

## 💻 System Requirements

### Minimum Requirements:
- **RAM:** 8GB (16GB recommended)
- **Storage:** 5GB free space (20GB for Unreal Engine integration)
- **CPU:** Quad-core processor
- **GPU:** Integrated graphics (Dedicated GPU recommended for Unreal Engine)

### Software Prerequisites:
- **Node.js:** Version 18 or higher
- **Git:** Latest version
- **Encore CLI:** For backend development

### For Unreal Engine Integration:
- **Unreal Engine 5.3+**
- **Visual Studio 2022** (Windows) or **Xcode** (Mac)
- **GPU:** NVIDIA GTX 1060 / AMD RX 580 or better
- **RAM:** 16GB minimum, 32GB recommended

---

## 🍎 Mac Installation

### Step 1: Install Prerequisites

#### Install Homebrew (if not already installed):
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

#### Install Node.js:
```bash
brew install node
```

#### Verify installation:
```bash
node --version  # Should be 18.x or higher
npm --version
```

#### Install Git (if not already installed):
```bash
brew install git
```

#### Install Encore CLI:
```bash
brew install encoredev/tap/encore
```

### Step 2: Clone the Repository

```bash
# Navigate to your desired directory
cd ~/Desktop  # or wherever you want to install

# Clone the repository
git clone https://github.com/PARPUBLISHING/Unified-3D-Production-Studio.git
cd Unified-3D-Production-Studio
```

### Step 3: Install Dependencies

#### Install Backend Dependencies:
```bash
cd backend
npm install
cd ..
```

#### Install Frontend Dependencies:
```bash
cd frontend
npm install
cd ..
```

### Step 4: Set Up Environment Variables

#### Create backend environment file:
```bash
cd backend
cat > .env << EOF
# AI API Keys (Get these from respective providers)
ANTHROPIC_API_KEY=your_anthropic_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
EOF
cd ..
```

#### Create frontend environment file:
```bash
cd frontend
cat > .env.local << EOF
# Backend API URL (for local development)
VITE_API_URL=http://localhost:4000
EOF
cd ..
```

### Step 5: Run the Application

#### Terminal 1 - Start Backend:
```bash
cd backend
encore run
```

The backend will start at: `http://localhost:4000`

#### Terminal 2 - Start Frontend (in a new terminal):
```bash
cd frontend
npm run dev
```

The frontend will start at: `http://localhost:5000`

**🎉 Open your browser to http://localhost:5000**

---

## 🪟 Windows Installation

### Step 1: Install Prerequisites

#### Install Node.js:
1. Download Node.js from: https://nodejs.org/
2. Download the **Windows Installer (.msi)** - LTS version
3. Run the installer
4. Click through the installation wizard (accept defaults)
5. Restart your computer

#### Verify installation (in Command Prompt or PowerShell):
```powershell
node --version  # Should be 18.x or higher
npm --version
```

#### Install Git:
1. Download from: https://git-scm.com/download/win
2. Run the installer
3. Use default settings

#### Install Encore CLI:
```powershell
# Run PowerShell as Administrator
iwr https://encore.dev/install.ps1 | iex
```

Or download from: https://encore.dev/docs/install

### Step 2: Clone the Repository

```powershell
# Navigate to your desired directory
cd C:\Users\YourUsername\Desktop  # or wherever you want

# Clone the repository
git clone https://github.com/PARPUBLISHING/Unified-3D-Production-Studio.git
cd Unified-3D-Production-Studio
```

### Step 3: Install Dependencies

#### Install Backend Dependencies:
```powershell
cd backend
npm install
cd ..
```

#### Install Frontend Dependencies:
```powershell
cd frontend
npm install
cd ..
```

### Step 4: Set Up Environment Variables

#### Create backend .env file:
```powershell
cd backend
# Create .env file manually in Notepad:
notepad .env
```

Add this content:
```env
# AI API Keys (Get these from respective providers)
ANTHROPIC_API_KEY=your_anthropic_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

Save and close.

#### Create frontend .env.local file:
```powershell
cd ..\frontend
notepad .env.local
```

Add this content:
```env
# Backend API URL (for local development)
VITE_API_URL=http://localhost:4000
```

Save and close.

### Step 5: Run the Application

#### Command Prompt/PowerShell 1 - Start Backend:
```powershell
cd backend
encore run
```

#### Command Prompt/PowerShell 2 - Start Frontend (new window):
```powershell
cd frontend
npm run dev
```

**🎉 Open your browser to http://localhost:5000**

---

## 🐧 Linux Installation

### Step 1: Install Prerequisites

#### For Ubuntu/Debian:
```bash
# Update package list
sudo apt update

# Install Node.js (using NodeSource)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Git
sudo apt install -y git

# Verify installation
node --version  # Should be 18.x or higher
npm --version
```

#### For Fedora/RHEL:
```bash
# Install Node.js
sudo dnf install nodejs

# Install Git
sudo dnf install git

# Verify installation
node --version
npm --version
```

#### For Arch Linux:
```bash
# Install Node.js and Git
sudo pacman -S nodejs npm git

# Verify installation
node --version
npm --version
```

#### Install Encore CLI:
```bash
curl -L https://encore.dev/install.sh | bash
```

### Step 2: Clone the Repository

```bash
# Navigate to your desired directory
cd ~/Desktop  # or wherever you want

# Clone the repository
git clone https://github.com/PARPUBLISHING/Unified-3D-Production-Studio.git
cd Unified-3D-Production-Studio
```

### Step 3: Install Dependencies

```bash
# Install Backend Dependencies
cd backend
npm install
cd ..

# Install Frontend Dependencies
cd frontend
npm install
cd ..
```

### Step 4: Set Up Environment Variables

```bash
# Create backend .env file
cd backend
cat > .env << EOF
# AI API Keys (Get these from respective providers)
ANTHROPIC_API_KEY=your_anthropic_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
EOF
cd ..

# Create frontend .env.local file
cd frontend
cat > .env.local << EOF
# Backend API URL (for local development)
VITE_API_URL=http://localhost:4000
EOF
cd ..
```

### Step 5: Run the Application

#### Terminal 1 - Start Backend:
```bash
cd backend
encore run
```

#### Terminal 2 - Start Frontend:
```bash
cd frontend
npm run dev
```

**🎉 Open your browser to http://localhost:5000**

---

## 🎮 Unreal Engine 5 Integration

This section covers integrating the Unified 3D Production Studio with Unreal Engine 5 for real-time 3D virtual production.

### Prerequisites

1. **Unreal Engine 5.3+** installed from Epic Games Launcher
2. **Visual Studio 2022** (Windows) or **Xcode 14+** (Mac)
3. **Completed basic installation** (Mac/Windows/Linux steps above)

---

### Step 1: Install Unreal Engine 5

#### Option A: Epic Games Launcher (Recommended)
1. Download and install Epic Games Launcher: https://www.epicgames.com/store/download
2. Sign in with your Epic Games account
3. Navigate to **Unreal Engine** → **Library**
4. Click **Install Engine** → Select **5.3** or later
5. Choose installation location (requires ~50GB)
6. Wait for installation to complete

#### Option B: Source Build (Advanced)
For custom builds, follow: https://docs.unrealengine.com/5.3/en-US/building-unreal-engine-from-source/

---

### Step 2: Create Unreal Engine Project

1. Open Epic Games Launcher
2. Go to **Unreal Engine** → **Library** → **Launch** UE 5.3
3. Click **Games** → **Blank Project**
4. Settings:
   - **Blueprint** or **C++** (your choice)
   - **Target Platform:** Desktop
   - **Quality Preset:** Maximum
   - **Ray Tracing:** Enabled (if supported)
   - **Starter Content:** No
5. **Project Location:** Choose where to save
6. **Project Name:** `FinesseStudioVirtualProduction`
7. Click **Create**

---

### Step 3: Install Required Unreal Plugins

1. In Unreal Editor, go to **Edit** → **Plugins**
2. Enable these plugins:
   - **Web Browser Widget** (for UI integration)
   - **WebSocket Networking** (for real-time communication)
   - **Live Link** (for data streaming)
   - **Virtual Camera** (for camera control)
   - **nDisplay** (for multi-display setups)
   - **Pixel Streaming** (for remote rendering)

3. Restart Unreal Editor when prompted

---

### Step 4: Set Up WebSocket Communication

#### Create WebSocket Blueprint:

1. In **Content Browser**, right-click → **Blueprint Class** → **Actor**
2. Name it: `BP_StudioWebSocketBridge`
3. Double-click to open
4. Add **WebSocket** component
5. In **Event Graph**, add this logic:

**Event BeginPlay:**
```
Connect to WebSocket
URL: ws://localhost:8080
```

**On Connected:**
```
Print String: "Connected to Unified Studio"
```

**On Message Received:**
```
Parse JSON Message
→ If message type = "SpawnActor"
  → Spawn Actor from Class
→ If message type = "CameraUpdate"
  → Update Virtual Camera
```

6. Save and compile

---

### Step 5: Create Virtual Production Level

1. **File** → **New Level** → **Empty Level**
2. Save as: `VirtualProductionStage`

#### Add Virtual Production Elements:

**Add Camera:**
1. **Place Actors** → **Cinematic** → **Cine Camera Actor**
2. Name it: `StudioCamera`
3. Enable **Live Link** on camera

**Add Studio Environment:**
1. **Place Actors** → **Lights** → **Directional Light** (sun)
2. **Place Actors** → **Lights** → **Sky Light**
3. **Place Actors** → **Visual Effects** → **Exponential Height Fog**
4. **Place Actors** → **Volumes** → **Post Process Volume**
   - Check **Infinite Extent (Unbound)**

**Add Spawn Points:**
1. Create empty actors as spawn markers
2. Name them: `ActorSpawnPoint_01`, `ActorSpawnPoint_02`, etc.

---

### Step 6: Connect Studio to Unreal Engine

#### In the Studio Backend (create new file):

Create: `backend/unreal/websocket_server.ts`

```typescript
import { api, APIError } from "encore.dev/api";
import WebSocket from "ws";

let wss: WebSocket.Server;

export const startUnrealBridge = api(
  { expose: true, method: "POST", path: "/unreal/start" },
  async (): Promise<{ status: string }> => {
    wss = new WebSocket.Server({ port: 8080 });

    wss.on("connection", (ws) => {
      console.log("Unreal Engine connected");

      ws.on("message", (message) => {
        console.log("Received from Unreal:", message.toString());
      });

      ws.send(JSON.stringify({
        type: "connection",
        message: "Studio connected"
      }));
    });

    return { status: "WebSocket server started on port 8080" };
  }
);

export const sendToUnreal = api(
  { expose: true, method: "POST", path: "/unreal/send" },
  async (data: { type: string; payload: any }): Promise<{ sent: boolean }> => {
    if (!wss) {
      throw APIError.unavailable("WebSocket server not started");
    }

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });

    return { sent: true };
  }
);
```

#### Install WebSocket dependency:
```bash
cd backend
npm install ws
npm install --save-dev @types/ws
```

#### Restart backend:
```bash
encore run
```

---

### Step 7: Test the Integration

#### In Unreal Engine:
1. Place `BP_StudioWebSocketBridge` in your level
2. Click **Play** (Alt+P)
3. Check **Output Log** for "Connected to Unified Studio"

#### In Studio Frontend:
1. Open browser: http://localhost:5000
2. Go to Dashboard
3. Create a test project

#### Send Test Command:
```bash
# Use curl to test
curl -X POST http://localhost:4000/unreal/send \
  -H "Content-Type: application/json" \
  -d '{
    "type": "SpawnActor",
    "payload": {
      "class": "Cube",
      "location": {"x": 0, "y": 0, "z": 100}
    }
  }'
```

You should see a response in Unreal Engine!

---

### Step 8: Enable Pixel Streaming (Optional - For Remote Access)

This allows you to view and control Unreal Engine from a web browser.

1. In Unreal Editor: **Edit** → **Plugins** → Enable **Pixel Streaming**
2. Restart Unreal Editor
3. **Edit** → **Project Settings** → **Pixel Streaming**
   - **Streamer Port:** 8888
   - **Signaling Server URL:** ws://localhost:8888

4. Run Pixel Streaming:
```bash
# In Unreal Engine project directory
cd Samples/PixelStreaming/WebServers/SignallingWebServer/platform_scripts/cmd
.\Start_AWS_WithTURN_SignallingServer.bat
```

5. Package your project: **File** → **Package Project** → **Windows**

---

### Step 9: Advanced Integration Features

#### Character Spawning from Studio:
Create an API endpoint in your frontend to spawn characters in Unreal:

```typescript
// frontend/src/lib/unrealBridge.ts
export async function spawnCharacter(characterData: {
  name: string;
  model: string;
  position: { x: number; y: number; z: number };
}) {
  const response = await fetch('http://localhost:4000/unreal/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'SpawnCharacter',
      payload: characterData
    })
  });
  return response.json();
}
```

#### Virtual Camera Control:
Control Unreal's camera from the Studio interface.

#### Real-time Asset Loading:
Load 3D models, textures, and animations dynamically.

---

## 🔧 Troubleshooting

### Common Issues

#### "Encore command not found"
**Solution:** Restart your terminal/command prompt after installing Encore CLI.

#### "Port already in use"
**Solution:**
```bash
# Mac/Linux - Kill process on port 4000
lsof -ti:4000 | xargs kill -9

# Windows - Kill process on port 4000
netstat -ano | findstr :4000
taskkill /PID [PID_NUMBER] /F
```

#### Frontend won't connect to backend
**Solution:** Make sure `VITE_API_URL` in `.env.local` matches your backend URL (usually `http://localhost:4000`)

#### Unreal Engine won't connect
**Solution:**
1. Check if WebSocket server is running: `curl http://localhost:8080`
2. Verify firewall isn't blocking port 8080
3. Check Unreal's Output Log for connection errors

#### "Module build failed" errors
**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 🆘 Getting Help

- **GitHub Issues:** https://github.com/PARPUBLISHING/Unified-3D-Production-Studio/issues
- **Encore Docs:** https://encore.dev/docs
- **Unreal Engine Docs:** https://docs.unrealengine.com/

---

## 🎯 Next Steps

After installation:

1. **Create your first project** in the Dashboard
2. **Explore AI agents** - Chat with the 8 specialized AI assistants
3. **Try production modules** - Test Casting, Budget, Scheduling, etc.
4. **Set up Unreal Engine** integration for virtual production
5. **Build your virtual studio** in Unreal Engine

---

**© Finesse Jones - Vision-Driven | Creator-Led | Built To Empower Bold**

*Last Updated: October 5, 2025*
