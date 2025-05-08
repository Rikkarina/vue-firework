<template>
  <div class="department-section">
    <h2 class="department-title">{{ departmentName }}</h2>
    <div class="course-grid">
      <CourseCard
        v-for="(course, index) in courses"
        :key="index"
        :title="course.title"
        :description="course.description"
        :date="course.date"
      />
      <el-card v-if="courses.length >= 6" class="more-btn">
        <div class="more-icon">
          <el-icon :size="32"><more /></el-icon>
        </div>
        <p>查看更多</p>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import CourseCard from './CourseCard.vue'

defineProps({
  departmentName: {
    type: String,
    required: true,
  },
  courses: {
    type: Array,
    default: () => [],
  },
})
</script>

<style lang="scss" scoped>
.department-section {
  margin-bottom: 40px;
  margin-left: 20px;

  .department-title {
    margin-bottom: 20px;
    font-size: 20px;
    color: var(--primary-color, #2c3e50);
    font-weight: 600;
  }

  // 调整网格布局参数
  $grid-gap: 20px;

  .course-grid {
    margin-left: 20px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 20px;
    padding: 10px 0;

    @media (max-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 480px) {
      grid-template-columns: 1fr;
    }
  }

  .more-btn {
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: center;
    padding: 20px;

    &:hover {
      background-color: var(--hover-bg, #f5f7fa);
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .more-icon {
      margin-bottom: 8px;
      color: var(--text-secondary, #909399);
    }

    p {
      font-size: 14px;
      color: var(--text-primary, #303133);
      margin: 0;
    }
  }
}
</style>
