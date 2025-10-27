# Admin UI Setup Guide

This guide explains how to set up and use the Next.js Admin UI for managing todos in Supabase.

## Overview

The admin UI provides a web-based interface to Create, Read, Update, and Delete (CRUD) todos stored in Supabase. It uses Next.js App Router with server-side proxy routes to securely interact with Supabase using the service role key.

## Architecture

- **Client UI** (`app/admin/page.tsx`): React component that renders the admin interface
- **Server Proxy Routes** (`app/api/proxy/todos/`): API routes that handle database operations securely on the server
- **Supabase Helpers** (`utils/supabase/`): Utility functions for creating Supabase clients

## Prerequisites

1. A Supabase project with a `todos` table
2. Next.js 13+ with App Router
3. Node.js 16+ and npm/yarn/pnpm

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Public variables (safe to expose to the browser)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Server-only variable (NEVER expose to the browser)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Where to find these values:

1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the following:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` `secret` key → `SUPABASE_SERVICE_ROLE_KEY`

⚠️ **Security Warning**: The `SUPABASE_SERVICE_ROLE_KEY` has admin privileges. NEVER commit it to version control or expose it in client-side code.

## Database Schema

Create a `todos` table in your Supabase database:

```sql
CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Optional: Add Row Level Security (RLS)
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Create a policy for authenticated users
CREATE POLICY "Enable all operations for authenticated users"
ON todos
FOR ALL
USING (true);
```

## Installation

The required files are already in place:

- ✅ `app/admin/page.tsx` - Admin UI page
- ✅ `app/api/proxy/todos/route.ts` - GET and POST endpoints
- ✅ `app/api/proxy/todos/[id]/route.ts` - PATCH and DELETE endpoints
- ✅ `utils/supabase/browser.ts` - Browser client helper
- ✅ `utils/supabase/server.ts` - Server client helper

Install dependencies (if not already installed):

```bash
npm install @supabase/ssr
```

## Usage

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the admin page:
   ```
   http://localhost:3000/admin
   ```

3. Use the interface to:
   - **Create** new todos by entering text and clicking "Create"
   - **Read** all todos displayed in the list
   - **Update** a todo by clicking "Edit", modifying the text, and clicking "Save"
   - **Delete** a todo by clicking "Delete" (with confirmation)

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables in Vercel dashboard (Settings > Environment Variables)
4. Deploy

### Hostinger VPS

1. Install Node.js on your VPS
2. Clone your repository
3. Set up environment variables
4. Run `npm run build && npm start`

### ⚠️ Hostinger Shared Hosting

Hostinger shared hosting does **not support** Next.js SSR (Server-Side Rendering). The server proxy routes require Node.js runtime. Consider:
- Using Vercel for free hosting with full Next.js support
- Upgrading to Hostinger VPS for Node.js support
- Using static export with direct Supabase client (less secure for admin operations)

## Security Considerations

1. **Service Role Key**: Only used in server-side API routes, never exposed to the browser
2. **Authentication**: Current implementation does not include authentication. Add authentication before deploying to production:
   ```typescript
   // Example: Add auth check in API routes
   import { createServerSupabase } from '@/utils/supabase/server';
   
   export async function GET() {
     const supabase = createServerSupabase();
     const { data: { user } } = await supabase.auth.getUser();
     
     if (!user) {
       return new NextResponse('Unauthorized', { status: 401 });
     }
     
     // ... rest of the code
   }
   ```
3. **Row Level Security (RLS)**: Enable RLS on your Supabase tables for additional security
4. **CORS**: The proxy routes handle CORS automatically

## Troubleshooting

### "Cannot find module '@/utils/supabase/browser'"

Make sure your `tsconfig.json` has the path mapping:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### API routes return 500 errors

1. Check that all environment variables are set correctly
2. Verify the Supabase URL and keys are valid
3. Ensure the `todos` table exists in your database
4. Check server logs for specific error messages

### "Access denied" errors from Supabase

1. Verify the `SUPABASE_SERVICE_ROLE_KEY` is correct
2. Check that RLS policies allow the operations you're attempting
3. Ensure the table and column names match (`todos` table with `id` and `title` columns)

## License

This code is provided as part of the BettaDayzPBBG project. See the main LICENSE file for details.
