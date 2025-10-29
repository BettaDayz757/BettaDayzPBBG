-- Enhanced BettaDayz PBBG Database Schema
-- Comprehensive schema for dual-domain system with all features

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- User profiles and authentication
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT,
    bio TEXT,
    avatar_url TEXT,
    title TEXT,
    level INTEGER DEFAULT 1,
    experience INTEGER DEFAULT 0,
    total_playtime INTEGER DEFAULT 0, -- in minutes
    join_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_premium BOOLEAN DEFAULT FALSE,
    premium_expires_at TIMESTAMP WITH TIME ZONE,
    privacy_settings JSONB DEFAULT '{"showLevel": true, "showStats": true, "showAchievements": true, "allowFriendRequests": true}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- BettaBuckZ currency system
CREATE TABLE bettabuckz_wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    balance BIGINT DEFAULT 0, -- stored in smallest unit (1 BB = 100 units)
    tier TEXT DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum', 'diamond')),
    total_earned BIGINT DEFAULT 0,
    total_spent BIGINT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

CREATE TABLE bettabuckz_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    wallet_id UUID REFERENCES bettabuckz_wallets(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('earn', 'spend', 'transfer_in', 'transfer_out', 'purchase', 'refund')),
    amount BIGINT NOT NULL,
    source TEXT NOT NULL, -- 'daily_login', 'achievement', 'purchase', 'gift', etc.
    description TEXT,
    reference_id UUID, -- reference to purchase, achievement, etc.
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cross-domain integration
CREATE TABLE cross_domain_integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    shop_profile JSONB DEFAULT '{}',
    store_profile JSONB DEFAULT '{}',
    sync_settings JSONB DEFAULT '{"shareCurrency": true, "shareProgress": true, "shareAchievements": true, "shareInventory": false}',
    linked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_sync_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Guild system
CREATE TABLE guilds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    tag TEXT UNIQUE NOT NULL CHECK (length(tag) >= 3 AND length(tag) <= 4),
    description TEXT,
    leader_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
    level INTEGER DEFAULT 1,
    experience INTEGER DEFAULT 0,
    member_count INTEGER DEFAULT 1,
    max_members INTEGER DEFAULT 10,
    treasury_bettabuckz BIGINT DEFAULT 0,
    treasury_game_money BIGINT DEFAULT 0,
    settings JSONB DEFAULT '{"isRecruiting": true, "minimumLevel": 1, "applicationRequired": false, "isPublic": true}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE guild_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    guild_id UUID REFERENCES guilds(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'recruit' CHECK (role IN ('leader', 'officer', 'member', 'recruit')),
    permissions TEXT[] DEFAULT ARRAY[]::TEXT[],
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    contribution_bettabuckz BIGINT DEFAULT 0,
    contribution_game_money BIGINT DEFAULT 0,
    contribution_experience INTEGER DEFAULT 0,
    UNIQUE(user_id, guild_id)
);

CREATE TABLE guild_perks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guild_id UUID REFERENCES guilds(id) ON DELETE CASCADE,
    perk_type TEXT NOT NULL CHECK (perk_type IN ('experience_boost', 'money_boost', 'member_capacity', 'treasury_capacity')),
    name TEXT NOT NULL,
    description TEXT,
    level INTEGER DEFAULT 1,
    cost INTEGER NOT NULL,
    effect DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    unlocked_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tournament system
CREATE TABLE tournaments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('pvp', 'business', 'racing', 'achievement', 'guild_war')),
    status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'registration', 'active', 'completed', 'cancelled')),
    registration_start TIMESTAMP WITH TIME ZONE NOT NULL,
    registration_end TIMESTAMP WITH TIME ZONE NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    requirements JSONB DEFAULT '{}',
    prizes JSONB DEFAULT '[]',
    rules TEXT[],
    max_participants INTEGER,
    created_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE tournament_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    guild_id UUID REFERENCES guilds(id) ON DELETE SET NULL,
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    score INTEGER DEFAULT 0,
    rank INTEGER,
    is_disqualified BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}',
    UNIQUE(tournament_id, user_id)
);

-- Seasonal events
CREATE TABLE seasonal_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    theme TEXT NOT NULL CHECK (theme IN ('halloween', 'christmas', 'summer', 'valentine', 'easter', 'new_year', 'custom')),
    type TEXT NOT NULL CHECK (type IN ('limited_time', 'seasonal', 'holiday', 'anniversary')),
    status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'ended')),
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    activities JSONB DEFAULT '[]',
    rewards JSONB DEFAULT '[]',
    special_shop JSONB DEFAULT '{}',
    leaderboard JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE user_event_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    event_id UUID REFERENCES seasonal_events(id) ON DELETE CASCADE,
    activity_id TEXT NOT NULL,
    progress INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    rewards_claimed JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, event_id, activity_id)
);

