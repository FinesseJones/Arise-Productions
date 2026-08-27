// ==============================================================================
// ARISE PRODUCTION STUDIO - MASTER VIDEO WALKTHROUGH & DEMO GENERATOR
// A PRODUCT OF THE AI CONTENT FOUNDRY, LLC • © 2026 • ALL RIGHTS RESERVED
// ==============================================================================

import fs from 'fs';
import path from 'path';
import { exec, execSync } from 'child_process';
import { promisify } from 'util';
import { fileURLToPath } from 'url';

const execPromise = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const FRAMES_DIR = path.join(ROOT_DIR, 'scratch/demo_frames');
const OUTPUT_MP4 = path.join(ROOT_DIR, 'docs/assets/arise_studio_walkthrough_demo.mp4');
const PUBLIC_MP4 = path.join(ROOT_DIR, 'frontend/public/videos/arise_studio_walkthrough_demo.mp4');

if (!fs.existsSync(FRAMES_DIR)) fs.mkdirSync(FRAMES_DIR, { recursive: true });
if (!fs.existsSync(path.dirname(OUTPUT_MP4))) fs.mkdirSync(path.dirname(OUTPUT_MP4), { recursive: true });
if (!fs.existsSync(path.dirname(PUBLIC_MP4))) fs.mkdirSync(path.dirname(PUBLIC_MP4), { recursive: true });

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const SLIDES = [
  {
    id: 1,
    tag: 'STUDIO OVERVIEW • THE AI CONTENT FOUNDRY, LLC',
    title: 'ARISE PRODUCTION STUDIO',
    subtitle: 'Hollywood 10-Stage Virtual Production Soundstage & Real-Time Engine',
    accent: '#FBBF24',
    cards: [
      {
        badge: 'ENTERPRISE PIPELINE',
        heading: 'Complete 10-Stage Virtual Studio',
        text: 'From concept and scriptwriting to 3D previs, motion kinematics, 5.1 Atmos sound, and global distribution in a unified interface.'
      },
      {
        badge: 'BLACKMAGIC & ACEScg',
        heading: 'Optical Camera & Color Calibration',
        text: 'Blackmagic Pocket Cinema Camera 4K (BMPCC 4K) sensor simulation, Gen 5 Film Color Science, and Kodak 2383 ACEScc color transforms.'
      },
      {
        badge: 'AI SPECIALIST AGENTS',
        heading: 'Showrunner Sterling & 10 Dept Leads',
        text: 'Autonomous AI specialists assist across Screenwriting, Cork Board Structure, Casting, Location Scouting, Dailies QC, and EPK Generation.'
      }
    ],
    footer: '© 2026 Arise Production • Proprietary Studio Operating System'
  },
  {
    id: 2,
    tag: 'SYSTEM ARCHITECTURE & NAVIGATION',
    title: 'THE 10-STAGE HOLLYWOOD FRAMEWORK',
    subtitle: 'Real-Time Stage Navigation, 3D Soundstages & Telemetry',
    accent: '#EC4899',
    cards: [
      {
        badge: 'STAGE 01 - 04',
        heading: 'Pre-Production & Previs',
        text: 'Stage 01 ScriptBreak ➔ Stage 02 Structure Cork Board ➔ Stage 03 Master Canvas (Color/Lighting) ➔ Stage 04 Blockout Soundstage.'
      },
      {
        badge: 'STAGE 05 - 08',
        heading: 'Production & Dailies',
        text: 'Stage 05 Motion Previs (52-Pt Mocap) ➔ Stage 06 3D Diffusion Slate ➔ Stage 07 Dailies QC Suite ➔ Stage 08 Stem Studio 5.1 Atmos.'
      },
      {
        badge: 'STAGE 09 - 10',
        heading: 'Post, Conform & Distribution',
        text: 'Stage 09 Multi-Track Timeline & DaVinci Conform ➔ Stage 10 Global Distribution, Screener DRM & Multi-Agent Video Review.'
      }
    ],
    footer: 'Real-Time Telemetry: 🟢 Locked | 🟡 In-Progress | ⚪ Standby'
  },
  {
    id: 3,
    tag: 'CONCEPT LAB • INGESTION ENGINE',
    title: '00 IDEA LAB & MULTI-FORMAT INGEST',
    subtitle: 'YouTube, TikTok, Social Links & Script Folder Batch Ingestion',
    accent: '#3B82F6',
    cards: [
      {
        badge: 'LINK INGESTION',
        heading: 'Social Media to Cinema Adaptation',
        text: 'Paste YouTube, TikTok, or Instagram URLs. Showrunner Sterling extracts narrative hooks, 3-Act spines, and character profiles.'
      },
      {
        badge: 'FOLDER INGESTION',
        heading: 'Batch Screenplay Discovery',
        text: 'Auto-scan folders of .fountain, .docx, .txt, and .md manuscripts. Automatically seeds scripts, character bibles, and shot lists.'
      },
      {
        badge: 'GREENLIGHT ACTION',
        heading: 'One-Click Make & Greenlight',
        text: 'Promotes ingested concepts directly into active 10-stage productions with persistent database records and shot manifests.'
      }
    ],
    footer: 'Supported Formats: Long-Form Theatrical (2.39:1), Episodic TV, and Short-Form Viral (9:16)'
  },
  {
    id: 4,
    tag: 'STAGE 01 • SCREENPLAY ENGINE',
    title: 'STAGE 1: SCRIPTBREAK & FOUNTAIN EDITOR',
    subtitle: 'Fountain Formatting, Scripture Alignment & AI Script Doctor',
    accent: '#10B981',
    cards: [
      {
        badge: 'FOUNTAIN SYNTAX',
        heading: 'Full-Featured Screenplay Suite',
        text: 'Live screenplay editing with auto-sluglines, dialogue capitalization, parentheticals, transitions, and scene pagination.'
      },
      {
        badge: 'SCRIPTURE GROUNDING',
        heading: 'TACF Scripture & Bible Integrity',
        text: 'Character dialogue and moral arguments strictly aligned with biblical scriptures and historical documentation without outside dilution.'
      },
      {
        badge: 'PERSISTENCE',
        heading: 'Auto-Sync & File Storage',
        text: 'Screenplays are saved directly to project disk storage and synced to the unified production database on every keystroke.'
      }
    ],
    footer: 'Stage 01 Status: 🟢 Script breakdown locked and ready for structural analysis'
  },
  {
    id: 5,
    tag: 'STAGE 02 • NARRATIVE STRUCTURE',
    title: 'STAGE 2: CORK BOARD NARRATIVE SPINE',
    subtitle: '3-Act Structure, Beat Cards & AI Beat Generation',
    accent: '#8B5CF6',
    cards: [
      {
        badge: '3-ACT SPINE',
        heading: 'Dynamic Act Breakdown',
        text: 'Act I (Setup & Catalyst), Act II (Rising Conflict & Midpoint Stakes), and Act III (Climax & Moral Resolution).'
      },
      {
        badge: 'AI BEAT WRITER',
        heading: 'Llama 3.1 70B Generation',
        text: 'Click "Generate Beat" on any scene card to draft vivid, cinematic narrative descriptions and emotional character stakes.'
      },
      {
        badge: 'BEAT MANAGEMENT',
        heading: 'Interactive Cork Board',
        text: 'Add, edit, reorder, or delete beat cards across the production timeline with live auto-save.'
      }
    ],
    footer: 'Stage 02 Status: 🟢 Narrative spine established across 4 scene acts'
  },
  {
    id: 6,
    tag: 'STAGE 03 • ART DIRECTION & COLOR',
    title: 'STAGE 3: MASTER CANVAS & COLOR HARMONY',
    subtitle: 'ACEScg Color Gamuts, Lighting Ratios & Unreal 5.4 Presets',
    accent: '#F59E0B',
    cards: [
      {
        badge: 'ACEScg GAMUT',
        heading: 'Film-Grade Color Profiles',
        text: 'Calibrated AP1 / AP0 swatches: Amber Morning Mist, Royal Amethyst, Rose Gold Rim Flare, and Warm Cedar.'
      },
      {
        badge: 'LIGHTING RATIOS',
        heading: 'High-Contrast Optical Setup',
        text: '4:1 Key-to-Shadow ratios with 3200K warm tungsten keys and 5600K cool cyan ambient fill lighting.'
      },
      {
        badge: 'ART RECALIBRATION',
        heading: 'Instant AI Color Recalibration',
        text: 'Recalibrates wardrobe, surface textures, and camera LUTs for seamless Unreal Engine 5.4 photorealism.'
      }
    ],
    footer: 'Stage 03 Status: 🟢 ACEScg AP1 color profiles locked for virtual render pipeline'
  },
  {
    id: 7,
    tag: 'STAGE 04 • VIRTUAL CINEMATOGRAPHY',
    title: 'STAGE 4: BLOCKOUT PREVIS SOUNDSTAGE',
    subtitle: 'Physical BMPCC 4K Solver, Prime Lenses & DaVinci / UE5 Bridge',
    accent: '#EC4899',
    cards: [
      {
        badge: 'BMPCC 4K SOLVER',
        heading: 'Physical Sensor Choreography',
        text: 'Micro Four Thirds 1.9x crop sensor optics with Dual Native ISO (400/3200) and Gen 5 Film Color Science.'
      },
      {
        badge: 'PRIME OPTICS',
        heading: 'Focal Length Selection',
        text: 'Select 24mm Wide, 35mm Prime, 50mm Standard, or 85mm Portrait Close-Up with accurate optical depth of field.'
      },
      {
        badge: 'LIVE BRIDGES',
        heading: 'DaVinci 19 & Unreal 5.4 Live Link',
        text: 'One-click launch for DaVinci Resolve Studio 19 and WebSocket Live Link to Unreal Engine Remote Control on :30010.'
      }
    ],
    footer: 'Stage 04 Status: 🟢 3D camera vectors & 35mm optical trajectories locked'
  },
  {
    id: 8,
    tag: 'STAGE 05 • MOCAP & KINEMATICS',
    title: 'STAGE 5: MOTION PREVIS & KINEMATICS',
    subtitle: '52-Point Skeletal Trajectories, Ragdoll Physics & Interpolation',
    accent: '#06B6D4',
    cards: [
      {
        badge: '52-POINT SOLVER',
        heading: 'Full Skeletal Kinematics',
        text: 'Calculates joint angle constraints, velocity damping, and realistic center-of-mass weight shifts.'
      },
      {
        badge: 'PHYSICS CONTROLS',
        heading: 'Dynamic Motion Parameters',
        text: 'Fine-tune Joint Stiffness (72%), Velocity Damping (85%), Gravitational Acceleration (9.81 m/s²), and 60 FPS sampling.'
      },
      {
        badge: '3D PREVIS GRID',
        heading: 'Interactive Soundstage Viewport',
        text: 'Inspect character trajectories directly on the virtual 3D floor with real-time vector coordinates.'
      }
    ],
    footer: 'Stage 05 Status: 🟢 Motion kinematics solved for lead character choreography'
  },
  {
    id: 9,
    tag: 'STAGE 06 • DIFFUSION PROMPT PACKS',
    title: 'STAGE 6: 3D DIFFUSION SLATE & PROMPTS',
    subtitle: 'Continuity-Locked Slates for Midjourney, FLUX & HyperFrames',
    accent: '#A855F7',
    cards: [
      {
        badge: 'MODEL SELECTION',
        heading: 'Multi-Model Diffusion Engine',
        text: 'Compile bespoke continuity prompt packs for Midjourney v6, FLUX.1 Pro, SDXL Turbo, and HyperFrames.'
      },
      {
        badge: 'TRIPLE-TIER PROMPTS',
        heading: 'Structured Scene Slates',
        text: 'Generates Subject & Lighting Prompts, Environmental Context, and Negative Prompt Embeddings.'
      },
      {
        badge: 'WORKFLOW EXPORT',
        heading: 'One-Click Continuity Copy',
        text: 'Copy formatted prompt packs to clipboard or send directly to image generation workers in ComfyUI / Stable Diffusion.'
      }
    ],
    footer: 'Stage 06 Status: 🟢 Diffusion prompt slates compiled for all production shots'
  },
  {
    id: 10,
    tag: 'STAGE 07 • QUALITY CONTROL',
    title: 'STAGE 7: 3D DAILIES & CIRCLE TAKE REVIEW',
    subtitle: 'Quality Gate Scoring, Likeness Locking & A/B Take Comparison',
    accent: '#10B981',
    cards: [
      {
        badge: 'AI QUALITY GATE',
        heading: 'Continuity & Likeness Scoring',
        text: 'Scores spatial lighting continuity, character likeness accuracy (rated 9.8 / 10), and micro-jitter artifact detection.'
      },
      {
        badge: 'TAKE SELECTION',
        heading: 'Circle Take Management',
        text: 'Compare Take A (9.8/10), Take B (8.4/10), and Take C (7.9/10). Flag director favorites for the master conform.'
      },
      {
        badge: 'TELEMETRY',
        heading: 'Render Pass Inspection',
        text: 'Displays frame counts, resolution (4K DCI), sensor color space, and pass status in real-time.'
      }
    ],
    footer: 'Stage 07 Status: 🟢 Circle Take 1 verified and approved for stem assembly'
  },
  {
    id: 11,
    tag: 'STAGE 08 • SPATIAL AUDIO',
    title: 'STAGE 8: STEM STUDIO 5.1 ATMOS SOUND',
    subtitle: '4-Track Stem Console, Spatial Foley & -24.0 LKFS Broadcast Loudness',
    accent: '#6366F1',
    cards: [
      {
        badge: '4-TRACK CONSOLE',
        heading: 'Dedicated Audio Channels',
        text: 'Individual fader control for Dialogue Center Isolation, Spatial Ambient Foley, Orchestral Score Swell, and 40Hz Sub Pulse.'
      },
      {
        badge: 'BROADCAST COMPLIANCE',
        heading: '-24.0 LKFS EBU R128 Standard',
        text: 'Built-in real-time loudness metering ensures true theatrical and streaming platform broadcast compliance.'
      },
      {
        badge: 'AI SOUND SUPERVISOR',
        heading: 'Automated Spatial Balance',
        text: 'Click "Synthesize 5.1 Mix" to balance dialogue clarity and spatial room acoustic reverb automatically.'
      }
    ],
    footer: 'Stage 08 Status: 🟢 5.1 Dolby Atmos surround sound profile mastered'
  },
  {
    id: 12,
    tag: 'STAGE 09 • TIMELINE CONFORM',
    title: 'STAGE 9: MULTI-TRACK EDIT & CONFORM',
    subtitle: 'DaVinci Resolve MCP, XML/EDL Timeline & 3D LUT Previews',
    accent: '#E11D48',
    cards: [
      {
        badge: 'TIMELINE CONFORM',
        heading: 'Multi-Cam NLE Timeline',
        text: 'Timeline visualization with cut points, transition wipes, and frame-accurate SMPTE timecode (00:00:00:00).'
      },
      {
        badge: 'EDL / XML SYNC',
        heading: 'Industry Standard Interchange',
        text: 'Import and export Final Cut Pro XML, CMX 3600 EDL, and DaVinci Resolve project archives seamlessly.'
      },
      {
        badge: 'FILM LUTS',
        heading: 'Real-Time Color Shaders',
        text: 'Toggle Kodak 2383, Fuji Eterna, and Arri Rec709 3D LUT transforms directly on the editing monitor.'
      }
    ],
    footer: 'Stage 09 Status: 🟢 Master timeline conformed and ready for distribution packaging'
  },
  {
    id: 13,
    tag: 'STAGE 10 • DISTRIBUTION & MARKETING',
    title: 'GLOBAL DISTRIBUTION & SCREENERS',
    subtitle: 'Multi-Agent Video Commentary, Hollywood EPK & Forensic Screeners',
    accent: '#D97706',
    cards: [
      {
        badge: 'VIDEO COMMENTARY',
        heading: 'Multi-Agent Timecoded Review',
        text: 'Pause playback at any timestamp to receive instant synchronized reviews from Vance Morgan (Distribution), Chloe Sterling (Marketing), and Maya (DP).'
      },
      {
        badge: 'HOLLYWOOD EPK',
        heading: 'Electronic Press Kit Generator',
        text: 'One-click generation of 1-line hooks, festival synopses, director statements, actor bios, taglines, and poster key-art concepts.'
      },
      {
        badge: 'FORENSIC SCREENER',
        heading: 'Watermarked DRM Distribution',
        text: 'Generates secure, recipient-watermarked screening packages and 3-phase worldwide theatrical & SVOD roadmaps.'
      }
    ],
    footer: 'Stage 10 Status: 🟢 Distribution package locked for Sundance, Cannes & Theatrical'
  },
  {
    id: 14,
    tag: 'ENTERPRISE ECOSYSTEM • 3-WAY SYNCHRONIZATION',
    title: 'ARISE PRODUCTION STUDIO • READY TO CREATE',
    subtitle: 'GitHub Repository, Native Desktop App & High-Performance Cloud VPS',
    accent: '#FBBF24',
    cards: [
      {
        badge: '3-WAY SYNC',
        heading: 'Synchronized Everywhere',
        text: 'Every feature and script is mirrored across GitHub (FinesseJones/Arise-Productions), macOS Desktop App, and VPS (2.25.113.26).'
      },
      {
        badge: 'ENTERPRISE $299/MO',
        heading: 'Full Production Suite',
        text: 'Custom AI fine-tunes, dedicated GPU clusters, physical Blackmagic connectors, and on-premise soundstage links.'
      },
      {
        badge: 'GET STARTED',
        heading: 'Launch Your Masterpiece',
        text: 'Open the Desktop App or visit http://2.25.113.26:4000 to direct your next feature film or series today.'
      }
    ],
    footer: 'THE AI CONTENT FOUNDRY, LLC • © 2026 • ALL RIGHTS RESERVED'
  }
];

