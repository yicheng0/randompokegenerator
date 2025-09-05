#!/usr/bin/env node

/**
 * Automated Sitemap Generator for Randompoke
 * 自动化生成sitemap.xml文件
 */

const fs = require('fs');
const path = require('path');

// 网站配置
const CONFIG = {
  baseUrl: 'https://randompokegenerator.com',
  publicDir: __dirname,
  outputFile: path.join(__dirname, 'sitemap.xml'),
  
  // 页面优先级配置
  pagePriorities: {
    'index.html': { priority: 1.0, changefreq: 'weekly' },
    '/': { priority: 1.0, changefreq: 'weekly' },
    'index-new.html': { priority: 0.9, changefreq: 'weekly' },
    'team-builder.html': { priority: 0.8, changefreq: 'monthly' },
    'type-calculator.html': { priority: 0.8, changefreq: 'monthly' },
    'favorites.html': { priority: 0.7, changefreq: 'monthly' },
    'demo.html': { priority: 0.6, changefreq: 'monthly' }
  },
  
  // 需要排除的文件
  excludeFiles: [
    'generate-sitemap.js',
    'random.js',
    '.git',
    'node_modules',
    'package.json',
    'package-lock.json'
  ]
};

/**
 * 获取文件的最后修改时间
 */
function getLastModified(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.mtime.toISOString().split('T')[0]; // YYYY-MM-DD format
  } catch (error) {
    return new Date().toISOString().split('T')[0];
  }
}

/**
 * 检查文件是否应该被包含在sitemap中
 */
function shouldIncludeFile(fileName) {
  // 排除特定文件
  if (CONFIG.excludeFiles.some(exclude => fileName.includes(exclude))) {
    return false;
  }
  
  // 只包含HTML文件
  if (path.extname(fileName) === '.html') {
    return true;
  }
  
  return false;
}

/**
 * 获取页面的配置信息
 */
function getPageConfig(fileName) {
  const config = CONFIG.pagePriorities[fileName] || {
    priority: 0.5,
    changefreq: 'monthly'
  };
  
  return config;
}

/**
 * 生成URL路径
 */
function generateUrl(fileName) {
  if (fileName === 'index.html') {
    return CONFIG.baseUrl + '/';
  }
  
  return CONFIG.baseUrl + '/' + fileName;
}

/**
 * 扫描目录获取所有HTML文件
 */
function scanDirectory(dir) {
  const files = [];
  
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stats = fs.statSync(fullPath);
      
      if (stats.isFile() && shouldIncludeFile(item)) {
        files.push({
          fileName: item,
          filePath: fullPath,
          lastModified: getLastModified(fullPath),
          ...getPageConfig(item)
        });
      }
    }
  } catch (error) {
    console.error('Error scanning directory:', error);
  }
  
  return files;
}

/**
 * 生成sitemap.xml内容
 */
function generateSitemapXML(pages) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  // 按优先级排序
  pages.sort((a, b) => b.priority - a.priority);
  
  for (const page of pages) {
    const url = generateUrl(page.fileName);
    xml += '  <url>\n';
    xml += `    <loc>${url}</loc>\n`;
    xml += `    <lastmod>${page.lastModified}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += '  </url>\n';
  }
  
  xml += '</urlset>\n';
  return xml;
}

/**
 * 主函数
 */
function main() {
  console.log('🚀 Starting sitemap generation...');
  console.log(`📁 Scanning directory: ${CONFIG.publicDir}`);
  
  // 扫描HTML文件
  const pages = scanDirectory(CONFIG.publicDir);
  
  if (pages.length === 0) {
    console.error('❌ No HTML files found!');
    process.exit(1);
  }
  
  console.log(`📄 Found ${pages.length} pages:`);
  pages.forEach(page => {
    console.log(`  - ${page.fileName} (priority: ${page.priority}, freq: ${page.changefreq})`);
  });
  
  // 生成XML
  const sitemapXML = generateSitemapXML(pages);
  
  // 写入文件
  try {
    fs.writeFileSync(CONFIG.outputFile, sitemapXML, 'utf8');
    console.log(`✅ Sitemap generated successfully: ${CONFIG.outputFile}`);
    console.log(`🌐 Base URL: ${CONFIG.baseUrl}`);
    console.log(`📅 Generated at: ${new Date().toISOString()}`);
  } catch (error) {
    console.error('❌ Error writing sitemap file:', error);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = { main, CONFIG };