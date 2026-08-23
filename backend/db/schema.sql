-- ==============================================================================
-- WASSERMAN STUDIO SHELL - POSTGRESQL PRODUCTION SCHEMA
-- ==============================================================================

-- Enum for stage status
DO $$ BEGIN
    CREATE TYPE stage_status_enum AS ENUM ('UNSTARTED', 'IN_PROGRESS', 'COMPLETE', 'BLOCKED', 'FAILED');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version INT NOT NULL DEFAULT 1
);

-- Shots Table
CREATE TABLE IF NOT EXISTS shots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    shot_number INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    duration_frames INT DEFAULT 120,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(project_id, shot_number)
);

-- Shot Stage Statuses Table (The 10 Stages for every shot)
CREATE TABLE IF NOT EXISTS shot_stage_statuses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shot_id UUID NOT NULL REFERENCES shots(id) ON DELETE CASCADE,
    stage_id VARCHAR(64) NOT NULL, -- 'script', 'structure', 'plan', 'previs', 'motion', 'boards', 'prompt', 'dailies', 'sound', 'edit'
    status stage_status_enum NOT NULL DEFAULT 'UNSTARTED',
    progress_percentage SMALLINT DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
    metadata JSONB DEFAULT '{}'::jsonb,
    last_modified_by VARCHAR(255) NOT NULL DEFAULT 'system',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version INT NOT NULL DEFAULT 1,
    UNIQUE(shot_id, stage_id)
);

-- Pipeline Jobs Table (Idempotent job tracking for worker microservices)
CREATE TABLE IF NOT EXISTS pipeline_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    shot_id UUID REFERENCES shots(id) ON DELETE SET NULL,
    stage_id VARCHAR(64) NOT NULL,
    action VARCHAR(128) NOT NULL,
    idempotency_key VARCHAR(255) UNIQUE,
    status VARCHAR(32) NOT NULL DEFAULT 'QUEUED', -- QUEUED, RUNNING, COMPLETED, FAILED
    progress INT NOT NULL DEFAULT 0,
    input_payload JSONB DEFAULT '{}'::jsonb,
    output_result JSONB DEFAULT '{}'::jsonb,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Audit Events Table
CREATE TABLE IF NOT EXISTS audit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    event_type VARCHAR(128) NOT NULL,
    actor VARCHAR(255) NOT NULL DEFAULT 'director_agent',
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for ultra-fast manifest compilation and lookups
CREATE INDEX IF NOT EXISTS idx_shot_stage_lookup ON shot_stage_statuses(shot_id, stage_id);
CREATE INDEX IF NOT EXISTS idx_project_shots ON shots(project_id, shot_number);
CREATE INDEX IF NOT EXISTS idx_pipeline_jobs_status ON pipeline_jobs(status, stage_id);
