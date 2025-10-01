import { api } from "encore.dev/api";
import { secret } from "encore.dev/config";
import Anthropic from "@anthropic-ai/sdk";

// Secret configuration for API key
const anthropicKey = secret("AnthropicAPIKey");

interface CastingRequest {
  character_name: string;
  project_type: string;
  budget_range: string;
  analysis_type: "casting" | "budget" | "schedule";
  additional_context?: string;
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
  ai_powered: boolean;
}

/**
 * Generate AI-powered casting analysis using Claude
 */
export const analyzeWithClaude = api(
  { method: "POST", path: "/casting/analyze-ai" },
  async (req: CastingRequest): Promise<AnalysisResponse> => {
    try {
      // Initialize Anthropic client
      const anthropic = new Anthropic({
        apiKey: anthropicKey(),
      });

      // Generate AI response based on analysis type
      let prompt = "";

      if (req.analysis_type === "casting") {
        prompt = generateCastingPrompt(req);
      } else if (req.analysis_type === "budget") {
        prompt = generateBudgetPrompt(req);
      } else {
        prompt = generateSchedulePrompt(req);
      }

      // Call Claude API
      const message = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2048,
        temperature: 0.7,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      // Parse AI response
      const content = message.content[0];
      if (content.type !== "text") {
        throw new Error("Unexpected response type from Claude");
      }

      // Extract JSON from response (Claude returns markdown with code blocks)
      const jsonMatch = content.text.match(/```json\n([\s\S]*?)\n```/) ||
                       content.text.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        throw new Error("Could not parse JSON from AI response");
      }

      const data = JSON.parse(jsonMatch[1] || jsonMatch[0]);

      return {
        success: true,
        data,
        ai_powered: true,
      };
    } catch (error) {
      console.error("Claude AI error:", error);

      // Fallback to mock data if AI fails
      return getFallbackResponse(req);
    }
  }
);

/**
 * Generate casting profile prompt for Claude
 */
function generateCastingPrompt(req: CastingRequest): string {
  return `You are a professional casting director with 20+ years of experience in film and television production.

Generate a detailed casting profile for the following character:

Character Name: ${req.character_name}
Project Type: ${req.project_type}
Budget Range: ${req.budget_range}
${req.additional_context ? `Additional Context: ${req.additional_context}` : ''}

Please provide a comprehensive casting profile in JSON format with the following structure:

{
  "character_name": "${req.character_name}",
  "age_range": "specific age range (e.g., 28-35)",
  "physical_description": "detailed physical attributes",
  "personality_traits": ["trait1", "trait2", "trait3", "trait4"],
  "key_scenes": ["scene1", "scene2", "scene3"],
  "suggested_actors": ["actor type/background 1", "actor type/background 2", "actor type/background 3"],
  "casting_notes": "professional notes for the casting team"
}

Consider the project type and budget when making suggestions. Be specific and professional.`;
}

/**
 * Generate budget analysis prompt for Claude
 */
function generateBudgetPrompt(req: CastingRequest): string {
  return `You are a production accountant and budget analyst with expertise in ${req.project_type} productions.

Analyze the budget requirements for:

Project Type: ${req.project_type}
Budget Range: ${req.budget_range}
Character: ${req.character_name}
${req.additional_context ? `Additional Context: ${req.additional_context}` : ''}

Provide a detailed budget analysis in JSON format:

{
  "total_estimated_cost": "specific dollar amount",
  "breakdown": {
    "cast": "percentage with dollar amount",
    "crew": "percentage with dollar amount",
    "equipment": "percentage with dollar amount",
    "post_production": "percentage with dollar amount",
    "miscellaneous": "percentage with dollar amount"
  },
  "savings_opportunities": ["opportunity 1", "opportunity 2", "opportunity 3"],
  "risk_factors": ["risk 1", "risk 2", "risk 3"]
}

Base your estimates on current industry standards for ${req.budget_range} budget ${req.project_type} projects.`;
}

/**
 * Generate production schedule prompt for Claude
 */
function generateSchedulePrompt(req: CastingRequest): string {
  return `You are a production coordinator with extensive experience scheduling ${req.project_type} productions.

Create a production schedule for:

Project Type: ${req.project_type}
Budget Range: ${req.budget_range}
Character: ${req.character_name}
${req.additional_context ? `Additional Context: ${req.additional_context}` : ''}

Provide a detailed schedule in JSON format:

{
  "total_production_days": specific number,
  "pre_production": "duration in weeks",
  "principal_photography": "duration in weeks",
  "post_production": "duration in weeks",
  "key_milestones": ["milestone 1 with timing", "milestone 2 with timing", "milestone 3 with timing", "milestone 4 with timing"],
  "critical_path": ["critical item 1", "critical item 2", "critical item 3"]
}

Consider industry standards for ${req.budget_range} budget ${req.project_type} productions.`;
}

/**
 * Fallback to mock data if AI fails
 */
function getFallbackResponse(req: CastingRequest): AnalysisResponse {
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
    ai_powered: false,
  };
}

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
