<template>
  <el-header class="header">
    <div class="header-left">
      <span class="welcome">👋 欢迎使用Firework！</span>
    </div>
    <div class="header-center">
      <el-input
        v-model="searchQuery"
        placeholder="搜索..."
        class="search-input"
        clearable
        @keyup.enter="handleSearch"
      >
        <template #suffix>
          <el-icon class="search-icon" @click="handleSearch"><search /></el-icon>
        </template>
      </el-input>
    </div>
    <div class="header-right">
      <el-tooltip content="帮助文档" placement="bottom">
        <el-icon class="icon-btn" @click="goToHelpCenter"><question-filled /></el-icon>
      </el-tooltip>
      <el-tooltip content="消息中心" placement="bottom">
        <el-badge :value="unreadCount" :hidden="!unreadCount">
          <el-icon class="icon-btn" @click="goToMessageCenter"><message /></el-icon>
        </el-badge>
      </el-tooltip>
      <el-tooltip content="设置" placement="bottom">
        <el-icon class="icon-btn"><setting /></el-icon>
      </el-tooltip>
      <el-dropdown trigger="hover" @command="handleCommand">
        <el-avatar
          size="small"
          :src="authStore.userInfo?.avatar || 'https://via.placeholder.com/40x40'"
          class="avatar"
        />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">
              <el-icon><user /></el-icon>
              个人中心
            </el-dropdown-item>
            <el-dropdown-item command="settings">
              <el-icon><setting /></el-icon>
              账号设置
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <el-icon><switch-button /></el-icon>
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Message, Setting, User, SwitchButton, QuestionFilled } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'
import { ElMessageBox } from 'element-plus'
import { useMessageStore } from '@/stores/message'

const router = useRouter()
const authStore = useAuthStore()
const messageStore = useMessageStore()
const searchQuery = ref('')
const unreadCount = ref(0)

const handleSearch = () => {
  if (searchQuery.value) {
    router.push({
      name: 'FileSearch',
      query: { keyword: searchQuery.value },
    })
  }
}

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
        await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        authStore.logout()
      } catch {
        // 用户取消操作
      }
      break
  }
}

// 跳转到帮助中心
const goToHelpCenter = () => {
  router.push({ name: 'HelpCenter' })
}

// 跳转到消息中心
const goToMessageCenter = () => {
  router.push('/message')
}

// 更新未读消息数量
const updateUnreadCount = () => {
  unreadCount.value = messageStore.unreadCount
}

onMounted(async () => {
  // 初始化加载消息
  await messageStore.loadMessages()
  updateUnreadCount()

  // 监听未读消息更新事件
  window.addEventListener('unread-messages-updated', updateUnreadCount)
})

onUnmounted(() => {
  window.removeEventListener('unread-messages-updated', updateUnreadCount)
})
</script>

<style lang="scss" scoped>
.header {
  padding: 0 32px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  box-shadow: 0 2px 8px #f0f1f2;
  .header-left {
    display: flex;
    align-items: center;
    gap: 24px;

    .welcome {
      font-size: 16px;
      color: #222;
      display: flex;
      align-items: center;
      gap: 4px;
      b {
        color: #222;
      }
    }
  }
  .header-center {
    flex: 1;
    display: flex;
    justify-content: center;
    .search-input {
      width: 340px;
      border-radius: 12px;
      box-shadow: 0 2px 8px #f0f1f2;
      .el-input__wrapper {
        border-radius: 12px;
      }
      .search-icon {
        cursor: pointer;
      }
    }
  }
  .header-right {
    display: flex;
    align-items: center;
    gap: 18px;
    .icon-btn {
      font-size: 22px;
      color: #b0b3b8;
      cursor: pointer;
      transition: color 0.2s;
      &:hover {
        color: #409eff;
      }
    }
    .avatar {
      margin-left: 6px;
      border: 2px solid #f0f1f2;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        transform: scale(1.05);
        border-color: #409eff;
      }
    }
  }
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;

  .el-icon {
    font-size: 16px;
  }
}

.icon-btn {
  font-size: 20px;
  cursor: pointer;
  color: #606266;
  transition: color 0.2s;

  &:hover {
    color: #409eff;
  }
}
</style>
