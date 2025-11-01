/**
 * Supabase Helpers - Main Export
 * 
 * This file provides convenient exports for all Supabase-related
 * functionality in the BettaDayz PBBG application.
 */

// Re-export everything from client.ts for convenience
export {
  supabase,
  createClient,
  SupabaseHelper,
  supabaseHelper
} from './client';

// Also export from parent supabase.ts for backwards compatibility
export {
  supabase as supabaseClient,
  supabaseAdmin,
  gameOperations,
  type Player,
  type GameSession,
  type PlayerInventory,
  type GameActivity,
  JWT_SECRET
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
