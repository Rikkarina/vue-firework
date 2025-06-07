// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useHistoryStore } from '@/stores/history'
import { useLoadingStore } from '@/stores/loading'
import Layout from '@/views/Layout/MainLayout.vue' // 全局布局组件

const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      // 首页
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/Home/HomePage.vue'),
        meta: { title: '首页', requiresAuth: true }, // 假设需登录
      },
      // 部门详情页
      {
        path: 'department/:id',
        name: 'DepartmentDetail',
        component: () => import('@/views/Department/DepartmentDetail.vue'),
        meta: { title: '部门详情', requiresAuth: true },
      },
      // 文件列表页
      {
        path: 'files/course/:courseId',
        name: 'CourseFiles',
        component: () => import('@/views/File/FileList.vue'),
        meta: { title: '课程文件', requiresAuth: true },
      },
      // 搜索结果页
      {
        path: 'files/search',
        name: 'FileSearch',
        component: () => import('@/views/File/FileList.vue'),
        meta: { title: '搜索结果', requiresAuth: true },
      },
      // 收藏夹页面
      {
        path: 'favorite',
        name: 'Favorite',
        component: () => import('@/views/File/FileList.vue'),
        meta: { title: '我的收藏', requiresAuth: true },
      },
      // 文件上传页面
      {
        path: 'upload',
        name: 'Upload',
        component: () => import('@/views/Upload/UploadPage.vue'),
        meta: { title: '文件上传', requiresAuth: true },
      },
      // 消息中心
      {
        path: 'message',
        name: 'MessageCenter',
        component: () => import('@/views/Message/MessageCenter.vue'),
        meta: {
          title: '消息中心',
          requiresAuth: true,
        },
      },
      // 消息详情
      {
        path: 'message/:id',
        name: 'MessageDetail',
        component: () => import('@/views/Message/MessageCenter.vue'),
        props: (route) => ({
          messageId: route.params.id,
          messageType: route.query.type,
        }),
        meta: {
          title: '消息详情',
          requiresAuth: true,
        },
      },
      // 帮助中心
      {
        path: 'help',
        name: 'HelpCenter',
        component: () => import('@/views/Help/HelpCenter.vue'),
        props: (route) => ({
          section: route.query.section,
        }),
        meta: {
          title: '帮助文档',
          requiresAuth: false,
        },
      },
      // 浏览历史
      {
        path: 'history',
        name: 'History',
        component: () => import('@/views/History/HistoryPage.vue'),
        meta: {
          title: '浏览历史',
          requiresAuth: true,
        },
      },
      {
        path: '/profile',
        name: 'profile',
        component: () => import('@/views/Profile/ProfilePage.vue'),
        meta: {
          requiresAuth: true,
          title: '个人中心',
        },
      },
    ],
  },

  // 登录/注册路由，均指向AuthPage.vue
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login/AuthPage.vue'),
    meta: { title: '登录', requiresAuth: false },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Login/AuthPage.vue'),
    meta: { title: '注册', requiresAuth: false },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const loadingStore = useLoadingStore()

  // 开始加载
  loadingStore.startLoading()

  // 检查登录状态
  authStore.checkAuth()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // 需要登录但未登录，重定向到登录页
    next('/login')
  } else if ((to.path === '/login' || to.path === '/register') && authStore.isAuthenticated) {
    // 已登录用户访问登录/注册页，重定向到首页
    next('/')
  } else {
    // 设置页面标题
    document.title = to.meta.title ? `${to.meta.title} - 消息中心` : '消息中心'
    next()
  }
})

// 记录浏览历史
router.afterEach((to) => {
  const loadingStore = useLoadingStore()

  // 停止加载
  loadingStore.stopLoading()

  // 排除登录、注册页面
  if (to.name !== 'Login' && to.name !== 'Register') {
    const historyStore = useHistoryStore()

    // 如果是课程文件页面，使用课程信息作为标题
    let title = to.meta.title || '未命名页面'
    if (to.name === 'CourseFiles' && to.query.title) {
      title = decodeURIComponent(to.query.title)
    }

    historyStore.addVisitedPage({
      path: to.fullPath,
      title,
      courseId: to.params.courseId,
    })
  }
})

export default router