-- Achievement system
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('business', 'social', 'gaming', 'collection', 'progression', 'special')),
    type TEXT NOT NULL CHECK (type IN ('progress', 'milestone', 'secret', 'timed', 'social')),
    difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard', 'legendary')),
    requirements JSONB NOT NULL DEFAULT '[]',
    rewards JSONB NOT NULL DEFAULT '[]',
    is_hidden BOOLEAN DEFAULT FALSE,
    is_repeatable BOOLEAN DEFAULT FALSE,
    points INTEGER DEFAULT 0,
    rarity TEXT DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
    progress INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    is_notified BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- Leaderboard system
CREATE TABLE leaderboards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('global', 'weekly', 'monthly', 'seasonal', 'all_time')),
    category TEXT NOT NULL CHECK (category IN ('level', 'money', 'bettaBuckZ', 'achievements', 'social', 'business')),
    season TEXT,
    entries JSONB DEFAULT '[]',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Social system
CREATE TABLE social_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    friend_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'blocked')),
    initiated_by UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    accepted_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, friend_id),
    CHECK (user_id != friend_id)
);

CREATE TABLE social_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('achievement', 'level_up', 'purchase', 'guild_join', 'tournament_win')),
    description TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced store system
CREATE TABLE store_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('boost', 'cosmetic', 'currency', 'premium', 'equipment')),
    rarity TEXT DEFAULT 'common' CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic')),
    price_bettabuckz INTEGER,
    price_game_money INTEGER,
    price_usd_cents INTEGER,
    effects JSONB DEFAULT '{}',
    is_tradeable BOOLEAN DEFAULT TRUE,
    is_limited BOOLEAN DEFAULT FALSE,
    stock INTEGER,
    image_url TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE user_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    item_id UUID REFERENCES store_items(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    acquired_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}',
    UNIQUE(user_id, item_id)
);

CREATE TABLE user_shops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    commission_rate DECIMAL(5,2) DEFAULT 5.0,
    total_sales BIGINT DEFAULT 0,
    reputation_score DECIMAL(3,2) DEFAULT 5.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(owner_id)
);

CREATE TABLE auctions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    item_id UUID REFERENCES store_items(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    starting_bid INTEGER NOT NULL,
    current_bid INTEGER,
    buyout_price INTEGER,
    bid_increment INTEGER DEFAULT 100,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled', 'expired')),
    winner_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE auction_bids (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auction_id UUID REFERENCES auctions(id) ON DELETE CASCADE,
    bidder_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    is_autobid BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE trade_offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    initiator_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    target_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    initiator_items JSONB DEFAULT '[]',
    initiator_currency JSONB DEFAULT '{}',
    target_items JSONB DEFAULT '[]',
    target_currency JSONB DEFAULT '{}',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled', 'expired')),
    message TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- IAP and payment system
CREATE TABLE purchase_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('one_time', 'subscription', 'bundle')),
    category TEXT NOT NULL CHECK (category IN ('currency', 'premium', 'boost', 'cosmetic', 'starter', 'vip')),
    price_usd_cents INTEGER NOT NULL,
    price_eur_cents INTEGER NOT NULL,
    value JSONB NOT NULL DEFAULT '{}',
    bonus_percentage INTEGER,
    is_popular BOOLEAN DEFAULT FALSE,
    is_best_value BOOLEAN DEFAULT FALSE,
    is_limited_time BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP WITH TIME ZONE,
    image_url TEXT,
    tags TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE subscription_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    tier TEXT NOT NULL CHECK (tier IN ('basic', 'premium', 'ultimate')),
    price_monthly_cents INTEGER NOT NULL,
    price_quarterly_cents INTEGER NOT NULL,
    price_yearly_cents INTEGER NOT NULL,
    benefits JSONB DEFAULT '[]',
    savings JSONB DEFAULT '{}',
    is_popular BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    package_id UUID REFERENCES purchase_packages(id) ON DELETE SET NULL,
    subscription_id UUID REFERENCES subscription_plans(id) ON DELETE SET NULL,
    type TEXT NOT NULL CHECK (type IN ('package', 'subscription', 'renewal')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    amount_cents INTEGER NOT NULL,
    currency TEXT DEFAULT 'usd',
    payment_method TEXT NOT NULL,
    payment_provider TEXT DEFAULT 'stripe',
    external_payment_id TEXT, -- Stripe payment intent ID, Cash App payment ID, etc.
    items JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    refunded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE user_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    subscription_plan_id UUID REFERENCES subscription_plans(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'paused')),
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    auto_renew BOOLEAN DEFAULT TRUE,
    external_subscription_id TEXT, -- Stripe subscription ID
    benefits JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crypto payment system
CREATE TABLE crypto_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    purchase_id UUID REFERENCES purchases(id) ON DELETE CASCADE,
    crypto_type TEXT NOT NULL CHECK (crypto_type IN ('bitcoin', 'cashapp')),
    wallet_address TEXT,
    amount_crypto DECIMAL(18,8), -- Amount in crypto (BTC, etc.)
    amount_usd_cents INTEGER,
    exchange_rate DECIMAL(18,8),
    transaction_hash TEXT,
    confirmation_count INTEGER DEFAULT 0,
    required_confirmations INTEGER DEFAULT 3,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirming', 'confirmed', 'failed')),
    expires_at TIMESTAMP WITH TIME ZONE,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- External BTC transfer fees
CREATE TABLE btc_transfer_fees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    amount_btc DECIMAL(18,8) NOT NULL,
    fee_percentage DECIMAL(5,2) DEFAULT 2.5, -- 2.5% fee for external transfers
    fee_btc DECIMAL(18,8) NOT NULL,
    fee_usd_cents INTEGER,
    destination_address TEXT NOT NULL,
    transaction_hash TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) Policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bettabuckz_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE bettabuckz_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cross_domain_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE guild_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_event_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE auction_bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE crypto_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE btc_transfer_fees ENABLE ROW LEVEL SECURITY;

