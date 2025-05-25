# 图片管理系统后端API设计文档

## 概述

本文档描述了图片管理系统的后端API接口设计，使用Flask框架实现。系统支持用户认证、图片上传、管理和展示等功能。

## 技术栈

- **框架**: Flask
- **数据库**: SQLite
- **文件存储**: 阿里云OSS
- **认证**: JWT Token
- **图片处理**: Pillow
- **API规范**: RESTful

## 数据模型

### 用户模型 (User)
```python
{
    "id": "integer",
    "username": "string",
    "email": "string", 
    "password_hash": "string",
    "created_at": "datetime",
    "updated_at": "datetime"
}
```

### 照片模型 (Photo)
```python
{
    "id": "string",
    "title": "string",
    "description": "string",
    "src": "string",           # 原图URL
    "thumbnail": "string",      # 缩略图URL
    "date": "string",          # 拍摄日期 YYYY-MM-DD
    "size": "string",          # 文件大小 "2.1 MB"
    "location": "string",       # 拍摄地点
    "isPublic": "boolean",     # 是否公开
    "user_id": "integer",      # 所属用户ID
    "file_name": "string",     # 原始文件名
    "file_path": "string",     # 服务器文件路径
    "mime_type": "string",     # 文件MIME类型
    "created_at": "datetime",
    "updated_at": "datetime"
}
```

## API接口设计

### 1. 认证接口

#### 1.1 用户登录
```
POST /api/auth/login
```

**请求体:**
```json
{
    "username": "admin",
    "password": "password"
}
```

**响应:**
```json
{
    "success": true,
    "message": "登录成功",
    "data": {
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        "user": {
            "id": 1,
            "username": "admin",
            "email": "admin@example.com"
        }
    }
}
```

#### 1.2 用户登出
```
POST /api/auth/logout
Authorization: Bearer <token>
```

**响应:**
```json
{
    "success": true,
    "message": "退出登录成功"
}
```

#### 1.3 验证Token
```
GET /api/auth/verify
Authorization: Bearer <token>
```

**响应:**
```json
{
    "success": true,
    "data": {
        "user": {
            "id": 1,
            "username": "admin",
            "email": "admin@example.com"
        }
    }
}
```

### 2. 照片管理接口

#### 2.1 获取照片列表
```
GET /api/photos?page=1&size=10&sort=date&order=desc&public_only=false
Authorization: Bearer <token>
```

**查询参数:**
- `page`: 页码，默认1
- `size`: 每页数量，默认10
- `sort`: 排序字段（date, title, size），默认date
- `order`: 排序方向（asc, desc），默认desc
- `public_only`: 是否只返回公开照片，默认false

**响应:**
```json
{
    "success": true,
    "data": {
        "photos": [
            {
                "id": "1",
                "title": "Beautiful Landscape",
                "description": "Captured at a breathtaking location",
                "src": "/uploads/photos/1/original.jpg",
                "thumbnail": "/uploads/photos/1/thumbnail.jpg",
                "date": "2024-01-15",
                "size": "2.1 MB",
                "location": "黄山风景区",
                "isPublic": true,
                "created_at": "2024-01-15T10:30:00Z"
            }
        ],
        "pagination": {
            "page": 1,
            "size": 10,
            "total": 25,
            "pages": 3
        }
    }
}
```

#### 2.2 获取单张照片
```
GET /api/photos/{photo_id}
Authorization: Bearer <token>
```

**响应:**
```json
{
    "success": true,
    "data": {
        "id": "1",
        "title": "Beautiful Landscape",
        "description": "Captured at a breathtaking location",
        "src": "/uploads/photos/1/original.jpg",
        "thumbnail": "/uploads/photos/1/thumbnail.jpg",
        "date": "2024-01-15",
        "size": "2.1 MB",
        "location": "黄山风景区",
        "isPublic": true,
        "created_at": "2024-01-15T10:30:00Z",
        "updated_at": "2024-01-15T10:30:00Z"
    }
}
```

