// 消息类型常量
export const MessageType = {
  SYSTEM: 'system',
  NOTIFICATION: 'notification',
  ACTIVITY: 'activity'
}

// 冻结消息类型对象，防止被修改
Object.freeze(MessageType)

/**
 * @typedef {Object} Message
 * @property {string|number} id - 消息ID (主键)
 * @property {string} title - 消息标题
 * @property {string} content - 消息内容
 * @property {string} type - 消息类型 ('system'|'notification'|'activity')
 * @property {string|number} sender_id - 发送者ID
 * @property {string|number} [receiver_id] - 接收者ID
 * @property {boolean} is_read - 是否已读
 * @property {boolean} is_deleted - 是否已删除
 * @property {string|Date} created_at - 创建时间
 * @property {string|Date} updated_at - 更新时间
 * @property {string} [related_id] - 相关业务ID
 * @property {string} [related_type] - 相关业务类型
 * @property {boolean} is_premium - 是否优质资源
 */

/**
 * @typedef {Object} MessageQueryParams
 * @property {string} [type] - 消息类型
 * @property {boolean} [is_read] - 是否已读
 * @property {number} [page] - 页码
 * @property {number} [page_size] - 每页条数
 * @property {string} [start_date] - 开始日期
 * @property {string} [end_date] - 结束日期
 * @property {boolean} [is_premium] - 是否优质资源
 */

/**
 * @typedef {Object} CreateMessageParams
 * @property {string} title - 消息标题
 * @property {string} content - 消息内容
 * @property {string} type - 消息类型
 * @property {string|number} sender_id - 发送者ID
 * @property {string|number} [receiver_id] - 接收者ID
 * @property {string} [related_id] - 相关业务ID
 * @property {string} [related_type] - 相关业务类型
 * @property {boolean} [is_premium] - 是否优质资源
 */

/**
 * @typedef {Object} UpdateMessageParams
 * @property {string} [title] - 消息标题
 * @property {string} [content] - 消息内容
 * @property {boolean} [is_read] - 是否已读
 * @property {boolean} [is_deleted] - 是否已删除
 * @property {boolean} [is_premium] - 是否优质资源
 */

// 导出消息相关的常量和工具函数
export const MESSAGE_STATUS = {
  UNREAD: false,
  READ: true
}

export const MESSAGE_DELETE_STATUS = {
  NORMAL: false,
  DELETED: true
}

/**
 * 检查消息类型是否有效
 * @param {string} type - 要检查的消息类型
 * @returns {boolean} - 是否是有效的消息类型
 */
export function isValidMessageType(type) {
  return Object.values(MessageType).includes(type)
}

/**
 * 获取消息类型的显示文本
 * @param {string} type - 消息类型
 * @returns {string} - 显示文本
 */
export function getMessageTypeText(type) {
  const typeTextMap = {
    [MessageType.SYSTEM]: '系统消息',
    [MessageType.NOTIFICATION]: '通知消息',
    [MessageType.ACTIVITY]: '活动消息'
  }
  return typeTextMap[type] || '未知类型'
}

/**
 * 格式化消息时间
 * @param {string|Date} date - 要格式化的日期
 * @returns {string} - 格式化后的日期字符串
 */
export function formatMessageTime(date) {
  const messageDate = new Date(date)
  return messageDate.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
