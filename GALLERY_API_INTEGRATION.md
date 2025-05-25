# Gallery 组件 API 集成说明

## 概述

Gallery 组件已成功集成后端 API，替换了原有的本地模拟数据。现在可以从后端服务获取真实的照片数据。

## 主要变更

### 1. API 调用实现

- **公开照片获取**: 使用 `API.Public.getPublicPhotoList()` 获取公开照片（无需认证）
- **完整照片获取**: 使用 `API.Photo.getPhotoList()` 获取所有照片（需要认证）

### 2. 权限控制

- **未认证用户**: 只能看到 `is_public: true` 的照片
- **已认证用户**: 可以看到所有照片，包括私有照片
- **本地认证**: 使用密码 `jiadan2024` 进行本地验证

### 3. 数据类型统一

- 移除了组件内部的 `Photo` 接口定义
- 使用 `@/types/api` 中的标准 `Photo` 类型
- 字段映射：
  - `isPrivate` → `is_public` (布尔值反转)
  - `category` → `location` (显示地理位置信息)

## API 端点

```typescript
// 公开照片列表（无需认证）
GET /api/public/photos?per_page=100&page=1

// 完整照片列表（需要认证）
GET /api/photos?per_page=100&page=1
```

## 使用方式

### 1. 启动后端服务

确保后端服务运行在 `http://localhost:9000`

### 2. 访问 Gallery

- 未认证访问：`/gallery` - 只显示公开照片
- 输入密码 `jiadan2024` 后可查看完整相册

### 3. 测试 API 连接

访问 `/api-test` 页面可以：
- 测试登录认证
- 测试公开照片 API
- 测试认证照片 API
- 查看返回的数据结构

## 错误处理

### 1. 网络错误

```typescript
catch (error) {
  console.error('获取照片失败:', error);
  message.error('获取照片失败，请检查网络连接');
  setPhotos([]); // 设置为空数组
}
```

### 2. API 响应错误

```typescript
if (response.success && response.data) {
  setPhotos(response.data.photos);
} else {
  message.error('获取照片失败：' + (response.message || '未知错误'));
}
```

## 代理配置

开发环境下使用 UmiJS 代理转发请求：

```typescript
// .umirc.ts
proxy: {
  '/api': {
    target: 'http://localhost:9000/api',
    changeOrigin: true,
    pathRewrite: { '^/api': '/api' }
  }
}
```

## 数据结构

### API 响应格式

```typescript
interface PhotosResponse {
  success: boolean;
  message?: string;
  data: {
    photos: Photo[];
    pagination: {
      page: number;
      per_page: number;
      total: number;
      pages: number;
    };
  };
}
```

### Photo 对象

```typescript
interface Photo {
  id: string;
  title: string;
  description: string;
  src: string;           // 原图 URL
  thumbnail: string;     // 缩略图 URL
  date: string;         // 拍摄日期
  size: string;         // 文件大小
  location: string;     // 地理位置
  is_public: boolean;   // 是否公开
  file_name: string;    // 文件名
  mime_type: string;    // MIME 类型
  created_at: string;   // 创建时间
  updated_at: string;   // 更新时间
}
```

## 注意事项

1. **认证状态**: 本地密码验证状态存储在 localStorage 中
2. **图片 URL**: 后端返回的图片 URL 应该是完整的可访问路径
3. **分页**: 当前设置为获取前 100 张照片，实际部署时可根据需要调整
4. **缓存**: 当认证状态改变时会重新获取照片数据

## 下一步优化

1. 实现真正的 JWT 认证替换本地密码验证
2. 添加图片懒加载和虚拟滚动支持大量照片
3. 实现照片搜索和分类过滤功能
4. 添加照片收藏和分享功能 