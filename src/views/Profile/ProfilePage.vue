<template>
  <div class="profile-page">
    <div class="profile-header">
      <div class="user-info">
        <el-avatar
          :size="100"
          :src="userInfo.avatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'"
        />
        <div class="user-details">
          <h1>{{ userInfo.name }}</h1>
          <p class="user-role">{{ userInfo.role }}</p>
        </div>
      </div>
    </div>

    <div class="profile-content">
      <el-tabs v-model="activeTab" class="profile-tabs">
        <el-tab-pane label="基本信息" name="basic">
          <el-form
            ref="formRef"
            :model="userInfo"
            :rules="rules"
            label-width="100px"
            class="profile-form"
          >
            <el-form-item label="用户名" prop="username">
              <el-input v-model="userInfo.username" disabled />
            </el-form-item>
            <el-form-item label="昵称" prop="name">
              <el-input v-model="userInfo.name" />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="userInfo.email" />
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="userInfo.phone" />
            </el-form-item>
            <el-form-item label="所属院系" prop="department">
              <el-input v-model="userInfo.department" disabled />
            </el-form-item>
            <el-form-item label="个人简介" prop="bio">
              <el-input
                v-model="userInfo.bio"
                type="textarea"
                :rows="4"
                placeholder="请输入个人简介"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSubmit">保存修改</el-button>
              <el-button @click="resetForm">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="安全设置" name="security">
          <div class="security-section">
            <h3>修改密码</h3>
            <el-form
              ref="passwordFormRef"
              :model="passwordForm"
              :rules="passwordRules"
              label-width="100px"
            >
              <el-form-item label="当前密码" prop="currentPassword">
                <el-input
                  v-model="passwordForm.currentPassword"
                  type="password"
                  show-password
                />
              </el-form-item>
              <el-form-item label="新密码" prop="newPassword">
                <el-input
                  v-model="passwordForm.newPassword"
                  type="password"
                  show-password
                />
              </el-form-item>
              <el-form-item label="确认密码" prop="confirmPassword">
                <el-input
                  v-model="passwordForm.confirmPassword"
                  type="password"
                  show-password
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handlePasswordChange">
                  修改密码
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>

        <el-tab-pane label="通知设置" name="notifications">
          <div class="notification-settings">
            <h3>消息通知</h3>
            <el-form label-width="200px">
              <el-form-item label="系统消息">
                <el-switch v-model="notificationSettings.system" />
              </el-form-item>
              <el-form-item label="活动通知">
                <el-switch v-model="notificationSettings.activity" />
              </el-form-item>
              <el-form-item label="文件更新提醒">
                <el-switch v-model="notificationSettings.fileUpdate" />
              </el-form-item>
              <el-form-item label="邮件通知">
                <el-switch v-model="notificationSettings.email" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveNotificationSettings">
                  保存设置
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const activeTab = ref('basic')

// 用户信息表单
const userInfo = reactive({
  username: 'john_doe',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '13800138000',
  department: '计算机科学与技术',
  role: '学生',
  bio: '热爱学习，乐于分享',
  avatar: ''
})

// 表单校验规则
const rules = {
  name: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ]
}

// 密码修改表单
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 密码修改校验规则
const passwordRules = {
  currentPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 通知设置
const notificationSettings = reactive({
  system: true,
  activity: true,
  fileUpdate: true,
  email: false
})

// 表单提交
const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    // TODO: 调用API保存用户信息
    ElMessage.success('保存成功')
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 重置表单
const resetForm = () => {
  formRef.value.resetFields()
}

// 修改密码
const handlePasswordChange = async () => {
  try {
    await passwordFormRef.value.validate()
    // TODO: 调用API修改密码
    ElMessage.success('密码修改成功')
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 保存通知设置
const saveNotificationSettings = () => {
  // TODO: 调用API保存通知设置
  ElMessage.success('设置已保存')
}

const formRef = ref()
const passwordFormRef = ref()
</script>

<style lang="scss" scoped>
.profile-page {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: calc(100vh - 60px);

  .profile-header {
    background: #fff;
    border-radius: 8px;
    padding: 32px;
    margin-bottom: 24px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);

    .user-info {
      display: flex;
      align-items: center;
      gap: 24px;

      .user-details {
        h1 {
          font-size: 24px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 8px;
        }

        .user-role {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
        }
      }
    }
  }

  .profile-content {
    background: #fff;
    border-radius: 8px;
    padding: 24px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);

    .profile-tabs {
      :deep(.el-tabs__nav-wrap) {
        padding: 0 16px;
      }
    }

    .profile-form {
      max-width: 600px;
      margin-top: 24px;
    }

    .security-section,
    .notification-settings {
      max-width: 600px;
      margin-top: 24px;

      h3 {
        font-size: 18px;
        font-weight: 500;
        color: #1f2937;
        margin: 0 0 24px;
      }
    }
  }
}

// 响应式布局
@media screen and (max-width: 768px) {
  .profile-page {
    padding: 16px;

    .profile-header {
      padding: 24px;

      .user-info {
        flex-direction: column;
        text-align: center;
        gap: 16px;
      }
    }

    .profile-content {
      padding: 16px;
    }
  }
}
</style>
