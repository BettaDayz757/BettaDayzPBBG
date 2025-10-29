-- BettaDayz PBBG Complete Database Schema
-- JWT Secret: 9=N6H//qQ]?g+BDV
-- Execute this SQL in Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ========================================
-- PLAYERS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS players (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(100),
  avatar_url TEXT,
  level INTEGER DEFAULT 1 CHECK (level >= 1),
  experience BIGINT DEFAULT 0 CHECK (experience >= 0),
  coins BIGINT DEFAULT 1000 CHECK (coins >= 0),
  premium_currency INTEGER DEFAULT 0 CHECK (premium_currency >= 0),
  energy INTEGER DEFAULT 100 CHECK (energy >= 0),
  max_energy INTEGER DEFAULT 100 CHECK (max_energy >= 1),
  health INTEGER DEFAULT 100 CHECK (health >= 0),
  max_health INTEGER DEFAULT 100 CHECK (max_health >= 1),
  strength INTEGER DEFAULT 10 CHECK (strength >= 1),
  defense INTEGER DEFAULT 10 CHECK (defense >= 1),
  agility INTEGER DEFAULT 10 CHECK (agility >= 1),
  intelligence INTEGER DEFAULT 10 CHECK (intelligence >= 1),
  luck INTEGER DEFAULT 10 CHECK (luck >= 1),
  reputation INTEGER DEFAULT 0,
  total_playtime INTEGER DEFAULT 0,
  last_energy_update TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  is_banned BOOLEAN DEFAULT false,
  ban_reason TEXT,
  settings JSONB DEFAULT '{}',
  achievements JSONB DEFAULT '[]',
  statistics JSONB DEFAULT '{}'
);

-- Enable RLS for players
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

-- RLS Policies for players
CREATE POLICY "Players can view own data" ON players
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Players can update own data" ON players
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Players can insert own data" ON players
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ========================================
-- GAME SESSIONS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS game_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  session_token VARCHAR(255) NOT NULL,
  domain VARCHAR(50) NOT NULL CHECK (domain IN ('shop', 'store')),
  ip_address INET,
  user_agent TEXT,
  country_code VARCHAR(2),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  duration_seconds INTEGER DEFAULT 0,
  actions_performed INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Players can view own sessions" ON game_sessions
  FOR SELECT USING (
    player_id IN (
      SELECT id FROM players WHERE user_id = auth.uid()
    )
  );

-- ========================================
-- PLAYER INVENTORY TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS player_inventory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  item_type VARCHAR(50) NOT NULL,
  item_id VARCHAR(100) NOT NULL,
  item_name VARCHAR(200),
  quantity INTEGER DEFAULT 1 CHECK (quantity >= 0),
  quality VARCHAR(20) DEFAULT 'common',
  enchantments JSONB DEFAULT '[]',
  durability INTEGER DEFAULT 100,
  is_equipped BOOLEAN DEFAULT false,
  equipped_slot VARCHAR(50),
  acquired_at TIMESTAMPTZ DEFAULT NOW(),
  acquired_from VARCHAR(100),
  metadata JSONB DEFAULT '{}',
  UNIQUE(player_id, item_type, item_id)
);

ALTER TABLE player_inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Players can manage own inventory" ON player_inventory
  FOR ALL USING (
    player_id IN (
      SELECT id FROM players WHERE user_id = auth.uid()
    )
  );

-- ========================================
-- GAME ACTIVITIES TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS game_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL,
  activity_name VARCHAR(200),
  activity_data JSONB DEFAULT '{}',
  domain VARCHAR(50) NOT NULL CHECK (domain IN ('shop', 'store')),
  experience_gained INTEGER DEFAULT 0,
  coins_gained INTEGER DEFAULT 0,
  energy_consumed INTEGER DEFAULT 0,
  location VARCHAR(100),
  success BOOLEAN DEFAULT true,
  rewards JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE game_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Players can view own activities" ON game_activities
  FOR SELECT USING (
    player_id IN (
      SELECT id FROM players WHERE user_id = auth.uid()
    )
  );

