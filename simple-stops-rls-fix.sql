-- Simple fix for stops table RLS policies
-- Run this in your Supabase SQL Editor

-- Step 1: Drop existing policies
DROP POLICY IF EXISTS "Users can view stops for own drives" ON stops;
DROP POLICY IF EXISTS "Users can insert stops for own drives" ON stops;
DROP POLICY IF EXISTS "Users can update stops for own drives" ON stops;
DROP POLICY IF EXISTS "Users can delete stops for own drives" ON stops;

-- Step 2: Enable RLS
ALTER TABLE stops ENABLE ROW LEVEL SECURITY;

-- Step 3: Create simple, permissive policies for testing
-- This allows authenticated users to perform all operations on stops
-- We'll make it more restrictive once we confirm it works

-- Allow all authenticated users to view stops
CREATE POLICY "Allow authenticated users to view stops" ON stops
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow all authenticated users to insert stops
CREATE POLICY "Allow authenticated users to insert stops" ON stops
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow all authenticated users to update stops
CREATE POLICY "Allow authenticated users to update stops" ON stops
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow all authenticated users to delete stops
CREATE POLICY "Allow authenticated users to delete stops" ON stops
  FOR DELETE USING (auth.role() = 'authenticated');

-- Step 4: Verify policies were created
SELECT 'Policies created successfully' as status;
SELECT 
  policyname,
  cmd,
  permissive
FROM pg_policies 
WHERE tablename = 'stops'
ORDER BY policyname; 