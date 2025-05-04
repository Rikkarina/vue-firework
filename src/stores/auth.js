import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login as loginApi, register as registerApi } from '@/apis/auth'
import { ElMessage } from 'element-plus'
import router from '@/router'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const token = ref(null)
    const userInfo = ref(null)
    const isAuthenticated = ref(false)

    // 通用的认证处理方法
    const handleAuthResponse = (data) => {
      token.value = data.token
      userInfo.value = data.userInfo
      isAuthenticated.value = true

      ElMessage.success('操作成功')
      router.push('/')
    }

    // 登录
    const login = async (form) => {
      try {
        const { data } = await loginApi(form)
        handleAuthResponse(data)
      } catch (error) {
        ElMessage.error(error.message || '登录失败')
        throw error
      }
    }

    // 注册
    const register = async (form) => {
      try {
        const { data } = await registerApi(form)
        handleAuthResponse(data)
      } catch (error) {
        ElMessage.error(error.message || '注册失败')
        throw error
      }
    }

    // 登出
    const logout = () => {
      token.value = null
      userInfo.value = null
      isAuthenticated.value = false
      router.push('/login')
    }

    // 检查登录状态
    const checkAuth = () => {
      isAuthenticated.value = !!token.value
    }

    return {
      token,
      userInfo,
      isAuthenticated,
      login,
      register,
      logout,
      checkAuth,
    }
  },
  {
    persist: {
      key: 'auth',
      storage: localStorage,
      paths: ['token', 'userInfo'],
    },
  },
)
