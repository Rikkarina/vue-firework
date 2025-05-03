<template>
  <div class="browse-container">
    <el-card>
      <div class="filter-section">
        <el-select v-model="filterType" placeholder="按类型筛选" clearable>
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>

        <el-select v-model="filterMajor" placeholder="按专业筛选" clearable>
          <el-option
            v-for="item in majorOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>

      <div class="resource-list">
        <el-card v-for="item in filteredResources" :key="item.id" class="resource-item">
          <template #header>
            <div class="resource-header">
              <h3>{{ item.title }}</h3>
              <el-tag :type="item.type === '课件' ? 'primary' : 'success'">
                {{ item.type }}
              </el-tag>
            </div>
          </template>
          <p class="resource-description">{{ item.description }}</p>
          <div class="resource-footer">
            <span>{{ item.major }}</span>
            <el-button type="text" @click="$router.push(`/resource/${item.id}`)"
              >查看详情</el-button
            >
          </div>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const filterType = ref('')
const filterMajor = ref('')

const typeOptions = ref([
  { value: 'courseware', label: '课程课件' },
  { value: 'notes', label: '学习笔记' },
  { value: 'past_paper', label: '历年真题' },
])

const majorOptions = ref([
  { value: 'computer', label: '计算机科学' },
  { value: 'economic', label: '经济管理' },
  { value: 'engineering', label: '机械工程' },
])

const resourceList = ref([
  {
    id: 1,
    title: 'Vue3 实战教程',
    type: 'courseware',
    major: 'computer',
    description: '包含组合式API、状态管理等核心内容...',
  },
  // 更多模拟数据...
])

const filteredResources = computed(() => {
  return resourceList.value.filter((item) => {
    const typeMatch = !filterType.value || item.type === filterType.value
    const majorMatch = !filterMajor.value || item.major === filterMajor.value
    return typeMatch && majorMatch
  })
})
</script>

<style lang="scss" scoped>
.browse-container {
  max-width: 1200px;
  margin: 20px auto;

  .filter-section {
    display: flex;
    gap: 20px;
    margin-bottom: 30px;
  }

  .resource-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;

    .resource-item {
      transition: transform 0.3s;

      &:hover {
        transform: translateY(-5px);
      }
    }

    .resource-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .resource-description {
      color: #666;
      margin: 10px 0;
      @include text-ellipsis(3);
    }

    .resource-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
</style>
