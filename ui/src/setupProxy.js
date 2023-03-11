// NOTE: This file enables reverse proxy for backend API in development server
//       Rewrite setting is needed in the case of production build.
//       ref.) https://www.npmjs.com/package/http-proxy-middleware

const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
    const backend_baseurl = process.env.REACT_APP_BACKEND_BASEURL
    app.use(
        "/api",
        createProxyMiddleware({
            target: backend_baseurl,
            pathRewrite: { '^/api/': '/' },
            changeOrigin: true,
        })
    );
};
