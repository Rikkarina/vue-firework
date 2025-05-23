# 课程资源管理平台 - 前端开发协作文档

## 1. 项目概述

### 1.1 项目简介

本项目是一个课程资源管理平台，主要功能包括：

- 用户资源上传和管理
- 资源分类和标签管理
- 资源审核流程
- 资源搜索和浏览
- 用户权限管理

### 1.2 技术栈

- 前端框架：Vue 3
- 构建工具：Vite
- UI 框架：Element Plus
- 状态管理：Pinia
- 路由：Vue Router
- HTTP 客户端：Axios
- 测试框架：Vitest (单元测试), Playwright (E2E测试)
- 代码规范：ESLint + Prettier

## 2. 项目结构

### 2.1 目录结构

```
src/
├── apis/          # API 接口定义，通过调用utils中定义的axios实例完成与后端的通信。
├── assets/        # 静态资源，目前只实际使用了logo
├── components/    # 公共组件，仅加入了CourseCard，也就是课程卡片，其他的不用管
├── router/        # 路由配置，设置前端路由
├── stores/        # Pinia 状态管理，将一些数据统一管理，例如用户卡片
├── styles/        # 全局样式，写的时候不用管，可以让AI读一下这个文件夹再写
├── types/         # TypeScript 类型定义，目前定义了一个标准的文件需要什么属性
├── utils/         # 工具函数，目前仅封装了一个axios实例
└── views/         # 页面组件，详细见下方
```

### 2.2 关键目录说明

#### 2.2.1 组件组织

- `components/`: 存放可复用的公共组件
  - 基础组件：如按钮、输入框等
  - 业务组件：如 CourseCard、FileList 等
  - 布局组件：如 Header、Sidebar 等

#### 2.2.2 页面组织

- `views/`: 按功能模块组织的页面组件
  - `File/`: 文件相关页面，里面的FileList是搜索后出现的页面组件
  - `Department/`: 学院管理页面，也就是点击首页某个学院的“查看更多”按钮后，会出现的页面
  - `Login/`: 登录相关页面
  - `Home/`: 首页
  - `Layout/`: 布局组件，上述这些都是它的子组件，由此实现路由跳转，详见router/index.js
  - `Profile/`: 用户资料页面，我还没写，里面是AI生成的
  - `Browse/`: 资源浏览页面，没写
  - `Upload/`: 资源上传页面，没写
  - `Resource/`: 资源管理页面，没写

#### 2.2.3 API 组织

- `apis/`: 按功能模块组织的 API 接口
  - `file.js`: 文件相关接口
  - `department.js`: 部门相关接口
  - `auth.js`: 认证相关接口

## 3. 开发规范

### 3.1 命名规范

#### 3.1.1 文件命名

- 组件文件：使用 PascalCase，如 `CourseCard.vue`
- 工具文件：使用 camelCase，如 `formatDate.js`
- 样式文件：使用 kebab-case，如 `main-style.scss`

#### 3.1.2 组件命名

- 组件名：使用 PascalCase
- 组件属性：使用 camelCase
- 事件名：使用 kebab-case

### 3.2 代码风格

- 使用 ESLint 和 Prettier 进行代码格式化
- 缩进使用 2 个空格
- 使用单引号
- 每行最大长度：100 字符

### 3.3 Git 协作规范

#### 3.3.1 分支管理

- `main`: 主分支，保持稳定
- `develop`: 开发分支，用于集成功能
- `feature/*`: 功能分支，用于开发新功能
- `bugfix/*`: 修复分支，用于修复 bug
- `release/*`: 发布分支，用于版本发布

#### 3.3.2 提交规范

提交信息格式：

```
<type>(<scope>): <subject>

<body>

<footer>
```

type 类型：

- feat: 新功能
- fix: 修复
- docs: 文档
- style: 格式
- refactor: 重构
- test: 测试
- chore: 构建过程或辅助工具的变动

#### 3.3.3 协作流程

1. 从 develop 分支创建功能分支
2. 在功能分支上开发
3. 完成开发后，提交 Pull Request
4. 代码审查通过后，合并到 develop 分支
5. 定期将 develop 分支合并到 main 分支发布

## 4. 开发指南

### 4.1 环境搭建

1. 安装 Node.js (推荐 v18+)
2. 克隆项目

```bash
git clone [项目地址]
```

3. 安装依赖

```bash
npm install
```

4. 启动开发服务器

```bash
npm run dev
```

### 4.2 开发流程

1. 创建功能分支

```bash
git checkout -b feature/your-feature-name
```

2. 开发新功能
3. 提交代码

```bash
git add .
git commit -m "feat: your feature description"
```

4. 推送到远程

```bash
git push origin feature/your-feature-name
```

5. 创建 Pull Request

### 4.3 添加新组件

1. 在 `components` 目录下创建组件文件
2. 编写组件代码
3. 在 `components/__tests__` 目录下添加测试文件
4. 在需要使用的页面中导入并使用

### 4.4 添加新页面

1. 在 `views` 目录下创建页面目录
2. 创建页面组件
3. 在 `router` 中添加路由配置
4. 在 `apis` 中添加相关 API

## 5. 测试规范

### 5.1 单元测试

- 使用 Vitest 进行单元测试
- 测试文件放在 `__tests__` 目录下
- 运行测试：`npm run test:unit`

### 5.2 E2E 测试

- 使用 Playwright 进行 E2E 测试
- 测试文件放在 `e2e` 目录下
- 运行测试：`npm run test:e2e`

## 6. 部署流程

### 6.1 构建

```bash
npm run build
```

### 6.2 预览

```bash
npm run preview
```

## 7. 常见问题

### 7.1 开发环境问题

- 如果遇到依赖安装问题，尝试删除 `node_modules` 并重新安装
- 如果遇到端口占用，可以在 `vite.config.js` 中修改端口配置

### 7.2 代码问题

- 组件通信：优先使用 props 和 emit，复杂状态使用 Pinia
- 样式问题：使用 scoped 样式，避免样式污染
- 性能优化：合理使用 computed 和 watch，避免不必要的渲染

## 8. 资源链接

### 8.1 文档

- [Vue 3 文档](https://v3.vuejs.org/)
- [Element Plus 文档](https://element-plus.org/)
- [Vite 文档](https://vitejs.dev/)
- [Pinia 文档](https://pinia.vuejs.org/)

### 8.2 工具

- [Vue DevTools](https://devtools.vuejs.org/)
- [Vite Plugin Vue DevTools](https://github.com/vuejs/devtools)

## 9. 更新日志

### 9.1 版本历史

- v0.1.0: 项目初始化
- v0.2.0: 添加基础功能
- v0.3.0: 添加文件管理功能

### 9.2 待办事项

- [ ] 完善文件上传功能
- [ ] 添加资源审核流程
- [ ] 优化搜索功能
- [ ] 添加用户权限管理
