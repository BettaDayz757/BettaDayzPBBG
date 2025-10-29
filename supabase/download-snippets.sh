#!/bin/bash

# Script to download Supabase snippets
# Usage: ./download-snippets.sh [snippet_id] [output_file]
#
# Before running this script, ensure you have:
# 1. Installed Supabase CLI (see: https://supabase.com/docs/guides/cli)
# 2. Logged in with: supabase login
# OR set SUPABASE_ACCESS_TOKEN environment variable

set -e

SNIPPET_ID="${1:-7d7c66fd-bb56-40c4-8123-5fb58bd0fcfc}"
OUTPUT_FILE="${2:-supabase/seed/betta_dayz_products_seed_data.sql}"

echo "Downloading Supabase snippet: $SNIPPET_ID"
echo "Output file: $OUTPUT_FILE"

# Check if supabase CLI is available
if ! command -v supabase &> /dev/null; then
    echo "Error: Supabase CLI not found. Please install it first:"
    echo "  npm install -g supabase"
    echo "  or visit: https://supabase.com/docs/guides/cli"
    exit 1
fi

# Create directory if it doesn't exist
mkdir -p "$(dirname "$OUTPUT_FILE")"

# Download the snippet
if npx supabase snippets download "$SNIPPET_ID" > "$OUTPUT_FILE" 2>&1; then
    echo "Successfully downloaded snippet to $OUTPUT_FILE"
else
    echo "Error: Failed to download snippet. Make sure you're logged in:"
    echo "  supabase login"
    echo "  or set SUPABASE_ACCESS_TOKEN environment variable"
    exit 1
fi
