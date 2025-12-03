<script setup>
import { ref, onMounted } from 'vue'
import { ArrowRightBold } from '@element-plus/icons-vue'

import { useRouter } from 'vue-router'
const router = useRouter()
const images = ref([])

onMounted(async () => {
  // 使用动态导入，让 Vite 处理路径
  for (let i = 1; i <= 6; i++) {
    const module = await import(`@/assets/p${i}.webp`)
    images.value.push(module.default)
  }
})
</script>

<template>
  <div class="page-container">
    <div class="carousel-wrapper">
      <!-- 右上角的"查看更多"按钮 -->
      <div class="more" @click="router.push('/more')"><h4>查看更多</h4><el-icon><ArrowRightBold /></el-icon></div>
      <el-carousel :interval="2000" type="card" height="40vh" width="100%" :autoplay="true" :loop="true">
      <el-carousel-item v-for="(item, index) in images" :key="index" >  
        <img :src="item" :alt="`Album ${index + 1}`" style="width: 100%; height: 100%; object-fit: cover;" />        
      </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<style scoped lang="scss">
.page-container {
  min-height: 80vh; 
  display: flex;
  justify-content: center; 
  align-items: center;     
  
  .carousel-wrapper {
    width: 80%;
    position: relative; // 为子元素的绝对定位提供参考
    // "查看更多"按钮的样式
    .more {
      position: absolute;
      top: -20px;
      right: 0px;
      z-index: 10;
        display: flex;
        align-items: center;
        justify-content: center;

      color: #409EFF;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.3s;
      
      &:hover {
       color: rgb(34, 212, 231);
      }
      
      h4 {
        margin: 0;
        font-size: 14px;
        display: inline-block;
      }
    }
    img:hover {
      transition: all 0.8s;
      transform: scale(1.1);
    }
    animation: imgload1 1s ease-in-out;
    @keyframes imgload1 { //translateY(50%) 中的 50% 是相对于元素自身高度
                        //  translateY(50%)：元素向下偏移自己高度的一半 translateY(0)：回到原始位置（无偏移）

    0% {
        opacity: 0;
        transform: translateY(50%);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}
  }
}
</style>