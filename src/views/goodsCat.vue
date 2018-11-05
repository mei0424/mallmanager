<template>
  <el-card class="box-card">
    <!-- 面包屑导航 -->
    <my-bread level1="商品管理" level2="商品分类"></my-bread>
    <el-button type="success" class="btn" @click.prevent="showAddCat()">添加分类</el-button>

    <!-- 添加分类 -->
    <el-dialog title="添加分类" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <el-input v-model="form.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类" :label-width="formLabelWidth">
          {{selectedOptions}}
          <el-cascader
            change-on-select
            clearable
            expand-trigger="hover"
            :options="options"
            v-model="selectedOptions"
            :props="defaultProp">
          </el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addGoodCate()">确 定</el-button>
      </div>
    </el-dialog>
  <!-- 表格 -->
    <el-table
      :data="tableData"
      style="width: 100%">

      <!-- <el-table-column
        prop="cat_name"
        label="分类名称"
        width="200">
      </el-table-column> -->
      <el-tree-grid
      prop="cat_name"
      label="分类名称"
      width="200"
      treeKey="cat_id"
      parentKey="cat_pid"
      levelKey="cat_level"
      childKey="children"
      :indentSize="30">
      </el-tree-grid>

      <el-table-column
        label="级别"
        width="150">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_level === 0">一级</span>
          <span v-else-if="scope.row.cat_level === 1">二级</span>
          <span v-else-if="scope.row.cat_level === 2">三级</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="cat_deleted"
        label="是否有效"
        width="130">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_deleted === false">有效</span>
          <span v-else-if="scope.row.cat_deleted === true">有效</span>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        width="180">
        <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" circle size="mini" plain="true" @click.prevent="editCat(scope.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" circle size="mini" plain="true" @click.prevent="deleteCat(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
<!-- 编辑分类的对话框 -->
    <el-dialog title="编辑分类" :visible.sync="editdialogFormVisible">
      <el-form :model="form">
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <el-input v-model="form.cat_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editGoodCate()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
// 引入第三方包
const ElTreeGrid = require('element-tree-grid')
export default {
  // 配置组件
  components: {
    ElTreeGrid
  },
  data () {
    return {
      tableData: [],
      dialogFormVisible: false,
      formLabelWidth: '120px',
      form: {
        cat_pid: -1,
        cat_name: '',
        cat_level: -1
      },
      // 级联选择器要用的数据
      options: [],
      selectedOptions: [],
      defaultProp: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 编辑分类数据
      editdialogFormVisible: false
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    async editGoodCate () {
      const res = await this.$http.put(`categories/${this.form.cat_id}`, {
        cat_name: this.form.cat_name
      })
      // console.log(res)
      const {meta} = res.data
      if (meta.status === 200) {
        this.editdialogFormVisible = false
        this.$message.success(meta.msg)
        this.loadData()
      }
    },
    // 编辑分类
    editCat (cat) {
      // console.log(cat)
      this.editdialogFormVisible = true
      this.form.cat_name = cat.cat_name
      this.form.cat_id = cat.cat_id
    },
    // 删除分类
    deleteCat (cat) {
      // console.log(cat)
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$http.delete(`categories/${cat.cat_id}`)
        // console.log(res)
        if (res.data.meta.status === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.loadData()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 添加分类
    async addGoodCate () {
      // 如果没有选择 cat_level=0
      // 如果选择第一级 cat_level=1
      // 如果选择第二级 cat_level=2
      if (this.selectedOptions.length === 0) {
        this.form.cat_level = 0
        this.form.cat_pid = 0
      } else if (this.selectedOptions.length === 1) {
        this.form.cat_level = 1
        this.form.cat_pid = this.selectedOptions[0]
      } else if (this.selectedOptions.length === 2) {
        this.form.cat_level = 2
        this.form.cat_pid = this.selectedOptions[1]
      }
      const res = await this.$http.post('categories', this.form)
      const {meta} = res.data
      if (meta.status === 201) {
        this.dialogFormVisible = false
        this.loadData()
        this.$message.success(meta.msg)
      }
    },
    // 点击添加分类
    async showAddCat () {
      // 准备页面
      this.dialogFormVisible = true
      // 获取两级数据
      const res = await this.$http.get('categories?type=2')
      this.options = res.data.data
    },
    async loadData () {
      const res = await this.$http.get('categories?type=3')
      console.log(res)
      this.tableData = res.data.data
    }
  }
}
</script>

<style>
.box-card {
  height: 100%;
}
.btn {
  margin-top: 10px;
}
</style>
