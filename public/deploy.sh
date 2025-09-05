#!/bin/bash

# Randompoke Deployment Script with Automatic Sitemap Generation
# 部署脚本，包含自动sitemap生成

set -e  # 遇到错误立即退出

echo "🚀 Starting Randompoke deployment..."

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# 生成sitemap
echo "📄 Generating sitemap..."
node generate-sitemap.js

if [ $? -eq 0 ]; then
    echo "✅ Sitemap generated successfully"
else
    echo "❌ Failed to generate sitemap"
    exit 1
fi

# 检查sitemap文件
if [ -f "sitemap.xml" ]; then
    echo "📋 Sitemap.xml contents:"
    echo "$(head -n 10 sitemap.xml)"
    echo "..."
    echo "$(tail -n 5 sitemap.xml)"
    echo ""
    echo "📊 Total URLs: $(grep -c "<url>" sitemap.xml)"
else
    echo "❌ sitemap.xml not found!"
    exit 1
fi

# 验证所有HTML文件存在
echo "🔍 Validating HTML files..."
for file in index.html index-new.html team-builder.html type-calculator.html favorites.html demo.html; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "⚠️ $file not found"
    fi
done

echo "🎉 Deployment preparation complete!"
echo "📁 Files ready for deployment:"
echo "   - sitemap.xml (updated: $(date))"
echo "   - All HTML pages"
echo "   - Static assets"
echo ""
echo "💡 To start the file watcher for development:"
echo "   npm run watch"
echo ""
echo "💡 To manually regenerate sitemap:"
echo "   npm run generate-sitemap"