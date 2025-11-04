# Dual Domain Deployment Guide - BettaDayz PBBG

This guide documents the complete dual domain setup for BettaDayz PBBG across **bettadayz.shop** and **bettadayz.store**.

## Overview

The BettaDayz PBBG is configured to run on two primary domains:

- **Primary Domain**: bettadayz.shop
- **Secondary Domain**: bettadayz.store

Both domains use Cloudflare Pages for deployment and Supabase for backend services.

## Architecture

```
User Request → Cloudflare CDN → Cloudflare Pages → Next.js App → Supabase
               ↓
    Domain Detection (shop/store) → Route Handling → Same Game Experience
```

## Environment Configuration

### Development Environment (.env.local)

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://btcfpizydmcdjhltwbil.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0Y2ZwaXp5ZG1jZGpobHR3YmlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc0MDI5NjcsImV4cCI6MjA1Mjk3ODk2N30.vZmX63zGKnMPMj3b0wGYuShpbP6YJznE-WJDQP5i1qE

# Dual Domain Configuration
NEXT_PUBLIC_PRIMARY_DOMAIN=bettadayz.shop
NEXT_PUBLIC_SECONDARY_DOMAIN=bettadayz.store
NEXT_PUBLIC_ALLOWED_DOMAINS=bettadayz.shop,bettadayz.store,localhost:3000
```

### Production Environment (.env.production)

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://btcfpizydmcdjhltwbil.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0Y2ZwaXp5ZG1jZGpobHR3YmlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc0MDI5NjcsImV4cCI6MjA1Mjk3ODk2N30.vZmX63zGKnMPMj3b0wGYuShpbP6YJznE-WJDQP5i1qE

# Production Domain Configuration
NEXT_PUBLIC_PRIMARY_DOMAIN=bettadayz.shop
NEXT_PUBLIC_SECONDARY_DOMAIN=bettadayz.store
NEXT_PUBLIC_ALLOWED_DOMAINS=bettadayz.shop,bettadayz.store
NODE_ENV=production
```

## Cloudflare Configuration

### 1. Pages Deployment

Both domains are deployed via Cloudflare Pages with the following configuration:

**Build Settings:**

- Framework: Next.js
- Build command: `npm run build`
- Build output directory: `out` (for static export) or `.next` (for SSR)
- Node.js version: 20.x

### 2. Custom Domains

In Cloudflare Pages:

1. Navigate to Custom domains
2. Add both domains:
   - `bettadayz.shop`
   - `bettadayz.store`
3. Configure DNS records to point to Cloudflare Pages

### 3. DNS Configuration

For each domain in Cloudflare DNS:

```
Type: CNAME
Name: @
Target: [your-pages-project].pages.dev
TTL: Auto

Type: CNAME  
Name: www
Target: [your-pages-project].pages.dev
TTL: Auto
```

## File Configuration

### Middleware (`functions/_middleware.js`)

```javascript
export async function onRequest(context) {
  const { request, next, env } = context;
  
  // Get the current URL
  const url = new URL(request.url);
  
  // Allowed domains
  const allowedDomains = ['bettadayz.shop', 'bettadayz.store'];
  
  // Validate domain
  if (!allowedDomains.includes(url.hostname)) {
    return new Response('Domain not allowed', { status: 403 });
  }
  
  // Handle www redirects
  if (url.hostname.startsWith('www.')) {
    const newUrl = new URL(request.url);
    newUrl.hostname = url.hostname.replace('www.', '');
    return Response.redirect(newUrl.toString(), 301);
  }
  
  // Continue to next middleware
  const response = await next();
  
  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  
  return response;
}
```

### Redirects (`_redirects`)

```
# Redirect www to non-www for both domains
https://www.bettadayz.shop/* https://bettadayz.shop/:splat 301!
https://www.bettadayz.store/* https://bettadayz.store/:splat 301!

# SPA routing for both domains
/api/* /api/:splat 200
/* /index.html 200
```

### Headers (`_headers`)

