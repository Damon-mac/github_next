module.exports = {
  apps: [
    {
      name: 'github_next',
      script: './server.js',
      instances: 1,
      antorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
}