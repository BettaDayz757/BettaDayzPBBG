import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
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

  // Base path for asset URLs. In production, use the Vite env var VITE_BASE_PATH if set,
  // otherwise default to '/' for root domain deployments. For local development we
  // always use '/'. This uses Vite's env handling (`import.meta.env.MODE` and
  // `import.meta.env.VITE_BASE_PATH`) instead of reading `process.env` directly.
  base: (import.meta.env.MODE === 'production') ? (import.meta.env.VITE_BASE_PATH || '/') : '/',
});
