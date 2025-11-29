<script setup>
defineProps({
  title:{
    required: true,
    type: String
  }
})
//通过父传子
</script>

<template>
  <el-card class="page-content">
    <template #header>
      <div class="card-header">
        <!-- 标题当子组件引用父组件时从title获得参数<page-content title="111"> -->
        <span>{{ title }}</span>
        <slot name="action"></slot>
      </div>
    </template>
    <slot></slot>
  </el-card>
</template>


<style lang="scss">
.page-content{
    padding: 10px;
    margin-bottom: 10px;
    min-height: 100%;
}
    .card-header{
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
</style>