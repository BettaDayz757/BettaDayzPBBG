/**
 * CLIENT-SIDE SUPABASE EXPORTS
 * 
 * This file exports only client-safe Supabase utilities.
 * These exports are safe to use in browser/React component code.
 * 
 * ✅ Safe for client-side usage
 * ✅ Works with Row Level Security (RLS)
 * ✅ Uses anon key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
 */

export {
  supabase,
  createClient,
  SupabaseHelper,
  supabaseHelper
} from './client';

// Client-safe game operations (uses supabase, not supabaseAdmin)
export {
  gameOperations,
  type Player,
  type GameSession,
  type PlayerInventory,
  type GameActivity
} from '../supabase';

/**
 * Usage in React components:
 * 
 * ```typescript
 * import { supabase, gameOperations } from '@/lib/supabase/client-exports';
 * 
 * const player = await gameOperations.getPlayer(userId);
 * ```
 */
