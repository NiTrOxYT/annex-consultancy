import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-url.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

// Initialized supabase client. If keys are placeholder, database calls will gracefully degrade
// or can be mocked in local development.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Custom local storage helper if we want mock local data persistence for leads/bookings when Supabase is not connected
export function isSupabaseConfigured() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder-url.supabase.co"
  );
}
