// 模拟文件数据库
const files = [
  {
    id: 1,
    courseId: 101,
    title: 'Python基础语法PPT',
    type: '课件',
    size: 2621440, // 2.5MB = 2.5 * 1024 * 1024
    uploadTime: '2024-03-15',
    downloadCount: 156,
    url: '/files/python-basic.pptx',
  },
  {
    id: 2,
    courseId: 101,
    title: 'Python编程练习题',
    type: '习题',
    size: 1258291, // 1.2MB = 1.2 * 1024 * 1024
    uploadTime: '2024-03-14',
    downloadCount: 89,
    url: '/files/python-exercises.pdf',
  },
  {
    id: 3,
    courseId: 102,
    title: '数据结构与算法讲义',
    type: '课件',
    size: 3984589, // 3.8MB = 3.8 * 1024 * 1024
    uploadTime: '2024-03-13',
    downloadCount: 234,
    url: '/files/ds-algo-notes.pdf',
  },
]

const mockData = [
  // 获取课程相关文件
  {
    url: '/api/courses/:courseId/files',
    method: 'GET',
    response: ({ query }) => {
      const courseFiles = files.filter((file) => file.courseId === parseInt(query.courseId))
      return {
        code: 200,
        message: '获取成功',
        data: courseFiles,
      }
    },
  },
  // 搜索文件
  {
    url: '/api/files/search',
    method: 'GET',
    response: ({ query }) => {
      const keyword = query.keyword?.toLowerCase() || ''
      const matchedFiles = files.filter((file) => file.title.toLowerCase().includes(keyword))
      return {
        code: 200,
        message: '搜索成功',
        data: matchedFiles,
      }
    },
  },
  // 文件上传
  {
    url: '/api/files/upload',
    method: 'POST',
    response: ({ body }) => {
      // 解析 FormData 数据
      const formData = {}
      const rawBody = body[Object.keys(body)[0]]

      // 从原始字符串中提取 boundary
      const boundaryMatch = rawBody.match(/------WebKitFormBoundary([A-Za-z0-9]+)/)
      if (!boundaryMatch) {
        return {
          code: 400,
          message: '无效的请求格式',
        }
      }

      const boundary = '------WebKitFormBoundary' + boundaryMatch[1]

      // 分割各个部分
      const parts = rawBody.split(boundary).filter((part) => part.trim() && !part.includes('--'))

      parts.forEach((part) => {
        if (part.includes('Content-Disposition: form-data; name="')) {
          const nameMatch = part.match(/name="([^"]+)"/)
          const valueMatch = part.match(/\r\n\r\n([\s\S]*?)(?=\r\n--|$)/)

          if (nameMatch && valueMatch) {
            const name = nameMatch[1]
            let value = valueMatch[1].trim()

            // 如果是文件字段，需要特殊处理
            if (part.includes('filename="')) {
              const filenameMatch = part.match(/filename="([^"]+)"/)
              if (filenameMatch) {
                value = {
                  name: filenameMatch[1],
                  size: value.length,
                  type: part.includes('Content-Type:')
                    ? part.match(/Content-Type: ([^\r\n]+)/)[1]
                    : 'application/octet-stream',
                }
              }
            }

            formData[name] = value
          }
        }
      })

      // 生成新的文件ID
      const newFileId = files.length > 0 ? files[files.length - 1].id + 1 : 1
      const now = new Date()
      const uploadTime = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`

      // 创建新文件对象
      const newFile = {
        id: newFileId,
        courseId: parseInt(formData.courseId),
        title: formData.title,
        type: formData.type,
        category: formData.category,
        size: formData.file?.size || Math.floor(Math.random() * 5 * 1024 * 1024) + 1024,
        uploadTime: uploadTime,
        downloadCount: 0,
        url: `/files/${formData.title}_${Date.now()}`,
      }

      // 添加到文件列表
      files.push(newFile)

      return {
        code: 200,
        message: '文件上传成功',
        data: newFile,
      }
    },
  },
]

export default mockData
