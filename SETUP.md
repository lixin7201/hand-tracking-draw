# 安装和配置说明

## 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 配置API密钥

复制环境变量示例文件：
```bash
cp .env.example .env.local
```

编辑 `.env.local` 文件，填入您的API密钥：
```
OPENROUTER_API_KEY=your_openrouter_api_key_here
REPLICATE_API_KEY=your_replicate_api_key_here
```

### 3. 启动应用
```bash
./start.sh
```

这将自动：
- 加载环境变量
- 启动API代理服务器 (端口 3001)
- 启动Web服务器 (端口 3000)
- 打开浏览器

### 4. 停止服务
```bash
./stop.sh
```

## 获取API密钥

### OpenRouter (Gemini)
1. 访问 https://openrouter.ai/
2. 注册账号
3. 在设置中获取API密钥

### Replicate (Flux)
1. 访问 https://replicate.com/
2. 注册账号
3. 在账户设置中获取API Token

## 手动启动（开发模式）

如果您需要手动启动服务：

```bash
# 加载环境变量
export $(cat .env.local | grep -v '^#' | xargs)

# 启动API代理服务器
node api-proxy.js

# 在另一个终端启动Web服务器
npm start
```

## 注意事项

- **不要将API密钥提交到Git仓库**
- `.env.local` 文件已在 `.gitignore` 中，不会被提交
- 生产环境应使用适当的环境变量管理方式

## 故障排查

如果遇到问题：

1. 检查 `.env.local` 文件是否存在并包含正确的API密钥
2. 查看日志文件：
   - `api-server.log` - API代理服务器日志
   - `web-server.log` - Web服务器日志
3. 确保端口 3000 和 3001 未被占用

## 测试

访问以下页面测试功能：
- 主应用: http://localhost:3000
- 简单测试: http://localhost:3000/test-simple.html
- 调试测试: http://localhost:3000/test-debug.html