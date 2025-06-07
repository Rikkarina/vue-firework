/**
 * 文件列表项接口
 * @typedef {Object} FileListItem
 * @property {string} id - 文件唯一标识
 * @property {string} title - 文件标题
 * @property {string} type - 文件类型（课件、习题、软件资源等）
 * @property {string} fileType - 文件格式（pdf、docx、pptx等）
 * @property {number} size - 文件大小（字节）
 * @property {string} uploadTime - 上传时间
 * @property {number} downloadCount - 下载次数
 * @property {string} [previewUrl] - 预览地址
 * @property {string} category - 文件分类
 * @property {string[]} tags - 文件标签
 * @property {string} [courseId] - 所属课程ID
 * @property {string} [courseName] - 所属课程名称
 * @property {FileVersion[]} versions - 文件版本列表
 * @property {string} currentVersion - 当前版本号
 */

/**
 * 文件内容接口
 * @typedef {Object} FileContent
 * @property {string} id - 文件唯一标识
 * @property {string} content - 文件内容
 * @property {string} downloadUrl - 实际下载地址
 * @property {Object} permissions - 文件权限信息
 * @property {Object} [watermark] - 水印信息
 */

/**
 * 文件版本接口
 * @typedef {Object} FileVersion
 * @property {string} id - 版本唯一标识
 * @property {string} version - 版本号（如 v1.0.0）
 * @property {string} description - 版本描述
 * @property {string} createTime - 创建时间
 * @property {string} fileUrl - 文件URL
 * @property {number} size - 文件大小（字节）
 * @property {string} uploader - 上传者
 * @property {string} fileId - 所属文件ID
 */

/**
 * 文件类型枚举
 * @enum {string}
 */
export const FileType = {
  COURSEWARE: '课件',
  EXERCISE: '习题',
  SOFTWARE: '软件资源',
  OTHER: '其他',
}

/**
 * 文件格式枚举
 * @enum {string}
 */
export const FileFormat = {
  PDF: 'pdf',
  WORD: 'docx',
  EXCEL: 'xlsx',
  PPT: 'pptx',
  IMAGE: 'image',
  CODE: 'code',
  OTHER: 'other',
}

/**
 * 文件分类枚举
 * @enum {string}
 */
export const FileCategory = {
  LECTURE: 'lecture', // 讲义
  HOMEWORK: 'homework', // 作业
  EXAM: 'exam', // 考试
  CODE: 'code', // 代码
  OTHER: 'other', // 其他
}

/**
 * 文件权限枚举
 * @enum {string}
 */
export const FilePermission = {
  READ: 'read',
  DOWNLOAD: 'download',
  EDIT: 'edit',
  DELETE: 'delete',
}

/**
 * 版本操作类型枚举
 * @enum {string}
 */
export const VersionOperation = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  ROLLBACK: 'rollback',
}

export default {
  FileType,
  FileFormat,
  FileCategory,
  FilePermission,
  VersionOperation,
}
