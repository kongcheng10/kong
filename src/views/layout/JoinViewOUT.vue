
<script lang="ts" setup>
import { ref } from 'vue'
const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
]

const searchForm = ref({
  categoryId: '',
  status: ''
})
</script>


<template>
  <div>Join</div>

  <page-content title="Join">
    <template #action>
      <el-button type="primary">添加</el-button>
    </template>
      <el-form inline> <!-- 加上inline属性让表单内元素水平排列在一行 -->
    <!-- 下面的内容都是直接写入slot插槽中的就相当于在一个div盒子里面 -->
        <el-form-item label="发布状态" style="width: 20vw;">
          <!-- el-select 中的v-model默认是绑定el-option的value属性的 -->
            <el-select v-model="searchForm.categoryId" placeholder="请选择">
                <el-option label="请选择" value=""></el-option>
                <el-option label="已发布" value="已发布"></el-option>
                <el-option label="草稿" value="草稿"></el-option>
            </el-select>
        </el-form-item>
            <el-form-item >
                <el-button type="primary" >搜索</el-button>
                <el-button >重置</el-button>
            </el-form-item>
      </el-form>
    <!--   通过:data="tableData" 绑定数据 -->
    <el-table :data="tableData" style="width: 100%">
    <!-- 数据是按列渲染的 prop表示对象中对应的属性名渲染对应的数据 -->
        <el-table-column prop="date" label="Date" width="180" />
        <el-table-column prop="name" label="Name" width="180" />
        <el-table-column prop="address" label="Address" />
    </el-table>

  </page-content>
</template>

<style>

</style>