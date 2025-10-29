-- BettaDayz PBBG Complete Database Schema
-- JWT Secret: 9=N6H//qQ]?g+BDV
-- Run this in Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Players table - Core player data
CREATE TABLE IF NOT EXISTS players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    level INTEGER DEFAULT 1,
    experience BIGINT DEFAULT 0,
    coins BIGINT DEFAULT 1000,
    energy INTEGER DEFAULT 100,
    max_energy INTEGER DEFAULT 100,
    health INTEGER DEFAULT 100,
    max_health INTEGER DEFAULT 100,
    location_id INTEGER DEFAULT 1,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Game sessions for activity tracking
CREATE TABLE IF NOT EXISTS game_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    session_end TIMESTAMP WITH TIME ZONE,
    ip_address INET,
    user_agent TEXT,
    activities JSONB DEFAULT '[]'::jsonb
);

-- Player inventory system
CREATE TABLE IF NOT EXISTS player_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    item_type VARCHAR(50) NOT NULL,
    item_name VARCHAR(100) NOT NULL,
    quantity INTEGER DEFAULT 1,
    item_data JSONB DEFAULT '{}'::jsonb,
    acquired_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(player_id, item_type, item_name)
);

-- Quest system
CREATE TABLE IF NOT EXISTS quests (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    requirements JSONB DEFAULT '{}'::jsonb,
    rewards JSONB DEFAULT '{}'::jsonb,
    difficulty VARCHAR(20) DEFAULT 'normal',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Player quest progress
CREATE TABLE IF NOT EXISTS player_quests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    quest_id INTEGER REFERENCES quests(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'active',
    progress JSONB DEFAULT '{}'::jsonb,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(player_id, quest_id)
);

-- Guild system
CREATE TABLE IF NOT EXISTS guilds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    leader_id UUID REFERENCES players(id),
    member_count INTEGER DEFAULT 0,
    max_members INTEGER DEFAULT 50,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Guild memberships
CREATE TABLE IF NOT EXISTS guild_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guild_id UUID REFERENCES guilds(id) ON DELETE CASCADE,
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(guild_id, player_id)
);

-- Marketplace for player trading
CREATE TABLE IF NOT EXISTS marketplace_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID REFERENCES players(id) ON DELETE CASCADE,
    item_type VARCHAR(50) NOT NULL,
    item_name VARCHAR(100) NOT NULL,
    quantity INTEGER NOT NULL,
    price BIGINT NOT NULL,
    item_data JSONB DEFAULT '{}'::jsonb,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days')
);

-- Game mechanics functions

-- Function to add experience and handle level ups
CREATE OR REPLACE FUNCTION add_experience(p_player_id UUID, p_experience INTEGER)
RETURNS TABLE(new_level INTEGER, level_up BOOLEAN) AS $$
DECLARE
    current_exp INTEGER;
    current_level INTEGER;
    new_exp INTEGER;
    new_level INTEGER;
    level_up_occurred BOOLEAN := false;
BEGIN
    -- Get current stats
    SELECT experience, level INTO current_exp, current_level
    FROM players WHERE id = p_player_id;
    
    -- Calculate new experience
    new_exp := current_exp + p_experience;
    new_level := current_level;
    
    -- Check for level ups (every 1000 exp = 1 level)
    WHILE new_exp >= (new_level * 1000) LOOP
        new_level := new_level + 1;
        level_up_occurred := true;
    END LOOP;
    
    -- Update player
    UPDATE players 
    SET experience = new_exp, 
        level = new_level,
        updated_at = NOW()
    WHERE id = p_player_id;
    
    RETURN QUERY SELECT new_level, level_up_occurred;
END;
$$ LANGUAGE plpgsql;

