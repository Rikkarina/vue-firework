<script setup>
import { useLoadingStore } from '@/stores/loading'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const loadingStore = useLoadingStore()
</script>

<template>
  <LoadingSpinner :loading="loadingStore.isLoading" />
  <!-- 路由出口 -->
  <router-view />
</template>
