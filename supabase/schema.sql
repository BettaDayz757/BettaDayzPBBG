-- BettaDayz PBBG Database Schema
-- Run this in your Supabase SQL editor

-- Enable RLS (Row Level Security)
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  
  -- Game Stats
  level INTEGER DEFAULT 1,
  experience BIGINT DEFAULT 0,
  reputation INTEGER DEFAULT 0,
  
  -- Wallet
  wallet_coins BIGINT DEFAULT 1000,
  wallet_gems INTEGER DEFAULT 10,
  wallet_cash INTEGER DEFAULT 0, -- in cents
  
  -- Game Progress
  tutorial_completed BOOLEAN DEFAULT FALSE,
  last_daily_reward DATE,
  total_playtime INTEGER DEFAULT 0, -- minutes
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_username CHECK (length(username) >= 3 AND length(username) <= 20),
  CONSTRAINT positive_coins CHECK (wallet_coins >= 0),
  CONSTRAINT positive_gems CHECK (wallet_gems >= 0),
  CONSTRAINT positive_cash CHECK (wallet_cash >= 0)
);

-- Payment Sessions table
CREATE TABLE IF NOT EXISTS payment_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  
  -- Payment Details
  item_id TEXT NOT NULL,
  item_name TEXT,
  item_category TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  method TEXT NOT NULL, -- stripe, cashapp, bitcoin
  
  -- Session Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'verification_required', 'refunded', 'expired')),
  
  -- External References
  external_id TEXT, -- Stripe session ID, etc.
  transaction_data JSONB,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  error_message TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Purchases table (completed transactions)
CREATE TABLE IF NOT EXISTS purchases (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  
  -- Purchase Details
  item_id TEXT NOT NULL,
  item_name TEXT NOT NULL,
  item_category TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  
  -- Payment Info
  payment_method TEXT NOT NULL,
  transaction_id TEXT,
  payment_session_id UUID REFERENCES payment_sessions(id),
  
  -- Status
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Inventory table
CREATE TABLE IF NOT EXISTS inventory (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  
  -- Item Details
  item_id TEXT NOT NULL,
  item_type TEXT NOT NULL, -- vehicle, jewelry, property, etc.
  item_data JSONB DEFAULT '{}', -- customizations, stats, etc.
  
  -- Inventory Status
  quantity INTEGER DEFAULT 1,
  equipped BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  acquired_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT positive_quantity CHECK (quantity > 0),
  UNIQUE(user_id, item_id, item_type)
);

-- Leaderboards table
CREATE TABLE IF NOT EXISTS leaderboards (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  
  -- Leaderboard Info
  category TEXT NOT NULL, -- wealth, level, reputation, etc.
  score BIGINT NOT NULL DEFAULT 0,
  rank INTEGER,
  
  -- Metadata
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, category)
);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  
  -- Achievement Info
  achievement_id TEXT NOT NULL,
  achievement_name TEXT NOT NULL,
  achievement_description TEXT,
  
  -- Progress
  progress INTEGER DEFAULT 0,
  max_progress INTEGER DEFAULT 1,
  completed BOOLEAN DEFAULT FALSE,
  
  -- Rewards
  reward_coins INTEGER DEFAULT 0,
  reward_gems INTEGER DEFAULT 0,
  reward_experience INTEGER DEFAULT 0,
  
  -- Timestamps
  unlocked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, achievement_id)
);

-- Daily Rewards table
CREATE TABLE IF NOT EXISTS daily_rewards (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  
  -- Reward Details
  day INTEGER NOT NULL, -- Day in streak (1-7)
  reward_type TEXT NOT NULL, -- coins, gems, items
  reward_data JSONB NOT NULL,
  
  -- Status
  claimed BOOLEAN DEFAULT FALSE,
  claimed_at TIMESTAMP WITH TIME ZONE,
  
  -- Streak Info
  streak_day INTEGER NOT NULL,
  
  -- Timestamps
  available_at DATE NOT NULL,
  expires_at DATE NOT NULL,
  
  UNIQUE(user_id, available_at)
);

-- Game Events table
CREATE TABLE IF NOT EXISTS game_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  
  -- Event Details
  event_type TEXT NOT NULL, -- purchase, level_up, achievement, etc.
  event_data JSONB NOT NULL,
  
  -- Context
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_id TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_level ON users(level DESC);
CREATE INDEX IF NOT EXISTS idx_users_wallet_coins ON users(wallet_coins DESC);

