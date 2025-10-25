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
  // Use environment variable for base path or default to repository name
  base: process.env.NODE_ENV === 'production' 
    ? (process.env.BASE_PATH || '/BettaDayzPBBG/') 
    : '/',
});