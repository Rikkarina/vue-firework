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
  // 上传分片
  {
    url: '/api/files/chunk',
    method: 'POST',
    response: ({ body }) => {
      const fileName = body.name || 'unknown'
      const fileSize = body.size || 0

      return {
        code: 200,
        message: '文件上传成功',
        data: {
          fileName: fileName,
          fileSize: fileSize,
        },
      }
    },
  },
  // 保存文件信息
  {
    url: '/api/files/merge',
    method: 'POST',
    response: ({ body }) => {
      const { fileName, fileSize, title, type, category, courseId } = body

      // 生成新的文件ID
      const newFileId = Date.now()
      const now = new Date()
      const uploadTime = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`

      // 创建新文件对象
      const newFile = {
        id: newFileId,
        courseId: parseInt(courseId),
        title: title,
        type: type,
        category: category,
        size: parseInt(fileSize),
        uploadTime: uploadTime,
        downloadCount: 0,
        url: `/files/${fileName}`,
      }

      // 添加到文件列表
      files.push(newFile)

      return {
        code: 200,
        message: '文件信息保存成功',
        data: newFile,
      }
    },
  },
]

export default mockData
