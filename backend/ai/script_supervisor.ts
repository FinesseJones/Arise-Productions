import { api } from "encore.dev/api";

export interface GenerateShootingScriptRequest {
  project_id: number;
  script_content: string;
  scene_numbers?: boolean;
  revision_colors?: boolean;
}

export interface GenerateShootingScriptResponse {
  shooting_script: string;
  scene_breakdown: Array<{
    scene_number: string;
    location: string;
    time_of_day: string;
    characters: string[];
    props: string[];
    wardrobe_notes: string[];
    special_requirements: string[];
  }>;
  revision_notes: string[];
}

export interface ScriptBreakdownRequest {
  project_id: number;
  script_content: string;
  breakdown_type: 'full' | 'cast' | 'locations' | 'props' | 'wardrobe' | 'vfx';
}

export interface ScriptBreakdownResponse {
  breakdown_sheets: Array<{
    category: string;
    items: Array<{
      name: string;
      scenes: string[];
      description: string;
      priority: 'high' | 'medium' | 'low';
      notes: string;
    }>;
  }>;
  color_coding: Record<string, string>;
}

export interface ContinuityCheckRequest {
  project_id: number;
  script_content: string;
  previous_version?: string;
}

export interface ContinuityCheckResponse {
  continuity_issues: Array<{
    scene: string;
    issue_type: 'character' | 'prop' | 'wardrobe' | 'location' | 'time';
    description: string;
    severity: 'critical' | 'moderate' | 'minor';
    suggestions: string[];
  }>;
  revision_tracking: Array<{
    scene: string;
    change_type: string;
    description: string;
    color_code: string;
  }>;
}

// Generates a professional shooting script with scene numbers and breakdown.
export const generateShootingScript = api<GenerateShootingScriptRequest, GenerateShootingScriptResponse>(
  { expose: true, method: "POST", path: "/ai/script-supervisor/shooting-script" },
  async (req) => {
    // Process script and add shooting script elements
    const shootingScript = addShootingScriptElements(req.script_content, req);
    const sceneBreakdown = analyzeScenes(req.script_content);
    
    return {
      shooting_script: shootingScript,
      scene_breakdown: sceneBreakdown,
      revision_notes: [
        "Scene numbers added for production reference",
        "Character entrances and exits marked",
        "Technical requirements highlighted",
        "Continuity notes embedded",
        "Cross-functional notes added for all departments"
      ]
    };
  }
);

// Creates comprehensive script breakdown sheets with color coding.
export const generateScriptBreakdown = api<ScriptBreakdownRequest, ScriptBreakdownResponse>(
  { expose: true, method: "POST", path: "/ai/script-supervisor/breakdown" },
  async (req) => {
    const breakdown = createBreakdownSheets(req.script_content, req.breakdown_type);
    
    return {
      breakdown_sheets: breakdown,
      color_coding: {
        cast: "#FF6B6B",
        extras: "#4ECDC4", 
        props: "#45B7D1",
        wardrobe: "#96CEB4",
        makeup: "#FFEAA7",
        vehicles: "#DDA0DD",
        animals: "#98D8C8",
        vfx: "#F7DC6F",
        stunts: "#BB8FCE",
        locations: "#85C1E9",
        ai_actors: "#FFD700",
        human_actors: "#FF69B4"
      }
    };
  }
);

// Performs continuity checks and tracks script revisions.
export const checkContinuity = api<ContinuityCheckRequest, ContinuityCheckResponse>(
  { expose: true, method: "POST", path: "/ai/script-supervisor/continuity" },
  async (req) => {
    const continuityIssues = analyzeContinuity(req.script_content);
    const revisionTracking = req.previous_version ? 
      trackRevisions(req.previous_version, req.script_content) : [];
    
    return {
      continuity_issues: continuityIssues,
      revision_tracking: revisionTracking
    };
  }
);

function addShootingScriptElements(script: string, options: GenerateShootingScriptRequest): string {
  let shootingScript = script;
  
  // Add scene numbers
  if (options.scene_numbers !== false) {
    shootingScript = addSceneNumbers(shootingScript);
  }
  
  // Add revision colors
  if (options.revision_colors) {
    shootingScript = addRevisionColors(shootingScript);
  }
  
  // Add production notes
  shootingScript = addProductionNotes(shootingScript);
  
  // Add cross-functional notes
  shootingScript = addCrossFunctionalNotes(shootingScript);
  
  return shootingScript;
}

