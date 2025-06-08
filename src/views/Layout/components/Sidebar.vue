<template>
  <el-aside class="sidebar" width="200px">
    <div class="sidebar-logo" @click="handleLogoClick">
      <img src="@/assets/logo.png" alt="logo" class="logo-img" />
    </div>
    <el-menu
      class="sidebar-menu"
      :default-active="activeIndex"
      background-color="#fff"
      text-color="#b0b3b8"
      active-text-color="#2b6cb6"
      router
    >
      <el-menu-item index="/home">
        <el-icon><grid /></el-icon>
        <span>课程概览</span>
      </el-menu-item>
      <el-menu-item index="/favorite">
        <el-icon><collection /></el-icon>
        <span>收藏夹</span>
      </el-menu-item>
      <el-menu-item index="/upload">
        <el-icon><upload /></el-icon>
        <span>文件上传</span>
      </el-menu-item>
      <el-menu-item index="/history">
        <el-icon><tickets /></el-icon>
        <span>历史记录</span>
      </el-menu-item>
      <el-menu-item index="/help">
        <el-icon><question-filled /></el-icon>
        <span>帮助文档</span>
      </el-menu-item>
      <el-menu-item index="/profile">
        <el-icon><user /></el-icon>
        <span>个人中心</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  Grid,
  Collection,
  Upload,
  Tickets,
  QuestionFilled,
  User,
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

// 根据当前路由路径计算激活的菜单项
const activeIndex = computed(() => route.path)

const handleLogoClick = () => {
  router.push('/home')
}
</script>

<style lang="scss" scoped>
.sidebar {
  background: #fff;
  min-width: 200px;
  height: 100vh;
  box-shadow: 2px 0 8px #f0f1f2;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 24px;
  .sidebar-logo {
    margin-bottom: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: transparent;
    cursor: pointer;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.05);
    }

    .logo-img {
      height: 54px;
      width: auto;
      object-fit: contain;
      display: block;
      background: transparent;
    }
  }
  .sidebar-menu {
    width: 100%;
    border-right: none;
    .el-menu-item {
      height: 48px;
      font-size: 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      &.is-active {
        background: #f0f6ff !important;
        color: #2b6cb6 !important;
      }
      &[disabled] {
        color: #b0b3b8 !important;
        cursor: not-allowed;
        background: #fff !important;
      }
      .el-icon {
        font-size: 20px;
      }
    }
  }
}
</style>
