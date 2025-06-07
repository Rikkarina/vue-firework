<template>
  <div class="history-page">
    <!-- 左侧筛选栏 -->
    <div class="filter-sidebar">
      <div class="filter-header">
        <h3>时间筛选</h3>
      </div>
      <el-menu
        class="filter-menu"
        :default-active="activeTimeRange"
        @select="handleTimeRangeChange"
      >
        <el-menu-item index="today">
          <el-icon><calendar /></el-icon>
          <template #title>
            <span>今天</span>
            <el-tag size="small" type="info" class="count-tag" v-if="todayCount">{{ todayCount }}</el-tag>
          </template>
        </el-menu-item>
        <el-menu-item index="yesterday">
          <el-icon><calendar /></el-icon>
          <template #title>
            <span>昨天</span>
            <el-tag size="small" type="info" class="count-tag" v-if="yesterdayCount">{{ yesterdayCount }}</el-tag>
          </template>
        </el-menu-item>
        <el-menu-item index="week">
          <el-icon><calendar /></el-icon>
          <template #title>
            <span>最近7天</span>
            <el-tag size="small" type="info" class="count-tag" v-if="weekCount">{{ weekCount }}</el-tag>
          </template>
        </el-menu-item>
        <el-menu-item index="month">
          <el-icon><calendar /></el-icon>
          <template #title>
            <span>最近30天</span>
            <el-tag size="small" type="info" class="count-tag" v-if="monthCount">{{ monthCount }}</el-tag>
          </template>
        </el-menu-item>
        <el-menu-item index="all">
          <el-icon><calendar /></el-icon>
          <template #title>
            <span>全部记录</span>
            <el-tag size="small" type="info" class="count-tag" v-if="allCount">{{ allCount }}</el-tag>
          </template>
        </el-menu-item>
      </el-menu>
    </div>

    <!-- 右侧内容区 -->
    <div class="history-content">
      <div class="content-header">
        <div class="header-left">
          <h2>{{ currentRangeTitle }}</h2>
          <span class="total">共 {{ filteredHistory.length }} 条记录</span>
        </div>
        <div class="header-right">
          <el-button type="danger" plain size="small" @click="handleClearHistory" :disabled="!filteredHistory.length">
            <el-icon><delete /></el-icon>
            清空记录
          </el-button>
        </div>
      </div>

      <div class="history-list" v-loading="loading">
        <template v-if="filteredHistory.length">
          <div v-for="(group, date) in groupedHistory" :key="date" class="history-group">
            <div class="group-header">
              <span class="date">{{ formatGroupDate(date) }}</span>
              <span class="count">{{ group.length }}条记录</span>
            </div>
            <div class="group-content">
              <div v-for="item in group" :key="item.timestamp" class="history-item" @click="goToPage(item.path)">
                <div class="item-main">
                  <div class="item-icon">
                    <el-icon><document /></el-icon>
                  </div>
                  <div class="item-content">
                    <div class="item-title">{{ item.title }}</div>
                    <div class="item-path">{{ formatPath(item.path) }}</div>
                  </div>
                </div>
                <div class="item-time">{{ formatDetailTime(item.timestamp) }}</div>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <el-empty description="暂无浏览记录" />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useHistoryStore } from '@/stores/history'
import { ElMessageBox } from 'element-plus'
import { Calendar, Document, Delete } from '@element-plus/icons-vue'

const router = useRouter()
const historyStore = useHistoryStore()
const loading = ref(false)
const activeTimeRange = ref('all')

// 获取所有历史记录
const allHistory = computed(() => historyStore.allVisits)

// 根据时间范围筛选记录
const filteredHistory = computed(() => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const weekAgo = new Date(today)
  weekAgo.setDate(weekAgo.getDate() - 7)
  const monthAgo = new Date(today)
  monthAgo.setDate(monthAgo.getDate() - 30)

  return allHistory.value.filter(item => {
    const itemDate = new Date(item.timestamp)
    switch (activeTimeRange.value) {
      case 'today':
        return itemDate >= today
      case 'yesterday':
        return itemDate >= yesterday && itemDate < today
      case 'week':
        return itemDate >= weekAgo
      case 'month':
        return itemDate >= monthAgo
      default:
        return true
    }
  })
})

// 按日期分组
const groupedHistory = computed(() => {
  const groups = {}
  filteredHistory.value.forEach(item => {
    const date = new Date(item.timestamp).toLocaleDateString()
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(item)
  })
  return groups
})

