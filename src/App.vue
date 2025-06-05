<script setup>
import { computed, onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)

onMounted(() => {
  // 初始化主题
  themeStore.initTheme()
})
</script>

<template>
  <div id="app" :class="{ 'dark': isDark }">
    <router-view />
  </div>
</template>

<style>
@import '@/styles/theme.scss';

#app {
  width: 100%;
  min-height: 100vh;
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

/* 全局过渡效果 */
.theme-transition {
  transition: background-color 0.3s ease,
              color 0.3s ease,
              border-color 0.3s ease,
              box-shadow 0.3s ease;
}

/* 应用主题过渡到特定组件 */
.header,
.sidebar,
.el-menu,
.el-button,
.el-input__wrapper,
.el-dialog,
.el-card,
.el-table,
.el-dropdown-menu,
.message-card,
.file-item {
  @extend .theme-transition;
}
</style>
