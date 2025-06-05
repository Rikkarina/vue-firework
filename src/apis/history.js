import request from '@/utils/request'

/**
 * 获取浏览历史列表
 * @param {import('@/types/history').HistoryQueryParams} params - 查询参数
 * @returns {Promise<import('@/types/history').HistoryListResponse>}
 */
export function getHistoryList(params) {
  return request({
    url: '/api/history',
    method: 'get',
    params
  })
}

/**
 * 添加浏览历史
 * @param {Omit<import('@/types/history').HistoryItem, 'id' | 'time'>} data - 历史记录数据
 * @returns {Promise<import('@/types/history').HistoryItem>}
 */
export function addHistory(data) {
  return request({
    url: '/api/history',
    method: 'post',
    data
  })
}

/**
 * 删除单条浏览历史
 * @param {number} id - 历史记录ID
 * @returns {Promise<void>}
 */
export function deleteHistory(id) {
  return request({
    url: `/api/history/${id}`,
    method: 'delete'
  })
}

/**
 * 批量删除浏览历史
 * @param {number[]} ids - 历史记录ID数组
 * @returns {Promise<void>}
 */
export function deleteHistories(ids) {
  return request({
    url: '/api/history',
    method: 'delete',
    data: { ids }
  })
}

/**
 * 清空浏览历史
 * @returns {Promise<void>}
 */
export function clearHistory() {
  return request({
    url: '/api/history/clear',
    method: 'delete'
  })
}

/**
 * 更新浏览历史
 * @param {number} id - 历史记录ID
 * @param {Partial<import('@/types/history').HistoryItem>} data - 更新数据
 * @returns {Promise<import('@/types/history').HistoryItem>}
 */
export function updateHistory(id, data) {
  return request({
    url: `/api/history/${id}`,
    method: 'patch',
    data
  })
}
