import { defineStore } from 'pinia'
import { getMessages, markMessageAsRead, markAllMessagesAsRead, deleteMessage } from '@/apis/message'

export const useMessageStore = defineStore('message', {
  state: () => ({
    messages: [],
    loading: false,
    error: null,
    filterType: 'all',
    messageType: '',
    totalCount: 0,
    unreadCount: 0
  }),

  getters: {
    filteredMessages: (state) => {
      let messages = [...state.messages]

      // 按消息类型筛选
      if (state.messageType) {
        messages = messages.filter(msg => msg.type === state.messageType)
      }

      // 按已读状态筛选
      if (state.filterType === 'unread') {
        messages = messages.filter(msg => !msg.isRead)
      } else if (state.filterType === 'read') {
        messages = messages.filter(msg => msg.isRead)
      }

      // 智能排序：未读在前，按时间倒序
      return messages.sort((a, b) => {
        if (!a.isRead && b.isRead) return -1
        if (a.isRead && !b.isRead) return 1
        return new Date(b.time) - new Date(a.time)
      })
    }
  },

  actions: {
    // 更新筛选条件
    updateFilters(filterType, messageType) {
      this.filterType = filterType
      this.messageType = messageType
    },

    // 加载消息列表
    async loadMessages() {
      this.loading = true
      this.error = null

      try {
        // 尝试从本地存储获取消息
        const localMessages = JSON.parse(localStorage.getItem('messages') || '[]')

        if (localMessages.length > 0) {
          this.messages = localMessages
          this.updateCounts()
        }

        // 从服务器获取最新数据
        const response = await getMessages()

        if (response?.data?.items) {
          this.messages = response.data.items
          localStorage.setItem('messages', JSON.stringify(response.data.items))
          this.updateCounts()
        }
      } catch (err) {
        console.error('Failed to load messages:', err)
        this.error = '加载消息失败，请稍后重试'

        // 如果本地没有数据，使用空数组
        if (!this.messages.length) {
          this.messages = []
        }
      } finally {
        this.loading = false
      }
    },

    // 更新消息计数
    updateCounts() {
      this.totalCount = this.messages.length
      this.unreadCount = this.messages.filter(msg => !msg.isRead).length
    },

    // 标记消息已读
    async markAsRead(messageId) {
      try {
        await markMessageAsRead(messageId)
        const message = this.messages.find(msg => msg.id === messageId)
        if (message) {
          message.isRead = true
          localStorage.setItem('messages', JSON.stringify(this.messages))
          this.updateCounts()
        }
      } catch (err) {
        console.error('Failed to mark message as read:', err)
        throw new Error('标记已读失败')
      }
    },

    // 标记所有消息已读
    async markAllAsRead() {
      try {
        await markAllMessagesAsRead()
        this.messages.forEach(msg => {
          msg.isRead = true
        })
        localStorage.setItem('messages', JSON.stringify(this.messages))
        this.updateCounts()
      } catch (err) {
        console.error('Failed to mark all messages as read:', err)
        throw new Error('标记全部已读失败')
      }
    },

    // 删除消息
    async deleteMessage(messageId) {
      try {
        await deleteMessage(messageId)
        const index = this.messages.findIndex(msg => msg.id === messageId)
        if (index !== -1) {
          this.messages.splice(index, 1)
          localStorage.setItem('messages', JSON.stringify(this.messages))
          this.updateCounts()
        }
      } catch (err) {
        console.error('Failed to delete message:', err)
        throw new Error('删除消息失败')
      }
    }
  }
})
