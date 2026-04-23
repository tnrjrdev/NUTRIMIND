module.exports = {
  apps: [
    {
      name: 'nutrimind-api',
      script: './backend/server.js',
      instances: 'max', // Executa em cluster mode usando todos os cores da CPU
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001,
      }
    }
  ]
};
