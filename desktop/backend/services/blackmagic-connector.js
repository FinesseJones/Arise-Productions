// ==============================================================================
// ARISE PRODUCTION - BLACKMAGIC DESIGN & BMPCC 4K STUDIO CONNECTOR
// A PRODUCT OF THE AI CONTENT FOUNDRY, LLC • © 2026
// ==============================================================================

import { exec } from 'child_process';
import util from 'util';
import fs from 'fs';
import path from 'path';

const execPromise = util.promisify(exec);

export class BlackmagicStudioConnector {
  constructor() {
    this.apps = {
      davinciResolve: '/Applications/DaVinci Resolve/DaVinci Resolve.app',
      brawPlayer: '/Applications/Blackmagic RAW/Blackmagic RAW Player.app',
      brawSpeedTest: '/Applications/Blackmagic RAW/Blackmagic RAW Speed Test.app',
      proxyGenerator: '/Applications/Blackmagic Proxy Generator.app',
      remoteMonitor: '/Applications/DaVinci Resolve/DaVinci Remote Monitor.app',
      controlPanels: '/Applications/DaVinci Resolve/DaVinci Control Panels Setup.app',
      fairlightUtility: '/Applications/DaVinci Resolve/Fairlight Studio Utility.app',
    };

    this.scriptingPath = '/Library/Application Support/Blackmagic Design/DaVinci Resolve/Developer/Scripting';

    // Blackmagic Pocket Cinema Camera 4K (BMPCC 4K) Technical Specification
    this.bmpcc4kProfile = {
      model: 'Blackmagic Pocket Cinema Camera 4K (BMPCC 4K)',
      manufacturer: 'Blackmagic Design',
      sensor: {
        type: 'Micro Four Thirds (MFT) HDR Sensor',
        dimensionsMm: { width: 18.96, height: 10.00 },
        cropFactor: 1.9,
        aspectRatio: '17:9 DCI (1.896:1)',
        nativeResolution: '4096 x 2160',
        activePixels: 8847360,
      },
      dynamicRange: {
        stops: 13,
        profiles: ['Film (Log / Wide Gamut)', 'Extended Video (Rec.709 Hybrid)', 'Video (Broadcast Rec.709)'],
        defaultProfile: 'Film (Gen 5)',
      },
      dualNativeIso: {
        baseLow: 400,
        baseHigh: 3200,
        supportedRange: [100, 200, 400, 800, 1250, 1600, 3200, 6400, 12800, 25600],
        activeIso: 400,
        dynamicRangeBaseLow: '13.1 Stops @ ISO 400',
        dynamicRangeBaseHigh: '12.3 Stops @ ISO 3200',
      },
      colorScience: {
        generation: 'Generation 5 Color Science',
        gamut: 'Blackmagic Design Wide Gamut Gen 5',
        transferFunction: 'Blackmagic Design Film Gen 5',
        davinciAcesMatrix: 'ACEScc / ACEScg via IDT Blackmagic Gen 5 Film',
        lutEmulation: 'Kodak 2383 D65 Print LUT',
      },
      codecs: [
        { name: 'Blackmagic RAW (BRAW 3:1)', bitrateMbps: 135, type: 'Constant Bitrate' },
        { name: 'Blackmagic RAW (BRAW 5:1)', bitrateMbps: 81, type: 'Constant Bitrate (Default)' },
        { name: 'Blackmagic RAW (BRAW 8:1)', bitrateMbps: 51, type: 'Constant Bitrate' },
        { name: 'Blackmagic RAW (BRAW 12:1)', bitrateMbps: 34, type: 'Constant Bitrate' },
        { name: 'Blackmagic RAW (BRAW Q0)', bitrateMbps: 'Variable (Max 180)', type: 'Constant Quality' },
        { name: 'Blackmagic RAW (BRAW Q5)', bitrateMbps: 'Variable (Max 58)', type: 'Constant Quality' },
        { name: 'Apple ProRes 422 HQ', bitrateMbps: 220, type: 'ProRes' },
      ],
      shootingResolutions: [
        { label: '4K DCI (4096 x 2160)', maxFps: 60, aspect: '17:9' },
        { label: 'Ultra HD (3840 x 2160)', maxFps: 60, aspect: '16:9' },
        { label: '2.8K Anamorphic (2880 x 2160)', maxFps: 80, aspect: '4:3' },
        { label: '1080p Full HD (1920 x 1080)', maxFps: 120, aspect: '16:9 (Windowed)' },
      ],
      mount: 'Active Micro Four Thirds (MFT) with electronic iris and autofocus control',
      protocols: [
        'USB-C UVC Live Webcam Video Output (Direct Mac Ingest)',
        'Bluetooth LE 4.0 Camera Control API',
        'ATEM SDI/HDMI Studio Controller Protocol',
        'DaVinci Resolve Studio Direct Project Conform',
      ],
    };
  }

