<template>
  <div class="help-page">
    <!-- 左侧导航栏 -->
    <div class="help-sidebar">
      <div class="search-box">
        <el-input
          v-model="searchQuery"
          placeholder="搜索帮助文档..."
          prefix-icon="search"
          clearable
          @input="handleSearch"
        />
      </div>
      <el-menu
        class="help-menu"
        :default-active="activeSection"
        @select="handleSectionSelect"
      >
        <el-menu-item index="getting-started">
          <el-icon><guide /></el-icon>
          <span>快速开始</span>
        </el-menu-item>
        <el-menu-item index="file-management">
          <el-icon><document /></el-icon>
          <span>文件管理</span>
        </el-menu-item>
        <el-menu-item index="messages">
          <el-icon><bell /></el-icon>
          <span>消息通知</span>
        </el-menu-item>
        <el-menu-item index="account">
          <el-icon><setting /></el-icon>
          <span>账号设置</span>
        </el-menu-item>
        <el-menu-item index="faq">
          <el-icon><question-filled /></el-icon>
          <span>常见问题</span>
        </el-menu-item>
      </el-menu>
    </div>

    <!-- 右侧内容区 -->
    <div class="help-content">
      <div class="content-header">
        <h1>{{ currentSection.title }}</h1>
        <p class="section-desc">{{ currentSection.description }}</p>
      </div>

      <div class="content-body" v-loading="loading">
        <template v-if="error">
          <el-result
            icon="error"
            :title="error"
            sub-title="请稍后重试或联系管理员"
          >
            <template #extra>
              <el-button type="primary" @click="retryLoad">重新加载</el-button>
            </template>
          </el-result>
        </template>
        <template v-else>
          <div class="article-content" v-html="currentSection.content"></div>

          <!-- 文档反馈 -->
          <div class="feedback-section">
            <h3>这篇文档对您有帮助吗？</h3>
            <div class="feedback-buttons">
              <el-button type="primary" plain size="small" @click="submitFeedback(true)">
                <el-icon><circle-check-filled /></el-icon> 有帮助
              </el-button>
              <el-button type="info" plain size="small" @click="submitFeedback(false)">
                <el-icon><circle-close-filled /></el-icon> 没帮助
              </el-button>
            </div>
          </div>

          <!-- 相关文档 -->
          <div class="related-articles">
            <h3>相关文档</h3>
            <ul>
              <li v-for="article in currentSection.relatedArticles" :key="article.id">
                <a href="javascript:;" @click="handleSectionSelect(article.section)">
                  {{ article.title }}
                </a>
              </li>
            </ul>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  Guide,
  Document,
  Bell,
  Setting,
  QuestionFilled,
  CircleCheckFilled,
  CircleCloseFilled
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const route = useRoute()

const searchQuery = ref('')
const activeSection = ref('getting-started')
const loading = ref(false)
const error = ref('')

