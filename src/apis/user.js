import http from '@/utils/http'
export const getUserAPI = () => {
  return http({
    url: '/user',
  })
}
