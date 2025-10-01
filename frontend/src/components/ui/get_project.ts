import { api, APIError } from "encore.dev/api";
import { studioDB } from "./db";
import type { Project, ProjectAsset, Script, Character } from "./types";

export interface GetProjectParams {
  id: number;
}

export interface GetProjectResponse {
  project: Project;
  assets: ProjectAsset[];
  scripts: Script[];
  characters: Character[];
}

// Retrieves a specific project with all associated data.
export const getProject = api<GetProjectParams, GetProjectResponse>(
  { expose: true, method: "GET", path: "/projects/:id" },
  async (params) => {
    const project = await studioDB.queryRow<Project>`
      SELECT * FROM projects WHERE id = ${params.id}
    `;

    if (!project) {
      throw APIError.notFound("project not found");
    }

    const [assets, scripts, characters] = await Promise.all([
      studioDB.queryAll<ProjectAsset>`
        SELECT * FROM project_assets WHERE project_id = ${params.id}
        ORDER BY created_at ASC
      `,
      studioDB.queryAll<Script>`
        SELECT * FROM scripts WHERE project_id = ${params.id}
        ORDER BY version DESC
      `,
      studioDB.queryAll<Character>`
        SELECT * FROM characters WHERE project_id = ${params.id}
        ORDER BY created_at ASC
      `
    ]);

    return { project, assets, scripts, characters };
  }
);
