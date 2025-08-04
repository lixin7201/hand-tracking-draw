#!/bin/bash

# 启动API代理服务器脚本

echo "🚀 启动AI转画API代理服务器..."

# 检查是否已经有服务在运行
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  端口3001已被占用，尝试停止现有服务..."
    kill $(lsof -Pi :3001 -sTCP:LISTEN -t) 2>/dev/null
    sleep 2
fi

# 检查环境文件
if [ ! -f ".env.local" ]; then
    echo "❌ 错误: .env.local 文件不存在!"
    echo "请创建 .env.local 文件并添加以下内容:"
    echo "OPENROUTER_API_KEY=your_key_here"
    echo "REPLICATE_API_KEY=your_key_here"
    exit 1
fi

# 检查依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install
fi

# 启动服务器
echo "✅ 启动服务器..."
node api-proxy.js