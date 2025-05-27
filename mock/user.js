const mockData = [
  {
    url: '/api/user',
    method: 'GET',
    response: () => {
      return {
        code: 200,
        message: 'success',
        data: {
          name: 'John Doe',
          age: 30,
          avatar: 'https://example.com/avatar.jpg',
          email: 'john@example.com',
          role: 'user',
        },
      }
    },
  },
]

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

const loginResponse = (req) => {
  const { phone, password } = req.body
  if (!phone || !password) {
    return {
      code: 400,
      message: '手机号和密码不能为空',
      data: null,
    }
  }

  const user = users.find((u) => u.phone === phone && u.password === password)
  if (user) {
    return {
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
    }
  } else {
    return {
      code: 400,
      message: '手机号或密码错误',
      data: null,
    }
  }
}

const registerResponse = (req) => {
  const { phone, username, password } = req.body

  if (!phone || !username || !password) {
    return {
      code: 400,
      message: '请填写完整信息',
      data: null,
    }
  }

  if (password.length < 6) {
    return {
      code: 400,
      message: '密码长度不能少于6位',
      data: null,
    }
  }

  if (users.some((u) => u.phone === phone)) {
    return {
      code: 400,
      message: '该手机号已注册',
      data: null,
    }
  }

  const newUser = {
    phone,
    username,
    password,
    role: 'user',
    avatar: 'https://example.com/default-avatar.jpg',
  }

  users.push(newUser)
  return {
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
  }
}

// 模拟用户收藏夹数据
const userFavorite = {
  id: 'fav_user1',
  userId: 'user1',
  name: '我的默认收藏夹',
  description: '这是我的收藏夹',
  isPublic: false,
  resourceCount: 2,
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

mockData.push(
  {
    url: '/api/user',
    method: 'GET',
    response: () => {
      return {
        code: 200,
        message: 'success',
        data: {
          name: 'John Doe',
          age: 30,
          avatar: 'https://example.com/avatar.jpg',
          email: 'john@example.com',
          role: 'user',
        },
      }
    },
  },
  {
    url: '/api/auth/login',
    method: 'POST',
    response: loginResponse,
  },
  {
    url: '/api/auth/register',
    method: 'POST',
    response: registerResponse,
  },
  // 模拟获取用户收藏夹接口
  {
    url: '/api/favorite',
    method: 'GET',
    response: () => {
      return {
        code: 200,
        message: 'success',
        data: userFavorite,
      }
    },
  },
)
export default mockData
