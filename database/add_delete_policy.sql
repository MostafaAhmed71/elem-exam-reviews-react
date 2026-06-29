-- Add DELETE and UPDATE policies for uploaded_materials table
-- This allows public delete and update access (for admin interface)
-- Note: In production, you should add proper authentication

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

