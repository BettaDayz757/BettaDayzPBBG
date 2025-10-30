-- Supabase Dual Domain Configuration SQL Script
-- Run this script in your Supabase SQL editor to set up dual domain support

-- =====================================================
-- 1. CREATE ENVIRONMENT CONFIGURATIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS environment_configs (
    id BIGSERIAL PRIMARY KEY,
    domain VARCHAR(255) UNIQUE NOT NULL,
    config JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. INSERT DOMAIN CONFIGURATIONS
-- =====================================================

INSERT INTO environment_configs (domain, config) VALUES 
('bettadayz.shop', '{
    "primary": true,
    "features": {
        "payments": true,
        "chat": true,
        "tournaments": true,
        "marketplace": true,
        "achievements": true,
        "leaderboards": true,
        "guilds": true
    },
    "branding": {
        "name": "BettaDayz PBBG",
        "theme": "shop",
        "logo": "/logo-shop.png",
        "primaryColor": "#3B82F6",
        "secondaryColor": "#1E40AF"
    },
    "analytics": {
        "googleAnalytics": "GA_SHOP_ID",
        "trackingEnabled": true
    }
}'),
('bettadayz.store', '{
    "primary": false,
    "features": {
        "payments": true,
        "chat": true,
        "tournaments": true,
        "marketplace": true,
        "achievements": true,
        "leaderboards": true,
        "guilds": true
    },
    "branding": {
        "name": "BettaDayz Store",
        "theme": "store",
        "logo": "/logo-store.png",
        "primaryColor": "#059669",
        "secondaryColor": "#047857"
    },
    "analytics": {
        "googleAnalytics": "GA_STORE_ID",
        "trackingEnabled": true
    }
}')
ON CONFLICT (domain) DO UPDATE SET
    config = EXCLUDED.config,
    updated_at = NOW();

-- =====================================================
-- 3. CREATE USER PROFILES TABLE (IF NOT EXISTS)
-- =====================================================

CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    display_name VARCHAR(100),
    avatar_url TEXT,
    bio TEXT,
    level INTEGER DEFAULT 1,
    experience INTEGER DEFAULT 0,
    bettabuckz INTEGER DEFAULT 1000,
    last_login TIMESTAMP WITH TIME ZONE,
    preferred_domain VARCHAR(255) DEFAULT 'bettadayz.shop',
    settings JSONB DEFAULT '{}',
    stats JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. CREATE USER ACTIVITY LOGS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS user_activity_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    activity_type VARCHAR(100) NOT NULL,
    activity_data JSONB DEFAULT '{}',
    domain VARCHAR(255) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. CREATE DOMAIN STATISTICS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS domain_statistics (
    id BIGSERIAL PRIMARY KEY,
    domain VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    unique_visitors INTEGER DEFAULT 0,
    page_views INTEGER DEFAULT 0,
    new_users INTEGER DEFAULT 0,
    active_sessions INTEGER DEFAULT 0,
    revenue DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(domain, date)
);

-- =====================================================
-- 6. ENABLE ROW LEVEL SECURITY
-- =====================================================

-- Environment configs
ALTER TABLE environment_configs ENABLE ROW LEVEL SECURITY;

-- User profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- User activity logs
ALTER TABLE user_activity_logs ENABLE ROW LEVEL SECURITY;

-- Domain statistics (admin only)
ALTER TABLE domain_statistics ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 7. CREATE RLS POLICIES
-- =====================================================

-- Environment configs - readable by all authenticated users
DROP POLICY IF EXISTS "Allow reading environment configs" ON environment_configs;
CREATE POLICY "Allow reading environment configs" ON environment_configs
    FOR SELECT TO authenticated USING (true);

-- User profiles - users can view and edit their own
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- User activity logs - users can only see their own logs
DROP POLICY IF EXISTS "Users can view own activity" ON user_activity_logs;
CREATE POLICY "Users can view own activity" ON user_activity_logs
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can insert activity logs" ON user_activity_logs;
CREATE POLICY "System can insert activity logs" ON user_activity_logs
    FOR INSERT WITH CHECK (true);

-- Domain statistics - admin only (you'll need to create admin role)
DROP POLICY IF EXISTS "Admin can view domain stats" ON domain_statistics;
CREATE POLICY "Admin can view domain stats" ON domain_statistics
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND (settings->>'role')::TEXT = 'admin'
        )
    );

-- =====================================================
-- 8. CREATE HELPER FUNCTIONS
-- =====================================================

-- Function to get domain configuration
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
                "marketplace": true,
                "achievements": true,
                "leaderboards": true,
                "guilds": true
            },
            "branding": {
                "name": "BettaDayz PBBG",
                "theme": "default",
                "logo": "/logo-default.png",
                "primaryColor": "#3B82F6",
                "secondaryColor": "#1E40AF"
            },
            "analytics": {
                "trackingEnabled": false
            }
        }'::JSONB;
    END IF;
    
    RETURN config_data;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log user activity with domain
