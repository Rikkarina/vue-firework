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
  const imageTypes = ['jpg', 'jpeg', 'png', 'gif']
  return imageTypes.includes(props.previewFile?.fileType?.toLowerCase()) && props.previewUrl
})

// 监听 isVisible 变化，以便在外部控制关闭时释放 Blob URL (虽然 useFilePreview 已经做了，这里作为兜底)
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

// 处理 el-dialog 自身的 model-value 更新事件
const handleUpdateModelValue = (value) => {
  // 当 dialog 内部状态变为 false 时，通知父组件关闭
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
        <iframe v-else-if="isPDF" :src="previewUrl" frameborder="0"></iframe>
        <img v-else-if="isImage" :src="previewUrl" alt="文件预览" />
        <div v-else class="unsupported-preview">
          <el-empty description="该文件类型暂不支持在线预览" />
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

  iframe,
  img {
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
}

.empty-preview,
.unsupported-preview {
  text-align: center;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
