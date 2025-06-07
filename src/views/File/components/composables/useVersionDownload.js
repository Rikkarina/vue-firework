import { downloadFileVersion } from '@/apis/version' // 导入特定版本下载API
import { ElMessage } from 'element-plus'

export function useVersionDownload() {
  // 新增：下载特定版本文件
  const startDownloadVersion = async (fileId, versionId, fileName) => {
    try {
      const response = await downloadFileVersion(fileId, versionId)

      if (response instanceof Blob) {
        const url = window.URL.createObjectURL(new Blob([response]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        ElMessage.success('文件下载成功')
      } else {
        // 处理非Blob响应，可能是错误信息
        const reader = new FileReader()
        reader.onload = function () {
          try {
            const errorData = JSON.parse(reader.result)
            ElMessage.error(errorData.message || '文件下载失败')
          } catch {
            ElMessage.error('文件下载失败，请重试')
          }
        }
        reader.readAsText(response)
      }
    } catch (error) {
      console.error('下载特定版本文件失败：', error)
      ElMessage.error(error.message || '下载特定版本文件失败')
    }
  }

  // 处理下载
  const handleDownload = async (version) => {
    // 设置当前版本行的下载状态为true
    version.downloadLoading = true

    try {
      // 调用新的下载特定版本功能
      // 这里的 fileId 和 versionId 是后端 downloadFileVersion API 所需的
      await startDownloadVersion(
        version.fileId,
        version.id,
        `${version.description || '文件'}-${version.version}.pdf`,
      ) // 假设下载的文件名，您可以根据实际需求调整
    } finally {
      // 下载完成后设置当前版本行的下载状态为false
      version.downloadLoading = false
    }
  }

  return {
    handleDownload,
  }
}