CREATE OR REPLACE FUNCTION log_user_activity(
    user_id UUID,
    activity_type TEXT,
    activity_data JSONB DEFAULT '{}',
    domain_name TEXT DEFAULT 'bettadayz.shop',
    ip_addr INET DEFAULT NULL,
    user_agent_string TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO user_activity_logs (
        user_id, 
        activity_type, 
        activity_data, 
        domain, 
        ip_address, 
        user_agent,
        created_at
    )
    VALUES (
        user_id, 
        activity_type, 
        activity_data, 
        domain_name, 
        ip_addr, 
        user_agent_string,
        NOW()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update domain statistics
CREATE OR REPLACE FUNCTION update_domain_stats(
    domain_name TEXT,
    stat_date DATE DEFAULT CURRENT_DATE,
    visitor_count INTEGER DEFAULT 0,
    page_count INTEGER DEFAULT 0,
    new_user_count INTEGER DEFAULT 0,
    session_count INTEGER DEFAULT 0,
    revenue_amount DECIMAL DEFAULT 0
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO domain_statistics (
        domain, date, unique_visitors, page_views, 
        new_users, active_sessions, revenue
    )
    VALUES (
        domain_name, stat_date, visitor_count, page_count,
        new_user_count, session_count, revenue_amount
    )
    ON CONFLICT (domain, date) DO UPDATE SET
        unique_visitors = domain_statistics.unique_visitors + EXCLUDED.unique_visitors,
        page_views = domain_statistics.page_views + EXCLUDED.page_views,
        new_users = domain_statistics.new_users + EXCLUDED.new_users,
        active_sessions = GREATEST(domain_statistics.active_sessions, EXCLUDED.active_sessions),
        revenue = domain_statistics.revenue + EXCLUDED.revenue;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's preferred domain
CREATE OR REPLACE FUNCTION get_user_preferred_domain(user_id UUID)
RETURNS TEXT AS $$
DECLARE
    preferred_domain TEXT;
BEGIN
    SELECT preferred_domain INTO preferred_domain
    FROM user_profiles
    WHERE id = user_id;
    
    RETURN COALESCE(preferred_domain, 'bettadayz.shop');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 9. CREATE TRIGGERS FOR UPDATED_AT
-- =====================================================

-- Trigger function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to relevant tables
DROP TRIGGER IF EXISTS update_environment_configs_updated_at ON environment_configs;
CREATE TRIGGER update_environment_configs_updated_at
    BEFORE UPDATE ON environment_configs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 10. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Indexes for user_activity_logs
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_user_id ON user_activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_domain ON user_activity_logs(domain);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_created_at ON user_activity_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_activity_type ON user_activity_logs(activity_type);

-- Indexes for user_profiles
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_profiles_preferred_domain ON user_profiles(preferred_domain);
CREATE INDEX IF NOT EXISTS idx_user_profiles_last_login ON user_profiles(last_login);

-- Indexes for domain_statistics
CREATE INDEX IF NOT EXISTS idx_domain_statistics_domain_date ON domain_statistics(domain, date);

-- =====================================================
-- 11. CREATE VIEWS FOR ANALYTICS
-- =====================================================

-- Daily domain overview
CREATE OR REPLACE VIEW daily_domain_overview AS
SELECT 
    domain,
    date,
    unique_visitors,
    page_views,
    new_users,
    active_sessions,
    revenue,
    CASE 
        WHEN LAG(unique_visitors) OVER (PARTITION BY domain ORDER BY date) > 0 
        THEN ROUND(
            ((unique_visitors - LAG(unique_visitors) OVER (PARTITION BY domain ORDER BY date))::DECIMAL 
            / LAG(unique_visitors) OVER (PARTITION BY domain ORDER BY date)) * 100, 
            2
        )
        ELSE 0 
    END as visitor_growth_percent
FROM domain_statistics
ORDER BY domain, date DESC;

-- User activity summary by domain
CREATE OR REPLACE VIEW user_activity_summary AS
SELECT 
    domain,
    DATE(created_at) as activity_date,
    activity_type,
    COUNT(*) as activity_count,
    COUNT(DISTINCT user_id) as unique_users
FROM user_activity_logs
GROUP BY domain, DATE(created_at), activity_type
ORDER BY activity_date DESC, domain, activity_count DESC;

-- =====================================================
-- 12. GRANT PERMISSIONS
-- =====================================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO authenticated;

-- Grant permissions on tables
GRANT SELECT ON environment_configs TO authenticated;
GRANT ALL ON user_profiles TO authenticated;
GRANT SELECT, INSERT ON user_activity_logs TO authenticated;
GRANT SELECT ON domain_statistics TO authenticated;

-- Grant permissions on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION get_domain_config(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION log_user_activity(UUID, TEXT, JSONB, TEXT, INET, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_preferred_domain(UUID) TO authenticated;

-- =====================================================
-- SETUP COMPLETE
-- =====================================================

-- Insert a test log entry to verify everything works
DO $$
BEGIN
    RAISE NOTICE 'Dual domain configuration setup complete!';
    RAISE NOTICE 'Tables created: environment_configs, user_profiles, user_activity_logs, domain_statistics';
    RAISE NOTICE 'Functions created: get_domain_config, log_user_activity, update_domain_stats, get_user_preferred_domain';
    RAISE NOTICE 'Views created: daily_domain_overview, user_activity_summary';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '1. Update Supabase Auth settings with both domains';
    RAISE NOTICE '2. Add both domains to CORS allowed origins';
    RAISE NOTICE '3. Test authentication on both domains';
    RAISE NOTICE '4. Verify RLS policies are working correctly';
END $$;