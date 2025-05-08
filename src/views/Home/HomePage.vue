<template>
  <div class="home-page-layout">
    <div class="home-content">
      <DepartmentSection
        v-for="(dept, index) in departments"
        :key="index"
        :department-name="dept.name"
        :courses="dept.courses"
      />
    </div>
    <div class="home-side">
      <MessageCenter class="side-block" />
      <LastVisited class="side-block" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DepartmentSection from './components/DepartmentSection.vue'
import MessageCenter from './components/MessageCenter.vue'
import LastVisited from './components/LastVisited.vue'

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
.home-page-layout {
  display: flex;
  flex-direction: row;
  gap: 32px;
}
.home-content {
  flex: 3;
  padding: 20px 0 20px 20px;
}
.home-side {
  flex: 1;
  min-width: 260px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 20px 20px 20px 0;
}
.side-block {
  margin-bottom: 0;
}
</style>
