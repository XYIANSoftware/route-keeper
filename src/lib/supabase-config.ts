import { createClient } from '@supabase/supabase-js';
import { API_ENDPOINTS } from '@/constants/app';

// Create Supabase client
export const supabase = createClient(API_ENDPOINTS.supabase.url, API_ENDPOINTS.supabase.anonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Database table names
export const TABLES = {
  profiles: 'profiles',
  drives: 'drives',
  stops: 'stops',
} as const;

// RLS policy names
export const POLICIES = {
  profiles: {
    viewOwn: 'Users can view own profile',
    updateOwn: 'Users can update own profile',
    insertOwn: 'Users can insert own profile',
  },
  drives: {
    viewOwn: 'Users can view own drives',
    insertOwn: 'Users can insert own drives',
    updateOwn: 'Users can update own drives',
  },
  stops: {
    viewOwn: 'Users can view stops for own drives',
    insertOwn: 'Users can insert stops for own drives',
  },
} as const;

// Function names
export const FUNCTIONS = {
  handleNewUser: 'handle_new_user',
  updateUpdatedAt: 'update_updated_at_column',
} as const;

// Trigger names
export const TRIGGERS = {
  onAuthUserCreated: 'on_auth_user_created',
  updateProfilesUpdatedAt: 'update_profiles_updated_at',
  updateDrivesUpdatedAt: 'update_drives_updated_at',
} as const;

// Index names
export const INDEXES = {
  drivesUserId: 'idx_drives_user_id',
  drivesStartTime: 'idx_drives_start_time',
  stopsDriveId: 'idx_stops_drive_id',
} as const;
