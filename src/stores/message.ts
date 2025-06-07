import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getMessages, markMessageAsRead, markAllMessagesAsRead, deleteMessage } from '@/apis/message'
import type { Message, MessageType } from '@/types/message'

export const useMessageStore = defineStore('message', () => {
  const messages = ref<Message[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filterType = ref<'all' | 'unread' | 'read'>('all')
  const messageType = ref<MessageType | null>(null)

  // 计算总消息数
  const totalCount = computed(() => messages.value.length)

  // 计算未读消息数
  const unreadCount = computed(() => messages.value.filter(msg => !msg.isRead).length)

  // 过滤后的消息列表
  const filteredMessages = computed(() => {
    let filtered = [...messages.value]

    // 按状态过滤
    if (filterType.value !== 'all') {
      filtered = filtered.filter(msg =>
        filterType.value === 'unread' ? !msg.isRead : msg.isRead
      )
    }

    // 按类型过滤
    if (messageType.value) {
      filtered = filtered.filter(msg => msg.type === messageType.value)
    }

    // 按时间倒序排序
    return filtered.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
  })

  // 加载消息列表
  const loadMessages = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await getMessages()
      if (response.code === 200) {
        messages.value = response.data.items
      } else {
        throw new Error('加载消息失败')
      }
    } catch (err) {
      error.value = '加载消息失败，请稍后重试'
      console.error('加载消息失败:', err)
    } finally {
      loading.value = false
    }
  }

  // 标记消息为已读
  const markAsRead = async (messageId: number) => {
    try {
      const response = await markMessageAsRead(messageId)
      if (response.code === 200) {
        const message = messages.value.find(msg => msg.id === messageId)
        if (message) {
          message.isRead = true
        }
      }
    } catch (err) {
      console.error('标记已读失败:', err)
      throw err
    }
  }

  // 标记所有消息为已读
  const markAllAsRead = async () => {
    try {
      const response = await markAllMessagesAsRead()
      if (response.code === 200) {
        messages.value.forEach(msg => {
          msg.isRead = true
        })
      }
    } catch (err) {
      console.error('标记全部已读失败:', err)
      throw err
    }
  }

  // 删除消息
  const deleteMessageById = async (messageId: number) => {
    try {
      const response = await deleteMessage(messageId)
      if (response.code === 200) {
        messages.value = messages.value.filter(msg => msg.id !== messageId)
      }
    } catch (err) {
      console.error('删除消息失败:', err)
      throw err
    }
  }

  return {
    messages,
    loading,
    error,
    filterType,
    messageType,
    totalCount,
    unreadCount,
    filteredMessages,
    loadMessages,
    markAsRead,
    markAllAsRead,
    deleteMessage: deleteMessageById
  }
})
