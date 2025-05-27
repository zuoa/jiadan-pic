// 环境配置
export const ENV_CONFIG = {
  development: {
    API_BASE_URL: '/api', // 开发环境使用代理
  },
  production: {
    API_BASE_URL: process.env.REACT_APP_API_URL || '/api', // 生产环境API地址
  },
  test: {
    API_BASE_URL: '/api',
  },
};

// 获取当前环境配置
export const getCurrentConfig = () => {
  const env = (process.env.NODE_ENV as keyof typeof ENV_CONFIG) || 'development';
  console.log('🔧 当前环境:', env, 'process.env.NODE_ENV:', process.env.NODE_ENV);
  return ENV_CONFIG[env] || ENV_CONFIG.development;
};

// 导出API基础URL
export const API_BASE_URL = getCurrentConfig().API_BASE_URL;

console.log('🔧 API_BASE_URL:', API_BASE_URL); 