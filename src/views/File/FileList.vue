<script setup>
import { onMounted, ref } from 'vue'
// 导入并使用 useFileList Composable
import { useFileList } from '@/views/File/composables/useFileList'
// import { useFileDownload } from '@/views/File/composables/useFileDownload'
import { useFilePreview } from '@/views/File/composables/useFilePreview' // 重新引入预览 composable
import FileCard from '@/components/FileCard.vue'
import FilePreviewModal from '@/views/File/FilePreviewModal.vue' // 重新引入预览模态框
import VersionHistoryModal from './components/VersionHistoryModal.vue'
// import { downloadFileVersion } from '@/apis/version' // 导入版本下载API (不再需要直接调用)
// import { ElMessage } from 'element-plus' // 导入ElMessage用于错误提示 (useFilePreview已处理)

const {
  loading,
  fileList,
  selectedType,
  selectedCategory,
  isFavorite,
  pageTitle,
  fetchFileList,
  FileType,
  FileCategory,
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

// 版本历史模态框相关
const showVersionModal = ref(false)
const currentFile = ref(null)

// 处理文件卡片点击事件
const handleFileCardClick = (file) => {
  // 阻止重复点击或在加载时点击 (保留对 previewLoading 的检查)
  if (previewLoading.value) {
    // 检查下载和预览加载状态
    return
  }

  openPreviewModal(file)
}

// 处理版本按钮点击
const handleVersionClick = (file) => {
  currentFile.value = file
  showVersionModal.value = true
}

// 处理版本预览 (来自 VersionHistoryModal 的 @preview 事件)
const handleVersionPreview = (version) => {
  if (!currentFile.value) {
    // 如果没有当前文件，说明没有选择文件或数据异常，进行提示
    console.warn('未选择文件，无法预览版本。')
    // 可以选择弹出ElMessage提示，但为了简洁，这里只打印警告
    return
  }

  const fileToPreview = {
    ...currentFile.value, // 保留原文件的一些显示信息
    id: version.fileId, // 最关键：将ID设置为版本文件的实际文件ID
    versionId: version.id, // 添加版本ID
    fileType: version.fileType || currentFile.value.fileType, // 使用版本中的fileType，如果没有则回退到原文件的
    size: version.size || currentFile.value.size, // 使用版本中的size，如果没有则回退到原文件的
    title: `${currentFile.value.title} - ${version.version} (${version.description || '无描述'})`,
  }

  // 调用通用的openPreviewModal，传入 isVersion=true 表示这是版本预览
  openPreviewModal(fileToPreview, true)
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
          :is-favorite="isFavorite"
          @click="handleFileCardClick(file)"
          @version="handleVersionClick"
          :loading="downloadLoading || previewLoading"
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

    <!-- 版本历史模态框 -->
    <version-history-modal
      v-model="showVersionModal"
      :file-id="currentFile?.id"
      @preview="handleVersionPreview"
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
