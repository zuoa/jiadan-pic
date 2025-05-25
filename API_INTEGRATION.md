# 后端API接口对接说明

本项目已完成与后端服务的API接口对接，支持完整的照片管理功能。

## 🚀 功能概览

### 已实现的API功能

1. **用户认证**
   - 登录/登出
   - Token验证
   - 认证状态管理

2. **照片管理**
   - 获取照片列表（支持搜索、分页）
   - 上传照片
   - 更新照片信息
   - 删除照片
   - 获取照片详情

3. **公开访问**
   - 获取公开照片列表
   - 获取公开照片详情

4. **仪表板统计**
   - 获取照片统计信息
   - 最近上传的照片

## 📂 文件结构

```
src/
├── types/
│   └── api.ts                 # API类型定义
├── utils/
│   ├── request.ts            # HTTP请求工具
│   ├── auth.ts               # 认证管理（已更新）
│   └── apiTest.ts            # API测试工具
├── services/
│   └── api.ts                # API服务封装
├── hooks/
│   └── useApi.ts             # React API Hooks
└── examples/
    └── apiUsage.ts           # 使用示例
```

## 🔧 配置说明

### API基础配置

API默认配置在 `src/utils/request.ts` 中：

```typescript
const API_BASE_URL = 'http://localhost:9000/api';
```

如需修改后端地址，请更新此配置。

### 认证配置

Token存储键名在 `src/utils/auth.ts` 中：

```typescript
private static readonly STORAGE_KEY = 'admin-auth-token';
private static readonly USER_KEY = 'admin-user';
```

## 📋 使用方法

### 1. 基础API调用

```typescript
import { API } from '@/services/api';

// 登录
const success = await AdminAuth.login('username', 'password');

// 获取照片列表
const photos = await API.Photo.getPhotoList({
  page: 1,
  per_page: 12,
  search: '关键词'
});

// 上传照片
const formData = new FormData();
formData.append('file', file);
await API.Photo.uploadPhoto(file);
```

### 2. 使用React Hooks

```typescript
import { useApi, usePagination } from '@/hooks/useApi';

// 基础API Hook
const { data, loading, error, execute } = useApi();

// 分页Hook
const {
  data: photos,
  loading,
  hasMore,
  loadMore,
  refresh
} = usePagination(
  (page, perPage) => API.Photo.getPhotoList({ page, per_page: perPage })
);
```

### 3. 错误处理

```typescript
import { ApiError } from '@/utils/request';

try {
  await API.Photo.getPhotoList();
} catch (error) {
  if (error instanceof ApiError) {
    console.log('错误状态码:', error.status);
    console.log('错误代码:', error.code);
    console.log('错误信息:', error.message);
  }
}
```

## 🧪 测试API连接

### 方法1：使用测试工具

```typescript
import { ApiTester } from '@/utils/apiTest';

// 测试API连接
await ApiTester.testConnection();

// 测试认证
await ApiTester.testAuth('admin', 'password');

// 运行所有测试
await ApiTester.runAllTests({
  username: 'admin',
  password: 'password'
});
```

### 方法2：浏览器控制台

在任何页面的浏览器控制台中运行：

```javascript
// 首先确保测试工具已加载
import('@/utils/apiTest').then(({ ApiTester }) => {
  ApiTester.exposeToWindow();
});

// 然后可以使用
window.apiTester.testConnection();
window.apiTester.runAllTests({username: 'admin', password: 'password'});
```

## 🔒 认证流程

1. **登录**：调用 `/auth/login` 获取JWT token
2. **存储**：Token存储在localStorage中
3. **自动附加**：所有需要认证的请求自动附加Authorization头
4. **验证**：定期验证token有效性
5. **登出**：清除本地token并调用后端登出接口

## 📡 API接口列表

### 认证接口
- `POST /auth/login` - 用户登录
- `POST /auth/logout` - 用户登出
- `GET /auth/verify` - 验证token

### 照片管理接口
- `GET /photos` - 获取照片列表
- `POST /photos/upload` - 上传照片
- `GET /photos/{id}` - 获取照片详情
- `PUT /photos/{id}` - 更新照片信息
- `DELETE /photos/{id}` - 删除照片

### 公开接口
- `GET /public/photos` - 获取公开照片列表
- `GET /public/photos/{id}` - 获取公开照片详情

### 仪表板接口
- `GET /dashboard/stats` - 获取统计信息

## 🔧 故障排除

### 常见问题

1. **API连接失败**
   - 检查后端服务是否启动（http://localhost:9000）
   - 检查网络连接
   - 查看浏览器控制台错误信息

2. **认证失败**
   - 检查用户名密码是否正确
   - 查看token是否过期
   - 检查Authorization头是否正确发送

3. **CORS错误**
   - 确保后端已配置CORS
   - 检查请求头设置

### 调试建议

1. 开启浏览器开发者工具的网络面板
2. 查看请求和响应详情
3. 使用API测试工具进行排查
4. 查看控制台错误日志

## 🚀 部署注意事项

1. **环境变量**：生产环境需要配置正确的API_BASE_URL
2. **HTTPS**：生产环境建议使用HTTPS
3. **Token安全**：考虑token的安全存储方案
4. **错误监控**：建议接入错误监控服务

## 📝 更新日志

- ✅ 完成所有API接口对接
- ✅ 添加TypeScript类型定义
- ✅ 实现错误处理机制
- ✅ 提供React Hooks封装
- ✅ 添加API测试工具
- ✅ 更新认证管理模块

现在可以开始使用这些API接口进行开发了！🎉 