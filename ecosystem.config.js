const { name } = require('./package.json');
const path = require('path');

module.exports = {
  apps: [
    {
      name,
      script: path.resolve(__dirname, './dist/index.js'),
      instances: require('os').cpus().length,
      autorestart: true,
      watch: true,
      ignore_watch: ['public', 'logs'],
      env_production: {
        NODE_ENV: 'production',
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
};
