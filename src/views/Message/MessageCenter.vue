<template>
  <div class="message-center">
    <h2 class="title">消息中心</h2>

    <el-tabs v-model="activeTab" class="message-tabs">
      <el-tab-pane label="活动" name="activity">
        <template #label>
          <el-badge :value="getUnreadCount('activity')" :hidden="!getUnreadCount('activity')">
            活动
          </el-badge>
        </template>
        <el-timeline v-if="activities.length">
          <el-timeline-item
            v-for="item in activities"
            :key="item.id"
            :timestamp="formatTime(item.createdAt)"
            placement="top"
            :type="item.isRead ? 'info' : 'primary'"
          >
            <el-card class="message-card" :class="{ 'unread': !item.isRead }">
              <template #header>
                <div class="card-header">
                  <span class="title">{{ item.title }}</span>
                  <el-tag v-if="!item.isRead" type="warning" effect="plain" size="small">未读</el-tag>
                </div>
              </template>
              <p class="content">{{ item.content }}</p>
              <div class="actions">
                <el-button
                  v-if="!item.isRead"
                  type="primary"
                  link
                  @click="markMessageAsRead(item.id)"
                >
                  标记已读
                </el-button>
                <el-button
                  type="danger"
                  link
                  @click="deleteMessageItem(item.id)"
                >
                  删除
                </el-button>
              </div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
        <el-empty v-else description="暂无活动消息" />
      </el-tab-pane>

      <el-tab-pane label="消息" name="system">
        <template #label>
          <el-badge :value="getUnreadCount('system')" :hidden="!getUnreadCount('system')">
            消息
          </el-badge>
        </template>
        <el-timeline v-if="messages.length">
          <el-timeline-item
            v-for="item in messages"
            :key="item.id"
            :timestamp="formatTime(item.createdAt)"
            placement="top"
            :type="item.isRead ? 'info' : 'success'"
          >
            <el-card class="message-card" :class="{ 'unread': !item.isRead }">
              <template #header>
                <div class="card-header">
                  <span class="title">{{ item.title }}</span>
                  <el-tag v-if="!item.isRead" type="warning" effect="plain" size="small">未读</el-tag>
                </div>
              </template>
              <p class="content">{{ item.content }}</p>
              <div class="actions">
                <el-button
                  v-if="!item.isRead"
                  type="primary"
                  link
                  @click="markMessageAsRead(item.id)"
                >
                  标记已读
                </el-button>
                <el-button
                  type="danger"
                  link
                  @click="deleteMessageItem(item.id)"
                >
                  删除
                </el-button>
              </div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
        <el-empty v-else description="暂无系统消息" />
      </el-tab-pane>

      <el-tab-pane label="通知" name="notification">
        <template #label>
          <el-badge :value="getUnreadCount('notification')" :hidden="!getUnreadCount('notification')">
            通知
          </el-badge>
        </template>
        <el-timeline v-if="notifications.length">
          <el-timeline-item
            v-for="item in notifications"
            :key="item.id"
            :timestamp="formatTime(item.createdAt)"
            placement="top"
            :type="item.isRead ? 'info' : 'warning'"
          >
            <el-card class="message-card" :class="{ 'unread': !item.isRead }">
              <template #header>
                <div class="card-header">
                  <span class="title">{{ item.title }}</span>
                  <el-tag v-if="!item.isRead" type="warning" effect="plain" size="small">未读</el-tag>
                </div>
              </template>
              <p class="content">{{ item.content }}</p>
              <div class="actions">
                <el-button
                  v-if="!item.isRead"
                  type="primary"
                  link
                  @click="markMessageAsRead(item.id)"
                >
                  标记已读
                </el-button>
                <el-button
                  type="danger"
                  link
                  @click="deleteMessageItem(item.id)"
                >
                  删除
                </el-button>
              </div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
        <el-empty v-else description="暂无通知消息" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { getMessageList, getUnreadCount, markAsRead, deleteMessage } from '@/apis/message'
import dayjs from 'dayjs'

export default {
  name: 'MessageCenter',
  setup() {
    const activeTab = ref('activity')
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
      activeTab,
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
  background: var(--el-bg-color);
  border-radius: 8px;
  box-shadow: var(--el-box-shadow-light);
}

.title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
  color: var(--el-text-color-primary);
}

.message-tabs {
  :deep(.el-tabs__nav-wrap) {
    &::after {
      height: 1px;
    }
  }
}

.message-card {
  margin-bottom: 16px;
  transition: all 0.3s ease;
  border: 1px solid var(--el-border-color-light);
}

.message-card.unread {
  border-color: var(--el-color-primary-light-7);
  background-color: var(--el-color-primary-light-9);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title {
  font-size: 16px;
  font-weight: 500;
  margin: 0;
}

.content {
  color: var(--el-text-color-regular);
  font-size: 14px;
  line-height: 1.6;
  margin: 12px 0;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

:deep(.el-timeline) {
  padding: 16px;
}

:deep(.el-timeline-item__node) {
  &.el-timeline-item__node--primary {
    background-color: var(--el-color-primary);
  }
  &.el-timeline-item__node--success {
    background-color: var(--el-color-success);
  }
  &.el-timeline-item__node--warning {
    background-color: var(--el-color-warning);
  }
  &.el-timeline-item__node--info {
    background-color: var(--el-color-info);
  }
}

:deep(.el-timeline-item__wrapper) {
  padding-left: 24px;
}

:deep(.el-timeline-item__timestamp) {
  color: var(--el-text-color-secondary);
  font-size: 13px;
}

:deep(.el-empty) {
  padding: 32px 0;
}
</style>
