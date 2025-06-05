<template>
  <div class="home-container">
    <div class="main-content">
      <!-- 欢迎横幅 -->
      <div class="welcome-banner">
        <h1>👋 欢迎使用Firework!</h1>
      </div>

      <!-- 学院列表 -->
      <div v-loading="courseStore.isLoading">
        <div v-if="courseStore.error" class="error-message">
          {{ courseStore.error }}
          <el-button type="primary" @click="fetchData">重试</el-button>
        </div>

        <template v-else>
          <!-- 计算机学院 -->
          <div class="college-section">
            <h2 class="college-title">计算机学院</h2>
            <div class="course-grid">
              <div v-for="i in 8" :key="i" class="course-card" @click="navigateToCourse({
                id: `course-${i}`,
                name: 'Python编程入门',
                path: `/course/course-${i}`
              })">
                <div class="course-icon">
                  <span class="icon-placeholder">P</span>
                </div>
                <div class="course-info">
                  <h3 class="course-name">Python编程入门</h3>
                  <p class="course-desc">学习Python编程的基础，帮助入门编程。</p>
                  <div class="course-meta">
                    <span class="update-time">最后修改日期: 2023/11/01</span>
                  </div>
                </div>
              </div>
              <div class="course-card view-more">
                <div class="view-more-content">
                  <el-icon><More /></el-icon>
                  <span>查看更多</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 自动化学院 -->
          <div class="college-section">
            <h2 class="college-title">自动化学院</h2>
            <div class="course-grid">
              <div v-for="i in 8" :key="i" class="course-card" @click="navigateToCourse({
                id: `course-${i}`,
                name: 'Python编程入门',
                path: `/course/course-${i}`
              })">
                <div class="course-icon">
                  <span class="icon-placeholder">P</span>
                </div>
                <div class="course-info">
                  <h3 class="course-name">Python编程入门</h3>
                  <p class="course-desc">学习Python编程的基础，帮助入门编程。</p>
                  <div class="course-meta">
                    <span class="update-time">最后修改日期: 2023/11/01</span>
                  </div>
                </div>
              </div>
              <div class="course-card view-more">
                <div class="view-more-content">
                  <el-icon><More /></el-icon>
                  <span>查看更多</span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- 右侧边栏 -->
    <div class="sidebar">
      <div class="sidebar-section">
        <h3 class="sidebar-title">消息中心</h3>
        <div class="message-list">
          <div v-for="msg in recentMessages" :key="msg.id" class="message-item">
            <div class="message-tag" :class="msg.type">{{ msg.type }}</div>
            <div class="message-content">{{ msg.content }}</div>
          </div>
          <div v-if="!recentMessages.length" class="empty-message">
            暂无消息
          </div>
        </div>
      </div>

      <div class="sidebar-section">
        <h3 class="sidebar-title">上次浏览</h3>
        <div class="recent-list">
          <div v-for="item in courseStore.recentViewed"
               :key="item.id"
               class="recent-item"
               @click="router.push(item.path)">
            <el-icon><Document /></el-icon>
            <span>{{ item.name }}</span>
          </div>
          <div v-if="!courseStore.recentViewed.length" class="empty-message">
            暂无浏览记录
          </div>
        </div>
      </div>

      <div class="sidebar-section">
        <h3 class="sidebar-title">快速导航</h3>
        <div class="quick-nav">
          <el-button v-for="nav in quickNavs"
                     :key="nav.id"
                     @click="router.push(nav.path)">
            {{ nav.name }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Document, More } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useCourseStore } from '@/stores/course'

const router = useRouter()
const courseStore = useCourseStore()

// 最近消息
const recentMessages = ref([
  {
    id: 1,
    type: '活动',
    content: '新课程上线通知：Python高级编程课程已开放'
  },
  {
    id: 2,
    type: '通知',
    content: '系统维护通知：本周六凌晨2-4点进行系统升级'
  },
  {
    id: 3,
    type: '活动',
    content: '课程更新：Java编程基础课程内容已更新'
  },
  {
    id: 4,
    type: '通知',
    content: '作业提醒：软件工程课程作业截止日期为本周五'
  },
  {
    id: 5,
    type: '活动',
    content: '在线讲座：区块链技术与应用，本周四晚8点'
  }
])

// 快速导航
const quickNavs = ref([
  { id: 1, name: '产品新闻', path: '/news' },
  { id: 2, name: '使用指南', path: '/guide' },
  { id: 3, name: '提交反馈', path: '/feedback' },
  { id: 4, name: '端口文档', path: '/docs' }
])

