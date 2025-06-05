<template>
  <div class="message-center">
    <div class="page-header">
      <div class="header-main">
        <h2 class="page-title">消息中心</h2>
        <span class="message-count" v-if="totalCount > 0">
          共 {{ totalCount }} 条消息
          <template v-if="unreadCount > 0">
            （{{ unreadCount }} 条未读）
          </template>
        </span>
      </div>
      <div class="filter-section">
        <div class="filter-group">
          <span class="filter-label">状态：</span>
          <el-radio-group v-model="filterType" size="default">
            <el-radio-button label="all">全部</el-radio-button>
            <el-radio-button label="unread">未读</el-radio-button>
            <el-radio-button label="read">已读</el-radio-button>
          </el-radio-group>
        </div>
        <div class="filter-group">
          <span class="filter-label">类型：</span>
          <el-select
            v-model="messageType"
            placeholder="全部类型"
            size="default"
            clearable
            style="width: 120px"
          >
            <el-option label="活动消息" value="activity" />
            <el-option label="系统消息" value="message" />
            <el-option label="通知消息" value="notification" />
          </el-select>
        </div>
      </div>
    </div>

    <div class="message-list" v-loading="loading" element-loading-text="加载中...">
      <div v-if="error" class="error-container">
        <el-empty :description="error">
          <template #image>
            <el-icon class="error-icon"><warning /></el-icon>
          </template>
          <el-button type="primary" @click="retryLoad">重试</el-button>
        </el-empty>
      </div>

      <template v-else>
        <div v-for="msg in filteredMessages" :key="msg.id" class="message-item" @click="showMessageDetail(msg)">
          <div class="message-card" :class="{ 'unread': !msg.isRead }">
            <div class="message-tag" :class="msg.type">{{ getMessageTypeText(msg.type) }}</div>
            <div class="message-content">
              {{ msg.content || '无内容' }}
            </div>
            <div class="message-time">{{ msg.time }}</div>
          </div>
        </div>

        <el-empty v-if="!filteredMessages.length" :description="getEmptyText()" />
      </template>
    </div>

    <!-- 消息详情对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="getMessageTypeText(currentMessage?.type)"
      width="600px"
      :close-on-click-modal="true"
      :show-close="true"
      destroy-on-close
    >
      <div class="message-detail" v-if="currentMessage">
        <div class="message-info">
          <span class="time">{{ currentMessage.time }}</span>
          <el-tag
            :type="getMessageTagType(currentMessage.type)"
            size="small"
            :effect="currentMessage.isRead ? 'plain' : 'dark'"
          >
            {{ currentMessage.isRead ? '已读' : '未读' }}
          </el-tag>
        </div>
        <div class="content">
          {{ currentMessage.content }}
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">关闭</el-button>
          <el-button
            type="primary"
            @click="handleMarkRead(currentMessage)"
            v-if="currentMessage && !currentMessage.isRead"
          >
            标为已读
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Warning } from '@element-plus/icons-vue'
import { markMessageAsRead } from '@/apis/message'
import request from '@/utils/request'

const router = useRouter()

// 加载状态
const loading = ref(false)
const error = ref('')

// 筛选条件
const filterType = ref('all')
const messageType = ref('')

// 消息列表
const allMessages = ref([])
const totalCount = ref(0)
const unreadCount = ref(0)

// 对话框控制
const dialogVisible = ref(false)
const currentMessage = ref(null)

// 调试信息
const debugInfo = ref({
  lastUpdate: null,
  apiCalls: 0,
  errors: [],
  filterStats: {
    total: 0,
    unread: 0,
    byType: {}
  }
})

// 过滤和排序后的消息列表
const filteredMessages = computed(() => {
  let messages = [...allMessages.value]

  // 按消息类型筛选
  if (messageType.value) {
    messages = messages.filter(msg => msg.type === messageType.value)
  }

  // 按已读状态筛选
  if (filterType.value === 'unread') {
    messages = messages.filter(msg => !msg.isRead)
  } else if (filterType.value === 'read') {
    messages = messages.filter(msg => msg.isRead)
  }

  // 智能排序：未读在前，按时间倒序
  return messages.sort((a, b) => {
    // 首先按已读状态排序
    if (!a.isRead && b.isRead) return -1
    if (a.isRead && !b.isRead) return 1
    // 其次按时间倒序
    return new Date(b.time) - new Date(a.time)
  })
})

