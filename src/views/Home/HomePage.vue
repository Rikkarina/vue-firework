<template>
  <div class="home-page" @click="handlePageClick">
    <div class="main-content">
      <div class="departments-section">
        <div v-if="loading" class="loading-state">
          <el-skeleton :rows="3" animated />
        </div>
        <div v-else-if="error" class="error-state">
          <el-alert :title="error" type="error" show-icon @close="fetchDepartments" />
        </div>
        <template v-else>
          <DepartmentSection
            v-for="department in departments"
            :key="department.id"
            :department="department"
            @click="handleDepartmentClick(department)"
          />
        </template>
      </div>
      <div class="side-section">
        <div class="widget-container">
          <LastVisited />
        </div>
        <div class="widget-container">
          <MessageWidget />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeMount, onUpdated } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import DepartmentSection from './components/DepartmentSection.vue'
import LastVisited from './components/LastVisited.vue'
import MessageWidget from '@/components/MessageWidget.vue'
import { getDepartmentsWithCourses } from '@/apis/department'

console.log('HomePage setup script starting')

const router = useRouter()
const route = useRoute()
console.log('HomePage current route:', route.fullPath)

const departments = ref([])
const loading = ref(false)
const error = ref(null)

const handlePageClick = (event) => {
  console.log('=== HomePage Click Debug Info ===')
  console.log('Page clicked:', event)
  console.log('Click target:', event.target)
  console.log('Click path:', event.path || event.composedPath())
  console.log('Click coordinates:', { x: event.clientX, y: event.clientY })
  console.log('Current route:', route.fullPath)
}

const handleDepartmentClick = (department) => {
  console.log('Department clicked:', department)
  console.log('Department ID:', department.id)
  console.log('Current departments state:', departments.value)
}

const fetchDepartments = async () => {
  console.log('Fetching departments...')
  loading.value = true
  try {
    console.log('Making API call to getDepartmentsWithCourses')
    const res = await getDepartmentsWithCourses()
    console.log('API response:', res)
    departments.value = res.data
    console.log('Departments updated:', departments.value)
  } catch (err) {
    console.error('Error fetching departments:', err)
    error.value = err.message
  } finally {
    loading.value = false
    console.log('Department fetch completed, loading state:', loading.value)
  }
}

onBeforeMount(() => {
  console.log('HomePage before mount')
  console.log('Initial route:', route.fullPath)
})

onMounted(() => {
  console.log('HomePage mounted')
  console.log('Window location:', window.location.href)
  console.log('Route at mount:', route.fullPath)
  fetchDepartments()
})

onUpdated(() => {
  console.log('HomePage updated')
  console.log('Current departments:', departments.value)
  console.log('Loading state:', loading.value)
  console.log('Error state:', error.value)
})
</script>

<style lang="scss" scoped>
.home-page {
  padding: 24px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 60px); // 减去顶部导航栏高度

  .main-content {
    max-width: 1440px;
    margin: 0 auto;
    display: flex;
    gap: 24px;
    height: calc(100vh - 108px); // 减去顶部导航栏(60px)和页面padding(24px*2)

    .departments-section {
      flex: 1;
      min-width: 0;
      background: #fff;
      border-radius: 4px;
      padding: 20px;
      overflow-y: auto;

      // 自定义滚动条样式
      &::-webkit-scrollbar {
        width: 4px;
      }

      &::-webkit-scrollbar-thumb {
        background: #dcdfe6;
        border-radius: 2px;
      }

      &::-webkit-scrollbar-track {
        background: transparent;
      }

      // 加载和错误状态的容器样式
      .loading-state, .error-state {
        padding: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    .side-section {
      width: 280px;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      gap: 16px;

      .widget-container {
        flex: 1;
        min-height: 200px;
        max-height: calc((100vh - 140px) / 2); // 减去间距和padding
        overflow: hidden;
        background: #fff;
        border-radius: 4px;
      }
    }
  }
}

// 响应式布局
@media screen and (max-width: 1200px) {
  .home-page .main-content {
    flex-direction: column;
    height: auto;

    .departments-section {
      max-height: calc(100vh - 108px);
    }

    .side-section {
      width: 100%;
      flex-direction: row;

      .widget-container {
        flex: 1;
        height: 320px;
        max-height: 320px;
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .home-page {
    padding: 16px;

    .main-content {
      gap: 16px;

      .departments-section {
        padding: 16px;
      }

      .side-section {
        flex-direction: column;
        gap: 16px;

        .widget-container {
          height: 280px;
          max-height: 280px;
        }
      }
    }
  }
}
</style>
