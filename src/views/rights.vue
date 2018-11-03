<template>
  <el-card class="box-card">
    <!-- 引入面包屑组件 并传值-->
    <my-bread level1="权限管理" level2="权限管理"></my-bread>
    <!-- 表格渲染 -->
    <el-table
      class="table"
      :data="tableData3"
      height="250"
      border
      style="width: 100%">
      <el-table-column
        type="index"
        label="#"
        width="80">
      </el-table-column>
      <el-table-column
        prop="authName"
        label="权限名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="path"
        label="路径">
      </el-table-column>
      <el-table-column
        prop="level"
        label="层级">
        <template slot-scope="scope">
          <span v-if="scope.row.level==='0'">一级</span>
          <span v-else-if="scope.row.level==='1'">二级</span>
          <span v-else-if="scope.row.level==='2'">三级</span>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      tableData3: []
    }
  },
  created () {
    this.loadTableData()
  },
  methods: {
    // 获取表格数据
    // 注意：除登录外，其他请求都需要设置请求头
    async loadTableData () {
      const res = await this.$http.get('rights/list')
      console.log(res)
      const {data, meta} = res.data
      if (meta.status === 200) {
        this.tableData3 = data
      }
    }
  }
}
</script>

<style>
.box-card {
  height: 100%;
}
.table {
  margin-top: 10px;
}
</style>
