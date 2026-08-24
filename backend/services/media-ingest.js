// ==============================================================================
// ARISE PRODUCTION - MULTI-FORMAT MEDIA INGESTION & PROJECT CREATOR ENGINE
// A PRODUCT OF THE AI CONTENT FOUNDRY, LLC • © 2026
// ==============================================================================

import { db } from '../db/client.js';
import { nvidiaNIM } from '../ai/nvidia-client.js';

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
      const parsedData = await this.parseExternalMediaLink(sourceUrl, format, title);
      ingestedBeats = parsedData.beats;
      characterBible = parsedData.characters;
      logline = parsedData.logline;
    } else if (rawContent) {
      const parsedData = await this.parseRawScreenplay(rawContent, format);
      ingestedBeats = parsedData.beats;
      characterBible = parsedData.characters;
      logline = parsedData.logline;
    } else {
      // Use NVIDIA NIM AI to generate dynamic story beats based on project title
      if (nvidiaNIM.hasApiKey()) {
        try {
          const aiData = await this.generateAIStoryForTitle(title, format, seasonNumber, episodeNumber);
          ingestedBeats = aiData.beats;
          characterBible = aiData.characters;
          logline = aiData.logline;
        } catch (e) {
          ingestedBeats = this.getDefaultBeatsForFormat(format, title);
        }
      } else {
        ingestedBeats = this.getDefaultBeatsForFormat(format, title);
      }
    }

    if (!ingestedBeats || ingestedBeats.length === 0) {
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

    // Register into Database Map
    const newProjectRecord = {
      id: projectId,
      name: title,
      slug: projectId,
      format,
      seasonNumber: format === 'episodic_tv' ? seasonNumber : undefined,
      episodeNumber: format === 'episodic_tv' ? episodeNumber : undefined,
      aspectRatio,
      targetPlatform,
      sourceType,
      sourceUrl,
      logline: logline || `An original ${format} production titled "${title}".`,
      characterBible: characterBible.length > 0 ? characterBible : ['Lead Hero', 'Allied Companion', 'Central Antagonist'],
      shots,
      createdAt: new Date().toISOString(),
    };

    const manifest = db.registerProject(newProjectRecord);
    return { ...newProjectRecord, manifest };
  }

  /**
   * Generate bespoke AI story beats for a brand new production title using NVIDIA NIM
   */
  static async generateAIStoryForTitle(title, format, seasonNumber, episodeNumber) {
    console.log(`[MediaIngest] Calling NVIDIA NIM Llama 3.1 70B to generate bespoke story for: "${title}"...`);
    const prompt = `You are the Hollywood AI Showrunner for Arise Production.
Create a rich, bespoke 10-department production plan for a brand new project:
Title: "${title}"
Format: ${format} ${format === 'episodic_tv' ? `(Season ${seasonNumber}, Episode ${episodeNumber})` : ''}

Generate a valid JSON object strictly matching this schema:
{
  "logline": "1-2 sentence dramatic and compelling cinematic premise for this exact title",
  "characters": ["3-4 specific character names with brief 1-line descriptions matching this world"],
  "beats": [
    {
      "title": "Scene 1: Specific Beat Title",
      "description": "2-sentence cinematic visual description of this shot",
      "act": 1,
      "cameraPreset": "e.g. 35mm Low-Angle Tracking Shot",
      "scriptSnippet": "SLUGLINE - DAY/NIGHT. Dialogue or action line."
    },
    {
      "title": "Scene 2: Specific Beat Title",
      "description": "2-sentence cinematic visual description of this shot",
      "act": 2,
      "cameraPreset": "e.g. 50mm Anamorphic Two-Shot",
      "scriptSnippet": "SLUGLINE - DAY/NIGHT. Dialogue or action line."
    },
    {
      "title": "Scene 3: Specific Beat Title",
      "description": "2-sentence cinematic visual description of this shot",
      "act": 2,
      "cameraPreset": "e.g. Drone Fly-Through / Steadicam",
      "scriptSnippet": "SLUGLINE - DAY/NIGHT. Dialogue or action line."
    },
    {
      "title": "Scene 4: Specific Beat Title",
      "description": "2-sentence cinematic visual description of this shot",
      "act": 3,
      "cameraPreset": "e.g. 85mm Portrait Close-Up / Climax",
      "scriptSnippet": "SLUGLINE - DAY/NIGHT. Dialogue or action line."
    }
  ]
}`;

    const aiRes = await nvidiaNIM.generateCompletion({
      prompt,
      systemPrompt: 'You are an award-winning Hollywood writer and virtual production supervisor. Output only valid JSON without markdown fences.',
      temperature: 0.7,
      maxTokens: 1500,
    });

    if (aiRes.success && aiRes.text) {
      try {
        const jsonMatch = aiRes.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.beats && Array.isArray(parsed.beats) && parsed.beats.length > 0) {
            console.log(`[MediaIngest] ✨ Generated ${parsed.beats.length} bespoke AI beats for "${title}"!`);
            return {
              beats: parsed.beats,
              logline: parsed.logline || `Production plan for ${title}`,
              characters: parsed.characters || [],
            };
          }
        }
      } catch (e) {
        console.warn('[MediaIngest] AI JSON parse error:', e.message);
      }
    }

    return {
      beats: this.getDefaultBeatsForFormat(format, title),
      logline: `Production for "${title}"`,
      characters: ['Protagonist', 'Antagonist'],
    };
  }

  /**
   * Parse YouTube / TikTok / Social media links into narrative structure & 3D shots
   */
  static async parseExternalMediaLink(url, format, title) {
    console.log(`[MediaIngest] Ingesting media from URL: ${url} (Format: ${format})`);

    let beats = [];
    let logline = `Media adaptation of ingested source: ${url}`;
    let characters = ['Protagonist', 'Antagonist', 'Supporting'];

    if (nvidiaNIM.hasApiKey()) {
      const prompt = `We are converting this external media video/link into a professional production pipeline:
Title: "${title}"
URL/Context: "${url}"
Target Format: ${format}

Generate a JSON object with:
1. "logline": 1-sentence dramatic summary
2. "characters": list of 3-5 character names and roles
3. "beats": array of 4-6 scene beats, each with: "title", "description", "act", "cameraPreset", "scriptSnippet"`;

      const aiResponse = await nvidiaNIM.generateCompletion({ prompt });
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
      beats = this.getDefaultBeatsForFormat(format, title || 'Adapted Production');
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

    if (nvidiaNIM.hasApiKey()) {
      const prompt = `Analyze this screenplay content for a ${format} production:\n\n${text.slice(0, 2000)}\n\nExtract 4-6 shot beats (title, description, cameraPreset, scriptSnippet), logline, and character list. Format as JSON.`;
      const aiResponse = await nvidiaNIM.generateCompletion({ prompt });
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
      return [
        {
          title: `0-3s: ${title} Opening Hook`,
          description: 'Instant visual shock, rapid camera push-in, punchy voiceover hook.',
          act: 1,
          cameraPreset: '9:16 Vertical Fast Dolly Zoom',
          scriptSnippet: `NARRATOR: "You won't believe what happened in ${title}..."`,
        },
        {
          title: '3-15s: Core Escalation & Action',
          description: 'Fast-paced rhythmic cuts showcasing the central conflict or premise.',
          act: 2,
          cameraPreset: '9:16 Orbit Tracking Shot',
          scriptSnippet: 'Dynamic motion sequence with kinetic visual effects.',
        },
        {
          title: '15-45s: Dramatic Twist',
          description: 'High-stakes revelation with sound riser and macro focus pull.',
          act: 2,
          cameraPreset: '9:16 Extreme Close-Up',
          scriptSnippet: 'Protagonist turns to camera with final realization.',
        },
        {
          title: '45-60s: Climax & Loop',
          description: 'Seamless loop transition back to opening hook.',
          act: 3,
          cameraPreset: '9:16 Seamless Match Cut',
          scriptSnippet: 'NARRATOR: "And that changes everything."',
        },
      ];
    } else if (format === 'episodic_tv') {
      return [
        {
          title: `Cold Open: ${title} Inciting Incident`,
          description: 'High-stakes opening sequence establishing the dilemma before title cards.',
          act: 1,
          cameraPreset: '2.39:1 Wide Anamorphic Crane Down',
          scriptSnippet: `EXT. ${title.toUpperCase()} LOCATION - NIGHT. An unexpected alarm echoes.`,
        },
        {
          title: 'Act I: Main Plot & Character Convening',
          description: 'Ensemble characters convene; interpersonal stakes introduced.',
          act: 1,
          cameraPreset: '35mm Two-Shot Medium',
          scriptSnippet: 'INT. HEADQUARTERS - DAY. The team reviews incoming telemetry.',
        },
        {
          title: 'Act II: Midpoint Reversal',
          description: 'A critical discovery changes the objective of the mission.',
          act: 2,
          cameraPreset: 'Steadicam Follow Shot',
          scriptSnippet: 'A secret is uncovered that alters the entire plan.',
        },
        {
          title: 'Act III: Episode Climax & Cliffhanger',
          description: 'Episode climax resolved with an overarching season arc cliffhanger.',
          act: 3,
          cameraPreset: 'Dramatic Dutch Angle Push-In',
          scriptSnippet: 'The final warning beacon flashes. CUT TO BLACK.',
        },
      ];
    } else {
      return [
        {
          title: `Act I: ${title} - World Establishment`,
          description: `Cinematic world-building and introduction to the world of "${title}".`,
          act: 1,
          cameraPreset: 'Wide Horizon Crane Shot',
          scriptSnippet: `EXT. ${title.toUpperCase()} WORLD - DAWN. The horizon opens up.`,
        },
        {
          title: 'Act II-A: Rising Stakes & Threshold Crossing',
          description: 'Rising stakes, trials, new allies, and entering the danger zone.',
          act: 2,
          cameraPreset: 'Dynamic Drone Fly-Through',
          scriptSnippet: 'The team crosses the perimeter into uncharted territory.',
        },
        {
          title: 'Act II-B: Crisis & The Dark Night',
          description: 'Major obstacle, personal sacrifice, and dramatic turning point.',
          act: 2,
          cameraPreset: 'Low-Key Noir Macro Lens',
          scriptSnippet: 'Emergency power fails. Tension reaches a boiling point.',
        },
        {
          title: 'Act III: Final Climax & Resolution',
          description: 'Epic confrontation, emotional resolution, and triumphant finish.',
          act: 3,
          cameraPreset: 'Golden Hour Sweeping Orbit',
          scriptSnippet: 'The final objective is secured as the new dawn breaks.',
        },
      ];
    }
  }
}

export default MediaIngestionEngine;
