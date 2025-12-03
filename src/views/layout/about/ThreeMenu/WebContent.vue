<script setup>
// ====== 技术栈数据 ======
const techStack = [
  { name: 'Vue 3', icon: '🟩', desc: '组合式 API，响应式系统' },
  { name: 'Element Plus', icon: '✨', desc: '现代化 Vue 3 UI 组件库' },
  { name: 'localStorage and axios', icon: '💾', desc: '前端本地存储 + HTTP 请求库' },
  { name: 'SCSS', icon: '🎨', desc: 'CSS 预处理器' },
  { name: 'Vite', icon: '⚡', desc: '极速构建工具' }
]

import router from '@/router';
import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus'
import { formatDate } from '@/utils/format';
import { deleteArticle, getArticleList, getCategory } from '@/api/article';
import ArticleEdit from './ArticleEdit.vue'; // 抽屉组件
import ArticleView from './ArticleView.vue' //预览组件
const articleList = ref([]);

// 最下面的分页绑定的参数
const params = ref({
    pagenum: 1,    // 当前页码
    pagesize: 3,   // 每页显示条数
    cate_id: '',   // 分类ID筛选条件
    state: '已发布' // 状态筛选条件
})

const total = ref(0)
const loading = ref(false)

// 获取文章列表数据
const getArticleListdata = async () => { 
    loading.value = true
    try {
        const res = await getArticleList(params.value)
        articleList.value = res.data.data || []
        total.value = res.data.total || 0
    } catch (error) {
        ElMessage.error('获取文章列表失败')
        console.error('获取文章列表失败:', error)
        articleList.value = []
        total.value = 0
    } finally {
        loading.value = false
    }
}
getArticleListdata()

// 分类列表因为筛选需要用
const categoryList = ref([])
const Category = async () => {
  const res = await getCategory()
  // 注意：根据你的接口返回结构，可能是 res.data 或 res.data.data
  // 这里假设 getCategory 返回 { data: [...] }
  categoryList.value = Array.isArray(res.data) ? res.data : (res.data?.data || [])
}
Category()

// 搜索表单需要用id和status这是后端要求
const searchForm = ref({  
  categoryId: '',
  status: ''
})

// 搜索逻辑
const search = () => { 
    params.value.pagenum = 1 // 设置当前页码为1
    params.value.cate_id = searchForm.value.categoryId // 设置分类ID
    params.value.state = searchForm.value.status // 添加这行：设置状态筛选条件
    getArticleListdata() // 👈 修正：调用的是 getArticleListdata，不是 getArticleList
}

// 重置逻辑
const reset = () => { 
    params.value.cate_id = ''
    params.value.state = ''
    params.value.pagenum = 1
    searchForm.value.categoryId = '' // 重置表单值
    searchForm.value.status = ''     // 重置表单值
    getArticleListdata() // 👈 修正
}

// 分页逻辑
const handleSizeChange = (val) => { // 每页显示条数发生变化时更新
    params.value.pagesize = val
    getArticleListdata()
}

const handleCurrentChange = (val) => { // 当前页码发生变化时更新
    params.value.pagenum = val
    getArticleListdata()
}

