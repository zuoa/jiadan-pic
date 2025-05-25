# API调试指南

## 🔍 问题排查

当前已确认后端服务正常运行，但API请求可能没有发送。让我们逐步排查问题。

## 📋 调试步骤

### 1. 启动开发服务器

```bash
npm run dev
```

### 2. 访问API测试页面

**重要提示：** 由于项目使用了hash路由模式，请使用以下方式访问：

**方法1（推荐）**: 
- 访问主页：`http://localhost:8000`
- 等待3秒后会显示导航菜单
- 点击 "🧪 API连接测试" 按钮

**方法2（直接访问）**:
- 访问：`http://localhost:8000/#/api-test` （注意URL中的 `#` 符号）

**❌ 错误的URL**: `http://localhost:8000/api-test` (这会显示404)
**✅ 正确的URL**: `http://localhost:8000/#/api-test`

### 3. 按顺序执行测试

1. **测试基础Fetch (代理)** - 测试代理是否工作
2. **测试API客户端** - 测试我们的API封装
3. **测试API连接工具** - 测试内置的测试工具
4. **测试直连后端** - 绕过代理直接连接

### 4. 查看浏览器开发者工具

#### Network面板检查事项：
- 请求是否发送？
- 请求URL是否正确？
- 请求状态码是什么？
- 请求头是否包含正确的信息？

#### Console面板检查事项：
- 是否有JavaScript错误？
- 是否有我们添加的调试日志？
- 是否有代理相关的日志？

## 🚨 常见问题及解决方案

### 问题0: 页面显示404 Not Found

**症状**: 访问 `/api-test` 显示404

**原因**: 项目使用hash路由模式，需要在URL中包含 `#` 符号

**解决方案**:
- 使用 `http://localhost:8000/#/api-test` 而不是 `http://localhost:8000/api-test`
- 或者访问主页 `http://localhost:8000` 通过导航菜单进入

### 问题1: 代理没有工作

**症状**: 请求直接访问 `http://localhost:8000/api/...` 而不是被代理

**解决方案**:
1. 重启开发服务器
2. 检查 `.umirc.ts` 中的代理配置
3. 确认请求URL以 `/api` 开头

### 问题2: CORS错误

**症状**: `Access-Control-Allow-Origin` 错误

**解决方案**:
1. 使用代理（推荐）
2. 或在后端配置CORS

### 问题3: 请求没有发送

**症状**: Network面板中没有看到任何请求

**可能原因**:
1. JavaScript代码错误阻止了请求
2. 环境配置问题
3. 组件没有正确调用API

### 问题4: 请求发送但没有响应

**症状**: 请求卡在 pending 状态

**可能原因**:
1. 后端服务异常
2. 代理配置错误
3. 网络问题

## 🛠️ 手动测试

### 在浏览器控制台运行

```javascript
// 1. 测试基础fetch
fetch('/api/public/photos?per_page=1&page=1')
  .then(res => res.json())
  .then(data => console.log('基础fetch成功:', data))
  .catch(err => console.error('基础fetch失败:', err));

// 2. 测试API工具（如果已加载）
if (window.apiTester) {
  window.apiTester.testConnection();
}

// 3. 检查环境配置
console.log('当前环境:', process.env.NODE_ENV);
console.log('当前URL:', window.location.href);
```

## 🔧 配置检查清单

### ✅ 代理配置 (.umirc.ts)
```typescript
proxy: {
  '/api': {
    target: 'http://localhost:9000',
    changeOrigin: true,
    // ... 其他配置
  },
}
```

### ✅ 环境配置 (src/config/env.ts)
```typescript
development: {
  API_BASE_URL: '/api', // 使用代理
}
```

### ✅ HTTP客户端 (src/utils/request.ts)
- 使用正确的API_BASE_URL
- 包含调试日志
- 正确处理参数

## 📝 常用调试命令

```bash
# 检查后端服务
curl http://localhost:9000/api/swagger.json

# 启动开发服务器（带详细日志）
DEBUG=* npm run dev

# 检查端口占用
lsof -i :8000
lsof -i :9000
```

## 🎯 快速解决方案

如果以上步骤都没有解决问题，尝试以下快速解决方案：

1. **重启所有服务**
   ```bash
   # 停止前端和后端服务
   # 重新启动后端服务（端口9000）
   # 重新启动前端服务
   npm run dev
   ```

2. **使用直连模式**（临时解决方案）
   ```typescript
   // 在 src/config/env.ts 中临时修改
   development: {
     API_BASE_URL: 'http://localhost:9000/api', // 直连后端
   }
   ```

3. **检查防火墙和安全软件**
   确保没有软件阻止localhost之间的连接

## 📊 成功标志

当一切正常工作时，您应该看到：

1. ✅ 浏览器Network面板显示API请求
2. ✅ 控制台显示我们的调试日志
3. ✅ API测试页面显示成功结果
4. ✅ 终端显示代理转发日志（如 `[HPM] GET /api/photos -> http://localhost:9000`）

## 🆘 如果仍有问题

请提供以下信息：

1. 浏览器控制台的错误信息
2. Network面板的截图
3. 终端的错误日志
4. API测试页面的测试结果

这样我可以更准确地帮助您解决问题。 