<script setup>
import { onMounted } from 'vue'
// 导入并使用 useFileList Composable
import { useFileList } from '@/views/File/composables/useFileList'
import FileCard from '@/components/FileCard.vue'

const {
  loading,
  fileList,
  selectedType,
  selectedCategory,
  pageTitle,
  fetchFileList,
  handleFileClick,
  FileType,
  FileCategory,
} = useFileList()

onMounted(() => {
  fetchFileList()
})
</script>

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
          @click="handleFileClick(file)"
        />
      </div>
    </div>
  </div>
</template>

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
