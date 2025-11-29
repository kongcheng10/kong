<template>
  <!-- 
    卡片容器：
    - 根据 align 属性决定整体靠左还是靠右
    - 自动根据 align 决定动画方向：
        - align="left"  → 从右侧滑入（视觉上向左移动）
        - align="right" → 从左侧滑入（视觉上向右移动）
   -->
  <div 
    class="about-card" 
    :class="[align, `${align}-enter`]" 
  >
    <!-- 图片部分 -->
    <div v-if="image" class="card-image">
      <img :src="image" alt="Card Image"/>
    </div>

    <!-- 文字内容部分 -->
    <div class="card-text">
      <h2>{{ title }}</h2>
      <p>{{ description }}</p>
    </div>
  </div>
</template>

<script setup>
// 定义组件接收的 props
defineProps({
  // 卡片标题
  title: String,
  // 卡片描述文字
  description: String,
  // 图片路径（支持 @/assets/...）
  image: {
    type: String,
    default: ''
  },
  // 卡片整体对齐方式：'left' 或 'right'
  align: {
    type: String,
    default: 'right', // 默认右对齐
    validator: (val) => ['left', 'right'].includes(val)
  }
})
</script>

<style scoped lang="scss">
/* align="left" 的卡片：从左侧滑入（初始位置在左边） */
@keyframes slideInFromRight {
  from {
    opacity: 0;
    transform: translateX(-50%); /* 从左侧偏移进来 */
  }
  to {
    opacity: 0.8;
    transform: translateX(0);
  }
}

/* align="right" 的卡片：从右侧滑入（初始位置在右边） */
@keyframes slideInFromLeft {
  from {
    opacity: 0;
    transform: translateX(50%); /* 从右侧偏移进来 */
  }
  to {
    opacity: 0.8;
    transform: translateX(0);
  }
}

.about-card {
  display: flex;
  width: 45%; /* 固定宽度 */
  min-width: 300px;
  border-radius: 15px;
  margin-top: 3vh;
  margin-bottom: 3vh;
  background: rgba(71, 142, 175, 0.3);
  box-shadow: 0 0 15px rgb(83, 103, 110);
  overflow: hidden;
  opacity: 0.8; 
  animation-duration: 1s;

  &.left {
    margin-right: auto; /* 整体左对齐 */
    .card-image {
      order: 0; /* 图片在前 */
    }
    .card-text {
      order: 1; /* 文本在后 */
      text-align: left;
    }
  }

  &.right {
    margin-left: auto; /* 整体右对齐 */
    .card-image {
      order: 1; /* 图片在后 */
    }
    .card-text {
      order: 0; /* 文本在前 */
      text-align: right;
    }
  }

  /* 左对齐卡片：从右侧滑入 */
  &.left-enter {
    animation-name: slideInFromRight;
  }

  /* 右对齐卡片：从左侧滑入 */
  &.right-enter {
    animation-name: slideInFromLeft;
  }

  .card-text {
    flex: 1;
    h2 {
      margin: 0 0 12px 0;
      font-size: 1.5rem;
      color: #333;
    }
    p {
      margin: 0;
      line-height: 1.6;
      color: #666;
      font-size: 1.05rem;
    }
  }

  .card-image {
    width: 40%;

    min-width: 200px;
    height: 250px;
    flex-shrink: 0;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: all 0.5s ease;
      &:hover {
        transform: scale(1.1);
      }
    }
  }
}
</style>