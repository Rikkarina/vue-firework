<template>
  <div class="message-center">
    <el-tabs v-model="activeTab" class="message-tabs">
      <el-tab-pane :label="'活动(' + activityCount + ')'" name="activity">
        <message-list
          :messages="activityMessages"
          :loading="loading"
          @read="handleRead"
          @delete="handleDelete"
        />
      </el-tab-pane>
      <el-tab-pane :label="'通知(' + notificationCount + ')'" name="notification">
        <message-list
          :messages="notificationMessages"
          :loading="loading"
          @read="handleRead"
          @delete="handleDelete"
        />
      </el-tab-pane>
      <el-tab-pane :label="'消息(' + messageCount + ')'" name="message">
        <message-list
          :messages="messages"
          :loading="loading"
          @read="handleRead"
          @delete="handleDelete"
        />
      </el-tab-pane>
    </el-tabs>

    <div class="message-actions">
      <el-button type="primary" @click="handleMarkAllRead">全部标记为已读</el-button>
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 30, 50]"
        layout="total, sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { getMessages, markAsRead, markAllAsRead, deleteMessages } from '@/apis/message'
import { MessageType } from '@/types/message'
import MessageList from './MessageList.vue'

const activeTab = ref('activity')
const loading = ref(false)
const messages = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 根据消息类型过滤消息
const activityMessages = computed(() =>
  messages.value.filter(msg => msg.type === MessageType.ACTIVITY)
)
const notificationMessages = computed(() =>
  messages.value.filter(msg => msg.type === MessageType.NOTIFICATION)
)
const messageMessages = computed(() =>
  messages.value.filter(msg => msg.type === MessageType.MESSAGE)
)

// 各类型消息数量
const activityCount = computed(() => activityMessages.value.length)
const notificationCount = computed(() => notificationMessages.value.length)
const messageCount = computed(() => messageMessages.value.length)

// 加载消息列表
const loadMessages = async () => {
  loading.value = true
  try {
    const res = await getMessages({
      page: currentPage.value,
      pageSize: pageSize.value,
      type: activeTab.value
    })
    messages.value = res.items
    total.value = res.total
  } catch {
    ElMessage.error('获取消息列表失败')
  } finally {
    loading.value = false
  }
}

// 标记消息为已读
const handleRead = async (messageId) => {
  try {
    await markAsRead(messageId)
    await loadMessages()
    ElMessage.success('已标记为已读')
  } catch {
    ElMessage.error('操作失败')
  }
}

// 标记所有消息为已读
const handleMarkAllRead = async () => {
  try {
    await markAllAsRead()
    await loadMessages()
    ElMessage.success('已全部标记为已读')
  } catch {
    ElMessage.error('操作失败')
  }
}

// 删除消息
const handleDelete = async (messageId) => {
  try {
    await deleteMessages(messageId)
    await loadMessages()
    ElMessage.success('删除成功')
  } catch {
    ElMessage.error('删除失败')
  }
}

// 分页相关
const handleSizeChange = (val) => {
  pageSize.value = val
  loadMessages()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  loadMessages()
}

// 监听标签页切换
watch(activeTab, () => {
  currentPage.value = 1
  loadMessages()
})

onMounted(() => {
  loadMessages()
})
</script>

<style scoped>
.message-center {
  padding: 20px;
}

.message-tabs {
  margin-bottom: 20px;
}

.message-actions {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
