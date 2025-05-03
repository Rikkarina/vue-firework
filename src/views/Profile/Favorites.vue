<template>
  <div class="favorites-page">
    <h2>我的收藏</h2>
    <el-empty v-if="favorites.length === 0" description="暂未收藏任何资源" />

    <div class="favorites-list">
      <el-card v-for="item in favorites" :key="item.id" class="favorite-item">
        <template #header>
          <div class="card-header">
            <h3>{{ item.title }}</h3>
            <el-tag :type="item.type === '课件' ? 'primary' : 'success'">
              {{ item.type }}
            </el-tag>
          </div>
        </template>

        <div class="item-footer">
          <el-button type="danger" size="small" @click="handleUncollect(item.id)"
            >取消收藏</el-button
          >
          <span class="collect-time">{{ item.collectedAt }}</span>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const favorites = ref([
  {
    id: 1,
    title: '数据结构与算法习题集',
    type: '习题答案',
    collectedAt: '2024-03-20',
  },
])

const handleUncollect = (id) => {
  console.log('取消收藏:', id)
}
</script>

<style scoped>
.favorite-item {
  margin-bottom: 15px;
}

.item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.collect-time {
  font-size: 12px;
  color: #909399;
}
</style>
