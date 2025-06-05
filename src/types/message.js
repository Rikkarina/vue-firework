/**
 * @typedef {'activity' | 'message' | 'notification'} MessageType
 */

/**
 * @typedef {Object} BaseMessage
 * @property {number} id - 消息ID
 * @property {string} title - 消息标题
 * @property {string} content - 消息内容
 * @property {string} time - 消息时间
 * @property {boolean} isRead - 是否已读
 * @property {MessageType} type - 消息类型
 */

/**
 * @typedef {Object} ActivityMessage
 * @property {number} id - 消息ID
 * @property {string} title - 活动标题
 * @property {string} content - 活动内容
 * @property {string} time - 消息时间
 * @property {boolean} isRead - 是否已读
 * @property {'activity'} type - 消息类型
 * @property {string} [startTime] - 活动开始时间
 * @property {string} [endTime] - 活动结束时间
 * @property {string} [location] - 活动地点
 */

/**
 * @typedef {Object} SystemMessage
 * @property {number} id - 消息ID
 * @property {string} title - 消息标题
 * @property {string} content - 消息内容
 * @property {string} time - 消息时间
 * @property {boolean} isRead - 是否已读
 * @property {'message'} type - 消息类型
 * @property {'info' | 'warning' | 'error'} [level] - 消息级别
 */

/**
 * @typedef {Object} NotificationMessage
 * @property {number} id - 消息ID
 * @property {string} title - 通知标题
 * @property {string} content - 通知内容
 * @property {string} time - 消息时间
 * @property {boolean} isRead - 是否已读
 * @property {'notification'} type - 消息类型
 * @property {string} [category] - 通知类别
 */

/**
 * @typedef {Object} MessageListResponse
 * @property {number} total - 总数
 * @property {Array<ActivityMessage | SystemMessage | NotificationMessage>} items - 消息列表
 */

/**
 * @typedef {Object} MessageQueryParams
 * @property {MessageType} [type] - 消息类型
 * @property {number} [page] - 页码
 * @property {number} [pageSize] - 每页数量
 * @property {boolean} [isRead] - 是否已读
 * @property {string} [startTime] - 开始时间
 * @property {string} [endTime] - 结束时间
 */

export const MessageTypes = {
  ACTIVITY: 'activity',
  MESSAGE: 'message',
  NOTIFICATION: 'notification'
}
