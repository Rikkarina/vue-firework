<template>
  <div class="browse-major">
    <h2>{{ majorName }}专业资源</h2>
    <el-empty v-if="resources.length === 0" description="暂未收录该专业资源" />

    <div class="resource-list">
      <el-card v-for="item in resources" :key="item.id" class="major-resource">
        <template #header>
          <div class="card-header">
            <h3>{{ item.title }}</h3>
            <el-tag type="success">{{ item.type }}</el-tag>
          </div>
        </template>
        <p class="description">{{ item.description }}</p>
        <div class="action-bar">
          <el-button type="primary" @click="$router.push(`/resource/${item.id}`)"
            >查看详情</el-button
          >
          <span class="upload-time">上传于：{{ item.uploadDate }}</span>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const majorName = ref(decodeURIComponent(route.params.major))

const resources = ref([
  {
    id: 1,
    title: '计算机组成原理实验指导',
    type: '实验手册',
    description: '包含MIPS指令集实验和CPU设计实验',
    uploadDate: '2024-03-15',
  },
])
</script>

<style scoped>
.major-resource {
  margin-bottom: 20px;
}

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}

.upload-time {
  font-size: 12px;
  color: #909399;
}
</style>
