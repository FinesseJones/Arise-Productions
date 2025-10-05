# Unified 3D Production Studio - Complete Feature Guide

## 🎬 What Should Be Working

### **Homepage (`/`)**
**Interactive Elements:**
- ✅ "Start Your Project" button → navigates to `/dashboard`
- ✅ "View Portfolio" button → navigates to `/portfolio`
- ✅ Navigation menu (top) → links to all main pages
- ✅ "Start Project" button in nav → navigates to `/dashboard`

### **Dashboard (`/dashboard`)**
**Features:**
- ✅ View all projects (fetched from backend API)
- ✅ Create new project button → opens dialog
- ✅ Project creation form (title, description, genre)
- ✅ Project cards with status badges
- ✅ Progress bars showing project completion
- ✅ Click project card → navigate to project detail page
- ✅ AI Agent cards → links to AI features
- ✅ Production module shortcuts

**API Calls:**
- `GET /projects` - List all projects
- `POST /projects` - Create new project

### **Portfolio (`/portfolio`)**
**Features:**
- Portfolio showcase page
- Project gallery
- Filter/sort options

###  **Services (`/services`)**
**Features:**
- Service packages display
- Pricing information
- Contact forms

### **Asset Library (`/assets`)**
**Features:**
- File management system
- Upload files
- Browse project assets
- Download files

### **AI Team Studio (`/ai-team`)**
**Features:**
- Chat with 8 AI agents:
  1. Screenwriting Assistant
  2. Script Supervisor
  3. Casting Director
  4. Production Coordinator
  5. Virtual Camera Operator
  6. Post-Production Supervisor
  7. Distribution Desk
  8. Studio Forms Generator
- Real-time chat interface
- Agent selection
- Chat history

**API Calls:**
- `GET /agent/list` - Get all AI agents
- `POST /agent/chat` - Send message to agent
- `GET /agent/history` - Get chat history

### **Production Modules**

#### **Casting (`/casting`)**
- Generate casting profiles
- Analyze self-tapes
- Create audition sides

#### **Production Budget (`/production-budget`)**
- Budget planning tools
- Cost tracking
- Financial reports

#### **Sound Design (`/sound-design`)**
- Audio planning
- Sound effect management

#### **Marketing (`/marketing`)**
- Press kit generation
- Release strategy planning
- Marketing materials

#### **Visual Effects (`/visual-effects`)**
- VFX planning
- Shot breakdowns
- Technical specifications

#### **Color Grading (`/color-grading`)**
- Color grade planning
- Style references
- LUT management

#### **Scheduling (`/scheduling`)**
- Production calendar
- Call sheets
- Shooting schedule

#### **Analytics (`/analytics`)**
- Project metrics
- Performance tracking
- Reports

#### **Settings (`/settings`)**
- User preferences
- API configuration
- Account settings

### **Project-Specific Pages**

#### **Project Detail (`/project/:id`)**
- View project details
- Update project status
- Manage project files
- Access project-specific tools

#### **Writing Room (`/writing-room/:id`)**
- Collaborative script writing
- Multiple AI perspectives
- Real-time collaboration

#### **Editing Suite (`/editing-suite/:id`)**
- Video editing tools
- Timeline management
- Export options

#### **Script Editor (`/script-editor/:id`)**
- Script writing interface
- Formatting tools
- Version control

#### **Platform Optimizer (`/platform-optimizer/:id`)**
- Platform-specific optimization
- Format conversion
- Distribution preparation

---

## 🔌 Backend API Endpoints

### **Projects**
- `GET /projects` - List all projects
- `POST /projects` - Create new project
- `GET /projects/:id` - Get project details
- `PUT /projects/:id/status` - Update project status
- `DELETE /projects/:id` - Delete project

### **Project Files**
- `GET /projects/:id/files` - List project files
- `POST /projects/:id/files` - Upload file
- `PUT /projects/files/:fileId` - Update file
- `DELETE /projects/files/:fileId` - Delete file

### **AI Agents**
- `POST /ai/screenwriting/generate` - Generate screenplay
- `POST /ai/screenwriting/edit` - Edit script
- `POST /ai/screenwriting/convert-novel` - Convert novel to script
- `POST /ai/screenwriting/writing-room` - Create writing room session
- `POST /ai/casting/profile` - Generate casting profile
- `POST /ai/casting/analyze-tape` - Analyze audition
- `POST /ai/casting/audition-sides` - Generate audition sides
- `POST /ai/production/call-sheet` - Generate call sheet
- `POST /ai/production/calendar` - Generate production calendar
- `POST /ai/production/shot-list` - Generate shot list
- `POST /ai/virtual-camera/storyboard` - Generate storyboard
- `POST /ai/virtual-camera/previs` - Generate previsualization
- `POST /ai/virtual-camera/simulate` - Simulate camera shot
- `POST /ai/editing/session/start` - Start editing session
- `POST /ai/editing/apply` - Apply edit
- `POST /ai/editing/color-grade` - Apply color grade
- `POST /ai/editing/audio-mix` - Apply audio mix
- `POST /ai/editing/vfx` - Apply VFX
- `POST /ai/editing/export` - Export edit
- `POST /ai/post-production/edit-notes` - Generate edit notes
- `POST /ai/post-production/vfx-handoff` - Generate VFX handoff
- `POST /ai/post-production/version-tracking` - Track versions
- `POST /ai/platform/optimize` - Optimize for platform
- `POST /ai/platform/export` - Export platform package
- `POST /ai/distribution/release-strategy` - Generate release strategy
- `POST /ai/distribution/press-kit` - Generate press kit
- `POST /ai/distribution/screener` - Generate screener
- `POST /ai/forms/generate` - Generate form
- `POST /ai/forms/package` - Generate form package
- `POST /ai/script-supervisor/breakdown` - Generate script breakdown
- `POST /ai/script-supervisor/shooting-script` - Generate shooting script
- `POST /ai/script-supervisor/continuity` - Check continuity

---

## 🐛 Troubleshooting

### If buttons don't work:
1. Check browser console for JavaScript errors (F12 → Console tab)
2. Verify you're on the correct URL
3. Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
4. Check network tab to see if API calls are being made

### If API calls fail:
1. Verify backend is running: https://staging-unified3dproduction-dazi.encr.app/
2. Check network tab for failed requests
3. Verify CORS settings allow your frontend domain
4. Check that API keys are configured in Encore Cloud

### Common Issues:
- **Blank page**: JavaScript error - check console
- **Buttons do nothing**: Event handlers not attached - check for errors
- **API errors**: Backend not connected or secrets not configured
- **Routing issues**: React Router not initialized properly

---

## 📍 Deployed URLs

**Frontend:** https://frontend-4tbraajrw-finesse-jones-projects-287f926d.vercel.app
**Backend API:** https://staging-unified3dproduction-dazi.encr.app
**Encore Dashboard:** https://app.encore.cloud/unified3dproduction-dazi

---

**Last Updated:** October 5, 2025
