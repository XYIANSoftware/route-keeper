import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fuiyuaxpghfajxmzichk.supabase.co';
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1aXl1YXhwZ2hmYWp4bXppY2hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2NTM2ODIsImV4cCI6MjA2NzIyOTY4Mn0.4PMRGQjA1ldffILrQza86DiomvgDiQn6kcyxKhojaXk';

// Create unified Supabase client with consistent configuration
export const supabase = createBrowserClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    storageKey: 'sb-auth-token',
    flowType: 'pkce',
  },
  global: {
    headers: {
      'X-Client-Info': 'route-keeper-web',
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
