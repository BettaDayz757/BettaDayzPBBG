# Supabase Dual Domain Configuration Guide

This guide explains how to configure your Supabase project to support both `bettadayz.shop` and `bettadayz.store` domains.

## 1. Authentication Settings

### Site URL Configuration

In your Supabase Dashboard:

1. Go to **Authentication** → **Settings** → **Site URL**
2. Set the main Site URL to: `https://bettadayz.shop`

### Additional Redirect URLs

In the **Additional redirect URLs** section, add:

```
https://bettadayz.store
https://bettadayz.store/auth/callback
https://bettadayz.shop/auth/callback
https://bettadayz.store/**
https://bettadayz.shop/**
```

## 2. CORS Configuration

### Allowed Origins

In **Authentication** → **Settings** → **CORS Origins**, add:

```
https://bettadayz.shop
https://bettadayz.store
```

## 3. Database Configuration

### Environment Variables Table

Create a table to store domain-specific configurations:

```sql
-- Create environment_configs table
CREATE TABLE IF NOT EXISTS environment_configs (
    id BIGSERIAL PRIMARY KEY,
    domain VARCHAR(255) UNIQUE NOT NULL,
    config JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert domain configurations
INSERT INTO environment_configs (domain, config) VALUES 
('bettadayz.shop', '{
    "primary": true,
    "features": {
        "payments": true,
        "chat": true,
        "tournaments": true,
        "marketplace": true
    },
    "branding": {
        "name": "BettaDayz PBBG",
        "theme": "shop"
    }
}'),
('bettadayz.store', '{
    "primary": false,
    "features": {
        "payments": true,
        "chat": true,
        "tournaments": true,
        "marketplace": true
    },
    "branding": {
        "name": "BettaDayz Store",
        "theme": "store"
    }
}');
```

### Row Level Security (RLS) Policies

```sql
-- Enable RLS on user profiles table
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view their own profiles on both domains
CREATE POLICY "Users can view own profile on both domains" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

-- Policy to allow users to update their own profiles on both domains
CREATE POLICY "Users can update own profile on both domains" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Enable RLS on environment_configs
ALTER TABLE environment_configs ENABLE ROW LEVEL SECURITY;

-- Policy to allow reading environment configs for all authenticated users
CREATE POLICY "Allow reading environment configs" ON environment_configs
    FOR SELECT TO authenticated USING (true);
```

## 4. Functions for Domain Management

### Get Domain Configuration Function

```sql
CREATE OR REPLACE FUNCTION get_domain_config(domain_name TEXT)
RETURNS JSONB AS $$
DECLARE
    config_data JSONB;
BEGIN
    SELECT config INTO config_data
    FROM environment_configs
    WHERE domain = domain_name;
    
    IF config_data IS NULL THEN
        -- Return default config if domain not found
        RETURN '{
            "primary": false,
            "features": {
                "payments": true,
                "chat": true,
                "tournaments": true,
                "marketplace": true
            },
            "branding": {
                "name": "BettaDayz PBBG",
                "theme": "default"
            }
        }'::JSONB;
    END IF;
    
    RETURN config_data;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### User Activity Tracking with Domain

```sql
-- Add domain column to user activity logs if it doesn't exist
ALTER TABLE user_activity_logs 
ADD COLUMN IF NOT EXISTS domain VARCHAR(255);

-- Function to log user activity with domain
CREATE OR REPLACE FUNCTION log_user_activity(
    user_id UUID,
    activity_type TEXT,
    activity_data JSONB DEFAULT '{}',
    domain_name TEXT DEFAULT 'bettadayz.shop'
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO user_activity_logs (user_id, activity_type, activity_data, domain, created_at)
    VALUES (user_id, activity_type, activity_data, domain_name, NOW());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 5. API Configuration

### Edge Functions for Domain Handling

If using Supabase Edge Functions, ensure they handle both domains:

```typescript
// edge-functions/domain-handler/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const origin = req.headers.get('origin');
    
    // Validate origin is one of our domains
    const allowedDomains = ['https://bettadayz.shop', 'https://bettadayz.store'];
    if (origin && !allowedDomains.includes(origin)) {
      return new Response('Forbidden', { status: 403 });
    }

    const domain = origin?.replace('https://', '') || 'bettadayz.shop';
    
    // Your function logic here
    const response = {
      message: 'Success',
      domain: domain,
      timestamp: new Date().toISOString()
    };

    return new Response(
      JSON.stringify(response),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': origin || '*'
        } 
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});
```

## 6. Client-Side Configuration

### Supabase Client Setup

In your Next.js app, ensure the client is configured for both domains:

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    // Configure for both domains
    redirectTo: typeof window !== 'undefined' 
      ? `${window.location.origin}/auth/callback`
      : undefined
  }
});

// Domain-specific configuration helper
export function getDomainConfig() {
  if (typeof window === 'undefined') return null;
  
  const domain = window.location.hostname;
  
  switch (domain) {
    case 'bettadayz.shop':
      return {
        primary: true,
        theme: 'shop',
        name: 'BettaDayz PBBG'
      };
    case 'bettadayz.store':
      return {
        primary: false,
        theme: 'store',
        name: 'BettaDayz Store'
      };
    default:
      return {
        primary: true,
        theme: 'default',
        name: 'BettaDayz PBBG'
      };
  }
}
```

## 7. Testing Checklist

### Authentication Testing

- [ ] Login works on both domains
- [ ] Logout works on both domains
- [ ] Session persistence across domains
- [ ] Password reset emails work for both domains
- [ ] Social auth (if enabled) works on both domains

### Database Testing

- [ ] User data is accessible from both domains
- [ ] Cross-domain data integrity maintained
- [ ] RLS policies work correctly
- [ ] Domain-specific configurations load properly

### API Testing

- [ ] API calls work from both domains
- [ ] CORS headers allow both domains
- [ ] Edge functions (if any) handle both domains
- [ ] Real-time subscriptions work on both domains

## 8. Monitoring and Analytics

### Database Queries for Monitoring

```sql
-- Monitor user activity by domain
SELECT 
    domain,
    COUNT(*) as activity_count,
    COUNT(DISTINCT user_id) as unique_users
FROM user_activity_logs 
WHERE created_at >= NOW() - INTERVAL '24 hours'
GROUP BY domain;

-- Monitor authentication events by domain
SELECT 
    raw_user_meta_data->>'domain' as domain,
    COUNT(*) as auth_events
FROM auth.audit_log_entries 
WHERE created_at >= NOW() - INTERVAL '24 hours'
AND payload->>'action' = 'login'
GROUP BY raw_user_meta_data->>'domain';
```

## 9. Troubleshooting

### Common Issues and Solutions

1. **CORS Errors**
   - Verify both domains are in CORS allowed origins
   - Check redirect URLs include both domains

2. **Authentication Issues**
   - Ensure site URL is set correctly
   - Verify redirect URLs include auth callback paths

3. **Session Not Persisting**
   - Check if cookies are being set for correct domain
   - Verify session configuration in client setup

4. **Database Access Issues**
   - Review RLS policies
   - Check if user has proper permissions

## 10. Security Considerations

1. **Domain Validation**: Always validate the requesting domain
2. **CORS Configuration**: Keep CORS as restrictive as possible
3. **Session Security**: Ensure sessions are properly secured across domains
4. **Data Isolation**: If needed, implement domain-specific data isolation
5. **Audit Logging**: Log all cross-domain activities for security monitoring

## Conclusion

This configuration allows your Supabase project to seamlessly support both domains while maintaining security and data integrity. Regular monitoring and testing will ensure the dual-domain setup continues to work correctly.
