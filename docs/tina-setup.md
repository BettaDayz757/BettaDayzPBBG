# TinaCMS + Hostinger + Cloudflare Setup for BettaDayzPBBG

This document describes how to finish setup after merging these scaffolding files.

1. Local setup
- Copy `.env.example` to `.env.local` and fill in values (do NOT commit `.env.local`).
- Install packages locally:
  - npm install --save tinacms @tinacms/react @tinacms/cli
- Run the Tina init CLI:
  - npx @tinacms/cli@latest init
  - Follow prompts to create `.tina/schema.ts` and connect to TinaCloud. Use the client id from `.env.local`.

2. Connect TinaCloud to GitHub
- In Tina Cloud dashboard, connect to the repo https://github.com/BettaDayz757/BettaDayzPBBG.
- Install the Tina GitHub App and grant write access to the branch you want Tina to commit to (TINA_BRANCH).
- Add a server token in the Tina dashboard or use the GitHub App installation to allow Tina to create commits.

3. Deploy to Hostinger via GitHub Actions
- Add repository secrets: HOSTINGER_FTP_HOST, HOSTINGER_FTP_USERNAME, HOSTINGER_FTP_PASSWORD.
- Adjust the workflow `.github/workflows/deploy-hostinger.yml` if your build output folder is different (for Next.js static export use `out`, for other frameworks set accordingly).

4. Configure Cloudflare
- Point DNS A records / CNAMEs for bettadayz.shop and bettadayz.store to Hostinger IP(s).
- Enable Full or Full(strict) SSL in Cloudflare and ensure Hostinger has a valid certificate.
- Configure caching rules and page rules as desired. Purge cache after deploy when content changes.

5. Dual-domain strategy
- Use separate content folders or collections within Tina for each domain (e.g., "shop" and "store" collections), or maintain one set of content and route via your Next.js rewrite/redirect rules.
- Option: use branches for staging/production, or separate folders under `content/` like `content/shop` and `content/store`.

6. SVG Integration
- Export SVGs from Canva and either:
  - Inline the SVG markup in your React components (use the `components/SvgInline.tsx` helper), or
  - Save the `.svg` file in `public/` and import it with SVGR (build tool required) to use as a React component.

Security notes
- NEXT_PUBLIC_TINA_CLIENT_ID is safe to commit.
- Do NOT commit TINA_READ_WRITE_TOKEN or FTP credentials. Use GitHub repo secrets or Hostinger secret manager.
