<template>
  <div class="home-content">
    <div class="welcome-message">
      <el-icon :size="20"><emoji-satisfied /></el-icon>
      欢迎使用 Firework！
    </div>

    <DepartmentSection
      v-for="(dept, index) in departments"
      :key="index"
      :department-name="dept.name"
      :courses="dept.courses"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DepartmentSection from './components/DepartmentSection.vue'

const departments = ref([
  {
    name: '计软智学院',
    courses: [
      {
        title: 'Python编程入门',
        description: '学习Python编程的基础，帮助入门编程。',
        date: '2023/11/01',
      },
      // 可继续添加其他课程...
    ],
  },
  {
    name: '自动化学院',
    courses: [
      { title: '自动控制原理', description: '掌握基础控制理论和方法', date: '2023/11/02' },
      // 可继续添加其他课程...
    ],
  },
])
</script>

<style lang="scss" scoped>
.home-content {
  padding: 20px;

  .welcome-message {
    margin-bottom: 30px;
    font-size: 18px;
    color: var(--text-primary, #606266);
  }


}
</style>
