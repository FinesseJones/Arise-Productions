import { api } from "encore.dev/api";

export interface GenerateEditNotesRequest {
  project_id: number;
  rough_cut_description: string;
  target_runtime?: number;
  genre: string;
  director_notes?: string;
}

export interface GenerateEditNotesResponse {
  edit_analysis: {
    pacing_notes: string[];
    structure_suggestions: string[];
    cut_recommendations: Array<{
      timecode: string;
      suggestion: string;
      reason: string;
      priority: 'high' | 'medium' | 'low';
    }>;
    rhythm_analysis: string;
  };
  color_notes: Array<{
    scene: string;
    mood: string;
    color_direction: string;
    reference_images: string[];
  }>;
  sound_recommendations: Array<{
    element: string;
    description: string;
    timing_notes: string;
  }>;
}

export interface GenerateVFXHandoffRequest {
  project_id: number;
  vfx_shots: Array<{
    shot_number: string;
    description: string;
    complexity: 'simple' | 'medium' | 'complex';
    deadline: Date;
  }>;
  budget_tier: 'low' | 'medium' | 'high';
}

export interface GenerateVFXHandoffResponse {
  vfx_package: {
    shot_breakdown: Array<{
      shot_id: string;
      description: string;
      technical_specs: {
        resolution: string;
        frame_rate: string;
        color_space: string;
        codec: string;
      };
      reference_materials: string[];
      delivery_requirements: string[];
      estimated_hours: number;
      priority_level: number;
    }>;
    technical_requirements: {
      software_needed: string[];
      hardware_specs: string;
      file_formats: string[];
      delivery_method: string;
    };
    timeline: Array<{
      milestone: string;
      deadline: Date;
      deliverables: string[];
    }>;
  };
  budget_estimate: {
    total_cost: number;
    cost_breakdown: Record<string, number>;
    payment_schedule: Array<{
      milestone: string;
      percentage: number;
      amount: number;
    }>;
  };
}

export interface GenerateVersionTrackingRequest {
  project_id: number;
  version_type: 'rough_cut' | 'fine_cut' | 'picture_lock' | 'final';
  changes_description: string;
  stakeholder_notes?: Array<{
    stakeholder: string;
    notes: string;
    timestamp: Date;
  }>;
}

export interface GenerateVersionTrackingResponse {
  version_control: {
    version_number: string;
    change_log: Array<{
      timestamp: Date;
      change_type: string;
      description: string;
      affected_scenes: string[];
      editor: string;
    }>;
    approval_status: {
      director: 'pending' | 'approved' | 'needs_revision';
      producer: 'pending' | 'approved' | 'needs_revision';
      client: 'pending' | 'approved' | 'needs_revision';
    };
    next_steps: string[];
  };
  delivery_specs: {
    formats_needed: string[];
    resolution_requirements: string[];
    audio_specs: string[];
    subtitle_requirements: string[];
  };
}

// Analyzes rough cuts and provides intelligent editing suggestions.
export const generateEditNotes = api<GenerateEditNotesRequest, GenerateEditNotesResponse>(
  { expose: true, method: "POST", path: "/ai/post-production/edit-notes" },
  async (req) => {
    const editAnalysis = analyzeRoughCut(req);
    const colorNotes = generateColorNotes(req.genre);
    const soundRecommendations = generateSoundRecommendations(req);
    
    return {
      edit_analysis: editAnalysis,
      color_notes: colorNotes,
      sound_recommendations: soundRecommendations
    };
  }
);

// Creates comprehensive VFX handoff packages with technical specifications.
export const generateVFXHandoff = api<GenerateVFXHandoffRequest, GenerateVFXHandoffResponse>(
  { expose: true, method: "POST", path: "/ai/post-production/vfx-handoff" },
  async (req) => {
    const vfxPackage = createVFXPackage(req);
    const budgetEstimate = calculateVFXBudget(req);
    
    return {
      vfx_package: vfxPackage,
      budget_estimate: budgetEstimate
    };
  }
);

// Manages version control and approval workflows for post-production.
export const generateVersionTracking = api<GenerateVersionTrackingRequest, GenerateVersionTrackingResponse>(
  { expose: true, method: "POST", path: "/ai/post-production/version-tracking" },
  async (req) => {
    const versionControl = createVersionControl(req);
    const deliverySpecs = generateDeliverySpecs(req.version_type);
    
    return {
      version_control: versionControl,
      delivery_specs: deliverySpecs
    };
  }
);

