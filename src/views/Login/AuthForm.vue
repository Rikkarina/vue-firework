<template>
  <el-form :model="form" class="auth-form">
    <el-form-item>
      <el-input v-model="form.phone" placeholder="请输入手机号" />
    </el-form-item>
    <el-form-item v-if="mode === 'register'">
      <el-input v-model="form.username" placeholder="请输入用户名" />
    </el-form-item>
    <el-form-item>
      <el-input v-model="form.password" :type="showPwd ? 'text' : 'password'" :placeholder="mode === 'login' ? '请输入密码(6-16位字符/数字)' : '请设置密码(6-16位字符/数字)'">
        <template #suffix>
          <el-icon @click="showPwd = !showPwd" style="cursor:pointer;">
            <component :is="showPwd ? 'View' : 'Hide'" />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item v-if="mode === 'register'">
      <el-input v-model="form.confirmPassword" :type="showConfirmPwd ? 'text' : 'password'" placeholder="请再次输入密码">
        <template #suffix>
          <el-icon @click="showConfirmPwd = !showConfirmPwd" style="cursor:pointer;">
            <component :is="showConfirmPwd ? 'View' : 'Hide'" />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item v-if="mode === 'login'">
      <el-checkbox v-model="form.remember">记住密码</el-checkbox>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" class="auth-btn" @click="onSubmit" style="width:100%;">{{ mode === 'login' ? '登录' : '注册' }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  mode: {
    type: String,
    default: 'login', // 'login' 或 'register'
  }
})
const emit = defineEmits(['submit'])

const form = ref({
  phone: '',
  username: '',
  password: '',
  confirmPassword: '',
  remember: true
})
const showPwd = ref(false)
const showConfirmPwd = ref(false)

watch(() => props.mode, (val) => {
  // 切换模式时重置表单
  form.value = {
    phone: '',
    username: '',
    password: '',
    confirmPassword: '',
    remember: true
  }
})

const onSubmit = () => {
  if (!form.value.phone || !form.value.password) {
    ElMessage.error('请输入手机号和密码')
    return
  }
  if (props.mode === 'register') {
    if (!form.value.username) {
      ElMessage.error('请输入用户名')
      return
    }
    if (form.value.password !== form.value.confirmPassword) {
      ElMessage.error('两次输入的密码不一致')
      return
    }
  }
  emit('submit', { ...form.value })
}
</script>

<style scoped lang="scss">
.auth-form {
  width: 100%;
  .auth-btn {
    height: 40px;
    font-size: 16px;
  }
}
</style> 