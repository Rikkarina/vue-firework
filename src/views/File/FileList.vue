<script setup>
import { onMounted } from 'vue'
// 导入并使用 useFileList Composable
import { useFileList } from '@/views/File/composables/useFileList'
// import { useFileDownload } from '@/views/File/composables/useFileDownload'
import { useFilePreview } from '@/views/File/composables/useFilePreview' // 重新引入预览 composable
import FileCard from '@/components/FileCard.vue'
import FilePreviewModal from '@/views/File/FilePreviewModal.vue' // 重新引入预览模态框

const {
  loading,
  fileList,
  selectedType,
  selectedCategory,
  pageTitle,
  fetchFileList,
  FileType,
  FileCategory,
  FileFormat,
} = useFileList()

// const { startDownload, downloadLoading } = useFileDownload()
const {
  // 引入预览 composable 的状态和方法
  isPreviewModalVisible,
  previewFile,
  previewUrl,
  previewLoading,
  openPreviewModal,
  closePreviewModal,
} = useFilePreview()

// 处理文件卡片点击事件
const handleFileCardClick = (file) => {
  // 阻止重复点击或在加载时点击 (保留对 previewLoading 的检查)
  if (previewLoading.value) {
    // 检查下载和预览加载状态
    return
  }

  openPreviewModal(file)
}

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
          <el-option
            v-for="(value, key) in FileType"
            :key="key"
            :label="value"
            :value="key"
          />
        </el-select>
        <el-select v-model="selectedCategory" placeholder="文件分类" clearable>
          <el-option
            v-for="(value, key) in FileCategory"
            :key="key"
            :label="value"
            :value="key"
          />
        </el-select>
        <el-select v-model="selectedFormat" placeholder="文件格式" clearable>
          <el-option
            v-for="(value, key) in FileFormat"
            :key="key"
            :label="value"
            :value="key"
          />
        </el-select>
        <el-button @click="resetFilters" text>重置筛选</el-button>
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
          @click="handleFileCardClick(file)"
          :loading="previewLoading"
        />
      </div>
    </div>

    <!-- 文件预览模态框 -->
    <file-preview-modal
      :isVisible="isPreviewModalVisible"
      :previewFile="previewFile"
      :previewUrl="previewUrl"
      :loading="previewLoading"
      @close="closePreviewModal"
    />
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
      color: var(--text-primary);
      margin-bottom: 16px;
    }

    .filter-section {
      display: flex;
      gap: 16px;
      align-items: center;

      .el-select {
        width: 160px;
      }
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
