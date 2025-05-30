import { ref } from 'vue'
import { downloadFile } from '@/apis/file'
import { ElMessage } from 'element-plus'

export function useFileDownload() {
  const downloadLoading = ref(false)

  const startDownload = async (file) => {
    // 检查是否已经在下载中
    if (downloadLoading.value) {
      ElMessage.warning('文件正在下载中，请勿重复操作')
      return
    }

    downloadLoading.value = true
    try {
      const response = await downloadFile(file.id)

      // 直接使用 response.data，因为它已经是 Blob 了
      const blob = response.data

      // 从 Content-Disposition 获取文件名
      const contentDisposition = response.headers['content-disposition']
      let fileName = file.title
      if (contentDisposition) {
        const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition)
        if (matches != null && matches[1]) {
          fileName = decodeURIComponent(matches[1].replace(/['"]/g, ''))
        }
      }

      // 如果没有扩展名，添加扩展名 (从 file.url 获取)
      if (!fileName.includes('.')) {
        const ext = file.url ? file.url.split('.').pop() : ''
        if (ext) fileName = `${fileName}.${ext}`
      }

      const url = window.URL.createObjectURL(blob)

      // 创建下载链接
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
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

  return {
    startDownload,
    downloadLoading,
  }
}
