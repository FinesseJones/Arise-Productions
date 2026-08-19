export interface ProjectStatus {
    title: string;
    shots: {
        shotId: string;
        title: string;
        // Array of size 10, matching the 'stages' array order
        status: ('🟢' | '🟡' | '🔴' | '⚫')[]; 
        reshoot: boolean;
    }[];
}

// --- End of file ---