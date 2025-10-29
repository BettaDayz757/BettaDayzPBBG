# BettaDayz PBBG Documentation

Welcome to the BettaDayz PBBG (Persistent Browser-Based Game) documentation.

## Quick Links

### Deployment Guides
- **[Complete Deployment Guide](./DEPLOYMENT-GUIDE.md)** - Master guide for full system deployment
- **[Cloudflare Worker Setup](./CLOUDFLARE-WORKER-SETUP.md)** - Domain routing configuration
- **[Supabase Setup](./SUPABASE-SETUP.md)** - Database and authentication setup

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Internet Users                            │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│              Cloudflare Worker                               │
│         (Domain-based Routing)                               │
│  • bettadayz.shop  → Port 3000                              │
│  • bettadayz.store → Port 3001                              │
└─────────────────┬───────────────────────────────────────────┘
                  │
         ┌────────┴────────┐
         │                 │
┌────────▼────────┐ ┌─────▼──────────┐
│  Shop App       │ │  Store App     │
│  (Port 3000)    │ │  (Port 3001)   │
│  Next.js 16     │ │  Next.js 16    │
└────────┬────────┘ └─────┬──────────┘
         │                │
         └────────┬───────┘
                  │
         ┌────────▼────────┐
         │   Supabase      │
         │   PostgreSQL    │
         │   • Auth        │
         │   • Real-time   │
         │   • Storage     │
         └─────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript 5

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Real-time subscriptions
- **Routing**: Cloudflare Workers

### Infrastructure
- **Server**: VPS at 194.195.84.72
- **Process Manager**: PM2
- **Domains**: bettadayz.shop, bettadayz.store
- **CDN/Proxy**: Cloudflare

## Getting Started

### For New Deployments
1. Read the [Complete Deployment Guide](./DEPLOYMENT-GUIDE.md)
2. Follow the step-by-step instructions
3. Complete all checklist items
4. Test thoroughly before going live

### For Development
1. Clone the repository
2. Install dependencies: `npm install --legacy-peer-deps`
3. Copy `.env.example` to `.env.local`
4. Configure environment variables
5. Run development server: `npm run dev`

### For Updates
1. Pull latest changes from repository
2. Review CHANGES.md for breaking changes
3. Update dependencies if needed
4. Test in development environment
5. Deploy to production

## Documentation Structure

```
docs/
├── README.md                      # This file
├── DEPLOYMENT-GUIDE.md            # Complete deployment instructions
├── CLOUDFLARE-WORKER-SETUP.md     # Cloudflare Worker configuration
└── SUPABASE-SETUP.md              # Database and auth setup
```

## API Endpoints

### Health Check
- `GET /api/health` - System health status

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/signin` - Sign in to account
- `POST /api/auth/signout` - Sign out

### Player Management
- `GET /api/player/stats` - Get player statistics
- `POST /api/player/stats` - Update player statistics
- `GET /api/player/inventory` - Get player inventory
- `POST /api/player/inventory` - Add item to inventory

### Game Activities
- `POST /api/game/activities` - Log game activity

## Database Schema

### Main Tables
- **players** - Player accounts and statistics
- **game_sessions** - Active game sessions
- **player_inventory** - Player items and equipment
- **game_activities** - Game activity log
- **quests** - Available quests
- **player_quests** - Player quest progress
- **guilds** - Guild/clan system
- **guild_members** - Guild membership
- **marketplace_listings** - Player marketplace

### Key Functions
- `add_experience(player_id, amount)` - Add XP with auto-leveling
- `consume_energy(player_id, amount)` - Use energy for actions
- `regenerate_energy(player_id)` - Auto-regenerate energy
- `player_transaction(player_id, coins, premium)` - Currency transactions

## Environment Variables

### Required
```bash
NEXT_PUBLIC_SUPABASE_URL=           # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=      # Supabase anonymous key
SUPABASE_SERVICE_ROLE_KEY=          # Supabase service role key
JWT_SECRET=                          # JWT signing secret
NEXT_PUBLIC_DOMAIN=                  # shop or store
NODE_ENV=                            # production or development
```

### Optional
```bash
PORT=                                # Server port (default: 3000)
DATABASE_URL=                        # Alternative database URL
SENTRY_DSN=                          # Error tracking
```

## Monitoring

### Application Health
- Monitor `/api/health` endpoint
- Check PM2 status: `pm2 status`
- View logs: `pm2 logs`

### Database
- Supabase Dashboard → Database → Logs
- Monitor query performance
- Check connection pool status

### Cloudflare Worker
- Cloudflare Dashboard → Workers
- View request analytics
- Monitor error rates

## Troubleshooting

### Common Issues

**Build fails:**
- Check Node.js version (18+)
- Clear cache: `rm -rf .next node_modules`
- Reinstall: `npm install --legacy-peer-deps`

**Database connection fails:**
- Verify Supabase credentials
- Check project status in Supabase Dashboard
- Test connection endpoint

**Worker not routing:**
- Verify routes in Cloudflare Dashboard
- Check DNS settings (proxy enabled)
- Review worker logs

**API returns 500:**
- Check environment variables
- Review application logs
- Verify database schema

See individual guides for detailed troubleshooting.

## Support

- **Issues**: https://github.com/BettaDayz757/BettaDayzPBBG/issues
- **Documentation**: Check individual guides in this directory
- **Cloudflare**: https://developers.cloudflare.com/workers/
- **Supabase**: https://supabase.com/docs
- **Next.js**: https://nextjs.org/docs

## Contributing

Please read [CONTRIBUTING.md](../CONTRIBUTING.md) before submitting pull requests.

## License

This project is licensed under the MIT License - see [LICENSE](../LICENSE) file for details.

---

**Last Updated**: 2025-10-29  
**Version**: 2.0.0  
**Maintainer**: BettaDayz757
