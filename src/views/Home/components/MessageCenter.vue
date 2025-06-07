<template>
  <div class="message-center">
    <div class="title-row">
      <span>消息中心</span>
      <router-link class="more" to="/message">查看更多</router-link>
    </div>
    <div v-if="loading" class="loading-state">
      <el-skeleton :rows="3" animated />
    </div>
    <template v-else>
      <div v-if="error" class="error-state">
        <el-empty :description="error">
          <template #image>
            <el-icon class="error-icon"><warning /></el-icon>
          </template>
        </el-empty>
      </div>
      <ul v-else class="message-list">
        <li v-for="msg in displayMessages" :key="msg.id" @click="handleMessageClick(msg)">
          <span class="tag" :class="getTypeClass(msg.type)">{{ getTypeShort(msg.type) }}</span>
          <span class="content" :class="{ unread: !msg.isRead }">{{ msg.content }}</span>
          <span v-if="!msg.isRead" class="unread-dot"></span>
        </li>
        <li v-if="!displayMessages.length" class="empty-state">
          暂无消息
        </li>
      </ul>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMessageStore } from '@/stores/message'
import { Warning } from '@element-plus/icons-vue'

const router = useRouter()
const messageStore = useMessageStore()

const loading = ref(true)
const error = ref(null)

// 只显示最新的4条消息
const displayMessages = computed(() => {
  const sortedMessages = [...messageStore.messages].sort((a, b) => new Date(b.time) - new Date(a.time))
  return sortedMessages.slice(0, 4)
})

// 获取消息类型简写
const getTypeShort = (type) => {
  switch (type) {
    case 'activity':
      return '活'
    case 'message':
      return '消'
    case 'system':
      return '系'
    default:
      return '消'
  }
}

// 获取消息类型样式类名
const getTypeClass = (type) => {
  switch (type) {
    case 'activity':
      return 'activity'
    case 'message':
      return 'message'
    case 'system':
      return 'system'
    default:
      return 'message'
  }
}

// 处理消息点击
const handleMessageClick = (message) => {
  router.push(`/message/${message.id}?type=${message.type}`)
}

// 初始化
onMounted(async () => {
  try {
    await messageStore.loadMessages()
  } catch {
    error.value = '加载消息失败'
  } finally {
    loading.value = false
  }
})
</script>

<style lang="scss" scoped>
.message-center {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px #f0f1f2;

  .title-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    span {
      font-size: 16px;
      font-weight: 500;
      color: #1f2937;
    }

    .more {
      font-size: 13px;
      color: #409eff;
      text-decoration: none;

      &:hover {
        color: #66b1ff;
      }
    }
  }

  .message-list {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      display: flex;
      align-items: center;
      padding: 8px 0;
      cursor: pointer;
      position: relative;
      transition: background-color 0.2s;

      &:hover {
        background-color: #f9fafb;
      }

      .tag {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 20px;
        border-radius: 4px;
        margin-right: 8px;
        font-size: 12px;
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

      .content {
        flex: 1;
        font-size: 14px;
        color: #4b5563;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        line-height: 1.5;

        &.unread {
          color: #1f2937;
          font-weight: 500;
        }
      }

      .unread-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #409eff;
        margin-left: 8px;
      }
    }

    .empty-state {
      text-align: center;
      color: #9ca3af;
      padding: 16px 0;
      font-size: 14px;
    }
  }

  .loading-state {
    padding: 8px 0;
  }

  .error-state {
    padding: 16px 0;
    text-align: center;

    .error-icon {
      font-size: 24px;
      color: #f56c6c;
      margin-bottom: 8px;
    }
  }
}
</style>
