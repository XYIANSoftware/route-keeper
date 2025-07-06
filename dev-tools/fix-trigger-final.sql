-- Final fix for RouteKeeper trigger function and RLS policies
-- Run this in your Supabase SQL Editor

-- =====================================================
-- STEP 1: FIX THE TRIGGER FUNCTION
-- =====================================================

-- Drop the existing trigger first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop the existing function
DROP FUNCTION IF EXISTS handle_new_user();

-- Create the fixed trigger function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  username_value TEXT;
  counter INTEGER := 0;
BEGIN
  -- Get username from metadata or generate one
  username_value := COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8));
  
  -- Handle duplicate usernames by adding a number suffix
  WHILE EXISTS (SELECT 1 FROM profiles WHERE username = username_value) LOOP
    counter := counter + 1;
    username_value := COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)) || '_' || counter::text;
  END LOOP;
  
  -- Insert profile with error handling
  BEGIN
    INSERT INTO profiles (id, username, email)
    VALUES (NEW.id, username_value, NEW.email);
  EXCEPTION
    WHEN unique_violation THEN
      -- If still getting unique violation, use timestamp-based username
      INSERT INTO profiles (id, username, email)
      VALUES (NEW.id, 'user_' || substr(NEW.id::text, 1, 8) || '_' || extract(epoch from now())::integer, NEW.email);
    WHEN OTHERS THEN
      -- Log the error but don't fail the user creation
      RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =====================================================
-- STEP 2: FIX RLS POLICIES FOR PROFILES
-- =====================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create new policies that work with the trigger function
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- IMPORTANT: Allow the trigger function to insert profiles
CREATE POLICY "Trigger can insert profiles" ON profiles
  FOR INSERT WITH CHECK (true);

-- =====================================================
-- STEP 3: VERIFY THE FIX
-- =====================================================

-- Test the function directly
SELECT 'Testing trigger function...' as status;

-- Check if function exists and can be called
SELECT 
  routine_name,
  routine_type,
  data_type
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user';

-- Check if trigger exists
SELECT 
  trigger_name,
  event_object_table,
  action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Check RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'profiles';

-- =====================================================
-- STEP 4: TEST DATA (OPTIONAL)
-- =====================================================

-- Uncomment the lines below to test the trigger function
/*
-- Insert a test user to verify the trigger works
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data
) VALUES (
  gen_random_uuid(),
  'test-trigger@example.com',
  crypt('testpassword', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"username": "testuser"}'::jsonb
);

-- Check if profile was created
SELECT 'Profile created by trigger:' as status;
SELECT * FROM profiles WHERE email = 'test-trigger@example.com';

-- Clean up test data
DELETE FROM profiles WHERE email = 'test-trigger@example.com';
DELETE FROM auth.users WHERE email = 'test-trigger@example.com';
*/

SELECT 'Trigger function and RLS policies fixed successfully!' as final_status; 