<template>
  <el-card class="file-card" @click="handleClick">
    <div class="file-actions">
      <el-button
        class="action-button"
        :icon="isFavorite ? 'StarFilled' : 'Star'"
        @click.stop="handleFavorite"
      />
      <el-button
        class="action-button"
        :icon="Download"
        :loading="downloadLoading"
        @click.stop="handleDownload"
      />
      <el-button class="action-button" :icon="Clock" @click.stop="handleVersion" />
    </div>
    <div class="file-icon">
      <el-icon :size="32">
        <component :is="getFileIcon(fileType)" />
      </el-icon>
    </div>
    <div class="file-info">
      <div class="file-title">{{ title }}</div>
      <div class="file-meta">
        <span>{{ formatFileSize(size) }}</span>
        <span>{{ uploadTime }}</span>
      </div>
    </div>
  </el-card>
</template>

<script setup>
import {
  Document,
  Picture,
  Files,
  Collection,
  Star,
  StarFilled,
  Download,
  Clock,
} from '@element-plus/icons-vue'
import { FileFormat } from '@/types/fileTypes'
import { addToFavorite, removeFromFavorite } from '@/apis/favorite'
import { useFileDownload } from '@/views/File/composables/useFileDownload'
import { ElMessage } from 'element-plus'

const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  uploadTime: {
    type: String,
    required: true,
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['click', 'favorite-change', 'version'])

const { startDownload, downloadLoading } = useFileDownload()

// 获取文件图标
const getFileIcon = (fileType) => {
  switch (fileType) {
    case FileFormat.PDF:
      return Document
    case FileFormat.IMAGE:
      return Picture
    case FileFormat.CODE:
      return Files
    default:
      return Collection
  }
}

// 格式化文件大小
const formatFileSize = (size) => {
  if (size < 1024) {
    return size + 'B'
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + 'KB'
  } else if (size < 1024 * 1024 * 1024) {
    return (size / (1024 * 1024)).toFixed(2) + 'MB'
  } else {
    return (size / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
  }
}

// 处理点击事件
const handleClick = () => {
  emit('click', props)
}

// 处理收藏
const handleFavorite = async () => {
  try {
    console.log(props.isFavorite)
    if (props.isFavorite) {
      await removeFromFavorite(props.id)
      ElMessage.success('已取消收藏')
    } else {
      await addToFavorite(props.id)
      ElMessage.success('收藏成功')
    }
    emit('favorite-change', !props.isFavorite)
  } catch (error) {
    console.error('收藏操作失败：', error)
    ElMessage.error('操作失败，请重试')
  }
}

// 处理下载
const handleDownload = () => {
  startDownload(props)
}

// 处理版本按钮点击
const handleVersion = () => {
  emit('version', props)
}
</script>

<style lang="scss" scoped>
.file-card {
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .file-actions {
    position: absolute;
    top: 50%;
    right: 12px;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    gap: 8px;
    z-index: 1;
  }

  .action-button {
    width: 32px;
    height: 32px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    background-color: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
    margin: 0 !important;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
      border-color: #409eff;
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    :deep(.el-icon) {
      font-size: 14px;
    }
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
</style>
