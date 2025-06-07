<!-- 消息中心 -->
<template>
  <div class="message-center">
    <div class="page-header">
      <div class="header-main">
        <h2 class="page-title">消息中心</h2>
        <span class="message-count" v-if="messageStore.totalCount > 0">
          共 {{ messageStore.totalCount }} 条消息
          <template v-if="messageStore.unreadCount > 0">
            （{{ messageStore.unreadCount }} 条未读）
          </template>
        </span>
      </div>
      <div class="filter-section">
        <div class="filter-group">
          <span class="filter-label">状态：</span>
          <el-radio-group v-model="messageStore.filterType" size="default">
            <el-radio-button label="all">全部</el-radio-button>
            <el-radio-button label="unread">未读</el-radio-button>
            <el-radio-button label="read">已读</el-radio-button>
          </el-radio-group>
        </div>
        <div class="filter-group">
          <span class="filter-label">类型：</span>
          <el-select
            v-model="messageStore.messageType"
            placeholder="全部类型"
            size="default"
            clearable
            style="width: 120px"
          >
            <el-option label="活动" value="activity" />
            <el-option label="系统" value="system" />
            <el-option label="消息" value="message" />
          </el-select>
        </div>
        <div class="filter-group" v-if="messageStore.unreadCount > 0">
          <el-button type="primary" @click="messageStore.markAllAsRead">
            全部标记为已读
          </el-button>
        </div>
      </div>
    </div>

    <div class="message-list" v-loading="messageStore.loading" element-loading-text="加载中...">
      <div v-if="messageStore.error" class="error-container">
        <el-empty :description="messageStore.error">
          <template #image>
            <el-icon class="error-icon"><warning /></el-icon>
          </template>
          <el-button type="primary" @click="retryLoad">重试</el-button>
        </el-empty>
      </div>

      <template v-else>
        <div v-for="msg in messageStore.filteredMessages" :key="msg.id" class="message-item">
          <div class="message-card" :class="{ 'unread': !msg.isRead }" @click="showMessageDetail(msg)">
            <div class="message-tag" :class="msg.type">{{ getMessageTypeText(msg.type) }}</div>
            <div class="message-content">
              {{ msg.content }}
            </div>
            <div class="message-time">{{ formatTime(msg.time) }}</div>
            <div class="message-actions">
              <el-button
                v-if="!msg.isRead"
                type="text"
                size="small"
                @click.stop="handleMarkRead(msg)"
              >
                标记已读
              </el-button>
              <el-button
                type="text"
                size="small"
                @click.stop="messageStore.deleteMessage(msg.id)"
              >
                删除
              </el-button>
            </div>
          </div>
        </div>

        <el-empty v-if="!messageStore.filteredMessages.length" :description="getEmptyText()" />
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
          <span class="time">{{ formatTime(currentMessage.time) }}</span>
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
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Warning } from '@element-plus/icons-vue'
import { useMessageStore } from '@/stores/message'
import type { Message, MessageType } from '@/types/message'
import { ElMessage } from 'element-plus'

const router = useRouter()
const messageStore = useMessageStore()

// 对话框控制
const dialogVisible = ref(false)
const currentMessage = ref(null)
const needMarkRead = ref(false)

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

// 格式化时间
const formatTime = (time) => {
  const now = new Date()
  const msgTime = new Date(time)
  const diff = now - msgTime

  // 小于1小时
  if (diff < 1000 * 60 * 60) {
    const minutes = Math.floor(diff / (1000 * 60))
    return `${minutes}分钟前`
  }
  // 小于24小时
  if (diff < 1000 * 60 * 60 * 24) {
    const hours = Math.floor(diff / (1000 * 60 * 60))
    return `${hours}小时前`
  }
  // 小于7天
  if (diff < 1000 * 60 * 60 * 24 * 7) {
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    return `${days}天前`
  }
  // 其他
  return msgTime.toLocaleDateString()
}

