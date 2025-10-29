module.exports = {
  apps: [
    {
      name: 'bettadayz-shop',
      script: '/home/u933155252/node-v18.19.0-linux-x64/bin/node',
      args: '/home/u933155252/bettadayz/node_modules/.bin/next start',
      cwd: '/home/u933155252/bettadayz',
      env: {
        NODE_ENV: 'production',
        PORT: '3000',
        HOSTNAME: '0.0.0.0',
        PATH: '/home/u933155252/node-v18.19.0-linux-x64/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
        JWT_SECRET: '9=N6H//qQ]?g+BDV',
        NEXT_PUBLIC_SITE_URL: 'https://bettadayz.shop'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: '/home/u933155252/bettadayz/logs/shop-error.log',
      out_file: '/home/u933155252/bettadayz/logs/shop-out.log',
      log_file: '/home/u933155252/bettadayz/logs/shop-combined.log'
    },
    {
      name: 'bettadayz-store',
      script: '/home/u933155252/node-v18.19.0-linux-x64/bin/node',
      args: '/home/u933155252/bettadayz/node_modules/.bin/next start',
      cwd: '/home/u933155252/bettadayz',
      env: {
        NODE_ENV: 'production',
        PORT: '3001',
        HOSTNAME: '0.0.0.0',
        PATH: '/home/u933155252/node-v18.19.0-linux-x64/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
        JWT_SECRET: '9=N6H//qQ]?g+BDV',
        NEXT_PUBLIC_SITE_URL: 'https://bettadayz.store'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: '/home/u933155252/bettadayz/logs/store-error.log',
      out_file: '/home/u933155252/bettadayz/logs/store-out.log',
      log_file: '/home/u933155252/bettadayz/logs/store-combined.log'
    }
  ]
};