-- User profile policies
CREATE POLICY "Users can view their own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Public profiles are viewable" ON user_profiles
    FOR SELECT USING (privacy_settings->>'showLevel' = 'true');

-- BettaBuckZ wallet policies
CREATE POLICY "Users can view their own wallet" ON bettabuckz_wallets
    FOR ALL USING (user_id IN (SELECT id FROM user_profiles WHERE user_id = auth.uid()));

-- Transaction policies
CREATE POLICY "Users can view their own transactions" ON bettabuckz_transactions
    FOR SELECT USING (user_id IN (SELECT id FROM user_profiles WHERE user_id = auth.uid()));

-- Guild member policies
CREATE POLICY "Guild members can view guild data" ON guild_members
    FOR SELECT USING (guild_id IN (SELECT guild_id FROM guild_members WHERE user_id IN (SELECT id FROM user_profiles WHERE user_id = auth.uid())));

-- Purchase policies
CREATE POLICY "Users can view their own purchases" ON purchases
    FOR ALL USING (user_id IN (SELECT id FROM user_profiles WHERE user_id = auth.uid()));

-- Subscription policies
CREATE POLICY "Users can view their own subscriptions" ON user_subscriptions
    FOR ALL USING (user_id IN (SELECT id FROM user_profiles WHERE user_id = auth.uid()));

-- Indexes for performance
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_username ON user_profiles(username);
CREATE INDEX idx_bettabuckz_wallets_user_id ON bettabuckz_wallets(user_id);
CREATE INDEX idx_bettabuckz_transactions_user_id ON bettabuckz_transactions(user_id);
CREATE INDEX idx_bettabuckz_transactions_created_at ON bettabuckz_transactions(created_at);
CREATE INDEX idx_guild_members_user_id ON guild_members(user_id);
CREATE INDEX idx_guild_members_guild_id ON guild_members(guild_id);
CREATE INDEX idx_tournament_participants_tournament_id ON tournament_participants(tournament_id);
CREATE INDEX idx_tournament_participants_user_id ON tournament_participants(user_id);
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_achievement_id ON user_achievements(achievement_id);
CREATE INDEX idx_purchases_user_id ON purchases(user_id);
CREATE INDEX idx_purchases_created_at ON purchases(created_at);
CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_crypto_payments_user_id ON crypto_payments(user_id);
CREATE INDEX idx_crypto_payments_status ON crypto_payments(status);

-- Functions for automatic updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update triggers
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bettabuckz_wallets_updated_at BEFORE UPDATE ON bettabuckz_wallets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_guilds_updated_at BEFORE UPDATE ON guilds FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tournaments_updated_at BEFORE UPDATE ON tournaments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_seasonal_events_updated_at BEFORE UPDATE ON seasonal_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_achievements_updated_at BEFORE UPDATE ON achievements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_achievements_updated_at BEFORE UPDATE ON user_achievements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_store_items_updated_at BEFORE UPDATE ON store_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_shops_updated_at BEFORE UPDATE ON user_shops FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_auctions_updated_at BEFORE UPDATE ON auctions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_trade_offers_updated_at BEFORE UPDATE ON trade_offers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_purchase_packages_updated_at BEFORE UPDATE ON purchase_packages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscription_plans_updated_at BEFORE UPDATE ON subscription_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_subscriptions_updated_at BEFORE UPDATE ON user_subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_crypto_payments_updated_at BEFORE UPDATE ON crypto_payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_btc_transfer_fees_updated_at BEFORE UPDATE ON btc_transfer_fees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();