import { defineStore } from 'pinia'
import { getUserInfo, updateUserInfo as updateUserInfoApi } from '@/apis/user'
import { ElMessage } from 'element-plus'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: {
      id: null,
      username: '',
      nickname: '',
      avatar: '',
      email: '',
      role: '',
      lastLoginTime: null
    },
    isLoading: false,
    error: null
  }),

  getters: {
    displayName: (state) => state.userInfo.nickname || state.userInfo.username || '未登录',
    avatarUrl: (state) => state.userInfo.avatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
  },

  actions: {
    async fetchUserInfo() {
      this.isLoading = true
      this.error = null

      try {
        const { data } = await getUserInfo()
        this.userInfo = data

        // 保存到 localStorage 作为缓存
        localStorage.setItem('userInfo', JSON.stringify(data))
      } catch (error) {
        console.error('获取用户信息失败:', error)
        this.error = error.message

        // 如果有缓存的用户信息，使用缓存
        const cachedInfo = localStorage.getItem('userInfo')
        if (cachedInfo) {
          this.userInfo = JSON.parse(cachedInfo)
        }
      } finally {
        this.isLoading = false
      }
    },

    // 初始化用户信息
    initUserInfo() {
      // 首先尝试从缓存加载
      const cachedInfo = localStorage.getItem('userInfo')
      if (cachedInfo) {
        this.userInfo = JSON.parse(cachedInfo)
      }
      // 然后异步获取最新数据
      this.fetchUserInfo()
    },

    // 更新用户信息
    async updateUserInfo(updates) {
      try {
        const { data } = await updateUserInfoApi(updates)
        this.userInfo = { ...this.userInfo, ...data }

        // 更新缓存
        localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
        ElMessage.success('更新用户信息成功')
        return true
      } catch (error) {
        console.error('更新用户信息失败:', error)
        this.error = error.message
        ElMessage.error(error.message || '更新用户信息失败')
        return false
      }
    },

    // 清除用户信息（登出时使用）
    clearUserInfo() {
      this.userInfo = {
        id: null,
        username: '',
        nickname: '',
        avatar: '',
        email: '',
        role: '',
        lastLoginTime: null
      }
      localStorage.removeItem('userInfo')
    }
  }
})
