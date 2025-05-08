<template>
  <div class="department-section">
    <h2 class="department-title">{{ department.name }}</h2>
    <div class="course-grid">
      <template v-for="(course, index) in department.courses" :key="course.id">
        <CourseCard
          v-if="index < 7"
          :title="course.title"
          :description="course.description"
          :date="course.date"
        />
        <el-card v-else-if="index === 7" class="more-btn" @click="handleMoreClick">
          <div class="more-icon">
            <el-icon :size="32"><more /></el-icon>
          </div>
          <p>查看更多</p>
        </el-card>
      </template>
    </div>
  </div>
</template>

<script setup>
import CourseCard from './CourseCard.vue'
import { More } from '@element-plus/icons-vue'

const props = defineProps({
  department: {
    type: Object,
    required: true,
    validator: (value) => {
      return value && typeof value === 'object' && 'name' in value && 'courses' in value
    },
  },
})

// 处理查看更多点击
const handleMoreClick = () => {
  // TODO: 实现查看更多逻辑，可以跳转到部门详情页或展开更多课程
  console.log('查看更多课程:', props.department.name)
}
</script>

<style lang="scss" scoped>
.department-section {
  margin-bottom: 40px;
  margin-left: 20px;

  .department-title {
    margin-bottom: 10px;
    font-size: 20px;
    color: var(--primary-color, #2c3e50);
    font-weight: 600;
  }

  .course-grid {
    margin-left: 20px;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    padding: 10px 0;

    @media (max-width: 768px) {
      gap: 15px;
    }

    @media (max-width: 480px) {
      gap: 10px;
    }
  }

  .more-btn {
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: center;
    padding: 20px;
    width: 200px; // 与CourseCard宽度保持一致
    height: 180px; // 与CourseCard高度保持一致

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
