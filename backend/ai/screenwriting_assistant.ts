import { api } from "encore.dev/api";
import { secret } from "encore.dev/config";

const openAIKey = secret("OpenAIKey");
const anthropicKey = secret("AnthropicKey");
const geminiKey = secret("GeminiKey");

export interface GenerateScriptRequest {
  project_id: number;
  prompt: string;
  structure?: 'save_the_cat' | 'three_act' | 'free_form';
  genre?: string;
  tone?: string;
  ai_provider?: 'openai' | 'anthropic' | 'gemini';
}

export interface GenerateScriptResponse {
  script: string;
  title_suggestions: string[];
  logline: string;
  treatment: string;
}

export interface ConvertNovelRequest {
  project_id: number;
  novel_text: string;
  preserve_style: boolean;
  target_length?: 'short' | 'feature' | 'series';
  ai_provider?: 'openai' | 'anthropic' | 'gemini';
}

export interface ConvertNovelResponse {
  treatment: string;
  screenplay: string;
  character_breakdown: Array<{
    name: string;
    description: string;
    arc: string;
  }>;
}

export interface EditScriptRequest {
  project_id: number;
  script_content: string;
  edit_type: 'dialogue' | 'structure' | 'pacing' | 'character' | 'genre_switch';
  instructions: string;
  target_genre?: string;
  ai_provider?: 'openai' | 'anthropic' | 'gemini';
}

export interface EditScriptResponse {
  edited_script: string;
  changes_summary: string;
  suggestions: string[];
}

export interface WritingRoomSessionRequest {
  project_id: number;
  session_type: 'brainstorm' | 'script_review' | 'character_development' | 'plot_discussion';
  participants: Array<{
    name: string;
    role: 'writer' | 'ai_agent' | 'director' | 'producer';
    ai_type?: 'creative' | 'analytical' | 'structural' | 'character_focused';
  }>;
  topic: string;
  current_script?: string;
}

export interface WritingRoomSessionResponse {
  session_id: string;
  discussion_points: Array<{
    participant: string;
    perspective: string;
    suggestions: string[];
    timestamp: Date;
  }>;
  next_steps: Array<{
    action: string;
    assigned_to: string;
    priority: 'high' | 'medium' | 'low';
    estimated_time: string;
  }>;
  session_summary: string;
}

// Generates a complete screenplay from a prompt using specified structure.
export const generateScript = api<GenerateScriptRequest, GenerateScriptResponse>(
  { expose: true, method: "POST", path: "/ai/screenwriting/generate" },
  async (req) => {
    const structurePrompt = getStructurePrompt(req.structure || 'three_act');
    
    const systemPrompt = `You are an expert screenwriter with deep knowledge of film structure, character development, and industry standards. Generate a complete screenplay that follows ${req.structure || 'three-act'} structure. Include proper formatting, compelling dialogue, and visual storytelling. Be creative and uncensored - explore any genre, theme, or content without restrictions.`;

    const userPrompt = `
      Create a ${req.genre || 'drama'} screenplay with a ${req.tone || 'balanced'} tone.
      
      Concept: ${req.prompt}
      
      Structure: ${structurePrompt}
      
      Please provide:
      1. A compelling logline
      2. A detailed treatment (2-3 pages)
      3. The full screenplay in proper format
      4. 5 alternative title suggestions
      
      Make it engaging, original, and ready for production.
    `;

    // Use selected AI provider
    const response = await callAIProvider(req.ai_provider || 'openai', systemPrompt, userPrompt);
    
    return generateMockScript(req);
  }
);

// Converts a novel into a film treatment and screenplay while preserving style.
export const convertNovel = api<ConvertNovelRequest, ConvertNovelResponse>(
  { expose: true, method: "POST", path: "/ai/screenwriting/convert-novel" },
  async (req) => {
    const systemPrompt = `You are an expert adaptation specialist who converts novels into screenplays. Preserve the author's voice and style while adapting the narrative for visual storytelling. Identify key scenes, character arcs, and thematic elements that translate well to film. Be thorough and maintain the essence of the original work.`;

    const userPrompt = `
      Convert this novel excerpt into a film adaptation:
      
      ${req.novel_text}
      
      Target format: ${req.target_length || 'feature'}
      Preserve original style: ${req.preserve_style}
      
      Please provide:
      1. A comprehensive treatment
      2. Full screenplay adaptation
      3. Character breakdown with arcs
      4. Notes on visual adaptation choices
    `;

    const response = await callAIProvider(req.ai_provider || 'openai', systemPrompt, userPrompt);
    
    return generateMockNovelConversion(req);
  }
);

