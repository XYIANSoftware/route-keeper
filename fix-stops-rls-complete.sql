-- Comprehensive fix for stops table RLS policies
-- Run this in your Supabase SQL Editor

-- =====================================================
-- STEP 1: DIAGNOSE THE PROBLEM
-- =====================================================

-- Check current RLS status
SELECT '=== CURRENT RLS STATUS ===' as status;
SELECT 
  schemaname,
  tablename,
  rowsecurity,
  CASE WHEN rowsecurity THEN 'ENABLED' ELSE 'DISABLED' END as rls_status
FROM pg_tables 
WHERE tablename IN ('stops', 'drives', 'profiles')
ORDER BY tablename;

-- Check existing policies
SELECT '=== EXISTING POLICIES ===' as status;
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

-- Check if there are any orphaned stops (stops without valid drives)
SELECT '=== CHECKING FOR ORPHANED STOPS ===' as status;
SELECT 
  COUNT(*) as orphaned_stops_count
FROM stops s
LEFT JOIN drives d ON s.drive_id = d.id
WHERE d.id IS NULL;

-- Check drive ownership
SELECT '=== CHECKING DRIVE OWNERSHIP ===' as status;
SELECT 
  d.id as drive_id,
  d.user_id,
  d.start_time,
  d.end_time,
  COUNT(s.id) as stops_count
FROM drives d
LEFT JOIN stops s ON d.id = s.drive_id
GROUP BY d.id, d.user_id, d.start_time, d.end_time
ORDER BY d.start_time DESC
LIMIT 10;

-- =====================================================
-- STEP 2: CLEAN UP EXISTING POLICIES
-- =====================================================

-- Drop all existing policies on stops table
DROP POLICY IF EXISTS "Users can view stops for own drives" ON stops;
DROP POLICY IF EXISTS "Users can insert stops for own drives" ON stops;
DROP POLICY IF EXISTS "Users can update stops for own drives" ON stops;
DROP POLICY IF EXISTS "Users can delete stops for own drives" ON stops;

-- =====================================================
-- STEP 3: ENABLE RLS
-- =====================================================

-- Ensure RLS is enabled on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE drives ENABLE ROW LEVEL SECURITY;
ALTER TABLE stops ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- STEP 4: CREATE ROBUST RLS POLICIES
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
SELECT '=== VERIFYING POLICIES ===' as status;
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

-- Test policy visibility
SELECT '=== TESTING POLICY VISIBILITY ===' as status;
SELECT 
  'Policy: ' || policyname || ' - ' || cmd as policy_info
FROM pg_policies 
WHERE tablename = 'stops'
ORDER BY policyname;

-- =====================================================
-- STEP 7: CHECK TABLE STRUCTURE
-- =====================================================

-- Verify the stops table structure
SELECT '=== STOPS TABLE STRUCTURE ===' as status;
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
SELECT '=== FINAL VERIFICATION ===' as status;

-- Check RLS is enabled
SELECT 
  'RLS Status for stops: ' || 
  CASE WHEN rowsecurity THEN 'ENABLED' ELSE 'DISABLED' END as rls_status
FROM pg_tables 
WHERE tablename = 'stops';

-- Count policies
SELECT 
  'Policy Count for stops: ' || COUNT(*) as policy_count
FROM pg_policies 
WHERE tablename = 'stops';

-- Check foreign key constraints
SELECT '=== FOREIGN KEY CONSTRAINTS ===' as status;
SELECT 
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name = 'stops';

-- =====================================================
-- STEP 9: CLEANUP ORPHANED DATA (OPTIONAL)
-- =====================================================

-- Uncomment the following lines if you want to clean up orphaned stops
/*
SELECT '=== CLEANING UP ORPHANED STOPS ===' as status;
DELETE FROM stops 
WHERE drive_id NOT IN (SELECT id FROM drives);

SELECT 'Orphaned stops cleaned up' as cleanup_status;
*/

-- =====================================================
-- STEP 10: SUMMARY
-- =====================================================

SELECT '=== SUMMARY ===' as status;
SELECT 
  'Stops table RLS policies fixed successfully!' as final_status,
  (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'stops') as total_policies,
  (SELECT COUNT(*) FROM stops) as total_stops,
  (SELECT COUNT(*) FROM drives) as total_drives;

-- Show current user context for debugging
SELECT '=== CURRENT USER CONTEXT ===' as status;
SELECT 
  current_user as current_user,
  session_user as session_user,
  auth.uid() as auth_uid; 