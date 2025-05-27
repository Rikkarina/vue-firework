<template>
  <div class="upload-container">
    <el-card class="upload-card">
      <template #header>
        <div class="card-header">
          <h2>文件上传</h2>
        </div>
      </template>

      <el-form :model="formData" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="文件标题" prop="title">
          <el-input v-model="formData.title" placeholder="请输入文件标题" />
        </el-form-item>

        <el-form-item label="文件类型" prop="type">
          <el-select v-model="formData.type" placeholder="请选择文件类型">
            <el-option v-for="(value, key) in FileType" :key="key" :label="value" :value="value" />
          </el-select>
        </el-form-item>

        <el-form-item label="文件分类" prop="category">
          <el-select v-model="formData.category" placeholder="请选择文件分类">
            <el-option
              v-for="(value, key) in FileCategory"
              :key="key"
              :label="value"
              :value="value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="文件标签" prop="tags">
          <el-select
            v-model="formData.tags"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请选择或输入标签"
          >
            <el-option v-for="tag in tagOptions" :key="tag" :label="tag" :value="tag" />
          </el-select>
        </el-form-item>

        <el-form-item label="所属课程" prop="courseId">
          <el-select
            v-model="formData.courseId"
            placeholder="请输入关键词搜索课程"
            clearable
            filterable
            remote
            :remote-method="handleCourseSearch"
            :loading="courseLoading"
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

        <el-form-item label="上传文件" prop="file" required>
          <el-upload
            v-model:file-list="fileList"
            :auto-upload="false"
            :on-change="handleFileChange"
            :on-remove="handleFileRemove"
            drag
            action=""
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">将文件拖到此处或 <em>点击上传</em></div>
            <template #tip>
              <div class="el-upload__tip">支持的文件格式：PDF、Word、Excel、PPT、图片等</div>
            </template>
          </el-upload>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitUpload" :loading="uploading">
            提交上传
          </el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import { FileType, FileCategory } from '@/types/fileTypes'
import { getDepartmentsWithCourses } from '@/apis/department'

// 表单数据
const formData = reactive({
  title: '',
  type: '',
  category: '',
  tags: [],
  courseId: '',
  courseName: '',
})

// 表单校验规则
const rules = {
  title: [{ required: true, message: '请输入文件标题', trigger: 'blur' }],
  type: [{ required: true, message: '请选择文件类型', trigger: 'change' }],
  category: [{ required: true, message: '请选择文件分类', trigger: 'change' }],
  tags: [{ required: true, message: '请至少添加一个标签', trigger: 'change' }],
  courseId: [{ required: true, message: '请选择所属课程', trigger: 'change' }],
}

// 文件列表
const fileList = ref([])
const uploading = ref(false)
const formRef = ref(null)
const courseOptions = ref([])
const courseLoading = ref(false)
const searchKeyword = ref('')

// 标签选项（示例数据）
const tagOptions = ['重要', '基础', '进阶', '考试', '作业', '复习']

// 根据关键词筛选课程
const filteredCourses = computed(() => {
  if (!searchKeyword.value) {
    return courseOptions.value
  }
  const keyword = searchKeyword.value.toLowerCase()
  return courseOptions.value.filter(
    (course) =>
      course.name.toLowerCase().includes(keyword) ||
      course.department.toLowerCase().includes(keyword),
  )
})

// 处理课程搜索
const handleCourseSearch = (query) => {
  searchKeyword.value = query
}

// 获取课程列表
const fetchCourses = async () => {
  courseLoading.value = true
  try {
    const { data } = await getDepartmentsWithCourses()

    // 将所有部门的课程合并到一个数组中
    const allCourses = data.reduce((acc, dept) => {
      const courses = dept.courses.map((course) => ({
        id: course.id,
        name: course.title,
        department: dept.name,
      }))
      return [...acc, ...courses]
    }, [])

    courseOptions.value = allCourses
  } catch (error) {
    console.error('获取课程列表失败：', error)
    ElMessage.error('获取课程列表失败')
  } finally {
    courseLoading.value = false
  }
}

// 处理课程选择
const handleCourseChange = (courseId) => {
  const selectedCourse = courseOptions.value.find((course) => course.id === courseId)
  if (selectedCourse) {
    formData.courseName = selectedCourse.name
  }
}

// 处理文件变化
const handleFileChange = (file) => {
  // 可以在这里添加文件类型和大小的验证
  console.log('文件变化：', file)
}

// 处理文件移除
const handleFileRemove = (file) => {
  console.log('文件移除：', file)
}

// 提交上传
const submitUpload = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    if (fileList.value.length === 0) {
      ElMessage.warning('请选择要上传的文件')
      return
    }

    uploading.value = true

    // TODO: 实现文件上传逻辑
    const uploadData = {
      ...formData,
      file: fileList.value[0].raw,
    }

    console.log('上传数据：', uploadData)
    ElMessage.success('文件上传成功')
  } catch (error) {
    console.error('表单验证失败：', error)
    ElMessage.error('请检查表单填写是否正确')
  } finally {
    uploading.value = false
  }
}

// 重置表单
const resetForm = () => {
  if (!formRef.value) return
  formRef.value.resetFields()
  fileList.value = []
}

onMounted(() => {
  fetchCourses()
})
</script>

<style lang="scss" scoped>
.upload-container {
  padding: 20px;

  .upload-card {
    max-width: 800px;
    margin: 0 auto;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      h2 {
        margin: 0;
        font-size: 20px;
        font-weight: 600;
        color: #1a1a1a;
      }
    }

    :deep(.el-upload-dragger) {
      width: 100%;
      padding: 40px 20px;
    }

    .el-upload__tip {
      margin-top: 8px;
      color: #666;
      font-size: 12px;
    }

    :deep(.el-select) {
      width: 100%;
    }
  }
}
</style>