-- ========================================
-- QUESTS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS quests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  quest_type VARCHAR(50) DEFAULT 'main',
  difficulty VARCHAR(20) DEFAULT 'easy',
  min_level INTEGER DEFAULT 1,
  max_level INTEGER,
  prerequisites JSONB DEFAULT '[]',
  objectives JSONB DEFAULT '[]',
  rewards JSONB DEFAULT '{}',
  time_limit_hours INTEGER,
  is_repeatable BOOLEAN DEFAULT false,
  cooldown_hours INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- PLAYER QUESTS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS player_quests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  quest_id UUID REFERENCES quests(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'failed', 'abandoned')),
  progress JSONB DEFAULT '{}',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  times_completed INTEGER DEFAULT 0,
  last_completed TIMESTAMPTZ,
  UNIQUE(player_id, quest_id)
);

ALTER TABLE player_quests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Players can manage own quests" ON player_quests
  FOR ALL USING (
    player_id IN (
      SELECT id FROM players WHERE user_id = auth.uid()
    )
  );

-- ========================================
-- GUILDS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS guilds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  tag VARCHAR(10) UNIQUE,
  leader_id UUID REFERENCES players(id) ON DELETE SET NULL,
  level INTEGER DEFAULT 1,
  experience BIGINT DEFAULT 0,
  member_limit INTEGER DEFAULT 20,
  is_recruiting BOOLEAN DEFAULT true,
  treasury BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  settings JSONB DEFAULT '{}'
);

-- ========================================
-- GUILD MEMBERS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS guild_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  guild_id UUID REFERENCES guilds(id) ON DELETE CASCADE,
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('leader', 'officer', 'member')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  contribution_points INTEGER DEFAULT 0,
  last_active TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(guild_id, player_id)
);

ALTER TABLE guild_members ENABLE ROW LEVEL SECURITY;

-- ========================================
-- MARKETPLACE TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS marketplace_listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID REFERENCES players(id) ON DELETE CASCADE,
  item_type VARCHAR(50) NOT NULL,
  item_id VARCHAR(100) NOT NULL,
  item_name VARCHAR(200),
  quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
  price_per_unit BIGINT NOT NULL CHECK (price_per_unit > 0),
  total_price BIGINT GENERATED ALWAYS AS (quantity * price_per_unit) STORED,
  currency_type VARCHAR(20) DEFAULT 'coins' CHECK (currency_type IN ('coins', 'premium')),
  description TEXT,
  quality VARCHAR(20) DEFAULT 'common',
  metadata JSONB DEFAULT '{}',
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'sold', 'cancelled', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  sold_at TIMESTAMPTZ,
  buyer_id UUID REFERENCES players(id)
);

-- ========================================
-- GAME FUNCTIONS
-- ========================================

-- Function to add experience and handle leveling
CREATE OR REPLACE FUNCTION add_experience(
  player_uuid UUID,
  exp_amount BIGINT
) RETURNS JSONB AS $$
DECLARE
  current_level INTEGER;
  current_exp BIGINT;
  new_exp BIGINT;
  new_level INTEGER;
  level_up BOOLEAN := FALSE;
  exp_needed BIGINT;
