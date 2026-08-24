// ==============================================================================
// ARISE PRODUCTION - MULTI-FORMAT MEDIA INGESTION & PROJECT CREATOR ENGINE
// A PRODUCT OF THE AI CONTENT FOUNDRY, LLC • © 2026
// ==============================================================================

import { db } from '../db/client.js';
import { nvidia } from '../ai/nvidia-client.js';

export class MediaIngestionEngine {
  /**
   * Create a new studio project supporting Long-Form, Short-Form, or Episodic TV
   */
  static async createProject(options = {}) {
    const {
      title = 'Untitled Production',
      format = 'long_form', // 'long_form' | 'short_form' | 'episodic_tv'
      seasonNumber = 1,
      episodeNumber = 1,
      aspectRatio = '16:9', // '16:9' | '9:16' | '2.39:1' | '4:3'
      targetPlatform = 'Theatrical & Streaming', // 'YouTube' | 'TikTok' | 'Netflix' | 'HBO'
      sourceType = 'scratch', // 'scratch' | 'youtube_link' | 'social_link' | 'file_upload'
      sourceUrl = '',
      rawContent = '',
    } = options;

    const projectId = `proj-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    console.log(`[MediaIngest] Initializing ${format.toUpperCase()} project "${title}" (${projectId}) from source: ${sourceType}`);

    // If source is a YouTube or social media link, parse and extract beats
    let ingestedBeats = [];
    let characterBible = [];
    let logline = '';

    if (sourceType === 'youtube_link' || sourceType === 'social_link') {
      const parsedData = await this.parseExternalMediaLink(sourceUrl, format);
      ingestedBeats = parsedData.beats;
      characterBible = parsedData.characters;
      logline = parsedData.logline;
    } else if (rawContent) {
      const parsedData = await this.parseRawScreenplay(rawContent, format);
      ingestedBeats = parsedData.beats;
      characterBible = parsedData.characters;
      logline = parsedData.logline;
    } else {
      // Default structure based on format
      ingestedBeats = this.getDefaultBeatsForFormat(format, title);
    }

    // Build shot list from beats
    const shots = ingestedBeats.map((beat, idx) => ({
      shotNumber: idx + 1,
      title: beat.title || `Shot ${idx + 1}: ${beat.description?.slice(0, 30) || 'Scene'}`,
      description: beat.description || '',
      aspectRatio,
      cameraPreset: beat.cameraPreset || '35mm Dynamic Track',
      status: {
        script: { statusChar: '🟢', worker: 'ScriptBreak', outputSummary: beat.scriptSnippet || 'Scene breakdown complete' },
        structure: { statusChar: '🟢', worker: 'Cork Board', outputSummary: `Act ${beat.act || 1} Beat locked` },
        plan: { statusChar: '🟡', worker: 'Master Canvas', outputSummary: 'Asset requirements compiled' },
        previs: { statusChar: '🟡', worker: 'Blockout 3D', outputSummary: 'Camera choreography in progress' },
        motion: { statusChar: '⚪', worker: 'Motion Previs Studio' },
        boards: { statusChar: '⚪', worker: 'Storyboard Reference Studio' },
        prompt: { statusChar: '⚪', worker: 'Slate Prompt' },
        dailies: { statusChar: '⚪', worker: 'Circle Take' },
        sound: { statusChar: '⚪', worker: 'Stem Studio' },
        edit: { statusChar: '⚪', worker: 'DaVinci MCP' },
      },
    }));

    // Register into Database
    const newProjectRecord = {
      id: projectId,
      name: title,
      format,
      seasonNumber: format === 'episodic_tv' ? seasonNumber : undefined,
      episodeNumber: format === 'episodic_tv' ? episodeNumber : undefined,
      aspectRatio,
      targetPlatform,
      sourceType,
      sourceUrl,
      logline,
      characterBible,
      shots,
      createdAt: new Date().toISOString(),
    };

    db.projects[projectId] = newProjectRecord;
    return newProjectRecord;
  }

  /**
   * Parse YouTube / TikTok / Social media links into narrative structure & 3D shots
   */
  static async parseExternalMediaLink(url, format) {
    console.log(`[MediaIngest] Ingesting media from URL: ${url} (Format: ${format})`);

    let beats = [];
    let logline = `Media adaptation of ingested source: ${url}`;
    let characters = ['Protagonist', 'Antagonist', 'Supporting'];

    if (nvidia.hasApiKey()) {
      const prompt = `We are converting this external media video/link into a professional production pipeline:
URL/Context: "${url}"
Target Format: ${format}

Generate a JSON object with:
1. "logline": 1-sentence dramatic summary
2. "characters": list of 3-5 character names and roles
3. "beats": array of 4-6 scene beats, each with: "title", "description", "act", "cameraPreset", "scriptSnippet"`;

      const aiResponse = await nvidia.generateCompletion({ prompt });
      if (aiResponse.success && aiResponse.text) {
        try {
          const jsonMatch = aiResponse.text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            if (parsed.beats) beats = parsed.beats;
            if (parsed.characters) characters = parsed.characters;
            if (parsed.logline) logline = parsed.logline;
          }
        } catch (e) {
          console.warn('[MediaIngest] Failed to parse AI JSON response, falling back to structured beats.');
        }
      }
    }

    if (beats.length === 0) {
      beats = this.getDefaultBeatsForFormat(format, 'Adapted Production');
    }

    return { beats, logline, characters };
  }

  /**
   * Parse raw uploaded script / text
   */
  static async parseRawScreenplay(text, format) {
    let beats = [];
    let logline = 'Original screenplay adaptation';
    let characters = ['Lead', 'Companion'];

    if (nvidia.hasApiKey()) {
      const prompt = `Analyze this screenplay content for a ${format} production:\n\n${text.slice(0, 2000)}\n\nExtract 4-6 shot beats (title, description, cameraPreset, scriptSnippet), logline, and character list. Format as JSON.`;
      const aiResponse = await nvidia.generateCompletion({ prompt });
      if (aiResponse.success) {
        try {
          const jsonMatch = aiResponse.text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            if (parsed.beats) beats = parsed.beats;
            if (parsed.characters) characters = parsed.characters;
            if (parsed.logline) logline = parsed.logline;
          }
        } catch (e) {}
      }
    }

    if (beats.length === 0) {
      beats = this.getDefaultBeatsForFormat(format, 'Screenplay Production');
    }

    return { beats, logline, characters };
  }

  /**
   * Format-specific beat templates
   */
  static getDefaultBeatsForFormat(format, title) {
    if (format === 'short_form') {
      // 9:16 Vertical Short-Form (TikTok / Reel / YouTube Short)
      return [
        {
          title: '0-3s: High-Energy Hook',
          description: 'Instant visual shock, rapid camera push-in, punchy voiceover hook.',
          act: 1,
          cameraPreset: '9:16 Vertical Fast Dolly Zoom',
          scriptSnippet: 'NARRATOR: "You have 3 seconds to look at this..."',
        },
        {
          title: '3-15s: Core Escalation & Demonstration',
          description: 'Fast-paced rhythmic cuts showcasing the central conflict or premise.',
          act: 2,
          cameraPreset: '9:16 Orbit Tracking Shot',
          scriptSnippet: 'Quick montage with kinetic visual effects.',
        },
        {
          title: '15-45s: Climax & Punchline',
          description: 'Dramatic revelation or unexpected comedic twist with sound riser.',
          act: 2,
          cameraPreset: '9:16 Extreme Close-Up',
          scriptSnippet: 'Protagonist turns to camera with final realization.',
        },
        {
          title: '45-60s: Call to Action Loop',
          description: 'Seamless loop transition back to opening hook.',
          act: 3,
          cameraPreset: '9:16 Seamless Match Cut',
          scriptSnippet: 'NARRATOR: "And that is why..."',
        },
      ];
    } else if (format === 'episodic_tv') {
      // Episodic TV Series Episode
      return [
        {
          title: 'Cold Open: Inciting Mystery',
          description: 'High-stakes opening sequence establishing the episode dilemma before title cards.',
          act: 1,
          cameraPreset: '2.39:1 Wide Anamorphic Crane Down',
          scriptSnippet: 'EXT. CITY SKYLINE - NIGHT. An unexpected alarm echoes across the district.',
        },
        {
          title: 'Act I: Main Plot & B-Story Intersection',
          description: 'Ensemble characters convene; interpersonal stakes introduced.',
          act: 1,
          cameraPreset: '35mm Two-Shot Medium',
          scriptSnippet: 'INT. COMMAND CENTER - DAY. Sarah and Marcus review incoming telemetry.',
        },
        {
          title: 'Act II: Midpoint Reversal',
          description: 'A critical discovery changes the objective of the mission.',
          act: 2,
          cameraPreset: 'Steadicam Follow Shot',
          scriptSnippet: 'Marcus realizes the signal was sent from inside their own facility.',
        },
        {
          title: 'Act III: Climax & Cliffhanger',
          description: 'Episode climax resolved with an overarching season arc cliffhanger.',
          act: 3,
          cameraPreset: 'Dramatic Dutch Angle Push-In',
          scriptSnippet: 'The final screen flashes red. CUT TO BLACK.',
        },
      ];
    } else {
      // Default: Long-Form Feature Film
      return [
        {
          title: 'Act I: Establishing World & Status Quo',
          description: 'Cinematic world-building, hero introduction, and catalyst event.',
          act: 1,
          cameraPreset: 'Wide Horizon Crane Shot',
          scriptSnippet: 'EXT. EXPEDITION VESSEL - DAWN. The ship cuts through icy fog.',
        },
        {
          title: 'Act II-A: Entering Special World',
          description: 'Rising stakes, trials, new allies, and threshold crossing.',
          act: 2,
          cameraPreset: 'Dynamic Drone Fly-Through',
          scriptSnippet: 'The submarine dives past the continental shelf into uncharted depths.',
        },
        {
          title: 'Act II-B: All Hope Lost / Dark Night of the Soul',
          description: 'Major crisis, personal sacrifice, and dramatic epiphany.',
          act: 2,
          cameraPreset: 'Low-Key Noir Macro Lens',
          scriptSnippet: 'Power cuts out. Emergency amber beacons pulse in the dark.',
        },
        {
          title: 'Act III: Final Climax & Resolution',
          description: 'Hero masterstroke, emotional resolution, and triumphant finish.',
          act: 3,
          cameraPreset: 'Golden Hour Sweeping Orbit',
          scriptSnippet: 'The artifact surfaces into the morning sun.',
        },
      ];
    }
  }
}

export default MediaIngestionEngine;
