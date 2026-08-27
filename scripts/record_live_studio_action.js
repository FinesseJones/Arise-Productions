// ==============================================================================
// ARISE PRODUCTION STUDIO - LIVE ACTION STUDIO SCREENCAST RECORDER
// ==============================================================================

import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const CAPTURE_DIR = path.join(ROOT_DIR, 'scratch/live_captures');
const OUTPUT_MP4 = path.join(ROOT_DIR, 'docs/assets/arise_studio_walkthrough_demo.mp4');
const PUBLIC_MP4 = path.join(ROOT_DIR, 'frontend/public/videos/arise_studio_walkthrough_demo.mp4');
const OUTPUT_GIF = path.join(ROOT_DIR, 'docs/assets/arise_studio_demo_preview.gif');

if (!fs.existsSync(CAPTURE_DIR)) fs.mkdirSync(CAPTURE_DIR, { recursive: true });

let frameIndex = 0;

async function captureFrame(page, bannerText = '') {
  frameIndex++;
  const filename = path.join(CAPTURE_DIR, `frame_${String(frameIndex).padStart(5, '0')}.png`);
  
  if (bannerText) {
    await page.evaluate((text) => {
      let banner = document.getElementById('studio-recording-banner');
      if (!banner) {
        banner = document.createElement('div');
        banner.id = 'studio-recording-banner';
        banner.style.position = 'fixed';
        banner.style.top = '14px';
        banner.style.left = '50%';
        banner.style.transform = 'translateX(-50%)';
        banner.style.zIndex = '999999';
        banner.style.background = 'linear-gradient(135deg, rgba(20, 14, 46, 0.96), rgba(8, 5, 18, 0.96))';
        banner.style.border = '1px solid rgba(251, 191, 36, 0.5)';
        banner.style.boxShadow = '0 0 35px rgba(251, 191, 36, 0.35), 0 10px 25px rgba(0,0,0,0.85)';
        banner.style.borderRadius = '30px';
        banner.style.padding = '10px 26px';
        banner.style.display = 'flex';
        banner.style.alignItems = 'center';
        banner.style.gap = '14px';
        banner.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        banner.style.backdropFilter = 'blur(16px)';
        document.body.appendChild(banner);
      }
      banner.innerHTML = `
        <span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:#10B981; box-shadow:0 0 10px #10B981;"></span>
        <span style="font-size:12px; font-weight:900; color:#FBBF24; letter-spacing:1.5px; font-family:monospace;">LIVE ACTION WALKTHROUGH</span>
        <span style="color:#64748B; font-size:12px;">|</span>
        <span style="font-size:14px; font-weight:700; color:#FFFFFF;">${text}</span>
      `;
    }, bannerText);
  }

  await page.screenshot({ path: filename });
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function recordAction(page, bannerText, durationMs = 2000, fps = 4) {
  const steps = Math.max(1, Math.floor((durationMs / 1000) * fps));
  const interval = durationMs / steps;
  for (let i = 0; i < steps; i++) {
    await captureFrame(page, bannerText);
    await sleep(interval);
  }
}

async function clickByText(page, texts) {
  return await page.evaluate((textList) => {
    const list = Array.isArray(textList) ? textList : [textList];
    const all = Array.from(document.querySelectorAll('button, div[role="button"], a, h3, div'));
    for (const t of list) {
      const match = all.find(el => el.innerText && el.innerText.trim().toLowerCase().includes(t.toLowerCase()));
      if (match) {
        match.click();
        return true;
      }
    }
    return false;
  }, texts);
}

async function runStudioWalkthrough() {
  console.log('🎬 [1/3] Launching Live Studio Recording with Puppeteer...');
  
  const oldFiles = fs.readdirSync(CAPTURE_DIR);
  for (const file of oldFiles) {
    if (file.endsWith('.png')) fs.unlinkSync(path.join(CAPTURE_DIR, file));
  }
  frameIndex = 0;

  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--window-size=1920,1080',
      '--disable-gpu',
      '--hide-scrollbars'
    ],
    defaultViewport: { width: 1920, height: 1080 }
  });

  const page = await browser.newPage();
  console.log('🌐 Loading Live Studio at http://2.25.113.26:4000 ...');
  await page.goto('http://2.25.113.26:4000', { waitUntil: 'networkidle2', timeout: 30000 });
  await sleep(2500);

  // --------------------------------------------------------------------------
  // SCENE 1: Splash Screen & Launching Production
  // --------------------------------------------------------------------------
  console.log('🎬 Scene 1: Project Selection & Launch...');
  await recordAction(page, 'Step 1: Selecting & Launching Active 10-Stage Production', 3000);

  await clickByText(page, ['Launch', 'Enter Studio', 'Production', 'Fatherless', 'YouTube']);
  await sleep(2000);
  await recordAction(page, 'Entering Virtual Production Soundstage', 2500);

  // --------------------------------------------------------------------------
  // SCENE 2: 00 Idea Lab & IP Vault
  // --------------------------------------------------------------------------
  console.log('🎬 Scene 2: 00 Idea Lab & Ingestion...');
  await clickByText(page, ['Idea Lab', 'Idea', '00']);
  await sleep(1500);
  await recordAction(page, 'Stage 00: Idea Lab & IP Concept Vault', 3000);

  // Click Analyze Link Modal
  await clickByText(page, ['Analyze', 'Ingest', 'Social Link', 'YouTube']);
  await sleep(1500);
  await recordAction(page, 'Media Ingest: YouTube & Social Media Narrative Parser', 3500);

  // Close modal
  await clickByText(page, ['Close', 'Cancel', '✕']);
  await sleep(1000);

  // --------------------------------------------------------------------------
  // SCENE 3: Stage 1 - ScriptBreak Room
  // --------------------------------------------------------------------------
  console.log('🎬 Scene 3: Stage 1 Script Room...');
  await clickByText(page, ['Stage 1', 'ScriptBreak', 'Script']);
  await sleep(1500);
  await recordAction(page, 'Stage 01: ScriptBreak & Fountain Screenplay Editor', 4000);

  // --------------------------------------------------------------------------
  // SCENE 4: Stage 2 - Structure Cork Board
  // --------------------------------------------------------------------------
  console.log('🎬 Scene 4: Stage 2 Cork Board...');
  await clickByText(page, ['Stage 2', 'Structure', 'Cork Board', 'Cork']);
  await sleep(1500);
  await recordAction(page, 'Stage 02: 3-Act Narrative Cork Board & Beat Generator', 4000);

  // --------------------------------------------------------------------------
  // SCENE 5: Stage 3 - Master Canvas (Plan Room)
  // --------------------------------------------------------------------------
  console.log('🎬 Scene 5: Stage 3 Master Canvas...');
  await clickByText(page, ['Stage 3', 'Master Canvas', 'Plan']);
  await sleep(1500);
  await recordAction(page, 'Stage 03: Master Canvas & ACEScg AP1 Color Swatches', 4000);

  // --------------------------------------------------------------------------
  // SCENE 6: Stage 4 - Blockout Previs Soundstage (3D Viewport)
  // --------------------------------------------------------------------------
  console.log('🎬 Scene 6: Stage 4 Previs 3D...');
  await clickByText(page, ['Stage 4', 'Blockout', 'Previs']);
  await sleep(2000);
  await recordAction(page, 'Stage 04: Blockout Soundstage & BMPCC 4K Camera Solver', 4500);

  // --------------------------------------------------------------------------
  // SCENE 7: Stage 5 - Motion Previs Studio
  // --------------------------------------------------------------------------
  console.log('🎬 Scene 7: Stage 5 Motion...');
  await clickByText(page, ['Stage 5', 'Motion Previs', 'Motion']);
  await sleep(1500);
  await recordAction(page, 'Stage 05: Motion Previs & 52-Point Skeletal Kinematics', 4000);

  // --------------------------------------------------------------------------
  // SCENE 8: Stage 6 - Diffusion Slate & Prompt Room
  // --------------------------------------------------------------------------
  console.log('🎬 Scene 8: Stage 6 Prompt Slate...');
  await clickByText(page, ['Stage 6', 'Diffusion Slate', 'Prompt']);
  await sleep(1500);
  await recordAction(page, 'Stage 06: 3D Diffusion Slate & Continuity Prompt Packs', 4000);

  // --------------------------------------------------------------------------
  // SCENE 9: Stage 7 - Dailies QC Suite
  // --------------------------------------------------------------------------
  console.log('🎬 Scene 9: Stage 7 Dailies...');
  await clickByText(page, ['Stage 7', 'Dailies QC', 'Dailies']);
  await sleep(1500);
  await recordAction(page, 'Stage 07: 3D Dailies QC & Circle Take Likeness Review', 4000);

  // --------------------------------------------------------------------------
  // SCENE 10: Stage 8 - Stem Studio 5.1 Atmos Sound
  // --------------------------------------------------------------------------
  console.log('🎬 Scene 10: Stage 8 Sound...');
  await clickByText(page, ['Stage 8', '5.1 Atmos', 'Sound']);
  await sleep(1500);
  await recordAction(page, 'Stage 08: 5.1 Dolby Atmos 4-Track Stem Mixing Console', 4000);

  // --------------------------------------------------------------------------
  // SCENE 11: Stage 9 - Multi-Track Edit & Conform
  // --------------------------------------------------------------------------
  console.log('🎬 Scene 11: Stage 9 Edit...');
  await clickByText(page, ['Stage 9', 'Multi-Track', 'Edit']);
  await sleep(1500);
  await recordAction(page, 'Stage 09: Multi-Track NLE Timeline & 3D Kodak 2383 LUTs', 4000);

  // --------------------------------------------------------------------------
  // SCENE 12: Stage 10 - Distribution Suite & Marketing Agents
  // --------------------------------------------------------------------------
  console.log('🎬 Scene 12: Stage 10 Distribution...');
  await clickByText(page, ['Distribution', 'Marketing', 'Stage 10']);
  await sleep(1500);
  await recordAction(page, 'Stage 10: Distribution, Multi-Agent Commentary & Press Kit', 4500);

  // --------------------------------------------------------------------------
  // SCENE 13: Suites Hub & 10 Department Specialists
  // --------------------------------------------------------------------------
  console.log('🎬 Scene 13: Suites Hub...');
  await clickByText(page, ['Suites Hub', 'Department Specialists', 'Suites']);
  await sleep(1500);
  await recordAction(page, 'Original Suites Hub: 10 Department Specialist Microservices', 4000);

  // --------------------------------------------------------------------------
  // SCENE 14: Conclusion & Enterprise Soundstage
  // --------------------------------------------------------------------------
  console.log('🎬 Scene 14: Complete Studio Manifest...');
  await clickByText(page, ['Stage 1', 'ScriptBreak', 'Script']);
  await sleep(1500);
  await recordAction(page, 'Arise Production Studio • 10-Stage Pipeline Locked (🟢 DONE)', 4000);

  await browser.close();
  console.log(`✅ Captured ${frameIndex} high-definition live action UI frames!`);
}

