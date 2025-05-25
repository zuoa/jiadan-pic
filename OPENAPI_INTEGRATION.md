# OpenAPI 代码生成集成指南

## 概述

本项目已集成 OpenAPI 代码生成功能，能够自动从 OpenAPI 规范生成 TypeScript API 客户端代码，确保前后端接口的一致性和类型安全。

## 🚀 快速开始

### 1. 生成 API 代码

```bash
# 从远程服务生成（推荐）
npm run generate-api

# 或使用简短命令
npm run api:generate
```

### 2. 监听规范文件变化

```bash
# 监听本地 api-spec.json 文件变化，自动重新生成
npm run generate-api:watch
```

### 3. 使用生成的 API

```typescript
// 使用统一的 API 入口（自动选择实现）
import { API } from '@/services';

// 使用生成的 API
const photos = await API.Public.getPublicPhotoList();

// 切换到生成的 API（环境变量）
process.env.USE_GENERATED_API = 'true';
```

## 📁 文件结构

```
project/
├── scripts/
│   ├── generate-api.mjs          # API 生成脚本（ES Module）
│   └── generate-api.js           # API 生成脚本（CommonJS）
├── src/
│   ├── generated/                # 生成的 API 代码目录
│   │   ├── api.ts               # 生成的 API 客户端
│   │   └── index.ts             # 导出文件
│   ├── services/
│   │   ├── index.ts             # 统一 API 入口
│   │   ├── api.ts               # 手动编写的 API
│   │   └── generatedApi.ts      # 生成的 API 适配器
│   └── types/
│       └── api.ts               # API 类型定义
├── api-spec.json                # 本地 OpenAPI 规范文件
├── api-spec.example.json        # OpenAPI 规范模板
└── openapi.config.js            # OpenAPI 配置文件
```

## ⚙️ 配置选项

### 环境变量

```bash
# 使用生成的 API 代码
USE_GENERATED_API=true

# 开发环境
NODE_ENV=development
```

### OpenAPI 配置

编辑 `openapi.config.js`:

```javascript
module.exports = {
  input: {
    remote: 'http://localhost:9000/api/docs/openapi.json',
    local: './api-spec.json'
  },
  output: {
    dir: './src/generated',
    filename: 'api.ts'
  },
  generation: {
    generateClient: true,
    httpClientType: 'axios',
    singleHttpClient: true
  }
};
```

## 🔄 API 模式切换

项目支持两种 API 实现模式：

### 1. 手动模式（默认）
- 使用手动编写的 API 代码
- 完全可控，适合快速开发
- 位置：`src/services/api.ts`

### 2. 生成模式
- 使用从 OpenAPI 规范自动生成的代码
- 保证前后端一致性
- 类型安全，自动更新

### 切换方法

```bash
# 方法1：环境变量
export USE_GENERATED_API=true

# 方法2：修改代码
// src/services/index.ts
const USE_GENERATED_API = true;

# 方法3：启动时指定
USE_GENERATED_API=true npm run dev
```

## 📝 OpenAPI 规范来源

### 1. 远程规范（推荐）

从后端服务自动获取最新规范：

```
http://localhost:9000/api/swagger.json
```

### 2. 本地规范

将 OpenAPI 规范保存为本地文件：

```bash
# 下载远程规范到本地
curl -o api-spec.json http://localhost:9000/api/swagger.json

# 使用本地文件生成
npm run generate-api
```

### 3. 自动同步

使用自动化脚本同步最新规范：

```bash
# 自动下载规范并重新生成代码
npm run api:sync

# 或者使用别名
npm run api:pull
```

## 🛠️ 生成选项

### 基础选项

- `generateClient`: 生成客户端代码
- `generateRouteTypes`: 生成路由类型
- `httpClientType`: HTTP 客户端类型（axios/fetch）
- `singleHttpClient`: 使用单一 HTTP 客户端

### 高级选项

- `extractRequestParams`: 提取请求参数
- `extractResponseError`: 提取响应错误
- `generateUnionEnums`: 生成联合枚举
- `sortTypes`: 排序类型定义
- `cleanOutput`: 清理输出目录

## 🔧 故障排除

### 1. 生成失败

```bash
❌ 生成API代码失败: Cannot connect to backend

# 解决方案：
# 1. 确保后端服务运行在 http://localhost:9000
# 2. 检查 OpenAPI 规范端点是否可访问
# 3. 使用本地规范文件作为备用
```

### 2. 模块兼容性错误

```bash
Error [ERR_REQUIRE_ESM]: require() of ES Module

# 解决方案：使用 ESM 版本的脚本
npm run generate-api  # 使用 generate-api.mjs
```

### 3. 类型错误

```typescript
// 确保导入正确的类型
import type { Photo } from '@/types/api';  // ✅ 正确
import type { Photo } from '@/generated';  // ❌ 可能不兼容
```

## 🔄 更新工作流

### 后端 API 更新时

1. **自动更新**：
   ```bash
   npm run generate-api
   ```

2. **验证更新**：
   ```bash
   npm run build  # 检查类型错误
   npm run dev    # 测试运行时兼容性
   ```

3. **测试 API**：
   访问 `/api-test` 页面测试新的 API 接口

### 切换到生成模式

1. **设置环境变量**：
   ```bash
   export USE_GENERATED_API=true
   ```

2. **重启开发服务器**：
   ```bash
   npm run dev
   ```

3. **验证模式**：
   检查控制台输出：`🔧 API Mode: generated`

## 📊 API 状态监控

### 开发模式信息

```typescript
import { ApiInfo } from '@/services';

console.log(ApiInfo);
// {
//   isUsingGenerated: false,
//   version: '1.0.0',
//   mode: 'manual'
// }
```

### 测试页面

访问 `/api-test` 查看：
- 当前 API 模式
- API 连接状态
- 接口测试结果

## 🎯 最佳实践

### 1. 规范优先设计
- 先定义 OpenAPI 规范
- 再实现前后端代码
- 保持规范文档的及时更新

### 2. 类型安全
- 使用生成的类型定义
- 避免 `any` 类型
- 启用严格的 TypeScript 检查

### 3. 版本控制
- 将生成的代码加入版本控制
- 定期更新并提交生成的代码
- 在 CI/CD 中验证代码生成

### 4. 渐进式迁移
- 先在新功能中使用生成的 API
- 逐步迁移现有代码
- 保持向后兼容性

## 🔗 相关链接

- [swagger-typescript-api 文档](https://github.com/acacode/swagger-typescript-api)
- [OpenAPI 规范](https://swagger.io/specification/)
- [Axios 文档](https://axios-http.com/)

## 📋 TODO

- [ ] 添加 API Mock 功能
- [ ] 集成 API 文档生成
- [ ] 添加更多的自定义模板
- [ ] 实现 API 版本管理
- [ ] 添加性能监控 