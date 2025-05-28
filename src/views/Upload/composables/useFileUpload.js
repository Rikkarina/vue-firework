import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { uploadChunk, mergeChunks } from '@/apis/file'
import { useRouter } from 'vue-router'
import { FileChunk } from '@/utils/fileChunk'

export function useFileUpload() {
  const formRef = ref(null)
  const fileList = ref([])
  const uploading = ref(false)
  const uploadProgress = ref(0) // 添加上传进度

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
      return
    }

    fileList.value = [uploadFile]
  }

  // 处理文件移除
  const handleFileRemove = () => {
    fileList.value = []
  }

  // 处理超出文件限制
  const handleExceed = (files) => {
    ElMessage.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，将覆盖原有文件`)
    fileList.value = [files[0]]
  }

  // 上传分片
  const uploadChunks = async (chunks, fileInfo) => {
    const totalChunks = chunks.length
    let uploadedChunks = 0

    for (const chunk of chunks) {
      const formData = new FormData()
      formData.append('chunk', chunk.file)
      formData.append('chunkIndex', chunk.index)
      formData.append('fileName', fileInfo.name)
      formData.append('title', fileInfo.title)
      formData.append('type', fileInfo.type)
      formData.append('category', fileInfo.category)
      formData.append('courseId', fileInfo.courseId)
      formData.append('courseName', fileInfo.courseName)

      try {
        await uploadChunk(formData)
        uploadedChunks++
        // 更新上传进度
        uploadProgress.value = Math.floor((uploadedChunks / totalChunks) * 100)
      } catch (error) {
        console.error('分片上传失败：', error)
        throw error
      }
    }
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
      uploadProgress.value = 0

      const file = fileList.value[0].raw

      // 1. 创建文件分片
      const fileChunk = new FileChunk(file)
      const chunks = fileChunk.createFileChunks()

      // 2. 上传分片
      await uploadChunks(chunks, {
        name: file.name,
        ...formData,
      })

      // 3. 合并分片
      const mergeData = {
        fileName: file.name,
        ...formData,
      }

      const response = await mergeChunks(mergeData)

      if (response.code === 200) {
        ElMessage.success('文件上传成功')
        resetForm()
        router.push('/')
      } else {
        ElMessage.error(response.message || '文件上传失败')
      }
    } catch (error) {
      console.error('文件上传失败：', error)
      ElMessage.error('文件上传失败，请稍后重试')
    } finally {
      uploading.value = false
    }
  }

  // 重置表单
  const resetForm = () => {
    if (!formRef.value) return
    formRef.value.resetFields()
    fileList.value = []
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
  }
}
