import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fuiyuaxpghfajxmzichk.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1aXl1YXhwZ2hmYWp4bXppY2hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2NTM2ODIsImV4cCI6MjA2NzIyOTY4Mn0.4PMRGQjA1ldffILrQza86DiomvgDiQn6kcyxKhojaXk";

export const createClient = () =>
  createBrowserClient(
    supabaseUrl,
    supabaseKey,
  ); 