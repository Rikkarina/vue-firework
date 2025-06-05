/**
 * @typedef {'document' | 'image' | 'video' | 'audio' | 'pdf' | 'other'} FileType
 */

/**
 * @typedef {Object} HistoryMetadata
 * @property {number} [lastPosition] - 上次查看位置（文档页码或视频时间点）
 * @property {string} [lastModified] - 最后修改时间
 * @property {string} [creator] - 创建者
 */

/**
 * @typedef {Object} HistoryItem
 * @property {number} id - 历史记录ID
 * @property {string} title - 文件标题
 * @property {string} description - 文件描述
 * @property {FileType} type - 文件类型
 * @property {string} size - 文件大小
 * @property {string} time - 浏览时间
 * @property {string} thumbnail - 缩略图URL
 * @property {string} fileId - 文件ID
 * @property {string} filePath - 文件路径
 * @property {HistoryMetadata} [metadata] - 元数据
 */

/**
 * @typedef {Object} HistoryListResponse
 * @property {number} total - 总数
 * @property {Array<HistoryItem>} items - 历史记录列表
 */

/**
 * @typedef {Object} HistoryQueryParams
 * @property {number} [page] - 页码
 * @property {number} [pageSize] - 每页数量
 * @property {FileType} [type] - 文件类型
 * @property {string} [startTime] - 开始时间
 * @property {string} [endTime] - 结束时间
 * @property {string} [keyword] - 搜索关键词
 */

export const FileTypes = {
  DOCUMENT: 'document',
  IMAGE: 'image',
  VIDEO: 'video',
  AUDIO: 'audio',
  PDF: 'pdf',
  OTHER: 'other'
}
