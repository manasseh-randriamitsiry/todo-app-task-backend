const fs = require('fs');
const path = require('path');

module.exports = function override(config, env) {
  return config;
};

const certPath = path.join(__dirname, 'localhost.pem');
const keyPath = path.join(__dirname, 'localhost-key.pem');

const customConfig = {
  https: {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  },
  proxy: {
    '/api': 'http://localhost:3001',
  },
  host: 'www.todo.com',
};

module.exports = function override(config, env) {
  if (env === 'development') {
    config.devServer = { ...config.devServer, ...customConfig };
  }
  return config;
};
