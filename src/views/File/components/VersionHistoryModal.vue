<template>
  <el-dialog
    v-model="visible"
    title="版本历史"
    width="60%"
    :close-on-click-modal="false"
    class="version-history-modal"
  >
    <!-- 版本列表 -->
    <el-table
      :data="versions"
      style="width: 100%"
      v-loading="loading"
      @row-click="handleVersionClick"
    >
      <el-table-column prop="version" label="版本号" width="120" />
      <el-table-column prop="description" label="版本描述" show-overflow-tooltip />
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column prop="uploader" label="上传者" width="120" />
      <el-table-column label="操作" width="120" fixed="right" header-align="center">
        <template #default="{ row }">
          <div class="version-actions">
            <el-button
              class="action-button"
              :icon="Download"
              @click.stop="handleDownload(row)"
              :loading="row.downloadLoading"
            />
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 上传新版本按钮 -->
    <div class="upload-section">
      <el-button type="primary" :icon="Upload" @click="handleUpload"> 上传新版本 </el-button>
    </div>
  </el-dialog>

  <!-- 上传新版本模态框 -->
  <upload-version v-model="showUploadVersionModal" :file-id="fileId" @success="fetchVersions" />
</template>

<script setup>
import { computed, watch } from 'vue'
import { Download, Upload } from '@element-plus/icons-vue'

import UploadVersion from './UploadVersion.vue' // 导入上传版本组件
import { useVersionList } from './composables/useVersionList' // 导入 useVersionList composable
import { useVersionDownload } from './composables/useVersionDownload' // 导入 useVersionDownload composable
import { useVersionUploadModal } from './composables/useVersionUploadModal' // 导入 useVersionUploadModal composable

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

const emit = defineEmits(['update:modelValue', 'preview'])

// 控制模态框显示
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

// 引入版本列表逻辑
const { versions, loading, fetchVersions } = useVersionList(computed(() => props.fileId))

// 引入版本下载逻辑
const { handleDownload } = useVersionDownload()

// 引入上传版本模态框逻辑
const { showUploadVersionModal, handleUpload } = useVersionUploadModal()

// 处理版本点击（预览）
const handleVersionClick = (row) => {
  emit('preview', row)
}

// 监听模态框显示状态，显示时获取版本列表
watch(
  () => visible.value,
  (newVal) => {
    if (newVal) {
      fetchVersions()
      console.log(versions.value)
    }
  },
  { immediate: true },
)
</script>

<style lang="scss" scoped>
.version-history-modal {
  :deep(.el-dialog__body) {
    padding: 20px;
  }

  .version-actions {
    display: flex;
    gap: 8px;
    justify-content: center;
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

    &:hover {
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

  .upload-section {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #ebeef5;
    text-align: center;
  }
}
</style>
