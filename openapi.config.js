module.exports = {
  // OpenAPI 规范来源
  input: {
    // 远程OpenAPI规范URL
    remote: 'http://localhost:9000/api/swagger.json',
    // 本地OpenAPI规范文件
    local: './api-spec.json',
    // 备用规范文件
    fallback: './api-spec.yaml'
  },
  
  // 输出配置
  output: {
    dir: './src/generated',
    filename: 'api.ts',
    indexFile: 'index.ts'
  },
  
  // 生成选项
  generation: {
    // 是否生成客户端代码
    generateClient: true,
    // 是否生成路由类型
    generateRouteTypes: true,
    // HTTP客户端类型
    httpClientType: 'axios',
    // 是否解包响应数据
    unwrapResponseData: false,
    // 是否使用单一HTTP客户端
    singleHttpClient: true,
    // 是否生成响应类型
    generateResponseTypes: true,
    // 是否生成联合枚举
    generateUnionEnums: true,
    // 是否清理输出目录
    cleanOutput: true,
    // 是否排序类型
    sortTypes: true,
    // 是否排序路由
    sortRoutes: true
  },
  
  // API客户端配置
  client: {
    baseURL: {
      development: '/api',
      production: 'http://localhost:9000/api'
    },
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json'
    }
  },
  
  // 类型映射
  typeMapping: {
    // 自定义类型映射
    'string($date)': 'string',
    'string($date-time)': 'string',
    'string($binary)': 'File'
  },
  
  // 模板配置
  templates: {
    // 自定义模板目录
    dir: './scripts/api-templates',
    // 是否使用默认模板
    useDefault: true
  }
}; 