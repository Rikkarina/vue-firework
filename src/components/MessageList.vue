<template>
  <div class="message-list">
    <el-empty v-if="!loading && (!messages || messages.length === 0)" description="暂无消息" />

    <el-skeleton :loading="loading" animated :count="3" v-else-if="loading">
      <template #template>
        <div class="message-skeleton">
          <el-skeleton-item variant="p" style="width: 60%" />
          <el-skeleton-item variant="text" style="width: 100%" />
          <el-skeleton-item variant="text" style="width: 100%" />
        </div>
      </template>
    </el-skeleton>

    <template v-else>
      <div v-for="message in messages" :key="message.id" class="message-item" :class="{ 'message-unread': message.status === 'unread' }">
        <div class="message-content">
          <h3 class="message-title">{{ message.title }}</h3>
          <p class="message-text">{{ message.content }}</p>
          <div class="message-footer">
            <span class="message-time">{{ message.createdAt }}</span>
            <div class="message-actions">
              <el-button v-if="message.status === 'unread'" type="text" @click="$emit('read', message.id)">
                标记已读
              </el-button>
              <el-button v-if="message.link" type="text" @click="handleLink(message.link)">
                查看详情
              </el-button>
              <el-popconfirm title="确定要删除这条消息吗？" @confirm="$emit('delete', message.id)">
                <template #reference>
                  <el-button type="text" class="delete-btn">删除</el-button>
                </template>
              </el-popconfirm>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

defineProps({
  messages: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['read', 'delete'])

const handleLink = (link) => {
  if (link.startsWith('http')) {
    window.open(link, '_blank')
  } else {
    router.push(link)
  }
}
</script>

<style scoped>
.message-list {
  min-height: 200px;
}

.message-item {
  padding: 16px;
  border-bottom: 1px solid #eee;
  transition: all 0.3s;
}

.message-item:hover {
  background-color: #f5f7fa;
}

.message-unread {
  background-color: #f0f9ff;
}

.message-unread:hover {
  background-color: #ecf5ff;
}

.message-title {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.message-text {
  margin: 0 0 12px;
  font-size: 14px;
  color: #606266;
  line-height: 1.5;
}

.message-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.message-time {
  font-size: 12px;
  color: #909399;
}

.message-actions {
  display: flex;
  gap: 12px;
}

.message-actions .el-button {
  padding: 0;
  height: auto;
  font-size: 13px;
}

.delete-btn {
  color: #f56c6c;
}

.message-skeleton {
  padding: 16px;
  border-bottom: 1px solid #eee;
}
</style>
