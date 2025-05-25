// 环境配置
export const ENV_CONFIG = {
  development: {
    API_BASE_URL: '/api', // 开发环境使用代理
  },
  production: {
    API_BASE_URL: process.env.REACT_APP_API_URL || 'https://your-api-domain.com/api', // 生产环境API地址
  },
  test: {
    API_BASE_URL: '/api',
  },
};

// 获取当前环境配置
export const getCurrentConfig = () => {
  const env = process.env.NODE_ENV as keyof typeof ENV_CONFIG;
  return ENV_CONFIG[env] || ENV_CONFIG.development;
};

// 导出API基础URL
export const API_BASE_URL = getCurrentConfig().API_BASE_URL; 