// 获取空状态文本
const getEmptyText = () => {
  if (messageType.value && filterType.value !== 'all') {
    return `暂无${filterType.value === 'unread' ? '未读' : '已读'}的${getMessageTypeText(messageType.value)}`
  } else if (messageType.value) {
    return `暂无${getMessageTypeText(messageType.value)}`
  } else if (filterType.value !== 'all') {
    return `暂无${filterType.value === 'unread' ? '未读' : '已读'}消息`
  }
  return '暂无任何消息'
}

// 获取消息类型文本
const getMessageTypeText = (type) => {
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

// 获取消息标签类型
const getMessageTagType = (type) => {
  switch (type) {
    case 'activity':
      return 'warning'
    case 'message':
      return 'primary'
    case 'notification':
      return 'info'
    default:
      return 'default'
  }
}

// 显示消息详情
const showMessageDetail = (message) => {
  if (!message) return

  currentMessage.value = message
  dialogVisible.value = true

  // 如果消息未读，标记为已读
  if (!message.isRead) {
    handleMarkRead(message)
  }

  // 如果消息有链接，跳转到相应页面
  if (message.link) {
    router.push(message.link)
  }
}

// 更新调试统计信息
const updateDebugStats = () => {
  const messages = allMessages.value
  debugInfo.value.filterStats.total = messages.length
  debugInfo.value.filterStats.unread = messages.filter(m => !m.isRead).length
  debugInfo.value.filterStats.byType = messages.reduce((acc, msg) => {
    acc[msg.type] = (acc[msg.type] || 0) + 1
    return acc
  }, {})
  debugInfo.value.lastUpdate = new Date().toISOString()

  // 更新页面显示的计数
  totalCount.value = messages.length
  unreadCount.value = debugInfo.value.filterStats.unread
}

// 加载消息列表
const loadMessages = async () => {
  loading.value = true
  debugInfo.value.apiCalls++

  try {
    console.log('开始加载消息列表...')
    // 尝试从本地存储获取消息
    const localMessages = JSON.parse(localStorage.getItem('messages') || '[]')
    console.log('本地存储消息数:', localMessages.length)

    // 如果本地有数据，先用本地数据
    if (localMessages.length > 0) {
      allMessages.value = localMessages
      updateDebugStats()
      console.log('已加载本地消息数据')
    }

    // 尝试从服务器获取数据
    const response = await request.get('/api/messages', {
      params: {
        pageSize: 50,
        page: 1
      }
    })

    console.log('服务器响应:', response)

    if (response?.data?.items) {
      allMessages.value = response.data.items
      localStorage.setItem('messages', JSON.stringify(response.data.items))
      updateDebugStats()
      console.log('已更新服务器消息数据')
    }
  } catch (err) {
    console.warn('加载消息失败，使用本地/测试数据:', err)
    debugInfo.value.errors.push({
      time: new Date().toISOString(),
      error: err.message
    })

    // 如果本地没有数据，使用测试数据
    if (!allMessages.value.length) {
      allMessages.value = [
        {
          id: 1,
          type: 'activity',
          content: '【测试数据】新的课程评价活动开始啦！',
          time: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          isRead: false
        },
        {
          id: 2,
          type: 'notification',
          content: '【测试数据】系统维护通知',
          time: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          isRead: true
        }
      ]
      localStorage.setItem('messages', JSON.stringify(allMessages.value))
      updateDebugStats()
      console.log('已加载测试数据')
    }
  } finally {
    loading.value = false
  }
}

// 标记消息已读
const handleMarkRead = async (message) => {
  if (!message || message.isRead) return

  try {
    console.log('正在标记消息已读:', message.id)

    // 先更新本地状态
    message.isRead = true
    updateDebugStats()

    // 尝试调用服务器API
    await markMessageAsRead(message.id)
    console.log('消息已标记为已读')

    // 更新本地存储
    localStorage.setItem('messages', JSON.stringify(allMessages.value))

    // 关闭对话框
    dialogVisible.value = false

    // 触发全局事件
    window.dispatchEvent(new CustomEvent('unread-messages-updated'))
  } catch (err) {
    console.warn('标记已读失败，但本地状态已更新:', err)
    debugInfo.value.errors.push({
      time: new Date().toISOString(),
      error: err.message,
      type: 'markRead',
      messageId: message.id
    })
  }
}

// 监听筛选条件变化
watch([filterType, messageType], () => {
  console.log('筛选条件变化:', {
    filterType: filterType.value,
    messageType: messageType.value,
    filteredCount: filteredMessages.value.length
  })
})

// 重试加载
const retryLoad = () => {
  loadMessages()
}

// 初始化
onMounted(async () => {
  console.log('消息中心组件已挂载')
  await loadMessages()

  // 检查URL参数中是否有消息ID
  const route = router.currentRoute.value
  const messageId = route.query.messageId
  const messageType = route.query.type

  if (messageId) {
    console.log('正在查找消息:', messageId, messageType)
    // 查找指定消息
    const targetMessage = allMessages.value.find(msg =>
      msg.id.toString() === messageId.toString() &&
      (!messageType || msg.type === messageType)
    )

    if (targetMessage) {
      console.log('找到目标消息:', targetMessage)
      // 显示消息详情
      currentMessage.value = targetMessage
      dialogVisible.value = true

      // 如果消息未读，标记为已读
      if (!targetMessage.isRead) {
        handleMarkRead(targetMessage)
      }
    } else {
      console.warn('未找到目标消息')
    }
  }
})

// 监听路由变化
watch(() => router.currentRoute.value.query, (newQuery) => {
  const messageId = newQuery.messageId
  const messageType = newQuery.type

  if (messageId) {
    const targetMessage = allMessages.value.find(msg =>
      msg.id.toString() === messageId.toString() &&
      (!messageType || msg.type === messageType)
    )

    if (targetMessage) {
      currentMessage.value = targetMessage
      dialogVisible.value = true
    }
  } else {
    // 如果URL中没有消息ID，关闭对话框
    dialogVisible.value = false
  }
}, { immediate: true })
</script>

<style lang="scss" scoped>
.message-center {
  padding: 24px;
  width: 1200px;
  margin: 0 auto;
  background: #fff;
  border-radius: 4px;
  min-height: calc(100vh - 108px);
  display: flex;
  flex-direction: column;
  overflow-y: scroll;

  .page-header {
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid #f0f0f0;
    flex-shrink: 0;

    .header-main {
      display: flex;
      align-items: center;
      margin-bottom: 16px;

      .page-title {
        font-size: 20px;
        font-weight: 500;
        color: #1f2937;
        margin: 0;
        margin-right: 16px;
      }

      .message-count {
        font-size: 14px;
        color: #6b7280;
      }
    }

    .filter-section {
      display: flex;
      flex-wrap: wrap;
      gap: 24px;
      align-items: center;

      .filter-group {
        display: flex;
        align-items: center;
        gap: 8px;

        .filter-label {
          font-size: 14px;
          color: #4b5563;
          white-space: nowrap;
        }
      }
    }
  }

  .message-list {
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-height: 400px;
    position: relative;

    .message-item {
      width: 100%;

      .message-card {
        width: 100%;
        box-sizing: border-box;
        background: #fff;
        border: 1px solid #e5e7eb;
        border-radius: 4px;
        padding: 16px;
        display: flex;
        gap: 16px;
        transition: all 0.2s ease;

        &:hover {
          background: #f9fafb;
          border-color: #d1d5db;
        }

        &.unread {
          background: #f8f9fa;
          border-left: 3px solid #409eff;
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
          width: 0;
          min-width: 0;
          font-size: 14px;
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
  }
}

:deep(*) {
  scrollbar-width: thin;
  scrollbar-color: #dcdfe6 transparent;

  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #dcdfe6;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
}

.error-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;

  .error-icon {
    font-size: 48px;
    color: #f56c6c;
    margin-bottom: 16px;
  }
}

.message-item {
  cursor: pointer;
}

// 消息详情对话框样式
:deep(.el-dialog) {
  border-radius: 4px;
  overflow: hidden;

  .el-dialog__header {
    margin: 0;
    padding: 16px 20px;
    border-bottom: 1px solid #f0f0f0;
  }

  .el-dialog__body {
    padding: 20px;
  }

  .el-dialog__footer {
    padding: 16px 20px;
    border-top: 1px solid #f0f0f0;
  }
}

.message-detail {
  .message-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .time {
      font-size: 14px;
      color: #6b7280;
    }
  }

  .content {
    font-size: 14px;
    line-height: 1.6;
    color: #1f2937;
    white-space: pre-wrap;
    word-break: break-all;
  }
}

// 空状态样式
:deep(.el-empty) {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
}
</style>
