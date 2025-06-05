<template>
  <div class="message-widget">
    <div class="widget-header">
      <h3 class="widget-title">
        消息中心
        <el-badge :value="unreadCount" :hidden="!unreadCount" class="unread-badge" />
      </h3>
      <router-link :to="{ name: 'Messages' }" class="view-all">
        查看全部
        <el-icon><arrow-right /></el-icon>
      </router-link>
    </div>

    <div class="message-list" v-loading="loading" :element-loading-text="loading ? '加载中...' : ''">
      <template v-if="error">
        <div class="error-tip">
          <el-icon class="error-icon"><warning /></el-icon>
          <span>{{ error }}</span>
          <el-button link type="primary" @click="loadMessages">重试</el-button>
        </div>
      </template>

      <template v-else>
        <div v-for="msg in messages" :key="msg.id" class="message-item" @click="handleMessageClick(msg)">
          <div class="message-card" :class="{ 'unread': !msg.isRead }">
            <div class="message-tag" :class="msg.type">{{ getMessageTypeText(msg.type) }}</div>
            <div class="message-content">
              {{ msg.content }}
            </div>
          </div>
        </div>

        <div v-if="!messages.length" class="empty-tip">
          暂无消息
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowRight, Warning } from '@element-plus/icons-vue'
import type { Message, MessageType } from '@/types/message'
import { getMessages, markMessageAsRead } from '@/apis/message'

const router = useRouter()

// 加载状态
const loading = ref(false)
const error = ref('')

// 测试消息数据
const testMessages: Message[] = [
  {
    id: 1,
    type: 'activity' as MessageType,
    content: '【活动】Python编程竞赛报名开始，点击查看详情',
    time: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1小时前
    isRead: false,
    title: 'Python编程竞赛',
    link: '/activity/python-contest',
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    receiverId: 1,
    metadata: {
      readTime: null,
      importance: 'high',
      category: 'contest'
    }
  },
  {
    id: 2,
    type: 'notification' as MessageType,
    content: '【通知】软件工程课程作业已批改完成',
    time: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2小时前
    isRead: true,
    title: '作业批改通知',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    receiverId: 1,
    metadata: {
      readTime: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30分钟前阅读
      importance: 'medium',
      category: 'homework'
    }
  },
  {
    id: 3,
    type: 'message' as MessageType,
    content: '【提醒】Java课程将在明天下午2点开始',
    time: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 24小时前
    isRead: false,
    title: '课程提醒',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    receiverId: 1,
    metadata: {
      readTime: null,
      importance: 'medium',
      category: 'course'
    }
  },
  {
    id: 4,
    type: 'activity' as MessageType,
    content: '【活动】AI技术讲座，本周四晚8点',
    time: '2024-03-18 14:20:00',
    isRead: false,
    title: 'AI讲座',
    link: '/activity/ai-lecture',
    createdAt: '2024-03-18 14:20:00',
    updatedAt: '2024-03-18 14:20:00',
    receiverId: 1
  },
  {
    id: 5,
    type: 'notification' as MessageType,
    content: '【通知】系统将于本周六凌晨2-4点进行维护',
    time: '2024-03-18 11:00:00',
    isRead: true,
    title: '系统维护通知',
    createdAt: '2024-03-18 11:00:00',
    updatedAt: '2024-03-18 11:00:00',
    receiverId: 1
  }
]

// 消息列表
const messages = ref<Message[]>([])

// 消息历史记录管理
const messageHistory = {
  // 保存消息历史到本地存储
  save: (msgs: Message[]) => {
    try {
      localStorage.setItem('messages', JSON.stringify(msgs))
      localStorage.setItem('messagesLastUpdated', new Date().toISOString())
    } catch (e) {
      console.warn('保存消息历史失败:', e)
    }
  },

  // 从本地存储加载消息历史
  load: (): Message[] => {
    try {
      const stored = localStorage.getItem('messages')
      return stored ? JSON.parse(stored) : []
    } catch (e) {
      console.warn('加载消息历史失败:', e)
      return []
    }
  },

  // 更新消息阅读状态和时间
  markAsRead: (msg: Message) => {
    msg.isRead = true
    msg.metadata = msg.metadata || {}
    msg.metadata.readTime = new Date().toISOString()
    msg.updatedAt = new Date().toISOString()
  },

  // 获取消息阅读时间
  getReadTime: (msg: Message): string | null => {
    return msg.metadata?.readTime || null
  },

  // 按时间排序消息
  sortByTime: (msgs: Message[]): Message[] => {
    return [...msgs].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
  },

  // 获取未读消息
  getUnread: (msgs: Message[]): Message[] => {
    return msgs.filter(msg => !msg.isRead)
  }
}

