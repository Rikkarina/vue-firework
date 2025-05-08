<script setup>
// 保留的全局初始化逻辑（可根据需要取消注释）
import { getUserAPI } from '@/apis/user.js'
import { onMounted } from 'vue'

// 示例用户信息获取（需要后端API支持）
const getUser = async () => {
  const res = await getUserAPI()
  console.log(res)
}
onMounted(() => {
  getUser()
})
</script>

<template>
  <!-- 路由出口 -->
  <router-view />
</template>
