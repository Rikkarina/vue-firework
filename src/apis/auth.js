import request from '@/utils/http'

// 登录
export const login = (data) => {
  return request({
    url: '/api/auth/login',
    method: 'POST',
    data,
  })
}

// 注册
export const register = (data) => {
  return request({
    url: '/api/auth/register',
    method: 'POST',
    data,
  })
}