function analyzeRoughCut(req: GenerateEditNotesRequest) {
  return {
    pacing_notes: [
      "Opening sequence could benefit from tighter pacing",
      "Middle section drags - consider removing 30-45 seconds",
      "Climax builds well but resolution feels rushed",
      "Dialogue scenes have good rhythm overall"
    ],
    structure_suggestions: [
      "Consider moving character introduction earlier",
      "Subplot integration could be smoother",
      "Ending needs stronger emotional payoff",
      "Transitions between acts need refinement"
    ],
    cut_recommendations: [
      {
        timecode: "00:05:23",
        suggestion: "Cut reaction shot by 1 second",
        reason: "Maintains momentum without losing emotional beat",
        priority: "medium" as const
      },
      {
        timecode: "00:12:45",
        suggestion: "Remove establishing shot",
        reason: "Location already established, slows pacing",
        priority: "high" as const
      },
      {
        timecode: "00:18:12",
        suggestion: "Extend pause before dialogue",
        reason: "Gives actor's performance more weight",
        priority: "low" as const
      }
    ],
    rhythm_analysis: "Overall rhythm is strong with good variation between fast and slow moments. Consider adding more breathing room in emotional scenes."
  };
}

function generateColorNotes(genre: string) {
  const genreColorGuides: Record<string, Array<{
    scene: string;
    mood: string;
    color_direction: string;
    reference_images: string[];
  }>> = {
    drama: [
      {
        scene: "Interior scenes",
        mood: "Intimate and warm",
        color_direction: "Warm highlights, neutral shadows, slight desaturation",
        reference_images: ["Her (2013) apartment scenes", "Marriage Story interiors"]
      }
    ],
    thriller: [
      {
        scene: "Suspense sequences",
        mood: "Tense and cold",
        color_direction: "Cool blue/teal shadows, desaturated overall, high contrast",
        reference_images: ["Gone Girl color palette", "Zodiac night scenes"]
      }
    ],
    scifi: [
      {
        scene: "Future technology",
        mood: "Clean and sterile",
        color_direction: "Cool whites, cyan highlights, minimal warmth",
        reference_images: ["Ex Machina lab scenes", "Blade Runner 2049 interiors"]
      }
    ]
  };

  return genreColorGuides[genre] || genreColorGuides.drama;
}

function generateSoundRecommendations(req: GenerateEditNotesRequest) {
  return [
    {
      element: "Dialogue",
      description: "Clean up background noise in scenes 3-5",
      timing_notes: "ADR may be needed for outdoor dialogue"
    },
    {
      element: "Music",
      description: "Underscore emotional moments without overwhelming dialogue",
      timing_notes: "Start music cues 2-3 seconds before emotional peaks"
    },
    {
      element: "Sound Effects",
      description: "Layer ambient sounds to create realistic environments",
      timing_notes: "Sync footsteps and practical sounds precisely"
    },
    {
      element: "Atmosphere",
      description: "Build tension through subtle sound design",
      timing_notes: "Gradually increase intensity leading to climax"
    }
  ];
}

function createVFXPackage(req: GenerateVFXHandoffRequest) {
  return {
    shot_breakdown: req.vfx_shots.map((shot, index) => ({
      shot_id: shot.shot_number,
      description: shot.description,
      technical_specs: {
        resolution: "4K (4096x2160)",
        frame_rate: "24fps",
        color_space: "Rec. 2020",
        codec: "ProRes 4444 XQ"
      },
      reference_materials: [
        "Concept art",
        "Reference footage",
        "Camera tracking data",
        "Lighting reference"
      ],
      delivery_requirements: [
        "Final composite in ProRes 4444",
        "Alpha channel for integration",
        "Render passes for flexibility",
        "Project files for future changes"
      ],
      estimated_hours: shot.complexity === 'simple' ? 8 : shot.complexity === 'medium' ? 24 : 72,
      priority_level: index + 1
    })),
    technical_requirements: {
      software_needed: ["After Effects", "Nuke", "Cinema 4D", "Houdini"],
      hardware_specs: "Minimum 32GB RAM, RTX 3080 or equivalent, 10TB storage",
      file_formats: ["EXR", "ProRes", "DPX", "TIFF"],
      delivery_method: "Secure FTP or cloud storage"
    },
    timeline: generateVFXTimeline(req.vfx_shots)
  };
}