// 帮助文档内容
const helpContent = reactive({
  'getting-started': {
    title: '快速开始',
    description: '了解如何开始使用我们的文件共享平台',
    content: `
      <h2>欢迎使用文件共享平台</h2>
      <p>本平台旨在为学生提供一个便捷的文件共享和学习交流空间。以下是使用平台的基本步骤：</p>

      <h3>1. 注册和登录</h3>
      <ul>
        <li>使用学校邮箱注册账号</li>
        <li>验证邮箱后即可登录</li>
        <li>首次登录建议完善个人资料</li>
      </ul>

      <h3>2. 浏览和下载文件</h3>
      <ul>
        <li>在首页查看最新上传的文件</li>
        <li>使用搜索功能查找特定文件</li>
        <li>点击文件名称查看详情</li>
        <li>支持在线预览和下载</li>
      </ul>

      <h3>3. 上传和分享</h3>
      <ul>
        <li>点击"上传"按钮添加文件</li>
        <li>填写文件描述和标签</li>
        <li>选择是否公开分享</li>
        <li>获取分享链接</li>
      </ul>

      <h3>4. 互动功能</h3>
      <ul>
        <li>收藏感兴趣的文件</li>
        <li>评论和讨论</li>
        <li>关注其他用户</li>
        <li>接收消息通知</li>
      </ul>
    `,
    relatedArticles: [
      { id: 1, title: '如何上传文件？', section: 'file-management' },
      { id: 2, title: '消息通知设置', section: 'messages' },
      { id: 3, title: '账号安全建议', section: 'account' }
    ]
  },
  'file-management': {
    title: '文件管理',
    description: '学习如何管理您的文件，包括上传、组织和分享',
    content: `
      <h2>文件管理指南</h2>

      <h3>文件上传</h3>
      <p>支持以下上传方式：</p>
      <ul>
        <li>普通上传（小于100MB）</li>
        <li>分片上传（大文件）</li>
        <li>文件夹上传</li>
        <li>拖拽上传</li>
      </ul>

      <h3>文件组织</h3>
      <p>有效的文件组织方式：</p>
      <ul>
        <li>创建文件夹</li>
        <li>添加标签</li>
        <li>设置分类</li>
        <li>使用收藏夹</li>
      </ul>

      <h3>文件分享</h3>
      <p>分享选项：</p>
      <ul>
        <li>公开分享</li>
        <li>私密分享</li>
        <li>限时分享</li>
        <li>密码保护</li>
      </ul>

      <h3>文件安全</h3>
      <p>保护您的文件：</p>
      <ul>
        <li>访问权限控制</li>
        <li>加密存储</li>
        <li>版本管理</li>
        <li>操作日志</li>
      </ul>
    `,
    relatedArticles: [
      { id: 4, title: '大文件上传指南', section: 'file-management' },
      { id: 5, title: '文件分享设置', section: 'file-management' },
      { id: 6, title: '文件安全最佳实践', section: 'account' }
    ]
  },
  'messages': {
    title: '消息通知',
    description: '了解平台的消息通知系统和设置选项',
    content: `
      <h2>消息通知指南</h2>

      <h3>消息类型</h3>
      <ul>
        <li>系统通知</li>
        <li>互动消息</li>
        <li>分享通知</li>
        <li>评论回复</li>
      </ul>

      <h3>通知设置</h3>
      <p>可以自定义以下通知：</p>
      <ul>
        <li>邮件通知</li>
        <li>站内信</li>
        <li>浏览器推送</li>
        <li>消息提醒声音</li>
      </ul>

      <h3>消息管理</h3>
      <p>管理您的消息：</p>
      <ul>
        <li>标记已读/未读</li>
        <li>消息归档</li>
        <li>消息过滤</li>
        <li>批量操作</li>
      </ul>
    `,
    relatedArticles: [
      { id: 7, title: '通知设置指南', section: 'messages' },
      { id: 8, title: '如何管理消息', section: 'messages' },
      { id: 9, title: '消息安全设置', section: 'account' }
    ]
  },
  'account': {
    title: '账号设置',
    description: '管理您的账号设置和安全选项',
    content: `
      <h2>账号管理指南</h2>

      <h3>基本设置</h3>
      <ul>
        <li>个人资料修改</li>
        <li>头像设置</li>
        <li>联系方式更新</li>
        <li>偏好设置</li>
      </ul>

      <h3>安全设置</h3>
      <ul>
        <li>密码修改</li>
        <li>双因素认证</li>
        <li>登录设备管理</li>
        <li>访问日志查看</li>
      </ul>

      <h3>隐私设置</h3>
      <ul>
        <li>个人信息可见性</li>
        <li>文件默认权限</li>
        <li>消息接收设置</li>
        <li>数据导出</li>
      </ul>
    `,
    relatedArticles: [
      { id: 10, title: '如何启用双因素认证', section: 'account' },
      { id: 11, title: '账号安全最佳实践', section: 'account' },
      { id: 12, title: '隐私设置指南', section: 'account' }
    ]
  },
  'faq': {
    title: '常见问题',
    description: '查找常见问题的解答和解决方案',
    content: `
      <h2>常见问题解答</h2>

      <h3>1. 上传问题</h3>
      <div class="qa-item">
        <p class="question">Q: 上传文件大小有限制吗？</p>
        <p class="answer">A: 单个文件上传限制为1GB，超过此大小需要使用分片上传功能。</p>
      </div>

      <div class="qa-item">
        <p class="question">Q: 为什么我的文件上传失败了？</p>
        <p class="answer">A: 常见原因包括：网络不稳定、文件损坏、格式不支持等。建议检查网络连接并重试。</p>
      </div>

      <h3>2. 账号问题</h3>
      <div class="qa-item">
        <p class="question">Q: 忘记密码怎么办？</p>
        <p class="answer">A: 可以通过绑定的邮箱进行密码重置，或联系管理员协助处理。</p>
      </div>

      <div class="qa-item">
        <p class="question">Q: 如何修改邮箱？</p>
        <p class="answer">A: 在账号设置中可以更新邮箱，需要验证新邮箱后才能生效。</p>
      </div>

      <h3>3. 分享问题</h3>
      <div class="qa-item">
        <p class="question">Q: 如何设置文件访问权限？</p>
        <p class="answer">A: 在文件详情页面可以设置访问权限，包括公开、私密和密码访问等选项。</p>
      </div>

      <div class="qa-item">
        <p class="question">Q: 分享链接有效期多久？</p>
        <p class="answer">A: 默认永久有效，但可以在分享时设置有效期限。</p>
      </div>
    `,
    relatedArticles: [
      { id: 13, title: '文件上传故障排除', section: 'file-management' },
      { id: 14, title: '账号问题解决', section: 'account' },
      { id: 15, title: '分享设置指南', section: 'file-management' }
    ]
  }
})

