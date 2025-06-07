import { ref } from 'vue'
import { getFileVersions } from '@/apis/version'
import { ElMessage } from 'element-plus'

export function useVersionList(fileId) {
  const versions = ref([])
  const loading = ref(false)

  const fetchVersions = async () => {
    if (!fileId.value) {
      versions.value = []
      console.log('没有收到fileID！')
      return
    }
    loading.value = true
    try {
      const res = await getFileVersions(fileId.value)
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

  return {
    versions,
    loading,
    fetchVersions,
  }
}
