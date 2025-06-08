import express from 'express'
const router = express.Router()

// 模拟用户数据库
const users = [
  {
    phone: '13800138000',
    username: 'admin',
    password: '123456',
    role: 'admin',
    avatar: 'https://example.com/admin-avatar.jpg',
  },
]

// 全局收藏夹数据
const userFavorite = {
  id: 'fav_shared',
  name: '共享收藏夹',
  description: '所有用户共享的收藏夹',
  isPublic: true,
  resourceCount: 0,
  createdAt: '2023-10-27 10:00:00',
  updatedAt: '2023-10-27 10:00:00',
  resources: [
    {
      id: 'res1',
      title: '课程PPT第一章',
      fileType: 'ppt',
      size: 5242880, // 5MB
      uploadTime: '2023-10-27',
    },
    {
      id: 'res2',
      title: '软件安装包',
      fileType: 'zip',
      size: 10485760, // 10MB
      uploadTime: '2023-10-27',
    },
  ],
}

// 获取用户信息
router.get('/', (req, res) => {
  res.json({
    code: 200,
    message: 'success',
    data: {
      name: 'John Doe',
      age: 30,
      avatar: 'https://example.com/avatar.jpg',
      email: 'john@example.com',
      role: 'user',
    },
  })
})

// 登录
router.post('/auth/login', (req, res) => {
  const { phone, password } = req.body
  if (!phone || !password) {
    return res.status(400).json({
      code: 400,
      message: '手机号和密码不能为空',
      data: null,
    })
  }

  const user = users.find((u) => u.phone === phone && u.password === password)
  if (user) {
    res.json({
      code: 200,
      message: '登录成功',
      data: {
        token: `mock_token_${Date.now()}`,
        userInfo: {
          phone: user.phone,
          username: user.username,
          role: user.role,
          avatar: user.avatar,
        },
      },
    })
  } else {
    res.status(400).json({
      code: 400,
      message: '手机号或密码错误',
      data: null,
    })
  }
})

// 注册
router.post('/auth/register', (req, res) => {
  const { phone, username, password } = req.body

  if (!phone || !username || !password) {
    return res.status(400).json({
      code: 400,
      message: '请填写完整信息',
      data: null,
    })
  }

  if (password.length < 6) {
    return res.status(400).json({
      code: 400,
      message: '密码长度不能少于6位',
      data: null,
    })
  }

  if (users.some((u) => u.phone === phone)) {
    return res.status(400).json({
      code: 400,
      message: '该手机号已注册',
      data: null,
    })
  }

  const newUser = {
    phone,
    username,
    password,
    role: 'user',
    avatar: 'https://example.com/default-avatar.jpg',
  }

  users.push(newUser)
  res.json({
    code: 200,
    message: '注册成功',
    data: {
      token: `mock_token_${Date.now()}`,
      userInfo: {
        phone: newUser.phone,
        username: newUser.username,
        role: newUser.role,
        avatar: newUser.avatar,
      },
    },
  })
})

// 获取用户收藏夹
router.get('/favorite', (req, res) => {
  res.json({
    code: 200,
    message: 'success',
    data: userFavorite,
  })
})

// 添加资源到收藏夹
router.post('/favorite/resources', (req, res) => {
  const { id, title, fileType, size, uploadTime } = req.body

  if (!id) {
    return res.status(400).json({
      code: 400,
      message: '资源ID不能为空',
      data: null,
    })
  }

  // 检查是否已收藏
  if (userFavorite.resources.some((res) => res.id === id)) {
    return res.status(400).json({
      code: 400,
      message: '该资源已收藏',
      data: null,
    })
  }

  // 添加新资源
  const newResource = {
    id,
    title,
    fileType,
    size,
    uploadTime,
  }

  userFavorite.resources.push(newResource)
  userFavorite.resourceCount = userFavorite.resources.length
  userFavorite.updatedAt = new Date().toISOString()

  res.json({
    code: 200,
    message: '添加收藏成功',
    data: {
      resourceId: id,
      addedAt: new Date().toISOString(),
    },
  })
})

// 从收藏夹移除资源
router.delete('/favorite/resources/:resourceId', (req, res) => {
  const { resourceId } = req.params

  if (!resourceId) {
    return res.status(400).json({
      code: 400,
      message: '资源ID不能为空',
      data: null,
    })
  }

  // 检查是否已收藏
  const resourceIndex = userFavorite.resources.findIndex((res) => res.id === resourceId)
  if (resourceIndex === -1) {
    return res.status(400).json({
      code: 400,
      message: '该资源未收藏',
      data: null,
    })
  }

  // 移除资源
  userFavorite.resources.splice(resourceIndex, 1)
  userFavorite.resourceCount = userFavorite.resources.length
  userFavorite.updatedAt = new Date().toISOString()

  res.json({
    code: 200,
    message: '取消收藏成功',
    data: {
      resourceId,
      removedAt: new Date().toISOString(),
    },
  })
})

export default router
