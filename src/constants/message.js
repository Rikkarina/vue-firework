// 消息类型常量
export const MessageType = {
  SYSTEM: 'system',
  NOTIFICATION: 'notification',
  ACTIVITY: 'activity'
}

// 冻结消息类型对象，防止被修改
Object.freeze(MessageType)

// 浏览历史时间段常量
export const HistoryPeriod = {
  TODAY: 'today',
  WEEK: 'week',
  EARLIER: 'earlier',
  ALL: 'all'
}

Object.freeze(HistoryPeriod)

// 消息和历史记录状态常量
export const STATUS = {
  UNREAD: false,
  READ: true,
  NORMAL: false,
  DELETED: true
}

Object.freeze(STATUS)

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
 * 获取历史时间段的显示文本
 * @param {string} period - 时间段
 * @returns {string} - 显示文本
 */
export function getHistoryPeriodText(period) {
  const periodTextMap = {
    [HistoryPeriod.TODAY]: '今日浏览',
    [HistoryPeriod.WEEK]: '本周浏览',
    [HistoryPeriod.EARLIER]: '更早浏览',
    [HistoryPeriod.ALL]: '全部'
  }
  return periodTextMap[period] || '未知时间段'
}

/**
 * 格式化时间
 * @param {string|Date} date - 要格式化的日期
 * @returns {string} - 格式化后的日期字符串
 */
export function formatTime(date) {
  const targetDate = new Date(date)
  const now = new Date()
  const diff = now.getTime() - targetDate.getTime()
  const oneDay = 24 * 60 * 60 * 1000

  // 今天内
  if (diff < oneDay && targetDate.getDate() === now.getDate()) {
    return targetDate.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // 昨天
  if (diff < 2 * oneDay && diff >= oneDay) {
    return '昨天 ' + targetDate.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // 一周内
  if (diff < 7 * oneDay) {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    return days[targetDate.getDay()]
  }

  // 更早
  return targetDate.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}
