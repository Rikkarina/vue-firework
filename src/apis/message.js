// 工具函数：计算时间差
const calculateTimeAgo = (timestamp) => {
  const now = new Date()
  const past = new Date(timestamp)
  const diffInSeconds = Math.floor((now - past) / 1000)

  if (diffInSeconds < 60) {
    return '刚刚'
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes}分钟前`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours}小时前`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) {
    return `${diffInDays}天前`
  }

  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `${diffInMonths}个月前`
  }

  const diffInYears = Math.floor(diffInMonths / 12)
  return `${diffInYears}年前`
}

// 模拟消息数据
const mockMessages = [
  // 文件活动消息
  {
    id: 1,
    type: 'activity',
    content: '您收藏的文件《Vue3基础教程》有新版本更新',
    time: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30分钟前
    isRead: false,
    link: '/files/course/1?fileName=Vue3基础教程'
  },
  {
    id: 2,
    type: 'activity',
    content: '您收藏的文件《JavaScript高级编程》更新至v3.2版本',
    time: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4小时前
    isRead: true,
    link: '/files/course/2?fileName=JavaScript高级编程'
  },
  {
    id: 3,
    type: 'activity',
    content: '您收藏的文件《Python数据分析实战》已更新课后习题',
    time: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1天前
    isRead: false,
    link: '/files/course/3?fileName=Python数据分析实战'
  },

  // 系统消息
  {
    id: 4,
    type: 'system',
    content: '系统更新：文件预览功能全新升级，支持更多格式在线预览',
    time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2天前
    isRead: false
  },
  {
    id: 5,
    type: 'system',
    content: '平台将于本周日凌晨2:00-4:00进行系统升级维护',
    time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3天前
    isRead: true
  },
  {
    id: 6,
    type: 'system',
    content: '新功能上线：文件多版本对比功能已开放使用',
    time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5天前
    isRead: true
  },

  // 普通消息
  {
    id: 7,
    type: 'message',
    content: '您上传的文件《React实战指南》已通过审核',
    time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(), // 6天前
    isRead: false,
    link: '/files/course/4?fileName=React实战指南'
  },
  {
    id: 8,
    type: 'message',
    content: '您上传的文件《数据库原理与实践》已通过审核',
    time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7天前
    isRead: true,
    link: '/files/course/5?fileName=数据库原理与实践'
  },
  {
    id: 9,
    type: 'message',
    content: '您上传的文件《算法设计与分析》已通过审核',
    time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(), // 8天前
    isRead: true,
    link: '/files/course/6?fileName=算法设计与分析'
  }
]

// 获取消息列表
export const getMessages = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const messagesWithTimeAgo = mockMessages.map(msg => ({
        ...msg,
        timeAgo: calculateTimeAgo(msg.time)
      }))
      resolve({
        code: 200,
        data: {
          items: messagesWithTimeAgo,
          total: messagesWithTimeAgo.length,
          unreadCount: messagesWithTimeAgo.filter(msg => !msg.isRead).length
        }
      })
    }, 500)
  })
}

// 标记消息为已读
export const markMessageAsRead = (messageId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const message = mockMessages.find(msg => msg.id === messageId)
      if (message) {
        message.isRead = true
      }
      resolve({
        code: 200,
        data: { success: true }
      })
    }, 300)
  })
}

// 标记所有消息为已读
export const markAllMessagesAsRead = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockMessages.forEach(msg => {
        msg.isRead = true
      })
      resolve({
        code: 200,
        data: { success: true }
      })
    }, 300)
  })
}

// 删除消息
export const deleteMessage = (messageId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockMessages.findIndex(msg => msg.id === messageId)
      if (index !== -1) {
        mockMessages.splice(index, 1)
      }
      resolve({
        code: 200,
        data: { success: true }
      })
    }, 300)
  })
}
