#!/bin/bash

# Cron job script for automatic sitemap updates
# 定时任务脚本，用于自动更新sitemap
# 
# 添加到crontab示例：
# # 每天凌晨2点更新sitemap
# 0 2 * * * /path/to/cron-update-sitemap.sh >> /var/log/sitemap-update.log 2>&1
#
# # 每次git pull后更新sitemap  
# @reboot sleep 60 && /path/to/cron-update-sitemap.sh

# 设置脚本目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# 日志函数
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

log "🔄 Starting scheduled sitemap update..."

# 检查Node.js
if ! command -v node &> /dev/null; then
    log "❌ Node.js not found. Please install Node.js."
    exit 1
fi

# 检查生成脚本
if [ ! -f "generate-sitemap.js" ]; then
    log "❌ generate-sitemap.js not found in $SCRIPT_DIR"
    exit 1
fi

# 备份当前sitemap
if [ -f "sitemap.xml" ]; then
    cp sitemap.xml sitemap.xml.backup
    log "📋 Backup created: sitemap.xml.backup"
fi

# 生成新的sitemap
log "🚀 Generating new sitemap..."
if node generate-sitemap.js; then
    log "✅ Sitemap generated successfully"
    
    # 比较是否有变化
    if [ -f "sitemap.xml.backup" ]; then
        if cmp -s "sitemap.xml" "sitemap.xml.backup"; then
            log "ℹ️ No changes detected in sitemap"
            rm sitemap.xml.backup
        else
            log "📊 Sitemap updated with new changes"
            log "📈 URL count: $(grep -c "<url>" sitemap.xml)"
            rm sitemap.xml.backup
            
            # 如果在git仓库中，可以选择性提交
            if [ -d ".git" ]; then
                log "📝 Git repository detected"
                # 取消注释下面的行来启用自动git提交
                # git add sitemap.xml
                # git commit -m "🤖 Auto-update sitemap.xml $(date)"
                # log "✅ Changes committed to git"
            fi
        fi
    else
        log "✅ New sitemap created"
        log "📈 URL count: $(grep -c "<url>" sitemap.xml)"
    fi
    
    # 验证生成的sitemap
    if [ -s "sitemap.xml" ] && grep -q "<?xml" sitemap.xml && grep -q "</urlset>" sitemap.xml; then
        log "✅ Sitemap validation passed"
    else
        log "❌ Sitemap validation failed"
        exit 1
    fi
    
else
    log "❌ Failed to generate sitemap"
    
    # 恢复备份
    if [ -f "sitemap.xml.backup" ]; then
        mv sitemap.xml.backup sitemap.xml
        log "🔄 Restored from backup"
    fi
    
    exit 1
fi

log "🎉 Sitemap update completed successfully"

# 可选：通知webhook或API
# curl -X POST "https://your-webhook-url.com/sitemap-updated" \
#   -H "Content-Type: application/json" \
#   -d '{"status":"updated","timestamp":"'$(date -Iseconds)'","urls":'$(grep -c "<url>" sitemap.xml)'}'

# 可选：提交到搜索引擎
# log "📤 Submitting to search engines..."
# curl "http://www.google.com/ping?sitemap=https://randompokegenerator.com/sitemap.xml"
# curl "http://www.bing.com/ping?sitemap=https://randompokegenerator.com/sitemap.xml"