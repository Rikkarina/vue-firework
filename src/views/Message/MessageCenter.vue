<template>
  <div class="message-center">
    <h2 class="title">消息中心</h2>

    <!-- 活动区域 -->
    <section class="section">
      <div class="section-header">
        <span class="section-title">活动</span>
        <div class="badge-orange">{{ getUnreadCount('activity') }}</div>
      </div>
      <div class="section-content">
        <template v-if="activities.length">
          <div v-for="item in activities" :key="item.id" class="message-item" :class="{ 'unread': !item.isRead }">
            <div class="message-title">{{ item.title }}</div>
            <div class="message-content">{{ item.content }}</div>
            <div class="message-footer">
              <span class="message-time">{{ formatTime(item.createdAt) }}</span>
              <div class="message-actions">
                <button @click="markMessageAsRead(item.id)" v-if="!item.isRead">标记已读</button>
                <button @click="deleteMessageItem(item.id)" class="delete">删除</button>
              </div>
            </div>
          </div>
        </template>
        <p v-else class="message-text">暂无活动消息</p>
      </div>
    </section>
HTML Preview
    <!-- 消息区域 -->
    <section class="section">
      <div class="section-header">
        <span class="section-title">消息</span>
        <div class="badge-green">{{ getUnreadCount('system') }}</div>
      </div>
      <div class="section-content">
        <template v-if="messages.length">
          <div v-for="item in messages" :key="item.id" class="message-item" :class="{ 'unread': !item.isRead }">
            <div class="message-title">{{ item.title }}</div>
            <div class="message-content">{{ item.content }}</div>
            <div class="message-footer">
              <span class="message-time">{{ formatTime(item.createdAt) }}</span>
              <div class="message-actions">
                <button @click="markMessageAsRead(item.id)" v-if="!item.isRead">标记已读</button>
                <button @click="deleteMessageItem(item.id)" class="delete">删除</button>
              </div>
            </div>
          </div>
        </template>
        <p v-else class="message-text">暂无系统消息</p>
      </div>
    </section>

    <!-- 通知区域 -->
    <section class="section">
      <div class="section-header">
        <span class="section-title">通知</span>
        <div class="badge-blue">{{ getUnreadCount('notification') }}</div>
      </div>
      <div class="section-content">
        <template v-if="notifications.length">
          <div v-for="item in notifications" :key="item.id" class="message-item" :class="{ 'unread': !item.isRead }">
            <div class="message-title">{{ item.title }}</div>
            <div class="message-content">{{ item.content }}</div>
            <div class="message-footer">
              <span class="message-time">{{ formatTime(item.createdAt) }}</span>
              <div class="message-actions">
                <button @click="markMessageAsRead(item.id)" v-if="!item.isRead">标记已读</button>
                <button @click="deleteMessageItem(item.id)" class="delete">删除</button>
              </div>
            </div>
          </div>
        </template>
        <p v-else class="message-text">暂无通知消息</p>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { getMessageList, getUnreadCount, markAsRead, deleteMessage } from '@/apis/message'
import dayjs from 'dayjs'

export default {
  name: 'MessageCenter',
  setup() {
    const activities = ref([])
    const messages = ref([])
    const notifications = ref([])
    const unreadCounts = ref({
      activity: 0,
      system: 0,
      notification: 0
    })

    // 获取消息列表
    const fetchMessages = async (type) => {
      try {
        const { data } = await getMessageList({ type })
        switch (type) {
          case 'activity':
            activities.value = data
            break
          case 'system':
            messages.value = data
            break
          case 'notification':
            notifications.value = data
            break
        }
      } catch (error) {
        console.error('获取消息列表失败:', error)
      }
    }

    // 获取未读消息数量
    const fetchUnreadCount = async () => {
      try {
        const { data } = await getUnreadCount()
        unreadCounts.value = data
      } catch (error) {
        console.error('获取未读消息数量失败:', error)
      }
    }

    // 标记消息为已读
    const markMessageAsRead = async (messageId) => {
      try {
        await markAsRead(messageId)
        await fetchUnreadCount()
        await fetchAllMessages()
      } catch (error) {
        console.error('标记消息已读失败:', error)
      }
    }

    // 删除消息
    const deleteMessageItem = async (messageId) => {
      try {
        await deleteMessage(messageId)
        await fetchAllMessages()
      } catch (error) {
        console.error('删除消息失败:', error)
      }
    }

    // 获取所有类型的消息
    const fetchAllMessages = async () => {
      await Promise.all([
        fetchMessages('activity'),
        fetchMessages('system'),
        fetchMessages('notification')
      ])
    }

    // 格式化时间
    const formatTime = (time) => {
      return dayjs(time).format('YYYY-MM-DD HH:mm')
    }

    onMounted(() => {
      fetchAllMessages()
      fetchUnreadCount()
    })

    return {
      activities,
      messages,
      notifications,
      unreadCounts,
      markMessageAsRead,
      deleteMessageItem,
      formatTime,
      getUnreadCount: (type) => unreadCounts.value[type] || 0
    }
  }
}
</script>

<style scoped>
.message-center {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
}

.title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #333;
}

.section {
  margin-bottom: 24px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 6px;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 18px;
  font-weight: 500;
  margin-right: 12px;
}

.badge-orange, .badge-green, .badge-blue {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 14px;
  min-width: 20px;
  text-align: center;
}

.badge-orange {
  background: #fff3e6;
  color: #ff9500;
}

.badge-green {
  background: #e6fff0;
  color: #00b96b;
}

.badge-blue {
  background: #e6f4ff;
  color: #1677ff;
}

.section-content {
  padding: 16px;
  background: #fff;
  border-radius: 4px;
}

.message-item {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.3s;
}

.message-item:last-child {
  border-bottom: none;
}

.message-item.unread {
  background: #f6f6f6;
}

.message-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.message-content {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
  line-height: 1.5;
}

.message-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.message-time {
  font-size: 12px;
  color: #999;
}

.message-actions {
  display: flex;
  gap: 8px;
}

.message-actions button {
  padding: 4px 12px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  background: #e6f4ff;
  color: #1677ff;
}

.message-actions button.delete {
  background: #fff1f0;
  color: #ff4d4f;
}

.message-actions button:hover {
  opacity: 0.8;
}

.message-text {
  color: #999;
  font-size: 14px;
  text-align: center;
  margin: 0;
}
</style>
