module.exports = {
  apps: [
    {
      name: 'bettadayz-shop',
      cwd: __dirname,
      script: 'node_modules/.bin/next',
      args: 'start -p 3000',
      env: {
        NODE_ENV: 'production',
        PORT: '3000',
        HOSTNAME: '0.0.0.0',
        NEXT_PUBLIC_SITE_URL: 'https://bettadayz.shop'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: './logs/shop-error.log',
      out_file: './logs/shop-out.log',
      log_file: './logs/shop-combined.log'
    },
    {
      name: 'bettadayz-store',
      cwd: __dirname,
      script: 'node_modules/.bin/next',
      args: 'start -p 3001',
      env: {
        NODE_ENV: 'production',
        PORT: '3001',
        HOSTNAME: '0.0.0.0',
        NEXT_PUBLIC_SITE_URL: 'https://bettadayz.store'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: './logs/store-error.log',
      out_file: './logs/store-out.log',
      log_file: './logs/store-combined.log'
    }
  ]
};