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
      <el-tooltip content="夜间模式" placement="bottom"
        ><el-icon class="icon-btn"><moon /></el-icon
      ></el-tooltip>
      <el-tooltip content="消息中心" placement="bottom"
        ><el-icon class="icon-btn"><message /></el-icon
      ></el-tooltip>
      <el-tooltip content="设置" placement="bottom"
        ><el-icon class="icon-btn"><setting /></el-icon
      ></el-tooltip>
      <el-avatar size="small" src="https://via.placeholder.com/40x40" class="avatar" />
    </div>
  </el-header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Moon, Message, Setting } from '@element-plus/icons-vue'

const router = useRouter()
const searchQuery = ref('')

const handleSearch = () => {
  if (searchQuery.value) {
    router.push({ name: 'SearchResult', query: { q: searchQuery.value } })
  }
}
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
    }
  }
}
</style>
