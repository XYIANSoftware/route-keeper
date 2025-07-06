-- Check and fix trigger function issue
-- Run this in your Supabase SQL Editor

-- =====================================================
-- STEP 1: CHECK CURRENT STATE
-- =====================================================

-- Check if function exists
SELECT 'Checking if handle_new_user function exists...' as status;
SELECT 
  routine_name,
  routine_type,
  routine_schema,
  data_type
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user';

-- Check if trigger exists
SELECT 'Checking if trigger exists...' as status;
SELECT 
  trigger_name,
  event_object_schema,
  event_object_table,
  action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Check profiles table
SELECT 'Checking profiles table...' as status;
SELECT 
  table_name,
  table_schema,
  table_type
FROM information_schema.tables 
WHERE table_name = 'profiles';

-- =====================================================
-- STEP 2: FIX THE TRIGGER FUNCTION
-- =====================================================

-- Drop everything first to ensure clean state
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Create the function in the public schema explicitly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  username_value TEXT;
  counter INTEGER := 0;
BEGIN
  -- Get username from metadata or generate one
  username_value := COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8));
  
  -- Handle duplicate usernames by adding a number suffix
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = username_value) LOOP
    counter := counter + 1;
    username_value := COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)) || '_' || counter::text;
  END LOOP;
  
  -- Insert profile with error handling
  BEGIN
    INSERT INTO public.profiles (id, username, email)
    VALUES (NEW.id, username_value, NEW.email);
  EXCEPTION
    WHEN unique_violation THEN
      -- If still getting unique violation, use timestamp-based username
      INSERT INTO public.profiles (id, username, email)
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
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- STEP 3: VERIFY THE FIX
-- =====================================================

-- Check if function was created
SELECT 'Verifying function was created...' as status;
SELECT 
  routine_name,
  routine_type,
  routine_schema,
  data_type
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user';

-- Check if trigger was created
SELECT 'Verifying trigger was created...' as status;
SELECT 
  trigger_name,
  event_object_schema,
  event_object_table,
  action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Test the function directly (should return NULL for trigger functions)
SELECT 'Testing function call...' as status;
SELECT public.handle_new_user();

-- =====================================================
-- STEP 4: CHECK RLS POLICIES
-- =====================================================

-- Check profiles policies
SELECT 'Checking profiles RLS policies...' as status;
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  permissive
FROM pg_policies 
WHERE tablename = 'profiles';

-- If no policies exist, create them
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Trigger can insert profiles') THEN
    CREATE POLICY "Trigger can insert profiles" ON profiles
      FOR INSERT WITH CHECK (true);
  END IF;
END $$;

SELECT 'Trigger function fix completed!' as final_status; 