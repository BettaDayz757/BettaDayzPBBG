# 🚀 BettaDayz PBBG Complete Deployment Guide

## 🎯 Overview
Complete production deployment of BettaDayz PBBG with Cloudflare Workers domain routing and Supabase database integration.

## 🔐 Credentials & Configuration
- **Cloudflare Token**: `after9b9fcaead55610e5dd235878e702ee69`
- **JWT Secret**: `9=N6H//qQ]?g+BDV`
- **Server**: `194.195.84.72:65002`
- **SSH Password**: `@Jgallow20`
- **Supabase URL**: `https://btcfpizydmcdjhltwbil.supabase.co`
- **Supabase Project ID**: `btcfpizydmcdjhltwbil`

## ✅ Current Status (All Complete!)
- ✅ **Server Applications**: Running on ports 3000 (shop) and 3001 (store)
- ✅ **Supabase URL**: Configured at https://btcfpizydmcdjhltwbil.supabase.co
- ✅ **Supabase Integration**: Code deployed with authentication hooks
- ✅ **JWT Configuration**: Integrated across all systems
- ✅ **Worker Code**: Created and ready for deployment
- ✅ **Database Schema**: Complete PBBG schema ready for deployment
- ✅ **Deployment Package**: All files ready in `deployment-package/`
- ✅ **Git Repository**: All changes committed and pushed
- ✅ **Server Environment**: Updated with Supabase configuration

## 🌐 Manual Deployment Steps

### Step 1: Deploy Cloudflare Worker

**Option A: Dashboard Deployment (Recommended)**
1. Go to [https://dash.cloudflare.com](https://dash.cloudflare.com)
2. Navigate to **Workers & Pages**
3. Click **Create** → **Worker**
4. Name: `bettadayz-pbbg`
5. Copy code from `deployment-package/cloudflare-worker.js`
6. Click **Save and Deploy**

**Environment Variables to Set:**
```
SERVER_IP = 194.195.84.72
SHOP_PORT = 3000
STORE_PORT = 3001
JWT_SECRET = 9=N6H//qQ]?g+BDV
WORKER_TOKEN = after9b9fcaead55610e5dd235878e702ee69
NODE_ENV = production
```

### Step 2: Configure Custom Domains
1. In Worker settings, go to **Triggers**
2. Add **Custom Domains**:
   - `bettadayz.shop`
   - `www.bettadayz.shop`
   - `bettadayz.store`
   - `www.bettadayz.store`

### Step 3: Create Supabase Database
1. Go to [https://supabase.com/dashboard/project/btcfpizydmcdjhltwbil](https://supabase.com/dashboard/project/btcfpizydmcdjhltwbil)
2. Navigate to **SQL Editor**
3. Copy and run: `deploy-to-supabase.sql` (created automatically)
4. Click **Run** to create complete schema

**Note**: Your Supabase project is already created at: `https://btcfpizydmcdjhltwbil.supabase.co`

### Step 4: Get Supabase API Keys
1. In your Supabase project settings
2. Go to **API** section
3. Copy your **anon/public key** and **service_role key**
4. Update these in your server environment files (already configured with placeholders)

**Current Supabase Configuration**: Server already updated with your project URL

## 🎮 Test URLs

**Current (Direct Server Access):**
- Shop: `http://194.195.84.72:3000`
- Store: `http://194.195.84.72:3001` 
- Game: `http://194.195.84.72:3000/game`

**After Worker Deployment:**
- Shop: `https://bettadayz.shop`
- Store: `https://bettadayz.store`
- Game: `https://bettadayz.shop/game`

## 📁 Deployment Package Contents

```
deployment-package/
├── cloudflare-worker.js           # Main Worker routing code
├── cloudflare-worker-deploy.js    # Alternative Worker code
├── deploy-supabase.sql            # Complete database schema
├── supabase.ts                    # Database client code
├── usePlayer.ts                   # React authentication hooks
├── wrangler.toml                  # Worker configuration
└── DEPLOYMENT-INSTRUCTIONS.md     # Detailed instructions
```

## 🔧 Advanced Configuration

### Worker Features
- **Domain Routing**: Automatically routes shop/store domains to correct ports
- **CORS Headers**: Enables cross-origin requests
- **Error Handling**: Comprehensive error responses
- **JWT Integration**: Validates authentication across requests

### Database Features
- **Complete PBBG Schema**: Players, inventory, quests, guilds, marketplace
- **Game Mechanics**: Experience, energy, level-up functions
- **Real-time Features**: Activity tracking, session management
- **Security**: Row-Level Security (RLS) policies enabled

### Server Integration
- **JWT Authentication**: `9=N6H//qQ]?g+BDV` configured
- **Environment Variables**: Production settings applied
- **Application Status**: Both apps running and responding HTTP 200

## 🚀 Final Production Checklist

- [ ] Deploy Cloudflare Worker via dashboard
- [ ] Add custom domains (bettadayz.shop/store) to Worker
- [ ] Create Supabase project and run database schema
- [ ] Update server with Supabase credentials
- [ ] Test domain routing functionality
- [ ] Verify game authentication flow

## 📞 Support

All deployment files are committed to the GitHub repository:
[https://github.com/BettaDayz757/BettaDayzPBBG](https://github.com/BettaDayz757/BettaDayzPBBG)

**Deployment Package Location**: `deployment-package/`
**Key Files**: All scripts, schemas, and configurations ready to use

---

## 💫 What's Been Accomplished

✅ **Complete Cloudflare Worker** with domain routing logic  
✅ **Full PBBG Database Schema** with all game mechanics  
✅ **JWT Authentication System** integrated across platform  
✅ **Server Environment** configured and applications running  
✅ **Supabase Integration** with React hooks and TypeScript client  
✅ **Production Deployment Package** with comprehensive instructions  
✅ **Git Repository** with all changes committed and documented  

**Everything is ready for production deployment! 🎮🚀**