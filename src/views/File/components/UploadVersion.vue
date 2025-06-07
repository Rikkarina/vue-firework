<template>
  <el-dialog
    v-model="visible"
    title="上传新版本"
    width="50%"
    :close-on-click-modal="false"
    class="upload-version-modal"
  >
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px" class="upload-form">
      <el-form-item label="版本号" prop="version">
        <el-input v-model="formData.version" placeholder="请输入版本号 (如 v1.0.0)" />
      </el-form-item>
      <el-form-item label="版本描述" prop="description">
        <el-input
          v-model="formData.description"
          placeholder="请输入版本描述"
          type="textarea"
          :rows="3"
        />
      </el-form-item>

      <el-form-item label="上传文件" prop="file">
        <el-upload
          v-model:file-list="fileList"
          class="upload-demo"
          drag
          action="/api/files/chunk"
          :auto-upload="true"
          :on-change="handleFileChange"
          :on-remove="handleFileRemove"
          :on-progress="handleProgress"
          :on-success="handleUploadSuccess"
          :on-error="handleUploadError"
          :limit="1"
          :on-exceed="handleExceed"
          :before-upload="beforeUpload"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <template #tip>
            <div class="el-upload__tip">支持任意类型文件上传，单个文件最大支持1GB</div>
          </template>
        </el-upload>

        <el-progress
          v-if="uploading"
          :percentage="uploadProgress"
          :status="uploadProgress === 100 ? 'success' : ''"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          @click="submitUpload"
          :loading="uploading"
          :disabled="!fileList.length || fileList[0].status !== 'success'"
        >
          保存新版本
        </el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { computed, ref, reactive, watch } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { createFileVersion } from '@/apis/version'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  fileId: {
    type: [String, Number],
    required: true,
  },
})

const emit = defineEmits(['update:modelValue', 'success'])

// 控制模态框显示
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

// 表单引用
const formRef = ref(null)

// 表单数据
const formData = reactive({
  description: '',
  version: '',
  file: null, // 用于存储上传的文件信息，不是实际文件对象
})

// 文件列表，用于el-upload
const fileList = ref([])

// 上传状态
const uploading = ref(false)
const uploadProgress = ref(0)

// 表单校验规则
const rules = {
  description: [{ required: true, message: '请输入版本描述', trigger: 'blur' }],
  version: [{ required: true, message: '请输入版本号', trigger: 'blur' }],
  file: [{ required: true, message: '请上传文件', trigger: 'change' }],
}

// 处理文件变化 (ElUpload的onChange)
const handleFileChange = (uploadFile) => {
  const maxSize = 1024 * 1024 * 1024 // 1GB
  if (uploadFile.raw.size > maxSize) {
    ElMessage.error('文件大小不能超过 1GB')
    fileList.value = [] // 清空文件列表
    return false
  }
  formData.file = uploadFile.raw // 保存文件原始信息
  fileList.value = [uploadFile]
}

// 处理文件移除 (ElUpload的onRemove)
const handleFileRemove = () => {
  fileList.value = []
  formData.file = null
  uploadProgress.value = 0
}

// 处理超出文件限制 (ElUpload的onExceed)
const handleExceed = (files) => {
  ElMessage.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，将覆盖原有文件`)
  fileList.value = [files[0]]
  formData.file = files[0].raw
}

// 上传前检查 (ElUpload的beforeUpload)
const beforeUpload = () => {
  // 大小校验已在handleFileChange中处理
  uploading.value = true
  uploadProgress.value = 0
  return true
}

// 处理上传进度 (ElUpload的onProgress)
const handleProgress = (event) => {
  uploadProgress.value = Math.floor(event.percent)
}

// 处理文件上传成功 (ElUpload的onSuccess)
const handleUploadSuccess = (response) => {
  if (response.code === 200) {
    formData.file = {
      ...formData.file,
      fileName: response.data.fileName,
      fileSize: response.data.fileSize,
    } // 存储服务器返回的文件名和大小
    ElMessage.success('文件上传成功')
    uploading.value = false // 上传成功后重置loading状态
  } else {
    ElMessage.error(response.message || '文件上传失败')
    handleUploadError() // 调用失败处理
  }
}

// 处理文件上传失败 (ElUpload的onError)
const handleUploadError = () => {
  uploading.value = false
  uploadProgress.value = 0
  fileList.value = []
  formData.file = null
  ElMessage.error('文件上传失败')
}

// 提交表单 (保存新版本信息)
const submitUpload = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    if (!formData.file) {
      ElMessage.warning('请先上传文件')
      return
    }

    uploading.value = true

    // 创建 FormData 对象
    const submitData = new FormData()
    submitData.append('file', formData.file)
    submitData.append('description', formData.description)
    submitData.append('version', formData.version)

    // 调用创建版本 API
    const response = await createFileVersion(props.fileId, submitData)

    if (response.code === 200) {
      ElMessage.success('新版本上传成功')
      emit('update:modelValue', false)
      emit('success')
      resetForm()
    } else {
      ElMessage.error(response.message || '新版本上传失败')
    }
  } catch (error) {
    console.error('上传新版本失败：', error)
    ElMessage.error('上传新版本失败，请稍后重试')
  } finally {
    uploading.value = false
  }
}

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  fileList.value = []
  formData.file = null
  uploading.value = false
  uploadProgress.value = 0
}

// 关闭模态框时重置表单
watch(
  () => props.modelValue,
  (newVal) => {
    if (!newVal) {
      resetForm()
    }
  },
)
</script>

<style lang="scss" scoped>
.upload-version-modal {
  :deep(.el-dialog__body) {
    padding: 20px;
  }

  .upload-form {
    .upload-demo {
      width: 100%;
    }

    :deep(.el-upload-dragger) {
      width: 100%;
    }

    .el-upload__text {
      font-size: 14px;
      color: #606266;

      em {
        color: #409eff;
        font-style: normal;
      }
    }

    .el-upload__tip {
      font-size: 12px;
      color: #909399;
      margin-top: 7px;
    }

    .el-progress {
      margin-top: 10px;
    }
  }
}
</style>
