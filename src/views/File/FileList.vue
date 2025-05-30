<template>
  <div class="file-list">
    <div class="page-header">
      <h1>{{ pageTitle }}</h1>
      <div class="filter-section">
        <el-select v-model="selectedType" placeholder="文件类型" clearable>
          <el-option v-for="(value, key) in FileType" :key="key" :label="value" :value="value" />
        </el-select>
        <el-select v-model="selectedCategory" placeholder="文件分类" clearable>
          <el-option
            v-for="(value, key) in FileCategory"
            :key="key"
            :label="value"
            :value="value"
          />
        </el-select>
      </div>
    </div>

    <div class="file-content" v-loading="loading">
      <el-empty v-if="!loading && fileList.length === 0" description="暂无文件" />
      <div v-else class="file-grid">
        <file-card
          v-for="file in fileList"
          :key="file.id"
          :id="file.id"
          :title="file.title"
          :file-type="file.fileType"
          :size="file.size"
          :upload-time="file.uploadTime"
          @click="handleFileClick"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getCourseFiles, searchFiles, downloadFile } from '@/apis/file'
import { getFavorite } from '@/apis/favorite'
import { FileType, FileCategory } from '@/types/fileTypes'
import FileCard from '@/components/FileCard.vue'
import { ElMessage } from 'element-plus'

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
    if (isSearchResult.value) {
      const { data } = await searchFiles(route.query.keyword)
      fileList.value = data
    } else if (isFavorite.value) {
      const { data } = await getFavorite()
      fileList.value = data.resources || []
    } else {
      const { data } = await getCourseFiles(route.params.courseId)
      fileList.value = data
    }
  } catch (error) {
    console.error('获取文件列表失败：', error)
    ElMessage.error('获取文件列表失败')
  } finally {
    loading.value = false
  }
}

// 处理文件点击
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

    // 如果没有扩展名，添加扩展名
    if (!fileName.includes('.')) {
      const ext = file.url.split('.').pop()
      fileName = `${fileName}.${ext}`
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

onMounted(() => {
  fetchFileList()
})
</script>

<style lang="scss" scoped>
.file-list {
  padding: 20px;

  .page-header {
    margin-bottom: 24px;

    h1 {
      font-size: 24px;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 16px;
    }

    .filter-section {
      display: flex;
      gap: 16px;
    }
  }

  .file-content {
    min-height: 400px;
  }

  .file-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 20px;
    padding: 20px 0;
  }

  .file-card {
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .file-icon {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 12px;
      color: #2b6cb6;
    }

    .file-info {
      text-align: center;

      .file-title {
        font-size: 16px;
        font-weight: 500;
        color: #1a1a1a;
        margin-bottom: 8px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .file-meta {
        display: flex;
        justify-content: center;
        gap: 12px;
        font-size: 12px;
        color: #666;

        span {
          display: inline-block;
        }
      }
    }
  }
}
</style>
