import express from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = express.Router()

// 配置文件存储
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../files')
    // 确保上传目录存在
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    // 生成唯一文件名
    const timestamp = Date.now()
    const random = Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, `${timestamp}-${random}${ext}`)
  },
})

// 创建 multer 实例
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 1024, // 1GB
  },
})

// 模拟文件数据库
const files = [
  // Python课程文件 (courseId: 101)
  {
    id: 1,
    courseId: 101,
    title: 'Python基础语法PPT',
    type: '课件',
    size: 2621440, // 2.5MB
    uploadTime: '2024-03-15',
    downloadCount: 156,
    url: '/static/python-basic.pptx',
    versions: [
      {
        id: 'v1_python_ppt',
        fileId: 1,
        version: 'v1.0.0',
        description: 'Python基础语法PPT初始版本',
        createTime: '2024-03-15 10:00:00',
        uploader: 'admin',
        size: 2621440,
        fileUrl: '/static/python-basic.pptx',
      },
      {
        id: 'v2_python_ppt',
        fileId: 1,
        version: 'v1.0.1',
        description: 'Python基础语法PPT添加章节',
        createTime: '2024-03-20 11:30:00',
        uploader: 'admin',
        size: 2700000,
        fileUrl: '/static/python-basic-v2.pptx',
      },
    ],
  },
  {
    id: 2,
    courseId: 101,
    title: 'Python编程练习题',
    type: '习题',
    size: 1258291, // 1.2MB
    uploadTime: '2024-03-14',
    downloadCount: 89,
    url: '/static/python-exercises.pdf',
    versions: [
      {
        id: 'v1_python_exercises',
        fileId: 2,
        version: 'v1.0.0',
        description: 'Python编程练习题初始版本',
        createTime: '2024-03-14 09:00:00',
        uploader: 'admin',
        size: 1258291,
        fileUrl: '/static/python-exercises.pdf',
      },
    ],
  },
  {
    id: 3,
    courseId: 101,
    title: 'Python环境配置指南',
    type: '课件',
    size: 1048576, // 1MB
    uploadTime: '2024-03-16',
    downloadCount: 245,
    url: '/static/python-env-guide.pdf',
    versions: [
      {
        id: 'v1_python_env',
        fileId: 3,
        version: 'v1.0.0',
        description: 'Python环境配置指南',
        createTime: '2024-03-16 14:00:00',
        uploader: 'admin',
        size: 1048576,
        fileUrl: '/static/python-env-guide.pdf',
      },
    ],
  },
  {
    id: 4,
    courseId: 101,
    title: 'Python数据类型详解',
    type: '课件',
    size: 1835008, // 1.75MB
    uploadTime: '2024-03-17',
    downloadCount: 178,
    url: '/static/python-data-types.pptx',
    versions: [
      {
        id: 'v1_python_types',
        fileId: 4,
        version: 'v1.0.0',
        description: 'Python数据类型详解',
        createTime: '2024-03-17 09:30:00',
        uploader: 'admin',
        size: 1835008,
        fileUrl: '/static/python-data-types.pptx',
      },
    ],
  },
  {
    id: 5,
    courseId: 101,
    title: 'Python函数与模块',
    type: '课件',
    size: 2097152, // 2MB
    uploadTime: '2024-03-18',
    downloadCount: 167,
    url: '/static/python-functions.pptx',
    versions: [
      {
        id: 'v1_python_functions',
        fileId: 5,
        version: 'v1.0.0',
        description: 'Python函数与模块',
        createTime: '2024-03-18 10:15:00',
        uploader: 'admin',
        size: 2097152,
        fileUrl: '/static/python-functions.pptx',
      },
    ],
  },
  {
    id: 6,
    courseId: 101,
    title: 'Python面向对象编程',
    type: '课件',
    size: 2359296, // 2.25MB
    uploadTime: '2024-03-19',
    downloadCount: 145,
    url: '/static/python-oop.pptx',
    versions: [
      {
        id: 'v1_python_oop',
        fileId: 6,
        version: 'v1.0.0',
        description: 'Python面向对象编程',
        createTime: '2024-03-19 11:00:00',
        uploader: 'admin',
        size: 2359296,
        fileUrl: '/static/python-oop.pptx',
      },
    ],
  },
  {
    id: 7,
    courseId: 101,
    title: 'Python文件操作实验',
    type: '实验',
    size: 1572864, // 1.5MB
    uploadTime: '2024-03-20',
    downloadCount: 98,
    url: '/static/python-file-lab.pdf',
    versions: [
      {
        id: 'v1_python_file_lab',
        fileId: 7,
        version: 'v1.0.0',
        description: 'Python文件操作实验',
        createTime: '2024-03-20 13:45:00',
        uploader: 'admin',
        size: 1572864,
        fileUrl: '/static/python-file-lab.pdf',
      },
    ],
  },
  {
    id: 8,
    courseId: 101,
    title: 'Python异常处理',
    type: '课件',
    size: 1310720, // 1.25MB
    uploadTime: '2024-03-21',
    downloadCount: 112,
    url: '/static/python-exceptions.pptx',
    versions: [
      {
        id: 'v1_python_exceptions',
        fileId: 8,
        version: 'v1.0.0',
        description: 'Python异常处理',
        createTime: '2024-03-21 09:00:00',
        uploader: 'admin',
        size: 1310720,
        fileUrl: '/static/python-exceptions.pptx',
      },
    ],
  },
  {
    id: 9,
    courseId: 101,
    title: 'Python期末复习资料',
    type: '课件',
    size: 3145728, // 3MB
    uploadTime: '2024-03-22',
    downloadCount: 289,
    url: '/static/python-review.pdf',
    versions: [
      {
        id: 'v1_python_review',
        fileId: 9,
        version: 'v1.0.0',
        description: 'Python期末复习资料',
        createTime: '2024-03-22 14:30:00',
        uploader: 'admin',
        size: 3145728,
        fileUrl: '/static/python-review.pdf',
      },
    ],
  },
  {
    id: 10,
    courseId: 101,
    title: 'Python项目实战指南',
    type: '课件',
    size: 3670016, // 3.5MB
    uploadTime: '2024-03-23',
    downloadCount: 156,
    url: '/static/python-project.pdf',
    versions: [
      {
        id: 'v1_python_project',
        fileId: 10,
        version: 'v1.0.0',
        description: 'Python项目实战指南',
        createTime: '2024-03-23 10:00:00',
        uploader: 'admin',
        size: 3670016,
        fileUrl: '/static/python-project.pdf',
      },
    ],
  },

  // 数据结构课程文件 (courseId: 102)
  {
    id: 11,
    courseId: 102,
    title: '数据结构与算法讲义',
    type: '课件',
    size: 3984589, // 3.8MB
    uploadTime: '2024-03-13',
    downloadCount: 234,
    url: '/static/test.pdf',
    versions: [
      {
        id: 'v1_data_structure',
        fileId: 11,
        version: 'v1.0.0',
        description: '数据结构与算法讲义初始版本',
        createTime: '2024-03-13 14:00:00',
        uploader: 'admin',
        size: 3984589,
        fileUrl: '/static/test.pdf',
      },
    ],
  },
  {
    id: 12,
    courseId: 102,
    title: '线性表与链表',
    type: '课件',
    size: 2359296, // 2.25MB
    uploadTime: '2024-03-14',
    downloadCount: 167,
    url: '/static/linear-list.pptx',
    versions: [
      {
        id: 'v1_linear_list',
        fileId: 12,
        version: 'v1.0.0',
        description: '线性表与链表',
        createTime: '2024-03-14 09:30:00',
        uploader: 'admin',
        size: 2359296,
        fileUrl: '/static/linear-list.pptx',
      },
    ],
  },
  {
    id: 13,
    courseId: 102,
    title: '栈与队列',
    type: '课件',
    size: 2097152, // 2MB
    uploadTime: '2024-03-15',
    downloadCount: 145,
    url: '/static/stack-queue.pptx',
    versions: [
      {
        id: 'v1_stack_queue',
        fileId: 13,
        version: 'v1.0.0',
        description: '栈与队列',
        createTime: '2024-03-15 10:15:00',
        uploader: 'admin',
        size: 2097152,
        fileUrl: '/static/stack-queue.pptx',
      },
    ],
  },
  {
    id: 14,
    courseId: 102,
    title: '树与二叉树',
    type: '课件',
    size: 2883584, // 2.75MB
    uploadTime: '2024-03-16',
    downloadCount: 189,
    url: '/static/tree.pptx',
    versions: [
      {
        id: 'v1_tree',
        fileId: 14,
        version: 'v1.0.0',
        description: '树与二叉树',
        createTime: '2024-03-16 11:00:00',
        uploader: 'admin',
        size: 2883584,
        fileUrl: '/static/tree.pptx',
      },
    ],
  },
  {
    id: 15,
    courseId: 102,
    title: '图论基础',
    type: '课件',
    size: 3145728, // 3MB
    uploadTime: '2024-03-17',
    downloadCount: 178,
    url: '/static/graph.pptx',
    versions: [
      {
        id: 'v1_graph',
        fileId: 15,
        version: 'v1.0.0',
        description: '图论基础',
        createTime: '2024-03-17 13:45:00',
        uploader: 'admin',
        size: 3145728,
        fileUrl: '/static/graph.pptx',
      },
    ],
  },
  {
    id: 16,
    courseId: 102,
    title: '排序算法',
    type: '课件',
    size: 2621440, // 2.5MB
    uploadTime: '2024-03-18',
    downloadCount: 156,
    url: '/static/sorting.pptx',
    versions: [
      {
        id: 'v1_sorting',
        fileId: 16,
        version: 'v1.0.0',
        description: '排序算法',
        createTime: '2024-03-18 09:00:00',
        uploader: 'admin',
        size: 2621440,
        fileUrl: '/static/sorting.pptx',
      },
    ],
  },
  {
    id: 17,
    courseId: 102,
    title: '查找算法',
    type: '课件',
    size: 2359296, // 2.25MB
    uploadTime: '2024-03-19',
    downloadCount: 134,
    url: '/static/searching.pptx',
    versions: [
      {
        id: 'v1_searching',
        fileId: 17,
        version: 'v1.0.0',
        description: '查找算法',
        createTime: '2024-03-19 10:30:00',
        uploader: 'admin',
        size: 2359296,
        fileUrl: '/static/searching.pptx',
      },
    ],
  },
  {
    id: 18,
    courseId: 102,
    title: '数据结构实验指导',
    type: '实验',
    size: 1835008, // 1.75MB
    uploadTime: '2024-03-20',
    downloadCount: 167,
    url: '/static/data-structure-lab.pdf',
    versions: [
      {
        id: 'v1_data_structure_lab',
        fileId: 18,
        version: 'v1.0.0',
        description: '数据结构实验指导',
        createTime: '2024-03-20 14:15:00',
        uploader: 'admin',
        size: 1835008,
        fileUrl: '/static/data-structure-lab.pdf',
      },
    ],
  },
  {
    id: 19,
    courseId: 102,
    title: '算法复杂度分析',
    type: '课件',
    size: 1572864, // 1.5MB
    uploadTime: '2024-03-21',
    downloadCount: 145,
    url: '/static/complexity.pptx',
    versions: [
      {
        id: 'v1_complexity',
        fileId: 19,
        version: 'v1.0.0',
        description: '算法复杂度分析',
        createTime: '2024-03-21 11:00:00',
        uploader: 'admin',
        size: 1572864,
        fileUrl: '/static/complexity.pptx',
      },
    ],
  },
  {
    id: 20,
    courseId: 102,
    title: '数据结构期末复习资料',
    type: '课件',
    size: 3670016, // 3.5MB
    uploadTime: '2024-03-22',
    downloadCount: 289,
    url: '/static/data-structure-review.pdf',
    versions: [
      {
        id: 'v1_data_structure_review',
        fileId: 20,
        version: 'v1.0.0',
        description: '数据结构期末复习资料',
        createTime: '2024-03-22 15:30:00',
        uploader: 'admin',
        size: 3670016,
        fileUrl: '/static/data-structure-review.pdf',
      },
    ],
  },
]

