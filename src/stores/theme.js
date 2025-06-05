import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDark: localStorage.getItem('theme') === 'dark'
  }),

  actions: {
    toggleTheme() {
      this.isDark = !this.isDark
      // 保存到 localStorage
      localStorage.setItem('theme', this.isDark ? 'dark' : 'light')
      // 更新 HTML 的 class
      this.updateHtmlClass()
    },

    // 初始化主题
    initTheme() {
      // 从 localStorage 或系统偏好获取初始主题
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme) {
        this.isDark = savedTheme === 'dark'
      } else {
        // 如果没有保存的主题，则使用系统偏好
        this.isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        localStorage.setItem('theme', this.isDark ? 'dark' : 'light')
      }
      this.updateHtmlClass()
    },

    // 更新 HTML class
    updateHtmlClass() {
      // 更新 HTML 的 class 以触发 CSS 变量切换
      document.documentElement.classList.toggle('dark', this.isDark)
    }
  }
})
