import axios from 'axios'

// 创建一个 Axios 实例
const instance = axios.create({
  baseURL: '/api', // 替换为你的 API 基础 URL
  timeout: 5000, // 请求超时时间，单位为毫秒
  headers: {
    'Content-Type': 'application/json',
    // // 在这里添加其他默认请求头
    // 'Cache-Control': 'no-cache, no-store, must-revalidate',
    // Pragma: 'no-cache',
    // Expires: '0',
  },
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    // 例如，可以在这里添加请求头，如添加 token
    // const token = localStorage.getItem('token');
    // if (token) {
    //     config.headers.Authorization = `Bearer ${token}`;
    // }
    return config
  },
  (error) => {
    // 处理请求错误
    console.error('请求出错:', error)
    return Promise.reject(error)
  },
)

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    return response.data
  },
  (error) => {
    // 处理响应错误
    console.error('响应出错:', error)
    return Promise.reject(error)
  },
)

export default instance
