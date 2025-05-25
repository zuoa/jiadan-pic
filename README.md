# 个人照片图库 (jiadan-pic)

一个基于 Umi 4 和 Ant Design 的个人照片图库应用，支持照片上传、管理和展示。

## 项目特性

- 🖼️ 照片上传和管理
- 📱 响应式设计
- 🔐 管理员认证
- 🎨 现代化 UI 设计
- 🚀 基于 Umi 4 + Ant Design 5

## 技术栈

- **前端框架**: Umi 4 + React 18
- **UI 组件**: Ant Design 5
- **API 生成**: @umijs/max-plugin-openapi
- **样式**: Less
- **类型检查**: TypeScript

## API 集成

项目使用 `@umijs/max-plugin-openapi` 插件自动生成 API 接口代码：

### 安装和配置

1. **安装 OpenAPI 插件**：
   ```bash
   npm install --save-dev @umijs/max-plugin-openapi
   ```

2. **配置 .umirc.ts**：
   ```typescript
   import { defineConfig } from "@umijs/max";

   export default defineConfig({
     // 启用插件
     plugins: ['@umijs/max-plugin-openapi'],
     
     // OpenAPI配置
     openAPI: {
       requestLibPath: "import { request } from '@umijs/max'",
       schemaPath: './api-spec.json',
       projectName: 'jiadan-pic-api',
       apiPrefix: '/api',
       namespace: 'API',
       mock: false,
       hook: {
         customFunctionName: () => {
           return 'customApiFunction';
         },
       },
     },
   });
   ```

3. **API 规范文件**：项目根目录的 `api-spec.json` 文件包含完整的 API 规范

### 使用生成的 API

OpenAPI 插件会在开发时自动生成 API 接口代码：

```typescript
// 生成的API会在 src/.umi/plugin-openapi/ 目录中
// 使用示例（待插件完全生成后）：
import { request } from '@umijs/max';

// 登录接口
const loginResult = await request('/api/auth/login', {
  method: 'POST',
  data: {
    username: 'admin',
    password: 'password'
  }
});
```

## 开发指南

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 代码格式化

```bash
npm run format
```

## 项目结构

```
src/
├── pages/           # 页面组件
│   ├── index.tsx    # 首页
│   ├── Gallery/     # 图库页面
│   └── Admin/       # 管理页面
├── components/      # 公共组件
├── services/        # API 服务（简化后）
├── types/          # 类型定义
├── utils/          # 工具函数
├── hooks/          # 自定义 Hooks
├── styles/         # 全局样式
└── assets/         # 静态资源
```

## 环境配置

### 开发环境

- 前端端口：8000
- 后端 API：http://localhost:9000
- 代理配置已在 `.umirc.ts` 中设置

### 生产环境

需要配置正确的 API 基础路径和静态资源路径。

## 清理和重构记录

### ✅ 已完成的清理工作

**删除的无关文件：**
- 文档文件：`OPENAPI_INTEGRATION.md`, `GALLERY_API_INTEGRATION.md`, `backend-api-design.md`, `DEBUG_GUIDE.md`, `PROXY_CONFIG.md`, `API_INTEGRATION.md`, `LOGIN_CREDENTIALS.md`
- 测试文件：`test-api.html`, `api-spec.example.json`
- 旧配置：`openapi.config.js`
- 示例代码：`src/examples/` 目录
- 调试页面：`src/pages/ApiTest/`, `src/pages/Gallery/debug.tsx`, `src/pages/docs.tsx`
- 旧API代码：`src/services/generatedApi.ts`, `src/services/api.ts`, `src/generated/` 目录
- 脚本文件：`scripts/` 目录及其所有内容

**配置更新：**
- ✅ 安装并配置了 `@umijs/max-plugin-openapi`
- ✅ 更新了 `.umirc.ts` 使用正确的 OpenAPI 配置
- ✅ 简化了 `package.json` 脚本
- ✅ 更新了代码文件以移除对已删除 API 的引用
- ✅ 修复了所有构建错误

### 🔄 待完成的工作

1. **API 生成**：启动开发服务器后，OpenAPI 插件会根据 `api-spec.json` 自动生成 API 客户端代码
2. **API 集成**：将生成的 API 代码集成到现有的工具类中（`src/utils/auth.ts`, `src/utils/apiTest.ts`）
3. **页面更新**：更新 Gallery 和 Admin 页面以使用生成的 API

### 📝 使用说明

1. **启动开发服务器**：`npm run dev`
2. **查看 OpenAPI 文档**：访问开发服务器后，OpenAPI 插件会提供 Swagger UI 界面
3. **使用生成的 API**：在 `src/.umi/plugin-openapi/` 目录中查看生成的 API 代码

## 许可证

ISC 