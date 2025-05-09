// 模拟文件数据库
const files = [
  {
    id: 1,
    courseId: 101,
    title: 'Python基础语法PPT',
    type: '课件',
    size: '2.5MB',
    uploadTime: '2024-03-15',
    downloadCount: 156,
    url: '/files/python-basic.pptx',
  },
  {
    id: 2,
    courseId: 101,
    title: 'Python编程练习题',
    type: '习题',
    size: '1.2MB',
    uploadTime: '2024-03-14',
    downloadCount: 89,
    url: '/files/python-exercises.pdf',
  },
  {
    id: 3,
    courseId: 102,
    title: '数据结构与算法讲义',
    type: '课件',
    size: '3.8MB',
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
]

export default mockData
