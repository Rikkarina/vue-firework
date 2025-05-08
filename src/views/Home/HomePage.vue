<template>
  <div class="home-page">
    <div class="main-content">
      <div class="left-section">
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
          />
        </template>
      </div>
      <div class="right-section">
        <MessageCenter />
        <LastVisited />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DepartmentSection from './components/DepartmentSection.vue'
import MessageCenter from './components/MessageCenter.vue'
import LastVisited from './components/LastVisited.vue'
import { getDepartmentsWithCourses } from '@/apis/department'

const departments = ref([])
const loading = ref(false)
const error = ref(null)

const fetchDepartments = async () => {
  loading.value = true
  try {
    const res = await getDepartmentsWithCourses()
    departments.value = res.data
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDepartments()
})
</script>

<style lang="scss" scoped>
.home-page {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  gap: 32px;

  .main-content {
    flex: 1;
    height: 100%;
    padding: 20px 0 20px 20px;
    display: flex;
    gap: 32px;
    overflow: hidden;

    .left-section {
      flex: 3;
      height: 100%;
      overflow-y: auto;
      padding-right: 20px;

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

      .welcome-message {
        margin-bottom: 30px;
        font-size: 18px;
        color: var(--text-primary, #606266);
      }

      .loading-state {
        padding: 20px;
      }

      .error-state {
        margin: 20px;
      }
    }

    .right-section {
      flex: 1;
      min-width: 260px;
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 24px;
      padding: 20px 20px 20px 0;
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
    }
  }
}
</style>
