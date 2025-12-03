<script setup>
import { ref } from 'vue'


// 定义组件属性
const props = defineProps({
  // 表单数据模型
  formData: {
    type: Object,
    required: true
  },
  // 验证规则
  formRules: {
    type: Object,
    default: () => ({})
  }
})


// 表单引用
const formRef = ref()

// 暴露方法给子组件
defineExpose({
  validate: () => formRef.value.validate()
})
</script>
<template>
  <div class="auth-container">         
    <el-form 
      :model="formData" 
      ref="formRef" 
      :rules="formRules" 
      label-width="80px" 
      class="form-container"
    >
      <!-- 标题插槽 -->
      <slot name="title">

      </slot>
      
      <!-- 表单字段插槽 -->
      <slot name="fields">
       
       
      </slot>
      
      <!-- 按钮插槽 -->
      <slot name="actions">
        
      </slot>
      
      <!-- 底部链接插槽 -->
      <slot name="footer"></slot>
    </el-form>
  </div>
</template>



<style lang="scss" scoped>

.auth-container {
  .form-container {
    background: rgba(255, 255, 255, 0.4);
    padding: 30px;
    border-radius: 10px;
    transition: transform 0.3s ease;
    backdrop-filter: blur(10px);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    max-width: 300px;



    &:hover {
      transform: translateY(-5px);
    }
     :deep(.button-group .el-form-item__content) {
      display: flex;
      justify-content: space-around;
    }
  }
  
}
</style>