// 获取空状态文本
const getEmptyText = () => {
  if (messageStore.messageType && messageStore.filterType !== 'all') {
    return `暂无${messageStore.filterType === 'unread' ? '未读' : '已读'}的${getMessageTypeText(messageStore.messageType)}`
  } else if (messageStore.messageType) {
    return `暂无${getMessageTypeText(messageStore.messageType)}`
  } else if (messageStore.filterType !== 'all') {
    return `暂无${messageStore.filterType === 'unread' ? '未读' : '已读'}消息`
  }
  return '暂无任何消息'
}

// 获取消息类型文本
const getMessageTypeText = (type?: MessageType) => {
  switch (type) {
    case 'activity':
      return '活动'
    case 'system':
      return '系统'
    case 'message':
      return '消息'
    default:
      return '消息'
  }
}

// 获取消息标签类型
const getMessageTagType = (type?: MessageType) => {
  switch (type) {
    case 'activity':
      return 'warning'
    case 'system':
      return 'info'
    case 'message':
      return 'primary'
    default:
      return 'info'
  }
}

// 显示消息详情
const showMessageDetail = (message) => {
  if (!message) return
  currentMessage.value = message
  // 如果是未读消息，标记需要在关闭时设为已读
  needMarkRead.value = !message.isRead
  dialogVisible.value = true
}

// 监听对话框关闭
watch(dialogVisible, async (newVisible) => {
  // 当对话框关闭且需要标记已读时
  if (!newVisible && needMarkRead.value && currentMessage.value) {
    try {
      await messageStore.markAsRead(currentMessage.value.id)
      window.dispatchEvent(new CustomEvent('unread-messages-updated'))
    } catch (err) {
      console.error('标记已读失败:', err)
      ElMessage.error('标记已读失败')
    } finally {
      needMarkRead.value = false
    }
  }
})

// 标记消息已读（列表中的直接标记）
const handleMarkRead = async (message) => {
  if (!message || message.isRead) return

  try {
    await messageStore.markAsRead(message.id)
    window.dispatchEvent(new CustomEvent('unread-messages-updated'))
  } catch (err) {
    console.error('标记已读失败:', err)
    ElMessage.error('标记已读失败')
  }
}

// 重试加载
const retryLoad = () => {
  messageStore.loadMessages()
}

// 监听筛选条件变化
watch(
  () => [messageStore.filterType, messageStore.messageType],
  () => {
    console.log('筛选条件变化:', {
      filterType: messageStore.filterType,
      messageType: messageStore.messageType,
      filteredCount: messageStore.filteredMessages.length
    })
  }
)

// 初始化
onMounted(async () => {
  console.log('消息中心组件已挂载')
  await messageStore.loadMessages()

  // 检查URL参数中是否有消息ID
  const route = router.currentRoute.value
  const messageId = route.query.messageId
  const messageType = route.query.type as MessageType | undefined

  if (messageId) {
    console.log('正在查找消息:', messageId, messageType)
    // 查找指定消息
    const targetMessage = messageStore.messages.find(msg =>
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
  const messageType = newQuery.type as MessageType | undefined

  if (messageId) {
    const targetMessage = messageStore.messages.find(msg =>
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
        position: relative;

        &:hover {
          background: #f9fafb;
          border-color: #d1d5db;

          .message-actions {
            opacity: 1;
          }
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

          &.system {
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

        .message-time {
          font-size: 12px;
          color: #9ca3af;
          white-space: nowrap;
          margin-left: auto;
          padding-left: 16px;
        }

        .message-actions {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          gap: 8px;
          opacity: 0;
          transition: opacity 0.2s ease;
          background: linear-gradient(90deg, transparent, #fff 20%);
          padding-left: 40px;

          .el-button {
            padding: 4px 8px;
            height: auto;
            line-height: 1.5;

            &:hover {
              background: rgba(0, 0, 0, 0.04);
            }
          }
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
