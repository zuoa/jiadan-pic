# 构建阶段
FROM node:18-alpine as build

# 设置工作目录
WORKDIR /app

# 复制package文件并安装依赖（利用Docker缓存）
COPY package*.json ./
RUN npm ci --only=production --silent

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 生产阶段
FROM nginx:1.25-alpine

# 安装必要的工具并创建非root用户
RUN apk add --no-cache \
    curl \
    && addgroup -g 1001 -S nginx \
    && adduser -S -D -H -u 1001 -h /var/cache/nginx -s /sbin/nologin -G nginx -g nginx nginx

# 复制构建产物
COPY --from=build /app/dist /usr/share/nginx/html

# 复制nginx配置
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# 设置正确的权限
RUN chown -R nginx:nginx /usr/share/nginx/html \
    && chown -R nginx:nginx /var/cache/nginx \
    && chown -R nginx:nginx /var/log/nginx \
    && chown -R nginx:nginx /etc/nginx/conf.d \
    && touch /var/run/nginx.pid \
    && chown -R nginx:nginx /var/run/nginx.pid

# 切换到非root用户
USER nginx

# 暴露端口
EXPOSE 8000

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/ || exit 1

# 启动nginx
CMD ["nginx", "-g", "daemon off;"]