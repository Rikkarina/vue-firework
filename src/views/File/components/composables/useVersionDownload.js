import { useFileDownload } from '@/views/File/composables/useFileDownload'

export function useVersionDownload() {
  const { startDownload } = useFileDownload()

  // 处理下载
  const handleDownload = async (version) => {
    // 构造一个与FileCard兼容的文件对象
    const fileToDownload = {
      id: version.fileId, // 使用版本文件的实际ID
      title: `${version.version} - ${version.description || '文件'}`,
      url: version.fileUrl, // 使用版本文件的URL来获取扩展名
    }

    // 设置当前版本行的下载状态为true
    version.downloadLoading = true

    try {
      // 调用通用的下载功能
      await startDownload(fileToDownload)
    } finally {
      // 下载完成后设置当前版本行的下载状态为false
      version.downloadLoading = false
    }
  }

  return {
    handleDownload,
  }
}
