import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import process from 'process'
import fileRoutes from './routes/file.js'
import userRoutes from './routes/user.js'
import departmentRoutes from './routes/department.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// 中间件
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 静态文件服务
app.use('/static', express.static(path.join(__dirname, '../files')))

// 注册路由
app.use('/api/files', fileRoutes)
app.use('/api/user', userRoutes)
app.use('/api/departments', departmentRoutes)

// 404 处理中间件
app.use((req, res) => {
  res.status(404).json({
    code: 404,
    message: '请求的资源不存在',
    data: null,
  })
})

// 错误处理中间件
app.use((err, req, res) => {
  console.error(err.stack)
  res.status(500).json({
    code: 500,
    message: '服务器内部错误',
    data: null,
  })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`)
})