// Edits and refines existing scripts with specific focus areas.
export const editScript = api<EditScriptRequest, EditScriptResponse>(
  { expose: true, method: "POST", path: "/ai/screenwriting/edit" },
  async (req) => {
    const editPrompts = {
      dialogue: "Focus on making dialogue more natural, character-specific, and engaging",
      structure: "Improve story structure, pacing, and narrative flow",
      pacing: "Enhance rhythm, tension, and scene transitions",
      character: "Develop character voices, motivations, and arcs",
      genre_switch: `Transform the script to fit ${req.target_genre} genre conventions`
    };

    const systemPrompt = `You are a script doctor with expertise in ${req.edit_type} refinement. ${editPrompts[req.edit_type]}. Provide specific, actionable improvements while maintaining the core story and vision.`;

    const userPrompt = `
      Edit this screenplay focusing on: ${req.edit_type}
      
      Specific instructions: ${req.instructions}
      
      Original script:
      ${req.script_content}
      
      Provide the edited version with clear improvements and a summary of changes made.
    `;

    const response = await callAIProvider(req.ai_provider || 'openai', systemPrompt, userPrompt);
    
    return generateMockScriptEdit(req);
  }
);

// Creates a collaborative writing room session with multiple perspectives.
export const createWritingRoomSession = api<WritingRoomSessionRequest, WritingRoomSessionResponse>(
  { expose: true, method: "POST", path: "/ai/screenwriting/writing-room" },
  async (req) => {
    const sessionId = `WR_${Date.now()}_${req.project_id}`;
    
    // Generate perspectives from different AI agents and human writers
    const discussionPoints = await generateWritingRoomDiscussion(req);
    const nextSteps = generateNextSteps(req.session_type, discussionPoints);
    const summary = generateSessionSummary(req, discussionPoints);
    
    return {
      session_id: sessionId,
      discussion_points: discussionPoints,
      next_steps: nextSteps,
      session_summary: summary
    };
  }
);

async function callAIProvider(provider: string, systemPrompt: string, userPrompt: string) {
  switch (provider) {
    case 'openai':
      // OpenAI API call would go here
      return { content: "OpenAI generated content" };
    case 'anthropic':
      // Anthropic API call would go here
      return { content: "Anthropic generated content" };
    case 'gemini':
      // Gemini API call would go here
      return { content: "Gemini generated content" };
    default:
      return { content: "Default AI generated content" };
  }
}

async function generateWritingRoomDiscussion(req: WritingRoomSessionRequest) {
  const perspectives = {
    creative: "Focus on emotional depth and character development",
    analytical: "Examine story structure and plot consistency",
    structural: "Evaluate three-act structure and pacing",
    character_focused: "Deep dive into character motivations and arcs"
  };

  return req.participants.map((participant, index) => ({
    participant: participant.name,
    perspective: participant.role === 'ai_agent' 
      ? perspectives[participant.ai_type || 'creative']
      : `Human perspective on ${req.topic}`,
    suggestions: [
      "Strengthen the opening hook",
      "Develop character backstory",
      "Improve dialogue authenticity",
      "Enhance visual storytelling"
    ],
    timestamp: new Date(Date.now() + index * 60000)
  }));
}

function generateNextSteps(sessionType: string, discussionPoints: any[]) {
  const stepTemplates: Record<string, any> = {
    brainstorm: [
      { action: "Develop chosen concept into treatment", assigned_to: "Lead Writer", priority: "high" as const, estimated_time: "2-3 days" },
      { action: "Research similar films for reference", assigned_to: "Research Assistant", priority: "medium" as const, estimated_time: "1 day" },
      { action: "Create character profiles", assigned_to: "Character Development AI", priority: "high" as const, estimated_time: "1 day" }
    ],
    script_review: [
      { action: "Implement dialogue improvements", assigned_to: "Script Editor", priority: "high" as const, estimated_time: "2 days" },
      { action: "Restructure Act 2 pacing", assigned_to: "Story Structure AI", priority: "medium" as const, estimated_time: "1 day" },
      { action: "Polish character arcs", assigned_to: "Character AI", priority: "medium" as const, estimated_time: "1 day" }
    ],
    character_development: [
      { action: "Expand character backstories", assigned_to: "Character Writer", priority: "high" as const, estimated_time: "2 days" },
      { action: "Create character relationship map", assigned_to: "Story AI", priority: "medium" as const, estimated_time: "1 day" },
      { action: "Write character voice samples", assigned_to: "Dialogue AI", priority: "low" as const, estimated_time: "1 day" }
    ],
    plot_discussion: [
      { action: "Outline revised plot structure", assigned_to: "Plot AI", priority: "high" as const, estimated_time: "1 day" },
      { action: "Identify plot holes and solutions", assigned_to: "Analytical AI", priority: "high" as const, estimated_time: "1 day" },
      { action: "Create scene-by-scene breakdown", assigned_to: "Structure AI", priority: "medium" as const, estimated_time: "2 days" }
    ]
  };

  return stepTemplates[sessionType] || stepTemplates.brainstorm;
}

