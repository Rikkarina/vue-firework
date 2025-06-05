import { ref } from 'vue'
import { downloadFile } from '@/apis/file'
import { ElMessage } from 'element-plus'

export function useFilePreview() {
  // 预览窗口的显示状态
  const isPreviewModalVisible = ref(false)
  // 当前正在预览的文件信息
  const previewFile = ref(null)
  // 预览文件的 URL (Blob URL)
  const previewUrl = ref('')
  // 预览加载状态
  const previewLoading = ref(false)

  // 检查文件是否可以预览
  const isPreviewable = (file) => {
    const previewableTypes = [
      // 图片
      'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg',
      // 文档
      'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
      // 文本
      'txt', 'md', 'json', 'xml', 'html', 'css', 'js', 'ts', 'jsx', 'tsx', 'vue',
      'java', 'py', 'c', 'cpp', 'h', 'hpp'
    ]
    return previewableTypes.includes(file.fileType?.toLowerCase())
  }

  // 打开预览窗口并加载文件
  const openPreviewModal = async (file) => {
    if (!file) {
      ElMessage.warning('无效的文件')
      return
    }

    if (!isPreviewable(file)) {
      ElMessage.warning('该文件类型暂不支持预览')
      return
    }

    previewFile.value = file
    isPreviewModalVisible.value = true
    previewLoading.value = true
    previewUrl.value = '' // 清空之前的预览 URL

    try {
      const response = await downloadFile(file.id)
      const blob = response.data

      // 对于文本文件，需要读取内容
      if (isTextFile(file)) {
        const text = await blob.text()
        previewFile.value = {
          ...file,
          content: text
        }
      }

      // 创建预览URL
      previewUrl.value = window.URL.createObjectURL(blob)

      if (file.fileType?.toLowerCase() === 'pdf') {
        previewUrl.value += '#zoom=fit'
      }
    } catch (error) {
      console.error('加载预览文件失败：', error)
      ElMessage.error('加载预览文件失败')
      closePreviewModal()
    } finally {
      previewLoading.value = false
    }
  }

  // 判断是否为文本文件
  const isTextFile = (file) => {
    const textTypes = [
      'txt', 'md', 'json', 'xml', 'html', 'css', 'js', 'ts', 'jsx', 'tsx', 'vue',
      'java', 'py', 'c', 'cpp', 'h', 'hpp'
    ]
    return textTypes.includes(file.fileType?.toLowerCase())
  }

  // 关闭预览窗口
  const closePreviewModal = () => {
    isPreviewModalVisible.value = false
    previewFile.value = null
    // 释放 Blob URL
    if (previewUrl.value) {
      window.URL.revokeObjectURL(previewUrl.value)
      previewUrl.value = ''
    }
  }

  return {
    isPreviewModalVisible,
    previewFile,
    previewUrl,
    previewLoading,
    openPreviewModal,
    closePreviewModal,
  }
}
