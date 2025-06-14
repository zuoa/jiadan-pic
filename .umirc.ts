import { defineConfig } from "@umijs/max";
import { join } from 'path';

export default defineConfig({
  routes: [
    { path: '/', component: '@/pages/index' },
    { path: '/gallery', component: '@/pages/Gallery/index' },
    { path: '/admin', component: '@/pages/Admin/index' },
  ],
  npmClient: 'npm',
  title: 'Jiadan Visual Stories',
  hash: true,
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',

  
  // 启用插件
  plugins: ['@umijs/max-plugin-openapi'],
  
  // OpenAPI配置
  openAPI: {
    requestLibPath: "import { request } from '@umijs/max'",
    // 使用本地的 API 规范文件
    schemaPath:'http://127.0.0.1:5000/api/swagger.json',
    projectName: 'jiadan-pic-api',
    apiPrefix: '\'/api\'',
    namespace: 'API',
    mock: false,
    hook: {
      customFunctionName: () => {
        return 'customApiFunction';
      },
    },
  },
  analytics: {
    baidu: '86967f4a14cb4436076a71081865f2db',
    ga_v2: 'G-NRM4MMP1ET'
  },
  
  // 开发环境代理配置
  proxy: {
    '/api': {
      target: 'https://gallery.jiadan.li/',
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