// 处理文件分片上传
router.post('/chunk', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        code: 400,
        message: '没有接收到文件',
        data: null,
      })
    }

    res.json({
      code: 200,
      message: '文件上传成功',
      data: {
        fileName: req.file.filename,
        fileSize: req.file.size,
      },
    })
  } catch (error) {
    console.error('文件上传失败：', error)
    res.status(500).json({
      code: 500,
      message: '文件上传失败',
      data: null,
    })
  }
})

// 保存文件信息
router.post('/merge', (req, res) => {
  try {
    const { fileName, fileSize, title, type, category, courseId } = req.body

    // 创建新的文件信息
    const newFile = {
      id: Date.now(),
      courseId: parseInt(courseId),
      title,
      type,
      category,
      size: parseInt(fileSize),
      uploadTime: new Date().toISOString().split('T')[0],
      downloadCount: 0,
      url: `/static/${fileName}`, // 使用chunk接口返回的实际文件名
      versions: [
        {
          id: `v1_${Date.now()}`,
          fileId: Date.now(), // 使用与文件相同的ID作为fileId
          version: 'v1.0.0',
          description: '初始上传',
          createTime: new Date().toISOString().split('T')[0],
          uploader: 'admin', // 假设上传者是admin
          size: parseInt(fileSize),
          fileUrl: `/static/${fileName}`,
        },
      ],
    }

    // 将新文件信息添加到files数组中
    files.push(newFile)

    res.json({
      code: 200,
      message: '文件信息保存成功',
      data: newFile,
    })
  } catch (error) {
    console.error('保存文件信息失败：', error)
    res.status(500).json({
      code: 500,
      message: '保存文件信息失败',
      data: null,
    })
  }
})

