// ============================================
// TYPESCRIPT TYPES
// Save as: frontend/src/types/casting.types.ts
// ============================================

export interface CastingProfile {
  character_name: string;
  age_range: string;
  physical_description: string;
  personality_traits: string[];
  key_scenes: string[];
  suggested_actors: string[];
  casting_notes: string;
}

export interface BudgetAnalysis {
  total_estimated_cost: string;
  breakdown: Record<string, string>;
  savings_opportunities: string[];
  risk_factors: string[];
}

export interface ScheduleAnalysis {
  total_production_days: number;
  pre_production: string;
  principal_photography: string;
  post_production: string;
  key_milestones: string[];
  critical_path: string[];
}

export type AnalysisType = "casting" | "budget" | "schedule";

export interface AnalysisRequest {
  character_name: string;
  project_type: "feature" | "series" | "commercial" | "short" | "documentary";
  budget_range: "low" | "medium" | "high" | "blockbuster";
  analysis_type: AnalysisType;
}
