<template>
  <div class="resource-detail">
    <el-card>
      <template #header>
        <div class="card-header">
          <h2>{{ resourceData.title }}</h2>
          <div class="action-buttons">
            <el-button type="primary" @click="handleDownload">
              <el-icon><Download /></el-icon>立即下载
            </el-button>
            <el-button :type="isFavorited ? 'success' : 'info'" @click="toggleFavorite">
              <el-icon><Star /></el-icon>{{ isFavorited ? '已收藏' : '收藏资源' }}
            </el-button>
          </div>
        </div>
      </template>

      <el-descriptions :column="1" border>
        <el-descriptions-item label="资源类型">{{ resourceData.type }}</el-descriptions-item>
        <el-descriptions-item label="上传时间">{{ resourceData.uploadTime }}</el-descriptions-item>
        <el-descriptions-item label="文件大小">{{ resourceData.size }}</el-descriptions-item>
        <el-descriptions-item label="资源描述">
          <pre class="resource-description">{{ resourceData.description }}</pre>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const resourceId = route.params.id

// 模拟资源数据
const resourceData = ref({
  title: 'Vue3 实战教程',
  type: 'PDF文档',
  uploadTime: '2024-03-15',
  size: '15.6MB',
  description: '包含Vue3组合式API、状态管理、路由配置等核心内容...',
})

const isFavorited = ref(false)

const handleDownload = () => {
  // 实现下载逻辑
  console.log('下载资源：', resourceId)
}

const toggleFavorite = () => {
  isFavorited.value = !isFavorited.value
}
</script>

<style lang="scss" scoped>
.resource-detail {
  max-width: 800px;
  margin: 20px auto;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .action-buttons {
    display: flex;
    gap: 10px;
  }

  .resource-description {
    white-space: pre-wrap;
    font-family: inherit;
    margin: 0;
    padding: 10px;
    background-color: #f8f9fa;
    border-radius: 4px;
  }
}
</style>
