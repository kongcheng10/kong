<script setup>
import { ref, reactive, onMounted } from 'vue'
// 假设您在项目中使用了 Element Plus 的通知组件
import { ElMessage } from 'element-plus' 
import { Avatar, Lock, User } from '@element-plus/icons-vue' 
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import {
  getUserInfo,
  updateUserInfo,
  updatePassword,
  updateAvatar
} from '@/api/user' 

const userStore = useUserStore()
const router = useRouter()


// 菜单控制
const activeMenu = ref('basic')
const handleMenuSelect = (index) => {
  activeMenu.value = index
}

// ======================= 基本信息相关 =======================
const basicFormRef = ref() // 用于表单校验
const basicForm = reactive({
  id: null,
  username: '',
  nickname: '',
  email: ''
})

// 基本信息表单校验规则
const basicRules = {
  // 用户名通常后端返回，这里仅做非空和长度校验
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: ['blur', 'change'] }
  ]
}

// ======================= 密码相关 =======================
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  repassword: '' 
})
const passwordFormRef = ref()

// 密码表单校验规则
const passwordRules = {
  oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' }
  ],
  repassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// ======================= 头像相关 =======================
// 使用 el-upload 的 ref 来触发文件选择
const avatarUploadRef = ref(null)
// 存储预览图：初始为网络 URL，选图后变为 base64 字符串
const avatarPreview = ref('')

// ======================= 接口方法封装 =======================

// 获取用户信息
const loadUserInfo = async () => {
  try {
    const res = await getUserInfo() 
    const { id, username, nickname, email, user_pic } = res.data.data
    basicForm.id = id
    basicForm.username = username
    basicForm.nickname = nickname
    basicForm.email = email
    avatarPreview.value = user_pic || ''
     console.log('用户信息:', res)
  } catch  {
    ElMessage.error('获取用户信息失败')
    
  }
 
}

// 提交基本信息 (已集成校验)
const submitBasic = () => {
  basicFormRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        await updateUserInfo(
          basicForm.id,
          basicForm.username,
          basicForm.nickname,
          basicForm.email
          
        )
        ElMessage.success('基本信息更新成功')
      } catch {
        ElMessage.error('更新失败')
      }
    }
  })
}

// 提交密码
const submitPassword = () => {
  let A ='aaaa'
  const userInput = prompt('请输入验证码：', )
  if (userInput !== A) {
    ElMessage.error('验证码错误')
    return
  }
  passwordFormRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        // ⚠️ 按后端字段名构造数据
        const payload = {
          old_pwd: passwordForm.oldPassword,     
          new_pwd: passwordForm.newPassword,     
          re_pwd: passwordForm.repassword        
        }
        await updatePassword(payload) 
        ElMessage.success('密码修改成功')
                // 清空用户信息
        userStore.setToken('')
        userStore.setUser({})
        router.push('/login')
      } catch (error) {
        console.error('密码更新失败:', error)
        const msg = error?.response?.data?.message || '密码修改失败'
        ElMessage.error(msg)
      }
    }
  })
}

// 处理文件选择（由 el-upload 触发）
const handleAvatarChange = (uploadFile) => {
  const file = uploadFile.raw

  // 校验类型
  const validType = ['image/jpeg', 'image/png', 'image/jpg','image/webp']
  if (!validType.includes(file.type)) {
    ElMessage.warning('支持 JPG/PNG/JPEG/WEBP 格式')
    return
  }

  // 校验大小
  if (file.size > 2 * 1024 * 1024) {
    ElMessage.warning('图片大小不能超过 2MB')
    return
  }

  // 转为 base64 预览
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => {
    avatarPreview.value = reader.result // base64 字符串
  }
}

// 提交头像（传完整的 base64 Data URL）
const submitAvatar = async () => {
  if (!avatarPreview.value) {
    ElMessage.warning('请先选择头像图片')
    return
  }

  // 如果是网络图片（初始状态），说明没选新图，不允许上传
  if (avatarPreview.value.startsWith('http')) {
    ElMessage.warning('请先选择新图片')
    return
  }

  try {
    // ✅ 调用官方头像更新接口（PATCH /my/update/avatar）
    await updateAvatar({ avatar: avatarPreview.value })
    ElMessage.success('头像更新成功')
      // 刷新全局用户信息
    await userStore.getUser()
    if (avatarUploadRef.value) {
      avatarUploadRef.value.clearFiles()
    }
  } catch (error) {
    console.error('头像上传失败:', error)
    const msg = error?.response?.data?.message || '头像上传失败'
    ElMessage.error(msg)
  }
}

