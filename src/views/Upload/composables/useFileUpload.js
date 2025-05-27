import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

export function useFileUpload() {
  const formRef = ref(null)
  const fileList = ref([])
  const uploading = ref(false)

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

  return {
    formRef,
    formData,
    rules,
    fileList,
    uploading,
    handleFileChange,
    handleFileRemove,
    submitUpload,
    resetForm,
  }
}
