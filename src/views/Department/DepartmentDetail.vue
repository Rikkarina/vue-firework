<template>
  <div class="department-detail">
    <div v-if="loading" class="loading-state">
      <el-skeleton :rows="3" animated />
    </div>
    <div v-else-if="error" class="error-state">
      <el-alert :title="error" type="error" show-icon @close="fetchDepartmentCourses" />
    </div>
    <template v-else>
      <div class="header">
        <h1 class="department-name">{{ departmentName }}</h1>
      </div>
      <div class="course-grid">
        <CourseCard
          v-for="course in courses"
          :key="course.id"
          :title="course.title"
          :description="course.description"
          :date="course.date"
        />
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getDepartmentCourses } from '@/apis/department'

const route = useRoute()
const loading = ref(false)
const error = ref(null)
const departmentName = ref('')
const courses = ref([])

const fetchDepartmentCourses = async () => {
  loading.value = true
  try {
    const res = await getDepartmentCourses(route.params.id)
    departmentName.value = res.data.departmentName
    courses.value = res.data.courses
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDepartmentCourses()
})
</script>

<style lang="scss" scoped>
.department-detail {
  padding: 20px;
  height: 100%;
  overflow-y: auto;

  // 自定义滚动条样式
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--el-border-color-darker);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-track {
    background-color: var(--el-border-color-light);
    border-radius: 3px;
  }

  .header {
    margin-bottom: 24px;

    .department-name {
      font-size: 24px;
      color: var(--el-text-color-primary);
      font-weight: 600;
    }
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

  .loading-state {
    padding: 20px;
  }

  .error-state {
    margin: 20px;
  }
}
</style>
