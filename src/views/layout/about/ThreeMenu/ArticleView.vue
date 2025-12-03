<!-- src/views/about/ArticleView.vue -->
<template>
  <el-drawer
    v-model="visible"
    title="建议详情"
    direction="ltr" 
    size="50%"
    :before-close="handleClose"
    :destroy-on-close="true"
  >
    <div v-if="article" class="article-view">
      <h3 class="title">{{ article.title }}</h3>
      
      <el-descriptions :column="1" size="small" border style="margin-top: 16px;">
        <el-descriptions-item label="分类">{{ article.cate_name || '—' }}</el-descriptions-item>
        <el-descriptions-item label="状态">{{ article.state || '—' }}</el-descriptions-item>
        <el-descriptions-item label="发布时间">
          {{ article.pub_date ? formatDate(article.pub_date) : '暂无' }}
        </el-descriptions-item>
      </el-descriptions>

      <!-- 封面图 -->
      <div v-if="coverUrl" class="cover-section" style="margin-top: 20px;">
        <p><strong>封面：</strong></p>
        <img :src="coverUrl" alt="封面" class="cover-img" />
      </div>

      <!-- 内容 -->
      <div class="content-section" style="margin-top: 20px;">
        <p><strong>内容：</strong></p>
        <div 
          v-if="article.content" 
          class="content-html"
          v-html="article.content"
        ></div>
        <span v-else class="empty">无内容</span>
      </div>
    </div>

    <div v-else style="text-align: center; padding: 40px;">
      <el-skeleton :rows="8" animated />
    </div>
  </el-drawer>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { getArticleDetail } from '@/api/article'
import { baseURL } from '@/utils/request'
import { formatDate } from '@/utils/format'

const props = defineProps({
  modelValue: Boolean,
  articleId: {
    type: [String, Number],
    default: null
  }
})

const emit = defineEmits(['update:modelValue'])

const visible = ref(false)
const article = ref(null)
const coverUrl = ref('')

// 同步控制
watch(
  () => props.modelValue,
  (val) => {
    visible.value = val
    if (val && props.articleId) {
      loadArticle()
    }
  },
  { immediate: true }
)

watch(visible, (val) => {
  emit('update:modelValue', val)
})

const loadArticle = async () => {
  if (!props.articleId) return
  try {
    const res = await getArticleDetail(props.articleId)
    article.value = res.data.data || {}
    
    // 拼接封面图 URL
    if (article.value.cover_img) {
      const path = article.value.cover_img
      coverUrl.value = baseURL + (path.startsWith('/') ? '' : '/') + path
    } else {
      coverUrl.value = ''
    }
  } catch (error) {
    console.error('加载文章失败:', error)
    ElMessage.error('加载建议详情失败')
    handleClose()
  }
}

const handleClose = () => {
  visible.value = false
}
</script>

<style scoped lang="scss">
.article-view {
  .title {
    color: #303133;
    font-size: 1.4rem;
    margin: 0 0 16px;
  }

  .cover-img {
    max-width: 100%;
    height: auto;
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  .content-html {
    padding: 12px;
    background-color: #f9fafb;
    border-radius: 6px;
    line-height: 1.6;
    font-size: 14px;
    color: #333;
    overflow-wrap: break-word;
  }

  .empty {
    color: #909399;
    font-style: italic;
  }
}
</style>