// 当前选中的文档内容
const currentSection = computed(() => {
  return helpContent[activeSection.value] || helpContent['getting-started']
})

// 处理搜索
const handleSearch = () => {
  // TODO: 实现搜索功能
  console.log('Searching for:', searchQuery.value)
}

// 切换文档章节
const handleSectionSelect = (section) => {
  activeSection.value = section
  // 更新URL，但不重新加载页面
  window.history.pushState(
    {},
    '',
    `/help?section=${section}`
  )
  // 滚动到顶部
  document.querySelector('.help-content')?.scrollTo(0, 0)
}

// 提交反馈
const submitFeedback = (isHelpful) => {
  // TODO: 提交反馈到后端
  ElMessage.success(isHelpful ? '感谢您的反馈！' : '感谢您的反馈，我们会继续改进')
}

// 重试加载
const retryLoad = () => {
  loading.value = true
  // TODO: 重新加载数据
  setTimeout(() => {
    loading.value = false
  }, 1000)
}

onMounted(() => {
  // 如果URL中有指定章节，则切换到该章节
  const section = route.query.section
  if (section && helpContent[section]) {
    activeSection.value = section
  }
})
</script>

<style lang="scss" scoped>
.help-page {
  display: flex;
  height: calc(100vh - 60px);
  background: #fff;

  .help-sidebar {
    width: 260px;
    border-right: 1px solid #e5e7eb;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;

    .search-box {
      padding: 16px;
      border-bottom: 1px solid #e5e7eb;
    }

    .help-menu {
      flex: 1;
      border-right: none;
    }
  }

  .help-content {
    flex: 1;
    min-width: 0;
    padding: 24px 32px;
    overflow-y: auto;

    .content-header {
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid #e5e7eb;

      h1 {
        font-size: 24px;
        font-weight: 600;
        color: #1f2937;
        margin: 0 0 8px;
      }

      .section-desc {
        font-size: 14px;
        color: #6b7280;
        margin: 0;
      }
    }

    .content-body {
      max-width: 800px;
      margin: 0 auto;

      .article-content {
        font-size: 14px;
        line-height: 1.6;
        color: #374151;

        h2 {
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
          margin: 32px 0 16px;

          &:first-child {
            margin-top: 0;
          }
        }

        h3 {
          font-size: 16px;
          font-weight: 600;
          color: #374151;
          margin: 24px 0 12px;
        }

        p {
          margin: 12px 0;
        }

        ul {
          margin: 12px 0;
          padding-left: 20px;

          li {
            margin: 8px 0;
          }
        }

        .qa-item {
          margin: 16px 0;
          padding: 16px;
          background: #f9fafb;
          border-radius: 4px;

          .question {
            font-weight: 500;
            color: #1f2937;
            margin: 0 0 8px;
          }

          .answer {
            color: #4b5563;
            margin: 0;
          }
        }
      }

      .feedback-section {
        margin-top: 48px;
        padding-top: 24px;
        border-top: 1px solid #e5e7eb;
        text-align: center;

        h3 {
          font-size: 16px;
          font-weight: 500;
          color: #374151;
          margin: 0 0 16px;
        }

        .feedback-buttons {
          display: flex;
          gap: 16px;
          justify-content: center;
        }
      }

      .related-articles {
        margin-top: 48px;
        padding-top: 24px;
        border-top: 1px solid #e5e7eb;

        h3 {
          font-size: 16px;
          font-weight: 500;
          color: #374151;
          margin: 0 0 16px;
        }

        ul {
          list-style: none;
          padding: 0;
          margin: 0;

          li {
            margin: 8px 0;

            a {
              color: #2563eb;
              text-decoration: none;

              &:hover {
                text-decoration: underline;
              }
            }
          }
        }
      }
    }
  }
}

:deep(*) {
  scrollbar-width: thin;
  scrollbar-color: #dcdfe6 transparent;

  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #dcdfe6;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
}
</style>
