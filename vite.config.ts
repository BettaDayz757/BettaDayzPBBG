import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";

// Vite may load this config in a CJS context while some plugins are ESM-only.
// To support both cases we dynamically import the ESM-only plugin at runtime
// and export an async config factory which Vite can handle.
export default async () => {
  const tsconfigPaths = await import("vite-tsconfig-paths");

  return defineConfig({
    plugins: [
      remix({
        future: {
          v3_fetcherPersist: true,
          v3_relativeSplatPath: true,
          v3_throwAbortReason: true,
        },
      }),
      // plugin is the default export for vite-tsconfig-paths
      tsconfigPaths.default(),
    ],
    server: {
      port: 5173,
      host: true,
    },
    build: {
      target: "esnext",
      rollupOptions: {
        external: ["fsevents"],
      },
    },
    optimizeDeps: {
      include: ["react", "react-dom", "framer-motion"],
    },
    // Base path for asset URLs. In production, uses VITE_BASE_PATH env var if set, otherwise defaults to '/' for root domain deployment.
    // For development, always uses '/' for local dev server.
    base: process.env.NODE_ENV === 'production' ? (process.env.VITE_BASE_PATH || '/') : '/',
  });
};