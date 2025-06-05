<template>
  <div class="browsing-history">
    <div class="history-header">
      <h2 class="title">浏览历史</h2>
      <div class="header-actions">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :shortcuts="dateShortcuts"
          @change="handleDateChange"
        />
        <el-button type="danger" @click="handleClearHistory">清空历史</el-button>
      </div>
    </div>

    <div class="history-content">
      <el-table
        v-loading="loading"
        :data="historyList"
        style="width: 100%"
        :empty-text="'暂无浏览历史'"
      >
        <el-table-column prop="title" label="标题" min-width="200">
          <template #default="{ row }">
            <div class="history-item-title">
              <el-link :href="row.url" target="_blank" :underline="false">
                {{ row.title }}
              </el-link>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="type" label="类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getTypeTagType(row.type)">{{ getTypeLabel(row.type) }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="viewCount" label="查看次数" width="100" align="center">
          <template #default="{ row }">
            <el-tag type="info" effect="plain">{{ row.viewCount }}次</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="lastViewTime" label="最近查看时间" width="180">
          <template #default="{ row }">
            {{ formatTime(row.lastViewTime) }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button
              type="danger"
              link
              @click="handleDeleteHistory(row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container" v-if="total > 0">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <el-dialog
      v-model="clearDialogVisible"
      title="确认清空"
      width="400px"
    >
      <span>确定要清空所有浏览历史记录吗？此操作不可恢复。</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="clearDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="confirmClearHistory">确定清空</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { getBrowsingHistory, deleteHistory, reVisit } from '@/api/history'
import dayjs from 'dayjs'

export default {
  name: 'BrowsingHistory',
  setup() {
    const todayHistory = ref([])
    const weekHistory = ref([])
    const earlierHistory = ref([])
    const loading = ref(false)
    const historyList = ref([])
    const total = ref(0)
    const currentPage = ref(1)
    const pageSize = ref(20)
    const dateRange = ref(null)
    const clearDialogVisible = ref(false)

    // 日期快捷选项
    const dateShortcuts = [
      {
        text: '最近一周',
        value: () => {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
          return [start, end]
        },
      },
      {
        text: '最近一月',
        value: () => {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
          return [start, end]
        },
      },
      {
        text: '最近三月',
        value: () => {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
          return [start, end]
        },
      },
    ]

    // 获取浏览历史
    const fetchHistory = async (period) => {
      try {
        const { data } = await getBrowsingHistory({ period })
        switch (period) {
          case 'today':
            todayHistory.value = data
            break
          case 'week':
            weekHistory.value = data
            break
          case 'earlier':
            earlierHistory.value = data
            break
        }
      } catch (error) {
        console.error('获取浏览历史失败:', error)
      }
    }

    // 获取历史记录列表
    const fetchHistoryList = async () => {
      loading.value = true
      try {
        const { data } = await getBrowsingHistory({
          page: currentPage.value,
          pageSize: pageSize.value,
          startTime: dateRange.value?.[0]?.toISOString(),
          endTime: dateRange.value?.[1]?.toISOString(),
        })
        historyList.value = data.list
        total.value = data.total
      } catch (error) {
        console.error('获取历史记录失败:', error)
        ElMessage.error('获取历史记录失败')
      } finally {
        loading.value = false
      }
    }

    // 重新查看
    const reVisitItem = async (historyId) => {
      try {
        await reVisit(historyId)
        // 这里可以添加路由跳转逻辑
      } catch (error) {
        console.error('重新查看失败:', error)
      }
    }

    // 删除历史记录
    const deleteHistoryItem = async (historyId) => {
      try {
        await deleteHistory(historyId)
        await fetchAllHistory()
      } catch (error) {
        console.error('删除历史记录失败:', error)
      }
    }

    // 获取所有时期的历史记录
    const fetchAllHistory = async () => {
      await Promise.all([
        fetchHistory('today'),
        fetchHistory('week'),
        fetchHistory('earlier')
      ])
    }

    // 处理分页大小变化
    const handleSizeChange = (val) => {
      pageSize.value = val
      fetchHistoryList()
    }

    // 处理页码变化
    const handleCurrentChange = (val) => {
      currentPage.value = val
      fetchHistoryList()
    }

    // 处理日期范围变化
    const handleDateChange = () => {
      currentPage.value = 1
      fetchHistoryList()
    }

    // 处理删除单条历史记录
    const handleDeleteHistory = async (id) => {
      try {
        await ElMessageBox.confirm('确定要删除这条历史记录吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        await deleteHistory(id)
        ElMessage.success('删除成功')
        fetchHistoryList()
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除历史记录失败:', error)
          ElMessage.error('删除失败')
        }
      }
    }

    // 处理清空历史记录
    const handleClearHistory = () => {
      clearDialogVisible.value = true
    }

    // 确认清空历史记录
    const confirmClearHistory = async () => {
      try {
        await clearHistory()
        ElMessage.success('清空成功')
        clearDialogVisible.value = false
        currentPage.value = 1
        fetchHistoryList()
      } catch (error) {
        console.error('清空历史记录失败:', error)
        ElMessage.error('清空失败')
      }
    }

    // 获取类型标签样式
    const getTypeTagType = (type) => {
      const typeMap = {
        course: 'success',
        resource: 'primary',
        article: 'warning',
        video: 'danger',
      }
      return typeMap[type] || 'info'
    }

    // 获取类型标签文本
    const getTypeLabel = (type) => {
      const typeMap = {
        course: '课程',
        resource: '资源',
        article: '文章',
        video: '视频',
      }
      return typeMap[type] || '其他'
    }

    // 格式化时间
    const formatTime = (time) => {
      return dayjs(time).format('YYYY-MM-DD HH:mm')
    }

    onMounted(() => {
      fetchAllHistory()
    })

    return {
      todayHistory,
      weekHistory,
      earlierHistory,
      loading,
      historyList,
      total,
      currentPage,
      pageSize,
      dateRange,
      clearDialogVisible,
      dateShortcuts,
      reVisitItem,
      deleteHistoryItem,
      formatTime,
      handleSizeChange,
      handleCurrentChange,
      handleDateChange,
      handleDeleteHistory,
      handleClearHistory,
      confirmClearHistory,
      getTypeTagType,
      getTypeLabel
    }
  }
}
</script>

<style scoped>
.browsing-history {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 16px;
  align-items: center;
}

.history-content {
  .history-item-title {
    .el-link {
      font-size: 14px;
      font-weight: 500;
    }
  }
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-table) {
  --el-table-border-color: var(--el-border-color-lighter);
  --el-table-header-bg-color: var(--el-fill-color-light);

  .el-table__header-wrapper {
    th {
      font-weight: 600;
      background-color: var(--el-fill-color-light);
    }
  }

  .el-table__row {
    .el-button {
      padding: 4px 0;
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 20px;
}
</style>
