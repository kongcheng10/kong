<!-- {   一般情况下接口返回的数据应该有page和total等分页信息方便进行触底加载的停止
          这里的接口没有所以用了直接获取全部数据然后前端分组加载的方式
  "code": 200,
  "msg": "success",
  "data": {
    "list": [                     // 👈 当前页的数据列表
      { "id": 11, "name": "商品11", "picture": "..." },
      { "id": 12, "name": "商品12", "picture": "..." },
      ...
      { "id": 20, "name": "商品20", "picture": "..." }
    ],
    "total": 150,               // 👈 总记录数（用于计算总页数）
    "page": 2,                  // 当前页码
    "pageSize": 10,             // 每页大小
    "hasNext": true,            // 是否有下一页（可选）
    "totalPages": 15            // 总页数（可选）
  }
}
// 分页参数
const page = ref(1)
const pageSize = 10
const total = ref(0)

// 加载更多
const loadMore = async () => {
  if (images.value.length >= total.value) {
    noMore.value = true
    return
  }

  const res = await api.getGoods({ page: page.value, pageSize })
  
  images.value.push(...res.data.list)
  total.value = res.data.total
  page.value++
} -->

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { getImageList } from '@/api/img'

const images = ref([])
const sentinel = ref(null)  //当在模板中写 <div ref="sentinel">Vue 会自动把该DOM元素赋值给sentinel.value
                           // 这里是最底部的哪个div盒子获取到 DOM 节点后，会自动赋值给 sentinel.value
let observer = null

// 所有分组数据
const allGroups = ref([])        // 存储 result 数组
const currentGroupIndex = ref(0) // 当前已加载到第几组（0 表示只加载了第0组）
const loading = ref(false)
const noMore = ref(false)

// 首次加载：获取全部分组
const loadAllGroups = async () => {
  if (loading.value) return
  loading.value = true
  try {
    const res = await getImageList()
    const result = res.data?.result || []
    allGroups.value = result
    // 初始只加载第 0 组
    images.value = [...(result[0]?.goods || [])]
    currentGroupIndex.value = 0

    // 如果总共就 1 组，直接标记无更多
    if (result.length <= 1) {
      noMore.value = true
    }
  } finally {
    loading.value = false
  }
}

// 触底：加载下一组（从本地数据取，不发请求！）
const loadNextGroup = () => {
  if (noMore.value || loading.value) return

  const nextIndex = currentGroupIndex.value + 1
  if (nextIndex >= allGroups.value.length) {
    noMore.value = true
    return
  }

  const nextGoods = allGroups.value[nextIndex]?.goods || []
  images.value.push(...nextGoods)
  currentGroupIndex.value = nextIndex

  // 检查是否最后一组
  if (nextIndex >= allGroups.value.length - 1) {
    noMore.value = true
  }
}

onMounted(async () => {
  await loadAllGroups()
  // 创建 IntersectionObserver 实例，用于监听哨兵元素是否进入视口
  observer = new IntersectionObserver(
    (entries) => {
      // IntersectionObserver 回调的参数是 数组entries数组中的每一个元素都表示一个被观察的目标元素
      // 里面有各种信息，我们这里只关心 isIntersecting（是否进入视口） 属性可以log打印观察entries看看
      //虽然我们这里只监视了一个dom元素  但是回调函数的参数仍然是一个数组所以要用entries[0].isIntersecting
      // isIntersecting: true 表示元素已进入视口（可见）
      if (entries[0].isIntersecting && !noMore.value) {
        loadNextGroup() // 触底，加载下一组数据
      }
    },
    { 
      // 当哨兵元素有 10% 的区域进入视口时即触发回调
      // 提前触发可提升用户体验，避免用户看到空白
      threshold: 0.1 
    }
  )
// 所监察的元素（页面最底部的 div）
  observer.observe(sentinel.value)
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <div class="album-view">
    <page-content title="相册展示">
      <!-- 使用原生滚动（推荐）或 el-scrollbar 都可以 -->
      <div class="image-container" style="min-height: 100vh">
        <div class="img-item">
          <el-image
            v-for="(item) in images"
            :key="item._id "
            lazy
            :src="item.picture"
            style="width: 300px; height: 300px; margin-bottom: 20px"
          />
        </div>

        <div ref="sentinel" class="load-more-tip">
          <span v-if="noMore">没有更多图片了</span>
          <span v-else>滑到底部加载更多</span>
        </div>
      </div>
    </page-content>
  </div>
</template>

<style scoped lang="scss">
.album-view {

  .img-item {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    padding: 10px;
  }

  .load-more-tip {
    display: block;
    text-align: center;
    padding: 12px;
    color: #999;
    font-size: 14px;
  }
}
</style>