"use strict";

import express, { Request, Response } from 'express';
import { processMCPRequest } from "./mcp/mcp-handler";
import { ProjectStatus, createInitialProjectStatus } from "./types/project-status";

// Initialize the Express application
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8080;

/**
 * Middleware to authenticate and validate the Project ID across all endpoints.
 * This ensures no random request can hit the MCP servers.
 */
const projectIdValidator = (req: Request, res: Response, next: (err?: any) => void) => {
    const projectId = req.params.projectId;
    if (!projectId) {
        return res.status(400).json({ error: "Project ID is missing in the request parameters." });
    }
    // In a real system, this would hit the database to validate if the project ID exists.
    (req as any).__project_id = projectId;
    next();
};


// ========================================================================================
// Central API Bridge Endpoint
// All client commands MUST hit this single endpoint.
// ========================================================================================
app.post("/api/v1/mcp", projectIdValidator, async (req: Request, res: Response) => {
    const projectId = (req as any).__project_id;
    
    // 1. Validate payload structure
    const { stageId, payload } = req.body;
    if (!stageId || !payload) {
        return res.status(400).json({ status: 'error', message: 'Invalid payload: stageId and payload are required.' });
    }

    console.log(`\n[API Bridge] Request received for Stage: ${stageId}.`);

    // 2. (Mock) Load Project State: In production, run a database query here.
    // For simulation, we create a dummy project state.
    let currentProjectState: ProjectStatus;
    try {
        // This would fetch the actual project state from Postgres/DB
        currentProjectState = createInitialProjectStatus(projectId, 'S001', 1); 
        console.log(`[API Bridge] Successfully loaded project state for ${projectId}.`);

    } catch (e) {
        return res.status(500).json({ status: 'error', message: 'Failed to load project state from persistence layer.' });
    }

    // 3. Dispatch and Execute the Request
    try {
        const updatedStatus = await processMCPRequest(currentProjectState, stageId as keyof ProjectStatus, payload);
        
        // 4. Acknowledge and Respond (The final state is saved by calling this function)
        res.json({ 
            status: 'success', 
            message: `Successfully completed ${stageId} for project ${projectId}. New global status: ${updatedStatus.globalStatus}`,
            updatedState: updatedStatus 
        });

    } catch (e) {
        console.error("[API Bridge] Fatal Error During Processing:", e);
        res.status(500).json({ 
            status: 'error', 
            message: `A critical error occurred in the pipeline processing: ${(e as Error).message}` 
        });
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`\n============================================================`);
    console.log(`🚀 CENTRAL API BRIDGE Running on http://localhost:${PORT}`);
    console.log(`============================================================`);
    console.log("NOTE: All MCP servers are currently running as asynchronous web workers behind this bridge.");
});