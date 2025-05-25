import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: '/', component: '@/pages/index' },
    { path: '/gallery', component: '@/pages/Gallery/index' },
    { path: '/gallery-debug', component: '@/pages/Gallery/debug' },
    { path: '/admin', component: '@/pages/Admin/index' },
    { path: '/api-test', component: '@/pages/ApiTest/index' },
  ],
  npmClient: 'npm',
  title: '个人照片图库',
  hash: true,
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  // 开发环境代理配置
  proxy: {
    '/api': {
      target: 'http://localhost:9000',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/api'
      },
      // 开启日志以便调试
      logLevel: 'debug',
      // 配置请求头
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      },
      // 支持websocket
      ws: true,
      // 安全模式，接受运行在localhost的后端
      secure: false,
    },
  },
});
