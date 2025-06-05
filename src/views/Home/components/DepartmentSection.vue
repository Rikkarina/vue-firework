<template>
  <div class="department-section">
    <h2 class="department-title">{{ department.name }}</h2>
    <div class="course-grid">
      <template v-for="(course, index) in department.courses" :key="course.id">
        <CourseCard
          v-if="index < 7"
          :id="course.id"
          :title="course.title"
          :description="course.description"
          :date="course.date"
          :course-type="course.courseType"
          :credits="course.credits"
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
import CourseCard from '../../../components/CourseCard.vue'
import { More } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  department: {
    type: Object,
    required: true,
    validator: (value) => {
      return value && typeof value === 'object' && 'name' in value && 'courses' in value
    },
  },
})

const router = useRouter()

// 处理查看更多点击
const handleMoreClick = () => {
  router.push({
    name: 'DepartmentDetail',
    params: { id: props.department.id },
  })
}
</script>

<style lang="scss" scoped>
.department-section {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }

  .department-title {
    margin-bottom: 16px;
    font-size: 16px;
    color: #1f2937;
    font-weight: 500;
    padding-left: 8px;
  }

  .course-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 12px;
    padding: 0 8px;

    @media (max-width: 768px) {
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 12px;
    }

    @media (max-width: 480px) {
      grid-template-columns: 1fr;
      gap: 8px;
    }
  }

  .more-btn {
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: center;
    padding: 16px;
    height: 100%;
    min-height: 160px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #f9fafb;
    border-radius: 4px;

    &:hover {
      background-color: #f3f4f6;
    }

    .more-icon {
      margin-bottom: 8px;
      color: #6b7280;
    }

    p {
      font-size: 14px;
      color: #374151;
      margin: 0;
    }
  }
}
</style>
