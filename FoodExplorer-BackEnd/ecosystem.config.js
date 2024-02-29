module.exports = {
  apps : [{
    name: "app",
    script: "pm2-runtime start ecosystem.config.js --env production",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}