<template>
  <div class="last-visited">
    <div class="title-row">
      <span>上次浏览</span>
      <a class="more" href="#">查看更多</a>
    </div>
    <ul class="visited-list">
      <li v-for="(item, idx) in visited" :key="idx">{{ item }}</li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const visited = ref(['产品概览', '接入流程', '使用指南', '接口文档'])
</script>

<style lang="scss" scoped>
.last-visited {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px #f0f1f2;
  .title-row {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    margin-bottom: 12px;
    .more {
      font-size: 12px;
      color: #409eff;
      text-decoration: none;
    }
  }
  .visited-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 12px 24px;
    li {
      font-size: 14px;
      color: #333;
      background: #f5f7fa;
      border-radius: 4px;
      padding: 4px 12px;
    }
  }
}
</style>
