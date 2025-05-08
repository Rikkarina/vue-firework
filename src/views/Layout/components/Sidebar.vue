<template>
  <el-aside class="sidebar" width="200px">
    <div class="sidebar-logo">
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
      <el-menu-item index="1">
        <el-icon><grid /></el-icon>
        <span>课程概览</span>
      </el-menu-item>
      <el-menu-item index="2">
        <el-icon><collection /></el-icon>
        <span>收藏夹</span>
      </el-menu-item>
      <el-menu-item index="3" disabled>
        <el-icon><upload /></el-icon>
        <span>页面上传</span>
      </el-menu-item>
      <el-menu-item index="4" disabled>
        <el-icon><cpu /></el-icon>
        <span>迭代功能</span>
      </el-menu-item>
      <el-menu-item index="5">
        <el-icon><tickets /></el-icon>
        <span>版本记录</span>
      </el-menu-item>
      <el-menu-item index="6">
        <el-icon><question-filled /></el-icon>
        <span>帮助文档</span>
      </el-menu-item>
      <el-menu-item index="7">
        <el-icon><user /></el-icon>
        <span>个人中心</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script setup>
import { ref } from 'vue'
import {
  Grid,
  Collection,
  Upload,
  Cpu,
  Tickets,
  QuestionFilled,
  User,
} from '@element-plus/icons-vue'
const activeIndex = ref('1')
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