  /**
   * Scan macOS system for installed Blackmagic apps and SDKs
   */
  getSystemStatus() {
    const installed = {};
    for (const [key, appPath] of Object.entries(this.apps)) {
      installed[key] = {
        name: path.basename(appPath, '.app'),
        path: appPath,
        exists: fs.existsSync(appPath),
      };
    }

    const scriptingAvailable = fs.existsSync(this.scriptingPath);

    return {
      success: true,
      timestamp: new Date().toISOString(),
      installedApps: installed,
      davinciScriptingAvailable: scriptingAvailable,
      davinciScriptingPath: scriptingAvailable ? this.scriptingPath : null,
      activeCameraProfile: this.bmpcc4kProfile,
      connectedHardware: {
        camera: 'Blackmagic Pocket Cinema Camera 4K (Ready for USB-C / HDMI Ingest)',
        connectionType: 'USB-C UVC / HDMI / Bluetooth LE',
        liveVideoSupported: true,
        status: 'READY',
      },
    };
  }

  /**
   * Launch DaVinci Resolve or Blackmagic RAW Player directly from Studio
   */
  async launchApp(appKey = 'davinciResolve') {
    const target = this.apps[appKey];
    if (!target || !fs.existsSync(target)) {
      throw new Error(`Blackmagic application "${appKey}" is not installed at ${target}`);
    }

    console.log(`[Blackmagic] Launching ${target}...`);
    await execPromise(`open -a "${target}"`);
    return {
      success: true,
      launched: path.basename(target, '.app'),
      path: target,
    };
  }

  /**
   * Generate a DaVinci Resolve Timeline / Project XML pre-configured with BMPCC 4K Gen 5 Color Science
   */
  generateDaVinciProjectDescriptor(projectData = {}) {
    const { title = 'A Fatherless Child', fps = 24, resolution = '4096x2160' } = projectData;

    return {
      projectTitle: title,
      targetApplication: 'DaVinci Resolve Studio 19',
      colorManagement: {
        colorScience: 'DaVinci YRGB Color Managed / ACEScc',
        inputColorSpace: 'Blackmagic Design Film Gen 5',
        timelineColorSpace: 'DaVinci WG/Intermediate (Wide Gamut)',
        outputColorSpace: 'Rec.709 (Scene) / Gamma 2.4',
        toneMapping: 'DaVinci (Luminance preserving)',
        lutPrint: 'Kodak 2383 D65 Film Emulation 3D LUT',
      },
      cameraRawSettings: {
        rawType: 'Blackmagic RAW (BRAW)',
        decodeQuality: 'Full Resolution - Premium',
        highlightRecovery: true,
        colorScience: 'Gen 5',
        isoBase: 400,
        gamma: 'Blackmagic Design Film',
        colorSpace: 'Blackmagic Design',
      },
      timeline: {
        format: '4K DCI 4096x2160',
        frameRate: `${fps}.000 fps`,
        videoTracks: 3,
        audioTracks: 4,
        audioStandards: '-24.0 LKFS Broadcast Surround',
      },
    };
  }
}

export const blackmagicConnector = new BlackmagicStudioConnector();
export default blackmagicConnector;
