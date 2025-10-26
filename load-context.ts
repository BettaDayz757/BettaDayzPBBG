import { type PlatformProxy } from 'wrangler';

// Define a minimal Env type for Cloudflare Workers
type Env = Record<string, any>;

type Cloudflare = Omit<PlatformProxy<Env>, 'dispose'>;

declare module '@remix-run/cloudflare' {
  interface AppLoadContext {
    cloudflare: Cloudflare;
  }
}
