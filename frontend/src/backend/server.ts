"use strict";

import express, { Request, Response } from 'express';
import { processMCPRequest, runCICDPipeline } from "./mcp/mcp-handler";
import { ProjectStatus, createInitialProjectStatus } from "./types/project-status";

// ... (Rest of the imports and setup remains the same)

/**
 * Middleware function to simulate Auth/Auth flow.
 * Checks for a valid user token and role before allowing the request to proceed.
 */
const securityGate = (req: Request, res: Response, next: (err?: any) => void) => {
    const { authToken, userRole } = req.headers;

    if (!authToken || !userRole) {
        return res.status(401).json({ status: 'error', message: 'Authentication required: Missing authentication tokens.' });
    }

    // --- Authorization Rule Set ---
    const isManager = userRole === 'ADMIN' || userRole === 'DIRECTOR';
    
    // Example of granular rights: Only ADMIN can trigger the final Master gate
    if (req.body.stageId === 'edit' && userRole !== 'ADMIN') {
         return res.status(403).json({ status: 'error', message: `Authorization Denied: '${userRole}' role lacks permissions to execute the final 'DaVinci MCP' stage.` });
    }
    // Example of general rights: Core roles can execute most stages
    if (['scripts', 'structure', 'previs', 'boards'].includes(req.body.stageId) && !isManager) {
         // We could add more granular permissions here if needed
    }
    
    (req as any).__user_role = userRole;
    (req as any).__user_id = authToken;
    next();
};


app.post("/api/v1/mcp", securityGate, async (req: Request, res: Response) => {
    const { stageId, payload } = req.body;
    
    // 1. Simulate Authentication and Authorization Success
    const userRole = (req as any).__user_role;
    const userId = (req as any).__user_id;
    
    const errorMessage = `Attempted access by user ${userId} (${userRole}) to stage ${stageId}.`;
    console.log(`\n[API Bridge Security] Authorization pre-check complete. ${errorMessage}`);


    // 2. (Mock) Load Project State
    let currentProjectState: ProjectStatus;
    try {
        // Setup new project with user ID for tracking
        currentProjectState = createInitialProjectStatus("DEFAULT_PROJECT", 'S001', 1, userId); 
    } catch (e) {
        return res.status(500).json({ status: 'error', message: 'Failed to load project state.' });
    }

    // 3. Dispatch and Execute the Request
    try {
        let updatedStatus;
        
        // Core execution flow
        updatedStatus = await processMCPRequest(currentProjectState, stageId as keyof ProjectStatus, payload);
        
        // --- NEW STEP: CI/CD Gate Check ---
        if (stageId === 'edit') {
            // This is the mandatory final gate. It checks all preceding work.
            const pipelinePassed = await runCICDPipeline(updatedStatus);
            
            if (!pipelinePassed) {
                return res.status(412).json({ 
                    status: 'failure', 
                    message: 'Pipeline BLOCKED: Critical assets failed the automated CI/CD quality gate. Review the logs for failure points.',
                    updatedState: updatedStatus
                });
            }
        }

        // 4. Success Response
        res.json({ 
            status: 'success', 
            message: `Successfully completed ${stageId} for project ${userId}.`,
            updatedState: updatedStatus 
        });

    } catch (e) {
        console.error("[API Bridge] Fatal Error During Processing:", e);
        res.status(500).json({ 
            status: 'error', 
            message: `A critical error occurred. Check logs.`,
            updatedState: { ...currentProjectState, globalStatus: 'RED' }
        });
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`\n============================================================`);
    console.log(`🚀 CENTRAL API BRIDGE Running on http://localhost:${PORT}`);
    console.log(`============================================================`);
    console.log("Backend infrastructure now includes: Authentication/Authorization, File Watching, and CI/CD Quality Gate.");
});