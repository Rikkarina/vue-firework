import request from '@/utils/http'

// 获取课程文件列表
export const getCourseFiles = (courseId) => {
  return request({
    url: `/api/files/courses/${courseId}/files`,
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

// 上传分片
export const uploadChunk = (formData) => {
  return request({
    url: '/api/files/chunk',
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

// 合并分片
export const mergeChunks = (data) => {
  return request({
    url: '/api/files/merge',
    method: 'POST',
    data,
  })
}

// 下载文件
export const downloadFile = (fileId) => {
  return request({
    url: `/api/files/download/${fileId}`,
    method: 'GET',
    responseType: 'blob',
  })
}
