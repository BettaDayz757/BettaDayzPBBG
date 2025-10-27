// create a browser client for client-side use (public anon key allowed)
import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const createBrowserSupabase = () =>
  createBrowserClient(supabaseUrl, supabaseAnonKey);