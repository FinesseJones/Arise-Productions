import { api, APIError } from "encore.dev/api";
import { studioDB } from "./db";
import type { Project, ProjectStatus } from "./types";

export interface UpdateProjectStatusRequest {
  id: number;
  status: ProjectStatus;
}

export interface UpdateProjectStatusResponse {
  project: Project;
}

// Updates a project's production status and triggers automated workflow changes.
export const updateProjectStatus = api<UpdateProjectStatusRequest, UpdateProjectStatusResponse>(
  { expose: true, method: "PUT", path: "/projects/:id/status" },
  async (req) => {
    const project = await studioDB.queryRow<Project>`
      UPDATE projects 
      SET status = ${req.status}, updated_at = NOW()
      WHERE id = ${req.id}
      RETURNING *
    `;

    if (!project) {
      throw APIError.notFound("project not found");
    }

    // Trigger automated workflow changes based on status
    await handleStatusChange(project.id, req.status);

    return { project };
  }
);

async function handleStatusChange(projectId: number, status: ProjectStatus) {
  switch (status) {
    case 'pre_production':
      await generatePreProductionAssets(projectId);
      break;
    case 'production':
      await generateProductionAssets(projectId);
      break;
    case 'post_production':
      await generatePostProductionAssets(projectId);
      break;
    case 'distribution':
      await generateDistributionAssets(projectId);
      break;
  }
}

async function generatePreProductionAssets(projectId: number) {
  const assets = [
    { type: 'breakdown', name: 'Script Breakdown' },
    { type: 'casting_board', name: 'Casting Board' },
    { type: 'location_scout', name: 'Location Scouting' },
    { type: 'crew_list', name: 'Crew Contact List' }
  ];

  for (const asset of assets) {
    await studioDB.exec`
      INSERT INTO project_assets (project_id, asset_type, asset_name, metadata)
      VALUES (${projectId}, ${asset.type}, ${asset.name}, '{"auto_generated": true}')
      ON CONFLICT DO NOTHING
    `;
  }
}

async function generateProductionAssets(projectId: number) {
  const assets = [
    { type: 'daily_reports', name: 'Daily Production Reports' },
    { type: 'continuity_log', name: 'Continuity Log' },
    { type: 'footage_log', name: 'Footage Log' },
    { type: 'safety_reports', name: 'Safety Reports' }
  ];

  for (const asset of assets) {
    await studioDB.exec`
      INSERT INTO project_assets (project_id, asset_type, asset_name, metadata)
      VALUES (${projectId}, ${asset.type}, ${asset.name}, '{"auto_generated": true}')
      ON CONFLICT DO NOTHING
    `;
  }
}

async function generatePostProductionAssets(projectId: number) {
  const assets = [
    { type: 'edit_decision_list', name: 'Edit Decision List' },
    { type: 'color_notes', name: 'Color Correction Notes' },
    { type: 'sound_cue_sheet', name: 'Sound Cue Sheet' },
    { type: 'vfx_notes', name: 'VFX Notes' },
    { type: 'music_cue_sheet', name: 'Music Cue Sheet' }
  ];

  for (const asset of assets) {
    await studioDB.exec`
      INSERT INTO project_assets (project_id, asset_type, asset_name, metadata)
      VALUES (${projectId}, ${asset.type}, ${asset.name}, '{"auto_generated": true}')
      ON CONFLICT DO NOTHING
    `;
  }
}

async function generateDistributionAssets(projectId: number) {
  const assets = [
    { type: 'press_kit', name: 'Press Kit' },
    { type: 'screener', name: 'Screener Copies' },
    { type: 'delivery_specs', name: 'Delivery Specifications' },
    { type: 'festival_submissions', name: 'Festival Submission Package' },
    { type: 'streaming_package', name: 'Streaming Platform Package' }
  ];

  for (const asset of assets) {
    await studioDB.exec`
      INSERT INTO project_assets (project_id, asset_type, asset_name, metadata)
      VALUES (${projectId}, ${asset.type}, ${asset.name}, '{"auto_generated": true}')
      ON CONFLICT DO NOTHING
    `;
  }
}
