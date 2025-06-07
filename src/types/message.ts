export type MessageType = 'message' | 'system' | 'activity'

export interface Message {
  id: number
  type: MessageType
  content: string
  time: string
  isRead: boolean
  link?: string
  timeAgo?: string
}
