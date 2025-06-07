export type MessageType = 'activity' | 'message' | 'notification'

export type MessageStatus = 'read' | 'unread'

export interface Message {
  id: number
  type: MessageType
  content: string
  time: string
  isRead: boolean
  link?: string
}

export interface MessageState {
  messages: Message[]
  loading: boolean
  error: string | null
  filterType: 'all' | 'unread' | 'read'
  messageType: MessageType | ''
  totalCount: number
  unreadCount: number
}

export interface MessageFilter {
  type?: MessageType
  status?: MessageStatus
  page?: number
  pageSize?: number
}