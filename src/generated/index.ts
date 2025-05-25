// 自动生成的API代码
export * from './Api';

// 导出主要的API实例
import { Api, HttpClient } from './Api';

// 创建API实例
const httpClient = new HttpClient({
  baseURL: '/api', // 开发环境和生产环境都使用相对路径，依赖代理或nginx配置
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const apiClient = new Api(httpClient);

// 导出类型
export type * from './Api';
