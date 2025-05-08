import request from '@/utils/http'

// 获取所有部门及其课程信息
export function getDepartmentsWithCourses() {
  return request({
    url: '/api/departments',
    method: 'get',
  })
}

// 获取单个部门的课程信息
export function getDepartmentCourses(departmentId) {
  return request({
    url: `/api/departments/${departmentId}/courses`,
    method: 'get',
  })
}
