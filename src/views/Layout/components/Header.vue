<template>
  <el-header class="header" height="60px">
    <div class="header-left">
      <div class="welcome-text">
        <el-icon><Present /></el-icon>
        <span>欢迎使用Firework!</span>
      </div>
    </div>

    <div class="header-search">
      <el-input
        v-model="searchQuery"
        placeholder="搜索课程、文档、问题..."
        :prefix-icon="Search"
        clearable
        @keyup.enter="handleSearch"
        @clear="handleClear"
      >
        <template #append>
          <el-button :icon="Search" @click="handleSearch">
          </el-button>
        </template>
      </el-input>
    </div>

    <div class="header-right">
      <!-- 主题切换 -->
      <el-tooltip :content="isDark ? '日间模式' : '夜间模式'" placement="bottom">
        <div class="icon-btn" @click="toggleTheme">
          <el-icon><Moon v-if="!isDark" /><Sunny v-else /></el-icon>
        </div>
      </el-tooltip>

      <!-- 消息中心 -->
      <el-tooltip content="消息中心" placement="bottom">
        <el-badge :value="unreadCount" :hidden="!unreadCount">
          <div class="icon-btn" @click="router.push({ name: 'Messages' })">
            <el-icon><Message /></el-icon>
          </div>
        </el-badge>
      </el-tooltip>

      <!-- 设置按钮 -->
      <el-tooltip content="设置" placement="bottom">
        <div class="icon-btn" @click="router.push('/settings')">
          <el-icon><Setting /></el-icon>
        </div>
      </el-tooltip>

      <!-- 用户头像下拉菜单 -->
      <el-dropdown trigger="hover" @command="handleCommand">
        <div class="avatar-wrapper">
          <el-avatar
            :size="32"
            :src="userStore.avatarUrl"
            :class="{ 'loading': userStore.isLoading }"
          />
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">
              <el-icon><User /></el-icon>
              个人中心
            </el-dropdown-item>
            <el-dropdown-item command="settings">
              <el-icon><Setting /></el-icon>
              账号设置
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <el-icon><SwitchButton /></el-icon>
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import {
  Message,
  Setting,
  User,
  SwitchButton,
  Moon,
  Sunny,
  Search,
  Present
} from '@element-plus/icons-vue'

const router = useRouter()
const themeStore = useThemeStore()
const userStore = useUserStore()

// 搜索相关
const searchQuery = ref('')
const handleSearch = () => {
  const query = searchQuery.value.trim()
  if (!query) {
    ElMessage.warning('请输入搜索内容')
    return
  }

  // 记录搜索历史
  const searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]')
  searchHistory.unshift({
    query,
    time: new Date().toISOString()
  })
  // 限制历史记录数量
  if (searchHistory.length > 10) {
    searchHistory.pop()
  }
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory))

  // 跳转到搜索结果页
  router.push({
    name: 'Search',
    query: {
      q: query,
      type: 'all' // 默认搜索所有类型
    }
  })
}

const handleClear = () => {
  searchQuery.value = ''
}

// 未读消息数量
const unreadCount = ref(0)

// 获取未读消息数量
const fetchUnreadCount = async () => {
  try {
    // 尝试从本地存储获取消息数据
    const localMessages = JSON.parse(localStorage.getItem('messages') || '[]')
    const unreadMessages = localMessages.filter(msg => !msg.read)
    unreadCount.value = unreadMessages.length

    // 尝试从服务器获取数据
    const response = await fetch('/api/messages/unread/count')
    if (response.ok) {
      const data = await response.json()
      unreadCount.value = data.count
      return
    }
  } catch (error) {
    console.warn('获取未读消息数量失败，使用本地数据:', error)
  }
}

// 主题相关
const isDark = computed(() => themeStore.isDark)
const toggleTheme = () => {
  themeStore.toggleTheme()
}

