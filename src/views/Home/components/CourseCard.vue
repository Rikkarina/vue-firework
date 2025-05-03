<template>
  <el-card class="course-card">
    <div class="course-icon">
      <el-icon :size="32"><file-document /></el-icon>
    </div>
    <h3 class="course-title">{{ title }}</h3>
    <p class="course-desc">{{ description }}</p>
    <p class="course-date">最后修改日期：{{ date }}</p>
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
$title-color: #333;
$desc-color: #666;
$date-color: #999;

// 新增尺寸变量
$card-size: 200px;
$card-margin: 10px;

.course-card {
  width: $card-size;
  height: $card-size;
  margin: $card-margin;
  padding: 20px;
  text-align: center;
  background: $card-bg;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  .course-icon {
    margin-bottom: 10px;
  }

  .course-title {
    margin-bottom: 10px;
    font-size: 16px;
    color: $title-color;
  }

  .course-desc {
    margin-bottom: 10px;
    font-size: 14px;
    color: $desc-color;
    height: 40px;
    overflow: hidden;
  }

  .course-date {
    font-size: 12px;
    color: $date-color;
  }
}
</style>
