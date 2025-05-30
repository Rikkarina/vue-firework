import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getCourseFiles, searchFiles, downloadFile } from '@/apis/file'
import { getFavorite } from '@/apis/favorite'
import { FileType, FileCategory } from '@/types/fileTypes'
import { ElMessage } from 'element-plus'

export function useFileList() {
  const route = useRoute()
  const loading = ref(false)
  const fileList = ref([])
  const selectedType = ref('')
  const selectedCategory = ref('')

  // 根据路由参数判断是课程文件还是搜索结果
  const isSearchResult = computed(() => route.name === 'FileSearch')
  const isFavorite = computed(() => route.name === 'Favorite')
  const pageTitle = computed(() => {
    if (isSearchResult.value) {
      return `搜索结果：${route.query.keyword || ''}`
    }
    if (isFavorite.value) {
      return '我的收藏'
    }
    return '课程文件'
  })

  // 获取文件列表
  const fetchFileList = async () => {
    loading.value = true
    try {
      let data = []
      if (isSearchResult.value) {
        const res = await searchFiles(route.query.keyword)
        data = res.data
      } else if (isFavorite.value) {
        const res = await getFavorite()
        data = res.data.resources || []
      } else {
        const res = await getCourseFiles(route.params.courseId)
        data = res.data
      }

      // 添加 fileType 属性，解决 FileCard 的 prop 警告
      fileList.value = data.map((file) => ({
        ...file,
        fileType: file.url ? file.url.split('.').pop() : 'unknown',
      }))
    } catch (error) {
      console.error('获取文件列表失败：', error)
      ElMessage.error('获取文件列表失败')
    } finally {
      loading.value = false
    }
  }

  // 处理文件点击（下载逻辑）
  const handleFileClick = async (file) => {
    try {
      loading.value = true
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
    } catch {
      ElMessage.error('文件下载失败')
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    fileList,
    selectedType,
    selectedCategory,
    pageTitle,
    fetchFileList,
    handleFileClick,
    FileType, // 将枚举也暴露出去，方便模板使用
    FileCategory, // 将枚举也暴露出去
  }
}
