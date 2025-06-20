import { ref } from 'vue'
import { downloadFile } from '@/apis/file'
import { downloadFileVersion } from '@/apis/version'
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

  // 打开预览窗口并加载文件
  const openPreviewModal = async (file, isVersion = false) => {
    previewFile.value = file
    isPreviewModalVisible.value = true
    previewLoading.value = true
    previewUrl.value = '' // 清空之前的预览 URL

    try {
      let response
      if (isVersion) {
        // 如果是版本预览，使用 downloadFileVersion API
        response = await downloadFileVersion(file.id, file.versionId)
      } else {
        // 如果是普通文件预览，使用 downloadFile API
        response = await downloadFile(file.id)
      }

      const blob = response.data
      previewUrl.value = window.URL.createObjectURL(blob) + '#zoom=fit'
    } catch (error) {
      console.error('加载预览文件失败：', error)
      ElMessage.error('加载预览文件失败')
      closePreviewModal() // 加载失败则关闭窗口
    } finally {
      previewLoading.value = false
    }
  }

  // 关闭预览窗口
  const closePreviewModal = () => {
    isPreviewModalVisible.value = false
    previewFile.value = null
    // 释放 Blob URL，避免内存泄漏
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
