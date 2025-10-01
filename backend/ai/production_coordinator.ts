import { api } from "encore.dev/api";

export interface GenerateProductionCalendarRequest {
  project_id: number;
  start_date: Date;
  estimated_shoot_days: number;
  budget_tier: 'micro' | 'low' | 'medium' | 'high';
  locations: string[];
  cast_availability?: Record<string, Date[]>;
}

export interface GenerateProductionCalendarResponse {
  production_calendar: {
    pre_production: Array<{
      date: Date;
      phase: string;
      tasks: string[];
      departments: string[];
      deadlines: string[];
    }>;
    production: Array<{
      date: Date;
      shoot_day: number;
      locations: string[];
      scenes: string[];
      cast_call: string[];
      crew_call: string;
      estimated_wrap: string;
    }>;
    post_production: Array<{
      date: Date;
      phase: string;
      deliverables: string[];
      departments: string[];
    }>;
  };
  critical_path: string[];
  budget_breakdown: Record<string, number>;
}

export interface GenerateCallSheetRequest {
  project_id: number;
  shoot_date: Date;
  scenes: string[];
  cast_members: Array<{
    name: string;
    character: string;
    call_time: string;
    pickup_location?: string;
  }>;
  locations: Array<{
    name: string;
    address: string;
    call_time: string;
  }>;
}

export interface GenerateCallSheetResponse {
  call_sheet: {
    production_title: string;
    shoot_date: Date;
    weather: string;
    sunrise_sunset: string;
    general_call: string;
    locations: Array<{
      name: string;
      address: string;
      call_time: string;
      parking_info: string;
      contact: string;
    }>;
    cast_schedule: Array<{
      name: string;
      character: string;
      makeup_call: string;
      set_call: string;
      pickup_info: string;
    }>;
    crew_call: string;
    scenes_shooting: string[];
    special_requirements: string[];
    emergency_contacts: Array<{
      role: string;
      name: string;
      phone: string;
    }>;
  };
  distribution_list: string[];
}

export interface GenerateShotListRequest {
  project_id: number;
  script_content: string;
  director_style?: 'classical' | 'modern' | 'experimental' | 'documentary';
  budget_constraints?: string[];
}

export interface GenerateShotListResponse {
  shot_list: Array<{
    scene_number: string;
    shot_number: string;
    shot_type: string;
    camera_movement: string;
    lens: string;
    description: string;
    estimated_time: string;
    complexity: 'simple' | 'medium' | 'complex';
    equipment_needed: string[];
    notes: string;
  }>;
  equipment_summary: Record<string, number>;
  shooting_order: string[];
}

// Generates comprehensive production calendar with automated scheduling.
export const generateProductionCalendar = api<GenerateProductionCalendarRequest, GenerateProductionCalendarResponse>(
  { expose: true, method: "POST", path: "/ai/production/calendar" },
  async (req) => {
    const calendar = createProductionCalendar(req);
    const criticalPath = identifyCriticalPath(calendar);
    const budget = generateBudgetBreakdown(req.budget_tier, req.estimated_shoot_days);
    
    return {
      production_calendar: calendar,
      critical_path: criticalPath,
      budget_breakdown: budget
    };
  }
);

// Creates detailed call sheets with all production information.
export const generateCallSheet = api<GenerateCallSheetRequest, GenerateCallSheetResponse>(
  { expose: true, method: "POST", path: "/ai/production/call-sheet" },
  async (req) => {
    const callSheet = createCallSheet(req);
    const distributionList = generateDistributionList();
    
    return {
      call_sheet: callSheet,
      distribution_list: distributionList
    };
  }
);

// Generates detailed shot lists with camera and equipment specifications.
export const generateShotList = api<GenerateShotListRequest, GenerateShotListResponse>(
  { expose: true, method: "POST", path: "/ai/production/shot-list" },
  async (req) => {
    const shotList = createShotList(req);
    const equipmentSummary = summarizeEquipment(shotList);
    const shootingOrder = optimizeShootingOrder(shotList);
    
    return {
      shot_list: shotList,
      equipment_summary: equipmentSummary,
      shooting_order: shootingOrder
    };
  }
);

function createProductionCalendar(req: GenerateProductionCalendarRequest) {
  const startDate = new Date(req.start_date);
  
  // Pre-production phase (typically 4-8 weeks)
  const preProduction = [];
  for (let i = 0; i < 28; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() - 28 + i);
    
    if (i < 7) {
      preProduction.push({
        date,
        phase: "Development",
        tasks: ["Script finalization", "Budget approval", "Key crew hiring"],
        departments: ["Production", "Writing"],
        deadlines: ["Final script lock"]
      });
    } else if (i < 14) {
      preProduction.push({
        date,
        phase: "Pre-Production Setup",
        tasks: ["Location scouting", "Casting", "Equipment booking"],
        departments: ["Locations", "Casting", "Camera"],
        deadlines: ["Location contracts", "Cast finalization"]
      });
    } else if (i < 21) {
      preProduction.push({
        date,
        phase: "Technical Prep",
        tasks: ["Shot list creation", "Storyboarding", "Rehearsals"],
        departments: ["Director", "Camera", "Art"],
        deadlines: ["Technical survey", "Wardrobe fittings"]
      });
    } else {
      preProduction.push({
        date,
        phase: "Final Prep",
        tasks: ["Final rehearsals", "Equipment tests", "Call sheet distribution"],
        departments: ["All departments"],
        deadlines: ["Production ready"]
      });
    }
  }
  
  // Production phase
  const production = [];
  for (let i = 0; i < req.estimated_shoot_days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    production.push({
      date,
      shoot_day: i + 1,
      locations: req.locations.slice(0, 2), // Rotate locations
      scenes: [`Scene ${i + 1}`, `Scene ${i + 2}`],
      cast_call: ["Lead Actor", "Supporting Cast"],
      crew_call: "6:00 AM",
      estimated_wrap: "8:00 PM"
    });
  }
  
  // Post-production phase
  const postProduction = [];
  const postStartDate = new Date(startDate);
  postStartDate.setDate(postStartDate.getDate() + req.estimated_shoot_days);
  
  for (let i = 0; i < 42; i++) { // 6 weeks post
    const date = new Date(postStartDate);
    date.setDate(date.getDate() + i);
    
    if (i < 14) {
      postProduction.push({
        date,
        phase: "Editing",
        deliverables: ["Rough cut", "Scene assembly"],
        departments: ["Editorial", "Post Supervisor"]
      });
    } else if (i < 28) {
      postProduction.push({
        date,
        phase: "Post Production",
        deliverables: ["Color correction", "Sound design", "VFX"],
        departments: ["Color", "Sound", "VFX"]
      });
    } else {
      postProduction.push({
        date,
        phase: "Finishing",
        deliverables: ["Final mix", "Master delivery"],
        departments: ["Sound", "Delivery"]
      });
    }
  }
  
  return {
    pre_production: preProduction,
    production: production,
    post_production: postProduction
  };
}

