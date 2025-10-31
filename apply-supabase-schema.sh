#!/bin/bash
# Apply Supabase Schema via CLI

echo "🗄️  Applying Supabase Database Schema"
echo "======================================"
echo ""

SUPABASE_PROJECT_REF="dqirldrlusrmodkwlnqy"
MIGRATION_FILE="supabase/migrations/001_initial_schema.sql"

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "Installing Supabase CLI..."
    npm install -g supabase
fi

echo "Linking to Supabase project..."
supabase link --project-ref "$SUPABASE_PROJECT_REF"

if [ $? -eq 0 ]; then
    echo ""
    echo "Pushing database migrations..."
    supabase db push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Database schema applied successfully!"
        echo ""
        echo "Next steps:"
        echo "1. Configure Auth settings in Supabase Dashboard"
        echo "2. Test database connection at /todos route"
        echo ""
    else
        echo ""
        echo "❌ Failed to push migrations"
        echo ""
        echo "Alternative: Apply manually via Supabase Dashboard"
        echo "1. Go to: https://supabase.com/dashboard/project/$SUPABASE_PROJECT_REF"
        echo "2. Click 'SQL Editor' → 'New Query'"
        echo "3. Copy/paste contents of: $MIGRATION_FILE"
        echo "4. Click 'Run'"
    fi
else
    echo ""
    echo "❌ Failed to link project"
    echo ""
    echo "Please apply schema manually:"
    echo "1. Go to: https://supabase.com/dashboard/project/$SUPABASE_PROJECT_REF"
    echo "2. Click 'SQL Editor' → 'New Query'"
    echo "3. Copy/paste contents of: $MIGRATION_FILE"
    echo "4. Click 'Run'"
fi
