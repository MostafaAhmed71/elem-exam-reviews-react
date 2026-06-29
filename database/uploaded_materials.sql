-- Create uploaded_materials table in Supabase
-- This table stores metadata about files uploaded to Hostinger

CREATE TABLE IF NOT EXISTS uploaded_materials (
    id BIGSERIAL PRIMARY KEY,
    grade INTEGER NOT NULL CHECK (grade >= 1 AND grade <= 6),
    subject_name TEXT NOT NULL,
    review_type TEXT NOT NULL CHECK (review_type IN ('schedule', 'solved', 'unsolved')),
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_uploaded_materials_grade ON uploaded_materials(grade);
CREATE INDEX IF NOT EXISTS idx_uploaded_materials_review_type ON uploaded_materials(review_type);
CREATE INDEX IF NOT EXISTS idx_uploaded_materials_grade_type ON uploaded_materials(grade, review_type);
CREATE INDEX IF NOT EXISTS idx_uploaded_materials_uploaded_at ON uploaded_materials(uploaded_at DESC);
CREATE INDEX IF NOT EXISTS idx_uploaded_materials_subject ON uploaded_materials(subject_name);

-- Add RLS (Row Level Security) policies
ALTER TABLE uploaded_materials ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for parent interface)
CREATE POLICY "Allow public read access"
    ON uploaded_materials
    FOR SELECT
    USING (true);

-- Allow public insert (for admin upload without authentication)
-- Note: In production, you should add proper authentication
CREATE POLICY "Allow public insert"
    ON uploaded_materials
    FOR INSERT
    WITH CHECK (true);

-- Allow public delete (for admin delete without authentication)
-- Note: In production, you should add proper authentication
CREATE POLICY "Allow public delete"
    ON uploaded_materials
    FOR DELETE
    USING (true);

-- Allow public update (for admin edit without authentication)
-- Note: In production, you should add proper authentication
CREATE POLICY "Allow public update"
    ON uploaded_materials
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_uploaded_materials_updated_at
    BEFORE UPDATE ON uploaded_materials
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE uploaded_materials IS 'Stores metadata for educational materials uploaded to Hostinger';
COMMENT ON COLUMN uploaded_materials.grade IS 'Grade level (1-6)';
COMMENT ON COLUMN uploaded_materials.subject_name IS 'Name of the subject in Arabic';
COMMENT ON COLUMN uploaded_materials.review_type IS 'Type of review: schedule, solved, or unsolved';
COMMENT ON COLUMN uploaded_materials.file_name IS 'Original filename';
COMMENT ON COLUMN uploaded_materials.file_url IS 'URL of the file on Hostinger';
COMMENT ON COLUMN uploaded_materials.file_size IS 'File size in bytes';
COMMENT ON COLUMN uploaded_materials.uploaded_at IS 'Timestamp when file was uploaded';
