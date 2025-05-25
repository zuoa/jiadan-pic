#!/bin/bash

# API规范更新脚本
echo "🚀 开始更新API规范..."

# 检查后端服务是否运行
if curl -f -s http://localhost:9000/api/swagger.json > /dev/null; then
    echo "✅ 后端服务正常运行"
    
    # 下载最新的API规范
    echo "📥 下载最新API规范..."
    curl -o api-spec.json http://localhost:9000/api/swagger.json
    
    if [ $? -eq 0 ]; then
        echo "✅ API规范下载成功"
        
        # 重新生成API代码
        echo "🔄 重新生成API代码..."
        npm run generate-api
        
        if [ $? -eq 0 ]; then
            echo "✅ API代码生成成功！"
            echo "📊 文件统计："
            echo "   - API规范文件: $(wc -l < api-spec.json) 行"
            echo "   - 生成的API文件: $(wc -l < src/generated/Api.ts) 行"
            echo ""
            echo "🎉 API更新完成！"
        else
            echo "❌ API代码生成失败"
            exit 1
        fi
    else
        echo "❌ API规范下载失败"
        exit 1
    fi
else
    echo "❌ 无法连接到后端服务 (http://localhost:9000)"
    echo "   请确保后端服务正在运行"
    exit 1
fi 