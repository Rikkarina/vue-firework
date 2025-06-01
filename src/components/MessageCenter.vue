<!--
  @description 消息中心页面
  @author ufu
  @features
    - 展示活动、系统消息、通知三类消息
    - 支持消息已读/未读状态管理
    - 支持消息删除
    - 支持消息详情查看
    - 展示未读消息数量统计
-->
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
          <div v-for="item in activities" :key="item.id"
               class="message-item"
               :class="{ 'unread': !item.isRead }"
               @click="showMessageDetail(item)">
            <div class="message-title">{{ item.title }}</div>
            <div class="message-content">{{ item.content }}</div>
            <div class="message-footer">
              <span class="message-time">{{ formatTime(item.createdAt) }}</span>
              <div class="message-actions">
                <button @click.stop="markMessageAsRead(item.id)" v-if="!item.isRead">标记已读</button>
                <button @click.stop="deleteMessageItem(item.id)" class="delete">删除</button>
              </div>
            </div>
          </div>
        </template>
        <p v-else class="message-text">暂无活动消息</p>
      </div>
    </section>

    <!-- 消息区域 -->
    <section class="section">
      <div class="section-header">
        <span class="section-title">消息</span>
        <div class="badge-green">{{ getUnreadCount('system') }}</div>
      </div>
      <div class="section-content">
        <template v-if="messages.length">
          <div v-for="item in messages" :key="item.id"
               class="message-item"
               :class="{ 'unread': !item.isRead }"
               @click="showMessageDetail(item)">
            <div class="message-title">{{ item.title }}</div>
            <div class="message-content">{{ item.content }}</div>
            <div class="message-footer">
              <span class="message-time">{{ formatTime(item.createdAt) }}</span>
              <div class="message-actions">
                <button @click.stop="markMessageAsRead(item.id)" v-if="!item.isRead">标记已读</button>
                <button @click.stop="deleteMessageItem(item.id)" class="delete">删除</button>
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
          <div v-for="item in notifications" :key="item.id"
               class="message-item"
               :class="{ 'unread': !item.isRead }"
               @click="showMessageDetail(item)">
            <div class="message-title">{{ item.title }}</div>
            <div class="message-content">{{ item.content }}</div>
            <div class="message-footer">
              <span class="message-time">{{ formatTime(item.createdAt) }}</span>
              <div class="message-actions">
                <button @click.stop="markMessageAsRead(item.id)" v-if="!item.isRead">标记已读</button>
                <button @click.stop="deleteMessageItem(item.id)" class="delete">删除</button>
              </div>
            </div>
          </div>
        </template>
        <p v-else class="message-text">暂无通知消息</p>
      </div>
    </section>

    <!-- 消息详情弹窗 -->
    <div class="message-dialog" v-if="showDialog" @click.self="closeDialog">
      <div class="dialog-content">
        <div class="dialog-header">
          <h3>{{ currentMessage.title }}</h3>
          <button class="close-btn" @click="closeDialog">&times;</button>
        </div>
        <div class="dialog-body">
          <div class="message-meta">
            <span class="message-type">{{ getMessageType(currentMessage.type) }}</span>
            <span class="message-time">{{ formatTime(currentMessage.createdAt) }}</span>
          </div>
          <div class="message-detail-content">
            {{ currentMessage.content }}
          </div>
          <div class="message-attachments" v-if="currentMessage.attachments?.length">
            <h4>附件</h4>
            <div class="attachment-list">
              <div v-for="attachment in currentMessage.attachments"
                   :key="attachment.id"
                   class="attachment-item">
                <span>{{ attachment.name }}</span>
                <button @click="downloadAttachment(attachment)">下载</button>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <button @click="closeDialog">关闭</button>
          <button v-if="!currentMessage.isRead"
                  @click="markMessageAsRead(currentMessage.id)">
            标记已读
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { getMessageList, getUnreadCount, markAsRead, deleteMessage, getMessageDetail } from '@/apis/message'
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
    const showDialog = ref(false)
    const currentMessage = ref({})

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
        if (showDialog.value) {
          currentMessage.value.isRead = true
        }
      } catch (error) {
        console.error('标记消息已读失败:', error)
      }
    }

    // 删除消息
    const deleteMessageItem = async (messageId) => {
      try {
        await deleteMessage(messageId)
        await fetchAllMessages()
        if (showDialog.value && currentMessage.value.id === messageId) {
          closeDialog()
        }
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

    // 显示消息详情
    const showMessageDetail = async (message) => {
      try {
        const { data } = await getMessageDetail(message.id)
        currentMessage.value = data
        showDialog.value = true
      } catch (error) {
        console.error('获取消息详情失败:', error)
      }
    }

    // 关闭详情弹窗
    const closeDialog = () => {
      showDialog.value = false
      currentMessage.value = {}
    }

    // 获取消息类型显示文本
    const getMessageType = (type) => {
      const types = {
        activity: '活动',
        system: '系统消息',
        notification: '通知'
      }
      return types[type] || '其他'
    }

    // 下载附件
    const downloadAttachment = (attachment) => {
      // 实现附件下载逻辑
      window.open(attachment.url, '_blank')
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
      showDialog,
      currentMessage,
      markMessageAsRead,
      deleteMessageItem,
      formatTime,
      showMessageDetail,
      closeDialog,
      getMessageType,
      downloadAttachment,
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
  cursor: pointer;
}

.message-item:last-child {
  border-bottom: none;
}

.message-item.unread {
  background: #f6f6f6;
}

.message-item:hover {
  background: #fafafa;
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
  position: relative;
  z-index: 1;
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

/* 弹窗样式 */
.message-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.dialog-content {
  background: #fff;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.dialog-header {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialog-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
}

.dialog-body {
  padding: 16px;
  overflow-y: auto;
  flex: 1;
}

.message-meta {
  margin-bottom: 16px;
  display: flex;
  gap: 16px;
  color: #666;
  font-size: 14px;
}

.message-detail-content {
  line-height: 1.6;
  color: #333;
  margin-bottom: 24px;
}

.message-attachments h4 {
  margin: 0 0 12px 0;
  color: #333;
}

.attachment-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.attachment-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 4px;
}

.attachment-item button {
  padding: 4px 12px;
  background: #e6f4ff;
  color: #1677ff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.dialog-footer {
  padding: 16px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.dialog-footer button {
  padding: 6px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.dialog-footer button:first-child {
  background: #f0f0f0;
  color: #666;
}

.dialog-footer button:last-child {
  background: #1677ff;
  color: #fff;
}
</style>
