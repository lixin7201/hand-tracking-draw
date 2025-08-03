#!/bin/bash

echo "🚀 启动康康画画机 - AI涂鸦转画系统"
echo "=================================="

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到Node.js，请先安装Node.js"
    exit 1
fi

# 安装依赖（如果需要）
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install
fi

# 加载环境变量
if [ -f .env.local ]; then
    export $(cat .env.local | grep -v '^#' | xargs)
    echo "✅ 环境变量已加载"
else
    echo "⚠️  警告: .env.local 文件不存在，API密钥未设置"
fi

# 启动API代理服务器
echo "🔧 启动API代理服务器..."
node api-proxy.js > api-server.log 2>&1 &
API_PID=$!
echo "   API服务器PID: $API_PID"

# 等待API服务器启动
sleep 2

# 检查API服务器状态
if curl -s http://localhost:3001/health > /dev/null 2>&1; then
    echo "✅ API服务器已启动 (http://localhost:3001)"
else
    echo "⚠️  警告: API服务器可能未正常启动"
fi

# 启动Web服务器
echo "🌐 启动Web服务器..."
npx serve . -p 3000 > web-server.log 2>&1 &
WEB_PID=$!
echo "   Web服务器PID: $WEB_PID"

# 等待Web服务器启动
sleep 3

# 打开浏览器
echo "🎨 打开应用..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    open http://localhost:3000
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open http://localhost:3000
else
    echo "   请手动打开浏览器访问: http://localhost:3000"
fi

echo ""
echo "=================================="
echo "✨ 系统已启动!"
echo ""
echo "📍 访问地址:"
echo "   主应用: http://localhost:3000"
echo "   测试页面: http://localhost:3000/test-simple.html"
echo "   测试页面2: http://localhost:3000/test-transform.html"
echo ""
echo "📝 日志文件:"
echo "   API服务器: api-server.log"
echo "   Web服务器: web-server.log"
echo ""
echo "🛑 停止服务:"
echo "   运行: ./stop.sh"
echo "   或手动: kill $API_PID $WEB_PID"
echo ""
echo "=================================="

# 保存PID到文件
echo $API_PID > .api.pid
echo $WEB_PID > .web.pid

# 等待用户按键退出
echo ""
echo "按 Ctrl+C 退出..."

# 捕获退出信号
trap "echo '正在停止服务...'; kill $API_PID $WEB_PID 2>/dev/null; rm -f .api.pid .web.pid; exit" INT TERM

# 保持脚本运行
while true; do
    sleep 1
done