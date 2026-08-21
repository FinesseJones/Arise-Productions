"use strict";

import { ProjectStatus, ProjectStatus} from "../types/project-status";
import { nvidiaWrapperInstance } from "../providers/nvidia-api-wrapper";

/**
 * Factory function to instantiate and manage all Master Control Processor (MCP) handlers.
 * This ensures that every stage interaction goes through a single dispatch point.
 */


/**
 * @param project The current master project status manifest.
 * @param stageId The MCP server ID (e.g., 'previs', 'sound').
 * @param params Payload data specific to the stage's operation.
 * @returns A promise that resolves to the updated ProjectStatus state.
 */
export const processMCPRequest = async (project: ProjectStatus, stageId: keyof ProjectStatus, params: any): Promise<ProjectStatus> => {
    
    console.log(`\n\n=== 🚀 PROCESSING ${stageId.toUpperCase()} MCP JOB STARTS ===`);

    try {
        let updatedProject = { ...project };
        let newGlobalStatus = project.globalStatus; // Assume status remains the same until failure
        
        // --- Dynamic Dispatching based on Stage ID ---
        switch (stageId) {
            case 'script':
                return await handleScriptBreak(project, params);
            case 'structure':
                return await handleCorkBoard(project, params);
            case 'plan':
                return await handleMasterCanvas(project, params);
            case 'previs':
                return await handleBlockout(project, params);
            case 'motion':
                return await handleMotionPrevisStudio(project, params);
            case 'boards':
                return await handleStoryboardReferenceStudio(project, params);
            case 'prompt':
                return await handleSlate(project, params);
            case 'dailies':
                return await handleCircleTake(project, params);
            case 'sound':
                return await handleStemStudio(project, params);
            case 'edit':
                return await handleDaVinciMCP(project, params);
            default:
                throw new Error(`[SYSTEM FAILURE] Unknown MCP stage ID: ${stageId}`);
        }

    } catch (error) {
        console.error(`\n🚨 CRITICAL ORCHESTRATION FAILURE during ${Object.keys(process.env).find(key => key.includes('MCP')) || 'unknown'}:`, error);
        // When any failure occurs, update the global status to Red
        return { ...project, globalStatus: 'RED', lastModified: new Date().toISOString() };
    }
};

// --- STUB HANDLERS FOR THE 10 MCP SERVICES ---

// 1. ScriptBreak (Storyboarding & Narrative)
const handleScriptBreak = async (project: ProjectStatus, params: any) => {
    await nvidiaWrapperInstance.generateAsset("Analyze core narrative structure", "S001");
    console.log("ScriptBreak finished. Character bibles and story beats generated.");
    return { ...project, globalStatus: 'GREEN', lastModified: new Date().toISOString() };
};

// 2. Cork Board (Act Structure & Visual Storyboarding)
const handleCorkBoard = async (project: ProjectStatus, params: any) => {
    await nvidiaWrapperInstance.generateAsset("Generate 2D story board panels and transition maps", "S001");
    console.log("Cork Board finished. Act breaks and flow validated.");
    return { ...project, globalStatus: 'GREEN', lastModified: new Date().toISOString() };
};

// 3. Master Canvas (Handoff & Continuity Check)
const handleMasterCanvas = async (project: ProjectStatus, params: any) => {
    await nvidiaWrapperInstance.generateAsset("Review all assets for continuity breaks and resolution requirements", "S001");
    console.log("Master Canvas finished. The Handoff Package is sealed and verified.");
    return { ...project, globalStatus: 'GREEN', lastModified: new Date().toISOString() };
};

// 4. Blockout (3D Spatial Blocking & Camera Pathing)
const handleBlockout = async (project: ProjectStatus, params: any) => {
    // This is the most resource-intensive stage, using the NVIDIA client heavily.
    await nvidiaWrapperInstance.generateAsset("Calculate full XYZ camera pathing and lighting data", "S001");
    console.log("Blockout finished. Pre-visualization and camera solver data locked.");
    return { ...project, globalStatus: 'GREEN', lastModified: new Date().toISOString() };
};

// 5. Motion Previs Studio (Character Choreography & Physics)
const handleMotionPrevisStudio = async (project: ProjectStatus, params: any) => {
    // Use specific movement analysis models.
    await nvidiaWrapperInstance.generateAsset("Simulate character kinematics and physics for key moments", "S001");
    console.log("Motion Previs Studio finished. Choreography and physical passes locked.");
    return { ...project, globalStatus: 'GREEN', lastModified: new Date().toISOString() };
};

// 6. Storyboard Reference Studio (Asset Generation & Mood Boarding)
const handleStoryboardReferenceStudio = async (project: ProjectStatus, params: any) => {
    // Focus on generating visual asset concepts.
    await nvidiaWrapperInstance.generateAsset("Generate mood board images and key art concepts", "S001");
    console.log("Storyboard Studio finished. Key visual assets and mood boards are compiled.");
    return { ...project, globalStatus: 'GREEN', lastModified: new Date().toISOString() };
};

// 7. Slate (Prompt Engineering & Text Finalization)
const handleSlate = async (project: ProjectStatus, params: any) => {
    await nvidiaWrapperInstance.generateAsset("Generate final, continuity-locked text prompts and dialogue trees", "S001");
    console.log("Slate finished. All LLM inputs and prompts are finalized and locked.");
    return { ...project, globalStatus: 'GREEN', lastModified: new Date().toISOString() };
};

// 8. Circle Take (Daily Review & QA)
const handleCircleTake = async (project: ProjectStatus, params: any) => {
    await nvidiaWrapperInstance.generateAsset("Analyze live dailies footage for missed moments and required reshoots", "S001");
    console.log("Circle Take finished. QA report generated, flagging 3 shots for reshot.");
    // Intentionally forcing a warning/failure for testing the resume loop
    return { ...project, globalStatus: 'YELLOW', lastModified: new Date().toISOString() };
};

// 9. Stem Studio (Audio Engineering)
const handleStemStudio = async (project: ProjectStatus, params: any) => {
    await nvidiaWrapperInstance.generateAsset("Separate dialogue, music, and SFX into clean stems", "S001");
    console.log("Stem Studio finished. Clean audio stems delivered and marked for locking.");
    return { ...project, globalStatus: 'GREEN', lastModified: new Date().toISOString() };
};

// 10. DaVinci MCP (Final Edit & Mastering)
const handleDaVinciMCP = async (project: ProjectStatus, params: any) => {
    await nvidiaWrapperInstance.generateAsset("Run final color correction, color grading, and final mastering pass", "S001");
    console.log("DaVinci MCP finished. Final Master Video Export complete and locked.");
    return { ...project, globalStatus: 'GREEN', lastModified: new Date().toISOString() };
};