function generateVFXTimeline(shots: any[]) {
  const startDate = new Date();
  return [
    {
      milestone: "Asset Creation",
      deadline: new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000),
      deliverables: ["3D models", "Textures", "Rigs"]
    },
    {
      milestone: "Animation/Simulation",
      deadline: new Date(startDate.getTime() + 14 * 24 * 60 * 60 * 1000),
      deliverables: ["Animated sequences", "Particle simulations", "Dynamics"]
    },
    {
      milestone: "Lighting/Rendering",
      deadline: new Date(startDate.getTime() + 21 * 24 * 60 * 60 * 1000),
      deliverables: ["Lit scenes", "Render passes", "Beauty renders"]
    },
    {
      milestone: "Compositing",
      deadline: new Date(startDate.getTime() + 28 * 24 * 60 * 60 * 1000),
      deliverables: ["Final composites", "Color correction", "Integration"]
    }
  ];
}

function calculateVFXBudget(req: GenerateVFXHandoffRequest) {
  const baseCosts = {
    low: { simple: 500, medium: 2000, complex: 8000 },
    medium: { simple: 1000, medium: 4000, complex: 15000 },
    high: { simple: 2000, medium: 8000, complex: 30000 }
  };
  
  const costs = baseCosts[req.budget_tier];
  let totalCost = 0;
  const breakdown: Record<string, number> = {};
  
  req.vfx_shots.forEach(shot => {
    const cost = costs[shot.complexity];
    totalCost += cost;
    breakdown[shot.shot_number] = cost;
  });
  
  return {
    total_cost: totalCost,
    cost_breakdown: breakdown,
    payment_schedule: [
      { milestone: "Project Start", percentage: 25, amount: totalCost * 0.25 },
      { milestone: "50% Complete", percentage: 35, amount: totalCost * 0.35 },
      { milestone: "Final Delivery", percentage: 40, amount: totalCost * 0.40 }
    ]
  };
}

function createVersionControl(req: GenerateVersionTrackingRequest) {
  const versionNumber = generateVersionNumber(req.version_type);
  
  return {
    version_number: versionNumber,
    change_log: [
      {
        timestamp: new Date(),
        change_type: "Edit",
        description: req.changes_description,
        affected_scenes: ["Scene 1", "Scene 3", "Scene 7"],
        editor: "Post Production Team"
      }
    ],
    approval_status: {
      director: "pending" as const,
      producer: "pending" as const,
      client: "pending" as const
    },
    next_steps: [
      "Review with director",
      "Incorporate feedback",
      "Prepare for next version",
      "Schedule screening"
    ]
  };
}

function generateVersionNumber(type: string): string {
  const versionMap: Record<string, string> = {
    rough_cut: "RC_001",
    fine_cut: "FC_001",
    picture_lock: "PL_001",
    final: "FINAL_001"
  };

  return versionMap[type] || "V_001";
}

function generateDeliverySpecs(versionType: string) {
  const specs: Record<string, {
    formats_needed: string[];
    resolution_requirements: string[];
    audio_specs: string[];
    subtitle_requirements: string[];
  }> = {
    rough_cut: {
      formats_needed: ["H.264 MP4", "ProRes 422"],
      resolution_requirements: ["1080p", "720p for review"],
      audio_specs: ["Stereo mix", "Temp music"],
      subtitle_requirements: ["None required"]
    },
    picture_lock: {
      formats_needed: ["ProRes 4444", "DPX sequence"],
      resolution_requirements: ["4K master", "2K working copy"],
      audio_specs: ["Separate stems", "Final mix"],
      subtitle_requirements: ["Closed captions", "Multiple languages"]
    },
    final: {
      formats_needed: ["ProRes 4444 XQ", "H.264", "DCP"],
      resolution_requirements: ["4K master", "2K theatrical", "1080p streaming"],
      audio_specs: ["5.1 surround", "Stereo mix", "Dolby Atmos"],
      subtitle_requirements: ["All required languages", "SDH"]
    }
  };

  return specs[versionType] || specs.final;
}
