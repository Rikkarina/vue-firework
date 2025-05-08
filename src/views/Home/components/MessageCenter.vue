<template>
  <div class="message-center">
    <div class="title-row">
      <span>消息中心</span>
      <a class="more" href="#">查看更多</a>
    </div>
    <ul class="message-list">
      <li v-for="(msg, idx) in messages" :key="idx">
        <span class="tag" :class="msg.type">{{ msg.type }}</span>
        <span class="content">{{ msg.content }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const messages = ref([
  { type: '活', content: '内容审核优化活动' },
  { type: '消', content: '新内容审核通过提醒，详情请查看通知' },
  { type: '消', content: '新内容审核通过提醒，详情请查看通知' },
  { type: '消', content: '新内容审核通过提醒，详情请查看通知' },
])
</script>

<style lang="scss" scoped>
.message-center {
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
  .message-list {
    list-style: none;
    padding: 0;
    margin: 0;
    li {
      display: flex;
      align-items: center;
      font-size: 14px;
      margin-bottom: 8px;
      .tag {
        display: inline-block;
        width: 24px;
        height: 20px;
        border-radius: 4px;
        background: #e6f7ff;
        color: #409eff;
        text-align: center;
        margin-right: 8px;
        font-size: 12px;
      }
      .tag.活 {
        background: #f6ffed;
        color: #52c41a;
      }
    }
  }
}
</style>
