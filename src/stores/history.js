import { defineStore } from 'pinia'

export const useHistoryStore = defineStore('history', {
  state: () => ({
    // 最近浏览记录，每条记录包含详细信息
    visitedPages: []
  }),

  actions: {
    addVisitedPage(page) {
      const { path, title, type, details } = page
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()

      // 检查今天是否已经有相同路径的记录
      const existingTodayRecord = this.visitedPages.find(item => {
        const itemDate = new Date(item.timestamp)
        const itemDay = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate()).getTime()
        return item.path === path && itemDay === today
      })

      const newRecord = {
        path,
        title,
        timestamp: now.toISOString(),
        type: type || 'page', // 页面类型：course（课程）, file（文件）, page（普通页面）
        details: details || null // 详细信息对象
      }

      // 如果今天已经有相同路径的记录，则更新时间戳和详细信息
      if (existingTodayRecord) {
        Object.assign(existingTodayRecord, {
          ...newRecord,
          timestamp: now.toISOString()
        })
        // 将更新的记录移到最前面
        this.visitedPages = [
          existingTodayRecord,
          ...this.visitedPages.filter(item => item !== existingTodayRecord)
        ]
      } else {
        // 添加新记录到开头
        this.visitedPages.unshift(newRecord)

        // 只保留最近50条记录
        if (this.visitedPages.length > 50) {
          this.visitedPages.pop()
        }
      }

      // 保存到localStorage
      this.saveToStorage()
    },

    // 从localStorage加载历史记录
    loadFromStorage() {
      const stored = localStorage.getItem('visited_pages')
      if (stored) {
        try {
          this.visitedPages = JSON.parse(stored)
        } catch (e) {
          console.error('Failed to load history:', e)
          this.visitedPages = []
        }
      }
    },

    // 保存到localStorage
    saveToStorage() {
      localStorage.setItem('visited_pages', JSON.stringify(this.visitedPages))
    },

    // 清空历史记录
    clearHistory() {
      this.visitedPages = []
      localStorage.removeItem('visited_pages')
    }
  },

  getters: {
    // 获取最近的n条记录
    recentVisits: (state) => (limit = 4) => {
      return state.visitedPages.slice(0, limit)
    },

    // 获取所有记录
    allVisits: (state) => {
      return state.visitedPages
    },

    // 按类型获取记录
    visitsByType: (state) => (type) => {
      return state.visitedPages.filter(item => item.type === type)
    }
  }
})
