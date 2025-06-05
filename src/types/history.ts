/**
 * 历史记录类型
 */
export type HistoryType = 'view' | 'download' | 'upload' | 'share' | 'edit' | 'delete'

/**
 * 历史记录实体
 */
export interface History {
  /** 历史记录ID */
  id: number | string
  /** 操作类型 */
  type: HistoryType
  /** 操作描述 */
  description: string
  /** 操作时间 */
  time: string
  /** 操作者ID */
  userId: number | string
  /** 操作者名称 */
  userName: string
  /** 资源ID */
  resourceId: number | string
  /** 资源类型 */
  resourceType: string
  /** 资源名称 */
  resourceName: string
  /** 资源路径 */
  resourcePath?: string
  /** IP地址 */
  ipAddress?: string
  /** 设备信息 */
  deviceInfo?: string
  /** 创建时间 */
  createdAt: string
  /** 额外数据 */
  metadata?: Record<string, any>
}

/**
 * 历史记录列表响应
 */
export interface HistoryListResponse {
  /** 历史记录列表 */
  items: History[]
  /** 总数 */
  total: number
  /** 分页信息 */
  pagination: {
    /** 当前页码 */
    page: number
    /** 每页条数 */
    pageSize: number
    /** 总页数 */
    totalPages: number
  }
}

/**
 * 历史记录列表请求参数
 */
export interface HistoryListParams {
  /** 页码 */
  page?: number
  /** 每页条数 */
  pageSize?: number
  /** 操作类型 */
  type?: HistoryType
  /** 用户ID */
  userId?: number | string
  /** 资源ID */
  resourceId?: number | string
  /** 资源类型 */
  resourceType?: string
  /** 开始时间 */
  startTime?: string
  /** 结束时间 */
  endTime?: string
  /** 搜索关键词 */
  keyword?: string
  /** 排序字段 */
  sortBy?: string
  /** 排序方向 */
  sortOrder?: 'asc' | 'desc'
}

/**
 * 历史记录统计
 */
export interface HistoryStats {
  /** 总操作次数 */
  totalOperations: number
  /** 各类型操作次数 */
  operationsByType: Record<HistoryType, number>
  /** 最近一次操作时间 */
  lastOperationTime: string
  /** 最活跃用户 */
  mostActiveUsers: {
    userId: number | string
    userName: string
    operationCount: number
  }[]
}
