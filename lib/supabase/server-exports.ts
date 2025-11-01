/**
 * SERVER-SIDE SUPABASE EXPORTS
 * 
 * This file exports server-side Supabase utilities with elevated privileges.
 * 
 * WARNING: These exports should ONLY be used in:
 * - API Routes (pages/api)
 * - Server Components (without use client directive)
 * - Server Actions
 * 
 * NEVER import these in client-side code
 * NEVER use in files with use client directive
 */

// Server-side client with elevated privileges (bypasses RLS)
export {
  supabaseAdmin,
  JWT_SECRET
} from '../supabase';

// Re-export client for convenience (but prefer supabaseAdmin for privileged ops)
export {
  supabase,
  gameOperations,
  type Player,
  type GameSession,
  type PlayerInventory,
  type GameActivity
} from '../supabase';

/**
 * Usage in API routes:
 * 
 * ```typescript
 * // pages/api/admin/update-player.ts
 * import { supabaseAdmin } from '@/lib/supabase/server-exports';
 * 
 * export default async function handler(req, res) {
 *   const { data, error } = await supabaseAdmin
 *     .from('players')
 *     .update({ premium_currency: 1000 })
 *     .eq('id', playerId);
 *   
 *   res.json({ data, error });
 * }
 * ```
 */
