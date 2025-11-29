<script setup>
import { ref} from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import AuthForm from '@/components/AuthForm.vue'
import { userLogin } from '@/api/user'
import  {useUserStore}  from '@/stores/user'
    
const userStore = useUserStore()
const router = useRouter()
const authFormRef = ref()

// 表单数据
const formData = ref({
  username: '',
  password: '',
})

const rules ={
  //命名要和上面一致
  username:[
    // required: true 表示这个字段是非空       trigger: 'blur' 表示触发方式失去焦点
    {required: true, message: '请输入用户名', trigger: 'blur'},
    {min: 3,max:10, message: '用户名长度不能小于3个字符且不能大于10', trigger: 'blur'}
  ],
  password:[
    {required: true, message: '请输入密码', trigger: 'blur'},									 //内容验证
    {min: 3,max:10, message: '密码长度不能小于3个字符且不能大于10', trigger: 'blur'},  			//长度验证
    {pattern: /^[\S]{6,15}$/, message: '密码格式不正确', trigger: 'blur'} 			//正则表达式验证
  ]
}
// 处理登录
const handleLogin = async () => {
 {
    await userLogin(formData.value.username, formData.value.password)
    const res = await userLogin(formData.value.username, formData.value.password)
    console.log(res);
    userStore.setToken(res.data.token)
    ElMessage.success('登录成功')
    // 登录成功后的操作，比如跳转到首页
    setTimeout(() => {
      router.push('/')
    }, 1000)
  } 
}

// 处理重置
const handleReset = () =>{
  formData.value.username = ''
  formData.value.password = ''
}
// 跳转到注册页
const goToRegister = () => {
  router.push('/register')
}

// 处理忘记密码
const handleForgetPassword = () => {
  ElMessage.info('忘记密码功能开发中...')
}
</script>



<template>
  <div class="login-page">
    <AuthForm
      ref="authFormRef"
      type="login"
      submit-text="立即登录"
      :form-data="formData"
      :form-rules="rules"
      @submit="handleLogin"
      @reset="handleReset"
    >
      <!-- 登录特有字段 -->
       <template #title>
          <h2 class="form-title">登录</h2>
       </template>
      <template #fields>
        <el-form-item label="用户名" prop="username" >
          <el-input 
            v-model="formData.username" 
            :prefix-icon="User" 
            placeholder="请输入用户名"
          />
        </el-form-item>
        
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="formData.password"
            show-password
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          />
        </el-form-item>
        
        <!-- 记住我选项 -->
        <el-form-item>
          <el-checkbox v-model="formData.remember">记住我</el-checkbox>
        </el-form-item>
      </template>
      
      <!-- 登录特有按钮 -->
      <template #actions>
        <el-form-item class="button-group">
          <el-button type="primary" @click="handleLogin">立即登录</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </template>
      
      <!-- 底部链接 -->
      <template #footer>
        <div class="form-footer">
          <p>还没有账号？<a href="#" @click.prevent="goToRegister">立即注册</a></p>
          <p><a href="#" @click.prevent="handleForgetPassword">忘记密码？</a></p>
        </div>
      </template>
    </AuthForm>
  </div>
</template>



<style lang="scss" scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 98vh;
  background: url('@/assets/1.jpg') no-repeat center center ;
  background-size: cover;
  
  .form-title {
    text-align: center;
    margin-bottom: 20px;
  }
  .form-footer {
    text-align: center;
    margin-top: 20px;
    
    a {
      color: #409EFF;
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
  
}
</style>