-- Function to consume energy
CREATE OR REPLACE FUNCTION consume_energy(p_player_id UUID, p_amount INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
    current_energy INTEGER;
BEGIN
    SELECT energy INTO current_energy FROM players WHERE id = p_player_id;
    
    IF current_energy >= p_amount THEN
        UPDATE players 
        SET energy = energy - p_amount,
            updated_at = NOW()
        WHERE id = p_player_id;
        RETURN true;
    ELSE
        RETURN false;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to regenerate energy over time
CREATE OR REPLACE FUNCTION regenerate_energy()
RETURNS INTEGER AS $$
DECLARE
    updated_count INTEGER;
BEGIN
    UPDATE players 
    SET energy = LEAST(max_energy, energy + 1),
        updated_at = NOW()
    WHERE energy < max_energy 
    AND last_activity < NOW() - INTERVAL '5 minutes';
    
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- Function for player transactions
CREATE OR REPLACE FUNCTION player_transaction(
    p_player_id UUID,
    p_amount BIGINT,
    p_transaction_type VARCHAR(50)
)
RETURNS BOOLEAN AS $$
DECLARE
    current_coins BIGINT;
BEGIN
    SELECT coins INTO current_coins FROM players WHERE id = p_player_id;
    
    -- Check if player has enough coins for negative transactions
    IF p_amount < 0 AND current_coins < ABS(p_amount) THEN
        RETURN false;
    END IF;
    
    -- Update coins
    UPDATE players 
    SET coins = coins + p_amount,
        updated_at = NOW()
    WHERE id = p_player_id;
    
    RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Insert some sample data for testing

-- Sample quests
INSERT INTO quests (name, description, requirements, rewards) VALUES
('Welcome to BettaDayz', 'Complete your first login', '{"action": "login"}', '{"experience": 100, "coins": 500}'),
('Energy Master', 'Use 50 energy points', '{"energy_used": 50}', '{"experience": 200, "coins": 1000}'),
('Coin Collector', 'Earn 5000 coins', '{"coins_earned": 5000}', '{"experience": 500, "coins": 2000}');

-- Create demo player account
INSERT INTO players (username, email, level, experience, coins, energy)
VALUES ('DemoPlayer', 'demo@bettadayz.com', 5, 2500, 10000, 100)
ON CONFLICT (username) DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_players_user_id ON players(user_id);
CREATE INDEX IF NOT EXISTS idx_players_username ON players(username);
CREATE INDEX IF NOT EXISTS idx_game_sessions_player_id ON game_sessions(player_id);
CREATE INDEX IF NOT EXISTS idx_player_inventory_player_id ON player_inventory(player_id);
CREATE INDEX IF NOT EXISTS idx_player_quests_player_id ON player_quests(player_id);
CREATE INDEX IF NOT EXISTS idx_guild_members_player_id ON guild_members(player_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_seller_id ON marketplace_listings(seller_id);

-- Enable Row Level Security
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE guild_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_listings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for players table
CREATE POLICY "Users can view own player data" ON players
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own player data" ON players
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own player data" ON players
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for game_sessions
CREATE POLICY "Users can view own sessions" ON game_sessions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM players 
            WHERE players.id = game_sessions.player_id 
            AND players.user_id = auth.uid()
        )
    );

-- RLS Policies for player_inventory
CREATE POLICY "Users can manage own inventory" ON player_inventory
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM players 
            WHERE players.id = player_inventory.player_id 
            AND players.user_id = auth.uid()
        )
    );

-- RLS Policies for player_quests
CREATE POLICY "Users can manage own quests" ON player_quests
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM players 
            WHERE players.id = player_quests.player_id 
            AND players.user_id = auth.uid()
        )
    );

-- RLS Policies for guild_members
CREATE POLICY "Users can view guild members" ON guild_members
    FOR SELECT USING (true);

CREATE POLICY "Users can manage own guild membership" ON guild_members
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM players 
            WHERE players.id = guild_members.player_id 
            AND players.user_id = auth.uid()
        )
    );

-- RLS Policies for marketplace_listings
CREATE POLICY "Anyone can view marketplace" ON marketplace_listings
    FOR SELECT USING (true);

CREATE POLICY "Users can manage own listings" ON marketplace_listings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM players 
            WHERE players.id = marketplace_listings.seller_id 
            AND players.user_id = auth.uid()
        )
    );

-- Create a trigger to update updated_at automatically
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON players
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

COMMIT;
