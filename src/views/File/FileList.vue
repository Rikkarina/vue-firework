<template>
  <div class="file-list">
    <h1>文件列表</h1>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

onMounted(() => {
  // 后续实现文件列表加载逻辑
})
</script>

<style lang="scss" scoped>
.file-list {
  padding: 20px;
}
</style>
