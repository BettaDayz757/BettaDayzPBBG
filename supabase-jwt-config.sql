-- BettaDayz PBBG Supabase Configuration
-- Run this in your Supabase SQL Editor

-- ======================================
-- JWT Configuration
-- ======================================

-- Set the JWT secret for your project
-- This should match your environment variable: 9=N6H//qQ]?g+BDV
-- NOTE: In Supabase, the JWT secret is typically set in project settings,
-- not via SQL. Use this as reference for your configuration.

-- ======================================
-- Custom Functions for JWT Handling
-- ======================================

-- Function to validate JWT tokens with custom secret
CREATE OR REPLACE FUNCTION auth.validate_custom_jwt(token text)
RETURNS json AS $$
DECLARE
    jwt_secret text := '9=N6H//qQ]?g+BDV';
    decoded_payload json;
BEGIN
    -- This is a placeholder for JWT validation
    -- In production, use Supabase's built-in JWT handling
    RETURN '{"valid": true, "user_id": "placeholder"}'::json;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ======================================
-- Application Settings Table
-- ======================================

-- Create a settings table to store application configuration
CREATE TABLE IF NOT EXISTS app_settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert JWT configuration
INSERT INTO app_settings (key, value, description) VALUES
    ('jwt_secret', '9=N6H//qQ]?g+BDV', 'JWT secret for authentication'),
    ('bettabuckz_exchange_rate', '100', '1 USD = 100 BettaBuckZ'),
    ('max_guild_members', '50', 'Maximum members per guild'),
    ('tournament_entry_fee', '1000', 'Tournament entry fee in BettaBuckZ'),
    ('daily_login_bonus', '100', 'Daily login bonus in BettaBuckZ'),
    ('rate_limit_max', '100', 'Max requests per window'),
    ('rate_limit_window', '900000', '15 minutes in milliseconds'),
    ('session_timeout', '86400000', '24 hours in milliseconds')
ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    updated_at = NOW();

-- ======================================
-- RLS Policies for Settings
-- ======================================

-- Enable RLS on app_settings
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read settings
CREATE POLICY "Users can read app settings" ON app_settings
    FOR SELECT USING (auth.role() = 'authenticated');

-- Only service role can modify settings
CREATE POLICY "Only service role can modify settings" ON app_settings
    FOR ALL USING (auth.role() = 'service_role');

-- ======================================
-- Helper Functions
-- ======================================

-- Function to get a setting value
CREATE OR REPLACE FUNCTION get_app_setting(setting_key text)
RETURNS text AS $$
DECLARE
    setting_value text;
BEGIN
    SELECT value INTO setting_value 
    FROM app_settings 
    WHERE key = setting_key;
    
    RETURN setting_value;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update a setting value
CREATE OR REPLACE FUNCTION update_app_setting(setting_key text, setting_value text)
RETURNS boolean AS $$
BEGIN
    UPDATE app_settings 
    SET value = setting_value, updated_at = NOW()
    WHERE key = setting_key;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ======================================
-- JWT Secret Verification
-- ======================================

-- Function to verify the JWT secret is correctly configured
CREATE OR REPLACE FUNCTION verify_jwt_config()
RETURNS json AS $$
DECLARE
    stored_secret text;
    result json;
BEGIN
    SELECT value INTO stored_secret FROM app_settings WHERE key = 'jwt_secret';
    
    IF stored_secret = '9=N6H//qQ]?g+BDV' THEN
        result := json_build_object(
            'status', 'success',
            'message', 'JWT secret is correctly configured',
            'secret_length', length(stored_secret)
        );
    ELSE
        result := json_build_object(
            'status', 'error',
            'message', 'JWT secret mismatch or not found',
            'expected_length', 15,
            'actual_length', COALESCE(length(stored_secret), 0)
        );
    END IF;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ======================================
-- Test the Configuration
-- ======================================

-- Verify the JWT secret is properly stored
SELECT verify_jwt_config();

-- Show all current settings
SELECT key, value, description, created_at 
FROM app_settings 
ORDER BY key;