<template>
  <el-dialog
    v-model="visible"
    title="版本历史"
    width="60%"
    :close-on-click-modal="false"
    class="version-history-modal"
  >
    <!-- 版本历史内容将在这里实现 -->
    <div>版本历史内容</div>
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
.version-history-modal {
  :deep(.el-dialog__body) {
    padding: 20px;
  }
}
</style>
