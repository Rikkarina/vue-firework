<script setup>
import Header from '@/views/Layout/components/Header.vue'
import Sidebar from '@/views/Layout/components/Sidebar.vue'
</script>

<template>
  <div class="common-layout">
    <el-container>
      <Sidebar />
      <el-container class="main-vertical-container">
        <Header />
        <router-view :key="$route.fullPath" />
      </el-container>
    </el-container>
  </div>
</template>

<style lang="scss" scoped>
.common-layout {
  height: 100vh;
}
.main-vertical-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  min-width: 0;
}
</style>
