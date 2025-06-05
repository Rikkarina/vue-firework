<template>
  <div class="message-center">
    <div class="title-row">
      <span>消息中心</span>
      <el-button
        type="primary"
        link
        @click="toMessageCenter"
      >
        查看更多
      </el-button>
    </div>
    <ul class="message-list">
      <li v-for="(msg, idx) in messages"
          :key="msg.id"
          @click="handleItemClick(msg, idx)">
        <span class="tag" :class="msg.type">{{ msg.type }}</span>
        <span class="content">{{ msg.content }}</span>
        <span class="time">{{ formatTime(msg.timestamp) }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 定义消息类型
const MessageType = {
  ACTIVITY: '活动',
  NOTICE: '通知',
  SYSTEM: '系统'
}

// 格式化时间
const formatTime = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 30) return `${days}天前`
  return date.toLocaleDateString()
}

// 模拟消息数据
const messages = ref([
  {
    id: 1,
    type: MessageType.ACTIVITY,
    content: '新的课程评价活动开始啦！参与即可获得积分奖励',
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString() // 1小时前
  },
  {
    id: 2,
    type: MessageType.NOTICE,
    content: '您的课程《软件工程导论》有新的学生提问',
    read: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2小时前
  },
  {
    id: 3,
    type: MessageType.SYSTEM,
    content: '系统将于今晚22:00进行例行维护，请提前保存您的工作',
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // 1天前
  },
  {
    id: 4,
    type: MessageType.NOTICE,
    content: '您上传的课件已审核通过，现已对学生可见',
    read: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() // 2天前
  }
])

const toMessageCenter = () => {
  router.push('/messages')
}

const handleItemClick = (msg) => {
  // 导航到消息中心并传递消息ID
  router.push({
    path: '/messages',
    query: {
      messageId: msg.id,
      type: msg.type
    }
  })
}

onMounted(() => {
  console.log('MessageCenter component mounted')
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
    font-weight: bold;
    margin-bottom: 12px;
  }

  .message-list {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      display: flex;
      align-items: center;
      font-size: 14px;
      margin-bottom: 8px;
      padding: 8px;
      cursor: pointer;
      border-radius: 4px;
      transition: all 0.2s ease;

      &:hover {
        background-color: #f5f7fa;
      }

      .tag {
        display: inline-block;
        min-width: 40px;
        height: 20px;
        border-radius: 4px;
        background: #e6f7ff;
        color: #409eff;
        text-align: center;
        margin-right: 8px;
        font-size: 12px;
        padding: 0 4px;
        line-height: 20px;
      }

      .tag.活动 {
        background: #f6ffed;
        color: #52c41a;
      }

      .tag.通知 {
        background: #e6f7ff;
        color: #1890ff;
      }

      .tag.系统 {
        background: #fff2e8;
        color: #fa8c16;
      }

      .content {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .time {
        color: #909399;
        font-size: 12px;
        margin-left: 8px;
      }
    }
  }
}
</style>
