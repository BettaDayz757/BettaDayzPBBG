// Server-side helper for Next.js Server Components (use server cookies)
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const createServerSupabase = () => {
  const cookieStore = cookies();
  // createServerClient will use cookies to persist session for SSR
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        // In Server Components we usually won't call setAll; if it is called
        // because of auth flows, the library might try to set cookies. Some
        // environments don't allow setting cookies from server components.
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // ignore when executed in contexts that don't allow set
        }
      },
    },
  });
};