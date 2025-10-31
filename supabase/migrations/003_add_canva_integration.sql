-- Migration: Add Canva Integration Tables
-- Created: 2025-10-30
-- Purpose: Store Canva designs, credentials, and publish history for dual-domain workflow

-- =====================================================
-- Table: canva_designs
-- Stores Canva design metadata and links
-- =====================================================
CREATE TABLE IF NOT EXISTS public.canva_designs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id UUID REFERENCES public.businesses(id) ON DELETE SET NULL,
  
  -- Canva API Fields
  canva_design_id TEXT UNIQUE NOT NULL,
  design_title TEXT NOT NULL,
  design_type TEXT CHECK (design_type IN ('presentation', 'document', 'social_media', 'logo', 'banner', 'other')),
  design_url TEXT NOT NULL, -- Canva edit URL
  thumbnail_url TEXT,
  
  -- Domain Association
  target_domain TEXT CHECK (target_domain IN ('bettadayz.shop', 'bettadayz.store', 'both')),
  publish_path TEXT, -- Where to publish on the domain (e.g., '/assets/images/hero.png')
  
  -- Status and Versioning
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'editing', 'ready', 'published', 'archived')),
  version INTEGER DEFAULT 1,
  last_edited_at TIMESTAMPTZ,
  
  -- Metadata
  tags TEXT[], -- For categorization
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- Table: canva_credentials
-- Stores user OAuth tokens for Canva API access
-- =====================================================
CREATE TABLE IF NOT EXISTS public.canva_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- OAuth Tokens (encrypted in production)
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  
  -- Canva User Info
  canva_user_id TEXT,
  canva_email TEXT,
  
  -- Permissions
  scopes TEXT[], -- Granted OAuth scopes
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  last_refreshed_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- Table: canva_publish_history
-- Tracks all publish events from local → Supabase → Canva → Domains
-- =====================================================
CREATE TABLE IF NOT EXISTS public.canva_publish_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  design_id UUID REFERENCES public.canva_designs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Publish Details
  publish_type TEXT CHECK (publish_type IN ('export', 'publish', 'sync', 'deploy')),
  target_domain TEXT, -- 'bettadayz.shop', 'bettadayz.store', or 'both'
  publish_url TEXT, -- Final deployed URL
  
  -- Export Details
  export_format TEXT CHECK (export_format IN ('png', 'jpg', 'pdf', 'svg', 'mp4', 'gif')),
  export_quality TEXT CHECK (export_quality IN ('low', 'medium', 'high', 'original')),
  file_size_bytes BIGINT,
  file_url TEXT, -- Supabase storage URL
  
  -- Workflow Status
  workflow_status TEXT DEFAULT 'initiated' CHECK (
    workflow_status IN ('initiated', 'downloading', 'uploading', 'deploying', 'completed', 'failed')
  ),
  error_message TEXT,
  
  -- Performance Metrics
  duration_ms INTEGER, -- Time taken for the operation
  
  -- Timestamps
  published_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- =====================================================
-- Table: canva_domain_assets
-- Maps Canva designs to specific asset locations on each domain
-- =====================================================
CREATE TABLE IF NOT EXISTS public.canva_domain_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  design_id UUID REFERENCES public.canva_designs(id) ON DELETE CASCADE,
  
  -- Domain Mapping
  domain TEXT NOT NULL CHECK (domain IN ('bettadayz.shop', 'bettadayz.store')),
  asset_path TEXT NOT NULL, -- e.g., '/images/hero/main-banner.png'
  asset_type TEXT CHECK (asset_type IN ('image', 'video', 'document', 'svg')),
  
  -- Asset Metadata
  width INTEGER,
  height INTEGER,
  file_size_bytes BIGINT,
  cdn_url TEXT, -- Cloudflare CDN URL
  
  -- Version Control
  version INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  replaced_by UUID REFERENCES public.canva_domain_assets(id), -- Link to newer version
  
  -- Timestamps
  deployed_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ, -- For temporary assets
  
  UNIQUE(domain, asset_path, version)
);

