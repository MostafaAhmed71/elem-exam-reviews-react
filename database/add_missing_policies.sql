-- Add missing policies for uploaded_materials table
-- This script safely adds DELETE and UPDATE policies
-- It will work even if some policies already exist

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow public delete" ON uploaded_materials;
DROP POLICY IF EXISTS "Allow public update" ON uploaded_materials;

-- Create DELETE policy
CREATE POLICY "Allow public delete"
    ON uploaded_materials
    FOR DELETE
    USING (true);

-- Create UPDATE policy
CREATE POLICY "Allow public update"
    ON uploaded_materials
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

