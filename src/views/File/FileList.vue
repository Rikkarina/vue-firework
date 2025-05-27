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
import { getCourseFiles, searchFiles } from '@/apis/file'
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
const handleFileClick = (file) => {
  // TODO: 实现文件预览或下载逻辑
  console.log('点击文件：', file)
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
