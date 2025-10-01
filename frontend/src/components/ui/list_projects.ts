import { api } from "encore.dev/api";
import { studioDB } from "./db";
import type { Project } from "./types";

export interface ListProjectsResponse {
  projects: Project[];
}

// Retrieves all film projects, ordered by creation date (latest first).
export const listProjects = api<void, ListProjectsResponse>(
  { expose: true, method: "GET", path: "/projects" },
  async () => {
    const projects = await studioDB.queryAll<Project>`
      SELECT * FROM projects 
      ORDER BY created_at DESC
    `;

    return { projects };
  }
);
