-- Migration: Add review_type column to existing uploaded_materials table
-- Run this if you already have the table created

-- Add review_type column
ALTER TABLE uploaded_materials 
ADD COLUMN IF NOT EXISTS review_type TEXT NOT NULL DEFAULT 'unsolved' 
CHECK (review_type IN ('solved', 'unsolved'));

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_uploaded_materials_review_type ON uploaded_materials(review_type);
CREATE INDEX IF NOT EXISTS idx_uploaded_materials_grade_type ON uploaded_materials(grade, review_type);

-- Update existing records to have a default review_type
UPDATE uploaded_materials 
SET review_type = 'unsolved' 
WHERE review_type IS NULL;

-- Add comment
COMMENT ON COLUMN uploaded_materials.review_type IS 'Type of review: solved or unsolved';
