<template>
  <div class="settings-page">
    <h2>账户设置</h2>
    <el-form :model="form" label-width="100px">
      <el-form-item label="登录邮箱">
        <el-input v-model="form.email" disabled />
      </el-form-item>

      <el-form-item label="新密码">
        <el-input v-model="form.newPassword" type="password" show-password />
      </el-form-item>

      <el-form-item label="确认密码">
        <el-input v-model="form.confirmPassword" type="password" show-password />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleSubmit">保存更改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const form = ref({
  email: 'user@example.com',
  newPassword: '',
  confirmPassword: '',
})

const handleSubmit = () => {
  console.log('提交设置:', form.value)
}
</script>