// 获取课程相关文件
router.get('/courses/:courseId/files', (req, res) => {
  const courseId = parseInt(req.params.courseId)
  const courseFiles = files.filter((file) => file.courseId === courseId)
  res.json({
    code: 200,
    message: '获取成功',
    data: courseFiles,
  })
})

// 搜索文件
router.get('/search', (req, res) => {
  const keyword = req.query.keyword?.toLowerCase() || ''
  const matchedFiles = files.filter((file) => file.title.toLowerCase().includes(keyword))
  res.json({
    code: 200,
    message: '搜索成功',
    data: matchedFiles,
  })
})

// 获取文件版本列表
router.get('/:fileId/versions', (req, res) => {
  const fileId = parseInt(req.params.fileId)
  const file = files.find((f) => f.id === fileId)

  if (!file) {
    return res.status(404).json({
      code: 404,
      message: '文件不存在',
      data: null,
    })
  }

  res.json({
    code: 200,
    message: '获取版本列表成功',
    data: file.versions || [], // 返回文件版本列表，如果为空则返回空数组
  })
})

// 创建新版本
router.post('/:fileId/versions', upload.single('file'), (req, res) => {
  try {
    const fileId = parseInt(req.params.fileId)
    const { description, version } = req.body
    const file = files.find((f) => f.id === fileId)

    if (!file) {
      return res.status(404).json({
        code: 404,
        message: '文件不存在',
        data: null,
      })
    }

    if (!req.file) {
      return res.status(400).json({
        code: 400,
        message: '没有接收到文件',
        data: null,
      })
    }

    if (!version) {
      return res.status(400).json({
        code: 400,
        message: '版本号不能为空',
        data: null,
      })
    }

    // 检查版本号格式
    if (!/^v\d+\.\d+\.\d+$/.test(version)) {
      return res.status(400).json({
        code: 400,
        message: '版本号格式不正确，应为 v1.0.0 格式',
        data: null,
      })
    }

    // 检查版本号是否已存在
    const currentVersions = file.versions || []
    const versionExists = currentVersions.some((v) => v.version === version)
    if (versionExists) {
      return res.status(400).json({
        code: 400,
        message: '该版本号已存在',
        data: null,
      })
    }

    // 创建新版本信息
    const newVersion = {
      id: `v${Date.now()}`,
      fileId: fileId,
      version: version,
      description: description || '新版本',
      createTime: new Date()
        .toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
        .replace(/\//g, '-'),
      uploader: req.user?.username || 'anonymous', // 假设有用户信息
      size: req.file.size,
      fileUrl: `/static/${req.file.filename}`,
    }

    // 更新文件信息
    file.versions = [...currentVersions, newVersion]
    file.url = newVersion.fileUrl // 更新文件URL为最新版本
    file.size = newVersion.size // 更新文件大小为最新版本

    res.json({
      code: 200,
      message: '新版本上传成功',
      data: newVersion,
    })
  } catch (error) {
    console.error('上传新版本失败：', error)
    res.status(500).json({
      code: 500,
      message: '上传新版本失败',
      data: null,
    })
  }
})

// 文件下载接口
router.get('/download/:fileId', (req, res) => {
  const { fileId } = req.params

  const file = files.find((f) => f.id.toString() === fileId)
  if (!file) {
    return res.status(404).send('文件不存在')
  }

  const filePath = path.join(__dirname, '../../files', file.url.split('/static/')[1])

  // 检查文件是否存在
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('文件不存在')
  }

  // 设置响应头
  const ext = path.extname(filePath)
  const fileName = `${file.title}${ext}`

  // 使用 filename 而不是 filename*，因为某些客户端可能不支持 filename*
  res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`)

  // 根据文件扩展名设置正确的 Content-Type
  const mimeTypes = {
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.ppt': 'application/vnd.ms-powerpoint',
    '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    '.zip': 'application/zip',
    '.rar': 'application/x-rar-compressed',
    '.txt': 'text/plain',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
  }

  res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream')

  // 创建文件流并发送
  const fileStream = fs.createReadStream(filePath)
  fileStream.pipe(res)

  // 错误处理
  fileStream.on('error', () => {
    res.status(500).send('文件下载失败')
  })
})

// 下载特定版本的文件
router.get('/:fileId/versions/:versionId/download', (req, res) => {
  const { fileId, versionId } = req.params

  const file = files.find((f) => f.id.toString() === fileId)
  if (!file) {
    return res.status(404).json({
      code: 404,
      message: '文件不存在',
      data: null,
    })
  }

  const version = file.versions.find((v) => v.id === versionId)
  if (!version) {
    return res.status(404).json({
      code: 404,
      message: '版本不存在',
      data: null,
    })
  }

  const filePath = path.join(__dirname, '../../files', version.fileUrl.split('/static/')[1])

  // 检查文件是否存在
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      code: 404,
      message: '文件资源不存在',
      data: null,
    })
  }

  // 设置响应头
  const ext = path.extname(filePath)
  const fileName = `${file.title}-${version.description}-${version.version}${ext}`

  // 使用 filename 而不是 filename*，因为某些客户端可能不支持 filename*
  res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`)

  // 根据文件扩展名设置正确的 Content-Type
  const mimeTypes = {
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.ppt': 'application/vnd.ms-powerpoint',
    '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    '.zip': 'application/zip',
    '.rar': 'application/x-rar-compressed',
    '.txt': 'text/plain',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
  }

  res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream')

  // 创建文件流并发送
  const fileStream = fs.createReadStream(filePath)
  fileStream.pipe(res)

  // 错误处理
  fileStream.on('error', () => {
    if (!res.headersSent) {
      res.status(500).json({
        code: 500,
        message: '文件下载失败',
        data: null,
      })
    }
  })
})

export default router
