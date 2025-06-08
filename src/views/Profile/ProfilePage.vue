<template>
  <div class="profile-page">
    <el-row :gutter="20">
      <!-- 左侧个人信息卡片 -->
      <el-col :span="8">
        <el-card class="profile-card">
          <div class="avatar-container">
            <el-avatar :size="100" :src="userInfo?.avatar || defaultAvatar">
              {{ userInfo?.username?.charAt(0)?.toUpperCase() }}
            </el-avatar>
          </div>
          <div class="user-info">
            <h2>{{ userInfo?.username || '未设置用户名' }}</h2>
            <p class="email">{{ userInfo?.email || '未设置邮箱' }}</p>
            <p class="join-date">加入时间：{{ formatDate(userInfo?.createdAt) }}</p>
          </div>
          <div class="action-buttons">
            <el-button type="primary" @click="handleEdit">
              <el-icon><edit /></el-icon>
              编辑资料
            </el-button>
            <el-button type="danger" @click="handleLogout">
              <el-icon><switch-button /></el-icon>
              退出登录
            </el-button>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧详细信息和设置 -->
      <el-col :span="16">
        <el-card v-if="!isEditing">
          <template #header>
            <div class="card-header">
              <h3>个人资料</h3>
            </div>
          </template>

          <el-descriptions :column="1" border>
            <el-descriptions-item label="用户名">
              {{ userInfo?.username || '未设置' }}
            </el-descriptions-item>
            <el-descriptions-item label="邮箱">
              {{ userInfo?.email || '未设置' }}
            </el-descriptions-item>
            <el-descriptions-item label="手机">
              {{ userInfo?.phone || '未设置' }}
            </el-descriptions-item>
            <el-descriptions-item label="个人简介">
              {{ userInfo?.bio || '这个人很懒，什么都没写~' }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- 编辑表单 -->
        <el-card v-else>
          <template #header>
            <div class="card-header">
              <h3>编辑资料</h3>
            </div>
          </template>

          <el-form
            ref="formRef"
            :model="form"
            :rules="rules"
            label-width="100px"
            class="edit-form"
          >
            <el-form-item label="用户名" prop="username">
              <el-input v-model="form.username" />
            </el-form-item>

            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" />
            </el-form-item>

            <el-form-item label="手机" prop="phone">
              <el-input v-model="form.phone" />
            </el-form-item>

            <el-form-item label="个人简介" prop="bio">
              <el-input
                v-model="form.bio"
                type="textarea"
                :rows="4"
                placeholder="写点什么介绍一下自己吧..."
              />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="handleSave">保存</el-button>
              <el-button @click="isEditing = false">取消</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <!-- 账户安全卡片 -->
        <el-card class="mt-4">
          <template #header>
            <div class="card-header">
              <h3>账户安全</h3>
            </div>
          </template>

          <div class="security-items">
            <div class="security-item">
              <div class="security-info">
                <el-icon><lock /></el-icon>
                <span>登录密码</span>
              </div>
              <el-button link type="primary" @click="handleChangePassword">
                修改密码
              </el-button>
            </div>

            <div class="security-item">
              <div class="security-info">
                <el-icon><mobile /></el-icon>
                <span>手机绑定</span>
              </div>
              <el-button link type="primary" @click="handleBindPhone">
                {{ userInfo?.phone ? '更换手机' : '绑定手机' }}
              </el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 修改密码对话框 -->
    <el-dialog
      v-model="changePasswordVisible"
      title="修改密码"
      width="400px"
    >
      <el-form
        ref="passwordFormRef"
        :model="passwordForm"
        :rules="passwordRules"
        label-width="100px"
      >
        <el-form-item label="原密码" prop="oldPassword">
          <el-input
            v-model="passwordForm.oldPassword"
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
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="changePasswordVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSavePassword">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Edit, Lock, SwitchButton } from '@element-plus/icons-vue'

const authStore = useAuthStore()
const userInfo = computed(() => authStore.userInfo)
const defaultAvatar = '/default-avatar.png'

// 编辑状态
const isEditing = ref(false)
const formRef = ref(null)

// 表单数据
const form = ref({
  username: '',
  email: '',
  phone: '',
  bio: ''
})

// 表单校验规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ]
}

// 修改密码相关
const changePasswordVisible = ref(false)
const passwordFormRef = ref(null)
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordRules = {
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.value.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 处理编辑
const handleEdit = () => {
  form.value = {
    username: userInfo.value?.username || '',
    email: userInfo.value?.email || '',
    phone: userInfo.value?.phone || '',
    bio: userInfo.value?.bio || ''
  }
  isEditing.value = true
}

// 处理保存
const handleSave = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // TODO: 调用API更新用户信息
        ElMessage.success('保存成功')
        isEditing.value = false
      } catch {
        ElMessage.error('保存失败')
      }
    }
  })
}

// 处理退出登录
const handleLogout = () => {
  ElMessageBox.confirm(
    '确定要退出登录吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    authStore.logout()
    ElMessage.success('已退出登录')
  })
}

// 处理修改密码
const handleChangePassword = () => {
  changePasswordVisible.value = true
  passwordForm.value = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
}

// 保存新密码
const handleSavePassword = async () => {
  if (!passwordFormRef.value) return

  await passwordFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // TODO: 调用API修改密码
        ElMessage.success('密码修改成功')
        changePasswordVisible.value = false
      } catch {
        ElMessage.error('密码修改失败')
      }
    }
  })
}

// 处理绑定手机
const handleBindPhone = () => {
  // TODO: 实现手机绑定逻辑
  ElMessage.info('手机绑定功能开发中...')
}

// 格式化日期
const formatDate = (date) => {
  if (!date) return '未知'
  return new Date(date).toLocaleDateString()
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';

.profile-page {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;

  .profile-card {
    text-align: center;

    .avatar-container {
      margin: 20px 0;
    }

    .user-info {
      margin: 20px 0;

      h2 {
        margin: 10px 0;
        font-size: 1.5em;
      }

      .email {
        color: #666;
        margin: 5px 0;
      }

      .join-date {
        color: #999;
        font-size: 0.9em;
      }
    }

    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 0 20px;
    }
  }

  .card-header {
    @include flex-between;

    h3 {
      margin: 0;
      font-size: 1.2em;
    }
  }

  .security-items {
    .security-item {
      @include flex-between;
      padding: 15px 0;
      border-bottom: 1px solid #eee;

      &:last-child {
        border-bottom: none;
      }

      .security-info {
        display: flex;
        align-items: center;
        gap: 10px;

        .el-icon {
          font-size: 1.2em;
          color: #409EFF;
        }
      }
    }
  }

  .mt-4 {
    margin-top: 16px;
  }

  .edit-form {
    max-width: 500px;
  }
}
</style>
