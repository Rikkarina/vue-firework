<template>
  <el-form :model="form" :rules="rules" ref="formRef" class="auth-form">
    <el-form-item prop="phone">
      <el-input v-model="form.phone" placeholder="请输入手机号" class="auth-input" />
    </el-form-item>
    <el-form-item prop="username" v-if="mode === 'register'">
      <el-input v-model="form.username" placeholder="请输入用户名" class="auth-input" />
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        v-model="form.password"
        :type="showPwd ? 'text' : 'password'"
        :placeholder="
          mode === 'login' ? '请输入密码(6-16位字符/数字)' : '请设置密码(6-16位字符/数字)'
        "
        class="auth-input"
        show-password
      >
        <template #suffix>
          <el-icon @click="showPwd = !showPwd" class="password-icon">
            <component :is="showPwd ? 'View' : 'Hide'" />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="confirmPassword" v-if="mode === 'register'">
      <el-input
        v-model="form.confirmPassword"
        :type="showConfirmPwd ? 'text' : 'password'"
        placeholder="请再次输入密码"
        class="auth-input"
        show-password
      >
        <template #suffix>
          <el-icon @click="showConfirmPwd = !showConfirmPwd" class="password-icon">
            <component :is="showConfirmPwd ? 'View' : 'Hide'" />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item v-if="mode === 'login'">
      <el-checkbox v-model="form.remember" class="auth-checkbox">记住密码</el-checkbox>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" class="auth-btn" @click="onSubmit" style="width: 100%">{{
        mode === 'login' ? '登录' : '注册'
      }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue'

const props = defineProps({
  mode: {
    type: String,
    default: 'login', // 'login' 或 'register'
  },
})

const emit = defineEmits(['submit'])
const formRef = ref(null)

const form = ref({
  phone: '',
  username: '',
  password: '',
  confirmPassword: '',
  remember: true,
})

// 验证规则
const rules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
  ],
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9_]{2,20}$/,
      message: '用户名只能包含字母、数字和下划线，长度2-20位',
      trigger: 'blur',
    },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,16}$/,
      message: '密码必须包含字母和数字，长度6-16位',
      trigger: 'blur',
    },
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== form.value.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
}

const showPwd = ref(false)
const showConfirmPwd = ref(false)

watch(
  () => props.mode,
  () => {
    // 切换模式时重置表单
    form.value = {
      phone: '',
      username: '',
      password: '',
      confirmPassword: '',
      remember: true,
    }
    // 清除验证结果
    if (formRef.value) {
      formRef.value.clearValidate()
    }
  },
)

const onSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    emit('submit', {
      phone: form.value.phone,
      username: form.value.username,
      password: form.value.password,
    })
  } catch {
    // 验证失败，不提交表单
  }
}
</script>

<style lang="scss">
:root {
  --el-color-primary: rgb(37, 117, 225);
  --el-color-primary-light-3: rgba(37, 117, 225, 0.7);
  --el-color-primary-light-5: rgba(37, 117, 225, 0.5);
  --el-color-primary-light-7: rgba(37, 117, 225, 0.3);
  --el-color-primary-light-8: rgba(37, 117, 225, 0.2);
  --el-color-primary-light-9: rgba(37, 117, 225, 0.1);
}
</style>

<style scoped lang="scss">
.auth-form {
  width: 100%;

  :deep(.el-form-item) {
    margin-bottom: 32px;
  }

  :deep(.el-form-item__content) {
    width: 100%;
  }

  .auth-input {
    :deep(.el-input__wrapper) {
      height: 48px;
      padding: 0 16px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      border-radius: 8px;
      transition: all 0.3s ease;

      &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
      }

      &:focus-within {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.16);
      }
    }

    :deep(.el-input__inner) {
      font-size: 16px;
    }

    :deep(.el-input__suffix) {
      display: flex;
      align-items: center;
      padding-right: 12px;
    }
  }

  .password-icon {
    font-size: 18px;
    color: #666;
    cursor: pointer;
    transition: color 0.3s ease;

    &:hover {
      color: rgb(37, 117, 225);
    }
  }

  .auth-checkbox {
    :deep(.el-checkbox__label) {
      font-size: 14px;
      color: #666;
    }
  }

  .auth-btn {
    height: 48px;
    font-size: 16px;
    font-weight: 500;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(37, 117, 225, 0.2);
    transition: all 0.3s ease;
    width: 100%;

    &:hover {
      box-shadow: 0 6px 16px rgba(37, 117, 225, 0.3);
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }
  }
}
</style>
