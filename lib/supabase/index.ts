/**
 * Supabase Helpers - Main Export
 * 
 * This file provides convenient exports for all Supabase-related
 * functionality in the BettaDayz PBBG application.
 * 
 * ⚠️ SECURITY WARNING:
 * - Use 'supabase' for CLIENT-SIDE operations (browser, React components)
 * - Use 'supabaseAdmin' ONLY in SERVER-SIDE code (API routes, Server Components)
 * - Never use supabaseAdmin in client-side code as it bypasses Row Level Security (RLS)
 * - JWT_SECRET is intentionally not exported here - import directly from '../supabase' in server code only
 */

// CLIENT-SIDE EXPORTS - Safe for browser use
export {
  supabase,
  createClient,
  SupabaseHelper,
  supabaseHelper
} from './client';

// SERVER-SIDE EXPORTS - Use only in API routes and Server Components
// ⚠️ WARNING: supabaseAdmin bypasses RLS and should NEVER be used in client code
export {
  supabase as supabaseClient,
  supabaseAdmin,  // ⚠️ SERVER-SIDE ONLY
  gameOperations,
  type Player,
  type GameSession,
  type PlayerInventory,
  type GameActivity
} from '../supabase';

/**
 * Usage examples:
 * 
 * // Option 1: Import specific exports
 * import { supabase, gameOperations } from '@/lib/supabase';
 * 
 * // Option 2: Import from supabase directory
 * import { supabaseHelper } from '@/lib/supabase/client';
 * 
 * // Option 3: Import everything
 * import * as Supabase from '@/lib/supabase';
 */
