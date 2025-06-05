// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
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
        path: 'messages',
        name: 'MessageCenter',
        component: () => import('@/views/Message/MessageCenter.vue'),
        meta: { title: '消息中心', requiresAuth: true },
      },
      // 历史记录
      {
        path: 'history',
        name: 'History',
        component: () => import('@/views/History/BrowsingHistory.vue'),
        meta: { title: '历史记录', requiresAuth: true },
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

  // 检查登录状态
  authStore.checkAuth()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // 需要登录但未登录，重定向到登录页
    next('/login')
  } else if ((to.path === '/login' || to.path === '/register') && authStore.isAuthenticated) {
    // 已登录用户访问登录/注册页，重定向到首页
    next('/')
  } else {
    next()
  }
})

export default router
