<template>
  <div class="login-container">
    <div class="login-left">
      <div class="brand-title">FireWork</div>
      <div class="brand-desc">Ignite Knowledge, Share Brightness.</div>
    </div>
    <div class="login-right">
      <div class="login-box">
        <img :src="logoUrl" alt="Firework Logo" class="login-logo" />
        <div class="login-title">{{ mode === 'login' ? '登录' : '注册' }}</div>
        <AuthForm :mode="mode" @submit="onSubmit" />
        <div class="login-links">
          <span class="switch" @click="toggleMode">
            {{ mode === 'login' ? '没有账号？去注册' : '已有账号？去登录' }}
          </span>
        </div>
      </div>
      <div class="login-footer">© Firework 2025</div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AuthForm from './AuthForm.vue'
import { ElMessage } from 'element-plus'
import logoUrl from '@/assets/logo.png'

const route = useRoute()
const router = useRouter()
const mode = ref(route.path === '/register' ? 'register' : 'login')

watch(
  () => route.path,
  (val) => {
    mode.value = val === '/register' ? 'register' : 'login'
  }
)

const onSubmit = (form) => {
  if (mode.value === 'login') {
    ElMessage.success('登录成功（示例）')
  } else {
    ElMessage.success('注册成功（示例）')
  }
}

const toggleMode = () => {
  if (mode.value === 'login') {
    router.push('/register')
  } else {
    router.push('/login')
  }
}
</script>

<style scoped lang="scss">
$main-bg: #a4bad8;
$brand-shadow: #7a8fa9;
$brand-title: #fff;
$brand-desc: #f5f5f5;
$login-box-bg: #fff;
$login-box-shadow: rgba(0,0,0,0.08);
$primary: #2563eb;
$footer: #e0e6ed;

.login-container {
  display: flex;
  height: 100vh;
  background: $main-bg;
  .login-left {
    flex: 1.2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
    padding-right: 60px;
    .brand-title {
      font-size: 48px;
      font-weight: bold;
      color: $brand-title;
      text-shadow: 2px 4px 6px $brand-shadow;
      margin-bottom: 16px;
    }
    .brand-desc {
      font-size: 22px;
      color: $brand-desc;
      text-shadow: 1px 2px 4px $brand-shadow;
    }
  }
  .login-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .login-box {
      background: $login-box-bg;
      border-radius: 12px;
      box-shadow: 0 4px 24px $login-box-shadow;
      padding: 48px 40px 32px 40px;
      min-width: 380px;
      display: flex;
      flex-direction: column;
      align-items: center;
      .login-logo {
        width: 80px;
        margin-bottom: 12px;
      }
      .login-title {
        font-size: 28px;
        font-weight: 600;
        color: $primary;
        margin-bottom: 28px;
        text-align: center;
      }
      .login-links {
        display: flex;
        justify-content: flex-end;
        width: 100%;
        margin-top: 8px;
        font-size: 14px;
        color: #888;
        .switch {
          cursor: pointer;
          color: $primary;
        }
      }
    }
    .login-footer {
      margin-top: 32px;
      color: $footer;
      font-size: 13px;
      text-align: center;
    }
  }
  @media (max-width: 900px) {
    flex-direction: column;
    .login-left {
      align-items: center;
      padding-right: 0;
      padding-top: 60px;
    }
    .login-right {
      padding-bottom: 40px;
      .login-box {
        min-width: 90vw;
        padding: 32px 10vw 24px 10vw;
      }
    }
  }
}
</style> 