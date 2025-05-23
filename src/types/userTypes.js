/**
 * 用户信息接口
 * @typedef {Object} UserInfo
 * @property {string} id - 用户唯一标识
 * @property {string} username - 用户名（登录用）
 * @property {string} email - 邮箱
 * @property {string} avatar - 头像URL
 * @property {string} nickname - 昵称（显示用）
 * @property {string} realName - 真实姓名
 * @property {string} role - 用户角色
 * @property {string[]} permissions - 权限列表
 * @property {string} status - 账号状态
 * @property {number} uploadCount - 上传资源数量
 * @property {number} downloadCount - 下载资源数量
 * @property {string} lastLoginTime - 最后登录时间
 * @property {string} createdAt - 账号创建时间
 * @property {string} updatedAt - 账号更新时间
 * @property {FavoriteInfo} favorite - 用户收藏夹信息
 */

/**
 * 用户角色枚举
 * @enum {string}
 */
export const UserRole = {
  STUDENT: 'student', // 学生
  TEACHER: 'teacher', // 教师
  ADMIN: 'admin', // 管理员
}

/**
 * 用户权限枚举
 * @enum {string}
 */
export const UserPermission = {
  UPLOAD: 'upload', // 上传资源
  DOWNLOAD: 'download', // 下载资源
  REVIEW: 'review', // 审核资源
  MANAGE: 'manage', // 管理资源
}

/**
 * 用户状态枚举
 * @enum {string}
 */
export const UserStatus = {
  ACTIVE: 'active', // 正常
  INACTIVE: 'inactive', // 未激活
  BANNED: 'banned', // 禁用
}

/**
 * 收藏夹信息接口 (用户只有一个收藏夹)
 * @typedef {Object} FavoriteInfo
 * @property {string} id - 收藏夹唯一标识
 * @property {string} userId - 所属用户ID
 * @property {string} name - 收藏夹名称
 * @property {string} description - 收藏夹描述
 * @property {number} resourceCount - 资源数量
 * @property {string} createdAt - 创建时间
 * @property {string} updatedAt - 更新时间
 * @property {FavoriteResource[]} resources - 收藏的资源列表
 */

/**
 * 收藏夹资源接口
 * @typedef {Object} FavoriteResource
 * @property {string} id - 收藏记录ID
 * @property {string} resourceId - 资源ID
 * @property {string} resourceName - 资源名称
 * @property {string} resourceType - 资源类型
 * @property {string} createdAt - 收藏时间
 */

export default {
  UserRole,
  UserPermission,
  UserStatus,
}

// 用户登录请求参数
export const LoginParams = {
  username: '', // 用户名
  password: '', // 密码
}

// 用户注册请求参数
export const RegisterParams = {
  username: '', // 用户名
  password: '', // 密码
  email: '', // 邮箱
  realName: '', // 真实姓名
  role: UserRole.STUDENT, // 用户角色
}

// 用户信息更新请求参数
export const UpdateUserParams = {
  nickname: '', // 昵称
  avatar: '', // 头像URL
  email: '', // 邮箱
  realName: '', // 真实姓名
}

// 收藏夹信息接口
export const FavoriteInfo = {
  id: '', // 收藏夹ID
  userId: '', // 所属用户ID
  name: '', // 收藏夹名称
  description: '', // 收藏夹描述
  isPublic: false, // 是否公开
  resourceCount: 0, // 资源数量
  createdAt: '', // 创建时间
  updatedAt: '', // 更新时间
}

// 收藏夹资源接口
export const FavoriteResource = {
  id: '', // 收藏记录ID
  favoriteId: '', // 收藏夹ID
  resourceId: '', // 资源ID
  resourceName: '', // 资源名称
  resourceType: '', // 资源类型
  createdAt: '', // 收藏时间
}

// 创建收藏夹请求参数
export const CreateFavoriteParams = {
  name: '', // 收藏夹名称
  description: '', // 收藏夹描述
  isPublic: false, // 是否公开
}

// 更新收藏夹请求参数
export const UpdateFavoriteParams = {
  name: '', // 收藏夹名称
  description: '', // 收藏夹描述
  isPublic: false, // 是否公开
}

// 添加收藏请求参数
export const AddFavoriteParams = {
  favoriteId: '', // 收藏夹ID
  resourceId: '', // 资源ID
}
