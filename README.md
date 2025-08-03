# 手势画图应用

一个基于浏览器的手势绘画应用，使用 MediaPipe 手部追踪技术，让你可以通过手势在空中绘画。

## 功能特点

- 🎨 手势识别绘画
- 📱 支持电脑和手机
- 🎯 多种绘画模式
- 💾 保存作品功能

## 手势控制

- ☝️ **食指伸出**：绘制模式
- ✌️ **两指（食指+中指）**：橡皮擦模式
- 🖐️ **五指张开**：清空画布
- ✊ **握拳/其他手势**：停止绘制

## 部署到 Vercel

### 方法一：通过 Vercel CLI

1. 安装 Vercel CLI：
```bash
npm i -g vercel
```

2. 在项目目录运行：
```bash
vercel
```

3. 按提示操作即可完成部署

### 方法二：通过 GitHub

1. 将代码推送到 GitHub 仓库：
```bash
git init
git add .
git commit -m "初始提交"
git remote add origin 你的仓库地址
git push -u origin main
```

2. 访问 [vercel.com](https://vercel.com)
3. 点击 "New Project"
4. 导入你的 GitHub 仓库
5. 点击 "Deploy" 即可

### 方法三：直接拖拽部署

1. 访问 [vercel.com](https://vercel.com)
2. 登录后进入控制面板
3. 将整个项目文件夹拖拽到页面上
4. 等待部署完成

## 注意事项

- 部署后需要使用 HTTPS 才能访问摄像头
- 首次使用需要允许浏览器摄像头权限
- 建议在光线良好的环境下使用
- 手机端也支持触摸屏直接绘画

## 本地运行

```bash
# 安装依赖（如果需要）
npm install

# 启动本地服务器
npm start
```

然后访问 http://localhost:3000

## 技术栈

- MediaPipe Hands - 手部追踪
- Canvas API - 绘图功能
- 原生 JavaScript - 无框架依赖