// 下拉菜单处理
const handleCommand = async (command) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'settings':
      router.push('/settings')
      break
    case 'logout':
      try {
        const response = await fetch('/api/auth/logout', { method: 'POST' })
        if (!response.ok) throw new Error('退出登录失败')
        userStore.clearUserInfo()
        router.push('/login')
      } catch (error) {
        console.error('退出登录失败:', error)
        ElMessage.error('退出登录失败，请稍后重试')
      }
      break
  }
}

onMounted(() => {
  // 初始化本地消息数据
  if (!localStorage.getItem('messages')) {
    const mockMessages = [
      {
        id: 1,
        type: '活动',
        content: '新的课程评价活动开始啦！参与即可获得积分奖励',
        read: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString()
      },
      {
        id: 2,
        type: '通知',
        content: '您的课程《软件工程导论》有新的学生提问',
        read: true,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
      },
      {
        id: 3,
        type: '系统',
        content: '系统将于今晚22:00进行例行维护，请提前保存您的工作',
        read: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
      }
    ]
    localStorage.setItem('messages', JSON.stringify(mockMessages))
  }

  userStore.initUserInfo()
  fetchUnreadCount()
  window.addEventListener('unread-messages-updated', fetchUnreadCount)
})

onUnmounted(() => {
  window.removeEventListener('unread-messages-updated', fetchUnreadCount)
})
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  gap: 24px;

  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;
    min-width: 200px;

    .logo-section {
      .logo-link {
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: 8px;

        .site-name {
          font-size: 20px;
          font-weight: 600;
          color: var(--color-primary);
          margin: 0;
        }
      }
    }

    .welcome-text {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--text-secondary);
      font-size: 14px;

      .el-icon {
        color: #ffd700;
      }
    }
  }

  .header-search {
    flex: 1;
    max-width: 600px;
    margin: 0 auto;

    :deep(.el-input) {
      --el-input-bg-color: var(--bg-secondary);

      .el-input__wrapper {
        box-shadow: 0 0 0 1px var(--border-color) !important;
        background-color: var(--bg-secondary);
        padding-right: 0;

        &:hover {
          box-shadow: 0 0 0 1px var(--color-primary-light-3) !important;
        }

        &.is-focus {
          box-shadow: 0 0 0 1px var(--color-primary) !important;
        }
      }

      .el-input__inner {
        height: 36px;
        font-size: 14px;
        color: var(--text-primary);

        &::placeholder {
          color: var(--text-tertiary);
        }
      }

      .el-input-group__append {
        padding: 0;
        background-color: transparent;
        border: none;

        .el-button {
          margin: 0;
          border: none;
          height: 36px;
          padding: 8px 16px;
          border-radius: 0 4px 4px 0;
          background-color: var(--color-primary-light-9);
          color: var(--color-primary);
          min-width: 80px;

          &:hover {
            background-color: var(--color-primary-light-8);
          }

          &:active {
            background-color: var(--color-primary-light-7);
          }

          .el-icon {
            margin-right: 4px;
            font-size: 16px;
          }
        }
      }

      .el-input__prefix {
        color: var(--text-tertiary);
      }
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 8px;

    .icon-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 4px;
      cursor: pointer;
      color: var(--text-secondary);
      transition: all 0.3s ease;

      &:hover {
        background: var(--bg-secondary);
        color: var(--text-primary);
      }

      .el-icon {
        font-size: 18px;
      }
    }

    .avatar-wrapper {
      cursor: pointer;
      margin-left: 8px;

      .el-avatar {
        border: 2px solid transparent;
        transition: all 0.3s ease;

        &:hover {
          border-color: var(--color-primary-light-3);
        }

        &.loading {
          opacity: 0.7;
        }
      }
    }
  }
}

:deep(.el-dropdown-menu) {
  .el-dropdown-menu__item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;

    .el-icon {
      margin-right: 4px;
    }
  }
}

:deep(.el-badge__content) {
  z-index: 1;
}
</style>
