<template>
  <el-dialog
    v-model="visible"
    title="上传新版本"
    width="50%"
    :close-on-click-modal="false"
    class="upload-version-modal"
  >
    <!-- 上传表单和内容将在这里实现 -->
    <div>新版本上传内容</div>
  </el-dialog>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  fileId: {
    type: [String, Number],
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

// 控制模态框显示
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})
</script>

<style lang="scss" scoped>
.upload-version-modal {
  :deep(.el-dialog__body) {
    padding: 20px;
  }
}
</style>
