import request from '@/utils/http'

/**
 * 获取文件的所有版本列表
 * @param {string} fileId - 文件ID
 * @returns {Promise} 返回版本列表
 */
export const getFileVersions = (fileId) => {
  // 功能: 获取指定文件ID的所有历史版本信息。
  // 请求:
  //   方法: GET
  //   URL: `/api/files/${fileId}/versions` (这里的 `${fileId}` 会被实际的文件ID替换)
  //   参数: 无路径参数或查询参数（`fileId` 是URL路径的一部分）。
  //   请求体: 无
  //   请求头: 通常包含 `Authorization: Bearer <token>` 用于身份验证，以及其他默认头。
  // 响应:
  //   成功状态码: `200 OK`
  //   响应体: 预期的响应体结构应是一个包含 `FileVersion` 对象的数组，例如：
  //     {
  //       "code": 200,
  //       "message": "成功",
  //       "data": [
  //         { "id": "version_id_1", "fileId": "file_id_abc", "version": "v1.0.0", "description": "初始上传", "createTime": "2024-03-20T10:00:00Z", "size": 102400, "uploader": "user1" },
  //         // ... 更多版本对象
  //       ]
  //     }
  //     其中 `FileVersion` 对象的属性应与 `src/types/fileTypes.js` 中定义的 `FileVersion` 接口一致。
  //   错误状态码: 例如 `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `500 Internal Server Error`。
  return request({
    url: `/api/files/${fileId}/versions`,
    method: 'GET',
  })
}

/**
 * 创建新版本
 * @param {string} fileId - 文件ID
 * @param {FormData} formData - 包含版本信息的FormData对象
 * @returns {Promise} 返回新创建的版本信息
 */
export const createFileVersion = (fileId, formData) => {
  // 功能: 为指定文件ID上传一个新的版本。
  // 请求:
  //   方法: POST
  //   URL: `/api/files/${fileId}/versions`
  //   参数: 无路径参数或查询参数。
  //   请求体: 一个 `FormData` 对象，包含文件（例如，字段名为 `file`）和描述信息（例如，字段名为 `description`）。
  //   请求头: `Authorization: Bearer <token>`, `Content-Type: multipart/form-data`
  // 响应:
  //   成功状态码: `200 OK` 或 `201 Created`
  //   响应体: 预期的响应体应包含新创建的版本信息，例如：
  //     {
  //       "code": 200,
  //       "message": "新版本上传成功",
  //       "data": { "id": "new_version_id", "fileId": "file_id_abc", "version": "v1.0.2", "description": "用户上传的描述", "createTime": "2024-03-22T09:00:00Z", "size": 110000, "uploader": "current_user_id" }
  //     }
  //   错误状态码: 例如 `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `413 Payload Too Large`, `500 Internal Server Error`。
  return request({
    url: `/api/files/${fileId}/versions`,
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

/**
 * 下载特定版本的文件
 * @param {string} fileId - 文件ID
 * @param {string} versionId - 版本ID
 * @returns {Promise} 返回文件Blob
 */
export const downloadFileVersion = (fileId, versionId) => {
  // 功能: 下载指定文件ID的特定版本文件。
  // 请求:
  //   方法: GET
  //   URL: `/api/files/${fileId}/versions/${versionId}/download`
  //   参数: 无路径参数或查询参数。
  //   请求体: 无。
  //   请求头: `Authorization: Bearer <token>`, `responseType: 'blob'`
  // 响应:
  //   成功状态码: `200 OK`
  //   响应体: 文件的二进制数据 (`Blob`)。响应头通常包含 `Content-Disposition` 指定下载文件名。
  //   错误状态码: 例如 `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `500 Internal Server Error`。
  return request({
    url: `/api/files/${fileId}/versions/${versionId}/download`,
    method: 'GET',
    responseType: 'blob',
  })
}

// 以下应该不会使用，但是我可以先保留着

/**
 * 预览特定版本的文件
 * @param {string} fileId - 文件ID
 * @param {string} versionId - 版本ID
 * @returns {Promise} 返回预览URL
 */
export const previewFileVersion = (fileId, versionId) => {
  // 功能: 获取指定文件ID的特定版本文件的预览信息（例如预览URL）。
  // 请求:
  //   方法: GET
  //   URL: `/api/files/${fileId}/versions/${versionId}/preview`
  //   参数: 无路径参数或查询参数。
  //   请求体: 无。
  //   请求头: `Authorization: Bearer <token>`。
  // 响应:
  //   成功状态码: `200 OK`
  //   响应体: 包含预览URL或其他信息的 JSON 对象，例如：
  //     {
  //       "code": 200,
  //       "message": "获取预览信息成功",
  //       "data": "https://your-file-server.com/preview/version_id_x.pdf" // 预览文件的URL
  //     }
  //   错误状态码: 例如 `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `415 Unsupported Media Type`, `500 Internal Server Error`。
  return request({
    url: `/api/files/${fileId}/versions/${versionId}/preview`,
    method: 'GET',
  })
}

/**
 * 删除特定版本
 * @param {string} fileId - 文件ID
 * @param {string} versionId - 版本ID
 * @returns {Promise} 返回删除结果
 */
export const deleteFileVersion = (fileId, versionId) => {
  // 功能: 删除指定文件ID的特定版本。
  // 请求:
  //   方法: DELETE
  //   URL: `/api/files/${fileId}/versions/${versionId}`
  //   参数: 无路径参数或查询参数。
  //   请求体: 无。
  //   请求头: `Authorization: Bearer <token>`。
  // 响应:
  //   成功状态码: `200 OK`
  //   响应体: 表示操作结果的 JSON 对象，例如：
  //     {
  //       "code": 200,
  //       "message": "版本删除成功"
  //     }
  //   错误状态码: 例如 `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `409 Conflict`, `500 Internal Server Error`。
  return request({
    url: `/api/files/${fileId}/versions/${versionId}`,
    method: 'DELETE',
  })
}

/**
 * 回滚到特定版本
 * @param {string} fileId - 文件ID
 * @param {string} versionId - 版本ID
 * @returns {Promise} 返回回滚结果
 */
export const rollbackToVersion = (fileId, versionId) => {
  // 功能: 将文件回滚到指定文件ID的特定版本。
  // 请求:
  //   方法: POST
  //   URL: `/api/files/${fileId}/versions/${versionId}/rollback`
  //   参数: 无路径参数或查询参数。
  //   请求体: 无。
  //   请求头: `Authorization: Bearer <token>`。
  // 响应:
  //   成功状态码: `200 OK`
  //   响应体: 表示操作结果的 JSON 对象，例如：
  //     {
  //       "code": 200,
  //       "message": "已成功回滚到版本 v1.0.1"
  //     }
  //   错误状态码: 例如 `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `409 Conflict`, `500 Internal Server Error`。
  return request({
    url: `/api/files/${fileId}/versions/${versionId}/rollback`,
    method: 'POST',
  })
}
