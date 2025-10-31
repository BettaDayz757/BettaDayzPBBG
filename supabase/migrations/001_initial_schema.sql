-- BettaDayz PBBG Database Schema
-- Norfolk, VA Business Empire Game
-- Created: 2025-10-30

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PLAYERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100),
    age INTEGER DEFAULT 18 CHECK (age >= 18 AND age <= 85),
    email VARCHAR(255) UNIQUE NOT NULL,
    
    -- Character Stats
    reputation INTEGER DEFAULT 0,
    cash DECIMAL(15, 2) DEFAULT 1000.00,
    bank_balance DECIMAL(15, 2) DEFAULT 0.00,
    level INTEGER DEFAULT 1,
    experience INTEGER DEFAULT 0,
    
    -- Location
    current_location VARCHAR(100) DEFAULT 'Downtown Norfolk',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    
    -- Profile
    avatar_url TEXT,
    bio TEXT,
    
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- =====================================================
-- BUSINESSES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES public.players(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    type VARCHAR(100) NOT NULL,
    
    -- Business Details
    location VARCHAR(100) NOT NULL,
    description TEXT,
    level INTEGER DEFAULT 1,
    
    -- Financials
    daily_revenue DECIMAL(15, 2) DEFAULT 0.00,
    daily_expenses DECIMAL(15, 2) DEFAULT 0.00,
    total_revenue DECIMAL(15, 2) DEFAULT 0.00,
    total_profit DECIMAL(15, 2) DEFAULT 0.00,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    employees_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_business_type CHECK (type IN (
        'Barbershop', 'Soul Food Restaurant', 'Music Studio', 
        'Fashion/Streetwear', 'Tech Startup', 'Real Estate',
        'Community Center', 'HBCU Partnership', 'Other'
    ))
);

-- =====================================================
-- PRODUCTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    
    -- Pricing
    price DECIMAL(10, 2) NOT NULL,
    cost DECIMAL(10, 2) NOT NULL,
    
    -- Inventory
    stock INTEGER DEFAULT 0,
    max_stock INTEGER DEFAULT 100,
    
    -- Status
    is_available BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_price CHECK (price >= 0),
    CONSTRAINT valid_cost CHECK (cost >= 0),
    CONSTRAINT valid_stock CHECK (stock >= 0)
);

-- =====================================================
-- TRANSACTIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES public.players(id) ON DELETE CASCADE,
    business_id UUID REFERENCES public.businesses(id) ON DELETE SET NULL,
    
    -- Transaction Details
    type VARCHAR(50) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    description TEXT,
    
    -- Status
    status VARCHAR(50) DEFAULT 'completed',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_transaction_type CHECK (type IN (
        'purchase', 'sale', 'salary', 'investment', 
        'expense', 'revenue', 'transfer', 'other'
    )),
    CONSTRAINT valid_status CHECK (status IN (
        'pending', 'completed', 'failed', 'refunded'
    ))
);

-- =====================================================
-- CREWS TABLE (Gang/Group System)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.crews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) UNIQUE NOT NULL,
    tag VARCHAR(10) UNIQUE NOT NULL,
    description TEXT,
    
    -- Leadership
    leader_id UUID REFERENCES public.players(id) ON DELETE SET NULL,
    
    -- Stats
    reputation INTEGER DEFAULT 0,
    territory_count INTEGER DEFAULT 0,
    member_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_tag_length CHECK (LENGTH(tag) BETWEEN 2 AND 10)
);

-- =====================================================
-- CREW MEMBERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.crew_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    crew_id UUID REFERENCES public.crews(id) ON DELETE CASCADE,
    player_id UUID REFERENCES public.players(id) ON DELETE CASCADE,
    
    -- Role
    role VARCHAR(50) DEFAULT 'member',
    
    -- Timestamps
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(crew_id, player_id),
    CONSTRAINT valid_crew_role CHECK (role IN (
        'leader', 'officer', 'veteran', 'member', 'recruit'
    ))
);

-- =====================================================
-- LOCATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) UNIQUE NOT NULL,
    type VARCHAR(100) NOT NULL,
    description TEXT,
    
    -- Details
    controlled_by UUID REFERENCES public.crews(id) ON DELETE SET NULL,
    business_opportunities JSONB DEFAULT '[]'::jsonb,
    
    -- Status
    is_available BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_location_type CHECK (type IN (
        'Downtown Norfolk', 'Norfolk State District', 'Berkley',
        'Ocean View', 'Military Circle', 'Ghent', 
        'Park Place', 'Churchland'
    ))
);

