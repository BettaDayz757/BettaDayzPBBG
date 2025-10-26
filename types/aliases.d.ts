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
