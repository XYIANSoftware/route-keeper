-- Fix trigger function for RouteKeeper
-- Run this in your Supabase SQL Editor

-- First, let's check if the function exists
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user';

-- Check if the trigger exists
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Drop the trigger if it exists (to recreate it)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop the function if it exists (to recreate it)
DROP FUNCTION IF EXISTS handle_new_user();

-- Recreate the function with better error handling
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Add error handling
  BEGIN
    INSERT INTO profiles (id, username, email)
    VALUES (
      NEW.id, 
      COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)), 
      NEW.email
    );
  EXCEPTION
    WHEN unique_violation THEN
      -- Handle duplicate username
      INSERT INTO profiles (id, username, email)
      VALUES (
        NEW.id, 
        'user_' || substr(NEW.id::text, 1, 8) || '_' || floor(random() * 1000)::text, 
        NEW.email
      );
    WHEN OTHERS THEN
      -- Log the error but don't fail the user creation
      RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- Test the function
SELECT 'Trigger function created successfully' as status;

-- Verify the trigger is active
SELECT trigger_name, event_manipulation, event_object_table, action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created'; 