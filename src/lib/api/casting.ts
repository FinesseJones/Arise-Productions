// ============================================
// API SERVICE FOR CASTING
// Save as: frontend/src/lib/api/casting.ts
// ============================================

interface CastingRequest {
  character_name: string;
  project_type: string;
  budget_range: string;
  analysis_type: "casting" | "budget" | "schedule";
}

interface CastingResponse {
  success: boolean;
  data: any;
  error?: string;
}

export class CastingAPI {
  private static baseURL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  /**
   * Generate casting analysis using AI
   */
  static async generateCastingAnalysis(request: CastingRequest): Promise<CastingResponse> {
    try {
      const response = await fetch(`${this.baseURL}/casting/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error("Casting API error:", error);
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Save casting profile to database
   */
  static async saveCastingProfile(profile: any): Promise<CastingResponse> {
    try {
      const response = await fetch(`${this.baseURL}/casting/profiles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error("Save profile error:", error);
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Get all saved casting profiles
   */
  static async getCastingProfiles(): Promise<CastingResponse> {
    try {
      const response = await fetch(`${this.baseURL}/casting/profiles`);
      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error("Get profiles error:", error);
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}
