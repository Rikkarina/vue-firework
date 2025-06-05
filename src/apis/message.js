import request from '@/utils/request'

/**
 * 获取消息列表
 * @param {import('@/types/message').MessageQueryParams} params - 查询参数
 * @returns {Promise<import('@/types/message').MessageListResponse>}
 */
export function getMessages(params) {
  return request({
    url: '/messages',
    method: 'get',
    params
  })
}

/**
 * 标记消息为已读
 * @param {number} messageId - 消息ID
 * @returns {Promise<void>}
 */
export function markMessageAsRead(messageId) {
  return request({
    url: `/messages/${messageId}/read`,
    method: 'put'
  })
}

/**
 * 批量标记消息为已读
 * @param {number[]} messageIds - 消息ID数组
 * @returns {Promise<void>}
 */
export function markMessagesAsRead(messageIds) {
  return request({
    url: '/messages/read',
    method: 'put',
    data: { messageIds }
  })
}

/**
 * 删除消息
 * @param {number} messageId - 消息ID
 * @returns {Promise<void>}
 */
export function deleteMessage(messageId) {
  return request({
    url: `/messages/${messageId}`,
    method: 'delete'
  })
}

/**
 * 批量删除消息
 * @param {number[]} messageIds - 消息ID数组
 * @returns {Promise<void>}
 */
export function deleteMessages(messageIds) {
  return request({
    url: '/messages',
    method: 'delete',
    data: { messageIds }
  })
}

/**
 * 获取未读消息数量
 * @returns {Promise<{activity: number, message: number, notification: number}>}
 */
export function getUnreadCount() {
  return request({
    url: '/messages/unread/count',
    method: 'get'
  })
}
