import request from '@/utils/http'

/**
 * 获取文件的所有版本列表
 * @param {string} fileId - 文件ID
 * @returns {Promise} 返回版本列表
 */
export const getFileVersions = (fileId) => {
  return request({
    url: `/api/files/${fileId}/versions`,
    method: 'GET',
  })
}

/**
 * 创建新版本
 * @param {string} fileId - 文件ID
 * @param {FormData} formData - 包含版本信息的FormData对象
 * @returns {Promise} 返回新创建的版本信息
 */
export const createFileVersion = (fileId, formData) => {
  return request({
    url: `/api/files/${fileId}/versions`,
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

/**
 * 下载特定版本的文件
 * @param {string} fileId - 文件ID
 * @param {string} versionId - 版本ID
 * @returns {Promise} 返回文件Blob
 */
export const downloadFileVersion = (fileId, versionId) => {
  return request({
    url: `/api/files/${fileId}/versions/${versionId}/download`,
    method: 'GET',
    responseType: 'blob',
  })
}

// 以下应该不会使用，但是我可以先保留着

/**
 * 预览特定版本的文件
 * @param {string} fileId - 文件ID
 * @param {string} versionId - 版本ID
 * @returns {Promise} 返回预览URL
 */
export const previewFileVersion = (fileId, versionId) => {
  return request({
    url: `/api/files/${fileId}/versions/${versionId}/preview`,
    method: 'GET',
  })
}

/**
 * 删除特定版本
 * @param {string} fileId - 文件ID
 * @param {string} versionId - 版本ID
 * @returns {Promise} 返回删除结果
 */
export const deleteFileVersion = (fileId, versionId) => {
  return request({
    url: `/api/files/${fileId}/versions/${versionId}`,
    method: 'DELETE',
  })
}

/**
 * 回滚到特定版本
 * @param {string} fileId - 文件ID
 * @param {string} versionId - 版本ID
 * @returns {Promise} 返回回滚结果
 */
export const rollbackToVersion = (fileId, versionId) => {
  return request({
    url: `/api/files/${fileId}/versions/${versionId}/rollback`,
    method: 'POST',
  })
}
