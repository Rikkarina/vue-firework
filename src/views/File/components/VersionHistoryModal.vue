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
  <upload-version v-model="showUploadVersionModal" :file-id="fileId" />
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { Download, Upload } from '@element-plus/icons-vue'
import { getFileVersions } from '@/apis/version' // 导入获取版本列表的API
import { ElMessage } from 'element-plus'
import { useFileDownload } from '@/views/File/composables/useFileDownload' // 导入useFileDownload
import UploadVersion from './UploadVersion.vue' // 导入上传版本组件

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

// 版本列表数据
const versions = ref([])
const loading = ref(false)

const { startDownload } = useFileDownload() // 只导入startDownload

// 上传版本模态框显示状态
const showUploadVersionModal = ref(false)

// 获取版本列表
const fetchVersions = async () => {
  if (!props.fileId) {
    versions.value = []
    console.log('没有收到fileID！')
    return // 如果没有fileId，不进行请求
  }
  loading.value = true
  try {
    const res = await getFileVersions(props.fileId)
    // 为每个版本添加下载加载状态，并按创建时间倒序排序
    versions.value = (res.data || [])
      .map((v) => ({ ...v, downloadLoading: false }))
      .sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
  } catch (error) {
    console.error('获取版本列表失败：', error)
    versions.value = []
    ElMessage.error('获取版本列表失败')
  } finally {
    loading.value = false
  }
}

// 处理版本点击（预览）
const handleVersionClick = (row) => {
  emit('preview', row)
}

// 处理下载
const handleDownload = async (version) => {
  // 构造一个与FileCard兼容的文件对象
  const fileToDownload = {
    id: version.fileId, // 使用版本文件的实际ID
    title: `${version.version} - ${version.description || '文件'}`,
    url: version.fileUrl, // 使用版本文件的URL来获取扩展名
  }

  // 设置当前版本行的下载状态为true
  version.downloadLoading = true

  try {
    // 调用通用的下载功能
    await startDownload(fileToDownload)
  } finally {
    // 下载完成后设置当前版本行的下载状态为false
    version.downloadLoading = false
  }
}

// 处理上传
const handleUpload = () => {
  showUploadVersionModal.value = true
}

// 监听模态框显示状态，显示时获取版本列表
watch(
  () => visible.value,
  (newVal) => {
    if (newVal) {
      fetchVersions()
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
