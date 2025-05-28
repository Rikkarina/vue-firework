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

// 上传文件
export const uploadFile = (formData) => {
  const data = new FormData()
  // 将文件和其他表单数据添加到 FormData 对象中
  data.append('file', formData.file)
  data.append('title', formData.title)
  data.append('type', formData.type)
  data.append('category', formData.category)
  data.append('courseId', formData.courseId)
  data.append('courseName', formData.courseName)

  return request({
    url: '/api/files/upload',
    method: 'POST',
    data: data,
  })
}
