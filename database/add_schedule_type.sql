-- Migration: Add 'schedule' as a new review_type option
-- Run this to update the uploaded_materials table to support schedule type

-- Drop the existing check constraint
ALTER TABLE uploaded_materials 
DROP CONSTRAINT IF EXISTS uploaded_materials_review_type_check;

-- Add new check constraint that includes 'schedule'
ALTER TABLE uploaded_materials 
ADD CONSTRAINT uploaded_materials_review_type_check 
CHECK (review_type IN ('schedule', 'solved', 'unsolved'));

-- Update the comment
COMMENT ON COLUMN uploaded_materials.review_type IS 'Type of review: schedule, solved, or unsolved';

