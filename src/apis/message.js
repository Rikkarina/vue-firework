import request from '@/utils/request'

/**
 * 获取消息列表
 * @param {Object} params 查询参数
 * @param {string} [params.type] 消息类型 ('system'|'notification'|'activity')
 * @param {boolean} [params.is_read] 是否已读
 * @param {number} [params.page] 页码
 * @param {number} [params.page_size] 每页条数
 * @param {string} [params.start_date] 开始日期
 * @param {string} [params.end_date] 结束日期
 * @param {boolean} [params.is_premium] 是否优质资源
 */
export function getMessageList(params) {
  return request({
    url: '/api/messages',
    method: 'get',
    params
  })
}

/**
 * 获取未读消息数量
 * @returns {Promise<{activity: number, system: number, notification: number}>}
 */
export function getUnreadCount() {
  return request({
    url: '/api/messages/unread/count',
    method: 'get'
  })
}

/**
 * 获取优质消息列表
 * @param {Object} params 查询参数
 */
export function getPremiumMessages(params) {
  return request({
    url: '/api/messages/premium',
    method: 'get',
    params: { ...params, is_premium: true }
  })
}

/**
 * 创建新消息
 * @param {Object} data 消息数据
 * @param {string} data.title 消息标题
 * @param {string} data.content 消息内容
 * @param {string} data.type 消息类型
 * @param {string|number} data.sender_id 发送者ID
 * @param {string|number} [data.receiver_id] 接收者ID
 * @param {string} [data.related_id] 相关业务ID
 * @param {string} [data.related_type] 相关业务类型
 * @param {boolean} [data.is_premium] 是否优质资源
 */
export function createMessage(data) {
  return request({
    url: '/api/messages',
    method: 'post',
    data
  })
}

/**
 * 更新消息
 * @param {string|number} id 消息ID
 * @param {Object} data 更新数据
 */
export function updateMessage(id, data) {
  return request({
    url: `/api/messages/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除消息（软删除）
 * @param {string|number} id 消息ID
 */
export function deleteMessage(id) {
  return request({
    url: `/api/messages/${id}`,
    method: 'delete'
  })
}

/**
 * 标记消息为已读
 * @param {string|number} id 消息ID
 */
export function markAsRead(id) {
  return request({
    url: `/api/messages/${id}/read`,
    method: 'put'
  })
}

/**
 * 批量标记消息为已读
 * @param {Array<string|number>} ids 消息ID数组
 */
export function markMultipleAsRead(ids) {
  return request({
    url: '/api/messages/read/batch',
    method: 'put',
    data: { ids }
  })
}

/**
 * 获取相关业务的消息列表
 * @param {string} relatedId 相关业务ID
 * @param {string} relatedType 相关业务类型
 */
export function getRelatedMessages(relatedId, relatedType) {
  return request({
    url: '/api/messages/related',
    method: 'get',
    params: {
      related_id: relatedId,
      related_type: relatedType
    }
  })
}
