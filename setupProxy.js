const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://213.199.62.60:8083',
      changeOrigin: true,
      secure: false,  
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    })
  );
};