# 康康画画机 - Next.js 版本

基于 Next.js 14 重构的儿童手势绘画应用。

## 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   │   ├── analyze-doodle/
│   │   ├── generate-art/
│   │   └── generate-prompt/
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 主页面
├── components/            # React 组件
│   ├── canvas/           # 画布相关组件
│   │   ├── DrawingCanvas.tsx
│   │   ├── VideoCanvas.tsx
│   │   └── HandCanvas.tsx
│   ├── controls/         # 控制组件
│   │   ├── BrushSelector.tsx
│   │   ├── BrushSizeSlider.tsx
│   │   ├── ColorPicker.tsx
│   │   └── BrushParams.tsx
│   ├── modals/           # 弹窗组件
│   │   ├── SaveModal.tsx
│   │   ├── ColorPaletteModal.tsx
│   │   └── TransformModal.tsx
│   └── ui/               # UI 组件
│       ├── Toolbar.tsx
│       ├── ControlPanel.tsx
│       ├── GestureIndicator.tsx
│       └── SiteTitle.tsx
├── constants/            # 常量定义
│   ├── ai-styles.ts     # AI 艺术风格
│   ├── brushes.ts       # 画笔工具
│   ├── colors.ts        # 颜色配置
│   ├── gestures.ts      # 手势定义
│   └── templates.ts     # 绘画模板
├── hooks/               # 自定义 Hooks
│   ├── useDrawing.ts    # 绘画逻辑
│   └── useGestureDetection.ts # 手势检测
├── types/               # TypeScript 类型
│   ├── drawing.ts       # 绘画相关类型
│   └── gesture.ts       # 手势相关类型
└── utils/               # 工具函数
    ├── brush-effects.ts # 画笔效果
    ├── canvas.ts        # 画布操作
    └── gesture-detection.ts # 手势识别
```

## 技术栈

- **Next.js 14** - React 框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **MediaPipe Hands** - 手势识别
- **OpenAI API** - AI 图像生成

## 安装和运行

1. 安装依赖：
```bash
npm install
```

2. 配置环境变量：
```bash
cp .env.example .env.local
# 编辑 .env.local 添加你的 OpenAI API Key
```

3. 运行开发服务器：
```bash
npm run dev
```

4. 打开浏览器访问：
```
http://localhost:3000
```

## 功能特性

### 手势控制
- ✊ 握拳：停止绘制
- ☝️ 食指：开始绘制
- ✌️ 两指：橡皮擦
- 🖐️ 五指：清空画布
- 👌 捏合：鼠标模式

### 画笔工具
- 马克笔、彩色铅笔、水彩笔
- 铅笔、喷漆、滚刷
- 蜡笔、色粉、橡皮擦

### 绘画模板
- 动物：小猫、小狗、兔子、小熊
- 植物：花朵、大树、太阳、彩虹

### AI 功能
- 涂鸦分析
- 艺术风格转换
- 多种风格选择

## 部署

### Vercel 部署
```bash
npm run build
vercel
```

### Docker 部署
```bash
docker build -t drawing-app .
docker run -p 3000:3000 drawing-app
```

## 代码质量

- 完全模块化的组件结构
- TypeScript 类型安全
- 清晰的代码组织
- 可复用的 Hooks 和工具函数
- 遵循 Next.js 最佳实践

## 许可证

MIT