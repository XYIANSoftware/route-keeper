import { createBrowserClient } from "@supabase/ssr";

// Use environment variables if available, otherwise fall back to hardcoded values
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fuiyuaxpghfajxmzichk.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1aXl1YXhwZ2hmYWp4bXppY2hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2NTM2ODIsImV4cCI6MjA2NzIyOTY4Mn0.4PMRGQjA1ldffILrQza86DiomvgDiQn6kcyxKhojaXk";

console.log('Supabase Configuration:');
console.log('URL:', supabaseUrl);
console.log('Key length:', supabaseKey.length);

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createBrowserClient(supabaseUrl, supabaseKey);

// Test function to verify Supabase connection
export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    
    // Test basic connection by trying to get the current user
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }
    
    console.log('Supabase connection test successful');
    console.log('Current user:', user);
    return true;
  } catch (error) {
    console.error('Supabase connection test error:', error);
    return false;
  }
};

// Simple signup test function
export const testSignup = async (email: string, password: string) => {
  try {
    console.log('Testing signup with:', { email });
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    console.log('Signup test result:', { data, error });
    
    if (error) {
      console.error('Signup test failed:', error);
      return { success: false, error };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Signup test error:', error);
    return { success: false, error };
  }
};

// Test database connection
export const testDatabaseConnection = async () => {
  try {
    console.log('Testing database connection...');
    
    // Try to query a simple table
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Database connection test failed:', error);
      return { success: false, error };
    }
    
    console.log('Database connection test successful');
    return { success: true, data };
  } catch (error) {
    console.error('Database connection test error:', error);
    return { success: false, error };
  }
};
