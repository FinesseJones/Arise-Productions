import { api } from "encore.dev/api";

export interface GenerateStoryboardRequest {
  project_id: number;
  script_content: string;
  visual_style?: 'realistic' | 'stylized' | 'comic' | 'cinematic';
  aspect_ratio?: '16:9' | '2.35:1' | '4:3' | '1:1';
}

export interface GenerateStoryboardResponse {
  storyboard_frames: Array<{
    scene_number: string;
    shot_number: string;
    description: string;
    camera_angle: string;
    composition_notes: string;
    visual_references: string[];
    technical_notes: string;
  }>;
  visual_style_guide: {
    color_palette: string[];
    lighting_notes: string;
    composition_rules: string[];
  };
}

export interface SimulateCameraShotRequest {
  project_id: number;
  shot_description: string;
  camera_type?: 'handheld' | 'steadicam' | 'dolly' | 'crane' | 'drone';
  lens_focal_length?: number;
  movement_type?: 'static' | 'pan' | 'tilt' | 'zoom' | 'dolly' | 'tracking';
}

export interface SimulateCameraShotResponse {
  shot_simulation: {
    camera_settings: {
      focal_length: number;
      aperture: string;
      iso: number;
      shutter_speed: string;
    };
    movement_profile: {
      start_position: string;
      end_position: string;
      duration: number;
      easing: string;
    };
    composition_analysis: {
      rule_of_thirds: boolean;
      leading_lines: string[];
      depth_layers: string[];
    };
    equipment_requirements: string[];
  };
  alternative_approaches: Array<{
    description: string;
    pros: string[];
    cons: string[];
  }>;
}

export interface GeneratePrevisRequest {
  project_id: number;
  scenes: string[];
  characters: Array<{
    name: string;
    height: number;
    build: string;
  }>;
  locations: Array<{
    name: string;
    dimensions: string;
    layout_description: string;
  }>;
}

export interface GeneratePrevisResponse {
  previsualization: {
    scene_layouts: Array<{
      scene_number: string;
      location: string;
      character_blocking: Array<{
        character: string;
        positions: Array<{
          timestamp: number;
          x: number;
          y: number;
          facing_direction: number;
        }>;
      }>;
      camera_positions: Array<{
        shot_number: string;
        position: { x: number; y: number; z: number };
        target: { x: number; y: number; z: number };
        lens: number;
      }>;
    }>;
    timing_breakdown: Array<{
      scene: string;
      estimated_duration: number;
      setup_time: number;
      shooting_time: number;
    }>;
  };
  optimization_suggestions: string[];
}

// Generates dynamic storyboards from script content with visual style guidance.
export const generateStoryboard = api<GenerateStoryboardRequest, GenerateStoryboardResponse>(
  { expose: true, method: "POST", path: "/ai/virtual-camera/storyboard" },
  async (req) => {
    const storyboardFrames = createStoryboardFrames(req);
    const styleGuide = generateVisualStyleGuide(req.visual_style || 'cinematic');
    
    return {
      storyboard_frames: storyboardFrames,
      visual_style_guide: styleGuide
    };
  }
);

// Simulates camera shots with technical specifications and movement profiles.
export const simulateCameraShot = api<SimulateCameraShotRequest, SimulateCameraShotResponse>(
  { expose: true, method: "POST", path: "/ai/virtual-camera/simulate" },
  async (req) => {
    const simulation = createShotSimulation(req);
    const alternatives = generateAlternativeApproaches(req);
    
    return {
      shot_simulation: simulation,
      alternative_approaches: alternatives
    };
  }
);

// Creates 3D previsualization with character blocking and camera positioning.
export const generatePrevisualization = api<GeneratePrevisRequest, GeneratePrevisResponse>(
  { expose: true, method: "POST", path: "/ai/virtual-camera/previs" },
  async (req) => {
    const previs = createPrevisualization(req);
    const optimizations = generateOptimizationSuggestions(previs);
    
    return {
      previsualization: previs,
      optimization_suggestions: optimizations
    };
  }
);

function createStoryboardFrames(req: GenerateStoryboardRequest) {
  // AI-powered storyboard generation
  return [
    {
      scene_number: "1",
      shot_number: "1A",
      description: "Wide establishing shot of bustling city street",
      camera_angle: "Eye level, wide angle",
      composition_notes: "Rule of thirds, leading lines from street perspective",
      visual_references: ["Blade Runner 2049 city scenes", "Her urban environments"],
      technical_notes: "24mm lens, deep focus, natural lighting"
    },
    {
      scene_number: "1", 
      shot_number: "1B",
      description: "Medium shot of Jane walking through crowd",
      camera_angle: "Slightly low angle, following movement",
      composition_notes: "Subject in center frame, crowd creates depth",
      visual_references: ["Lost in Translation crowd scenes"],
      technical_notes: "50mm lens, shallow DOF, handheld movement"
    },
    {
      scene_number: "2",
      shot_number: "2A", 
      description: "Close-up of Jane's face as she sees the hologram",
      camera_angle: "Slightly high angle, intimate framing",
      composition_notes: "Face fills frame, eyes on upper third line",
      visual_references: ["Ex Machina character close-ups"],
      technical_notes: "85mm lens, very shallow DOF, controlled lighting"
    }
  ];
}

