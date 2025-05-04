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
    ],

    //   // 资源浏览与分类
    //   {
    //     path: 'browse',
    //     name: 'Browse',
    //     component: () => import('@/views/Browse/BrowseIndex.vue'),
    //     meta: { title: '资源浏览' },
    //     children: [
    //       // 按类型浏览（课件/笔记/真题等）
    //       {
    //         path: 'type/:type',
    //         name: 'BrowseByType',
    //         component: () => import('@/views/Browse/BrowseType.vue'),
    //       },
    //       // 按专业浏览
    //       {
    //         path: 'major/:major',
    //         name: 'BrowseByMajor',
    //         component: () => import('@/views/Browse/BrowseMajor.vue'),
    //       },
    //     ],
    //   },

    //   // 资源详情页（含下载/收藏功能）
    //   {
    //     path: 'resource/:id',
    //     name: 'ResourceDetail',
    //     component: () => import('@/views/Resource/ResourceDetail.vue'),
    //     meta: { title: '资源详情' },
    //   },

    //   // 资源上传页
    //   {
    //     path: 'upload',
    //     name: 'UploadResource',
    //     component: () => import('@/views/Upload/UploadPage.vue'),
    //     meta: { title: '上传资源', requiresAuth: true },
    //   },

    //   // 个人中心（我的上传/收藏/设置）
    //   {
    //     path: 'profile',
    //     name: 'Profile',
    //     component: () => import('@/views/Profile/ProfileIndex.vue'),
    //     meta: { title: '个人中心', requiresAuth: true },
    //     children: [
    //       {
    //         path: 'my-uploads',
    //         name: 'MyUploads',
    //         component: () => import('@/views/Profile/MyUploads.vue'),
    //       },
    //       {
    //         path: 'favorites',
    //         name: 'Favorites',
    //         component: () => import('@/views/Profile/Favorites.vue'),
    //       },
    //       {
    //         path: 'settings',
    //         name: 'Settings',
    //         component: () => import('@/views/Profile/Settings.vue'),
    //       },
    //     ],
    //   },

    //   // 搜索结果页
    //   {
    //     path: 'search',
    //     name: 'Search',
    //     component: () => import('@/views/Search/SearchResults.vue'),
    //     meta: { title: '搜索结果' },
    //   },
    // ],
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

  // 登录/注册（假设需权限控制）
  // {
  //   path: '/login',
  //   name: 'Login',
  //   component: () => import('@/views/Login/LoginPage.vue'),
  //   meta: { title: '登录' },
  // },
  // {
  //   path: '/register',
  //   name: 'Register',
  //   component: () => import('@/views/Login/RegisterPage.vue'),
  //   meta: { title: '注册' },
  // },

  // // 404页面
  // {
  //   path: '/:pathMatch(.*)*',
  //   name: 'NotFound',
  //   component: () => import('@/views/Error/404.vue'),
  // },
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
