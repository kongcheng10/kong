<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { ElMessageBox,  } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { ArrowUp } from '@element-plus/icons-vue'

import {
  UserFilled,
  User,
  // Crop,
  // EditPen,
  SwitchButton,
  CaretBottom
} from '@element-plus/icons-vue'
const route = useRoute()
const router = useRouter()

// 根据当前路由自动设置激活状态
const activeIndex = ref(route.path)

// 监听路由变化，更新激活状态
watch(() => route.path, (newPath) => {
  activeIndex.value = newPath
})

// 处理 Logo 点击
const handleLogoClick = () => {
  router.push('/home')
}

const  handlecommand = async (command) => { 
  if(command==='logout'){
    await ElMessageBox.confirm('确定要退出吗？', '提示', { 
      type: 'warning',
      confirmButtonText:'确定',
      cancelButtonText:'取消'
    })
    const userStore = useUserStore()
    userStore.setUser({})
    userStore.removeToken()
    router.push('/login')
  }
  else{
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
            <!-- 使用 router 属性后，index 值就是路由路径 -->
            <el-menu-item index="/home">Home</el-menu-item>
            <el-sub-menu index="/about">
              <template #title>About</template>
              <el-menu-item index="/about/aboutme">关于我</el-menu-item>
              <el-sub-menu index="/about/website">
                <template #title>关于该网站</template>
                <el-menu-item index="/about/AboutWeb">内容和搭建技术</el-menu-item>
              </el-sub-menu>
            </el-sub-menu>
            <el-menu-item index="/album">Alumb</el-menu-item>
            <el-menu-item index="/join">Join</el-menu-item>
          </el-menu>
      <!-- 使用el-dropdown 创建下拉菜单 -->
    <el-dropdown @command="handlecommand" c> <!-- 使用@command来控制点击事件这是element-plus 提供的 -->
      <!-- 使用el-avatar 创建头像 -->
       <span class="el-dropdown-trigger"> 
            <el-avatar :icon="UserFilled" />
            <el-icon><CaretBottom /></el-icon>
        </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="" :icon="User">基本资料</el-dropdown-item >
          <!-- <el-dropdown-item command="avatar" :icon="Crop">更换头像</el-dropdown-item>
          <el-dropdown-item command="password" :icon="EditPen">重置密码</el-dropdown-item>-->
          <el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item> 
      </el-dropdown-menu>
      </template>
    </el-dropdown>
        </div>
      </el-header>
      <el-main>
        <RouterView>

        </RouterView>                             <!-- 子路由的路由出口 -->

        <!-- 在layout中添加一个返回顶部按钮因为不止一个 所以添加一个全局样式 -->
        <el-backtop :visibility-height="100" :right="50" :bottom="200">
          <div
            style="
            height: 100%;
            width: 100%;
            text-align: center;
            line-height: 40px;"
          >
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
  min-height:98vh;
  display: flex;
  flex-direction: column;
  
}
.el-header {
  position: relative;
  // flex: 0 0 auto;
  background-color: #409EFF;
  color: white;
  padding: 0;
  .header-content {
    box-sizing: border-box;       // 防止宽度超出
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
  animation: load1 1s ease-in-out;  //自定义动画持续1秒采用ease-in-out的缓动效果来播放
  @keyframes load1{ /*过渡动画  */
         0%{              /*初始位置-80px  */
        top: -80px;
        opacity: 0;
         }100%{         /*最终位置0px  */
        top: 0px;
        opacity: 0.8;
         }
        }
}
// 菜单样式调整
.header-menu {
  min-width: 0; // ←←← 加这一行 否则菜单项会超出容器宽度加这个属性菜单在空间不足时自动变成折叠菜单 */
  border-bottom: none;
  flex: 1; // 填充剩余空间重要
  justify-content: flex-end;
  :deep(.el-menu-item) {
    // height: 100%;
    // display: flex;
    // align-items: center;
    &:hover {
      background-color: rgba(255, 255, 255, 0.2) !important;
    }
    &.is-active {
      background-color: rgba(255, 255, 255, 0.2) !important;
    }
  }
  :deep(.el-sub-menu) {
    // height: 100%;
    .el-sub-menu__title {
      // height: 100%;
      // display: flex;
      // align-items: center;  
      &:hover {
        background-color: rgba(255, 255, 255, 0.1) !important;
      }
    }
  }
}
.el-main {
  // flex: 1 1 auto;

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
<!-- 添加全局样式，只针对下拉菜单 -->
<style lang="scss">
/* 只针对下拉菜单的样式，不影响一级菜单 */
.el-menu--popup {
  .el-menu-item,
  .el-sub-menu__title {
    color: #606266 !important;
    &:hover {
      color: #409EFF !important;
      background-color: #ecf5ff !important;
    }
  }
  /* 三级菜单 */
  .el-menu--popup {
    .el-menu-item {
      color: #606266 !important;
      &:hover {
        color: #409EFF !important;
        background-color: #ecf5ff !important;
      }
    }
  }
}
// 去除头像的边框
.el-dropdown-trigger {
  outline: none;
  border: none;
}



</style>