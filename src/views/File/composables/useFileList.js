import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getCourseFiles, searchFiles } from '@/apis/file'
import { getFavorite } from '@/apis/favorite'
import { FileType, FileCategory, FileFormat } from '@/types/fileTypes'
import { ElMessage } from 'element-plus'

export function useFileList() {
  const route = useRoute()
  const loading = ref(false)
  const fileList = ref([])
  const selectedType = ref('')
  const selectedCategory = ref('')
  const selectedFormat = ref('')

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

  // 过滤后的文件列表
  const filteredFileList = computed(() => {
    return fileList.value.filter(file => {
      // 文件类型过滤
      if (selectedType.value && file.type !== selectedType.value) {
        return false
      }
      // 文件分类过滤
      if (selectedCategory.value && file.category !== selectedCategory.value) {
        return false
      }
      // 文件格式过滤
      if (selectedFormat.value && file.fileType !== selectedFormat.value) {
        return false
      }
      return true
    })
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

      // 处理文件数据，添加必要的属性
      fileList.value = data.map((file) => ({
        ...file,
        fileType: file.url ? file.url.split('.').pop() : 'unknown',
        type: file.type || FileType.OTHER, // 确保有文件类型
        category: file.category || FileCategory.OTHER, // 确保有文件分类
      }))
    } catch (error) {
      console.error('获取文件列表失败：', error)
      ElMessage.error('获取文件列表失败')
    } finally {
      loading.value = false
    }
  }

  // 重置过滤器
  const resetFilters = () => {
    selectedType.value = ''
    selectedCategory.value = ''
    selectedFormat.value = ''
  }

  return {
    loading,
    fileList: filteredFileList, // 返回过滤后的列表
    selectedType,
    selectedCategory,
    selectedFormat,
    pageTitle,
    fetchFileList,
    resetFilters,
    FileType,
    FileCategory,
    FileFormat,
  }
}
