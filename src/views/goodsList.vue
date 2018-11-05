<template>
  <el-card class="box-card">
    <!-- 面包屑导航 -->
    <my-bread level1="商品管理" level2="商品列表"></my-bread>
    <!-- 搜索框 -->
    <el-row class="searchArea">
      <el-col :span="24">
        <el-input placeholder="请输入内容" class="searchInput" v-model="searchVal">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="success" @click.prevent="showAddGoods()">添加商品</el-button>
      </el-col>
    </el-row>
  <!-- 表格 -->
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%">
      <el-table-column
        type="index"
        label="#"
        width="80">
      </el-table-column>

      <el-table-column
        prop="goods_name"
        label="商品名称"
        width="300">
      </el-table-column>

      <el-table-column
        prop="goods_price"
        label="商品价格（元）"
        width="150">
      </el-table-column>

      <el-table-column
        prop="goods_weight"
        label="商品重量"
        width="130">
      </el-table-column>

      <el-table-column
        label="创建日期"
        width="220">
        <template slot-scope="scope">
          {{scope.row.add_time | fmtDate}}
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        width="180">
        <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" circle size="mini" plain="true" @click.prevent="editUser(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" circle size="mini" plain="true" @click.prevent="deleteUser(scope.row.id)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
      <!-- 分页 -->
    <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="pagenum"
    :page-sizes="[20, 40, 60, 80]"
    :page-size="pagesize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total">
    </el-pagination>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      tableData: [],
      pagesize: 20,
      pagenum: 1,
      total: 0,
      searchVal: '',
      loading: true
    }
  },
  created () {
    this.loadTableDate()
  },
  methods: {
    // 添加商品按钮
    showAddGoods () {
      this.$router.push('/addgoods')
    },
    // 分页功能
    handleSizeChange (val) {
      console.log(`每页${val}条`)
      this.pagesize = val
      this.pagenum = 1
      this.loadTableDate()
    },
    handleCurrentChange (val) {
      console.log(`当前第${val}页`)
      this.pagenum = val
      this.loadTableDate()
    },
    async loadTableDate () {
      this.loading = true
      const res = await this.$http.get(`goods?pagenum=${this.pagenum}&pagesize=${this.pagesize}&query=${this.searchVal}`)
      console.log(res)
      this.tableData = res.data.data.goods
      // 发送请求并获取到数据之后，取消加载
      this.loading = false
      this.total = res.data.data.total
    }
  }
}
</script>

<style>
.box-card {
  height: 100%;
}
.searchArea {
  margin-top: 10px;
}
.searchInput {
  width: 500px;
}
</style>
