<script setup>
import {ref} from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import {getCategory,deleteCategory} from '@/api/article'
// 引入自定义的edit子组件
import CategoryEdit from '@/views/layout/about/ThreeMenu/CategoryEdit.vue'
const categoryList = ref([])
const categoryEditRef = ref() // 添加对子组件的引用
const loading = ref(false)
const getcategoryList =  async () => {
  loading.value = true
  const res = await getCategory()
  categoryList.value = res.data.data
  loading.value = false
}
   getcategoryList()
   //编辑
const handleEdit = (row) => { 
  categoryEditRef.value.open(row)  // 调用edit子组件的打开编辑框
}
// 添加
const handleAdd = () => { 
 categoryEditRef.value.open()  // 调用edit子组件的打开编辑框
}
// 删除
const handleDelete = async (row) => {
  try {
    // 弹出确认框
    await ElMessageBox.confirm(
      `确定要删除分类 "${row.cate_name}" 吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning' // 显示警告图标
      }
    )

    // 用户点击“确定”后，执行删除 // 删除调用接口并传入id
    const res = await deleteCategory(row.id)  
    ElMessage.success(res.data.message)
    getcategoryList() // 刷新列表重新获取数据

  } catch (error) {
    // 用户点击“取消”或关闭弹窗时，会抛出错误，这里静默处理
    if (error !== 'cancel') {
      console.error('删除操作异常:', error)
    }
  }
}

</script>


<template>
   <page-containe title="文章分类">  
    <template #extra>
     <el-button type="primary" @click="handleAdd" >添加分类</el-button>
    </template>
    
    <el-table :data="categoryList" style="width: 100%" v-loading="loading"> <!--：data="categoryList"  :data是绑定数据下面渲染的数据就是:data 绑定的数据-->
    <el-table-column label="序号" type="index" width="100" />
    <el-table-column label="分类名称" prop="cate_name" />   <!-- // prop后等于的属性名要和后端接口返回的数据名一致不然不显示
                                                              这是element的要求 有点像v-for-->
     <el-table-column label="分类别称" prop="cate_alias" />
    <el-table-column label="操作" >
      <template #default="scope"> 
        <!-- <el-table-column> 在渲染每一行时，会自动把当前行的数据作为插槽作用域（slot props）传递给#default插槽。
          通过='scpe'(自定义)来获得#default插槽中的数据。可以log打印出来看看 -->
        <el-button  @click="handleEdit(scope.row)">Edit</el-button>
        <el-button type="danger" @click="handleDelete(scope.row)">Delete</el-button>
      </template>
    </el-table-column>
    <template #empty>
            <el-empty description="无数据"></el-empty>
        </template>
        <category-edit ref="categoryEditRef" @success="getcategoryList" ></category-edit>
  </el-table>
   </page-containe>
</template>



<style scoped lang="scss">

</style>