-- =====================================================
-- Indexes for Performance
-- =====================================================
CREATE INDEX idx_canva_designs_user ON public.canva_designs(user_id);
CREATE INDEX idx_canva_designs_business ON public.canva_designs(business_id);
CREATE INDEX idx_canva_designs_status ON public.canva_designs(status);
CREATE INDEX idx_canva_designs_domain ON public.canva_designs(target_domain);
CREATE INDEX idx_canva_designs_canva_id ON public.canva_designs(canva_design_id);

CREATE INDEX idx_canva_credentials_user ON public.canva_credentials(user_id);
CREATE INDEX idx_canva_credentials_active ON public.canva_credentials(is_active);

CREATE INDEX idx_canva_publish_history_design ON public.canva_publish_history(design_id);
CREATE INDEX idx_canva_publish_history_user ON public.canva_publish_history(user_id);
CREATE INDEX idx_canva_publish_history_published_at ON public.canva_publish_history(published_at DESC);

CREATE INDEX idx_canva_domain_assets_design ON public.canva_domain_assets(design_id);
CREATE INDEX idx_canva_domain_assets_domain ON public.canva_domain_assets(domain);
CREATE INDEX idx_canva_domain_assets_active ON public.canva_domain_assets(is_active);

-- =====================================================
-- Row Level Security (RLS) Policies
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.canva_designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.canva_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.canva_publish_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.canva_domain_assets ENABLE ROW LEVEL SECURITY;

-- Designs: Users can only access their own designs
CREATE POLICY "Users can view their own designs"
  ON public.canva_designs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own designs"
  ON public.canva_designs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own designs"
  ON public.canva_designs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own designs"
  ON public.canva_designs FOR DELETE
  USING (auth.uid() = user_id);

-- Credentials: Users can only access their own credentials
CREATE POLICY "Users can view their own credentials"
  ON public.canva_credentials FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own credentials"
  ON public.canva_credentials FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own credentials"
  ON public.canva_credentials FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own credentials"
  ON public.canva_credentials FOR DELETE
  USING (auth.uid() = user_id);

-- Publish History: Users can view their own publish history
CREATE POLICY "Users can view their own publish history"
  ON public.canva_publish_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own publish history"
  ON public.canva_publish_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Domain Assets: Public read, authenticated users can manage
CREATE POLICY "Public can view active domain assets"
  ON public.canva_domain_assets FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can insert domain assets"
  ON public.canva_domain_assets FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update domain assets"
  ON public.canva_domain_assets FOR UPDATE
  TO authenticated
  USING (true);

-- =====================================================
-- Functions for Automation
-- =====================================================

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_canva_designs_updated_at
  BEFORE UPDATE ON public.canva_designs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_canva_credentials_updated_at
  BEFORE UPDATE ON public.canva_credentials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function: Archive old design versions
CREATE OR REPLACE FUNCTION archive_old_design_versions()
RETURNS TRIGGER AS $$
BEGIN
  -- When a new version is published, archive the old one
  UPDATE public.canva_designs
  SET status = 'archived'
  WHERE canva_design_id = NEW.canva_design_id
    AND version < NEW.version
    AND status != 'archived';
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER archive_old_versions_trigger
  AFTER INSERT ON public.canva_designs
  FOR EACH ROW
  EXECUTE FUNCTION archive_old_design_versions();

-- Function: Mark old domain assets as inactive when new version is deployed
CREATE OR REPLACE FUNCTION deactivate_old_domain_assets()
RETURNS TRIGGER AS $$
BEGIN
  -- Mark previous versions inactive
  UPDATE public.canva_domain_assets
  SET is_active = false,
      replaced_by = NEW.id
  WHERE design_id = NEW.design_id
    AND domain = NEW.domain
    AND asset_path = NEW.asset_path
    AND version < NEW.version
    AND id != NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER deactivate_old_assets_trigger
  AFTER INSERT ON public.canva_domain_assets
  FOR EACH ROW
  EXECUTE FUNCTION deactivate_old_domain_assets();

-- =====================================================
-- Sample Data and Comments
-- =====================================================

COMMENT ON TABLE public.canva_designs IS 'Stores Canva design metadata for local editing and publishing workflow';
COMMENT ON TABLE public.canva_credentials IS 'OAuth credentials for Canva API access per user';
COMMENT ON TABLE public.canva_publish_history IS 'Complete audit trail of all publish operations';
COMMENT ON TABLE public.canva_domain_assets IS 'Maps Canva designs to deployed assets on each domain';
