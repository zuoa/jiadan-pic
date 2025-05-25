# 代理配置说明

本项目已配置开发环境API代理，将前端的`/api`请求自动代理到后端服务`http://localhost:9000/api`。

## 🔧 配置详情

### Umi代理配置

在 `.umirc.ts` 中配置了以下代理规则：

```typescript
proxy: {
  '/api': {
    target: 'http://localhost:9000',
    changeOrigin: true,
    pathRewrite: {
      '^/api': '/api'
    },
    logLevel: 'debug',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    },
    ws: true,
    secure: false,
  },
}
```

### 环境配置

在 `src/config/env.ts` 中管理不同环境的API配置：

- **开发环境**: `/api` (使用代理)
- **生产环境**: 可通过环境变量 `REACT_APP_API_URL` 配置
- **测试环境**: `/api`

## 🚀 使用方法

### 启动开发服务器

1. 确保后端服务运行在 `http://localhost:9000`
2. 启动前端开发服务器：
   ```bash
   npm run dev
   ```

### API请求示例

现在所有API请求都会自动代理：

```typescript
// 这个请求会被代理到 http://localhost:9000/api/photos
const photos = await API.Photo.getPhotoList();

// 这个请求会被代理到 http://localhost:9000/api/auth/login
const loginResult = await API.Auth.login(credentials);
```

## 🔍 代理工作原理

1. **前端请求**: `http://localhost:8000/api/photos`
2. **代理转发**: `http://localhost:9000/api/photos`
3. **响应返回**: 后端响应 → 代理 → 前端

## 📋 优势

1. **解决CORS问题**: 同源请求，无需后端配置CORS
2. **开发便利**: 无需修改API调用代码
3. **环境隔离**: 开发和生产环境使用不同配置
4. **调试友好**: 可在Network面板查看请求详情

## 🐛 调试指南

### 1. 检查代理状态

在浏览器开发者工具的Network面板中：
- 请求URL应该显示为 `http://localhost:8000/api/...`
- Response Headers中应该包含代理添加的头信息

### 2. 查看代理日志

代理配置中启用了 `logLevel: 'debug'`，在控制台可以看到代理日志：

```bash
[HPM] GET /api/photos -> http://localhost:9000
```

### 3. 常见问题

#### 代理不工作
- 检查后端服务是否在9000端口运行
- 确认.umirc.ts配置正确
- 重启开发服务器

#### 请求超时
- 检查后端服务响应时间
- 可以在代理配置中增加timeout设置

#### 认证问题
- 确认JWT token正确传递
- 检查Authorization头是否被代理正确转发

## 🌐 生产环境配置

生产环境不使用代理，需要配置环境变量：

```bash
# .env.production
REACT_APP_API_URL=https://your-api-domain.com/api
```

或者在构建时指定：

```bash
REACT_APP_API_URL=https://your-api-domain.com/api npm run build
```

## 📝 测试代理配置

可以使用API测试工具验证代理是否正常工作：

```javascript
// 在浏览器控制台运行
window.apiTester.testConnection()
```

如果返回成功，说明代理配置正确。

## 🔧 高级配置

### 多个后端服务代理

如果需要代理多个后端服务，可以扩展代理配置：

```typescript
proxy: {
  '/api': {
    target: 'http://localhost:9000',
    // ... 现有配置
  },
  '/upload': {
    target: 'http://localhost:9001',
    changeOrigin: true,
  },
  '/auth': {
    target: 'http://localhost:9002',
    changeOrigin: true,
  },
}
```

### 条件代理

可以根据路径进行条件代理：

```typescript
proxy: {
  '/api': {
    target: 'http://localhost:9000',
    bypass: function (req, res, proxyOptions) {
      // 某些请求不走代理
      if (req.headers.accept.indexOf('html') !== -1) {
        return '/index.html';
      }
    },
  },
}
```

现在代理配置已完成，您可以启动开发服务器测试API连接了！🎉 