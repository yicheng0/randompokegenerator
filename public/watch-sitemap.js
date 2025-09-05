#!/usr/bin/env node

/**
 * Sitemap File Watcher
 * 监视HTML文件变化并自动重新生成sitemap.xml
 */

const fs = require('fs');
const path = require('path');
const { main: generateSitemap } = require('./generate-sitemap.js');

const WATCH_DIR = __dirname;
let isGenerating = false;

/**
 * 防抖函数 - 避免频繁重新生成
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * 生成sitemap的防抖版本
 */
const debouncedGenerate = debounce(() => {
  if (isGenerating) return;
  
  isGenerating = true;
  console.log('🔄 File changes detected, regenerating sitemap...');
  
  try {
    generateSitemap();
    console.log('✅ Sitemap updated successfully!');
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
  } finally {
    isGenerating = false;
  }
}, 2000); // 2秒防抖

/**
 * 检查文件是否需要监视
 */
function shouldWatchFile(fileName) {
  // 监视HTML文件
  if (path.extname(fileName) === '.html') {
    return true;
  }
  
  // 监视sitemap生成脚本自身
  if (fileName === 'generate-sitemap.js') {
    return true;
  }
  
  return false;
}

/**
 * 开始监视文件变化
 */
function startWatching() {
  console.log('👀 Starting file watcher for sitemap auto-generation...');
  console.log(`📁 Watching directory: ${WATCH_DIR}`);
  
  // 监视目录
  fs.watch(WATCH_DIR, { recursive: false }, (eventType, fileName) => {
    if (!fileName || !shouldWatchFile(fileName)) {
      return;
    }
    
    if (eventType === 'change' || eventType === 'rename') {
      console.log(`📝 File ${eventType}: ${fileName}`);
      debouncedGenerate();
    }
  });
  
  // 生成初始sitemap
  console.log('🔄 Generating initial sitemap...');
  try {
    generateSitemap();
    console.log('✅ Initial sitemap generated successfully!');
  } catch (error) {
    console.error('❌ Error generating initial sitemap:', error);
  }
  
  console.log('✅ File watcher is now running. Press Ctrl+C to stop.');
  console.log('📄 Monitoring HTML files for changes...');
  
  // 处理优雅退出
  process.on('SIGINT', () => {
    console.log('\n👋 Stopping file watcher...');
    process.exit(0);
  });
}

// 如果直接运行此脚本
if (require.main === module) {
  startWatching();
}

module.exports = { startWatching };