import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data

    // 如果响应中包含错误码
    if (res.code && res.code !== 200) {
      ElMessage({
        message: res.message || '请求失败',
        type: 'error',
        duration: 5000
      })

      // 处理特定错误码
      if (res.code === 401) {
        // Token 过期或无效，清除本地存储并重定向到登录页
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        window.location.href = '/login'
      }

      return Promise.reject(new Error(res.message || '请求失败'))
    }

    return res
  },
  error => {
    console.error('Response error:', error)

    // 处理网络错误
    if (!error.response) {
      ElMessage({
        message: '网络连接失败，请检查网络设置',
        type: 'error',
        duration: 5000
      })
      return Promise.reject(new Error('Network Error'))
    }

    // 处理 HTTP 错误
    const message = {
      400: '请求参数错误',
      401: '未授权，请重新登录',
      403: '拒绝访问',
      404: '请求地址不存在',
      408: '请求超时',
      500: '服务器内部错误',
      501: '服务未实现',
      502: '网关错误',
      503: '服务不可用',
      504: '网关超时'
    }[error.response.status] || error.response.data?.message || '请求失败'

    ElMessage({
      message,
      type: 'error',
      duration: 5000
    })

    // 处理 401 错误
    if (error.response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

/**
 * 封装请求方法
 * @template T
 * @param {Object} config - 请求配置
 * @param {string} config.url - 请求地址
 * @param {string} config.method - 请求方法
 * @param {Object} [config.params] - URL参数
 * @param {Object} [config.data] - 请求体数据
 * @param {Object} [config.headers] - 请求头
 * @returns {Promise<T>}
 */
const request = async (config) => {
  try {
    const response = await service(config)
    return response
  } catch (error) {
    return Promise.reject(error)
  }
}

export default request