function compileLiveVideo() {
  console.log('🎬 [2/3] Encoding Live Screencast into Broadcast MP4 & Audio Track...');

  const audioBed = path.join(CAPTURE_DIR, 'live_audio_bed.aac');
  const audioCmd = `ffmpeg -y -f lavfi -i "sine=f=160:d=60" -c:a aac -b:a 192k "${audioBed}"`;
  execSync(audioCmd, { stdio: 'ignore' });

  const inputPattern = path.join(CAPTURE_DIR, 'frame_%05d.png');
  const ffmpegCmd = `ffmpeg -y -framerate 4 -i "${inputPattern}" -i "${audioBed}" -vf "fps=30,format=yuv420p" -c:v libx264 -preset slow -crf 18 -c:a aac -b:a 192k -shortest "${OUTPUT_MP4}"`;
  execSync(ffmpegCmd, { stdio: 'inherit' });

  fs.copyFileSync(OUTPUT_MP4, PUBLIC_MP4);

  console.log('🎨 [3/3] Generating animated preview GIF for GitHub README...');
  const gifCmd = `ffmpeg -y -i "${OUTPUT_MP4}" -vf "fps=4,scale=800:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" "${OUTPUT_GIF}"`;
  execSync(gifCmd, { stdio: 'inherit' });

  console.log('✅ Live Studio Screencast successfully generated:');
  console.log(`   1. ${OUTPUT_MP4}`);
  console.log(`   2. ${PUBLIC_MP4}`);
  console.log(`   3. ${OUTPUT_GIF}`);
}

async function main() {
  try {
    await runStudioWalkthrough();
    compileLiveVideo();
  } catch (err) {
    console.error('❌ Live recording error:', err);
    process.exit(1);
  }
}

main();
