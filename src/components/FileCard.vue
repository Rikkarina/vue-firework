<template>
  <el-card class="file-card" @click="handleClick">
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
import { Document, Picture, Files, Collection } from '@element-plus/icons-vue'
import { FileFormat } from '@/types/fileTypes'

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
})

const emit = defineEmits(['click'])

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
</script>

<style lang="scss" scoped>
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
</style>
