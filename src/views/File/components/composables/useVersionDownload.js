import { downloadFileVersion } from '@/apis/version'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'

export function useVersionDownload() {
  const downloadLoading = ref(false)

  const startDownloadVersion = async (fileId, versionId, fileName) => {
    // 检查是否已经在下载中
    if (downloadLoading.value) {
      ElMessage.warning('文件正在下载中，请勿重复操作')
      return
    }

    downloadLoading.value = true
    try {
      const response = await downloadFileVersion(fileId, versionId)

      // 直接使用 response.data，因为它已经是 Blob 了
      const blob = response.data

      // 从 Content-Disposition 获取文件名
      const contentDisposition = response.headers['content-disposition']
      let finalFileName = fileName
      if (contentDisposition) {
        const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition)
        if (matches != null && matches[1]) {
          finalFileName = decodeURIComponent(matches[1].replace(/['"]/g, ''))
        }
      }

      // 如果没有扩展名，添加扩展名
      if (!finalFileName.includes('.')) {
        const ext = 'pdf' // 默认使用 pdf 扩展名
        finalFileName = `${finalFileName}.${ext}`
      }

      const url = window.URL.createObjectURL(blob)

      // 创建下载链接
      const link = document.createElement('a')
      link.href = url
      link.download = finalFileName
      document.body.appendChild(link)
      link.click()

      // 清理
      setTimeout(() => {
        window.URL.revokeObjectURL(url)
        document.body.removeChild(link)
      }, 100)

      ElMessage.success('文件下载成功')
    } catch (error) {
      console.error('文件下载失败：', error)
      ElMessage.error('文件下载失败')
    } finally {
      downloadLoading.value = false
    }
  }

  // 处理下载
  const handleDownload = async (version) => {
    // 设置当前版本行的下载状态为true
    version.downloadLoading = true

    try {
      // 调用新的下载特定版本功能
      await startDownloadVersion(
        version.fileId,
        version.id,
        `${version.description || '文件'}-${version.version}.pdf`,
      )
    } finally {
      // 下载完成后设置当前版本行的下载状态为false
      version.downloadLoading = false
    }
  }

  return {
    handleDownload,
    downloadLoading,
  }
}
