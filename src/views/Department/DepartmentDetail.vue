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
      <div class="filters">
        <el-select v-model="selectedSemester" placeholder="学期" clearable style="width: 120px">
          <el-option
            v-for="item in semesterOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select v-model="selectedCredits" placeholder="学分" clearable style="width: 100px">
          <el-option v-for="item in creditsOptions" :key="item" :label="item" :value="item" />
        </el-select>
        <el-select v-model="selectedType" placeholder="课程类型" clearable style="width: 100px">
          <el-option label="必修" value="必修" />
          <el-option label="选修" value="选修" />
        </el-select>
      </div>
      <div class="course-grid">
        <CourseCard
          v-for="course in filteredCourses"
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
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getDepartmentCourses } from '@/apis/department'

const route = useRoute()
const loading = ref(false)
const error = ref(null)
const departmentName = ref('')
const courses = ref([])

const selectedSemester = ref('')
const selectedCredits = ref('')
const selectedType = ref('')

const semesterOptions = computed(() => {
  const set = new Set()
  courses.value.forEach((c) => {
    if (c.semester?.grade && c.semester?.term) {
      set.add(`${c.semester.grade}-${c.semester.term}`)
    }
  })
  return Array.from(set).map((v) => ({
    label: v,
    value: v,
  }))
})

const creditsOptions = computed(() => {
  const set = new Set()
  courses.value.forEach((c) => {
    if (c.credits) {
      set.add(c.credits)
    }
  })
  return ['全部', ...Array.from(set)]
})

const filteredCourses = computed(() => {
  return courses.value.filter((course) => {
    let match = true
    if (selectedSemester.value && course.semester?.grade && course.semester?.term) {
      match = match && `${course.semester.grade}-${course.semester.term}` === selectedSemester.value
    }
    if (selectedCredits.value && selectedCredits.value !== '全部') {
      match = match && course.credits === selectedCredits.value
    }
    if (selectedType.value) {
      match = match && course.courseType === selectedType.value
    }
    return match
  })
})

const fetchDepartmentCourses = async () => {
  loading.value = true
  try {
    const res = await getDepartmentCourses(route.params.id)
    if (res.data) {
      departmentName.value = res.data.departmentName
      courses.value = res.data.courses
    } else {
      error.value = '数据格式错误'
    }
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

  .filters {
    display: flex;
    gap: 16px;
    margin-bottom: 20px;
    margin-left: 20px;
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
