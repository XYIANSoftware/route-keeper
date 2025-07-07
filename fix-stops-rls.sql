-- Fix RLS policies for stops table
-- Run this in your Supabase SQL Editor

-- =====================================================
-- STEP 1: CHECK CURRENT RLS POLICIES
-- =====================================================

-- Check if RLS is enabled on stops table
SELECT 'Checking RLS on stops table...' as status;
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'stops';

-- Check existing policies on stops table
SELECT 'Checking existing policies on stops table...' as status;
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  permissive,
  roles,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'stops'
ORDER BY policyname;

-- =====================================================
-- STEP 2: DROP EXISTING POLICIES
-- =====================================================

-- Drop all existing policies on stops table
DROP POLICY IF EXISTS "Users can view stops for own drives" ON stops;
DROP POLICY IF EXISTS "Users can insert stops for own drives" ON stops;
DROP POLICY IF EXISTS "Users can update stops for own drives" ON stops;
DROP POLICY IF EXISTS "Users can delete stops for own drives" ON stops;

-- =====================================================
-- STEP 3: ENABLE RLS (if not already enabled)
-- =====================================================

-- Enable RLS on stops table
ALTER TABLE stops ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- STEP 4: CREATE NEW RLS POLICIES
-- =====================================================

-- Policy for viewing stops (users can only see stops for their own drives)
CREATE POLICY "Users can view stops for own drives" ON stops
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM drives
      WHERE drives.id = stops.drive_id
      AND drives.user_id = auth.uid()
    )
  );

-- Policy for inserting stops (users can only insert stops for their own drives)
CREATE POLICY "Users can insert stops for own drives" ON stops
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM drives
      WHERE drives.id = stops.drive_id
      AND drives.user_id = auth.uid()
    )
  );

-- Policy for updating stops (users can only update stops for their own drives)
CREATE POLICY "Users can update stops for own drives" ON stops
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM drives
      WHERE drives.id = stops.drive_id
      AND drives.user_id = auth.uid()
    )
  );

-- Policy for deleting stops (users can only delete stops for their own drives)
CREATE POLICY "Users can delete stops for own drives" ON stops
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM drives
      WHERE drives.id = stops.drive_id
      AND drives.user_id = auth.uid()
    )
  );

-- =====================================================
-- STEP 5: VERIFY POLICIES
-- =====================================================

-- Verify all policies were created
SELECT 'Verifying policies were created...' as status;
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  permissive
FROM pg_policies 
WHERE tablename = 'stops'
ORDER BY policyname;

-- =====================================================
-- STEP 6: TEST THE POLICIES
-- =====================================================

-- Test that we can see the policies
SELECT 'Testing policy visibility...' as status;
SELECT 
  'Policy: ' || policyname || ' - ' || cmd as policy_info
FROM pg_policies 
WHERE tablename = 'stops'
ORDER BY policyname;

-- =====================================================
-- STEP 7: CHECK TABLE STRUCTURE
-- =====================================================

-- Verify the stops table structure
SELECT 'Checking stops table structure...' as status;
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'stops'
ORDER BY ordinal_position;

-- =====================================================
-- STEP 8: FINAL VERIFICATION
-- =====================================================

-- Final check that everything is set up correctly
SELECT 'Final verification...' as status;

-- Check RLS is enabled
SELECT 
  'RLS Status: ' || 
  CASE WHEN rowsecurity THEN 'ENABLED' ELSE 'DISABLED' END as rls_status
FROM pg_tables 
WHERE tablename = 'stops';

-- Count policies
SELECT 
  'Policy Count: ' || COUNT(*) as policy_count
FROM pg_policies 
WHERE tablename = 'stops';

SELECT 'Stops table RLS policies fixed successfully!' as final_status; 