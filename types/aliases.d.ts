declare module '~/*';
declare module '@/*';

// Generic fallback for any JS/asset imports without types
declare module '*.jsx';
declare module '*.js';

// Minimal Remix type shims to satisfy TypeScript during builds. These are
// conservative any-based types; replace with proper Remix types when you
// upgrade dependencies to compatible versions.
declare module '@remix-run/node' {
	export type ActionArgs = { request: Request; params?: Record<string,string> };
	export type EntryContext = any;
	export type MetaFunction = any;
	export type LinksFunction = any;
	export function json(data: any, init?: any): any;
}

declare module '@remix-run/react' {
	export const RemixBrowser: any;
	export const RemixServer: any;
	export const Link: any;
	export const Outlet: any;
	export const Form: any;
		export const Meta: any;
		export const Links: any;
		export const Scripts: any;
		export const ScrollRestoration: any;
		export const LiveReload: any;
}

// Cloudflare module - basic module declaration
// load-context.ts extends this with interface augmentation
declare module '@remix-run/cloudflare' {
	export interface AppLoadContext {}
}

// Vite and build tool type declarations
declare module '@remix-run/dev' {
	export const vitePlugin: any;
}

declare module 'vite' {
	export function defineConfig(config: any): any;
}

declare module 'vite-tsconfig-paths' {
	const tsconfigPaths: any;
	export default tsconfigPaths;
}

declare module 'stripe' {
	class Stripe {
		constructor(key: string, options?: any);
		checkout: {
			sessions: {
				create(params: any): Promise<any>;
			};
		};
	}
	export default Stripe;
}

declare module 'wrangler' {
	export type PlatformProxy<T = any> = any;
}
