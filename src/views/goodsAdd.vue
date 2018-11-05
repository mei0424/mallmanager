<template>
  <el-card class="box-card">
    <my-bread level1="商品管理" level2="商品列表"></my-bread>
    <el-alert
      class="addGoods"
      title="添加商品"
      type="success"
      center
      show-icon>
    </el-alert>
    <el-steps :space="200" :active="1" finish-status="success">
      <el-step title="已完成"></el-step>
      <el-step title="进行中"></el-step>
      <el-step title="步骤 3"></el-step>
      <el-step title="步骤 3"></el-step>
      <el-step title="步骤 3"></el-step>
    </el-steps>
    <el-tabs tab-position="left" style="height: 200px;">
      <el-tab-pane label="用户管理">用户管理</el-tab-pane>
      <el-tab-pane label="配置管理">配置管理</el-tab-pane>
      <el-tab-pane label="角色管理">角色管理</el-tab-pane>
      <el-tab-pane label="定时任务补偿">定时任务补偿</el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
export default {

}
</script>

<style>
.box-card {
  height: 100%;
}
.addGoods {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
