# Firework - 课程资源共享平台

Firework 是一个现代化的课程资源共享平台，集成了资源版本控制系统，为教师和学生提供了一个便捷的资源管理和分享环境。

## 功能特点

- 📚 课程资源管理：支持多种文件格式的上传、下载和预览
- 🔄 版本控制：支持资源版本管理，追踪文件变更历史
- ⭐ 收藏功能：用户可以收藏常用资源，方便快速访问
- 🔍 搜索功能：支持按文件名、类型等条件搜索资源
- 📱 响应式设计：支持多端访问，提供良好的用户体验

## 技术栈

- 前端：Vue 3 + Element Plus
- 后端：Springboot

## 项目结构

```
vue-firework/
├── src/                    # 前端源代码
│   ├── apis/              # API 接口定义
│   ├── assets/            # 静态资源
│   ├── components/        # 公共组件
│   ├── composables/       # 组合式函数
│   ├── router/            # 路由配置
│   ├── store/             # 状态管理
│   ├── types/             # TypeScript 类型定义
│   ├── utils/             # 工具函数
│   └── views/             # 页面组件
│       ├── File/          # 文件管理模块，包含文件列表、上传下载、预览等功能
│       ├── Profile/       # 个人中心模块，管理用户信息、设置和收藏夹
│       ├── Message/       # 消息中心模块，处理系统通知和私信管理
│       ├── History/       # 历史记录模块，记录用户浏览和操作历史
│       ├── Help/          # 帮助中心模块，提供使用指南和问题反馈
│       ├── Home/          # 首页模块，展示数据概览和快捷入口
│       ├── Department/    # 部门管理模块，处理组织结构和权限分配
│       ├── Upload/        # 上传中心模块，管理文件上传和进度
│       ├── Layout/        # 布局组件模块，定义页面整体结构
│       ├── Login/         # 登录认证模块，处理用户登录和注册
│       ├── Browse/        # 资源浏览模块，提供资源分类和搜索
│       └── Resource/      # 资源管理模块，处理资源详情和分享
├── public/                 # 公共资源
├── .eslintrc.js           # ESLint 配置文件
├── .prettierrc            # Prettier 代码格式化配置
├── .gitignore             # Git 忽略文件配置
├── index.html             # 项目入口 HTML
├── vite.config.ts         # Vite 构建工具配置
├── vitest.config.ts       # Vitest 测试框架配置
└── package.json           # 项目配置
```

## 开发环境要求

- Node.js >= 16.0.0
- npm >= 7.0.0

## 安装和运行

1. 克隆项目

```bash
git clone https://github.com/your-username/vue-firework.git
cd vue-firework
```

2. 安装依赖

```bash
# 安装前端依赖
npm install

# 安装模拟后端依赖（用于开发测试）
cd server
npm install
cd ..
```

3. 启动开发服务器

```bash
# 启动前端开发服务器
npm run dev

# 启动模拟后端服务器
cd server
npm run dev
```

4. 访问应用
   打开浏览器访问 `http://localhost:5174`


## 主要功能模块

### 文件管理

- 文件上传和下载
- 文件预览
- 文件版本控制
- 文件收藏

### 课程管理

- 课程列表
- 课程详情
- 课程资源管理

### 用户功能

- 用户认证
- 个人收藏夹
- 资源搜索

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情
