<template>
  <div class="browse-type">
    <h2>{{ typeLabel }}资源</h2>
    <el-empty v-if="resources.length === 0" description="暂无相关资源" />

    <div class="resource-grid">
      <el-card v-for="item in resources" :key="item.id" class="resource-card">
        <template #header>
          <div class="card-header">
            <h3>{{ item.title }}</h3>
            <el-tag type="info">{{ item.major }}</el-tag>
          </div>
        </template>
        <p class="description">{{ item.description }}</p>
        <div class="card-footer">
          <el-button type="primary" @click="$router.push(`/resource/${item.id}`)"
            >查看详情</el-button
          >
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const typeValue = route.params.type

const typeMap = {
  courseware: '课件',
  notes: '笔记',
  past_paper: '历年真题',
  summary: '考点汇总',
}

const typeLabel = computed(() => typeMap[typeValue] || '未知类型')

const resources = ref([
  {
    id: 1,
    title: '高等数学期末复习资料',
    major: '数学与应用数学',
    description: '包含微积分、线性代数等核心知识点整理',
  },
])
</script>

<style scoped>
.resource-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.description {
  color: #666;
  height: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>
