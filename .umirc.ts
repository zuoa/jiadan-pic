import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: '/', component: '@/pages/index' },
    { path: '/gallery', component: '@/pages/Gallery/index' },
    { path: '/admin', component: '@/pages/Admin/index' },
  ],
  npmClient: 'npm',
  title: '个人照片图库',
  hash: true,
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
});
