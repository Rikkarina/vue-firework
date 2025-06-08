import request from '@/utils/http'

/**
 * 获取用户收藏夹信息
 * @returns {Promise} 返回收藏夹信息，包含收藏的资源列表
 */
export function getFavorite() {
  return request({
    url: '/api/user/favorite',
    method: 'get',
  })
}

/**
 * 更新收藏夹信息
 * @param {Object} data 收藏夹信息
 * @param {string} data.name - 收藏夹名称
 * @param {string} data.description - 收藏夹描述
 * @returns {Promise}
 */
export function updateFavorite(data) {
  return request({
    url: '/api/user/favorite',
    method: 'put',
    data,
  })
}

/**
 * 添加资源到收藏夹
 * @param {Object} fileInfo - 文件信息
 * @param {string} fileInfo.id - 资源ID
 * @param {string} fileInfo.title - 文件标题
 * @param {string} fileInfo.fileType - 文件类型
 * @param {number} fileInfo.size - 文件大小
 * @param {string} fileInfo.uploadTime - 上传时间
 * @returns {Promise}
 */
export function addToFavorite(fileInfo) {
  return request({
    url: '/api/user/favorite/resources',
    method: 'post',
    data: fileInfo,
  })
}

/**
 * 从收藏夹移除资源
 * @param {string} resourceId - 资源ID
 * @returns {Promise}
 */
export function removeFromFavorite(resourceId) {
  return request({
    url: `/api/user/favorite/resources/${resourceId}`,
    method: 'delete',
  })
}
