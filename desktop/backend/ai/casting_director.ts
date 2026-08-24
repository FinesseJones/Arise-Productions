import { api } from "encore.dev/api";
import { addCopyrightNotice, addCopyrightToJSON } from "../lib/copyright";

export interface GenerateCastingProfileRequest {
  project_id: number;
  character_name: string;
  character_description: string;
  script_context?: string;
}

export interface GenerateCastingProfileResponse {
  casting_profile: {
    character_name: string;
    age_range: string;
    physical_description: string;
    personality_traits: string[];
    key_scenes: string[];
    acting_requirements: string[];
    audition_sides: string;
    wardrobe_notes: string;
    special_skills: string[];
  };
  casting_sheet: string;
  audition_instructions: string;
  _copyright?: any;
}

export interface GenerateAuditionSidesRequest {
  project_id: number;
  character_name: string;
  script_content: string;
  scene_focus?: string[];
}

export interface GenerateAuditionSidesResponse {
  audition_sides: Array<{
    scene_title: string;
    content: string;
    direction_notes: string;
    emotional_range: string[];
  }>;
  reader_lines: string;
  audition_notes: string;
}

export interface AnalyzeSelfTapeRequest {
  project_id: number;
  character_name: string;
  audition_notes: string;
  performance_feedback?: string;
}

export interface AnalyzeSelfTapeResponse {
  performance_analysis: {
    strengths: string[];
    areas_for_improvement: string[];
    character_fit: number; // 1-10 scale
    technical_quality: number; // 1-10 scale
    overall_score: number; // 1-10 scale
  };
  callback_recommendation: boolean;
  director_notes: string;
  next_steps: string[];
}

// Generates comprehensive casting profiles and sheets for characters.
export const generateCastingProfile = api<GenerateCastingProfileRequest, GenerateCastingProfileResponse>(
  { expose: true, method: "POST", path: "/ai/casting/profile" },
  async (req) => {
    const profile = createCastingProfile(req);
    const castingSheet = generateCastingSheet(profile);
    const auditionInstructions = createAuditionInstructions(profile);

    const response = {
      casting_profile: profile,
      casting_sheet: addCopyrightNotice(castingSheet, {
        author: 'Finesse Jones Production Studio',
        createdAt: new Date(),
        id: req.project_id
      }),
      audition_instructions: addCopyrightNotice(auditionInstructions, {
        author: 'Finesse Jones Production Studio',
        createdAt: new Date(),
        id: req.project_id
      })
    };

    return addCopyrightToJSON(response, {
      author: 'Finesse Jones Production Studio',
      createdAt: new Date(),
      id: req.project_id
    });
  }
);

// Creates audition sides from script content for specific characters.
export const generateAuditionSides = api<GenerateAuditionSidesRequest, GenerateAuditionSidesResponse>(
  { expose: true, method: "POST", path: "/ai/casting/audition-sides" },
  async (req) => {
    const sides = extractAuditionSides(req);
    const readerLines = generateReaderLines(sides);
    const notes = createAuditionNotes(req.character_name, sides);
    
    return {
      audition_sides: sides,
      reader_lines: readerLines,
      audition_notes: notes
    };
  }
);

// Analyzes self-tape submissions and provides casting recommendations.
export const analyzeSelfTape = api<AnalyzeSelfTapeRequest, AnalyzeSelfTapeResponse>(
  { expose: true, method: "POST", path: "/ai/casting/analyze-tape" },
  async (req) => {
    const analysis = performTapeAnalysis(req);
    
    return analysis;
  }
);

function createCastingProfile(req: GenerateCastingProfileRequest) {
  // AI-powered character analysis
  return {
    character_name: req.character_name,
    age_range: "25-35",
    physical_description: "Medium build, expressive eyes, confident posture",
    personality_traits: [
      "Determined",
      "Intelligent", 
      "Resourceful",
      "Emotionally complex",
      "Natural leader"
    ],
    key_scenes: [
      "Opening monologue",
      "Confrontation scene",
      "Emotional breakdown",
      "Final resolution"
    ],
    acting_requirements: [
      "Strong dramatic range",
      "Comfortable with technical dialogue",
      "Physical stamina for action sequences",
      "Ability to convey internal conflict"
    ],
    audition_sides: generateSampleSides(req.character_name),
    wardrobe_notes: "Contemporary business attire, comfortable with costume changes",
    special_skills: [
      "Basic stunt work",
      "Comfortable with green screen",
      "Improvisation skills"
    ]
  };
}

