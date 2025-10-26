```markdown
# BettaDayz — PBBG (MVP scaffold)

This branch initializes BettaDayz game scaffolding on top of the MERN-template repository.

Contents
- server/: Express + Socket.IO server, Mongoose models, and example routes.
- client/: React avatar editor and place to build UI.

Quick local setup
1. Copy `.env.example` to `.env` and fill values:
   - MONGO_URI, JWT_SECRET, REDIS_URL (optional), PORT
2. Install dependencies (root uses workspaces):
   - npm install
3. Run dev:
   - npm run dev

Notes
- This is a scaffold: hooks, auth middleware, and production-ready security require further work.
- After you review these files I can push them to the feature/init-bettadayz branch and continue with CI, seed data, and more endpoints.
```