// 计算各时间范围的记录数
const todayCount = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return allHistory.value.filter(item => new Date(item.timestamp) >= today).length
})

const yesterdayCount = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  return allHistory.value.filter(item => {
    const date = new Date(item.timestamp)
    return date >= yesterday && date < today
  }).length
})

const weekCount = computed(() => {
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  return allHistory.value.filter(item => new Date(item.timestamp) >= weekAgo).length
})

const monthCount = computed(() => {
  const monthAgo = new Date()
  monthAgo.setDate(monthAgo.getDate() - 30)
  return allHistory.value.filter(item => new Date(item.timestamp) >= monthAgo).length
})

const allCount = computed(() => allHistory.value.length)

// 当前范围标题
const currentRangeTitle = computed(() => {
  const titles = {
    today: '今天',
    yesterday: '昨天',
    week: '最近7天',
    month: '最近30天',
    all: '全部浏览记录'
  }
  return titles[activeTimeRange.value]
})

// 格式化日期组标题
const formatGroupDate = (date) => {
  const today = new Date().toLocaleDateString()
  const yesterday = new Date(Date.now() - 86400000).toLocaleDateString()

  if (date === today) {
    return '今天'
  } else if (date === yesterday) {
    return '昨天'
  }
  return date
}

// 格式化详细时间
const formatDetailTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 处理时间范围变化
const handleTimeRangeChange = (range) => {
  activeTimeRange.value = range
}

// 跳转到页面
const goToPage = (path) => {
  router.push(path)
}

// 清空历史记录
const handleClearHistory = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要清空所有浏览记录吗？此操作不可恢复。',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    historyStore.clearHistory()
  } catch {
    // 用户取消操作
  }
}

// 格式化路径显示
const formatPath = (path) => {
  if (path.includes('/files/course/')) {
    return '课程文件'
  }
  return path
}

// 组件挂载时加载数据
onMounted(() => {
  loading.value = true
  historyStore.loadFromStorage()
  loading.value = false
})
</script>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';

.history-page {
  display: flex;
  height: calc(100vh - 60px);
  background: #fff;

  .filter-sidebar {
    width: 240px;
    border-right: 1px solid #e5e7eb;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;

    .filter-header {
      padding: 16px;
      border-bottom: 1px solid #e5e7eb;

      h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 500;
        color: #1f2937;
      }
    }

    .filter-menu {
      flex: 1;
      border-right: none;

      :deep(.el-menu-item) {
        display: flex;
        align-items: center;
        height: 48px;
        padding: 0 16px;

        .el-icon {
          margin-right: 12px;
          font-size: 18px;
        }

        &.is-active {
          background: #f0f7ff;
        }
      }

      .count-tag {
        margin-left: auto;
      }
    }
  }

  .history-content {
    flex: 1;
    min-width: 0;
    padding: 24px;
    overflow-y: auto;

    .content-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;

      .header-left {
        display: flex;
        align-items: baseline;
        gap: 12px;

        h2 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
        }

        .total {
          color: #6b7280;
          font-size: 14px;
        }
      }
    }

    .history-list {
      .history-group {
        margin-bottom: 24px;

        .group-header {
          display: flex;
          align-items: center;
          margin-bottom: 12px;

          .date {
            font-size: 14px;
            font-weight: 500;
            color: #1f2937;
          }

          .count {
            margin-left: 12px;
            font-size: 13px;
            color: #6b7280;
          }
        }

        .group-content {
          .history-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 16px;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;

            &:hover {
              background: #f9fafb;
            }

            .item-main {
              display: flex;
              align-items: center;
              gap: 12px;
              flex: 1;
              min-width: 0;

              .item-icon {
                width: 32px;
                height: 32px;
                border-radius: 6px;
                background: #f3f4f6;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #6b7280;
              }

              .item-content {
                flex: 1;
                min-width: 0;

                .item-title {
                  font-size: 14px;
                  font-weight: 500;
                  color: #1f2937;
                  margin-bottom: 4px;
                  @include text-ellipsis;
                }

                .item-path {
                  font-size: 12px;
                  color: #909399;
                  margin-top: 4px;
                }
              }
            }

            .item-time {
              font-size: 13px;
              color: #9ca3af;
              margin-left: 16px;
            }
          }
        }
      }
    }
  }
}

@mixin text-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-details {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 8px;
  font-size: 0.9em;
  color: #666;

  .detail-item {
    display: flex;
    align-items: center;
    gap: 4px;

    .el-icon {
      font-size: 14px;
      color: #909399;
    }
  }
}
</style>