-- =====================================================
-- TODOS TABLE (Example/Testing)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.todos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES public.players(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES for Performance
-- =====================================================

-- Players indexes
CREATE INDEX IF NOT EXISTS idx_players_user_id ON public.players(user_id);
CREATE INDEX IF NOT EXISTS idx_players_username ON public.players(username);
CREATE INDEX IF NOT EXISTS idx_players_level ON public.players(level);

-- Businesses indexes
CREATE INDEX IF NOT EXISTS idx_businesses_owner ON public.businesses(owner_id);
CREATE INDEX IF NOT EXISTS idx_businesses_location ON public.businesses(location);
CREATE INDEX IF NOT EXISTS idx_businesses_type ON public.businesses(type);

-- Products indexes
CREATE INDEX IF NOT EXISTS idx_products_business ON public.products(business_id);
CREATE INDEX IF NOT EXISTS idx_products_available ON public.products(is_available);

-- Transactions indexes
CREATE INDEX IF NOT EXISTS idx_transactions_player ON public.transactions(player_id);
CREATE INDEX IF NOT EXISTS idx_transactions_business ON public.transactions(business_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created ON public.transactions(created_at);

-- Crews indexes
CREATE INDEX IF NOT EXISTS idx_crews_leader ON public.crews(leader_id);
CREATE INDEX IF NOT EXISTS idx_crew_members_crew ON public.crew_members(crew_id);
CREATE INDEX IF NOT EXISTS idx_crew_members_player ON public.crew_members(player_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crew_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

-- Players policies
CREATE POLICY "Players can view their own profile" 
    ON public.players FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Players can update their own profile" 
    ON public.players FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public player profiles" 
    ON public.players FOR SELECT 
    USING (true);

-- Businesses policies
CREATE POLICY "Players can view all businesses" 
    ON public.businesses FOR SELECT 
    USING (true);

CREATE POLICY "Players can manage their own businesses" 
    ON public.businesses FOR ALL 
    USING (owner_id IN (SELECT id FROM public.players WHERE user_id = auth.uid()));

-- Products policies
CREATE POLICY "Anyone can view available products" 
    ON public.products FOR SELECT 
    USING (is_available = true);

-- Transactions policies
CREATE POLICY "Players can view their own transactions" 
    ON public.transactions FOR SELECT 
    USING (player_id IN (SELECT id FROM public.players WHERE user_id = auth.uid()));

-- Crews policies
CREATE POLICY "Anyone can view crews" 
    ON public.crews FOR SELECT 
    USING (true);

CREATE POLICY "Crew leaders can manage their crews" 
    ON public.crews FOR ALL 
    USING (leader_id IN (SELECT id FROM public.players WHERE user_id = auth.uid()));

-- Locations policies
CREATE POLICY "Anyone can view locations" 
    ON public.locations FOR SELECT 
    USING (true);

-- Todos policies
CREATE POLICY "Players can manage their own todos" 
    ON public.todos FOR ALL 
    USING (player_id IN (SELECT id FROM public.players WHERE user_id = auth.uid()));

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Update updated_at timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables
CREATE TRIGGER update_players_updated_at 
    BEFORE UPDATE ON public.players 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_businesses_updated_at 
    BEFORE UPDATE ON public.businesses 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON public.products 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crews_updated_at 
    BEFORE UPDATE ON public.crews 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_locations_updated_at 
    BEFORE UPDATE ON public.locations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_todos_updated_at 
    BEFORE UPDATE ON public.todos 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SEED DATA (Optional - Norfolk Locations)
-- =====================================================

INSERT INTO public.locations (name, type, description, is_available) VALUES
    ('Downtown Norfolk', 'Downtown Norfolk', 'Historic Black Wall Street revival area with prime business opportunities', true),
    ('Norfolk State University Campus', 'Norfolk State District', 'Premier HBCU campus and innovation hub', true),
    ('Berkley Historic District', 'Berkley', 'Historic African American neighborhood renaissance', true),
    ('Ocean View Beach', 'Ocean View', 'Beach community with rich cultural heritage', true),
    ('Military Circle Mall Area', 'Military Circle', 'Commercial hub near Naval Station Norfolk', true),
    ('Ghent Arts District', 'Ghent', 'Arts and culture district with creative opportunities', true),
    ('Park Place Community', 'Park Place', 'Family business community center', true),
    ('Churchland Community Center', 'Churchland', 'Spiritual and community gathering place', true)
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE public.players IS 'Main player/user profiles with character stats and progression';
COMMENT ON TABLE public.businesses IS 'Player-owned businesses across Norfolk locations';
COMMENT ON TABLE public.products IS 'Products/services offered by businesses';
COMMENT ON TABLE public.transactions IS 'Financial transaction history';
COMMENT ON TABLE public.crews IS 'Player groups/gangs with territory control';
COMMENT ON TABLE public.locations IS 'Norfolk, VA locations available for business and gameplay';
COMMENT ON TABLE public.todos IS 'Simple todo list for testing and player task management';