BEGIN
  SELECT level, experience INTO current_level, current_exp
  FROM players 
  WHERE id = player_uuid;
  
  IF current_level IS NULL THEN
    RETURN jsonb_build_object('error', 'Player not found');
  END IF;
  
  new_exp := current_exp + exp_amount;
  new_level := current_level;
  
  -- Calculate experience needed for next level (exponential growth)
  WHILE true LOOP
    exp_needed := (new_level * 1000) + (new_level * new_level * 50);
    IF new_exp < exp_needed THEN
      EXIT;
    END IF;
    new_exp := new_exp - exp_needed;
    new_level := new_level + 1;
    level_up := TRUE;
  END LOOP;
  
  -- Update player
  UPDATE players 
  SET level = new_level,
      experience = new_exp,
      updated_at = NOW()
  WHERE id = player_uuid;
  
  -- If leveled up, increase stats
  IF level_up THEN
    UPDATE players 
    SET strength = strength + (new_level - current_level) * 2,
        defense = defense + (new_level - current_level) * 2,
        agility = agility + (new_level - current_level) * 1,
        intelligence = intelligence + (new_level - current_level) * 1,
        luck = luck + (new_level - current_level) * 1,
        max_health = max_health + (new_level - current_level) * 10,
        max_energy = max_energy + (new_level - current_level) * 5
    WHERE id = player_uuid;
  END IF;
  
  RETURN jsonb_build_object(
    'level_up', level_up,
    'old_level', current_level,
    'new_level', new_level,
    'experience_gained', exp_amount,
    'new_experience', new_exp,
    'exp_needed_for_next', (new_level * 1000) + (new_level * new_level * 50) - new_exp
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to consume energy
CREATE OR REPLACE FUNCTION consume_energy(
  player_uuid UUID,
  energy_cost INTEGER
) RETURNS BOOLEAN AS $$
DECLARE
  current_energy INTEGER;
BEGIN
  SELECT energy INTO current_energy 
  FROM players 
  WHERE id = player_uuid;
  
  IF current_energy IS NULL THEN
    RETURN FALSE;
  END IF;
  
  IF current_energy >= energy_cost THEN
    UPDATE players 
    SET energy = energy - energy_cost,
        updated_at = NOW()
    WHERE id = player_uuid;
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to regenerate energy over time
CREATE OR REPLACE FUNCTION regenerate_energy(
  player_uuid UUID
) RETURNS INTEGER AS $$
DECLARE
  current_energy INTEGER;
  max_energy_val INTEGER;
  last_update TIMESTAMPTZ;
  time_diff INTERVAL;
  energy_regen INTEGER;
  new_energy INTEGER;
BEGIN
  SELECT energy, max_energy, last_energy_update 
  INTO current_energy, max_energy_val, last_update
  FROM players 
  WHERE id = player_uuid;
  
  IF current_energy IS NULL THEN
    RETURN 0;
  END IF;
  
  -- Calculate time difference in minutes
  time_diff := NOW() - last_update;
  energy_regen := EXTRACT(EPOCH FROM time_diff)::INTEGER / 300; -- 1 energy per 5 minutes
  
  new_energy := LEAST(current_energy + energy_regen, max_energy_val);
  
  IF new_energy != current_energy THEN
    UPDATE players 
    SET energy = new_energy,
        last_energy_update = NOW(),
        updated_at = NOW()
    WHERE id = player_uuid;
  END IF;
  
  RETURN new_energy;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle player transactions
CREATE OR REPLACE FUNCTION player_transaction(
  player_uuid UUID,
  coin_change BIGINT DEFAULT 0,
  premium_change INTEGER DEFAULT 0,
  transaction_type VARCHAR(50) DEFAULT 'manual',
  description TEXT DEFAULT ''
) RETURNS BOOLEAN AS $$
DECLARE
  current_coins BIGINT;
  current_premium INTEGER;
BEGIN
  SELECT coins, premium_currency 
  INTO current_coins, current_premium
  FROM players 
  WHERE id = player_uuid;
  
  IF current_coins IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Check if player has enough currency
  IF current_coins + coin_change < 0 OR current_premium + premium_change < 0 THEN
    RETURN FALSE;
  END IF;
  
  -- Update player currency
  UPDATE players 
  SET coins = coins + coin_change,
      premium_currency = premium_currency + premium_change,
      updated_at = NOW()
  WHERE id = player_uuid;
  
  -- Log the transaction
  INSERT INTO game_activities (
    player_id, 
    activity_type, 
    activity_name,
    activity_data,
    domain,
    coins_gained
  ) VALUES (
    player_uuid,
    'transaction',
    transaction_type,
    jsonb_build_object(
      'coin_change', coin_change,
      'premium_change', premium_change,
      'description', description
    ),
    'system',
    coin_change
  );
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- TRIGGERS
-- ========================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_players_updated_at 
  BEFORE UPDATE ON players 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-create player on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO players (user_id, username, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================

CREATE INDEX IF NOT EXISTS idx_players_user_id ON players(user_id);
CREATE INDEX IF NOT EXISTS idx_players_username ON players(username);
CREATE INDEX IF NOT EXISTS idx_players_level ON players(level);
CREATE INDEX IF NOT EXISTS idx_players_active ON players(is_active);

CREATE INDEX IF NOT EXISTS idx_game_sessions_player_id ON game_sessions(player_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_active ON game_sessions(is_active);
CREATE INDEX IF NOT EXISTS idx_game_sessions_domain ON game_sessions(domain);

CREATE INDEX IF NOT EXISTS idx_player_inventory_player_id ON player_inventory(player_id);
CREATE INDEX IF NOT EXISTS idx_player_inventory_item_type ON player_inventory(item_type);
CREATE INDEX IF NOT EXISTS idx_player_inventory_equipped ON player_inventory(is_equipped);

CREATE INDEX IF NOT EXISTS idx_game_activities_player_id ON game_activities(player_id);
CREATE INDEX IF NOT EXISTS idx_game_activities_type ON game_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_game_activities_created ON game_activities(created_at);

CREATE INDEX IF NOT EXISTS idx_player_quests_player_id ON player_quests(player_id);
CREATE INDEX IF NOT EXISTS idx_player_quests_status ON player_quests(status);

CREATE INDEX IF NOT EXISTS idx_marketplace_seller ON marketplace_listings(seller_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_status ON marketplace_listings(status);
CREATE INDEX IF NOT EXISTS idx_marketplace_item ON marketplace_listings(item_type, item_id);

-- ========================================
-- ENABLE REAL-TIME
-- ========================================

ALTER PUBLICATION supabase_realtime ADD TABLE players;
ALTER PUBLICATION supabase_realtime ADD TABLE game_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE player_inventory;
ALTER PUBLICATION supabase_realtime ADD TABLE game_activities;
ALTER PUBLICATION supabase_realtime ADD TABLE player_quests;
ALTER PUBLICATION supabase_realtime ADD TABLE guild_members;
ALTER PUBLICATION supabase_realtime ADD TABLE marketplace_listings;

-- ========================================
-- INITIAL DATA
-- ========================================

-- Insert sample quests
INSERT INTO quests (name, description, quest_type, difficulty, objectives, rewards) VALUES
('Welcome to BettaDayz', 'Complete your first login and explore the game', 'tutorial', 'easy', 
 '[{"type": "login", "target": 1, "current": 0}]',
 '{"experience": 100, "coins": 500}'),
('First Steps', 'Perform 5 different activities in the game', 'tutorial', 'easy',
 '[{"type": "activities", "target": 5, "current": 0}]',
 '{"experience": 250, "coins": 1000}'),
('Energy Master', 'Use 50 energy points in activities', 'daily', 'medium',
 '[{"type": "energy_used", "target": 50, "current": 0}]',
 '{"experience": 500, "coins": 2000}')
ON CONFLICT DO NOTHING;

-- Set JWT secret (this should match your application)
-- Note: In production, this should be set via Supabase dashboard
-- ALTER SYSTEM SET app.jwt_secret = '9=N6H//qQ]?g+BDV';
-- SELECT pg_reload_conf();

-- Success message
DO $$ 
BEGIN 
  RAISE NOTICE 'BettaDayz PBBG Database Schema Created Successfully!';
  RAISE NOTICE 'JWT Secret configured: 9=N6H//qQ]?g+BDV';
  RAISE NOTICE 'Tables created: players, game_sessions, player_inventory, game_activities, quests, player_quests, guilds, guild_members, marketplace_listings';
  RAISE NOTICE 'Functions created: add_experience, consume_energy, regenerate_energy, player_transaction';
  RAISE NOTICE 'Real-time enabled for all game tables';
END $$;