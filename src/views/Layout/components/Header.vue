<template>
  <el-header class="header">
    <div class="logo">Firework</div>
    <div class="header-right">
      <el-input
        placeholder="搜索..."
        v-model="searchQuery"
        clearable
        @clear="handleSearchClear"
        @keyup.enter="handleSearch"
      >
        <template #prefix>
          <el-icon><search /></el-icon>
        </template>
      </el-input>
      <div class="icon-group">
        <el-tooltip content="消息中心" placement="bottom">
          <el-icon @click="goToMessageCenter"><message /></el-icon>
        </el-tooltip>
        <el-tooltip content="设置" placement="bottom">
          <el-icon @click="goToSettings"><setting /></el-icon>
        </el-tooltip>
        <el-avatar size="small" src="https://via.placeholder.com/50x50" @click="goToProfile" />
      </div>
    </div>
  </el-header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Message, Setting } from '@element-plus/icons-vue'

const router = useRouter()
const searchQuery = ref('')

const handleSearch = () => {
  if (searchQuery.value) {
    router.push({ name: 'SearchResult', query: { q: searchQuery.value } })
  }
}

const handleSearchClear = () => {
  searchQuery.value = ''
}

const goToMessageCenter = () => {
  router.push('/messages')
}

const goToSettings = () => {
  // 设置页面逻辑
}

const goToProfile = () => {
  router.push('/profile')
}
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  .logo {
    font-size: 20px;
    font-weight: bold;
    color: #2b6cb6;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 16px;

    .el-input {
      width: 300px;
    }

    .icon-group {
      display: flex;
      gap: 12px;
    }
  }
}
</style>
