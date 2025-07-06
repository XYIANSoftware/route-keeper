// Lib barrel exports
export {
  supabase as supabaseClient,
  testSupabaseConnection,
  testSignup,
  testDatabaseConnection,
} from './supabase';

export {
  supabase as supabaseConfigClient,
  TABLES,
  POLICIES,
  FUNCTIONS,
  TRIGGERS,
  INDEXES,
} from './supabase-config';
