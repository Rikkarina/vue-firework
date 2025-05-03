<template>
  <div class="my-uploads">
    <h2>我的上传</h2>
    <el-table :data="uploads" style="width: 100%">
      <el-table-column prop="title" label="资源名称" />
      <el-table-column prop="type" label="类型" width="120" />
      <el-table-column prop="status" label="状态" width="120" />
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
const uploads = ref([
  {
    id: 1,
    title: '计算机组成原理实验报告',
    type: '实验报告',
    status: '已审核',
  },
])

const handleEdit = (row) => {
  console.log('编辑:', row)
}

const handleDelete = (row) => {
  console.log('删除:', row)
}
</script>
