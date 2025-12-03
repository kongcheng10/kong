<script setup>
import { ref } from 'vue'
import { getCategory, getArticleDetail, addArticle, updateArticle } from '@/api/article'
import { baseURL } from '@/utils/request'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const Drawer = ref(false) //是否显示抽屉
const form = ref({ //表单数据
    title: '',
    cate_id: '',
    cover_img: '',
    content: '',
    state: '' 
})
const formRef = ref(null)  //表单ref
// 分类列表
const categoryList = ref([])

// 获取分类下拉列表  因为需要用来筛选
const getCategoryList = async () => {
    const res = await getCategory()
    categoryList.value = res.data.data
}
getCategoryList()

// 图片地址和文件对象
const imageUrl = ref('')
const fileObject = ref(null)

// 👇 工具函数：将远程图片 URL 转为 File 对象（用于自动重传原图）
const urlToFile = async (url, filename = 'cover.jpg') => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`)
  }
  const blob = await response.blob()
  return new File([blob], filename, { type: blob.type })
}

// 本地预览图片（用户手动选择时触发）
const SelectFile = (file) => { 
    imageUrl.value = URL.createObjectURL(file.raw)
    fileObject.value = file.raw // 保存文件对象用于上传
}

const open = async (row) => {

    Drawer.value = true
    if (!row || !row.id) {
        // 新增文章
        form.value = {
            title: '',
            cate_id: '',
            cover_img: '',
            content: '',
            state: '草稿' // 建议给默认值，避免空字符串
        }
        imageUrl.value = ''
        fileObject.value = null
    } else {
        // 编辑文章：通过调用文章详情(传入对应的id)获取文章详情
        const res = await getArticleDetail(row.id)
        
        // 确保 id 存在
        form.value = {
            ...res.data.data,
            id: row.id
        }

        const originalPath = form.value.cover_img
        if (originalPath) {
            // 拼接完整图片 URL（用于预览和下载）
            const fullImageUrl = baseURL + (originalPath.startsWith('/') ? '' : '/') + originalPath
            imageUrl.value = fullImageUrl

            // 👇 关键：自动将原图下载并转为 File 对象（模拟用户已选择）
            try {
                const file = await urlToFile(fullImageUrl, 'cover.jpg')
                fileObject.value = file // 设置为 File 对象，确保 FormData 会上传
            } catch (error) {
                console.warn('自动加载原封面图失败:', error)
                fileObject.value = null
                ElMessage.warning('原封面图加载失败，如需保留请手动重新上传')
            }
        } else {
            imageUrl.value = ''
            fileObject.value = null
        }
    }
}

const emit = defineEmits(['success']) //通知父组件刷新页面

const Publish = async () => {

    
    // 表单验证
    if (!form.value.title) {
        ElMessage.error('请输入文章标题')
        return
    } 
    if (!form.value.cate_id) {
        ElMessage.error('请选择文章分类')
        return
    }
    if (!form.value.content) {
        ElMessage.error('请输入文章内容')
        return
    }
    try {
        form.value.state = '已发布'
        // 创建 FormData是浏览器原生APi专门用于构造 multipart/form-data 格式的请求体因为你要上传封面图片（二进制文件），普通 JSON 无法携带文件
        const fd = new FormData()
        fd.append('title', form.value.title)
        fd.append('cate_id', form.value.cate_id)
        fd.append('content', form.value.content)
        fd.append('state', form.value.state)

        // 👇 处理封面：现在 fileObject.value 在编辑时已有值（原图 File）
        if (fileObject.value) {
            fd.append('cover_img', fileObject.value) // 一定是 File
        }
        // 注意：如果新增且没选图，fileObject.value 为 null → 不传 cover_img → 后端报错（合理）

        // 添加 id（小写）
        if (form.value.id) {
            fd.append('id', String(form.value.id))
        }



        if (form.value.id) {
            // 编辑文章
            await updateArticle(fd)
            ElMessage.success('修改成功')
        } else {
            // 添加文章
            await addArticle(fd)
            ElMessage.success('添加文章成功')
        }
        Drawer.value = false
        emit('success') 
    } catch (error) {
        console.error('发布文章失败:', error)
        const errorMessage = error.response?.data?.message || error.message || '发布文章失败'
        ElMessage.error(errorMessage)
    }
}

defineExpose({ 
    open  
})

</script>

<template>
  <el-drawer
    v-model="Drawer"
    :title="form.id ? '编辑文章' : '添加文章'"
    direction="rtl"
    size="50%"
  >
    <el-form :model="form" ref="formRef" label-width="100px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      
      <el-form-item label="文章分类" prop="cate_id">
        <el-select
          v-model="form.cate_id"
          placeholder="请选择文章分类"
          style="width: 100%"
        >
          <el-option
            v-for="item in categoryList"
            :key="item.id"
            :label="item.cate_name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      
      <el-form-item label="文章封面" prop="cover_img">
        <el-upload
          class="avatar-uploader"
          :show-file-list="false" 
          :auto-upload="false"
          :on-change="SelectFile"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload> 
      </el-form-item>
      
      <el-form-item label="文章内容" prop="content">
        <div class="editor">
           <el-input
          v-model="form.content"
          type="textarea"
          :rows="10"
          placeholder="请输入文章内容"
          resize="vertical"
        />
        </div>
      </el-form-item>
      
      <el-form-item>
        <el-button @click="Publish('已发布')" type="primary">发布</el-button>
      </el-form-item>
    </el-form>

  </el-drawer>
</template>

<style scoped lang="scss">
.avatar {
  width: 100px;
  height: 100px;
  object-fit: cover;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
}
</style>