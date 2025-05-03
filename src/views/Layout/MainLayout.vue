<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Header from '@/views/Layout/components/Header.vue'

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
  // 这里可以添加设置页面逻辑
}

const goToProfile = () => {
  router.push('/profile')
}
</script>

<template>
  <div class="app-layout">
    <!-- 顶部栏 -->
    <el-header>
      <Header />
    </el-header>

    <!-- 左侧导航栏 -->
    <el-container>
      <el-aside width="200px" class="sidebar">
        <el-menu
          :default-openeds="['1']"
          active-text-color="$menu-active"
          background-color="$menu-bg"
          text-color="$menu-text"
        >
          <!-- 原有菜单项保持不变 -->
          <el-sub-menu index="1">
            <template #title>
              <el-icon><menu /></el-icon>
              课程概览
            </template>
            <el-menu-item index="1-1">收藏夹</el-menu-item>
            <el-menu-item index="1-2">缺陷分析</el-menu-item>
            <el-menu-item index="1-3">迭代功能</el-menu-item>
          </el-sub-menu>
          <el-menu-item index="2">
            <el-icon><history /></el-icon>
            版本记录
          </el-menu-item>
          <el-menu-item index="3">
            <el-icon><question-circle /></el-icon>
            帮助文档
          </el-menu-item>
          <el-menu-item index="4">
            <el-icon><user /></el-icon>
            个人中心
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 主体内容区域 -->
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<style lang="scss" scoped>
.app-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;

  .el-container {
    flex: 1;
    min-height: 0;

    .el-header {
      padding: 0 20px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .el-aside {
      background: $menu-bg;
      min-width: 200px;
    }

    .main-content {
      flex: 1;
      min-width: 0;
      padding: 20px;
      background: $content-bg;
      overflow: auto;
    }
  }
}
</style>
