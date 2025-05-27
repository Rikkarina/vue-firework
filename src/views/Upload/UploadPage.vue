<script setup>
import { onMounted } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import { FileType, FileCategory } from '@/types/fileTypes'
import { useCourseSelect } from '@/views/Upload/composables/useCourseSelect'
import { useFileUpload } from '@/views/Upload/composables/useFileUpload'

// 使用课程选择相关的 composable
const { courseLoading, filteredCourses, handleCourseSearch, fetchCourses } = useCourseSelect()

// 使用文件上传相关的 composable
const {
  formRef,
  formData,
  rules,
  fileList,
  uploading,
  handleFileChange,
  handleFileRemove,
  handleExceed,
  submitUpload,
  resetForm,
} = useFileUpload()

// 处理课程选择变化，因为使用到了formData所以不封装在useCourseSelect中
const handleCourseChange = (courseId) => {
  const selectedCourse = filteredCourses.value.find((course) => course.id === courseId)
  if (selectedCourse) {
    formData.courseName = selectedCourse.name
  }
}

// 组件挂载时获取课程列表
onMounted(() => {
  fetchCourses()
})
</script>

<template>
  <div class="upload-page">
    <el-card class="upload-card">
      <template #header>
        <div class="card-header">
          <h2>文件上传</h2>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
        class="upload-form"
      >
        <el-form-item label="文件标题" prop="title">
          <el-input v-model="formData.title" placeholder="请输入文件标题" />
        </el-form-item>

        <el-form-item label="文件类型" prop="type">
          <el-select v-model="formData.type" placeholder="请选择文件类型">
            <el-option
              v-for="(label, value) in FileType"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="文件分类" prop="category">
          <el-select v-model="formData.category" placeholder="请选择文件分类">
            <el-option
              v-for="(label, value) in FileCategory"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="所属课程" prop="courseId">
          <el-select
            v-model="formData.courseId"
            filterable
            remote
            :remote-method="handleCourseSearch"
            :loading="courseLoading"
            placeholder="请输入关键词搜索课程"
            @change="handleCourseChange"
          >
            <el-option
              v-for="course in filteredCourses"
              :key="course.id"
              :label="`${course.name} (${course.department})`"
              :value="course.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="上传文件" prop="file">
          <el-upload
            v-model:file-list="fileList"
            class="upload-demo"
            drag
            action="#"
            :auto-upload="false"
            :on-change="handleFileChange"
            :on-remove="handleFileRemove"
            :limit="1"
            :on-exceed="handleExceed"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <template #tip>
              <div class="el-upload__tip">支持任意类型文件上传</div>
            </template>
          </el-upload>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitUpload" :loading="uploading">
            上传文件
          </el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.upload-page {
  padding: 20px;
}

.upload-card {
  max-width: 800px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  margin: 0;
  font-size: 1.5em;
  color: #303133;
}

.upload-form {
  margin-top: 20px;
}

.upload-form :deep(.el-select) {
  width: 100%;
}

.upload-demo {
  width: 100%;
}

:deep(.el-upload-dragger) {
  width: 100%;
}

.el-upload__tip {
  color: #909399;
  font-size: 12px;
  margin-top: 7px;
}

/* 统一el-input和el-select的placeholder样式 */
.upload-form :deep(.el-input__inner::placeholder),
.upload-form :deep(.el-select__input::placeholder),
.upload-form :deep(.el-textarea__inner::placeholder) {
  /* 标准语法 */
  color: #a8abb2 !important;
  font-size: 14px !important;
  font-weight: normal !important;
}

.upload-form :deep(.el-input__inner::-webkit-input-placeholder),
.upload-form :deep(.el-select__input::-webkit-input-placeholder),
.upload-form :deep(.el-textarea__inner::-webkit-input-placeholder) {
  /* Chrome, Safari */
  color: #a8abb2 !important;
  font-size: 14px !important;
  font-weight: normal !important;
}

.upload-form :deep(.el-input__inner:-ms-input-placeholder),
.upload-form :deep(.el-select__input:-ms-input-placeholder),
.upload-form :deep(.el-textarea__inner:-ms-input-placeholder) {
  /* IE 10+ */
  color: #a8abb2 !important;
  font-size: 14px !important;
  font-weight: normal !important;
}

.upload-form :deep(.el-input__inner::-ms-input-placeholder),
.upload-form :deep(.el-select__input::-ms-input-placeholder),
.upload-form :deep(.el-textarea__inner::-ms-ms-input-placeholder) {
  /* Edge */
  color: #a8abb2 !important;
  font-size: 14px !important;
  font-weight: normal !important;
}
</style>
