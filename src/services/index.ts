// API 服务统一入口
// 可以在手动编写的API和自动生成的API之间切换

// 导入手动编写的API
import { API as ManualAPI } from './api';

// 导入生成的API适配器
import { GeneratedAPI } from './generatedApi';

// 配置：选择使用哪种API实现
const USE_GENERATED_API = process.env.USE_GENERATED_API === 'true';

// 统一导出API
export const API = USE_GENERATED_API ? GeneratedAPI : ManualAPI;

// 导出类型（从手动API导出，保持兼容性）
export type * from '@/types/api';

// 导出特定的API实现供调试使用
export { API as ManualAPI } from './api';
export { GeneratedAPI } from './generatedApi';

// 导出生成的API客户端
export { generatedApiClient } from './generatedApi';

// API状态信息
export const ApiInfo = {
  isUsingGenerated: USE_GENERATED_API,
  version: '1.0.0',
  mode: USE_GENERATED_API ? 'generated' : 'manual'
};

// 打印当前使用的API实现
if (process.env.NODE_ENV === 'development') {
  console.log(`🔧 API Mode: ${ApiInfo.mode}`);
} 