import request from '@/utils/http'

// 获取课程文件列表
export const getCourseFiles = (courseId) => {
  return request({
    url: `/api/courses/${courseId}/files`,
    method: 'GET',
  })
}

// 搜索文件
export const searchFiles = (keyword) => {
  return request({
    url: '/api/files/search',
    method: 'GET',
    params: { keyword },
  })
}
