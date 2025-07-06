-- RouteKeeper Complete Database Setup
-- This script will completely clean and set up the database for RouteKeeper
-- Run this in your Supabase SQL Editor

-- =====================================================
-- STEP 1: CLEAN UP EXISTING SCHEMA
-- =====================================================

-- Drop all existing triggers first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_drives_updated_at ON drives;

-- Drop all existing functions
DROP FUNCTION IF EXISTS handle_new_user();
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop all existing tables (in correct order due to foreign keys)
DROP TABLE IF EXISTS stops CASCADE;
DROP TABLE IF EXISTS drives CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Drop all existing indexes
DROP INDEX IF EXISTS idx_drives_user_id;
DROP INDEX IF EXISTS idx_drives_start_time;
DROP INDEX IF EXISTS idx_stops_drive_id;

-- =====================================================
-- STEP 2: CREATE TABLES
-- =====================================================

-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create drives table
CREATE TABLE drives (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  start_latitude DECIMAL(10, 8),
  start_longitude DECIMAL(11, 8),
  end_latitude DECIMAL(10, 8),
  end_longitude DECIMAL(11, 8),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create stops table
CREATE TABLE stops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  drive_id UUID REFERENCES drives(id) ON DELETE CASCADE NOT NULL,
  category TEXT CHECK (category IN ('gas', 'food', 'rest', 'maintenance', 'other')) NOT NULL,
  notes TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- STEP 3: CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Indexes for better query performance
CREATE INDEX idx_drives_user_id ON drives(user_id);
CREATE INDEX idx_drives_start_time ON drives(start_time);
CREATE INDEX idx_stops_drive_id ON stops(drive_id);
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_email ON profiles(email);

-- =====================================================
-- STEP 4: ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE drives ENABLE ROW LEVEL SECURITY;
ALTER TABLE stops ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- STEP 5: CREATE RLS POLICIES
-- =====================================================

-- Profiles table policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Drives table policies
CREATE POLICY "Users can view own drives" ON drives
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own drives" ON drives
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own drives" ON drives
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own drives" ON drives
  FOR DELETE USING (auth.uid() = user_id);

-- Stops table policies
CREATE POLICY "Users can view stops for own drives" ON stops
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM drives
      WHERE drives.id = stops.drive_id
      AND drives.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert stops for own drives" ON stops
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM drives
      WHERE drives.id = stops.drive_id
      AND drives.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update stops for own drives" ON stops
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM drives
      WHERE drives.id = stops.drive_id
      AND drives.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete stops for own drives" ON stops
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM drives
      WHERE drives.id = stops.drive_id
      AND drives.user_id = auth.uid()
    )
  );

-- =====================================================
-- STEP 6: CREATE FUNCTIONS
-- =====================================================

-- Function to handle new user creation with robust error handling
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

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- STEP 7: CREATE TRIGGERS
-- =====================================================

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- Triggers for updated_at timestamps
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_drives_updated_at
  BEFORE UPDATE ON drives
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- =====================================================
-- STEP 8: GRANT PERMISSIONS
-- =====================================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- =====================================================
-- STEP 9: ENABLE REAL-TIME
-- =====================================================

-- Enable real-time for tables
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE drives;
ALTER PUBLICATION supabase_realtime ADD TABLE stops;

-- =====================================================
-- STEP 10: VERIFICATION QUERIES
-- =====================================================

-- Verify tables were created
SELECT 'Tables created:' as status;
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'drives', 'stops')
ORDER BY table_name;

-- Verify indexes were created
SELECT 'Indexes created:' as status;
SELECT indexname FROM pg_indexes 
WHERE tablename IN ('profiles', 'drives', 'stops')
ORDER BY tablename, indexname;

-- Verify RLS is enabled
SELECT 'RLS enabled on:' as status;
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('profiles', 'drives', 'stops')
ORDER BY tablename;

-- Verify policies were created
SELECT 'Policies created:' as status;
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('profiles', 'drives', 'stops')
ORDER BY tablename, policyname;

-- Verify functions were created
SELECT 'Functions created:' as status;
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_name IN ('handle_new_user', 'update_updated_at_column')
ORDER BY routine_name;

-- Verify triggers were created
SELECT 'Triggers created:' as status;
SELECT trigger_name, event_object_table, action_statement
FROM information_schema.triggers 
WHERE trigger_name IN ('on_auth_user_created', 'update_profiles_updated_at', 'update_drives_updated_at')
ORDER BY trigger_name;

-- =====================================================
-- STEP 11: TEST DATA (OPTIONAL - FOR VERIFICATION)
-- =====================================================

-- Insert a test profile (only if you want to test)
-- Uncomment the lines below if you want to create test data
/*
INSERT INTO profiles (id, username, email) 
VALUES (
  gen_random_uuid(), 
  'testuser_' || extract(epoch from now())::integer,
  'test@example.com'
) ON CONFLICT DO NOTHING;

SELECT 'Test data inserted successfully' as status;
*/

-- =====================================================
-- FINAL STATUS
-- =====================================================

SELECT 'RouteKeeper database setup completed successfully!' as final_status; 