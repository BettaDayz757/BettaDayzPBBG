# Deploying to Cloudflare Pages (Vite SPA)

This document shows recommended steps to connect this repository to Cloudflare Pages and provides a small SPA fallback so single-page app routes don't 404 when the Pages SPA option is not used.

Key changes in this branch:
- `vite.config.ts` — switched base logic to use Vite env vars: `import.meta.env.VITE_BASE_PATH` and `import.meta.env.MODE`, with a safe `'/’` fallback in production.
- `public/404.html` — a minimal client-side fallback that fetches `index.html` so unknown routes are handled by the SPA router.

---

## 1) Connect repo to Cloudflare Pages

1. Go to Pages in the Cloudflare dashboard and create a new project.
2. Connect your GitHub repo `BettaDayz757/BettaDayzPBBG` and choose the `main` branch (or the branch you want to deploy from).

## 2) Build settings

Use the following (recommended for Vite):

- Framework preset: None (use `Vite` if available)
- Build command: `npm run build` (or `pnpm build` / `yarn build` depending on your environment)
- Build output directory: `dist`

Notes:
- If your project uses Next.js or another adapter, adjust the build command and output directory accordingly. These instructions assume a Vite build that outputs `dist`.

## 3) Environment variables

Set the following environment variables in Pages (Project > Settings > Environment variables):

- `VITE_BASE_PATH` — Optional. Set this when you serve the site from a subpath (for example, `/subpath/`).
  - If left empty (or unset) and `import.meta.env.MODE === 'production'`, the `vite.config.ts` will default to `'/'` which is correct for root domain deployments.
  - Example: if you host under `https://example.com/app/`, set `VITE_BASE_PATH=/app/`.

The `vite.config.ts` in this repo uses this logic:

```text
if (import.meta.env.MODE === 'production') use import.meta.env.VITE_BASE_PATH || '/' else use '/'
```

This ensures safe defaults for root domain deployments while allowing subpath hosting when needed.

## 4) SPA fallback option in Cloudflare Pages

Cloudflare Pages offers an optional SPA fallback that will serve `index.html` for unknown routes. You can enable this in the Pages UI under the project settings.

If you prefer not to enable the Pages SPA option (or you want an additional fallback), this repository includes `public/404.html`. When Pages returns a 404, Cloudflare will serve this file and its small script will fetch and render `index.html` so the SPA router can handle the route.

## 5) Adding a custom domain

1. In Pages, go to the Domains section and add `bettadayz.store` and `www.bettadayz.store`.
2. Follow the Cloudflare instructions to verify domain ownership.
3. Update your DNS records where your domain is registered. If you use Cloudflare DNS for the domain, Pages will give you the necessary DNS records.

DNS nameserver reminder:
- If your domain is not yet using Cloudflare nameservers, you'll need to update the registrar's nameserver settings to use Cloudflare's nameservers before some Pages features (like automatic certificate issuance) will work.

## 6) Troubleshooting

- Broken asset paths (404s for JS/CSS):
  - Symptom: browser 404s for static assets after deployment while local dev works.
  - Fix: confirm `VITE_BASE_PATH` matches the deployed base path. If serving from root, ensure `VITE_BASE_PATH` is empty or unset so the config falls back to `/`.

- Import errors for aliased paths in production:
  - Symptom: runtime errors like `Cannot find module './foo'` or failed imports when Vite aliases are used.
  - Notes: This repo uses `vite-tsconfig-paths`. That helps TypeScript/TS path resolution during dev/build, but sometimes production/runtime resolution for `.js`/`.jsx` files can fail if file extensions are omitted.
  - Fixes:
    - Add explicit file extensions on imports in JS/JSX files (for example `import X from './x.jsx'`) if you see import errors on deployed builds.
    - Ensure `vite-tsconfig-paths` is configured and included in `vite.config.ts` (it is in this repo).

- If the SPA still 404s:
  - Confirm Cloudflare Pages build output is the `dist` directory and that `index.html` exists there.
  - Turn on the Pages SPA option as an alternative to using `public/404.html`.

## 7) Notes and tips

- Leave relative import comments and deliberate extension omissions alone if they are part of a deliberate build step in this repo. The `PaymentInterface.jsx` and `GameContainer.jsx` files include relative import comments in some PRs — do not change them here unless you see a concrete runtime error.
- If you need to serve the app from a subpath, set `VITE_BASE_PATH` in the Pages environment variables, for example `/app/`. Remember to include the trailing slash when appropriate.

