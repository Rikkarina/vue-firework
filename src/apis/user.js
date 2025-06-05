import request from '@/utils/request'

/**
 * 获取用户信息
 * @returns {Promise<import('@/types/userTypes').UserInfo>}
 */
export function getUserInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

/**
 * 更新用户信息
 * @param {Partial<import('@/types/userTypes').UserInfo>} data - 用户信息
 * @returns {Promise<import('@/types/userTypes').UserInfo>}
 */
export function updateUserInfo(data) {
  return request({
    url: '/user/info',
    method: 'put',
    data
  })
}

/**
 * 更新用户头像
 * @param {FormData} formData - 包含头像文件的表单数据
 * @returns {Promise<{avatarUrl: string}>}
 */
export function updateAvatar(formData) {
  return request({
    url: '/user/avatar',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 修改密码
 * @param {Object} data - 密码数据
 * @param {string} data.oldPassword - 旧密码
 * @param {string} data.newPassword - 新密码
 * @returns {Promise<void>}
 */
export function changePassword(data) {
  return request({
    url: '/user/password',
    method: 'put',
    data
  })
}

/**
 * 获取用户设置
 * @returns {Promise<Object>}
 */
export function getUserSettings() {
  return request({
    url: '/user/settings',
    method: 'get'
  })
}

/**
 * 更新用户设置
 * @param {Object} settings - 用户设置
 * @returns {Promise<Object>}
 */
export function updateUserSettings(settings) {
  return request({
    url: '/user/settings',
    method: 'put',
    data: settings
  })
}
