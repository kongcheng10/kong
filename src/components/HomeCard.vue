<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  imgSrc: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  }
})

const router = useRouter()

function go() {
  router.push(props.link)
}
</script>

<template>
  <div class="box" @click="go">
    <div class="img">
      <img :src="imgSrc" alt="">
    </div>
    <div class="txt">
      <h1>{{ title }}</h1>
      <p>{{ subtitle }}</p>
      <p>{{ description }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.box {
  height: 500px;
  width: 250px;
  overflow: hidden;
  background: rgba(219, 235, 241, 0.8);
  box-shadow: 0 0 15px rgb(59, 73, 95);
  border-radius: 15px;
  transition: all 0.8s ease 0s;
  cursor: pointer;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: scale(1.05);
  }

  .img {
    width: 100%;
    height: 190px; // 固定高度
    overflow: hidden;
    transition: all 0.8s ease 0s; 
    opacity: 0.8;
    flex-shrink: 0; // 防止被压缩

    img {
      width: 100%;
      height: 100%;
      object-fit: cover; // 让图片填满容器并保持比例
    }

    &:hover {
      transform: scale(1.05);
    }
  }

  .txt {
    flex: 1; // 占据剩余空间
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    h1 {
      margin-top: 15px;
      text-align: center;
      font-size: 3em;
      color: rgb(28, 44, 68);
      height: 30px;
      line-height: 30px;
    }
    
    p {
      margin-top: 15px;
      word-wrap: break-word;
      color: rgb(114, 182, 202);
    }
  }
}
</style>