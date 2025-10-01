import { api, APIError } from "encore.dev/api";
import { studioDB } from "./db";

export interface CreateProjectFileRequest {
  project_id: number;
  file_type: 'script' | 'treatment' | 'notes' | 'session' | 'asset' | 'edit';
  file_name: string;
  content: string;
  metadata?: Record<string, any>;
}

export interface CreateProjectFileResponse {
  file_id: string;
  file_path: string;
}

export interface GetProjectFilesRequest {
  project_id: number;
  file_type?: string;
}

export interface GetProjectFilesResponse {
  files: Array<{
    file_id: string;
    file_name: string;
    file_type: string;
    content: string;
    metadata: Record<string, any>;
    created_at: Date;
    updated_at: Date;
  }>;
}

export interface UpdateProjectFileRequest {
  file_id: string;
  content?: string;
  metadata?: Record<string, any>;
}

export interface UpdateProjectFileResponse {
  success: boolean;
}

// Creates a new file in the project file cabinet.
export const createProjectFile = api<CreateProjectFileRequest, CreateProjectFileResponse>(
  { expose: true, method: "POST", path: "/projects/:project_id/files" },
  async (req) => {
    const fileId = `FILE_${Date.now()}_${req.project_id}`;
    const filePath = `projects/${req.project_id}/${req.file_type}/${fileId}`;
    
    await studioDB.exec`
      INSERT INTO project_files (file_id, project_id, file_type, file_name, content, file_path, metadata)
      VALUES (${fileId}, ${req.project_id}, ${req.file_type}, ${req.file_name}, ${req.content}, ${filePath}, ${JSON.stringify(req.metadata || {})})
    `;

    return {
      file_id: fileId,
      file_path: filePath
    };
  }
);

// Retrieves all files for a project from the file cabinet.
export const getProjectFiles = api<GetProjectFilesRequest, GetProjectFilesResponse>(
  { expose: true, method: "GET", path: "/projects/:project_id/files" },
  async (req) => {
    let query = `SELECT * FROM project_files WHERE project_id = ${req.project_id}`;
    
    if (req.file_type) {
      query += ` AND file_type = '${req.file_type}'`;
    }
    
    query += ` ORDER BY created_at DESC`;
    
    const files = await studioDB.queryAll<any>(query as any);
    
    return {
      files: files.map(file => ({
        file_id: file.file_id,
        file_name: file.file_name,
        file_type: file.file_type,
        content: file.content,
        metadata: JSON.parse(file.metadata || '{}'),
        created_at: file.created_at,
        updated_at: file.updated_at
      }))
    };
  }
);

// Updates an existing file in the project file cabinet.
export const updateProjectFile = api<UpdateProjectFileRequest, UpdateProjectFileResponse>(
  { expose: true, method: "PUT", path: "/projects/files/:file_id" },
  async (req) => {
    const updates = [];
    const values = [];
    
    if (req.content !== undefined) {
      updates.push('content = $' + (values.length + 1));
      values.push(req.content);
    }
    
    if (req.metadata !== undefined) {
      updates.push('metadata = $' + (values.length + 1));
      values.push(JSON.stringify(req.metadata));
    }
    
    updates.push('updated_at = NOW()');
    
    const query = `UPDATE project_files SET ${updates.join(', ')} WHERE file_id = $${values.length + 1}`;
    values.push(req.file_id);
    
    await studioDB.rawExec(query, ...values);
    
    return { success: true };
  }
);
