import { api } from "encore.dev/api";

interface CastingRequest {
  character_name: string;
  project_type: string;
  budget_range: string;
  analysis_type: "casting" | "budget" | "schedule";
}

interface CastingProfile {
  character_name: string;
  age_range: string;
  physical_description: string;
  personality_traits: string[];
  key_scenes: string[];
  suggested_actors: string[];
  casting_notes: string;
}

interface BudgetAnalysis {
  total_estimated_cost: string;
  breakdown: Record<string, string>;
  savings_opportunities: string[];
  risk_factors: string[];
}

interface ScheduleAnalysis {
  total_production_days: number;
  pre_production: string;
  principal_photography: string;
  post_production: string;
  key_milestones: string[];
  critical_path: string[];
}

interface AnalysisResponse {
  success: boolean;
  data: CastingProfile | BudgetAnalysis | ScheduleAnalysis;
}

interface SaveProfileRequest {
  profile: any;
}

interface SaveProfileResponseData {
  id: string;
  created_at: string;
  profile?: any;
}

interface SaveProfileResponse {
  success: boolean;
  data: SaveProfileResponseData;
}

interface ProfilesResponse {
  success: boolean;
  data: any[];
}

/**
 * Generate AI-powered casting analysis
 */
export const analyzeCasting = api(
  { method: "POST", path: "/casting/analyze" },
  async (req: CastingRequest): Promise<AnalysisResponse> => {
    // TODO: Replace with actual AI API call (Claude, OpenAI, etc.)
    const mockResults = {
      casting: {
        character_name: req.character_name || "Hero Protagonist",
        age_range: "28-35",
        physical_description: "Athletic build, 5'8\"-6'2\", expressive eyes",
        personality_traits: ["Determined", "Intelligent", "Resourceful", "Charismatic"],
        key_scenes: ["Opening monologue", "Confrontation scene", "Final resolution"],
        suggested_actors: [
          "Actor A (TV experience)",
          "Actor B (Theater background)",
          "Actor C (Film veteran)",
        ],
        casting_notes:
          "Look for someone with strong improvisational skills and combat training background.",
      },
      budget: {
        total_estimated_cost: calculateBudget(req.budget_range),
        breakdown: {
          cast: "35%",
          crew: "26%",
          equipment: "17%",
          post_production: "15%",
          miscellaneous: "7%",
        },
        savings_opportunities: [
          "Use local talent for supporting roles",
          "Leverage existing equipment partnerships",
          "Consider tax incentives in filming locations",
        ],
        risk_factors: [
          "Weather-dependent outdoor scenes",
          "Celebrity availability conflicts",
          "Equipment rental market volatility",
        ],
      },
      schedule: {
        total_production_days: calculateProductionDays(req.project_type),
        pre_production: "8 weeks",
        principal_photography: "6 weeks",
        post_production: "12 weeks",
        key_milestones: [
          "Script lock: Week 2",
          "Cast finalization: Week 4",
          "Location scouting: Week 6",
          "First day of principal photography: Week 10",
        ],
        critical_path: [
          "Lead actor availability",
          "VFX shot completion",
          "Music composition and scoring",
          "Final color grading",
        ],
      },
    };

    return {
      success: true,
      data: mockResults[req.analysis_type],
    };
  }
);

/**
 * Save casting profile to database
 */
export const saveCastingProfile = api(
  { method: "POST", path: "/casting/profiles" },
  async (req: SaveProfileRequest): Promise<SaveProfileResponse> => {
    // TODO: Implement database save
    return {
      success: true,
      data: {
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        profile: req.profile,
      },
    };
  }
);

/**
 * Get all casting profiles
 */
export const getCastingProfiles = api(
  { method: "GET", path: "/casting/profiles" },
  async (): Promise<ProfilesResponse> => {
    // TODO: Implement database fetch
    return {
      success: true,
      data: [],
    };
  }
);

/**
 * Calculate budget based on range
 */
function calculateBudget(range: string): string {
  const budgets: Record<string, string> = {
    low: "$350K",
    medium: "$2.3M",
    high: "$18M",
    blockbuster: "$85M",
  };
  return budgets[range] || "$2.3M";
}

/**
 * Calculate production days based on project type
 */
function calculateProductionDays(type: string): number {
  const days: Record<string, number> = {
    feature: 45,
    series: 120,
    commercial: 5,
    short: 10,
    documentary: 60,
  };
  return days[type] || 45;
}
