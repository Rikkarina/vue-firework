<template>
  <div class="last-visited">
    <div class="title-row">
      <span class="title">最近浏览</span>
      <el-link :underline="false" @click="router.push('/history')">查看更多</el-link>
    </div>
    <div v-loading="loading" class="history-content">
      <template v-if="historyList.length">
        <el-scrollbar max-height="200px">
          <div
            v-for="item in historyList"
            :key="item.id"
            class="history-item"
            @click="handleItemClick(item)"
          >
            <div class="item-header">
              <el-tag
                :type="getTypeTagType(item.type)"
                size="small"
                effect="light"
              >
                {{ getTypeLabel(item.type) }}
              </el-tag>
              <span class="time">{{ formatTime(item.lastViewTime) }}</span>
            </div>
            <div class="item-title">{{ item.title }}</div>
            <div class="item-footer">
              <el-tag
                type="info"
                effect="plain"
                size="small"
              >
                浏览 {{ item.viewCount }} 次
              </el-tag>
            </div>
          </div>
        </el-scrollbar>
      </template>
      <el-empty v-else description="暂无浏览记录" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'

const router = useRouter()
const historyList = ref([])
const loading = ref(false)

// 获取历史记录
const fetchHistory = async () => {
  loading.value = true
  try {
    // 这里替换为实际的API调用
    const { data } = await getBrowsingHistory({ limit: 5 })
    historyList.value = data.list
  } catch (error) {
    console.error('获取历史记录失败:', error)
  } finally {
    loading.value = false
  }
}

// 处理项目点击
const handleItemClick = (item) => {
  // 根据不同类型的资源跳转到不同的页面
  switch (item.type) {
    case 'course':
      router.push(`/course/${item.id}`)
      break
    case 'resource':
      router.push(`/resource/${item.id}`)
      break
    case 'article':
      router.push(`/article/${item.id}`)
      break
    case 'video':
      router.push(`/video/${item.id}`)
      break
    default:
      router.push('/history')
  }
}

// 获取类型标签样式
const getTypeTagType = (type) => {
  const typeMap = {
    course: 'success',
    resource: 'primary',
    article: 'warning',
    video: 'danger'
  }
  return typeMap[type] || 'info'
}

// 获取类型标签文本
const getTypeLabel = (type) => {
  const typeMap = {
    course: '课程',
    resource: '资源',
    article: '文章',
    video: '视频'
  }
  return typeMap[type] || '其他'
}

// 格式化时间
const formatTime = (time) => {
  const now = dayjs()
  const viewTime = dayjs(time)

  if (now.diff(viewTime, 'hour') < 1) {
    return `${now.diff(viewTime, 'minute')}分钟前`
  } else if (now.diff(viewTime, 'day') === 0) {
    return `${now.diff(viewTime, 'hour')}小时前`
  } else if (now.diff(viewTime, 'day') === 1) {
    return '昨天'
  } else if (now.diff(viewTime, 'year') === 0) {
    return viewTime.format('MM-DD')
  } else {
    return viewTime.format('YYYY-MM-DD')
  }
}

onMounted(() => {
  fetchHistory()
})
</script>

<style lang="scss" scoped>
.last-visited {
  background: var(--el-bg-color);
  border-radius: 8px;
  padding: 16px;
  box-shadow: var(--el-box-shadow-light);

  .title-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .title {
      font-size: 16px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }
  }

  .history-content {
    min-height: 200px;
  }

  .history-item {
    padding: 12px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background-color: var(--el-fill-color-light);
    }

    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;

      .time {
        font-size: 12px;
        color: var(--el-text-color-secondary);
      }
    }

    .item-title {
      font-size: 14px;
      color: var(--el-text-color-regular);
      line-height: 1.5;
      margin-bottom: 8px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .item-footer {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
