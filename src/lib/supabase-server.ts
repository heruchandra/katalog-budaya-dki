import { createClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase client for use in Server Components.
 * This is separate from the browser client to avoid sharing
 * state between requests in the server environment.
 */
export function createServerSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createClient(supabaseUrl, supabaseAnonKey);
}