function generateVisualStyleGuide(style: string) {
  const styleGuides = {
    realistic: {
      color_palette: ["#2C3E50", "#34495E", "#7F8C8D", "#BDC3C7", "#ECF0F1"],
      lighting_notes: "Natural lighting with practical sources, minimal artificial enhancement",
      composition_rules: ["Rule of thirds", "Natural framing", "Realistic depth of field"]
    },
    stylized: {
      color_palette: ["#E74C3C", "#F39C12", "#F1C40F", "#2ECC71", "#3498DB"],
      lighting_notes: "High contrast, dramatic shadows, color temperature shifts",
      composition_rules: ["Dynamic angles", "Asymmetrical balance", "Bold foreground elements"]
    },
    cinematic: {
      color_palette: ["#1A1A1A", "#2C5F2D", "#97BC62", "#F4E4BC", "#D4A574"],
      lighting_notes: "Three-point lighting, motivated sources, cinematic color grading",
      composition_rules: ["Widescreen framing", "Depth layering", "Leading lines"]
    }
  };
  
  return styleGuides[style] || styleGuides.cinematic;
}

function createShotSimulation(req: SimulateCameraShotRequest) {
  const focalLength = req.lens_focal_length || 50;
  const cameraType = req.camera_type || 'handheld';
  
  return {
    camera_settings: {
      focal_length: focalLength,
      aperture: focalLength > 70 ? "f/2.8" : "f/4.0",
      iso: cameraType === 'handheld' ? 800 : 400,
      shutter_speed: cameraType === 'handheld' ? "1/100" : "1/50"
    },
    movement_profile: {
      start_position: "Camera left, medium height",
      end_position: "Camera right, same height", 
      duration: 8,
      easing: "ease-in-out"
    },
    composition_analysis: {
      rule_of_thirds: true,
      leading_lines: ["Architectural elements", "Character movement"],
      depth_layers: ["Foreground subject", "Mid-ground environment", "Background atmosphere"]
    },
    equipment_requirements: getEquipmentForCameraType(cameraType)
  };
}

function getEquipmentForCameraType(type: string): string[] {
  const equipmentMap = {
    handheld: ["Camera body", "Handheld rig", "Follow focus", "Monitor"],
    steadicam: ["Camera body", "Steadicam system", "Vest", "Monitor"],
    dolly: ["Camera body", "Dolly track", "Dolly", "Tripod head"],
    crane: ["Camera body", "Crane/jib", "Remote head", "Wireless monitor"],
    drone: ["Drone", "Gimbal", "FPV goggles", "Landing pad"]
  };
  
  return equipmentMap[type] || equipmentMap.handheld;
}

function generateAlternativeApproaches(req: SimulateCameraShotRequest) {
  return [
    {
      description: "Static wide shot with character movement",
      pros: ["Simpler setup", "Lower cost", "More stable image"],
      cons: ["Less dynamic", "May feel distant", "Limited visual interest"]
    },
    {
      description: "Handheld close-up with natural movement",
      pros: ["Intimate feel", "Natural energy", "Flexible framing"],
      cons: ["Potential instability", "Requires skilled operator", "May distract from performance"]
    },
    {
      description: "Dolly push-in for emotional emphasis",
      pros: ["Smooth movement", "Emotional impact", "Professional look"],
      cons: ["Requires track setup", "Time consuming", "Equipment intensive"]
    }
  ];
}

function createPrevisualization(req: GeneratePrevisRequest) {
  return {
    scene_layouts: req.scenes.map((scene, index) => ({
      scene_number: scene,
      location: req.locations[0]?.name || "Default Location",
      character_blocking: req.characters.map(char => ({
        character: char.name,
        positions: [
          { timestamp: 0, x: 0, y: 0, facing_direction: 90 },
          { timestamp: 5, x: 2, y: 1, facing_direction: 45 },
          { timestamp: 10, x: 4, y: 2, facing_direction: 0 }
        ]
      })),
      camera_positions: [
        {
          shot_number: `${index + 1}A`,
          position: { x: -5, y: 0, z: 1.5 },
          target: { x: 0, y: 0, z: 1.5 },
          lens: 24
        },
        {
          shot_number: `${index + 1}B`,
          position: { x: -2, y: 2, z: 1.5 },
          target: { x: 2, y: 1, z: 1.5 },
          lens: 50
        }
      ]
    })),
    timing_breakdown: req.scenes.map(scene => ({
      scene: scene,
      estimated_duration: 120, // 2 minutes
      setup_time: 30,
      shooting_time: 90
    }))
  };
}

function generateOptimizationSuggestions(previs: any): string[] {
  return [
    "Consider combining similar camera angles to reduce setup time",
    "Group shots by location to minimize company moves",
    "Plan for natural lighting windows during exterior scenes",
    "Prepare backup indoor locations for weather contingencies",
    "Schedule complex camera movements during optimal crew energy periods"
  ];
}
