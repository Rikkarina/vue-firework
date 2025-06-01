import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: process.env.VUE_APP_BASE_API || '/api',
  timeout: 15000
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 在这里可以添加token等认证信息
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data
    // 这里可以根据后端的响应结构进行适当的处理
    if (res.code && res.code !== 200) {
      console.error('Response error:', res.message)
      return Promise.reject(new Error(res.message || 'Error'))
    }
    return res
  },
  (error) => {
    console.error('Response error:', error)
    return Promise.reject(error)
  }
)

// 扩展AxiosRequestConfig类型，使其支持泛型
interface RequestConfig<T> extends AxiosRequestConfig {
  data?: T
}

// 请求函数
const request = <T = any>(config: RequestConfig<T>): Promise<T> => {
  return service.request(config)
}

export default request
