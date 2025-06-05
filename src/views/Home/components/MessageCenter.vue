<template>
  <div class="message-center">
    <div class="title-row">
      <div class="title-left">
        <span class="title">消息中心</span>
        <el-tag v-if="totalUnread" type="danger" effect="plain" size="small" round>
          {{ totalUnread }}条未读
        </el-tag>
      </div>
      <el-link :underline="false" @click="router.push('/messages')">查看更多</el-link>
    </div>
    <div v-loading="loading" class="message-list">
      <template v-if="messages.length">
        <el-scrollbar max-height="240px">
          <div
            v-for="msg in messages"
            :key="msg.id"
            class="message-item"
            :class="{ unread: !msg.isRead }"
            @click="handleMessageClick(msg)"
          >
            <div class="message-header">
              <el-tag
                :type="getTagType(msg.type)"
                effect="light"
                size="small"
              >
                {{ getTypeLabel(msg.type) }}
              </el-tag>
              <span class="time">{{ formatTime(msg.createdAt) }}</span>
            </div>
            <div class="message-content">{{ msg.title }}</div>
          </div>
        </el-scrollbar>
      </template>
      <el-empty v-else description="暂无消息" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getMessageList, getUnreadCount, markAsRead } from '@/apis/message'
import dayjs from 'dayjs'

const router = useRouter()
const messages = ref([])
const loading = ref(false)
const totalUnread = ref(0)

// 获取消息列表
const fetchMessages = async () => {
  loading.value = true
  try {
    const { data } = await getMessageList({ limit: 5 })
    messages.value = data
  } catch (error) {
    console.error('获取消息列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 获取未读消息数量
const fetchUnreadCount = async () => {
  try {
    const { data } = await getUnreadCount()
    totalUnread.value = Object.values(data).reduce((sum, count) => sum + count, 0)
  } catch (error) {
    console.error('获取未读消息数量失败:', error)
  }
}

// 处理消息点击
const handleMessageClick = async (msg) => {
  if (!msg.isRead) {
    try {
      await markAsRead(msg.id)
      await Promise.all([fetchMessages(), fetchUnreadCount()])
    } catch (error) {
      console.error('标记消息已读失败:', error)
    }
  }
  router.push('/messages')
}

// 获取标签类型
const getTagType = (type) => {
  const typeMap = {
    activity: 'success',
    system: 'primary',
    notification: 'warning'
  }
  return typeMap[type] || 'info'
}

// 获取类型标签文本
const getTypeLabel = (type) => {
  const typeMap = {
    activity: '活动',
    system: '消息',
    notification: '通知'
  }
  return typeMap[type] || '其他'
}

// 格式化时间
const formatTime = (time) => {
  const now = dayjs()
  const msgTime = dayjs(time)

  if (now.diff(msgTime, 'day') === 0) {
    return msgTime.format('HH:mm')
  } else if (now.diff(msgTime, 'day') === 1) {
    return '昨天'
  } else if (now.diff(msgTime, 'year') === 0) {
    return msgTime.format('MM-DD')
  } else {
    return msgTime.format('YYYY-MM-DD')
  }
}

onMounted(() => {
  fetchMessages()
  fetchUnreadCount()
})
</script>

<style lang="scss" scoped>
.message-center {
  background: var(--el-bg-color);
  border-radius: 8px;
  padding: 16px;
  box-shadow: var(--el-box-shadow-light);

  .title-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .title-left {
      display: flex;
      align-items: center;
      gap: 8px;

      .title {
        font-size: 16px;
        font-weight: 600;
        color: var(--el-text-color-primary);
      }
    }
  }

  .message-list {
    min-height: 240px;
  }

  .message-item {
    padding: 12px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background-color: var(--el-fill-color-light);
    }

    &.unread {
      background-color: var(--el-color-primary-light-9);

      &:hover {
        background-color: var(--el-color-primary-light-8);
      }

      .message-content {
        font-weight: 500;
      }
    }

    .message-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;

      .time {
        font-size: 12px;
        color: var(--el-text-color-secondary);
      }
    }

    .message-content {
      font-size: 14px;
      color: var(--el-text-color-regular);
      line-height: 1.5;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
}
</style>
