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
    url: '/static/ds-algo-notes.pdf',
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

export default router
