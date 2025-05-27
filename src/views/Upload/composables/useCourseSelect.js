import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { getDepartmentsWithCourses } from '@/apis/department'

export function useCourseSelect() {
  const courseOptions = ref([])
  const courseLoading = ref(false)
  const searchKeyword = ref('')

  // 根据关键词筛选课程
  const filteredCourses = computed(() => {
    if (!searchKeyword.value) {
      return courseOptions.value
    }
    const keyword = searchKeyword.value.toLowerCase()
    return courseOptions.value.filter(
      (course) =>
        course.name.toLowerCase().includes(keyword) ||
        course.department.toLowerCase().includes(keyword),
    )
  })

  // 处理课程搜索
  const handleCourseSearch = (query) => {
    searchKeyword.value = query
  }

  // 获取课程列表
  const fetchCourses = async () => {
    courseLoading.value = true
    try {
      const { data } = await getDepartmentsWithCourses()

      // 将所有部门的课程合并到一个数组中
      const allCourses = data.reduce((acc, dept) => {
        const courses = dept.courses.map((course) => ({
          id: course.id,
          name: course.title,
          department: dept.name,
        }))
        return [...acc, ...courses]
      }, [])

      courseOptions.value = allCourses
    } catch (error) {
      console.error('获取课程列表失败：', error)
      ElMessage.error('获取课程列表失败')
    } finally {
      courseLoading.value = false
    }
  }

  return {
    courseOptions,
    courseLoading,
    searchKeyword,
    filteredCourses,
    handleCourseSearch,
    fetchCourses,
  }
}
