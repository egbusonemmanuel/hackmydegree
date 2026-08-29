const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function configureProxy(app) {
  app.use('/api', createProxyMiddleware({
    target: `http://localhost:${process.env.DEGREE_AI_API_PORT || 3001}`,
    changeOrigin: true,
  }));
};