// 获取数据
const fetchData = async () => {
  try {
    await Promise.all([
      courseStore.fetchColleges(),
      courseStore.fetchRecentViewed()
    ])
  } catch (error) {
    console.error('获取数据失败:', error)
    ElMessage.error('获取数据失败，请稍后重试')
  }
}

// 导航到课程
const navigateToCourse = (course) => {
  courseStore.addRecentViewed(course)
  router.push(course.path)
}

onMounted(() => {
  // 从本地存储加载最近浏览记录
  courseStore.loadRecentViewedFromLocal()
  // 获取最新数据
  fetchData()
})
</script>

<style lang="scss" scoped>
.home-container {
  display: flex;
  gap: 24px;
  padding: 24px;
  max-width: 1440px;
  margin: 0 auto;
  min-height: calc(100vh - 60px);
  background-color: #f5f7fa;
}

.main-content {
  flex: 1;
  min-width: 0;
}

.welcome-banner {
  background: linear-gradient(135deg, #f0f9ff 0%, #e6f4ff 100%);
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 24px;
  border: 1px solid #e6f4ff;

  h1 {
    margin: 0;
    font-size: 24px;
    color: #1677ff;
  }
}

.college-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
  border: 1px solid #e5e7eb;

  .college-title {
    font-size: 18px;
    font-weight: 500;
    margin: 0 0 16px 0;
    color: #1f2937;
    padding-left: 8px;
    border-left: 4px solid #1677ff;
  }
}

.course-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.course-card {
  display: flex;
  padding: 16px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: #1677ff;
  }

  .course-icon {
    width: 48px;
    height: 48px;
    margin-right: 16px;
    flex-shrink: 0;

    .icon-placeholder {
      width: 100%;
      height: 100%;
      background: #f0f9ff;
      color: #1677ff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      font-weight: 500;
      border-radius: 8px;
    }
  }

  .course-info {
    flex: 1;
    min-width: 0;

    .course-name {
      margin: 0 0 8px 0;
      font-size: 16px;
      font-weight: 500;
      color: #1f2937;
    }

    .course-desc {
      margin: 0 0 8px 0;
      font-size: 14px;
      color: #6b7280;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .course-meta {
      font-size: 12px;
      color: #9ca3af;
    }
  }

  &.view-more {
    justify-content: center;
    align-items: center;
    background: #f9fafb;
    border: 1px dashed #e5e7eb;

    .view-more-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      color: #6b7280;

      .el-icon {
        font-size: 24px;
      }
    }

    &:hover {
      background: #f3f4f6;
      border-color: #1677ff;
      color: #1677ff;

      .view-more-content {
        color: #1677ff;
      }
    }
  }
}

.sidebar {
  width: 300px;
  flex-shrink: 0;

  .sidebar-section {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;

    .sidebar-title {
      margin: 0 0 16px 0;
      font-size: 16px;
      font-weight: 500;
      color: #1f2937;
      padding-left: 8px;
      border-left: 4px solid #1677ff;
    }
  }

  .message-list {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .message-item {
      display: flex;
      gap: 8px;
      font-size: 14px;

      .message-tag {
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;

        &.活动 {
          background: #f0f9ff;
          color: #1677ff;
        }

        &.通知 {
          background: #f0f5ff;
          color: #2f54eb;
        }
      }

      .message-content {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #6b7280;
      }
    }
  }

  .recent-list {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .recent-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px;
      border-radius: 4px;
      cursor: pointer;
      color: #6b7280;
      transition: all 0.3s ease;

      &:hover {
        background: #f3f4f6;
        color: #1f2937;
      }

      .el-icon {
        font-size: 16px;
      }
    }
  }

  .quick-nav {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;

    .el-button {
      width: 100%;
    }
  }

  .empty-message {
    text-align: center;
    color: #9ca3af;
    padding: 16px;
    font-size: 14px;
  }
}

.error-message {
  text-align: center;
  padding: 40px;
  color: #6b7280;
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;

  .el-button {
    margin-top: 16px;
  }
}

@media (max-width: 1200px) {
  .home-container {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
  }
}

@media (max-width: 640px) {
  .home-container {
    padding: 16px;
  }

  .course-grid {
    grid-template-columns: 1fr;
  }

  .welcome-banner {
    padding: 16px;

    h1 {
      font-size: 20px;
    }
  }
}
</style>