```
# Global headers for dual domain setup
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: origin-when-cross-origin
  X-DNS-Prefetch-Control: false
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self' https://btcfpizydmcdjhltwbil.supabase.co; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://btcfpizydmcdjhltwbil.supabase.co https://api.stripe.com https: wss:;

# Cache static assets for 1 year
/assets/*
  Cache-Control: public, max-age=31536000, immutable

# Cache JS and CSS files
/*.js
  Cache-Control: public, max-age=31536000
/*.css
  Cache-Control: public, max-age=31536000
```

## Deployment Process

### 1. Local Testing

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Test both domains locally (add to /etc/hosts if needed)
# 127.0.0.1 bettadayz.shop
# 127.0.0.1 bettadayz.store
```

### 2. Build and Deploy

```bash
# Build for production
npm run build

# Deploy to Cloudflare Pages (automatic via Git integration)
git add .
git commit -m "Deploy dual domain configuration"
git push origin main
```

### 3. Verification Checklist

#### Domain Access

- [ ] https://bettadayz.shop loads correctly
- [ ] https://bettadayz.store loads correctly
- [ ] www.bettadayz.shop redirects to bettadayz.shop
- [ ] www.bettadayz.store redirects to bettadayz.store

#### Functionality Testing

- [ ] Game loads on both domains
- [ ] Supabase connection works
- [ ] User authentication functions
- [ ] Game features (stats, achievements, etc.) work
- [ ] Payment integration functions (if applicable)

#### Security Headers

- [ ] CSP headers include Supabase domains
- [ ] XSS protection enabled
- [ ] Frame options set to DENY
- [ ] Referrer policy configured

#### Performance

- [ ] Static assets cached properly
- [ ] CDN serving content globally
- [ ] Page load times under 3 seconds
- [ ] Mobile responsiveness working

## Supabase Integration

### Database Configuration

The Supabase project `btcfpizydmcdjhltwbil` is configured to accept connections from both domains:

1. **CORS Settings**: Both domains added to allowed origins
2. **Row Level Security**: Configured for user data protection
3. **API Keys**: Same keys used across both domains

### Authentication

Auth configuration supports both domains with:

- Site URL: `https://bettadayz.shop`
- Additional URLs: `https://bettadayz.store`
- Redirect URLs: Both domains configured for OAuth providers

## Monitoring and Maintenance

### Analytics

- Cloudflare Analytics: Monitor traffic across both domains
- Web Vitals: Track performance metrics
- Error tracking: Monitor for domain-specific issues

### Updates

1. Deploy to staging first
2. Test both domains
3. Deploy to production
4. Verify both domains post-deployment

### Backup Strategy

- Database: Supabase automatic backups
- Code: Git repository with multiple remotes
- Configuration: Environment variables backed up securely

## Troubleshooting

### Common Issues

1. **Domain not resolving**
   - Check DNS configuration in Cloudflare
   - Verify CNAME records point to Pages project

2. **CORS errors**
   - Verify Supabase CORS settings include both domains
   - Check middleware CORS headers

3. **Authentication issues**
   - Confirm both domains in Supabase Auth settings
   - Verify redirect URLs configured

4. **Build failures**
   - Check environment variables in Cloudflare Pages
   - Verify Node.js version compatibility

### Support Resources

- Cloudflare Pages Documentation
- Supabase Documentation
- Next.js Deployment Guide
- Project GitHub Issues

## Security Considerations

1. **Environment Variables**: Never commit .env files to repository
2. **API Keys**: Use environment-specific keys
3. **HTTPS**: Always use HTTPS in production
4. **CSP**: Keep Content Security Policy strict but functional
5. **Updates**: Regular dependency updates for security patches

## Performance Optimization

1. **CDN**: Cloudflare global CDN distribution
2. **Caching**: Aggressive caching for static assets
3. **Image Optimization**: Use Next.js Image component
4. **Code Splitting**: Implement lazy loading for components
5. **Bundle Analysis**: Regular bundle size monitoring

---

This dual domain setup provides redundancy, brand flexibility, and improved user experience across both bettadayz.shop and bettadayz.store while maintaining a single codebase and database.
