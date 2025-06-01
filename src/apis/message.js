import request from '@/utils/http'

/**
 * 消息中心 API
 */

// 获取消息列表
export const getMessageList = (params = {}) => {
  return request({
    url: '/api/messages',
    method: 'GET',
    params: {
      page: params.page || 1,
      pageSize: params.pageSize || 10,
      type: params.type, // 消息类型 
      isRead: params.isRead, // 是否已读 
      is_premium: params.is_premium, //是否优质
    }
  })
}

// 获取未读消息数量
export const getUnreadCount = () => {
  return request({
    url: '/api/messages/unread-count',
    method: 'GET'
  })
}

// 标记消息为已读
export const markAsRead = (messageId) => {
  return request({
    url: `/api/messages/${messageId}/read`,
    method: 'PUT'
  })
}

// 删除消息
export const deleteMessage = (messageId) => {
  return request({
    url: `/api/messages/${messageId}`,
    method: 'DELETE'
  })
}


// 获取消息详情
export const getMessageDetail = (messageId) => {
  return request({
    url: `/api/messages/${messageId}`,
    method: 'GET'
  })
}

// 发送消息
export const sendMessage = (data) => {
  return request({
    url: '/api/messages',
    method: 'POST',
    data: {
      receiverId: data.receiverId, // 接收者ID
      title: data.title, // 消息标题
      content: data.content, // 消息内容
      type: data.type || 'system' // 消息类型，默认为系统消息，(枚举: 'system'-系统消息, 'notification'-通知, 'activity'-活动)
    }
  })
}