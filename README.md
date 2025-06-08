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
│   │   ├── file.js       # 文件相关接口
│   │   ├── favorite.js   # 收藏相关接口
│   │   └── user.js       # 用户相关接口
│   ├── assets/            # 静态资源
│   ├── components/        # 公共组件
│   │   ├── FileCard.vue  # 文件卡片组件
│   │   └── CourseCard.vue # 课程卡片组件
│   ├── composables/       # 组合式函数
│   │   └── File/         # 文件相关组合式函数
│   │       ├── useFileList.js    # 文件列表逻辑
│   │       ├── useFileDownload.js # 文件下载逻辑
│   │       └── useFilePreview.js # 文件预览逻辑
│   ├── router/            # 路由配置
│   ├── store/             # 状态管理
│   ├── types/             # TypeScript 类型定义
│   │   ├── fileTypes.js  # 文件相关类型
│   │   └── userTypes.js  # 用户相关类型
│   ├── utils/             # 工具函数
│   │   └── http.js       # HTTP 请求封装
│   └── views/             # 页面组件
│       ├── Course/        # 课程相关页面
│       │   ├── CourseList.vue    # 课程列表页
│       │   └── CourseDetail.vue  # 课程详情页
│       ├── File/          # 文件相关页面
│       │   ├── FileList.vue      # 文件列表页
│       │   ├── FilePreviewModal.vue # 文件预览弹窗
│       │   └── components/       # 文件页面组件
│       │       └── VersionHistoryModal.vue # 版本历史弹窗
│       ├── Profile/       # 个人中心页面
│       │   ├── Profile.vue       # 个人资料页
│       │   └── Favorites.vue     # 收藏夹页面
│       └── Resource/      # 资源相关页面
│           └── ResourceDetail.vue # 资源详情页
├── server/                 # 后端源代码
│   ├── routes/            # 路由处理
│   ├── models/            # 数据模型
│   └── utils/             # 工具函数
├── public/                 # 公共资源
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
