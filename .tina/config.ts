// Minimal Tina config template for Next.js projects.
// You should run: npx @tinacms/cli@latest init to flesh-out schema and connect TinaCloud.

import { defineConfig } from 'tinacms';

const config = defineConfig({
  branch: process.env.TINA_BRANCH || 'main',
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || '',
  token: process.env.TINA_READ_WRITE_TOKEN || '',
  build: {
    outputFolder: 'public',
    publicFolder: 'public',
  },
  media: {
    tina: {
      mediaRoot: 'public/uploads',
      publicFolder: 'public',
    },
  },
  schema: {
    // The init CLI will add collections here.
    collections: [],
  },
});

export default config;
