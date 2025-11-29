<script setup>
// 显式导入图片资源
import 三七 from '@/assets/37.jpg'
import 梓 from '@/assets/梓.jpg'
import 千珏 from '@/assets/千珏.jpg'

</script>


<template>
  <div class="about">
    <div class="titleimg" aria-hidden="true"></div>
    <div class="content-wrapper">
      <div class="content">
        <!-- 第一个卡片：右对齐，图片在右侧 -->
        <AboutCard
          title="我的理念"
          description="代码即艺术，用户体验至上。持续学习，追求极致。"
          :image="三七"
          align="right"
        />

        <!-- 第二个卡片：左对齐，图片在左侧 -->
        <AboutCard
          title="我的技能"
          description="精通 Vue3、TypeScript、Element Plus，熟悉 Node.js 和数据库设计。"
          :image="梓"
          align="left"
        />

        <!-- 第三个卡片：右对齐，图片在右侧 -->
        <AboutCard
          title="我的经历"
          description="曾在某互联网公司担任前端工程师，主导多个中后台项目开发。"
          :image="千珏"
          align="right"
        />
      </div>
    </div>
  </div>
</template>



<style lang="scss" scoped>
.about {
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  .titleimg {
    min-height: 100px;
    width: 100%;
    background-image: url('@/assets/miku.png');
    background-position: center 40%;
    background-repeat: no-repeat;
    background-size: cover;
    animation: headload 1s ease-out forwards;
  }

}

// 动画定义（显式、可维护）
@keyframes headload {
  0% {
    opacity: 0;
    transform: translateY(-100%);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>