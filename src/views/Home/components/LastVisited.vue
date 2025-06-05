<template>
  <div class="last-visited">
    <div class="widget-header">
      <h3 class="widget-title">上次浏览</h3>
      <router-link to="/history" class="view-all">
        查看更多
        <el-icon><arrow-right /></el-icon>
      </router-link>
    </div>
    <div class="visited-list">
      <div v-for="(item, idx) in visited" :key="idx" class="visited-item" @click="handleItemClick(item)">
        <div class="item-icon">
          <el-icon><Document /></el-icon>
        </div>
        <div class="item-content">
          <div class="item-title">{{ item.title }}</div>
          <div class="item-time">{{ item.time }}</div>
        </div>
      </div>
      <el-empty v-if="!visited.length" description="暂无浏览记录" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Document, ArrowRight } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const visited = ref([
  {
    id: 1,
    title: '软件工程课程文件',
    time: '10分钟前',
    courseId: 'se-001',
    type: 'course'
  },
  {
    id: 2,
    title: '项目开发文档',
    time: '2小时前',
    fileId: 'doc-001',
    type: 'file'
  },
  {
    id: 3,
    title: '期末报告模板',
    time: '昨天',
    fileId: 'doc-002',
    type: 'file'
  }
])

const handleItemClick = (item) => {
  if (item.type === 'course') {
    router.push({
      name: 'CourseFiles',
      params: { courseId: item.courseId }
    })
  } else if (item.type === 'file') {
    router.push({
      name: 'FileDetail',
      params: { fileId: item.fileId }
    })
  }
}
</script>

<style lang="scss" scoped>
.last-visited {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 4px;
  padding: 16px;

  .widget-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f0f0f0;

    .widget-title {
      font-size: 16px;
      font-weight: 500;
      color: #1f2937;
      margin: 0;
    }

    .view-all {
      font-size: 14px;
      color: #3b82f6;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 4px;

      &:hover {
        color: #2563eb;
      }

      .el-icon {
        font-size: 12px;
      }
    }
  }

  .visited-list {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-right: 4px;

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: #dcdfe6;
      border-radius: 2px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }
  }

  .visited-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid #e5e7eb;

    &:hover {
      background: #f9fafb;
      border-color: #d1d5db;
    }

    .item-icon {
      width: 32px;
      height: 32px;
      border-radius: 4px;
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
        font-weight: 500;
        color: #1f2937;
        margin-bottom: 4px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .item-time {
        font-size: 12px;
        color: #6b7280;
      }
    }
  }
}

:deep(.el-empty) {
  padding: 24px 0;
}
</style>
