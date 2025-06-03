import request from '@/utils/request'

/**
 * 获取浏览历史列表
 * @param {Object} params 查询参数
 * @param {string} [params.period] 时间段 ('today'|'week'|'earlier')
 * @param {number} [params.page] 页码
 * @param {number} [params.page_size] 每页条数
 * @param {boolean} [params.is_premium] 是否优质资源
 */
export function getBrowsingHistory(params) {
  return request({
    url: '/api/history/list',
    method: 'get',
    params
  })
}

/**
 * 删除浏览历史
 * @param {string|number} id 历史记录ID
 */
export function deleteHistory(id) {
  return request({
    url: `/api/history/${id}`,
    method: 'delete'
  })
}

/**
 * 重新访问
 * @param {string|number} id 历史记录ID
 */
export function reVisit(id) {
  return request({
    url: `/api/history/${id}/revisit`,
    method: 'post'
  })
}

/**
 * 批量删除浏览历史
 * @param {Array<string|number>} ids 历史记录ID数组
 */
export function batchDeleteHistory(ids) {
  return request({
    url: '/api/history/batch',
    method: 'delete',
    data: { ids }
  })
}

/**
 * 清空浏览历史
 * @param {string} [period] 时间段 ('today'|'week'|'earlier'|'all')
 */
export function clearHistory(period = 'all') {
  return request({
    url: '/api/history/clear',
    method: 'delete',
    params: { period }
  })
}
