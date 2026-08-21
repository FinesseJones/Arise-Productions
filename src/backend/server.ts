"use strict";

import express, { Request, Response } from 'express';
import { processMCPRequest } from "./mcp/mcp-handler";
import { ProjectStatus, createInitialProjectStatus } from "./types/project-status";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8080;

/**
 * Middleware function to simulate Auth/Auth flow.
 * Checks for a valid user token and role before allowing the request to proceed.
 */
const securityGate = (req: Request, res: Response, next: (err?: any) => void) => {
    const { authToken, userRole } = req.headers;

    if (!authToken || !userRole) {
        return res.status(401).json({ status: 'error', message: 'Authentication required: Missing authentication tokens.' });
    }

    // Simulated Role-Based Access Control (RBAC) check
    const isManager = userRole === 'ADMIN' || userRole === 'DIRECTOR';
    
    if (!isManager && ['previs', 'boards', 'edit'].includes(req.body.stageId)) {
         return res.status(403).json({ status: 'error', message: `Authorization Denied: '${userRole}' role cannot execute ${req.body.stageId} MCP servers.` });
    }
    
    // Attach user context to the request object for downstream services
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
        currentProjectState = createInitialProjectStatus("DEFAULT_PROJECT", 'S001', 1, userId); 
    } catch (e) {
        return res.status(500).json({ status: 'error', message: 'Failed to load project state.' });
    }

    // 3. Dispatch the request through the core handler
    try {
        let updatedStatus;
        // We must ensure the requesting user is authorized for the action,
        // which was already done in the securityGate middleware.
        updatedStatus = await processMCPRequest(currentProjectState, stageId as keyof ProjectStatus, payload);
        
        // --- NEW STEP: CI/CD GATE CHECK ---
        if (stageId === 'edit') {
            if (!await runCICDPipeline(updatedStatus)) {
                console.error("CI/CD Gate Failed: Project cannot proceed to final Edit stage.");
                return res.status(412).json({ 
                    status: 'failure', 
                    message: 'Pipeline blocked: One or more critical assets failed the automated CI/CD quality gate. Assets must be fixed.',
                    updatedState: updatedStatus
                });
            }
        }

        // 4. Success Response
        res.json({ 
            status: 'success', 
            message: `Successfully completed ${stageId} for project ${projectId}.`,
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


// ========================================================================================
// New Internal Functions for Infrastructure
// ========================================================================================

/**
 * Simulates the execution of the automated CI/CD Pipeline.
 * This function must be the gate before the final 'edit' stage.
 * @param status The current project state.
 * @returns Promise<boolean> True if successful, False if artifacts fail quality checks.
 */
const runCICDPipeline = async (status: ProjectStatus): Promise<boolean> => {
    console.log("\n[CI/CD PIPELINE] --- Running automated build and quality checks... ---");
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate long build time

    // 1. Asset Integrity Check
    if (status.shots.length === 0) {
        console.warn("[CI/CD] WARNING: No shots defined.");
    }
    
    // 2. Conflict Check: Example: If Motion Previs exists but Sound is missing.
    const hasMotion = status.shots[0].status['motion']?.statusChar === '🟢';
    const hasSound = status.shots[0].status['sound']?.statusChar === '🟢';
    
    if (hasMotion && !hasSound) {
        console.error("[CI/CD] 🔴 FAILURE: Motion data exists without required Sound stems. Blocking release.");
        return false;
    }

    // 3. Code Compilation Check (Final Polish)
    if (Math.random() < 0.1) { // 10% Chance of minor failure
        console.error("[CI/CD] 🟠 FAILURE: Minor pipeline code compilation error found. Requires human QC.");
        return false;
    }

    console.log("[CI/CD] ✅ BUILD SUCCESS: All quality gates passed. Artifacts locked and ready for mastering.");
    return true;
};

// Start the server
app.listen(PORT, () => {
    console.log(`\n============================================================`);
    console.log(`🚀 CENTRAL API BRIDGE Running on http://localhost:${PORT}`);
    console.log(`============================================================`);
    console.log("Backend infrastructure ready for: Auth/Auth, File Watcher, and CI/CD.");
});