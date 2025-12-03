<script setup>
import { ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user' 
import { ArrowUp } from '@element-plus/icons-vue'
import {
  User,
  SwitchButton,
  CaretBottom
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 路由激活状态
const activeIndex = ref(route.path)
watch(() => route.path, (newPath) => {
  activeIndex.value = newPath
})

// 处理 Logo 点击
const handleLogoClick = () => {
  router.push('/home')
}

// ==============================
// 获取头像
// ==============================
const userAvatar = computed(() => {
  const u = userStore.user || {}
  // 按优先级尝试多个常见字段
  const pic = u.user_pic
  if (pic) return pic

  // 默认头像（Element Plus 官方灰色人像）
  return 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
})

// 下拉菜单命令处理
const handlecommand = async (command) => {
  if (command === 'logout') {
    await ElMessageBox.confirm('确定要退出吗？', '提示', {
      type: 'warning',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
    userStore.setUser({})
    userStore.removeToken()
    router.push('/login')
  } else {
    router.push(`/user/${command}`)
  }
}
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <div class="header-content">
          <div class="logo" @click="handleLogoClick">网站Logo</div>
          <el-menu
            :default-active="activeIndex"
            class="header-menu"
            mode="horizontal"
            background-color="transparent"
            text-color="white"
            active-text-color="#FF8C00"
            router
          >
            <el-menu-item index="/home">Home</el-menu-item>
            <el-sub-menu index="/about">
              <template #title>About</template>
              <el-menu-item index="/about/aboutme">关于我</el-menu-item>
              <el-sub-menu index="/about/website">
                <template #title>关于该网站</template>
                <el-menu-item index="/about/AboutWeb">内容和搭建技术</el-menu-item>
              </el-sub-menu>
            </el-sub-menu>
            <el-menu-item index="/album">Album</el-menu-item>
            <el-menu-item index="/join">Join</el-menu-item>
          </el-menu>

          <!-- 用户头像下拉 -->
          <el-dropdown @command="handlecommand">
            <span class="el-dropdown-trigger">
              <!--  关键：使用计算属性 userAvatar -->
              <el-avatar :src="userAvatar" :size="32" fit="cover" />
              <el-icon><CaretBottom /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="" :icon="User">基本资料</el-dropdown-item>
                <!-- <el-dropdown-item command="avatar">更换头像</el-dropdown-item>
                <el-dropdown-item command="password">重置密码</el-dropdown-item> -->
                <el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main>
        <RouterView></RouterView>

        <!-- 返回顶部 -->
        <el-backtop :visibility-height="100" :right="50" :bottom="200">
          <div style="height:100%;width:100%;text-align:center;line-height:40px;">
            <el-icon><ArrowUp /></el-icon>
          </div>
        </el-backtop>
      </el-main>

      <el-footer>Footer</el-footer>
    </el-container>
  </div>
</template>

<style lang="scss" scoped>
.common-layout {
  min-height: 98vh;
  display: flex;
  flex-direction: column;
}

.el-header {
  position: relative;
  background-color: #409EFF;
  color: white;
  padding: 0;
  .header-content {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    padding: 0 20px;
    .logo {
      cursor: pointer;
      font-size: 20px;
      font-weight: bold;
    }
  }
  animation: load1 1s ease-in-out;
  @keyframes load1 {
    0% { top: -80px; opacity: 0; }
    100% { top: 0px; opacity: 0.8; }
  }
}

.header-menu {
  min-width: 0;
  border-bottom: none;
  flex: 1;
  justify-content: flex-end;
  :deep(.el-menu-item) {
    &:hover { background-color: rgba(255,255,255,0.2) !important; }
    &.is-active { background-color: rgba(255,255,255,0.2) !important; }
  }
  :deep(.el-sub-menu .el-sub-menu__title) {
    &:hover { background-color: rgba(255,255,255,0.1) !important; }
  }
}

.el-main {
  background: url('@/assets/background.webp') no-repeat center center fixed;
  background-size: cover;
  margin: 0;
  padding: 0;
}

.el-footer {
  background-color: #909399;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

<style lang="scss">
.el-menu--popup {
  .el-menu-item, .el-sub-menu__title {
    color: #606266 !important;
    &:hover {
      color: #409EFF !important;
      background-color: #ecf5ff !important;
    }
  }
  .el-menu--popup .el-menu-item {
    color: #606266 !important;
    &:hover {
      color: #409EFF !important;
      background-color: #ecf5ff !important;
    }
  }
}

.el-dropdown-trigger {
  outline: none;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}
</style>