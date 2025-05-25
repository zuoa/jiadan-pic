// API 服务统一入口
// 使用修复后的API服务

// 导出生成的API类型
export type * from '@/types/api';

// 导出修复后的API服务
export * from './photos';

// 导出OpenAPI生成的API服务（备用）
export { default as API } from './jiadan-pic-api';

// API状态信息
export const ApiInfo = {
  version: '1.0.0',
  mode: 'custom-http-client'
};

// 打印当前使用的API实现
if (process.env.NODE_ENV === 'development') {
  console.log(`🔧 API Mode: ${ApiInfo.mode}`);
} 