import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { mergeChunks } from '@/apis/file'
import { useRouter } from 'vue-router'

export function useFileUpload() {
  const formRef = ref(null)
  const fileList = ref([])
  const uploading = ref(false)
  const uploadProgress = ref(0)
  const uploadedFile = ref(null)

  const router = useRouter()

  // 表单数据
  const formData = reactive({
    title: '',
    type: '',
    category: '',
    courseId: '',
    courseName: '',
  })

  // 表单校验规则
  const rules = {
    title: [{ required: true, message: '请输入文件标题', trigger: 'blur' }],
    type: [{ required: true, message: '请选择文件类型', trigger: 'change' }],
    category: [{ required: true, message: '请选择文件分类', trigger: 'change' }],
    courseId: [{ required: true, message: '请选择所属课程', trigger: 'change' }],
  }

  // 处理文件变化
  const handleFileChange = (uploadFile) => {
    // 只保留文件大小限制（可选）
    const maxSize = 1024 * 1024 * 1024 // 1GB
    if (uploadFile.raw.size > maxSize) {
      ElMessage.error('文件大小不能超过 1GB')
      return false
    }
  }

  // 处理文件移除
  const handleFileRemove = () => {
    fileList.value = []
    uploadedFile.value = null
    uploadProgress.value = 0
  }

  // 处理超出文件限制
  const handleExceed = (files) => {
    ElMessage.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，将覆盖原有文件`)
    fileList.value = [files[0]]
  }

  // 上传前检查
  const beforeUpload = (file) => {
    const maxSize = 1024 * 1024 * 1024 // 1GB
    if (file.size > maxSize) {
      ElMessage.error('文件大小不能超过 1GB')
      return false
    }
    uploading.value = true
    uploadProgress.value = 0
    return true
  }

  // 处理上传进度
  const handleProgress = (event) => {
    uploadProgress.value = Math.floor(event.percent)
  }

  // 处理上传成功
  const handleUploadSuccess = (response, file) => {
    if (response.code === 200) {
      uploadedFile.value = {
        name: file.name,
        size: file.size,
        ...response.data,
      }
      ElMessage.success('文件上传成功')
    } else {
      ElMessage.error(response.message || '文件上传失败')
    }
    uploading.value = false
  }

  // 处理上传失败
  const handleUploadError = (error) => {
    console.error('文件上传失败：', error)
    ElMessage.error('文件上传失败，请重试')
    uploading.value = false
  }

  // 提交上传（保存文件信息）
  const submitUpload = async () => {
    if (!formRef.value) return

    try {
      await formRef.value.validate()

      if (!uploadedFile.value) {
        ElMessage.warning('请先上传文件')
        return
      }

      uploading.value = true

      // 合并分片
      const mergeData = {
        fileName: uploadedFile.value.name,
        fileSize: uploadedFile.value.size,
        ...formData,
      }

      const response = await mergeChunks(mergeData)

      if (response.code === 200) {
        ElMessage.success('文件信息保存成功')
        resetForm()
        router.push('/')
      } else {
        ElMessage.error(response.message || '文件信息保存失败')
      }
    } catch (error) {
      console.error('保存文件信息失败：', error)
      ElMessage.error('保存文件信息失败，请稍后重试')
    } finally {
      uploading.value = false
    }
  }

  // 重置表单
  const resetForm = () => {
    if (!formRef.value) return
    formRef.value.resetFields()
    fileList.value = []
    uploadedFile.value = null
    uploadProgress.value = 0
  }

  return {
    formRef,
    formData,
    rules,
    fileList,
    uploading,
    uploadProgress,
    handleFileChange,
    handleFileRemove,
    handleExceed,
    submitUpload,
    resetForm,
    handleProgress,
    handleUploadSuccess,
    handleUploadError,
    beforeUpload,
  }
}
