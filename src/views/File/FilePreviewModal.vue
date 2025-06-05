<script setup>
import { computed, watch } from 'vue'
import { ElDialog, ElEmpty } from 'element-plus'

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
  previewFile: {
    type: Object,
    default: null,
  },
  previewUrl: {
    type: String,
    default: '',
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close'])

// 判断文件类型以便选择合适的预览方式
const isPDF = computed(() => {
  return props.previewFile?.fileType?.toLowerCase() === 'pdf' && props.previewUrl
})

const isImage = computed(() => {
  const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']
  return imageTypes.includes(props.previewFile?.fileType?.toLowerCase()) && props.previewUrl
})

const isText = computed(() => {
  const textTypes = ['txt', 'md', 'json', 'xml', 'html', 'css', 'js', 'ts', 'jsx', 'tsx', 'vue', 'java', 'py', 'c', 'cpp', 'h', 'hpp']
  return textTypes.includes(props.previewFile?.fileType?.toLowerCase()) && props.previewUrl
})

const isOffice = computed(() => {
  const officeTypes = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx']
  return officeTypes.includes(props.previewFile?.fileType?.toLowerCase()) && props.previewUrl
})

// 监听 isVisible 变化，以便在外部控制关闭时释放 Blob URL
watch(
  () => props.isVisible,
  (newValue) => {
    if (!newValue) {
      // handleClose 已经处理了关闭逻辑，这里可以留空或添加其他清理
    }
  },
)

const handleClose = () => {
  emit('close')
}

const handleUpdateModelValue = (value) => {
  if (!value) {
    emit('close')
  }
}
</script>

<template>
  <el-dialog
    :model-value="isVisible"
    :title="previewFile ? `预览: ${previewFile.title}` : '文件预览'"
    :fullscreen="false"
    width="80%"
    style="max-height: 90vh"
    :body-style="{ padding: '0px', height: 'calc(90vh - 54px - 60px)' }"
    @closed="handleClose"
    @update:model-value="handleUpdateModelValue"
    destroy-on-close
  >
    <div class="dialog-body-container">
      <div v-loading="loading" class="preview-content">
        <div v-if="!previewUrl && !loading" class="empty-preview">
          <el-empty description="无法预览该文件类型或加载失败" />
        </div>

        <!-- PDF预览 -->
        <iframe v-else-if="isPDF" :src="previewUrl" frameborder="0"></iframe>

        <!-- 图片预览 -->
        <div v-else-if="isImage" class="image-preview">
          <img :src="previewUrl" :alt="previewFile?.title" />
          <div class="image-tools">
            <el-button-group>
              <el-button :icon="ZoomIn">放大</el-button>
              <el-button :icon="ZoomOut">缩小</el-button>
              <el-button :icon="RefreshRight">重置</el-button>
            </el-button-group>
          </div>
        </div>

        <!-- 文本文件预览 -->
        <div v-else-if="isText" class="text-preview">
          <pre><code>{{ previewFile?.content }}</code></pre>
        </div>

        <!-- Office文件预览 -->
        <div v-else-if="isOffice" class="office-preview">
          <iframe
            :src="`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(previewUrl)}`"
            frameborder="0"
          ></iframe>
        </div>

        <!-- 不支持的文件类型 -->
        <div v-else class="unsupported-preview">
          <el-empty>
            <template #description>
              <p>该文件类型暂不支持在线预览</p>
              <p class="file-info">
                文件类型: {{ previewFile?.fileType?.toUpperCase() }}
              </p>
            </template>
            <el-button type="primary">下载文件</el-button>
          </el-empty>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped>
.dialog-body-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.preview-content {
  width: 100%;
  height: 70vh;
  display: flex;
  flex-direction: column;
  overflow: auto;
  background-color: var(--bg-secondary);

  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
}

.image-preview {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  .image-tools {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(255, 255, 255, 0.9);
    padding: 8px;
    border-radius: 4px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }
}

.text-preview {
  padding: 20px;
  height: 100%;
  overflow: auto;
  background: var(--bg-primary);

  pre {
    margin: 0;
    padding: 16px;
    background: var(--bg-secondary);
    border-radius: 4px;
    overflow-x: auto;

    code {
      font-family: 'Fira Code', monospace;
      font-size: 14px;
      line-height: 1.5;
      color: var(--text-primary);
    }
  }
}

.office-preview {
  width: 100%;
  height: 100%;

  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
}

.empty-preview,
.unsupported-preview {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  .file-info {
    color: var(--text-secondary);
    margin-top: 8px;
    font-size: 14px;
  }
}
</style>