// 删除
const handleDelete = async (row) => {
  try {
    // 弹出确认框
    await ElMessageBox.confirm(
      `确定要删除文章 "${row.title}" 吗？`, // 👈 修正：原来是“分类”，应为“文章”
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning' // 显示警告图标
      }
    )

    // 用户点击“确定”后，执行删除 // 删除调用接口并传入id
    const res = await deleteArticle(row.id)  
    ElMessage.success(res.data.message || '删除成功')
    getArticleListdata() // 刷新列表重新获取数据

  } catch (error) {
    // 用户点击“取消”或关闭弹窗时，会抛出错误，这里静默处理
    if (error !== 'cancel') {
      console.error('删除操作异常:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 在template最下面<articleedit ref="ArticleRef" />来实现绑定数据
const ArticleRef = ref()

// 添加文章
const addArticle = () => { 
     ArticleRef.value.open({})
}

// 编辑
const EditArticle = (row) => { 
    ArticleRef.value.open(row)
}

// 查看文章详情
const viewVisible = ref(false) // 控制查看文章详情的显示与隐藏
const currentViewId = ref(null) // 更具id查看对应文章详情
const viewArticle = (row) => {
  currentViewId.value = row.id
  viewVisible.value = true
}
</script>

<template>
  <div class="about-site">
    <!-- 技术栈部分 -->
    <section class="tech-section">
      <h2>本網站所使用的技术</h2>
      <el-row :gutter="20">
        <el-col
          v-for="tech in techStack"
          :key="tech.name"
          :xs="24"
          :sm="12"
          :md="8"
        >
          <el-card shadow="hover" class="tech-card">
            <div class="tech-content">
              <span class="tech-icon">{{ tech.icon }}</span>
              <div>
                <h3>{{ tech.name }}</h3>
                <p>{{ tech.desc }}</p>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-button type="primary" @click="router.push('/about/Category')">修改分类</el-button>
    </section>

    <!-- 用户建议区 -->
    <page-containe title="点击右侧按钮留下你的建议->">
      <template #extra>
        <el-button type="primary" @click="addArticle">提出建议</el-button>
      </template>

      <!-- 表单区域 搜索筛选区域 -->
      <el-form inline>
        <el-form-item label="文章分类" style="width: 20vw;">
          <!-- 👇 修正：ChannelList → categoryList -->
          <el-select v-model="searchForm.categoryId" placeholder="请选择">
            <!-- label是给用户看的，value是后台提交的 -->
            <el-option 
              v-for="channel in categoryList" 
              :key="channel.id" 
              :label="channel.cate_name" 
              :value="channel.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发布状态" style="width: 20vw;">
          <el-select v-model="searchForm.status" placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option label="已发布" value="已发布"></el-option>
            <el-option label="草稿" value="草稿"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格区域 -->
      <el-table :data="articleList" style="width: 100%" v-loading="loading">
        <el-table-column label="标题" prop="title">
          <template #default="{row}">
                <el-link type="primary" underline="never" @click="viewArticle(row)">{{ row.title }}</el-link>
            </template>
        </el-table-column>
        <el-table-column label="分类" prop="cate_name"></el-table-column>
        <el-table-column label="发布时间" prop="pub_date">
          <template #default="{ row }">
            <!-- 增加安全判断，防止 pub_date 为 null -->
            {{ row.pub_date ? formatDate(row.pub_date) : '暂无' }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope"> 
            <!-- 
              <el-table-column> 在渲染每一行时，会自动把当前行的数据作为插槽作用域（slot props）传递给#default插槽。
              通过='scope'(自定义)来获得#default插槽中的数据。可以log打印出来看看 
            -->
            <el-button @click="EditArticle(scope.row)">Edit</el-button>
            <el-button type="danger" @click="handleDelete(scope.row)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
    </page-containe>

    <!-- 分页区域 -->
    <el-pagination
      v-model:current-page="params.pagenum"
      v-model:page-size="params.pagesize"
      :page-sizes="[2, 3, 4]" 
      :background="true"
      layout="jumper,total, sizes, prev, pager, next"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      style="margin-top: 15px; justify-content: end; display: flex;"
    />

    <!-- 抽屉 -->
    <ArticleEdit ref="ArticleRef" @success="getArticleListdata" />
    <ArticleEdit ref="ArticleRef" @success="getArticleListdata" />
<ArticleView 
  v-model="viewVisible" 
  :article-id="currentViewId" 
/>
  </div>
</template>

<style scoped lang="scss">
.about-site {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem;

  h2 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: #303133;
  }

  .tech-section {
    margin-bottom: 3rem;

    .tech-card {
      height: 100%;
      .tech-content {
        display: flex;
        gap: 12px;
        align-items: flex-start;
      }
      .tech-icon {
        font-size: 1.4rem;
        line-height: 1;
      }
      h3 {
        margin: 0 0 6px 0;
        font-size: 1.1rem;
        color: #409eff;
      }
      p {
        margin: 0;
        color: #606266;
        font-size: 0.95rem;
      }
    }
  }
}
</style>