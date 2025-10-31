# BettaDayz PBBG - Supabase Database Setup

## Overview

This directory contains database migrations and setup files for the BettaDayz PBBG Supabase database.

## Database Schema

The database includes the following main tables:

### Core Tables

1. **players** - Player profiles and character stats
2. **businesses** - Player-owned businesses across Norfolk
3. **products** - Products/services offered by businesses
4. **transactions** - Financial transaction history
5. **crews** - Player groups/gangs with territory control
6. **crew_members** - Crew membership and roles
7. **locations** - Norfolk, VA gameplay locations
8. **todos** - Task management (testing/example)

## Setup Instructions

### 1. Local Development with Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Initialize Supabase in your project
supabase init

# Start local Supabase
supabase start

# Run migrations
supabase db reset
```

### 2. Hosted Supabase (Production)

1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project
3. Navigate to SQL Editor
4. Copy and paste the contents of `migrations/001_initial_schema.sql`
5. Run the migration

### 3. Authentication Settings (Supabase Dashboard)

In your Supabase project, configure Authentication → Settings to match your domains. This is required for OAuth flows, email links, and CORS.

Production:

- Site URL: <https://bettadayz.shop>
- Additional redirect URLs:
  - <https://bettadayz.shop/auth/callback>
  - <https://bettadayz.store/auth/callback>
  - <https://bettadayz.shop>
  - <https://bettadayz.store>
- CORS origins:
  - <https://bettadayz.shop>
  - <https://bettadayz.store>

Optional (Local development):

- Site URL: <http://localhost:3000>
- Additional redirect URLs:
  - <http://localhost:3000/auth/callback>
  - <http://localhost:3001/auth/callback>
  - <http://localhost:3000>
  - <http://localhost:3001>
- CORS origins:
  - <http://localhost:3000>
  - <http://localhost:3001>

### 4. Environment Variables

Add these to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Table Details

### Players Table

- Stores player profiles, stats, reputation, cash, and level
- Age ranges from 18-85 (life simulation aspect)
- Tracks current location in Norfolk

### Businesses Table

- Multiple business types (Barbershop, Soul Food Restaurant, etc.)
- Financial tracking (revenue, expenses, profit)
- Location-based business opportunities

### Locations Table

- 8 Norfolk neighborhoods pre-seeded
- Territory control system for crews
- Business opportunities per location

### Crews Table

- Gang/group system for competitive play
- Territory control mechanics
- Reputation and member tracking

## Row Level Security (RLS)

All tables have RLS enabled with appropriate policies:

- Players can view and edit their own data
- Public data (locations, businesses) is viewable by all
- Crew leaders can manage their crews
- Transaction privacy per player

## Indexes

Performance indexes are created on:

- Foreign keys
- Frequently queried columns (username, location, etc.)
- Timestamp fields for sorting

## Functions & Triggers

- `update_updated_at_column()` - Automatically updates timestamp on row changes
- Applied to all main tables

## Seed Data

The migration includes seed data for:

- 8 Norfolk, VA locations
- Location types and descriptions

## Future Migrations

Create new migration files with incrementing numbers:

- `002_add_achievements.sql`
- `003_add_events.sql`
- etc.

## Testing

Use the `todos` table for testing Supabase connectivity:

```typescript
const { data, error } = await supabase
  .from('todos')
  .select('*');
```

## Support

For issues or questions:

1. Check Supabase documentation: [supabase.com/docs](https://supabase.com/docs)
2. Review migration logs: `supabase db diff`
3. Check RLS policies if data access issues occur

## Backup

Regular backups are recommended:

```bash
# Export current schema
supabase db dump -f backup.sql

# Export data only
supabase db dump --data-only -f data.sql
```