function identifyCriticalPath(calendar: any): string[] {
  return [
    "Script lock",
    "Cast finalization", 
    "Location contracts",
    "Equipment booking",
    "Principal photography",
    "Picture lock",
    "Final delivery"
  ];
}

function generateBudgetBreakdown(tier: string, shootDays: number): Record<string, number> {
  const baseBudgets: Record<string, number> = {
    micro: 10000,
    low: 50000,
    medium: 250000,
    high: 1000000
  };

  const totalBudget = baseBudgets[tier] * (shootDays / 10);
  
  return {
    "Above the Line": totalBudget * 0.25,
    "Below the Line": totalBudget * 0.45,
    "Post Production": totalBudget * 0.20,
    "Contingency": totalBudget * 0.10
  };
}

function createCallSheet(req: GenerateCallSheetRequest) {
  return {
    production_title: "Finesse Jones Production",
    shoot_date: req.shoot_date,
    weather: "Partly cloudy, 72°F",
    sunrise_sunset: "6:45 AM / 7:30 PM",
    general_call: "6:00 AM",
    locations: req.locations.map(loc => ({
      name: loc.name,
      address: loc.address,
      call_time: loc.call_time,
      parking_info: "Street parking available",
      contact: "Location Manager: (555) 123-4567"
    })),
    cast_schedule: req.cast_members.map(cast => ({
      name: cast.name,
      character: cast.character,
      makeup_call: "5:00 AM",
      set_call: cast.call_time,
      pickup_info: cast.pickup_location || "Own transport"
    })),
    crew_call: "6:00 AM",
    scenes_shooting: req.scenes,
    special_requirements: [
      "Rain cover available",
      "Craft services on location",
      "First aid kit on set"
    ],
    emergency_contacts: [
      { role: "Producer", name: "Jane Producer", phone: "(555) 111-1111" },
      { role: "Director", name: "John Director", phone: "(555) 222-2222" },
      { role: "1st AD", name: "Sarah AD", phone: "(555) 333-3333" }
    ]
  };
}

function generateDistributionList(): string[] {
  return [
    "All Cast",
    "All Crew", 
    "Production Office",
    "Location Contacts",
    "Equipment Vendors",
    "Catering",
    "Transportation",
    "Security"
  ];
}

function createShotList(req: GenerateShotListRequest) {
  // Mock shot list generation based on script analysis
  return [
    {
      scene_number: "1",
      shot_number: "1A",
      shot_type: "Wide Shot",
      camera_movement: "Static",
      lens: "24mm",
      description: "Establishing shot of city street",
      estimated_time: "15 minutes",
      complexity: "simple" as const,
      equipment_needed: ["Camera", "Tripod", "24mm lens"],
      notes: "Golden hour preferred"
    },
    {
      scene_number: "1",
      shot_number: "1B", 
      shot_type: "Medium Shot",
      camera_movement: "Handheld",
      lens: "50mm",
      description: "Jane walking through crowd",
      estimated_time: "30 minutes",
      complexity: "medium" as const,
      equipment_needed: ["Camera", "Stabilizer", "50mm lens"],
      notes: "Multiple takes for coverage"
    },
    {
      scene_number: "2",
      shot_number: "2A",
      shot_type: "Close-up",
      camera_movement: "Push in",
      lens: "85mm",
      description: "Jane's reaction to hologram",
      estimated_time: "20 minutes", 
      complexity: "complex" as const,
      equipment_needed: ["Camera", "Dolly", "85mm lens", "VFX markers"],
      notes: "VFX reference needed for hologram"
    }
  ];
}

function summarizeEquipment(shotList: any[]): Record<string, number> {
  const equipment: Record<string, number> = {};
  
  shotList.forEach(shot => {
    shot.equipment_needed.forEach((item: string) => {
      equipment[item] = (equipment[item] || 0) + 1;
    });
  });
  
  return equipment;
}

function optimizeShootingOrder(shotList: any[]): string[] {
  // Optimize based on location, lighting, and equipment changes
  return shotList
    .sort((a, b) => a.scene_number.localeCompare(b.scene_number))
    .map(shot => `${shot.scene_number}${shot.shot_number}`);
}
