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

// 文件下载接口
router.get('/download/:fileId', (req, res) => {
  const { fileId } = req.params
  console.log('收到下载请求，fileId:', fileId)

  const file = files.find((f) => f.id.toString() === fileId)
  if (!file) {
    console.log('文件未找到，fileId:', fileId)
    return res.status(404).send('文件不存在')
  }
  console.log('找到文件信息：', file)

  const filePath = path.join(__dirname, '../../files', file.url.split('/static/')[1])
  console.log('文件路径：', filePath)

  // 检查文件是否存在
  if (!fs.existsSync(filePath)) {
    console.log('文件不存在于磁盘：', filePath)
    return res.status(404).send('文件不存在')
  }

  // 设置响应头
  const ext = path.extname(filePath)
  const fileName = `${file.title}${ext}`
  console.log('设置文件名：', fileName)
  console.log('文件扩展名：', ext)
  console.log('原始文件信息：', file)

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
  console.log('开始发送文件流')

  // 创建文件流并发送
  const fileStream = fs.createReadStream(filePath)
  fileStream.pipe(res)

  // 错误处理
  fileStream.on('error', (error) => {
    console.error('文件下载错误：', error)
    res.status(500).send('文件下载失败')
  })
})

export default router
