#!/bin/bash
# Apply Canva Business migration to Supabase
# Usage: ./apply-canva-migration.sh

set -e

echo "🔧 Applying migration 002: Add Canva Business type"
echo "=============================================="

# Check if Supabase CLI is available
if ! command -v supabase &> /dev/null; then
    echo "⚠️  Supabase CLI not found. You can:"
    echo "   1. Install it: npm install -g supabase"
    echo "   2. Or manually run the SQL in Supabase Dashboard → SQL Editor"
    echo ""
    echo "📋 SQL to run manually:"
    echo "=============================================="
    cat supabase/migrations/002_add_canva_business_type.sql
    echo "=============================================="
    exit 0
fi

# Check if local Supabase is running
if supabase status &> /dev/null; then
    echo "✅ Local Supabase detected"
    echo "📤 Applying migration to local database..."
    supabase db reset
    echo "✅ Migration applied successfully!"
else
    echo "ℹ️  Local Supabase not running"
    echo "   To apply to production:"
    echo "   1. Go to your Supabase Dashboard"
    echo "   2. Navigate to SQL Editor"
    echo "   3. Paste and run this SQL:"
    echo "=============================================="
    cat supabase/migrations/002_add_canva_business_type.sql
    echo "=============================================="
fi

echo ""
echo "✅ Done! 'Canva Business' is now an allowed business type."