// 未读消息数量
const unreadCount = computed(() => messages.value.filter(msg => !msg.isRead).length)

// 获取消息类型文本
const getMessageTypeText = (type: MessageType): string => {
  switch (type) {
    case 'activity':
      return '活动'
    case 'message':
      return '消息'
    case 'notification':
      return '通知'
    default:
      return '消息'
  }
}

// 加载消息列表
const loadMessages = async () => {
  if (loading.value) return
  loading.value = true

  try {
    // 从本地存储加载消息
    let localMessages = messageHistory.load()

    // 如果本地没有消息，使用测试数据
    if (!localMessages.length) {
      localMessages = testMessages
      messageHistory.save(localMessages)
    }

    // 按时间排序并只显示最近5条
    messages.value = messageHistory.sortByTime(localMessages).slice(0, 5)
  } catch (e) {
    console.warn('加载消息失败:', e)
  } finally {
    loading.value = false
  }
}

// 处理消息点击
const handleMessageClick = async (message: Message) => {
  if (!message.isRead) {
    try {
      messageHistory.markAsRead(message)
      // 更新本地存储
      const allMessages = messageHistory.load()
      const updatedMessages = allMessages.map(msg =>
        msg.id === message.id ? message : msg
      )
      messageHistory.save(updatedMessages)

      // 触发未读消息更新事件
      window.dispatchEvent(new CustomEvent('unread-messages-updated'))
    } catch (e) {
      console.error('标记已读失败:', e)
    }
  }

  if (message.link) {
    router.push(message.link)
  } else {
    router.push({
      name: 'Messages',
      query: { messageId: message.id.toString() }
    })
  }
}

onMounted(() => {
  loadMessages()
})
</script>

<style lang="scss" scoped>
.message-widget {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;

  .widget-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f0f0f0;
    flex-shrink: 0;

    .widget-title {
      font-size: 16px;
      font-weight: 500;
      color: #1f2937;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 8px;

      .unread-badge {
        margin-top: -2px;
      }
    }

    .view-all {
      font-size: 14px;
      color: #3b82f6;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 4px;

      &:hover {
        color: #2563eb;
      }

      .el-icon {
        font-size: 12px;
      }
    }
  }

  .message-list {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
    position: relative;

    .message-item {
      cursor: pointer;

      .message-card {
        background: #fff;
        border: 1px solid #e5e7eb;
        border-radius: 4px;
        padding: 12px;
        display: flex;
        gap: 12px;
        transition: all 0.2s ease;

        &:hover {
          background: #f9fafb;
          border-color: #d1d5db;
        }

        &.unread {
          background: #f8f9fa;
          border-left: 3px solid #3b82f6;
        }

        .message-tag {
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          white-space: nowrap;
          min-width: 48px;
          text-align: center;
          flex-shrink: 0;

          &.activity {
            background: #fff7e6;
            color: #fa8c16;
          }

          &.message {
            background: #e6f7ff;
            color: #1890ff;
          }

          &.notification {
            background: #f0f5ff;
            color: #2f54eb;
          }
        }

        .message-content {
          flex: 1;
          min-width: 0;
          font-size: 13px;
          line-height: 1.5;
          color: #1f2937;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
    }

    .error-tip {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: #dc2626;
      font-size: 14px;

      .error-icon {
        font-size: 16px;
      }
    }

    .empty-tip {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #6b7280;
      font-size: 14px;
    }
  }
}
</style>
