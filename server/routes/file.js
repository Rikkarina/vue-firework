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

    // 这里可以添加数据库操作，保存文件信息
    // 示例返回
    res.json({
      code: 200,
      message: '文件信息保存成功',
      data: {
        id: Date.now(),
        courseId: parseInt(courseId),
        title,
        type,
        category,
        size: parseInt(fileSize),
        uploadTime: new Date().toISOString().split('T')[0],
        downloadCount: 0,
        url: `/files/${fileName}`,
      },
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

export default router