---

If you run into problems creating the PR or with Pages settings, open an issue in the repo or share the deployment logs and I can help troubleshoot the specific errors.
# Deploying BettaDayz to Cloudflare Pages

This guide provides step-by-step instructions for deploying the BettaDayz application to Cloudflare Pages.

## Prerequisites

- A Cloudflare account (sign up at [cloudflare.com](https://cloudflare.com))
- Repository access to BettaDayz757/BettaDayzPBBG on GitHub
- Domain: bettadayz.store (with DNS managed by Cloudflare)

## Step 1: Connect Repository to Cloudflare Pages

1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Pages** in the left sidebar
3. Click **Create a project**
4. Select **Connect to Git**
5. Choose **GitHub** and authorize Cloudflare to access your repositories
6. Select the **BettaDayz757/BettaDayzPBBG** repository
7. Click **Begin setup**

## Step 2: Configure Build Settings

Configure your project with the following settings:

### Production Branch
- **Production branch**: `main`

### Build Configuration
- **Framework preset**: Remix (or select "None" and configure manually)
- **Build command**: `npm run build`
- **Build output directory**: `build/client`
- **Root directory**: (leave empty - use repository root)

### Environment Variables

Add the following environment variable:

| Variable Name      | Value | Description                                    |
|--------------------|-------|------------------------------------------------|
| `VITE_BASE_PATH`   | `/`   | Base path for assets (use `/` for root domain)|
| `NODE_VERSION`     | `18.18.0` or higher | Node.js version for builds       |

**Note**: When deploying to the root domain (bettadayz.store), set `VITE_BASE_PATH` to `/`. If deploying to a subdirectory, set it to the subdirectory path (e.g., `/app`).

### Advanced Settings (Optional)

- **Node version**: Set to `18.18.0` or higher if needed (can be set via `NODE_VERSION` environment variable)
- **Install command**: `npm install --legacy-peer-deps` (if you encounter peer dependency issues)

## Step 3: Enable Single Page Application (SPA) Support

Cloudflare Pages can automatically handle client-side routing. You have two options:

### Option A: Enable SPA mode in Cloudflare Pages (Recommended)
1. In your Pages project settings, go to **Settings** → **Functions**
2. Look for **Single Page Application (SPA)** toggle
3. Enable the SPA setting
4. This will automatically serve `index.html` for 404s

### Option B: Use the 404.html fallback (Automatic)
The repository includes a `public/404.html` file that automatically redirects to `index.html` while preserving the path. This works even if SPA mode is not enabled.

**How it works**: When a user navigates to a client-side route (e.g., `/game`), Cloudflare Pages will serve the `404.html` file if the route doesn't exist as a static file. The 404.html script then redirects to the root and stores the intended path in sessionStorage for the SPA to restore.

## Step 4: Deploy

1. After configuring settings, click **Save and Deploy**
2. Cloudflare Pages will clone your repository and start the build process
3. Monitor the build logs for any errors
4. Once complete, your site will be available at a `*.pages.dev` URL

## Step 5: Add Custom Domain

### Add bettadayz.store

1. In your Cloudflare Pages project, go to **Custom domains**
2. Click **Set up a custom domain**
3. Enter `bettadayz.store`
4. Click **Continue**
5. Cloudflare will automatically configure the DNS records if the domain is using Cloudflare nameservers

### Add www subdomain

1. Click **Set up a custom domain** again
2. Enter `www.bettadayz.store`
3. Click **Continue**
4. Cloudflare will create a CNAME record pointing to your Pages project

### DNS Configuration

Your domain should be using Cloudflare nameservers. If not:

1. Go to your domain registrar
2. Change the nameservers to Cloudflare's nameservers (provided when you added the domain to Cloudflare)
3. Common Cloudflare nameservers format:
   - `ns1.cloudflare.com`
   - `ns2.cloudflare.com`
   - (Actual nameservers will be shown in your Cloudflare dashboard)

## Step 6: Configure Build Settings for Production

### Update Environment Variables for Production

If you need different settings for production vs preview deployments:

1. Go to **Settings** → **Environment variables**
2. Click **Add variable**
3. Set the **Environment** to `Production` (or `Preview` for preview deployments)
4. Add any production-specific environment variables

## Automatic Deployments

Cloudflare Pages will automatically deploy:
- **Production deployments**: When you push to the `main` branch
- **Preview deployments**: When you push to any other branch or open a pull request

Preview deployments are accessible via unique URLs (e.g., `<branch-name>.bettadayzpbbg.pages.dev`).

## Troubleshooting

### Assets Not Loading (404 Errors)

**Symptom**: JavaScript, CSS, or other assets return 404 errors.

**Cause**: Base path mismatch between build configuration and deployment URL.

**Solution**:
1. Check the `VITE_BASE_PATH` environment variable in Cloudflare Pages settings
2. For root domain deployment, it should be `/`
3. For subdirectory deployment (e.g., `yourdomain.com/app`), it should be `/app`
4. After changing, trigger a new deployment by pushing a commit or clicking **Retry deployment**

### Build Failures

**Symptom**: Build fails with errors about missing dependencies or peer dependencies.

**Solution**:
1. In **Settings** → **Environment variables**, add:
   - `NPM_FLAGS` with value `--legacy-peer-deps`
   
   OR update the build command to:
   ```
   npm install --legacy-peer-deps && npm run build
   ```

2. If you see memory issues, you may need to increase the build resources (contact Cloudflare support for Enterprise features).

### Import Errors in Production

**Symptom**: Build succeeds but the app fails at runtime with import errors like "Cannot find module".

**Possible Causes**:
1. Missing file extensions in import statements (especially for `.jsx` files imported from `.js` files)
2. Path alias resolution issues

**Solution**:
The repository uses `vite-tsconfig-paths` plugin to resolve path aliases. However, some import statements in `.jsx` files may need explicit extensions:

```javascript
// Instead of:
import Component from './Component'

// Use:
import Component from './Component.jsx'
```

Files that may need attention (already noted with comments in the codebase):
- `app/components/PaymentInterface.jsx`
- `app/components/GameContainer.jsx`

If you encounter import issues, check these files and add explicit `.js` or `.jsx` extensions to relative imports as needed.

### Client-Side Routing Not Working

**Symptom**: Direct navigation to routes like `/game` or `/store` returns 404 errors.

**Solution**:
1. Enable SPA mode in Cloudflare Pages (see Step 3, Option A)
2. Verify that `public/404.html` exists in your repository
3. Check that the build output directory contains `404.html`
4. Clear Cloudflare cache: Go to **Caching** → **Configuration** → **Purge Everything**

### DNS Propagation Delays

**Symptom**: Custom domain not accessible after setup.

**Solution**:
- DNS changes can take up to 48 hours to propagate globally
- Check DNS propagation status at [whatsmydns.net](https://www.whatsmydns.net)
- Verify nameservers are correctly set at your domain registrar

### HTTPS/SSL Issues

**Symptom**: Mixed content warnings or SSL errors.

**Solution**:
- Cloudflare Pages automatically provisions SSL certificates
- Ensure all external resources (APIs, images, etc.) use HTTPS
- Check **SSL/TLS** settings in Cloudflare dashboard
- Recommended: Use **Full (strict)** SSL mode if you have a valid origin certificate

## Performance Optimization

### Caching

Cloudflare automatically caches static assets. To optimize:

1. Go to **Caching** → **Configuration**
2. Enable **Always Use HTTPS**
3. Set **Browser Cache TTL** to an appropriate value (e.g., 4 hours for development, 1 month for production)

### Analytics

Enable **Web Analytics** in your Cloudflare Pages project settings to monitor:
- Page views
- Unique visitors
- Performance metrics
- Core Web Vitals

## Monitoring and Logs

### Build Logs
- View real-time build logs during deployment
- Access historical build logs in **Deployments** → Click on a deployment → **View build logs**

### Function Logs (if using Cloudflare Workers)
- Go to **Functions** to view serverless function logs
- Useful for debugging API routes or server-side logic

## Rolling Back Deployments

If a deployment introduces issues:

1. Go to **Deployments**
2. Find the last known good deployment
3. Click the **⋯** menu → **Rollback to this deployment**
4. Confirm the rollback

## Additional Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Remix Documentation](https://remix.run/docs)
- [Vite Documentation](https://vitejs.dev/)
- [BettaDayz GitHub Repository](https://github.com/BettaDayz757/BettaDayzPBBG)

## Support

For deployment issues specific to BettaDayz:
- Open an issue on the [GitHub repository](https://github.com/BettaDayz757/BettaDayzPBBG/issues)
- Contact the development team

For Cloudflare Pages issues:
- Visit [Cloudflare Community](https://community.cloudflare.com/)
- [Cloudflare Support](https://support.cloudflare.com/)
