<template>
  <el-card class="course-card">
    <div class="card-header">
      <div class="course-icon">
        <span class="icon-text">{{ title.charAt(0).toUpperCase() }}</span>
      </div>
      <div class="course-title">{{ title }}</div>
    </div>
    <div class="desc-tooltip-wrapper">
      <span class="course-desc" @mouseenter="showTooltip" @mouseleave="hideTooltip" ref="descRef">{{
        description
      }}</span>
    </div>
    <div class="course-date">最后修改日期：{{ date }}</div>
    <teleport to="body">
      <transition name="fade-tooltip">
        <span v-if="tooltipVisible" class="desc-tooltip-global" :style="tooltipStyle">{{
          description
        }}</span>
      </transition>
    </teleport>
  </el-card>
</template>

<script setup>
import { ref, defineProps, onUnmounted } from 'vue'
defineProps({
  title: {
    type: String,
    default: 'Python编程入门',
  },
  description: {
    type: String,
    default: '学习Python编程的基础，帮助入门编程。',
  },
  date: {
    type: String,
    default: '2023/11/01',
  },
})
const tooltipVisible = ref(false)
const tooltipStyle = ref({})
const descRef = ref(null)

function showTooltip() {
  tooltipVisible.value = true
  const rect = descRef.value.getBoundingClientRect()
  tooltipStyle.value = {
    position: 'fixed',
    left: rect.left + 'px',
    top: rect.bottom + 4 + 'px',
    minWidth: rect.width + 'px',
    maxWidth: '320px',
    background: '#333',
    color: '#fff',
    borderRadius: '4px',
    padding: '6px 12px 6px 12px',
    zIndex: 9999,
    fontSize: '13px',
    pointerEvents: 'none',
    whiteSpace: 'pre-line',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  }
}
function hideTooltip() {
  tooltipVisible.value = false
}
onUnmounted(() => {
  tooltipVisible.value = false
})
</script>

<style lang="scss" scoped>
$card-bg: #fff;
$title-color: #111;
$desc-color: #555;
$date-color: #999;
$icon-bg: #f3f5f7;
$icon-color: #222;
$icon-size: 40px;
$icon-radius: 8px;
$card-width: 200px;
$card-height: 180px; // 4:3比例

.course-card {
  width: $card-width;
  height: $card-height;
  background: $card-bg;
  border-radius: 12px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  position: relative;

  .card-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    margin-bottom: 6px;
    .course-icon {
      width: $icon-size;
      height: $icon-size;
      background: $icon-bg;
      border-radius: $icon-radius;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      .icon-text {
        font-size: 24px;
        font-weight: 700;
        color: $icon-color;
        font-family: 'Inter', 'Arial', sans-serif;
        user-select: none;
      }
    }
    .course-title {
      font-size: 16px;
      font-weight: 700;
      color: $title-color;
      line-height: 1.2;
      word-break: break-all;
    }
  }

  .desc-tooltip-wrapper {
    position: relative;
    width: 100%;
    margin-top: 12px;
    .course-desc {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 13px;
      color: $desc-color;
      margin-top: 2px;
      margin-bottom: 24px;
      line-height: 1.5;
      word-break: break-all;
      cursor: pointer;
      background: transparent;
      transition: color 0.2s;
    }
  }

  .course-date {
    position: absolute;
    right: 12px;
    bottom: 8px;
    font-size: 11px;
    color: $date-color;
    letter-spacing: 0.5px;
  }
}

.desc-tooltip-global {
  transition: opacity 0.2s;
}
.fade-tooltip-enter-active,
.fade-tooltip-leave-active {
  transition: opacity 0.2s;
}
.fade-tooltip-enter-from,
.fade-tooltip-leave-to {
  opacity: 0;
}
.fade-tooltip-enter-to,
.fade-tooltip-leave-from {
  opacity: 1;
}
</style>
