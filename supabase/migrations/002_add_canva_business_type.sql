-- Migration: Add 'Canva Business' to allowed business types
-- Created: 2025-10-30

-- This migration updates the CHECK constraint on public.businesses.type
-- to include 'Canva Business'. If the constraint already exists, we drop
-- and recreate it with the expanded set of allowed values.

ALTER TABLE public.businesses
  DROP CONSTRAINT IF EXISTS valid_business_type;

ALTER TABLE public.businesses
  ADD CONSTRAINT valid_business_type CHECK (
    type IN (
      'Barbershop',
      'Soul Food Restaurant',
      'Music Studio',
      'Fashion/Streetwear',
      'Tech Startup',
      'Real Estate',
      'Community Center',
      'HBCU Partnership',
      'Canva Business',
      'Other'
    )
  );
