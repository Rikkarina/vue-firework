<template>
  <div class="history-page">
    <div class="history-header">
      <h2 class="page-title">历史浏览</h2>
      <el-button type="danger" plain size="small" @click="clearHistory">
        清空历史
      </el-button>
    </div>

    <div class="history-list">
      <el-timeline v-if="historyList.length > 0">
        <el-timeline-item
          v-for="item in historyList"
          :key="item.id"
          :timestamp="item.time"
          placement="top"
        >
          <div class="history-item">
            <div class="item-content">
              <div class="item-thumbnail">
                <el-image
                  :src="item.thumbnail"
                  fit="cover"
                  class="thumbnail-image"
                  :preview-src-list="[item.thumbnail]"
                >
                  <template #error>
                    <div class="image-placeholder">
                      <el-icon><Document /></el-icon>
                    </div>
                  </template>
                </el-image>
              </div>

              <div class="item-info">
                <h3 class="item-title">{{ item.title }}</h3>
                <p class="item-desc">{{ item.description }}</p>
                <div class="item-meta">
                  <el-tag size="small" :type="getTagType(item.type)">{{ item.type }}</el-tag>
                  <span class="file-size">{{ item.size }}</span>
                </div>
              </div>

              <div class="item-actions">
                <el-button type="primary" link @click="viewFile(item)">
                  查看
                </el-button>
                <el-button type="danger" link @click="removeFromHistory(item.id)">
                  删除
                </el-button>
              </div>
            </div>
          </div>
        </el-timeline-item>
      </el-timeline>

      <el-empty v-else description="暂无浏览历史" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Document } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'

// 历史记录列表
const historyList = ref([
  {
    id: 1,
    title: '项目报告.docx',
    description: '2024年第一季度项目总结报告',
    type: 'Word文档',
    size: '2.5MB',
    time: '2024-01-03 15:30',
    thumbnail: 'path/to/thumbnail.jpg'
  },
  {
    id: 2,
    title: '产品设计方案.pdf',
    description: '新功能原型设计文档',
    type: 'PDF文件',
    size: '5.8MB',
    time: '2024-01-02 11:20',
    thumbnail: 'path/to/thumbnail.jpg'
  }
])

// 获取标签类型
const getTagType = (fileType) => {
  const typeMap = {
    'Word文档': 'primary',
    'PDF文件': 'success',
    'Excel表格': 'warning',
    '图片': 'info',
    '其他': ''
  }
  return typeMap[fileType] || ''
}

// 查看文件
const viewFile = (file) => {
  // TODO: 实现文件查看逻辑
  console.log('查看文件:', file)
}

// 从历史记录中删除
const removeFromHistory = async (id) => {
  try {
    await ElMessageBox.confirm(
      '确定要从历史记录中删除该文件吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    historyList.value = historyList.value.filter(item => item.id !== id)
  } catch {
    // 用户取消删除
  }
}

// 清空历史记录
const clearHistory = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要清空所有浏览历史吗？此操作不可恢复！',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    historyList.value = []
  } catch {
    // 用户取消清空
  }
}
</script>

<style lang="scss" scoped>
.history-page {
  padding: 24px;
  max-width: 960px;
  margin: 0 auto;

  .history-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    .page-title {
      font-size: 20px;
      font-weight: 500;
      color: #1f2937;
      margin: 0;
    }
  }

  .history-list {
    background: #fff;
    border-radius: 4px;
    padding: 20px;
  }

  .history-item {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 4px;
    transition: all 0.2s ease;

    &:hover {
      border-color: #d1d5db;
      background: #f9fafb;
    }

    .item-content {
      padding: 16px;
      display: flex;
      gap: 16px;
      align-items: flex-start;
    }

    .item-thumbnail {
      width: 72px;
      height: 72px;
      border-radius: 4px;
      overflow: hidden;
      flex-shrink: 0;
      border: 1px solid #e5e7eb;

      .thumbnail-image {
        width: 100%;
        height: 100%;
      }

      .image-placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f3f4f6;
        color: #9ca3af;
        font-size: 24px;
      }
    }

    .item-info {
      flex: 1;
      min-width: 0;

      .item-title {
        font-size: 15px;
        font-weight: 500;
        color: #1f2937;
        margin: 0 0 8px;
      }

      .item-desc {
        font-size: 13px;
        color: #4b5563;
        margin: 0 0 12px;
        line-height: 1.5;
      }

      .item-meta {
        display: flex;
        align-items: center;
        gap: 12px;

        .file-size {
          font-size: 13px;
          color: #6b7280;
        }
      }
    }

    .item-actions {
      display: flex;
      gap: 8px;
      margin-left: auto;
    }
  }
}

:deep(.el-timeline) {
  padding-left: 0;
}

:deep(.el-timeline-item__node) {
  background-color: #3b82f6;
  width: 12px;
  height: 12px;
}

:deep(.el-timeline-item__tail) {
  border-left-color: #e5e7eb;
}

:deep(.el-timeline-item__timestamp) {
  color: #6b7280;
  font-size: 13px;
  margin-bottom: 8px;
}

:deep(.el-timeline-item__content) {
  flex: 1;
}

:deep(.el-button--danger.is-plain) {
  --el-button-hover-bg-color: var(--el-color-danger-light-3);
  --el-button-hover-border-color: var(--el-color-danger);
}
</style>