// 页面加载时获取用户信息
onMounted(() => {
  loadUserInfo()
})
</script>
<template>
  <div class="profile-settings-layout">
    <el-row :gutter="24">
      <el-col :xs="24" :sm="24" :md="6" class="side-menu-col">
        <el-card class="menu-card" :body-style="{ padding: '0px' }">
          <el-menu
            :default-active="activeMenu"
            @select="handleMenuSelect"
            mode="vertical"
            class="side-menu"
          >
            <el-menu-item index="basic">
              <el-icon><User /></el-icon>
              <span>基本信息</span>
            </el-menu-item>
            <el-menu-item index="password">
              <el-icon><Lock /></el-icon>
              <span>修改密码</span>
            </el-menu-item>
            <el-menu-item index="avatar">
              <el-icon><Avatar /></el-icon>
              <span>头像设置</span>
            </el-menu-item>
          </el-menu>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="24" :md="18" class="content-panel-col">
        <el-card class="content-card">
          <div class="content-panel">
            <div v-if="activeMenu === 'basic'">
              <div class="header-section">
                <el-icon class="header-icon"><User /></el-icon>
                <h2>基本信息</h2>
              </div>
              <p class="content-description">编辑您的用户名、昵称和邮箱等个人资料。</p> 
              <el-form 
                ref="basicFormRef" 
                :model="basicForm" 
                :rules="basicRules"      
                label-width="80px" 
                size="large" 
                class="form-content"
              >
                <el-form-item label="用户名" prop="username">
                  <el-input v-model="basicForm.username" placeholder="请输入用户名" disabled />
                </el-form-item>
                <el-form-item label="昵称" prop="nickname">
                  <el-input v-model="basicForm.nickname" placeholder="请输入昵称" />
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="basicForm.email" placeholder="请输入邮箱" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitBasic">保存</el-button>
                </el-form-item>
              </el-form>
            </div>

            <div v-else-if="activeMenu === 'password'">
              <div class="header-section">
                <el-icon class="header-icon"><Lock /></el-icon>
                <h2>修改密码</h2>
              </div>
              <p class="content-description">请输入旧密码与新密码以更新账户安全。</p>

              <el-form
                ref="passwordFormRef"
                :model="passwordForm"
                :rules="passwordRules"
                label-width="100px"
                size="large"
                class="form-content password-form"
              >
                <el-form-item label="旧密码" prop="oldPassword">
                  <el-input
                    v-model="passwordForm.oldPassword"
                    type="password"
                    show-password
                    placeholder="请输入当前密码"
                  />
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                  <el-input
                    v-model="passwordForm.newPassword"
                    type="password"
                    show-password
                    placeholder="至少6位"
                  />
                </el-form-item>
                <el-form-item label="确认密码" prop="repassword">
                  <el-input
                    v-model="passwordForm.repassword"
                    type="password"
                    show-password
                    placeholder="请再次输入新密码"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitPassword">提交</el-button>
                </el-form-item>
              </el-form>
            </div>

            <!-- 头像设置区域：使用 el-upload -->
            <div v-else-if="activeMenu === 'avatar'">
              <div class="header-section">
                <el-icon class="header-icon"><Avatar /></el-icon>
                <h2>头像设置</h2>
              </div>
              <p class="content-description">上传并裁剪您的个人头像图片。</p>

              <!-- 使用 el-upload 管理文件选择，auto-upload="false" 表示不自动上传 -->
              <el-upload
                ref="avatarUploadRef"
                :auto-upload="false"
                :show-file-list="false"
                :on-change="handleAvatarChange"
                class="avatar-uploader"
              >
                <el-avatar
                  :size="100"
                  :src="avatarPreview || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'"
                  fit="cover"
                />
              </el-upload>

              <div class="avatar-actions">
                <!-- 手动触发 el-upload 内部 input 的点击 -->
                <el-button type="primary" @click="avatarUploadRef.$el.querySelector('input').click()">
                  选择图片
                </el-button>
                <!-- 只有当 avatarPreview 是 base64（即非 http 开头）时才允许上传 -->
                <el-button 
                  type="success" 
                  @click="submitAvatar" 
                  :disabled="!avatarPreview || avatarPreview.startsWith('http')"
                >
                  上传头像
                </el-button>
              </div>
              <p class="avatar-tip">支持 JPG、PNG 格式，大小不超过 2MB</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
// 样式保持上次优化后的版本，以确保视觉效果与截图一致。
.profile-settings-layout {
  padding: 24px;
  background-color: #f5f7fa; 
  min-height: 100vh;

  .menu-card {
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
    background-color: #ffffff;
    min-height: 400px;
  }
  
  .side-menu {
    border-right: none;
    padding: 10px 0; 
  }

  .side-menu .el-menu-item.is-active {
    background-color: #ecf5ff;
    color: #409eff;
  }

  .content-card {
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
    min-height: 400px;
    
    .content-panel {
      padding: 0; 
    }
  }

  .header-section {
    display: flex;
    align-items: center;
    margin-bottom: 8px;

    .header-icon {
      font-size: 24px;
      margin-right: 8px;
      color: #303133;
    }

    h2 {
      font-size: 20px;
      font-weight: bold;
      color: #303133;
      margin: 0;
    }
  }
  
  .content-description {
      color: #909399; 
      font-size: 14px;
      line-height: 1.6;
      margin-top: 0;
      margin-bottom: 24px;
      padding-left: 32px; 
  }
  
  .form-content {
      max-width: 500px; 
  }

  @media (max-width: 992px) { 
    .side-menu-col {
      margin-bottom: 24px; 
      border-right: none;
    }
    
    .menu-card {
        min-height: auto;
    }

    .side-menu {
      display: flex; 
      justify-content: space-around;
      padding: 0;
    }
    .side-menu-col .el-menu-item {
        flex: 1;
        justify-content: center; 
    }
  }

  .avatar-section,
  .avatar-uploader {
    display: flex;
    flex-direction: column;
    align-items: flex-start; 
    gap: 20px;
    padding-top: 10px; 

    .avatar-actions {
      display: flex;
      gap: 12px;
    }

    .avatar-tip {
      color: #909399;
      font-size: 12px;
      margin: 0;
    }
  }

  // 隐藏 el-upload 默认的上传按钮（因为我们自定义了）
  :deep(.avatar-uploader .el-upload) {
    display: inline-block;
  }
}
</style>