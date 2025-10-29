# Supabase Configuration

This directory contains Supabase-related configuration and seed data for the BettaDayz PBBG project.

## Directory Structure

```
supabase/
├── download-snippets.sh          # Script to download Supabase snippets
├── seed/                         # SQL seed data files
│   └── betta_dayz_products_seed_data.sql  # Products seed data
└── README.md                     # This file
```

## Setup

### Prerequisites

1. **Install Supabase CLI**

   Follow the official installation guide: https://supabase.com/docs/guides/cli

   Or install via npm:
   ```bash
   npm install -g supabase
   ```

2. **Authenticate with Supabase**

   You have two options:

   **Option A: Interactive login**
   ```bash
   supabase login
   ```

   **Option B: Use access token**
   ```bash
   export SUPABASE_ACCESS_TOKEN=your_access_token_here
   ```

   You can get your access token from: https://supabase.com/dashboard/account/tokens

## Downloading Snippets

### Using the script

To download the products seed data snippet:

```bash
./supabase/download-snippets.sh
```

This will download the snippet `7d7c66fd-bb56-40c4-8123-5fb58bd0fcfc` to `supabase/seed/betta_dayz_products_seed_data.sql`.

### Using the Supabase CLI directly

```bash
supabase snippets download 7d7c66fd-bb56-40c4-8123-5fb58bd0fcfc > supabase/seed/betta_dayz_products_seed_data.sql
```

Or with npx:

```bash
npx supabase snippets download 7d7c66fd-bb56-40c4-8123-5fb58bd0fcfc > supabase/seed/betta_dayz_products_seed_data.sql
```

### Custom snippet download

To download a different snippet:

```bash
./supabase/download-snippets.sh <snippet_id> <output_file>
```

Example:
```bash
./supabase/download-snippets.sh abc123-def456-ghi789 supabase/seed/custom_data.sql
```

## Environment Variables

Add these to your `.env.local` file:

```bash
# Supabase Project Configuration
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Supabase Access Token (for management operations)
VITE_SUPABASE_ACCESS_TOKEN=your_supabase_access_token_here
```

You can find these values in your Supabase project:
- Go to https://supabase.com/dashboard
- Select your project
- Go to Settings → API

## Using Seed Data

Once you've downloaded the seed data, you can apply it to your Supabase database:

```bash
# Using Supabase CLI
supabase db reset

# Or run the SQL file directly in your Supabase dashboard
# SQL Editor → New query → Paste contents of seed file
```

## Troubleshooting

### "Access token not provided"

Make sure you're authenticated:
- Run `supabase login` for interactive authentication
- Or set `SUPABASE_ACCESS_TOKEN` environment variable

### "Supabase CLI not found"

Install the Supabase CLI:
```bash
npm install -g supabase
```

Or use npx to run commands without installing globally:
```bash
npx supabase [command]
```

## Resources

- [Supabase CLI Documentation](https://supabase.com/docs/guides/cli)
- [Supabase Snippets](https://supabase.com/docs/guides/cli/snippets)
- [Supabase Dashboard](https://supabase.com/dashboard)