function generateSlideHtml(slide) {
  const cardsHtml = slide.cards.map((c) => `
    <div class="card">
      <div class="badge" style="color: ${slide.accent}; border-color: ${slide.accent}40; background: ${slide.accent}15;">${c.badge}</div>
      <h3 class="card-title">${c.heading}</h3>
      <p class="card-text">${c.text}</p>
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    body {
      width: 1920px;
      height: 1080px;
      background: radial-gradient(circle at 50% 20%, #160D38 0%, #080512 60%, #030208 100%);
      color: #F8FAFC;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 60px 80px;
      overflow: hidden;
      position: relative;
    }
    body::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background-image: 
        linear-gradient(rgba(245, 158, 11, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(245, 158, 11, 0.03) 1px, transparent 1px);
      background-size: 60px 60px;
      pointer-events: none;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(251, 191, 36, 0.2);
      padding-bottom: 25px;
      z-index: 10;
    }
    .logo-group {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .logo-badge {
      width: 56px;
      height: 56px;
      border-radius: 16px;
      background: linear-gradient(135deg, #F59E0B, #B45309);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      font-weight: 900;
      color: #000;
      box-shadow: 0 0 25px rgba(245, 158, 11, 0.4);
    }
    .brand-title {
      font-size: 24px;
      font-weight: 900;
      letter-spacing: 2px;
      background: linear-gradient(90deg, #FFF0C2, #FBBF24, #F59E0B);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-transform: uppercase;
    }
    .brand-sub {
      font-size: 13px;
      color: #E2BA86;
      font-family: monospace;
      letter-spacing: 1px;
    }
    .slide-num {
      font-size: 16px;
      font-family: monospace;
      padding: 8px 18px;
      border-radius: 20px;
      background: rgba(251, 191, 36, 0.1);
      border: 1px solid rgba(251, 191, 36, 0.3);
      color: #FBBF24;
      font-weight: bold;
    }
    .content {
      z-index: 10;
      margin-top: 10px;
    }
    .tag {
      display: inline-block;
      font-size: 14px;
      font-family: monospace;
      font-weight: 800;
      color: ${slide.accent};
      letter-spacing: 2.5px;
      margin-bottom: 12px;
      text-transform: uppercase;
    }
    .title {
      font-size: 58px;
      font-weight: 900;
      line-height: 1.1;
      letter-spacing: 1px;
      margin-bottom: 14px;
      background: linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 60%, #94A3B8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .subtitle {
      font-size: 22px;
      color: #CBD5E1;
      font-weight: 400;
      line-height: 1.4;
      max-width: 1400px;
      margin-bottom: 40px;
    }
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 30px;
      z-index: 10;
    }
    .card {
      background: rgba(20, 14, 46, 0.7);
      border: 1px solid rgba(251, 191, 36, 0.15);
      border-radius: 20px;
      padding: 35px 30px;
      backdrop-filter: blur(16px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      height: 320px;
      transition: all 0.3s ease;
    }
    .badge {
      display: inline-block;
      align-self: flex-start;
      font-size: 11px;
      font-family: monospace;
      font-weight: 800;
      padding: 4px 12px;
      border-radius: 12px;
      border: 1px solid;
      margin-bottom: 18px;
      letter-spacing: 1px;
    }
    .card-title {
      font-size: 24px;
      font-weight: 800;
      color: #FFFFFF;
      margin-bottom: 14px;
      line-height: 1.25;
    }
    .card-text {
      font-size: 16px;
      color: #94A3B8;
      line-height: 1.6;
    }
    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding-top: 20px;
      font-size: 14px;
      color: #64748B;
      font-family: monospace;
      z-index: 10;
    }
    .active-dot {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #10B981;
      box-shadow: 0 0 10px #10B981;
      margin-right: 8px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo-group">
      <div class="logo-badge">🎬</div>
      <div>
        <div class="brand-title">ARISE PRODUCTION STUDIO</div>
        <div class="brand-sub">THE AI CONTENT FOUNDRY, LLC • ENTERPRISE OS</div>
      </div>
    </div>
    <div class="slide-num">MODULE ${String(slide.id).padStart(2, '0')} / 14</div>
  </div>

  <div class="content">
    <div class="tag">${slide.tag}</div>
    <div class="title">${slide.title}</div>
    <div class="subtitle">${slide.subtitle}</div>

    <div class="cards-grid">
      ${cardsHtml}
    </div>
  </div>

  <div class="footer">
    <div><span class="active-dot"></span>${slide.footer}</div>
    <div>10-STAGE HOLLYWOOD VIRTUAL PRODUCTION PIPELINE</div>
  </div>
</body>
</html>`;
}

async function renderSlidesToImages() {
  console.log('🎨 [1/3] Generating 1080p HTML slides and rendering in parallel batches...');
  
  // Render in parallel batches of 4
  const batchSize = 4;
  for (let i = 0; i < SLIDES.length; i += batchSize) {
    const batch = SLIDES.slice(i, i + batchSize);
    await Promise.all(batch.map(async (slide) => {
      const htmlFile = path.join(FRAMES_DIR, `slide_${String(slide.id).padStart(2, '0')}.html`);
      const pngFile = path.join(FRAMES_DIR, `slide_${String(slide.id).padStart(2, '0')}.png`);
      const userDir = `/tmp/arise_demo_profile_${slide.id}`;
      
      fs.writeFileSync(htmlFile, generateSlideHtml(slide), 'utf8');
      console.log(`📸 Rendering Slide ${slide.id}/14: "${slide.title}"...`);
      
      const cmd = `"${CHROME_PATH}" --headless=new --disable-gpu --user-data-dir="${userDir}" --screenshot="${pngFile}" --window-size=1920,1080 "file://${htmlFile}"`;
      await execPromise(cmd);
    }));
  }

  console.log('✅ All 14 1080p high-definition slide frames rendered!');
}

function compileVideoWithFFmpeg() {
  console.log('🎬 [2/3] Compiling 1080p 30FPS MP4 video with FFmpeg & audio track...');

  const concatListFile = path.join(FRAMES_DIR, 'input.txt');
  let concatContent = '';

  for (let i = 1; i <= 14; i++) {
    const filename = `slide_${String(i).padStart(2, '0')}.png`;
    concatContent += `file '${filename}'\nduration 6\n`;
  }
  concatContent += `file 'slide_14.png'\n`;
  fs.writeFileSync(concatListFile, concatContent, 'utf8');

  const audioBed = path.join(FRAMES_DIR, 'ambient_bed.aac');
  const audioCmd = `ffmpeg -y -f lavfi -i "sine=frequency=110:duration=86" -f lavfi -i "sine=frequency=220:duration=86" -filter_complex "[0:a]volume=0.15[a0];[1:a]volume=0.08[a1];[a0][a1]amix=inputs=2:duration=first[aout]" -c:a aac -b:a 192k "${audioBed}"`;
  execSync(audioCmd, { stdio: 'ignore' });

  const ffmpegCmd = `ffmpeg -y -f concat -safe 0 -i "${concatListFile}" -i "${audioBed}" -vf "fps=30,format=yuv420p" -c:v libx264 -preset slow -crf 18 -c:a aac -b:a 192k -shortest "${OUTPUT_MP4}"`;
  execSync(ffmpegCmd, { stdio: 'inherit' });

  fs.copyFileSync(OUTPUT_MP4, PUBLIC_MP4);
  console.log(`✅ [3/3] Demo Video successfully generated at:`);
  console.log(`   1. ${OUTPUT_MP4}`);
  console.log(`   2. ${PUBLIC_MP4}`);
}

async function main() {
  try {
    await renderSlidesToImages();
    compileVideoWithFFmpeg();
  } catch (err) {
    console.error('❌ Failed to generate walkthrough video:', err);
    process.exit(1);
  }
}

main();
