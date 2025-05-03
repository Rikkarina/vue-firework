<template>
  <div class="upload-container">
    <el-card header="资源上传">
      <el-form :model="formData" label-width="100px">
        <el-form-item label="资源分类" required>
          <el-select v-model="formData.category" placeholder="请选择分类">
            <el-option
              v-for="item in categories"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="上传文件" required>
          <el-upload v-model:file-list="fileList" multiple :auto-upload="false" drag action="">
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">将文件拖到此处或 <em>点击上传</em></div>
          </el-upload>
        </el-form-item>

        <el-form-item label="资源描述">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="4"
            placeholder="请输入资源描述"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitUpload">提交上传</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const categories = ref([
  { value: 'courseware', label: '课程课件' },
  { value: 'notes', label: '学习笔记' },
  { value: 'past_paper', label: '历年真题' },
])

const formData = ref({
  category: '',
  description: '',
})

const fileList = ref([])

const submitUpload = () => {
  // 实现上传逻辑
  console.log('提交上传：', {
    ...formData.value,
    files: fileList.value,
  })
}
</script>

<style lang="scss" scoped>
.upload-container {
  max-width: 800px;
  margin: 20px auto;

  :deep(.el-upload-dragger) {
    padding: 40px 20px;
  }
}
</style>
