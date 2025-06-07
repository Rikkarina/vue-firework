<template>
  <div class="last-visited">
    <div class="title-row">
      <span>最近浏览</span>
      <router-link to="/history" class="more">
        查看更多
        <el-icon><right /></el-icon>
      </router-link>
    </div>
    <template v-if="recentVisits.length > 0">
      <ul class="visited-list">
        <li
          v-for="item in recentVisits"
          :key="item.path"
          @click="goToPage(item.path)"
        >
          <div class="item-main">
            <div class="item-icon">
              <el-icon><document /></el-icon>
            </div>
            <div class="item-content">
              <div class="item-title">{{ item.title }}</div>
              <div class="item-time">{{ formatTime(item.timestamp) }}</div>
            </div>
          </div>
        </li>
      </ul>
    </template>
    <template v-else>
      <el-empty description="暂无浏览记录" :image-size="60" />
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useHistoryStore } from '@/stores/history'
import { Document, Right } from '@element-plus/icons-vue'

const router = useRouter()
const historyStore = useHistoryStore()

// 获取最近4条访问记录
const recentVisits = computed(() => historyStore.recentVisits(4))

// 格式化时间
const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date

  // 小于1小时，显示xx分钟前
  if (diff < 1000 * 60 * 60) {
    const minutes = Math.floor(diff / (1000 * 60))
    return `${minutes}分钟前`
  }
  // 小于24小时，显示xx小时前
  else if (diff < 1000 * 60 * 60 * 24) {
    const hours = Math.floor(diff / (1000 * 60 * 60))
    return `${hours}小时前`
  }
  // 小于7天，显示x天前
  else if (diff < 1000 * 60 * 60 * 24 * 7) {
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    return `${days}天前`
  }
  // 其他情况显示具体日期
  else {
    return date.toLocaleDateString()
  }
}

// 跳转到页面
const goToPage = (path) => {
  router.push(path)
}

// 组件挂载时加载数据
onMounted(() => {
  historyStore.loadFromStorage()
})
</script>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';

.last-visited {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px #f0f1f2;

  .title-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    span {
      font-size: 16px;
      font-weight: 500;
      color: #1f2937;
    }

    .more {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 13px;
      color: #409eff;
      text-decoration: none;

      &:hover {
        color: #66b1ff;
      }

      .el-icon {
        font-size: 12px;
      }
    }
  }

  .visited-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;

    li {
      cursor: pointer;
      transition: all 0.2s;
      border-radius: 6px;

      &:hover {
        background: #f9fafb;
      }

      .item-main {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 12px;

        .item-icon {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          background: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6b7280;
          flex-shrink: 0;
        }

        .item-content {
          flex: 1;
          min-width: 0;

          .item-title {
            font-size: 14px;
            color: #1f2937;
            margin-bottom: 4px;
            @include text-ellipsis;
          }

          .item-time {
            font-size: 12px;
            color: #6b7280;
          }
        }
      }
    }
  }
}
</style>