CREATE INDEX IF NOT EXISTS idx_payment_sessions_user ON payment_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_sessions_status ON payment_sessions(status);
CREATE INDEX IF NOT EXISTS idx_payment_sessions_created ON payment_sessions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_purchases_user ON purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_created ON purchases(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_inventory_user ON inventory(user_id);
CREATE INDEX IF NOT EXISTS idx_inventory_item_type ON inventory(item_type);
CREATE INDEX IF NOT EXISTS idx_inventory_equipped ON inventory(equipped) WHERE equipped = TRUE;

CREATE INDEX IF NOT EXISTS idx_leaderboards_category ON leaderboards(category);
CREATE INDEX IF NOT EXISTS idx_leaderboards_score ON leaderboards(category, score DESC);

CREATE INDEX IF NOT EXISTS idx_achievements_user ON achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_completed ON achievements(completed) WHERE completed = TRUE;

CREATE INDEX IF NOT EXISTS idx_game_events_user ON game_events(user_id);
CREATE INDEX IF NOT EXISTS idx_game_events_type ON game_events(event_type);
CREATE INDEX IF NOT EXISTS idx_game_events_created ON game_events(created_at DESC);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users: Can read own profile, public profiles limited
CREATE POLICY "Users can read own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Public profiles viewable" ON users FOR SELECT USING (TRUE); -- Limit fields in app logic

-- Payment Sessions: Users can only see their own
CREATE POLICY "Users can view own payment sessions" ON payment_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create payment sessions" ON payment_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "System can update payment sessions" ON payment_sessions FOR UPDATE USING (TRUE);

-- Purchases: Users can only see their own
CREATE POLICY "Users can view own purchases" ON purchases FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can create purchases" ON purchases FOR INSERT WITH CHECK (TRUE);

-- Inventory: Users can only see their own
CREATE POLICY "Users can view own inventory" ON inventory FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own inventory" ON inventory FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can create inventory items" ON inventory FOR INSERT WITH CHECK (TRUE);

-- Leaderboards: Public read access
CREATE POLICY "Leaderboards are publicly readable" ON leaderboards FOR SELECT USING (TRUE);
CREATE POLICY "System can update leaderboards" ON leaderboards FOR ALL USING (TRUE);

-- Achievements: Users can see their own
CREATE POLICY "Users can view own achievements" ON achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can manage achievements" ON achievements FOR ALL USING (TRUE);

-- Daily Rewards: Users can see their own
CREATE POLICY "Users can view own daily rewards" ON daily_rewards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can claim daily rewards" ON daily_rewards FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can create daily rewards" ON daily_rewards FOR INSERT WITH CHECK (TRUE);

-- Game Events: Admin only for now
CREATE POLICY "System can manage game events" ON game_events FOR ALL USING (TRUE);

-- Functions

-- Update user's last_active timestamp
CREATE OR REPLACE FUNCTION update_user_last_active()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_active = NOW();
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating last_active
CREATE TRIGGER update_user_last_active_trigger
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_user_last_active();

-- Function to update leaderboards
CREATE OR REPLACE FUNCTION update_leaderboard(user_uuid UUID, category TEXT, new_score BIGINT)
RETURNS VOID AS $$
BEGIN
  INSERT INTO leaderboards (user_id, category, score)
  VALUES (user_uuid, category, new_score)
  ON CONFLICT (user_id, category)
  DO UPDATE SET 
    score = GREATEST(leaderboards.score, new_score),
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to add experience and handle level ups
CREATE OR REPLACE FUNCTION add_experience(user_uuid UUID, exp_amount INTEGER)
RETURNS VOID AS $$
DECLARE
  current_exp BIGINT;
  current_level INTEGER;
  new_level INTEGER;
  exp_for_next_level BIGINT;
BEGIN
  -- Get current stats
  SELECT experience, level INTO current_exp, current_level
  FROM users WHERE id = user_uuid;
  
  -- Add experience
  current_exp := current_exp + exp_amount;
  
  -- Calculate new level (simple formula: level = sqrt(exp / 1000))
  new_level := FLOOR(SQRT(current_exp / 1000.0)) + 1;
  
  -- Update user
  UPDATE users 
  SET experience = current_exp, level = new_level
  WHERE id = user_uuid;
  
  -- Update leaderboards
  PERFORM update_leaderboard(user_uuid, 'level', new_level);
  PERFORM update_leaderboard(user_uuid, 'experience', current_exp);
END;
$$ LANGUAGE plpgsql;

-- Insert initial user data trigger
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, email, username)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substring(NEW.id::text, 1, 8))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_profile();