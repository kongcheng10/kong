<script setup>
import { ref} from 'vue'
import { ElMessage } from 'element-plus'
import { addCategory, updateCategory } from '@/api/article'

const formRef = ref() // 表单实例
const formData = ref({  // 表单数据
    title: '',
    cate_id: '',
    cover_img: '',
    content: '',
    state: '' 
})
const dialogVisible = ref(false) // 对话框是否显示
// 表单验证规则
const rules = {
  cate_name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  cate_alias: [
    { required: true, message: '请输入分类别名', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_-]+$/, message: '只能包含字母、数字、下划线、横线', trigger: 'blur' }
  ]
}
let isEdit = false
// 编辑时的 ID
let currentId = null
// 打开对话框
const open = (row) => {
  if (!row) {
    // 新增模式
    isEdit = false
    formData.value.cate_name = ''
    formData.value.cate_alias = ''
  } else {
    // 编辑模式
    isEdit = true
    currentId = row.id
    formData.value.cate_name = row.cate_name || ''
    formData.value.cate_alias = row.cate_alias || ''
  }
  dialogVisible.value = true
}

// 定义事件  来通知父组件数据已更新然后父组件刷新列表(父组件调用时<CategoryEdit @success="getCategoryList">)
const emit = defineEmits(['success'])
//打开对话框后点击确定按钮
const handleSubmit = async () => {
  try {
    // 使用 await 验证（更现代的写法）
    await formRef.value.validate()
    if (isEdit) {
      await updateCategory(currentId, formData.value)
    } else {
      await addCategory(formData.value)
    }
    dialogVisible.value = false
    // 清空表单（逐字段赋值，兼容性更好）
    formData.value.cate_name = ''
    formData.value.cate_alias = ''
    emit('success')
    ElMessage.success(isEdit ? '编辑成功' : '添加成功')
  } catch (error) {
    // 区分表单验证错误和接口错误
    if (error?.message?.includes?.('validate')) {
      return // Element Plus 验证失败通常不 throw，但保险起见
    }
    ElMessage.error(error.response?.data?.message || '操作失败，请重试')
  }
}
//向外暴露出open方法
  defineExpose({
    open
  })
</script>

<template>
    <!-- 定义对话框的 -->
  <el-dialog
    v-model="dialogVisible" 
    :title="isEdit ? '编辑分类' : '新增分类'"
    width="400"
    :append-to-body="true"    
    
  >
   <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="80px"
      @submit.prevent
    >
      <el-form-item label="分类名称" prop="cate_name">
        <el-input v-model="formData.cate_name" placeholder="请输入分类名称" />
      </el-form-item>
      <el-form-item label="分类别名" prop="cate_alias">
        <el-input v-model="formData.cate_alias" placeholder="请输入分类别名" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>



<style scoped lang="scss">

</style>