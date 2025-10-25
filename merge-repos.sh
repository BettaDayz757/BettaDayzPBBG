#!/bin/bash
# merge-repos.sh - Automated script to add subtree repositories
# This script helps maintainers add or update subtree repositories

set -e  # Exit on error

echo "🌳 BettaDayz Monorepo Subtree Management Script"
echo "================================================"
echo ""

# Check if we're in a git repository
if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Function to add a subtree
add_subtree() {
    local remote_name=$1
    local remote_url=$2
    local prefix=$3
    local branch=$4

    echo "📦 Processing subtree: $remote_name"
    echo "   URL: $remote_url"
    echo "   Prefix: $prefix"
    echo "   Branch: $branch"
    echo ""

    # Check if remote already exists
    if git remote get-url $remote_name > /dev/null 2>&1; then
        echo "✓ Remote '$remote_name' already exists"
    else
        echo "➕ Adding remote '$remote_name'..."
        git remote add $remote_name $remote_url
    fi

    # Fetch the remote
    echo "📥 Fetching from '$remote_name'..."
    git fetch $remote_name

    # Check if subtree directory already exists
    if [ -d "$prefix" ]; then
        echo "⚠️  Directory '$prefix' already exists"
        echo "   To update, use: git subtree pull --prefix=$prefix $remote_name $branch"
    else
        echo "🌱 Adding subtree to '$prefix'..."
        git subtree add --prefix=$prefix $remote_name $branch
        echo "✅ Subtree added successfully!"
    fi
    echo ""
}

# Add BettaDayzPBBGDraft subtree
add_subtree \
    "bettadayz-draft" \
    "https://github.com/BettaDayz757/BettaDayzPBBGDraft.git" \
    "bettadayz-draft" \
    "main"

# Add MERN-template subtree
add_subtree \
    "mern-template" \
    "https://github.com/krgamestudios/MERN-template.git" \
    "mern-template" \
    "main"

echo "✨ All subtrees processed!"
echo ""
echo "📝 Next steps:"
echo "   1. Review the changes: git status"
echo "   2. Install dependencies: npm install"
echo "   3. Build workspaces: npm run build"
echo ""
echo "💡 To update a subtree in the future:"
echo "   git subtree pull --prefix=bettadayz-draft bettadayz-draft main"
echo "   git subtree pull --prefix=mern-template mern-template main"
echo ""
