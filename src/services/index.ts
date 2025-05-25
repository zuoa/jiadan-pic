// API 服务统一入口
// 使用 @umijs/max 的 OpenAPI 自动生成的 API

// 导出生成的API类型
export type * from '@/types/api';

// API状态信息
export const ApiInfo = {
  version: '1.0.0',
  mode: 'openapi-generated'
};

// 打印当前使用的API实现
if (process.env.NODE_ENV === 'development') {
  console.log(`🔧 API Mode: ${ApiInfo.mode}`);
} 