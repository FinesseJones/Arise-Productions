import { api } from "encore.dev/api";

export interface AIAgent {
  id: string;
  name: string;
  icon: string;
  description: string;
  capabilities: string[];
  gradient: string;
}

export interface ListAgentsResponse {
  agents: AIAgent[];
}

// Retrieves all AI agents with their capabilities.
export const list = api<void, ListAgentsResponse>(
  { expose: true, method: "GET", path: "/agents" },
  async () => {
    const agents: AIAgent[] = [
      {
        id: "screenwriting",
        name: "Screenwriting Assistant",
        icon: "FileText",
        description: "Expert in crafting compelling narratives, dialogue, and story structure",
        capabilities: [
          "Script development and formatting",
          "Character development",
          "Dialogue refinement",
          "Story structure analysis",
          "Genre-specific writing",
        ],
        gradient: "from-blue-500 via-purple-400 to-gold-400",
      },
      {
        id: "script-supervisor",
        name: "Script Supervisor",
        icon: "Settings",
        description: "Continuity and script accuracy specialist",
        capabilities: [
          "Continuity tracking",
          "Script breakdown",
          "Scene timing",
          "Production notes",
          "Script revisions",
        ],
        gradient: "from-green-500 via-emerald-400 to-gold-400",
      },
      {
        id: "casting-director",
        name: "Casting Director",
        icon: "Users",
        description: "Talent selection and casting specialist",
        capabilities: [
          "Talent scouting",
          "Character matching",
          "Audition coordination",
          "Role recommendations",
          "Ensemble building",
        ],
        gradient: "from-purple-500 via-violet-400 to-gold-400",
      },
      {
        id: "production-coordinator",
        name: "Production Coordinator",
        icon: "Calendar",
        description: "Scheduling and logistics management",
        capabilities: [
          "Production scheduling",
          "Resource coordination",
          "Location management",
          "Team scheduling",
          "Timeline tracking",
        ],
        gradient: "from-orange-500 via-gold-400 to-yellow-400",
      },
      {
        id: "camera-operator",
        name: "Virtual Camera Operator",
        icon: "Camera",
        description: "Camera work and cinematography expert",
        capabilities: [
          "Shot planning",
          "Camera movements",
          "Framing and composition",
          "Lens selection",
          "Cinematography guidance",
        ],
        gradient: "from-pink-500 via-purple-400 to-gold-400",
      },
      {
        id: "post-production",
        name: "Post-Production Supervisor",
        icon: "Palette",
        description: "Post-production workflow and color specialist",
        capabilities: [
          "Post workflow planning",
          "Color grading",
          "Visual consistency",
          "Final output quality",
          "Delivery management",
        ],
        gradient: "from-indigo-500 via-purple-400 to-gold-400",
      },
      {
        id: "distribution",
        name: "Distribution Desk",
        icon: "Share",
        description: "Distribution and platform strategy",
        capabilities: [
          "Platform selection",
          "Distribution strategy",
          "Format optimization",
          "Delivery scheduling",
          "Release planning",
        ],
        gradient: "from-teal-500 via-blue-400 to-gold-400",
      },
      {
        id: "forms-generator",
        name: "Studio Forms Generator",
        icon: "Scissors",
        description: "Production documents and forms automation",
        capabilities: [
          "Contract generation",
          "Release forms",
          "Call sheets",
          "Production reports",
          "Legal documents",
        ],
        gradient: "from-yellow-500 via-gold-400 to-orange-400",
      },
    ];

    return { agents };
  }
);
