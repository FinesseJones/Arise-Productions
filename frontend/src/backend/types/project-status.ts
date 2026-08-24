"use strict";

/**
 * Central Project Manifest for the Unified Studio Shell
 * This model is the Single Source of Truth and persists through all stages.
 */

export interface StageStatus {
    /** Status Character: 🟢 (Success), 🟡 (In Progress/Pending), 🔴 (Failure/Requires Attention), ⚪ (Pending/Never Started) */
    statusChar: '🟢' | '🟡' | '🔴' | '⚪';
    /** The timestamp (ISO string) when this stage was last successfully modified. */
    lastUpdated: string;
    /** Detailed status notes from the Director Agent. */
    notes?: string;
}

export interface ShotManifest {
    shotId: string;
    sequence: number;
    status: Record<string, StageStatus>;
    metadata: {
        title: string;
        sequenceContext: string;
    };
}

/**
 * The root object containing all managed project data.
 * Added User and Security fields for authorization and tracking.
 */
export interface ProjectStatus {
    /** The name of the project. */
    projectName: string;
    /** The user who owns or last modified the project. */
    ownerUserId: string;
    /** A list of all managed shot manifestations. */
    shots: ShotManifest[];
    /** A summary of the project's global status derived from all shots. */
    globalStatus: 'GREEN' | 'YELLOW' | 'RED';
    /** Total number of shots being managed. */
    shotCount: number;
    /** Timestamp of the last modification to the entire project file. */
    lastModified: string;
}


// Example initialization function for clean startup
export const createInitialProjectStatus = (projectName: string, shotId: string, sequence: number, ownerUserId: string = "admin"): ProjectStatus => {
    const now = new Date().toISOString();
    return {
        projectName: projectName,
        ownerUserId: ownerUserId,
        shots: [{
            shotId: shotId,
            sequence: sequence,
            status: {
                'script': { statusChar: '⚪', lastUpdated: now },
                'structure': { statusChar: '⚪', lastUpdated: now },
                'plan': { statusChar: '⚪', lastUpdated: now },
                'previs': { statusChar: '⚪', lastUpdated: now },
                'motion': { statusChar: '⚪', lastUpdated: now },
                'boards': { statusChar: '⚪', lastUpdated: now },
                'prompt': { statusChar: '⚪', lastUpdated: now },
                'dailies': { statusChar: '⚪', lastUpdated: now },
                'sound': { statusChar: '⚪', lastUpdated: now },
                'edit': { statusChar: '⚪', lastUpdated: now },
            },
            metadata: {
                title: "Placeholder Shot Title",
                sequenceContext: "N/A"
            }
        }],
        globalStatus: 'RED', // Start everything as red until the first successful step
        shotCount: 1,
        lastModified: now,
    };
};