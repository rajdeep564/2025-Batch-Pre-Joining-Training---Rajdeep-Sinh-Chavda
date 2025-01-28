const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Proxy middleware
app.use('/api', createProxyMiddleware({
    target: 'http://trainingsampleapi.satva.solutions', // The original API URL
    changeOrigin: true,
    pathRewrite: {
        '^/api': '', // Remove the `/api` prefix when forwarding the request
    },
    onProxyReq: (proxyReq) => {
        proxyReq.setHeader('Origin', null); // Remove Origin header to avoid CORS
    }
}));

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Proxy server running on http://localhost:${PORT}`);
});
