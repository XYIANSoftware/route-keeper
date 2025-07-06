import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fuiyuaxpghfajxmzichk.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1aXl1YXhwZ2hmYWp4bXppY2hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2NTM2ODIsImV4cCI6MjA2NzIyOTY4Mn0.4PMRGQjA1ldffILrQza86DiomvgDiQn6kcyxKhojaXk";

export const createClient = async (cookieStore: ReturnType<typeof cookies>) => {
  const cookies = await cookieStore;
  
  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return cookies.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookies.set(name, value, options))
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
}; 