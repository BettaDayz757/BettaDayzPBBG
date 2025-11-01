# Supabase Helpers

This directory contains helper utilities and client configurations for interacting with Supabase in the BettaDayz PBBG application.

## Files

### Import Convenience Files

#### `client-exports.ts` ✅ CLIENT-SAFE
Exports only client-safe Supabase utilities. Use this in browser/React component code.

```typescript
import { supabase, gameOperations } from '@/lib/supabase/client-exports';
```

#### `server-exports.ts` ⚠️ SERVER-ONLY
Exports server-side utilities with elevated privileges. Only use in API routes, Server Components, and Server Actions.

```typescript
import { supabaseAdmin } from '@/lib/supabase/server-exports';
```

#### `index.ts`
Main export file with all utilities. Includes security warnings in comments.

### Core Implementation Files

#### `client.ts`
Enhanced Supabase client with helper functions for common operations.

#### Features:
- Pre-configured Supabase client with auth and realtime settings
- `SupabaseHelper` class with convenience methods for:
  - User profile management
  - BettaBuckZ transaction processing
  - Generic query operations

#### Usage:
```typescript
import { supabase, supabaseHelper } from '@/lib/supabase/client';

// Get user profile
const { data, error } = await supabaseHelper.getUserProfile(userId);

// Process BettaBuckZ transaction
await supabaseHelper.processBettaBuckZTransaction(
  userId,
  'earn',
  100,
  'quest_reward',
  'Completed daily quest'
);

// Generic query
const { data } = await supabaseHelper.query('users', {
  eq: { id: userId },
  limit: 1
});
```

## Parent Level Files

### `../supabase.ts`
Main Supabase configuration file with:
- Client and admin (service role) Supabase clients
- Database type definitions (Player, GameSession, PlayerInventory, GameActivity)
- `gameOperations` helper object with methods for:
  - Player management (get, create, update)
  - Experience and energy management
  - Activity logging
  - Inventory management

#### Usage:
```typescript
import { supabase, supabaseAdmin, gameOperations } from '@/lib/supabase';

// Get player
const player = await gameOperations.getPlayer(userId);

// Add experience
await gameOperations.addExperience(playerId, 50);

// Log activity
await gameOperations.logActivity({
  player_id: playerId,
  activity_type: 'quest_complete',
  domain: 'shop',
  experience_gained: 50,
  coins_gained: 100
});
```

### `../supabaseClient.ts`
Simple Supabase client for basic usage:
```typescript
import { supabase } from '@/lib/supabaseClient';
```

### `examples.ts`
Comprehensive example code demonstrating:
- Client-side operations (player management, quests, inventory)
- Server-side admin operations
- Real-time subscriptions
- Authentication flows (sign up, sign in, sign out)

This file serves as a reference for implementing common patterns.

## Environment Variables

Required environment variables (see `.env.example`):

```env
# Client-side (public)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_public_anon_key_here

# Server-side (private) - DO NOT expose to client
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## Security Best Practices

1. **Never commit actual API keys** - Always use placeholder values in `.env.example`
2. **Use service role key only on server** - The service role key bypasses Row Level Security (RLS) and should never be exposed to the client
3. **Use anon key for client-side operations** - This key works with RLS policies
4. **Keep environment files out of git** - `.env.local` and `.env.production` should be in `.gitignore`
5. **JWT_SECRET is server-only** - The JWT_SECRET exported from `supabase.ts` should only be used in server-side code (API routes, server components). It is intentionally NOT re-exported from `index.ts` to prevent accidental client-side exposure

## Database Schema

The helpers work with the following main tables:
- `players` - Player accounts and stats
- `game_sessions` - Active gaming sessions
- `player_inventory` - Player items and equipment
- `game_activities` - Activity logs and history
- `bettabuckz_transactions` - In-game currency transactions
- `user_profiles` - User profile information

## Client vs Server Usage

### Client-side (Browser)
Use `supabase` from any helper file:
```typescript
import { supabase } from '@/lib/supabase';
// or
import { supabase } from '@/lib/supabase/client';
```

### Server-side (API Routes, Server Components)
Use `supabaseAdmin` for privileged operations:
```typescript
import { supabaseAdmin } from '@/lib/supabase';
```

## Contributing

When adding new helper functions:
1. Add them to the appropriate file based on their purpose
2. Include TypeScript types for all parameters and return values
3. Add error handling and logging
4. Update this README with usage examples
