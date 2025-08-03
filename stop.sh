#!/bin/bash

echo "🛑 停止康康画画机服务..."
echo "========================"

# 从文件读取PID
if [ -f .api.pid ]; then
    API_PID=$(cat .api.pid)
    if kill $API_PID 2>/dev/null; then
        echo "✅ API服务器已停止 (PID: $API_PID)"
    else
        echo "⚠️  API服务器进程不存在或已停止"
    fi
    rm -f .api.pid
else
    echo "⚠️  未找到API服务器PID文件"
fi

if [ -f .web.pid ]; then
    WEB_PID=$(cat .web.pid)
    if kill $WEB_PID 2>/dev/null; then
        echo "✅ Web服务器已停止 (PID: $WEB_PID)"
    else
        echo "⚠️  Web服务器进程不存在或已停止"
    fi
    rm -f .web.pid
else
    echo "⚠️  未找到Web服务器PID文件"
fi

# 尝试清理其他可能的进程
echo ""
echo "清理其他相关进程..."
pkill -f "node api-proxy.js" 2>/dev/null
pkill -f "serve ." 2>/dev/null

echo ""
echo "========================"
echo "✨ 服务已停止!"