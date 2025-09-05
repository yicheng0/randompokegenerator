# 🗺️ 自动化Sitemap生成系统

这个系统可以自动扫描HTML文件并生成sitemap.xml，确保搜索引擎能够发现网站的所有页面。

## 📋 功能特性

- ✅ **自动扫描** - 自动发现所有HTML文件
- ✅ **智能优先级** - 根据页面类型设置优先级和更新频率
- ✅ **实时监控** - 文件变化时自动重新生成sitemap
- ✅ **CI/CD集成** - GitHub Actions自动化部署
- ✅ **最新时间戳** - 自动更新lastmod日期
- ✅ **灵活配置** - 可自定义基础URL、优先级等

## 🚀 快速开始

### 1. 手动生成sitemap
```bash
node generate-sitemap.js
```

### 2. 启动文件监视器（开发环境）
```bash
npm run watch
```

### 3. 部署前自动生成
```bash
./deploy.sh
```

## 📁 文件结构

```
public/
├── generate-sitemap.js     # 核心生成脚本
├── watch-sitemap.js        # 文件监视脚本
├── package.json           # NPM配置
├── deploy.sh             # 部署脚本
├── sitemap.xml          # 生成的sitemap文件
└── .github/workflows/
    └── update-sitemap.yml # GitHub Actions工作流
```

## ⚙️ 配置说明

### 页面优先级配置
在`generate-sitemap.js`中的`CONFIG.pagePriorities`：

```javascript
pagePriorities: {
  'index.html': { priority: 1.0, changefreq: 'weekly' },    // 首页 - 最高优先级
  'index-new.html': { priority: 0.9, changefreq: 'weekly' }, // 生成器页面
  'team-builder.html': { priority: 0.8, changefreq: 'monthly' }, // 工具页面
  'type-calculator.html': { priority: 0.8, changefreq: 'monthly' },
  'favorites.html': { priority: 0.7, changefreq: 'monthly' },
  'demo.html': { priority: 0.6, changefreq: 'monthly' }
}
```

### 基础URL配置
```javascript
baseUrl: 'https://randompokegenerator.com'
```

## 🔄 自动化流程

### 开发环境
1. 运行`npm run watch`启动文件监视器
2. 修改HTML文件时自动重新生成sitemap
3. 2秒防抖避免频繁更新

### 生产环境
1. GitHub Actions在以下情况下自动运行：
   - 推送到main分支且包含HTML文件变化
   - 手动触发工作流
   - 每周日自动运行
2. 自动生成新的sitemap.xml
3. 如有变化则自动提交和推送

## 📊 生成的Sitemap信息

当前生成的sitemap包含以下URL：

| 页面 | 优先级 | 更新频率 | 描述 |
|------|--------|----------|------|
| `/` | 1.0 | weekly | 主页/Landing Page |
| `/index-new.html` | 0.9 | weekly | Random Generator |
| `/team-builder.html` | 0.8 | monthly | Team Builder |
| `/type-calculator.html` | 0.8 | monthly | Type Calculator |
| `/favorites.html` | 0.7 | monthly | My Favorites |
| `/demo.html` | 0.6 | monthly | Framework Demo |

## 🛠️ NPM Scripts

```json
{
  "generate-sitemap": "node generate-sitemap.js",
  "build": "npm run generate-sitemap", 
  "deploy": "npm run generate-sitemap && echo 'Sitemap updated'",
  "watch": "node watch-sitemap.js"
}
```

## 📈 SEO优化

- **最新时间戳** - 每次生成都使用文件的实际修改时间
- **合理优先级** - 重要页面优先级更高
- **适当频率** - 根据页面更新频率设置changefreq
- **标准格式** - 符合XML Sitemap 0.9协议

## 🐛 故障排除

### 1. 脚本运行失败
确保Node.js版本 >= 12.0.0

### 2. 文件监视器不工作
检查文件权限和路径

### 3. GitHub Actions失败
检查workflow权限和token配置

## 📝 日志示例

```
🚀 Starting sitemap generation...
📁 Scanning directory: /path/to/public
📄 Found 6 pages:
  - index.html (priority: 1, freq: weekly)
  - index-new.html (priority: 0.9, freq: weekly)
  - team-builder.html (priority: 0.8, freq: monthly)
✅ Sitemap generated successfully: /path/to/sitemap.xml
🌐 Base URL: https://randompokegenerator.com
📅 Generated at: 2025-09-05T07:14:43.162Z
```

## 🔧 自定义配置

要添加新页面或修改配置：

1. 编辑`generate-sitemap.js`中的`CONFIG`对象
2. 运行`npm run generate-sitemap`测试
3. 提交更改，GitHub Actions会自动处理

## 📞 支持

如有问题，请检查：
1. Node.js版本
2. 文件权限  
3. 网络连接（对于GitHub Actions）
4. 日志输出