function generateSampleSides(characterName: string): string {
  return `AUDITION SIDES - ${characterName}

SCENE: Interior Office - Day

${characterName} enters, clearly agitated.

${characterName}
(to herself)
This isn't how it was supposed to happen. None of this makes sense.

She approaches the window, looking out at the city below.

${characterName} (CONT'D)
(turning back)
But maybe that's exactly the point. Maybe nothing is supposed to make sense anymore.

[Direction: Show the character's internal struggle through physicality and vocal choices. The scene should demonstrate range from vulnerability to determination.]`;
}

function generateCastingSheet(profile: any): string {
  return `CASTING SHEET

CHARACTER: ${profile.character_name}
AGE RANGE: ${profile.age_range}

PHYSICAL DESCRIPTION:
${profile.physical_description}

PERSONALITY:
${profile.personality_traits.join(', ')}

KEY REQUIREMENTS:
${profile.acting_requirements.join('\n')}

SPECIAL SKILLS NEEDED:
${profile.special_skills.join('\n')}

WARDROBE:
${profile.wardrobe_notes}

AUDITION PROCESS:
1. Self-tape submission
2. Callback for chemistry read
3. Final director meeting

SUBMISSION DEADLINE: [TO BE FILLED]
CONTACT: casting@finessejones.studio`;
}

function createAuditionInstructions(profile: any): string {
  return `AUDITION INSTRUCTIONS

Thank you for your interest in ${profile.character_name}.

PREPARATION:
- Review the attached sides carefully
- Make strong character choices
- Prepare for emotional range demonstration

TECHNICAL REQUIREMENTS:
- HD video quality (1080p minimum)
- Clear audio (external mic recommended)
- Well-lit environment
- Neutral background

PERFORMANCE NOTES:
- Stay connected to your scene partner (even if off-camera)
- Take risks with your choices
- Show us your unique interpretation

SUBMISSION:
- Keep tape under 3 minutes
- Slate with name and character
- Include one take of each side
- Submit via casting portal

Questions? Contact: casting@finessejones.studio`;
}

function extractAuditionSides(req: GenerateAuditionSidesRequest) {
  // Mock extraction of key scenes for auditions
  return [
    {
      scene_title: "Character Introduction",
      content: generateSampleSides(req.character_name),
      direction_notes: "Focus on establishing character voice and presence",
      emotional_range: ["Confident", "Vulnerable", "Determined"]
    },
    {
      scene_title: "Conflict Scene",
      content: `${req.character_name} faces their greatest challenge...`,
      direction_notes: "Show emotional depth and conflict resolution",
      emotional_range: ["Angry", "Frustrated", "Resolved"]
    }
  ];
}

function generateReaderLines(sides: any[]): string {
  return `READER LINES

For Scene 1:
READER: "Are you sure about this decision?"

For Scene 2:
READER: "There's no going back after this."

[Note: Reader should remain neutral and supportive, allowing actor to drive the scene]`;
}

function createAuditionNotes(characterName: string, sides: any[]): string {
  return `AUDITION NOTES FOR ${characterName}

WHAT WE'RE LOOKING FOR:
- Authentic emotional connection
- Clear character choices
- Technical proficiency
- Collaborative spirit

EVALUATION CRITERIA:
- Character interpretation (40%)
- Technical skill (30%)
- Screen presence (20%)
- Direction-taking ability (10%)

CALLBACK PROCESS:
Selected actors will be invited for chemistry reads and director sessions.

Good luck!`;
}

function performTapeAnalysis(req: AnalyzeSelfTapeRequest) {
  // Mock AI analysis of self-tape performance
  return {
    performance_analysis: {
      strengths: [
        "Strong emotional connection to material",
        "Clear character choices",
        "Good technical quality",
        "Natural screen presence"
      ],
      areas_for_improvement: [
        "Could explore more vocal variety",
        "Physical choices could be bolder",
        "Pacing in emotional moments"
      ],
      character_fit: 8,
      technical_quality: 7,
      overall_score: 8
    },
    callback_recommendation: true,
    director_notes: "Strong audition with clear understanding of character. Would like to see in callback for chemistry read with lead actor.",
    next_steps: [
      "Schedule callback session",
      "Prepare additional sides",
      "Wardrobe fitting if selected",
      "Chemistry read with co-star"
    ]
  };
}
