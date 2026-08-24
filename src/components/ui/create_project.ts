import { api } from "encore.dev/api";
import { studioDB } from "./db";
import type { Project } from "./types";

export interface CreateProjectRequest {
  title: string;
  description?: string;
  genre?: string;
}

export interface CreateProjectResponse {
  project: Project;
}

// Creates a new film project with automated setup.
export const createProject = api<CreateProjectRequest, CreateProjectResponse>(
  { expose: true, method: "POST", path: "/projects" },
  async (req) => {
    const project = await studioDB.queryRow<Project>`
      INSERT INTO projects (title, description, genre, status, metadata)
      VALUES (${req.title}, ${req.description || null}, ${req.genre || null}, 'development', '{}')
      RETURNING *
    `;

    if (!project) {
      throw new Error("Failed to create project");
    }

    // Auto-generate initial project structure
    await initializeProjectStructure(project.id);

    return { project };
  }
);

async function initializeProjectStructure(projectId: number) {
  // Create default project assets
  const defaultAssets = [
    { type: 'script', name: 'Main Script' },
    { type: 'treatment', name: 'Treatment' },
    { type: 'shot_list', name: 'Shot List' },
    { type: 'call_sheet', name: 'Call Sheets' },
    { type: 'budget', name: 'Budget Breakdown' },
    { type: 'schedule', name: 'Production Schedule' },
    { type: 'casting', name: 'Casting Sheets' },
    { type: 'storyboard', name: 'Storyboards' },
    { type: 'location', name: 'Location Releases' },
    { type: 'talent', name: 'Talent Releases' }
  ];

  for (const asset of defaultAssets) {
    await studioDB.exec`
      INSERT INTO project_assets (project_id, asset_type, asset_name, metadata)
      VALUES (${projectId}, ${asset.type}, ${asset.name}, '{}')
    `;
  }

  // Create initial production schedule
  await studioDB.exec`
    INSERT INTO production_schedules (project_id, schedule_type, schedule_data)
    VALUES (${projectId}, 'master', '{"phases": ["development", "pre_production", "production", "post_production", "distribution"]}')
  `;
}