#### 2.3 上传照片
```
POST /api/photos/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**请求体:**
```
file: <image_file>
title: "Photo Title" (可选)
description: "Photo Description" (可选)
location: "Location" (可选)
date: "2024-01-15" (可选)
isPublic: true/false (可选，默认false)
```

**响应:**
```json
{
    "success": true,
    "message": "照片上传成功",
    "data": {
        "id": "1",
        "title": "未命名照片",
        "description": "",
        "src": "/uploads/photos/1/original.jpg",
        "thumbnail": "/uploads/photos/1/thumbnail.jpg",
        "date": "2024-01-15",
        "size": "2.1 MB",
        "location": "",
        "isPublic": false,
        "created_at": "2024-01-15T10:30:00Z"
    }
}
```

#### 2.4 更新照片信息
```
PUT /api/photos/{photo_id}
Authorization: Bearer <token>
```

**请求体:**
```json
{
    "title": "Updated Title",
    "description": "Updated Description",
    "location": "Updated Location",
    "date": "2024-01-16",
    "isPublic": true
}
```

**响应:**
```json
{
    "success": true,
    "message": "照片信息更新成功",
    "data": {
        "id": "1",
        "title": "Updated Title",
        "description": "Updated Description",
        "src": "/uploads/photos/1/original.jpg",
        "thumbnail": "/uploads/photos/1/thumbnail.jpg",
        "date": "2024-01-16",
        "size": "2.1 MB",
        "location": "Updated Location",
        "isPublic": true,
        "updated_at": "2024-01-15T11:00:00Z"
    }
}
```

#### 2.5 删除照片
```
DELETE /api/photos/{photo_id}
Authorization: Bearer <token>
```

**响应:**
```json
{
    "success": true,
    "message": "照片删除成功"
}
```

### 3. 统计接口

#### 3.1 获取仪表板统计
```
GET /api/dashboard/stats
Authorization: Bearer <token>
```

**响应:**
```json
{
    "success": true,
    "data": {
        "totalPhotos": 25,
        "totalSize": "52.3 MB",
        "thisMonth": 8,
        "publicPhotos": 15,
        "privatePhotos": 10,
        "storageUsed": "52.3 MB",
        "storageLimit": "1 GB"
    }
}
```

### 4. 公开接口（无需认证）

#### 4.1 获取公开照片列表
```
GET /api/public/photos?page=1&size=12
```

**响应:**
```json
{
    "success": true,
    "data": {
        "photos": [
            {
                "id": "1",
                "title": "Beautiful Landscape",
                "description": "Captured at a breathtaking location",
                "src": "/uploads/photos/1/original.jpg",
                "thumbnail": "/uploads/photos/1/thumbnail.jpg",
                "date": "2024-01-15",
                "location": "黄山风景区"
            }
        ],
        "pagination": {
            "page": 1,
            "size": 12,
            "total": 15,
            "pages": 2
        }
    }
}
```

#### 4.2 获取公开照片详情
```
GET /api/public/photos/{photo_id}
```

## 错误处理

### 标准错误响应格式
```json
{
    "success": false,
    "error": {
        "code": "ERROR_CODE",
        "message": "错误描述",
        "details": "详细错误信息"
    }
}
```

### 常见错误码
- `400` - 请求参数错误
- `401` - 未认证
- `403` - 无权限
- `404` - 资源不存在
- `413` - 文件过大
- `415` - 不支持的文件类型
- `422` - 验证失败
- `500` - 服务器内部错误

### 错误示例
```json
{
    "success": false,
    "error": {
        "code": "INVALID_FILE_TYPE",
        "message": "不支持的文件类型",
        "details": "只支持 jpg, png, gif 格式的图片文件"
    }
}
```

## 文件上传限制

- **支持格式**: jpg, jpeg, png, gif, webp
- **文件大小**: 最大 10MB
- **缩略图**: 自动生成 300x200 缩略图
- **存储路径**: `/uploads/photos/{photo_id}/`

## 安全考虑

1. **认证**: 使用JWT Token进行用户认证
2. **文件验证**: 验证文件类型和大小
3. **路径安全**: 防止路径遍历攻击
4. **权限控制**: 用户只能管理自己的照片
5. **CORS**: 配置合适的跨域策略
6. **Rate Limiting**: 实施请求频率限制

## 部署配置

### 环境变量
```bash
FLASK_ENV=production
SECRET_KEY=your-secret-key
DATABASE_URL=sqlite:///photos.db
UPLOAD_FOLDER=/uploads
MAX_CONTENT_LENGTH=10485760  # 10MB
JWT_SECRET_KEY=your-jwt-secret
```

### Nginx配置示例
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location /uploads/ {
        alias /path/to/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## 开发指南

### 1. 项目结构
```
backend/
├── app/
│   ├── __init__.py
│   ├── models/
│   │   ├── user.py
│   │   └── photo.py
│   ├── routes/
│   │   ├── auth.py
│   │   ├── photos.py
│   │   └── public.py
│   ├── utils/
│   │   ├── auth.py
│   │   ├── file_handler.py
│   │   └── image_processor.py
│   └── config.py
├── migrations/
├── uploads/
├── requirements.txt
├── run.py
└── README.md
```

### 2. 主要依赖
```txt
Flask==2.3.0
Flask-SQLAlchemy==3.0.0
Flask-JWT-Extended==4.5.0
Flask-CORS==4.0.0
Pillow==10.0.0
python-dotenv==1.0.0
Werkzeug==2.3.0
```

### 3. 数据库迁移
```bash
# 初始化数据库
flask db init

# 创建迁移
flask db migrate -m "Initial migration"

# 应用迁移
flask db upgrade
```

## 测试用例

### 认证测试
- 正确凭据登录
- 错误凭据登录
- Token验证
- 退出登录

### 照片管理测试
- 上传图片文件
- 获取照片列表
- 更新照片信息
- 删除照片
- 文件类型验证
- 文件大小限制

### 权限测试
- 未认证访问
- 跨用户访问
- 公开照片访问

这份API设计文档涵盖了图片管理系统的所有核心功能，可以直接用于指导Flask后端开发。 