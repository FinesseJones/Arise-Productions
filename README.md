# Unified 3D Production Studio

**Vision-Driven | Creator-Led | Built To Empower Bold**

A comprehensive digital production studio powered by AI and Unreal Engine 5, designed for modern content creators.

## 🎬 Features

### Production Modules
- **🎭 AI-Powered Casting Room** - Generate casting profiles, budget analysis, and production schedules
- **📝 Script Analysis** - AI-powered script breakdown and analysis
- **🎨 Visual Effects Suite** - Professional VFX compositing
- **🎵 Sound Design Studio** - Multi-track audio editing and mixing
- **📊 Production Budget** - Comprehensive budget planning and tracking
- **📅 Scheduling** - AI-optimized production timelines
- **🎨 Color Grading** - Professional color correction tools
- **📈 Analytics** - Data-driven production insights

### Technology Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Vite
- **Backend**: Encore.dev, Node.js, TypeScript
- **AI**: Claude (Anthropic), ready for OpenAI integration
- **3D Engine**: Unreal Engine 5 integration framework
- **Database**: PostgreSQL (via Encore.dev)
- **Real-time**: WebSocket support for UE5 communication

### Design System
- Navy Blue (#0066FF) - Primary brand color
- Gold (#FFD700) - Accent and highlights  
- Purple (#9966FF) - Secondary accents
- Glassmorphism UI with modern animations

## 🚀 Quick Start

### 📖 **[Complete Installation Guide →](./INSTALLATION.md)**

**Step-by-step instructions for:**
- ✅ Mac Installation
- ✅ Windows Installation
- ✅ Linux Installation
- ✅ Unreal Engine 5 Integration
- ✅ Troubleshooting Guide

### 🌐 Live Demo

**Frontend:** https://frontend-a0s11lix5-finesse-jones-projects-287f926d.vercel.app
**Backend API:** https://staging-unified3dproduction-dazi.encr.app

### Quick Local Setup (TL;DR)

```bash
# 1. Install prerequisites
# - Node.js 18+
# - Encore CLI: https://encore.dev/docs/install

# 2. Clone repository
git clone https://github.com/PARPUBLISHING/Unified-3D-Production-Studio.git
cd Unified-3D-Production-Studio

# 3. Install dependencies
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# 4. Set up environment (see INSTALLATION.md for details)

# 5. Run (in two separate terminals)
cd backend && encore run        # Terminal 1
cd frontend && npm run dev      # Terminal 2
```

**Visit:** http://localhost:5000

## 📁 Project Structure

```
Unified-3D-Production-Studio/
├── frontend/                 # React application
│   ├── src/
│   │   ├── pages/           # Page components
│   │   ├── components/      # Reusable components
│   │   ├── modules/         # Feature modules
│   │   ├── lib/             # Utilities and API
│   │   └── types/           # TypeScript definitions
│   └── package.json
├── backend/                  # Encore.dev backend
│   ├── ai/                  # AI services
│   ├── studio/              # Studio services
│   └── frontend/            # Frontend service
├── docs/                    # Documentation
└── README.md
```

## 🎯 Roadmap

### Phase 1: Core Features ✅
- [x] Unified application architecture
- [x] Casting Room module
- [x] Navigation and routing
- [x] Mock AI integration
- [x] 10 production page placeholders

### Phase 2: AI Integration (In Progress)
- [ ] Real Claude API integration
- [ ] Script analysis AI
- [ ] Budget forecasting AI
- [ ] Schedule optimization AI

### Phase 3: Database & Storage
- [ ] PostgreSQL integration
- [ ] Asset storage (S3/R2)
- [ ] User authentication
- [ ] Project management

### Phase 4: Advanced Features
- [ ] Real-time collaboration
- [ ] PDF export functionality
- [ ] Calendar integration
- [ ] Video conferencing for auditions
- [ ] Analytics dashboard

### Phase 5: Unreal Engine Integration
- [ ] UE5 WebSocket server
- [ ] Character spawning
- [ ] Virtual camera integration
- [ ] Real-time preview streaming

## 🛠️ Available Modules

### Currently Active
- **Casting Room** (`/casting`) - AI-powered casting with budget and schedule analysis
- **Asset Library** (`/assets`) - Digital asset management
- **Dashboard** (`/dashboard`) - Client portal and project overview

### Coming Soon
- Production Budget (`/production-budget`)
- Sound Design (`/sound-design`)
- Marketing & Distribution (`/marketing`)
- Visual Effects (`/visual-effects`)
- Color Grading (`/color-grading`)
- Scheduling (`/scheduling`)
- Asset Management (`/asset-management`)
- Analytics (`/analytics`)
- Settings (`/settings`)

## 🔑 Environment Variables

Create a `.env` file in the root directory:

```env
# Frontend API URL
VITE_API_URL=http://localhost:4000

# AI API Keys
ANTHROPIC_API_KEY=your_claude_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# Database (handled by Encore)
# Encore automatically manages database connections

# Optional: Unreal Engine
UNREAL_WEBSOCKET_URL=ws://localhost:8080
```

## 📚 Documentation

- **[Complete Installation Guide](./INSTALLATION.md)** - Mac, Windows, Linux, Unreal Engine
- **[Features Guide](./FEATURES.md)** - All features and what's clickable
- **[Deployment Session](./DEPLOYMENT_SESSION.md)** - Production deployment details
- [Integration Guide](./INTEGRATION_COMPLETE.md)
- [API Documentation](./docs/api.md) (Coming Soon)
- [Component Library](./docs/components.md) (Coming Soon)

## 🤝 Contributing

This is a proprietary project for Finesse Jones Digital Studio. For inquiries, please contact the development team.

## 📄 License

Proprietary - All rights reserved © Finesse Jones

## 🎨 Credits

**Built by Finesse Jones**
- Vision-Driven Production
- Creator-Led Innovation  
- Built To Empower Bold Creators

---

**Powered by:**
- React 19
- TypeScript
- Encore.dev
- Claude AI (Anthropic)
- Unreal Engine 5
- Tailwind CSS v4

*Transforming digital production through AI and cutting-edge technology.*
