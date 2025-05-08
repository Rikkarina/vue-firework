<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AuthForm from './AuthForm.vue'
import { useAuthStore } from '@/stores/auth'
import logoUrl from '@/assets/logo.png'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const mode = ref(route.path === '/register' ? 'register' : 'login')

watch(
  () => route.path,
  (val) => {
    mode.value = val === '/register' ? 'register' : 'login'
  },
)

const onSubmit = async (form) => {
  // 出错的代码已经在store中处理了，这里不需要再处理
  if (mode.value === 'login') {
    await authStore.login(form)
  } else {
    await authStore.register(form)
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

<template>
  <div class="login-container">
    <div class="login-left">
      <div class="brand-title">Firework</div>
      <div class="brand-desc">Ignite Knowledge, Share Brightness.</div>
    </div>
    <div class="login-right">
      <div class="login-content">
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
  </div>
</template>

<style scoped lang="scss">
$main-bg: #a4bad8;
$brand-shadow: #7a8fa9;
$brand-title: #fff;
$brand-desc: #f5f5f5;
$login-box-bg: #fff;
$login-box-shadow: rgba(0, 0, 0, 0.08);
$primary: rgb(37, 117, 225);
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
    align-items: flex-start;
    padding-left: 120px;

    .brand-title {
      font-size: 72px;
      font-weight: bold;
      color: $brand-title;
      text-shadow: 2px 4px 6px $brand-shadow;
      margin-bottom: 16px;
    }

    .brand-desc {
      font-size: 32px;
      color: $brand-desc;
      text-shadow: 1px 2px 4px $brand-shadow;
    }
  }

  .login-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;

    .login-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 120px;

      .login-box {
        background: $login-box-bg;
        border-radius: 12px;

        box-shadow: 0 4px 24px $login-box-shadow;
        padding: 48px 40px 32px 40px;
        display: flex;
        width: 500px;
        flex-direction: column;
        align-items: flex-start;
        position: relative;

        .login-logo {
          width: 80px;
          margin-bottom: 12px;
          background-color: transparent;
          mix-blend-mode: multiply;
          position: absolute;
          top: 24px;
          left: 24px;
        }

        .login-title {
          font-size: 28px;
          font-weight: 600;
          color: $primary;
          margin-bottom: 28px;
          text-align: center;
          width: 100%;
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
  }

  @media (max-width: 900px) {
    flex-direction: column;

    .login-left {
      align-items: center;
      padding-right: 0;
      padding-top: 60px;
      padding-left: 0;
    }

    .login-right {
      padding-bottom: 40px;

      .login-content {
        margin-left: 0;
        width: 100%;
        align-items: center;

        .login-box {
          min-width: 90vw;
          padding: 32px 10vw 24px 10vw;
        }
      }
    }
  }
}
</style>