function addSceneNumbers(script: string): string {
  let sceneCount = 1;
  return script.replace(/(EXT\.|INT\.)/g, (match) => {
    return `${sceneCount++}. ${match}`;
  });
}

function addRevisionColors(script: string): string {
  // Add revision color coding (simulated)
  return script.replace(/\[REVISED\]/g, '[REVISED - BLUE]');
}

function addProductionNotes(script: string): string {
  // Add production-specific notes
  return script + "\n\n[PRODUCTION NOTES]\n- All scenes numbered for reference\n- Special effects marked\n- Continuity notes included\n- Cross-functional coordination points marked";
}

function addCrossFunctionalNotes(script: string): string {
  // Add cross-functional coordination notes
  return script + "\n\n[CROSS-FUNCTIONAL NOTES]\n- Casting: AI/Human actor coordination required\n- Camera: Virtual camera planning needed\n- Post: VFX integration points marked\n- Production: Schedule coordination with all departments";
}

function analyzeScenes(script: string) {
  // Mock scene analysis - in production, this would use NLP
  return [
    {
      scene_number: "1",
      location: "EXT. CITY STREET",
      time_of_day: "DAY",
      characters: ["JANE SMITH"],
      props: ["Briefcase", "Phone"],
      wardrobe_notes: ["Business attire", "Comfortable shoes"],
      special_requirements: ["Crowd extras", "Traffic control", "AI background actors"]
    },
    {
      scene_number: "2", 
      location: "INT. BUILDING LOBBY",
      time_of_day: "DAY",
      characters: ["JANE SMITH", "RECEPTIONIST"],
      props: ["Holographic display", "Security scanner"],
      wardrobe_notes: ["Same as previous scene"],
      special_requirements: ["Hologram VFX", "Futuristic set design", "AI receptionist character"]
    }
  ];
}

function createBreakdownSheets(script: string, type: string) {
  // Mock breakdown analysis with AI/Human actor support
  const fullBreakdown = [
    {
      category: "Cast",
      items: [
        {
          name: "Jane Smith",
          scenes: ["1", "2"],
          description: "Lead character, 30s, determined protagonist",
          priority: "high" as const,
          notes: "Human actor preferred, AI backup available"
        },
        {
          name: "Receptionist",
          scenes: ["2"],
          description: "AI hologram character",
          priority: "medium" as const,
          notes: "AI-generated character with voice synthesis"
        }
      ]
    },
    {
      category: "Props",
      items: [
        {
          name: "Briefcase",
          scenes: ["1"],
          description: "Modern leather briefcase",
          priority: "medium" as const,
          notes: "Hero prop, multiple copies needed"
        },
        {
          name: "Holographic Display",
          scenes: ["2"],
          description: "Futuristic interface",
          priority: "high" as const,
          notes: "VFX element, practical reference needed"
        }
      ]
    },
    {
      category: "AI/Human Coordination",
      items: [
        {
          name: "Background Actors",
          scenes: ["1"],
          description: "Crowd scenes with mixed AI/Human actors",
          priority: "medium" as const,
          notes: "50% AI generated, 50% human extras"
        },
        {
          name: "Voice Synthesis",
          scenes: ["2"],
          description: "AI character voice generation",
          priority: "high" as const,
          notes: "Real-time voice synthesis for AI receptionist"
        }
      ]
    }
  ];

  if (type === 'full') return fullBreakdown;
  return fullBreakdown.filter(sheet => sheet.category.toLowerCase().includes(type));
}

function analyzeContinuity(script: string) {
  // Mock continuity analysis with AI/Human considerations
  return [
    {
      scene: "Scene 2",
      issue_type: "wardrobe" as const,
      description: "Jane's briefcase disappears between scenes",
      severity: "moderate" as const,
      suggestions: [
        "Add line about setting briefcase down",
        "Ensure prop continuity in blocking",
        "Coordinate with AI background actors"
      ]
    },
    {
      scene: "Scene 2",
      issue_type: "character" as const,
      description: "AI receptionist character consistency",
      severity: "minor" as const,
      suggestions: [
        "Maintain consistent AI voice parameters",
        "Ensure hologram visual consistency",
        "Coordinate with VFX team for seamless integration"
      ]
    }
  ];
}

function trackRevisions(oldScript: string, newScript: string) {
  // Mock revision tracking with cross-functional considerations
  return [
    {
      scene: "Scene 1",
      change_type: "dialogue",
      description: "Added character motivation line",
      color_code: "blue"
    }
  ];
}
