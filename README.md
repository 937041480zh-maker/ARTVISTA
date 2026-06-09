# ArtVista - 交互艺术资产展示与轻交易平台

一个专注于 TouchDesigner、交互艺术、生成艺术、实时视觉、互动装置作品的垂直展示与轻交易平台。

## 技术栈

- **框架**: Next.js 14 (App Router)
- **样式**: Tailwind CSS
- **语言**: TypeScript
- **动画**: Framer Motion
- **图标**: Lucide React

## 开始使用

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 项目结构

```
artvista/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── page.tsx      # 首页
│   │   ├── discover/     # 发现页
│   │   ├── work/         # 作品详情页
│   │   ├── upload/       # 上传页
│   │   ├── about/        # 关于页
│   │   └── profile/      # 个人中心
│   ├── components/       # React 组件
│   │   ├── ui/          # 基础UI组件
│   │   ├── layout/       # 布局组件
│   │   ├── home/         # 首页组件
│   │   ├── discover/     # 发现页组件
│   │   ├── work/         # 作品详情组件
│   │   └── upload/       # 上传页组件
│   └── lib/              # 工具库
│       ├── data/         # 模拟数据
│       ├── types/        # 类型定义
│       └── utils/        # 工具函数
└── public/              # 静态资源
```

## 页面

- `/` - 首页
- `/discover` - 发现作品
- `/work/[id]` - 作品详情
- `/upload` - 上传作品
- `/about` - 关于平台
- `/profile` - 个人中心

## 设计规范

详见 [DESIGN_SPEC.md](../DESIGN_SPEC.md)
