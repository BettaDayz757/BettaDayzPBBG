// Type declarations for Cloudflare Workers runtime types

declare global {
  interface ScheduledController {
    scheduledTime: number;
    cron: string;
    noRetry(): void;
  }

  interface ExportedHandler<Env = any> {
    fetch?(
      request: Request,
      env: Env,
      ctx: ExecutionContext
    ): Response | Promise<Response>;
    scheduled?(
      controller: ScheduledController,
      env: Env,
      ctx: ExecutionContext
    ): void | Promise<void>;
  }

  type ExportedHandlerFetchHandler<Env = any> = (
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ) => Response | Promise<Response>;

  interface ExecutionContext {
    waitUntil(promise: Promise<any>): void;
    passThroughOnException(): void;
  }

  namespace WorkerEntrypointConstructor {
    // Placeholder namespace for Cloudflare Workers entrypoint
  }

  interface IncomingRequestCfProperties {
    // Add properties as needed
    [key: string]: any;
  }

  // Override Request interface to support Cloudflare Workers cf property
  interface Request {
    cf?: IncomingRequestCfProperties;
  }
}

// Type stubs for wrangler-generated modules with absolute paths
declare module "C:\\Users\\deven\\OneDrive\\Desktop\\BettaDayzPBBG-main\\.wrangler\\tmp\\bundle-VfmmKk\\middleware-insertion-facade.js" {
  export const __INTERNAL_WRANGLER_MIDDLEWARE__: any;
  export type WorkerEntrypointConstructor = any;
  const ENTRY: any;
  export default ENTRY;
}

// Wildcard module declaration for any wrangler template paths
declare module "*wrangler/templates/middleware/common.ts" {
  export function __facade_invoke__(request: any, env: any, ctx: any, dispatcher: any, ...args: any[]): any;
  export function __facade_register__(middleware: any): void;
  export type Dispatcher = (type: any, init: any) => any;
}

// Specific path declaration
declare module "C:\\Users\\deven\\OneDrive\\Desktop\\BettaDayzPBBG-main\\node_modules\\.pnpm\\wrangler@4.45.0_@cloudflare+workers-types@4.20251014.0\\node_modules\\wrangler\\templates\\middleware\\common.ts" {
  export function __facade_invoke__(request: any, env: any, ctx: any, dispatcher: any, ...args: any[]): any;
  export function __facade_register__(middleware: any): void;
  export type Dispatcher = (type: any, init: any) => any;
}

export {};
