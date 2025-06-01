<template>
  <div class="browsing-history">
    <h2 class="title">浏览历史</h2>

    <!-- 今日浏览 -->
    <section class="section">
      <div class="section-header">
        <span class="section-title">今日浏览</span>
        <div class="badge-blue">{{ todayHistory.length }}</div>
      </div>
      <div class="section-content">
        <template v-if="todayHistory.length">
          <div v-for="item in todayHistory" :key="item.id" class="history-item">
            <div class="history-main">
              <img :src="item.thumbnail" class="history-image" alt="缩略图">
              <div class="history-info">
                <div class="history-title">{{ item.title }}</div>
                <div class="history-desc">{{ item.description }}</div>
              </div>
            </div>
            <div class="history-footer">
              <span class="history-time">{{ formatTime(item.viewedAt) }}</span>
              <div class="history-actions">
                <button @click="reVisitItem(item.id)" class="revisit">重新查看</button>
                <button @click="deleteHistoryItem(item.id)" class="delete">删除</button>
              </div>
            </div>
          </div>
        </template>
        <p v-else class="empty-text">今日暂无浏览记录</p>
      </div>
    </section>

    <!-- 本周浏览 -->
    <section class="section">
      <div class="section-header">
        <span class="section-title">本周浏览</span>
        <div class="badge-green">{{ weekHistory.length }}</div>
      </div>
      <div class="section-content">
        <template v-if="weekHistory.length">
          <div v-for="item in weekHistory" :key="item.id" class="history-item">
            <div class="history-main">
              <img :src="item.thumbnail" class="history-image" alt="缩略图">
              <div class="history-info">
                <div class="history-title">{{ item.title }}</div>
                <div class="history-desc">{{ item.description }}</div>
              </div>
            </div>
            <div class="history-footer">
              <span class="history-time">{{ formatTime(item.viewedAt) }}</span>
              <div class="history-actions">
                <button @click="reVisitItem(item.id)" class="revisit">重新查看</button>
                <button @click="deleteHistoryItem(item.id)" class="delete">删除</button>
              </div>
            </div>
          </div>
        </template>
        <p v-else class="empty-text">本周暂无浏览记录</p>
      </div>
    </section>

    <!-- 更早浏览 -->
    <section class="section">
      <div class="section-header">
        <span class="section-title">更早浏览</span>
        <div class="badge-orange">{{ earlierHistory.length }}</div>
      </div>
      <div class="section-content">
        <template v-if="earlierHistory.length">
          <div v-for="item in earlierHistory" :key="item.id" class="history-item">
            <div class="history-main">
              <img :src="item.thumbnail" class="history-image" alt="缩略图">
              <div class="history-info">
                <div class="history-title">{{ item.title }}</div>
                <div class="history-desc">{{ item.description }}</div>
              </div>
            </div>
            <div class="history-footer">
              <span class="history-time">{{ formatTime(item.viewedAt) }}</span>
              <div class="history-actions">
                <button @click="reVisitItem(item.id)" class="revisit">重新查看</button>
                <button @click="deleteHistoryItem(item.id)" class="delete">删除</button>
              </div>
            </div>
          </div>
        </template>
        <p v-else class="empty-text">暂无更早浏览记录</p>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { getBrowsingHistory, deleteHistory, reVisit } from '@/api/history'
import dayjs from 'dayjs'

export default {
  name: 'BrowsingHistory',
  setup() {
    const todayHistory = ref([])
    const weekHistory = ref([])
    const earlierHistory = ref([])

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
      reVisitItem,
      deleteHistoryItem,
      formatTime
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

.title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #333;
}

.section {
  margin-bottom: 24px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 6px;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 18px;
  font-weight: 500;
  margin-right: 12px;
}

.badge-orange, .badge-green, .badge-blue {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 14px;
  min-width: 20px;
  text-align: center;
}

.badge-orange {
  background: #fff3e6;
  color: #ff9500;
}

.badge-green {
  background: #e6fff0;
  color: #00b96b;
}

.badge-blue {
  background: #e6f4ff;
  color: #1677ff;
}

.section-content {
  padding: 16px;
  background: #fff;
  border-radius: 4px;
}

.history-item {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.3s;
}

.history-item:last-child {
  border-bottom: none;
}

.history-main {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
}

.history-image {
  width: 120px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.history-info {
  flex: 1;
}

.history-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.history-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.history-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.history-time {
  font-size: 12px;
  color: #999;
}

.history-actions {
  display: flex;
  gap: 8px;
}

.history-actions button {
  padding: 4px 12px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
}

.history-actions button.revisit {
  background: #e6f4ff;
  color: #1677ff;
}

.history-actions button.delete {
  background: #fff1f0;
  color: #ff4d4f;
}

.history-actions button:hover {
  opacity: 0.8;
}

.empty-text {
  color: #999;
  font-size: 14px;
  text-align: center;
  margin: 0;
}
</style>
