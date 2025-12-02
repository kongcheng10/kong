<script setup>
import { ref} from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import AuthForm from '@/components/AuthForm.vue'
import { userRegister } from '@/api/user'

const router = useRouter()
const authFormRef = ref()

// 表单数据
const formData = ref({
  username: '',
  password: '',
  repassword: '',
  region: '',
  date1: '',
  date2: '',
  type: [],
  sex: '',
  agreement: false
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
  ],
  repassword:[
    {required: true, message: '请输入密码', trigger: 'blur'},
    {min: 3,max:10, message: '密码长度不能小于3个字符且不能大于10', trigger: 'blur'},
    {pattern: /^[\S]{6,15}$/, message: '密码格式不正确', trigger: 'blur'},
  																				  //自定义验证
    {validator: (rule,value,callback) => {
      if(value !== formData.value.password) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }, trigger: 'blur'}
  ]
}

// 处理注册
const handleRegister = async () => {
 {
    await userRegister(formData.value.username, formData.value.password, formData.value.repassword)
    ElMessage.success('注册成功')
    // 注册成功后的操作，比如跳转到登录页
    setTimeout(() => {
      router.push('/login')
    }, 1500)
  } 
}

// 处理重置
 const handleReset = () =>{
  formData.value.username = ''
  formData.value.password = ''
  formData.value.repassword = ''
  formData.value.region = ''
  formData.value.date1 = ''
  formData.value.date2 = ''
  formData.value.type = []
  formData.value.sex = ''
  formData.value.agreement = false
}

// 跳转到登录页
const goToLogin = () => {
  router.push('/login')
}
</script>







<template>
  
  <div class="register-page">

    <AuthForm
      ref="authFormRef"
      type="register"       
      title="用户注册"
      :form-data="formData"
      :form-rules="rules"
      @submit="handleRegister"
      @reset="handleReset"
    >
      <!-- 注册特有字段 -->
       <template #title>
          <h2 class="form-title">注册</h2>
       </template>
      <template #fields>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username" :prefix-icon="User"  placeholder="请输入用户名"/>
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
        
        <el-form-item label="确认密码" prop="repassword">
          <el-input
            v-model="formData.repassword"
            show-password
            :prefix-icon="Lock"
            type="password"
            placeholder="请再次输入密码"
          />
        </el-form-item>
        
        <el-form-item label="地址">
          <el-select v-model="formData.region" placeholder="请选择地址">
            <el-option label="杭州" value="hangzhou" />
            <el-option label="广州" value="guangzhou" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="生日">
          <el-col :span="11">
            <el-date-picker
              v-model="formData.date1"
              type="date"
              placeholder="选择日期"
              style="width: 100%"
            />
          </el-col>
          <el-col :span="2" class="text-center">
            <span class="text-gray-500">——</span>
          </el-col>
          <el-col :span="11">
            <el-time-picker
              v-model="formData.date2"
              placeholder="选择时间"
              style="width: 100%"
            />
          </el-col>
        </el-form-item>
        
        <el-form-item label="兴趣爱好">
          <el-checkbox-group v-model="formData.type">
            <el-checkbox value="game" name="游戏">游戏</el-checkbox>
            <el-checkbox value="music" name="音乐">音乐</el-checkbox>
            <el-checkbox value="book" name="读书">读书</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        
        <el-form-item label="性别">
          <el-radio-group v-model="formData.sex">
            <el-radio value="1">男</el-radio>
            <el-radio value="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="同意协议">
          <el-switch v-model="formData.agreement" />
        </el-form-item>
      </template>
      
      <!-- 注册特有按钮 -->
      <template #actions>
        <el-form-item class="button-group">
          <el-button type="success" @click="handleRegister">确定注册</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </template>
      
      <!-- 底部链接 -->
      <template #footer>
        <div class="form-footer">
          <p>已有账号？<a href="#" @click="goToLogin">立即登录</a></p>
        </div>
      </template>
    </AuthForm>
  </div>
</template>



<style lang="scss" scoped>
.register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 98vh;
  background: url('@/assets/2.webp') no-repeat center center fixed;
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