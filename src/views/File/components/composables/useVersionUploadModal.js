import { ref } from 'vue'

export function useVersionUploadModal() {
  const showUploadVersionModal = ref(false)

  // 处理上传
  const handleUpload = () => {
    showUploadVersionModal.value = true
  }

  return {
    showUploadVersionModal,
    handleUpload,
  }
}
