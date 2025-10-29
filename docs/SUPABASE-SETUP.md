# Supabase Setup Guide for BettaDayz PBBG

This guide provides comprehensive instructions for setting up Supabase as the backend database for the BettaDayz PBBG dual-domain game system.

## Overview

Supabase provides:
- PostgreSQL database with Row Level Security (RLS)
- Real-time subscriptions
- Authentication system
- RESTful API
- TypeScript client library

## Prerequisites

1. **Supabase Account**: Sign up at [https://supabase.com](https://supabase.com)
2. **Node.js**: Version 18.0.0 or higher
3. **Database Access**: Admin access to create tables and functions

## Step 1: Create Supabase Project

1. **Sign in to Supabase Dashboard**:
   - Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Sign in with your account

2. **Create New Project**:
   - Click "New Project"
   - Fill in project details:
     - **Name**: BettaDayz PBBG
     - **Database Password**: Choose a strong password (save this!)
     - **Region**: Choose closest to your users
     - **Pricing Plan**: Choose appropriate plan

3. **Wait for Project Creation**:
   - Project creation takes 2-3 minutes
   - You'll receive a confirmation email

## Step 2: Configure Database

### Get Project Credentials

1. Go to Project Settings → API
2. Copy the following:
   - **Project URL**: Your Supabase project URL
   - **anon/public key**: Public API key for client-side
   - **service_role key**: Secret key for server-side operations

### Set Environment Variables

Create or update `.env.local`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# JWT Configuration
JWT_SECRET=9=N6H//qQ]?g+BDV

# Domain Configuration
NEXT_PUBLIC_DOMAIN=bettadayz.shop
```

## Step 3: Create Database Schema

### Run SQL Schema

1. **Open SQL Editor**:
   - In Supabase Dashboard, go to SQL Editor
   - Click "New Query"

2. **Execute Schema**:
   - Copy entire contents of `supabase-schema.sql`
   - Paste into SQL Editor
   - Click "Run" to execute

The schema creates:

#### Tables:
- **players**: Player accounts and stats
- **game_sessions**: Active game sessions
- **player_inventory**: Player items and equipment
- **game_activities**: Activity log and history
- **quests**: Available quests
- **player_quests**: Player quest progress
- **guilds**: Guild/clan system
- **guild_members**: Guild membership
- **marketplace_listings**: Player marketplace

#### Functions:
- `add_experience()`: Add XP and handle leveling
- `consume_energy()`: Use player energy
- `regenerate_energy()`: Auto-regenerate energy
- `player_transaction()`: Handle currency transactions
- `handle_new_user()`: Auto-create player on signup

#### Security:
- Row Level Security (RLS) enabled on all tables
- Policies for read/write access based on auth.uid()

### Verify Schema Creation

Run this query to verify tables were created:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

You should see all 9 tables listed.

## Step 4: Configure Authentication

### Email Authentication

1. **Go to Authentication → Providers**
2. **Enable Email Provider**:
   - Toggle Email on
   - Configure email templates (optional)
   - Set confirmation URL: `https://bettadayz.shop/auth/confirm`

### Configure Email Templates

1. Go to Authentication → Email Templates
2. Customize templates:
   - **Confirmation Email**: Welcome message
   - **Password Reset**: Reset instructions
   - **Magic Link**: Passwordless login

### JWT Configuration

1. **Go to Settings → API**
2. **Verify JWT Settings**:
   - JWT expiry: 3600 seconds (1 hour)
   - JWT secret: Matches your `JWT_SECRET` env variable

## Step 5: Enable Real-time

Real-time is already configured in the schema. To verify:

1. Go to Database → Replication
2. Verify these tables have replication enabled:
   - players
   - game_sessions
   - player_inventory
   - game_activities
   - player_quests
   - guild_members
   - marketplace_listings

## Step 6: Set Up API Integration

The application includes API routes for Supabase integration:

### Available Endpoints:

#### Health Check
```
GET /api/health
```

#### Authentication
```
POST /api/auth/signup
POST /api/auth/signin
POST /api/auth/signout
```

#### Player Management
```
GET  /api/player/stats
POST /api/player/stats
GET  /api/player/inventory
POST /api/player/inventory
```

#### Game Activities
```
POST /api/game/activities
```

### Test API Endpoints

After deployment, test the health endpoint:

```bash
curl https://bettadayz.shop/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-10-29T...",
  "service": "BettaDayz PBBG API",
  "version": "2.0.0",
  "supabase": true,
  "domain": "shop"
}
```

## Step 7: Test Database Functions

### Test Player Creation

In Supabase SQL Editor:

```sql
-- Create a test user (normally done via auth.signUp)
INSERT INTO auth.users (id, email, encrypted_password)
VALUES (
  gen_random_uuid(),
  'test@example.com',
  crypt('password123', gen_salt('bf'))
);

-- Verify player was auto-created
SELECT * FROM players 
WHERE email = 'test@example.com';
```

### Test Experience System

```sql
-- Add experience to a player
SELECT add_experience(
  'player-uuid-here',
  500
);
```

Expected result:
```json
{
  "level_up": true,
  "old_level": 1,
  "new_level": 2,
  "experience_gained": 500,
  "new_experience": 0,
  "exp_needed_for_next": 1150
}
```

### Test Energy System

```sql
-- Consume energy
SELECT consume_energy(
  'player-uuid-here',
  10
);

-- Regenerate energy
SELECT regenerate_energy('player-uuid-here');
```

## Step 8: Configure Row Level Security

RLS policies are already created in the schema. To verify:

### Check Policies

```sql
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```

### Test RLS

1. **Create test user** in Supabase Auth
2. **Get access token** from user session
3. **Make API request** with token in Authorization header
4. **Verify** user can only access their own data

## Step 9: Set Up Database Backups

### Automatic Backups

Supabase Pro plan includes:
- Daily automatic backups
- Point-in-time recovery
- 7-day retention (configurable)

### Manual Backup

To create a manual backup:

```bash
# Using Supabase CLI
supabase db dump > backup.sql

# Or download from Dashboard
# Go to Database → Backups → Download
```

## Step 10: Monitoring and Performance

### Enable Database Logs

1. Go to Database → Logs
2. View query performance
3. Identify slow queries

### Set Up Alerts

1. Go to Settings → Alerts
2. Configure alerts for:
   - High CPU usage
   - Database connections
   - Storage usage
   - Error rates

### Query Performance

Indexes are already created for common queries. To add more:

```sql
-- Example: Add index for frequent lookups
CREATE INDEX idx_custom 
ON table_name(column_name);
```

## Integration with Application

### Client-Side Usage

```typescript
import { supabase, gameOperations } from '@/lib/supabase'

// Get player data
const player = await gameOperations.getPlayer(userId)

// Add experience
const result = await gameOperations.addExperience(playerId, 100)

// Log activity
await gameOperations.logActivity({
  player_id: playerId,
  activity_type: 'quest_completed',
  domain: 'shop',
  experience_gained: 100,
  coins_gained: 500
})
```

### Server-Side Usage

```typescript
import { supabaseAdmin } from '@/lib/supabase'

// Server-only operations with service role key
const { data, error } = await supabaseAdmin
  .from('players')
  .select('*')
  .eq('id', playerId)
  .single()
```

## Domain-Specific Configuration

### Shop Domain (bettadayz.shop)

Set environment variable:
```bash
NEXT_PUBLIC_DOMAIN=bettadayz.shop
```

All activities logged will use domain='shop'

### Store Domain (bettadayz.store)

Set environment variable:
```bash
NEXT_PUBLIC_DOMAIN=bettadayz.store
```

All activities logged will use domain='store'

## Troubleshooting

### Connection Issues

1. **Verify credentials** in `.env.local`
2. **Check project status** in Supabase Dashboard
3. **Test connection**:
   ```bash
   curl -I https://your-project.supabase.co
   ```

### Authentication Errors

1. **Verify JWT secret** matches Supabase settings
2. **Check token expiry** settings
3. **Test signup/signin** endpoints

### RLS Policy Issues

If users can't access data:
1. Verify user is authenticated
2. Check RLS policies are correct
3. Test with service role key to bypass RLS

### Performance Issues

1. **Check slow queries** in Database Logs
2. **Add indexes** for frequently queried columns
3. **Optimize queries** to reduce joins
4. **Use connection pooling** for high traffic

## Security Best Practices

1. **Never expose service role key** on client-side
2. **Always use RLS** for user data protection
3. **Validate input** before database operations
4. **Use prepared statements** to prevent SQL injection
5. **Rotate credentials** regularly
6. **Enable 2FA** on Supabase account
7. **Restrict API access** by IP if possible
8. **Monitor for suspicious activity**

## Maintenance

### Regular Tasks

- **Weekly**: Review database logs
- **Monthly**: Check storage usage
- **Quarterly**: Review and optimize indexes
- **Annually**: Rotate credentials

### Scaling Considerations

When your user base grows:
1. Upgrade to higher plan
2. Enable read replicas
3. Implement caching layer
4. Optimize database queries
5. Archive old data

## Support Resources

- **Supabase Docs**: https://supabase.com/docs
- **Discord Community**: https://discord.supabase.com
- **GitHub Issues**: https://github.com/supabase/supabase/issues
- **API Reference**: https://supabase.com/docs/reference

## Next Steps

After setting up Supabase:
1. Test all API endpoints
2. Create test user accounts
3. Verify game mechanics work correctly
4. Set up monitoring and alerts
5. Deploy to production
6. Monitor performance and optimize as needed
