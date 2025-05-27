import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { uploadFile } from '@/apis/file' // 导入上传文件API
import { useRouter } from 'vue-router' // 导入 useRouter

export function useFileUpload() {
  const formRef = ref(null)
  const fileList = ref([])
  const uploading = ref(false)

  const router = useRouter() // 获取路由器实例

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
    // 可以在这里添加文件类型和大小的验证
    console.log('文件变化：', uploadFile)
    // 在单文件模式下，on-change只会在添加新文件时触发一次
    // 我们需要确保fileList中始终只有一个文件
    fileList.value = [uploadFile]
  }

  // 处理文件移除
  const handleFileRemove = (uploadFile) => {
    console.log('文件移除：', uploadFile)
    // 清空fileList
    fileList.value = []
  }

  // 处理超出文件限制
  const handleExceed = (files) => {
    ElMessage.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，将覆盖原有文件`) // 提示用户
    fileList.value = [files[0]] // 替换为新选择的文件
    // 如果需要触发on-change的逻辑，可以手动调用
    // handleFileChange(files[0]) // 如果handleFileChange有额外逻辑需要执行的话
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

      // 调用上传文件API
      const response = await uploadFile({
        ...formData,
        file: fileList.value[0].raw, // 获取单个文件的原始File对象
      })

      if (response.code === 200) {
        // 根据实际API返回判断
        ElMessage.success('文件上传成功')
        resetForm() // 上传成功后重置表单
        router.push('/') // 上传成功后跳转到首页
      } else {
        ElMessage.error(response.message || '文件上传失败') // 根据实际API返回获取错误信息
      }
    } catch (error) {
      console.error('文件上传或表单验证失败：', error)
      ElMessage.error('文件上传失败，请稍后重试')
    } finally {
      uploading.value = false // 请求完成（无论成功或失败）后设置 loading 为 false
    }
  }

  // 重置表单
  const resetForm = () => {
    if (!formRef.value) return
    formRef.value.resetFields()
    fileList.value = [] // 清空文件列表
  }

  return {
    formRef,
    formData,
    rules,
    fileList,
    uploading,
    handleFileChange,
    handleFileRemove,
    handleExceed, // 导出handleExceed方法
    submitUpload,
    resetForm,
  }
}
