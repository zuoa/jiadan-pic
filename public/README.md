# Favicon 配置说明

## 如何添加 favicon

1. **准备 favicon 文件**
   - 将你的 favicon.ico 文件放在这个 `public` 目录下
   - 文件名必须是 `favicon.ico`
   - 推荐尺寸：16x16, 32x32, 48x48 像素

2. **支持的格式**
   - `.ico` (推荐，兼容性最好)
   - `.png` (现代浏览器支持)
   - `.svg` (矢量图标，现代浏览器支持)

3. **在线生成 favicon 工具**
   - https://favicon.io/
   - https://www.favicon-generator.org/
   - https://realfavicongenerator.net/

4. **多尺寸 favicon 配置**
   如果需要支持不同设备的多种尺寸，可以在 `.umirc.ts` 中配置：
   ```typescript
   links: [
     { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
     { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
     { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
     { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
   ]
   ```

## 当前配置

项目已在 `.umirc.ts` 中配置了 favicon 路径：
```typescript
favicon: '/favicon.ico'
```

只需要将你的 favicon.ico 文件放在这个 public 目录下即可。 