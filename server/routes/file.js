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
  {
    id: 1,
    courseId: 101,
    title: 'Python基础语法PPT',
    type: '课件',
    size: 2621440, // 2.5MB = 2.5 * 1024 * 1024
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
    size: 1258291, // 1.2MB = 1.2 * 1024 * 1024
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
    courseId: 102,
    title: '数据结构与算法讲义',
    type: '课件',
    size: 3984589, // 3.8MB = 3.8 * 1024 * 1024
    uploadTime: '2024-03-13',
    downloadCount: 234,
    url: '/static/test.pdf',
    versions: [
      {
        id: 'v1_data_structure',
        fileId: 3,
        version: 'v1.0.0',
        description: '数据结构与算法讲义初始版本',
        createTime: '2024-03-13 14:00:00',
        uploader: 'admin',
        size: 3984589,
        fileUrl: '/static/test.pdf',
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
    const { description } = req.body
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

    // 获取当前版本号
    const currentVersions = file.versions || []
    const lastVersion = currentVersions[currentVersions.length - 1]
    const versionNumber = lastVersion
      ? `v${parseFloat(lastVersion.version.slice(1)) + 0.1}`
      : 'v1.0.0'

    // 创建新版本信息
    const newVersion = {
      id: `v${Date.now()}`,
      fileId: fileId,
      version: versionNumber,
      description: description || '新版本',
      createTime: new Date().toISOString(),
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

export default router
