#!/bin/bash

# Quick deployment verification script
SERVER="194.195.84.72"
PORT="65002"
USER="u933155252"

echo "🔍 BettaDayz PBBG Deployment Verification"
echo "========================================"
echo ""

echo "📋 Checking deployment requirements:"
echo ""

# Check if deployment package exists
if [ -f "bettadayz-deployment.tar.gz" ]; then
    echo "✅ Deployment package exists"
    echo "   Size: $(du -h bettadayz-deployment.tar.gz | cut -f1)"
else
    echo "❌ Deployment package not found"
    echo "   Run: npm run build && tar -czf bettadayz-deployment.tar.gz .next package.json package-lock.json next.config.ts middleware.ts app lib components .env.example supabase"
    exit 1
fi

# Check build exists
if [ -d ".next" ]; then
    echo "✅ Next.js build exists"
else
    echo "❌ Next.js build not found"
    echo "   Run: npm run build"
    exit 1
fi

# Check environment template
if [ -f ".env.example" ]; then
    echo "✅ Environment template exists"
else
    echo "❌ Environment template not found"
fi

echo ""
echo "🚀 Ready for deployment!"
echo ""
echo "📤 To upload the package:"
echo "   scp -P $PORT bettadayz-deployment.tar.gz $USER@$SERVER:~/"
echo ""
echo "🔗 To connect to server:"
echo "   ssh -p $PORT $USER@$SERVER"
echo ""
echo "📖 See DEPLOYMENT-INSTRUCTIONS.md for complete setup guide"