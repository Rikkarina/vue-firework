<template>
  <div class="course-card" @click="handleClick">
    <div class="card-header">
      <div class="course-icon">
        <span class="icon-text">{{ title.charAt(0).toUpperCase() }}</span>
      </div>
      <div class="course-title">{{ title }}</div>
    </div>
    <div class="course-tags" v-if="courseType || credits">
      <el-tag size="small" :type="courseTypeColor">{{ courseType || '未知类型' }}</el-tag>
      <el-tag size="small" type="info" v-if="credits">{{ credits }}学分</el-tag>
    </div>
    <div class="course-desc">{{ description }}</div>
    <div class="course-date">最后修改日期：{{ date }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  id: {
    type: [Number, String],
    required: true,
  },
  title: {
    type: String,
    default: 'Python编程入门',
  },
  description: {
    type: String,
    default: '学习Python编程的基础，帮助入门编程。',
  },
  date: {
    type: String,
    default: '2023/11/01',
  },
  courseType: {
    type: String,
    default: '',
  },
  credits: {
    type: [Number, String],
    default: '',
  }
})

const router = useRouter()

const courseTypeColor = computed(() => {
  switch(props.courseType) {
    case '必修':
      return 'danger'
    case '选修':
      return 'success'
    default:
      return 'info'
  }
})

const handleClick = () => {
  router.push({
    name: 'CourseFiles',
    params: {
      courseId: props.id,
    },
  })
}
</script>

<style lang="scss" scoped>
$card-bg: #fff;
$title-color: #1f2937;
$desc-color: #4b5563;
$date-color: #9ca3af;
$icon-bg: #f3f4f6;
$icon-color: #374151;
$icon-size: 36px;
$icon-radius: 4px;
$border-color: #e5e7eb;

.course-card {
  background: $card-bg;
  border: 1px solid $border-color;
  border-radius: 4px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: all 0.2s ease;
  height: 160px;

  &:hover {
    background-color: #f9fafb;
    border-color: #d1d5db;
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;

    .course-icon {
      width: $icon-size;
      height: $icon-size;
      background: $icon-bg;
      border-radius: $icon-radius;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      .icon-text {
        font-size: 20px;
        font-weight: 600;
        color: $icon-color;
        font-family: system-ui, -apple-system, sans-serif;
        user-select: none;
      }
    }

    .course-title {
      font-size: 15px;
      font-weight: 500;
      color: $title-color;
      line-height: 1.4;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .course-tags {
    display: flex;
    gap: 8px;
    margin-bottom: 8px;
  }

  .course-desc {
    font-size: 13px;
    color: $desc-color;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: auto;
  }

  .course-date {
    font-size: 12px;
    color: $date-color;
    margin-top: 8px;
  }
}
</style>

