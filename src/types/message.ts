/**
 * 消息类型
 */
export type MessageType = 'activity' | 'message' | 'notification'

/**
 * 消息状态
 */
export type MessageStatus = 'read' | 'unread'

/**
 * 消息过滤类型
 */
export type MessageFilterType = 'all' | 'read' | 'unread'

/**
 * 消息实体
 */
export interface Message {
  /** 消息ID */
  id: number | string
  /** 消息类型 */
  type: MessageType
  /** 消息内容 */
  content: string
  /** 消息时间 */
  time: string
  /** 是否已读 */
  isRead: boolean
  /** 消息标题（可选） */
  title?: string
  /** 相关链接（可选） */
  link?: string
  /** 创建时间 */
  createdAt: string
  /** 更新时间 */
  updatedAt: string
  /** 发送者ID（可选） */
  senderId?: number | string
  /** 发送者名称（可选） */
  senderName?: string
  /** 接收者ID */
  receiverId: number | string
  /** 额外数据（可选） */
  metadata?: Record<string, any>
}

/**
 * 消息列表响应
 */
export interface MessageListResponse {
  /** 消息列表 */
  items: Message[]
  /** 总数 */
  total: number
  /** 未读数 */
  unreadCount: number
}

/**
 * 消息列表请求参数
 */
export interface MessageListParams {
  /** 页码 */
  page?: number
  /** 每页条数 */
  pageSize?: number
  /** 消息类型 */
  type?: MessageType
  /** 是否已读 */
  isRead?: boolean
  /** 开始时间 */
  startTime?: string
  /** 结束时间 */
  endTime?: string
  /** 搜索关键词 */
  keyword?: string
}

/**
 * 标记消息已读请求参数
 */
export interface MarkMessageReadParams {
  /** 消息ID列表 */
  messageIds: (number | string)[]
  /** 是否标记全部 */
  markAll?: boolean
}
