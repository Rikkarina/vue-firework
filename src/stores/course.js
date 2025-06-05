import { defineStore } from 'pinia'
import request from '@/utils/request'

export const useCourseStore = defineStore('course', {
  state: () => ({
    colleges: [],
    recentViewed: [],
    isLoading: false,
    error: null
  }),

  getters: {
    // 获取所有课程
    allCourses: (state) => {
      return state.colleges.reduce((courses, college) => {
        return [...courses, ...college.courses]
      }, [])
    },

    // 按学院分组的课程
    coursesByCollege: (state) => {
      return state.colleges.reduce((acc, college) => {
        acc[college.id] = college.courses
        return acc
      }, {})
    }
  },

  actions: {
    // 获取所有学院和课程数据
    async fetchColleges() {
      this.isLoading = true
      this.error = null

      try {
        const response = await request({
          url: '/colleges',
          method: 'get'
        })

        this.colleges = response.data.map(college => ({
          ...college,
          showAll: false // 控制是否显示全部课程
        }))
      } catch (error) {
        console.error('获取学院数据失败:', error)
        this.error = '获取数据失败，请稍后重试'

        // 使用模拟数据（临时方案）
        this.colleges = [
          {
            id: 1,
            name: '计算机学院',
            showAll: false,
            courses: Array(12).fill(null).map((_, i) => ({
              id: `cs-${i + 1}`,
              name: 'Python编程入门',
              description: '学习Python编程的基础，帮助入门编程。',
              lastModified: '2023/11/01',
              icon: 'P'
            }))
          },
          {
            id: 2,
            name: '自动化学院',
            showAll: false,
            courses: Array(12).fill(null).map((_, i) => ({
              id: `auto-${i + 1}`,
              name: 'Python编程入门',
              description: '学习Python编程的基础，帮助入门编程。',
              lastModified: '2023/11/01',
              icon: 'P'
            }))
          }
        ]
      } finally {
        this.isLoading = false
      }
    },

    // 获取最近浏览的课程
    async fetchRecentViewed() {
      try {
        const response = await request({
          url: '/user/recent-viewed',
          method: 'get'
        })

        this.recentViewed = response.data
      } catch (error) {
        console.error('获取最近浏览记录失败:', error)
        // 使用模拟数据
        this.recentViewed = [
          {
            id: 1,
            name: 'Python基础教程',
            path: '/course/python-basic'
          },
          {
            id: 2,
            name: 'Java编程入门',
            path: '/course/java-basic'
          }
        ]
      }
    },

    // 添加最近浏览记录
    addRecentViewed(course) {
      // 移除已存在的相同课程
      this.recentViewed = this.recentViewed.filter(item => item.id !== course.id)

      // 添加到开头
      this.recentViewed.unshift({
        id: course.id,
        name: course.name,
        path: `/course/${course.id}`
      })

      // 限制最多显示5条
      if (this.recentViewed.length > 5) {
        this.recentViewed.pop()
      }

      // 保存到本地存储
      this.saveRecentViewedToLocal()
    },

    // 保存最近浏览记录到本地存储
    saveRecentViewedToLocal() {
      try {
        localStorage.setItem('recentViewed', JSON.stringify(this.recentViewed))
      } catch (error) {
        console.error('保存最近浏览记录失败:', error)
      }
    },

    // 从本地存储加载最近浏览记录
    loadRecentViewedFromLocal() {
      try {
        const saved = localStorage.getItem('recentViewed')
        if (saved) {
          this.recentViewed = JSON.parse(saved)
        }
      } catch (error) {
        console.error('加载最近浏览记录失败:', error)
      }
    },

    // 切换学院的展开状态
    toggleCollegeExpand(collegeId) {
      const college = this.colleges.find(c => c.id === collegeId)
      if (college) {
        college.showAll = !college.showAll
      }
    }
  }
})
