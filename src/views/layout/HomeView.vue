<script setup>
import AlbumCard from '@/components/HomeCard.vue' // 引入卡片组件
import img1 from '@/assets/爱丽丝.webp' // 导入图片因为不能直接用路径但是可以用网络require'来引入
import img2 from '@/assets/星野.webp'
import img3 from '@/assets/xixi.webp'
</script>

<template>
  <div class="container">
    <div class="content">
      <div class="title">
        <p> &emsp;&emsp;Love the life you live</p> <p>Live the life you love</p>  
      </div>
    </div>

    <div class="video-section">
      <!-- 原本是 video，现在移除，改用 background-image -->
      <!-- <video src="@/assets/shiroko.mp4" loop autoplay muted></video> -->
      <!-- <AlbumCard                                   如果数据是可以从后端拿的话这里就可以用v-for循环来生成卡片不用一个个写死
          v-for="item in albumList"
          :key="item.id"
          :img-src="item.imgSrc"
          :title="item.title"
          :subtitle="item.subtitle"
          :description="item.description"
          :link="item.link"
        /> -->
      <div class="card">
        <AlbumCard 
          :img-src="img1" 
          title="关于" 
          subtitle="关于我和我的网站" 
          description="For some information about me, you can learn about my background and other related information from here" 
          link="/about"
        />
        <AlbumCard 
          :img-src="img2" 
          title="图集" 
          subtitle="精美图片" 
          description="There are many beautiful pictures here." 
          link="/album"
        />
        <AlbumCard 
          :img-src="img3" 
          title="加入" 
          subtitle="加入我们(虽然还没有'们')" 
          description="My contact information, welcome everyone who is interested to join us" 
          link="/join"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 200vh; /* 总高度为200vh，产生滚动 */
}

.content {
  width: 100%;
  height: 100vh; /* 上半部分占满视窗 */
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 24px;
  position: relative;

  .title {
    width: 100vw;
    font-size: 7vw;
    font-weight: 500;
    padding-right: 5vw;
    color: rgba(73, 96, 115, 0.9);
    text-align: center;
  }
}

.video-section {
  width: 100%;
  height: 100vh; /* 下半部分占满视窗 */
  position: relative;
  background-image: url('@/assets/shiroko.webp');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  .card { 
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
}
</style>