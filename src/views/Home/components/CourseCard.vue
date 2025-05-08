<template>
  <el-card class="course-card">
    <div class="card-header">
      <div class="course-icon">
        <span class="icon-text">{{ title.charAt(0).toUpperCase() }}</span>
      </div>
      <div class="course-title">{{ title }}</div>
    </div>
    <div class="course-desc">{{ description }}</div>
    <div class="course-date">最后修改日期：{{ date }}</div>
  </el-card>
</template>

<script setup>
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

.course-card {
  width: 200px;
  min-height: 120px;
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

  .course-desc {
    font-size: 13px;
    color: $desc-color;
    margin-top: 2px;
    margin-bottom: 24px;
    line-height: 1.5;
    word-break: break-all;
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
</style>