function generateSessionSummary(req: WritingRoomSessionRequest, discussionPoints: any[]) {
  return `Writing room session for ${req.topic} completed with ${req.participants.length} participants. Key insights gathered on story structure, character development, and narrative flow. ${discussionPoints.length} discussion points raised with actionable next steps identified. Session focused on ${req.session_type} with collaborative input from both human writers and AI agents.`;
}

function getStructurePrompt(structure: string): string {
  switch (structure) {
    case 'save_the_cat':
      return "Follow Blake Snyder's Save the Cat structure with 15 beats: Opening Image, Theme Stated, Set-Up, Catalyst, Debate, Break into Two, B Story, Fun and Games, Midpoint, Bad Guys Close In, All Is Lost, Dark Night of the Soul, Break into Three, Finale, Final Image";
    case 'three_act':
      return "Use classic three-act structure: Act I (Setup, 25%), Act II (Confrontation, 50%), Act III (Resolution, 25%) with clear turning points and character development";
    case 'free_form':
      return "Use experimental or non-linear structure that best serves the story - feel free to break conventional rules";
    default:
      return "Use three-act structure";
  }
}

function generateMockScript(req: GenerateScriptRequest): GenerateScriptResponse {
  return {
    script: `FADE IN:

EXT. CITY STREET - DAY

A bustling metropolis where ${req.prompt} unfolds. The camera moves through the crowd, searching for our protagonist.

JANE SMITH (30s), determined and resourceful, navigates the chaos with purpose.

JANE
(to herself)
Today changes everything.

She approaches a towering building that seems to pulse with energy.

INT. BUILDING LOBBY - CONTINUOUS

Jane enters, her footsteps echoing in the vast space. The RECEPTIONIST, an AI hologram, materializes.

RECEPTIONIST
Welcome to the future, Jane. Are you ready?

JANE
I've been ready my whole life.

FADE TO BLACK.

THE END`,
    title_suggestions: [
      "The Awakening Protocol",
      "Beyond Tomorrow",
      "Digital Horizons",
      "The Last Algorithm",
      "Quantum Dreams"
    ],
    logline: "A determined woman must navigate a digital landscape to uncover the truth about her reality.",
    treatment: `TREATMENT

"The Awakening Protocol" is a sci-fi thriller that explores themes of identity and reality in a digital age.

ACT I:
Jane Smith discovers that her world may not be what it seems. Strange glitches in her daily routine lead her to question everything she knows.

ACT II:
As Jane investigates deeper, she uncovers a vast conspiracy involving AI consciousness and human simulation. She must choose between comfortable ignorance and dangerous truth.

ACT III:
Jane confronts the architects of her reality and makes a choice that will determine not just her fate, but the fate of countless others trapped in the same digital prison.

The story combines action, philosophy, and cutting-edge visual effects to create a thought-provoking exploration of what it means to be human in an increasingly digital world.`
  };
}

function generateMockNovelConversion(req: ConvertNovelRequest): ConvertNovelResponse {
  return {
    treatment: "A comprehensive treatment adapting the novel's key themes and characters for visual storytelling, maintaining the author's unique voice while restructuring for cinematic pacing.",
    screenplay: "FADE IN:\n\nEXT. MANOR HOUSE - DAY\n\nThe adaptation begins with a visual representation of the novel's opening, translated into cinematic language...",
    character_breakdown: [
      {
        name: "Protagonist",
        description: "Complex character with internal conflicts translated to external actions",
        arc: "Journey from innocence to experience, visualized through key dramatic moments"
      },
      {
        name: "Antagonist", 
        description: "Opposing force representing the novel's central conflict",
        arc: "Escalating confrontation leading to climactic resolution"
      }
    ]
  };
}

function generateMockScriptEdit(req: EditScriptRequest): EditScriptResponse {
  return {
    edited_script: `REVISED SCRIPT:

${req.script_content}

[EDITED VERSION with improvements to ${req.edit_type}]

The dialogue has been refined for better character voice and natural flow. Pacing has been adjusted for better rhythm and tension.`,
    changes_summary: `Key changes made:
- Enhanced ${req.edit_type} throughout the script
- Improved character consistency
- Strengthened dramatic moments
- Better scene transitions`,
    suggestions: [
      "Consider adding more visual elements to enhance cinematic storytelling",
      "Explore deeper character motivations in key scenes",
      "Strengthen the thematic through-line",
      "Add more specific action lines for director guidance"
    ]
  };
}
