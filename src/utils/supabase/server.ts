import { createServerClient } from "@supabase/ssr";
let cookies: any;
try {
  // For Next.js 13+/16+ environments
  ({ cookies } = require("next/headers"));
} catch {
  // Fallback for test environments
  cookies = () => ({
    getAll: () => [],
    set: () => {},
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const createServerSupabase = async () => {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: Record<string, any> }>) {
        try {
          cookiesToSet.forEach(({ name, value, options }: { name: string; value: string; options?: Record<string, any> }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // ignore in contexts that don't allow setting cookies from server components
        }
      },
    },
  });
};
