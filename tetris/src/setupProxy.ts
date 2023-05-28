const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (app:any) => {
  // app.use(
  //   "/api",
  //   createProxyMiddleware({
  //     target: "http://localhost:8080",
  //     changeOrigin: true,
  //   })
  // );
  app.use(
    "/websocket",
    createProxyMiddleware({ target: "http://localhost:8080", ws: true ,changeOrigin: true,})
    
  );
};