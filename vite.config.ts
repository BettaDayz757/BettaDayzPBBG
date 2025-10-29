import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Use Vite's config function to access mode and environment variables
// This allows proper handling of VITE_BASE_PATH for Cloudflare Pages deployment
export default defineConfig(({ mode }) => {
  // Base path for asset URLs. In production, uses VITE_BASE_PATH env var if set, 
  // otherwise defaults to '/' for root domain deployment.
  // For development, always uses '/' for local dev server.
  const base = mode === 'production' ? (process.env.VITE_BASE_PATH || '/') : '/';

  return {
    plugins: [
      remix({
        future: {
          v3_fetcherPersist: true,
          v3_relativeSplatPath: true,
          v3_throwAbortReason: true,
        },
      }),
      tsconfigPaths(),
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
    base,
  };
});
