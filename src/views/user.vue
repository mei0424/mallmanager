<template>
  <el-card class="box-card">
  <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
  <!-- 搜索框 -->
    <el-row class="searchArea">
      <el-col :span="24">
        <el-input placeholder="请输入内容" class="searchInput" v-model="searchVal">
          <el-button slot="append" icon="el-icon-search" @click.prevent="handelSearch()"></el-button>
        </el-input>
        <el-button type="success" @click.prevent="handelAddUser()">添加用户</el-button>
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
        prop="username"
        label="姓名"
        width="100">
      </el-table-column>

      <el-table-column
        prop="email"
        label="邮箱"
        width="150">
      </el-table-column>

      <el-table-column
        prop="mobile"
        label="电话"
        width="130">
      </el-table-column>

      <el-table-column
        label="创建日期"
        width="220">
        <template slot-scope="scope">
          {{scope.row.create_time | fmtDate}}
        </template>
      </el-table-column>

      <el-table-column
        label="用户状态"
        width="120">
        <!-- 注意：在一个单元格中添加子组件，需要添加一个template标签
        并使用slop-scope将数据传到template中 -->
        <template slot-scope="scope">
          <el-switch
            @change="changeUserStatus(scope.row)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        width="180">
        <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" circle size="mini" plain="true" @click.prevent="editUser(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" circle size="mini" plain="true" @click.prevent="deleteUser(scope.row.id)"></el-button>
            <el-button type="success" icon="el-icon-check" circle size="mini" plain="true" @click.prevent="setUserRole(scope.row)"></el-button>
        </template>
      </el-table-column>

    </el-table>
  <!-- 分页 -->
    <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="pagenum"
    :page-sizes="[2, 4, 6, 8]"
    :page-size="pagesize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total">
    </el-pagination>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="addUserformData.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="addUserformData.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="addUserformData.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="addUserformData.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click.prevent="addUser()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑用户" :visible.sync="editUserDialogFormVisible">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="editUserFormData.username" disabled autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="editUserFormData.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="editUserFormData.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editUserDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click.prevent="handelEditUser()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="setRoleDialogFormVisible">
      <el-form>
        <el-form-item label="用户名" :label-width="formLabelWidth">
          {{roleUserName}}
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="currentRoleId">
            <el-option disabled label="请选择" :value="-1"></el-option>
            <el-option
            v-for="(item,index) in roles"
            :key="index"
            :label="item.roleName"
            :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click.prevent="handelSetRole()">确 定</el-button>
      </div>
    </el-dialog>

  </el-card>
</template>

<script>
export default {
  data () {
    return {
      tableData: [],
      // 加载动画
      loading: true,
      // 分页属性
      pagenum: 1,
      pagesize: 2,
      total: 0,
      searchVal: '',
      // 添加用户对话框的属性
      // 对话框是否显示
      dialogFormVisible: false,
      // 对话框表单数据
      addUserformData: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      formLabelWidth: '120px',
      // 编辑用户数据
      editUserDialogFormVisible: false,
      editUserFormData: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 分配角色数据
      setRoleDialogFormVisible: false,
      roleUserName: '',
      roles: [],
      currentUserId: -1,
      currentRoleId: -1
    }
  },
  // 在created当中调用方法
  created () {
    this.loadTableDate()
  },
  // 获取表格数据
  methods: {
    // 处理角色分配
    async handelSetRole () {
      const res = await this.$http.put(`users/${this.currentUserId}/role`, {rid: this.currentRoleId})
      console.log(res)
      const {meta: {msg, status}} = res.data
      if (status === 200) {
        this.$message.success(msg)
        this.setRoleDialogFormVisible = false
        this.pagenum = 1
        this.loadTableDate()
      }
    },
    // 点击显示分配角色对话框
    async setUserRole (user) {
      this.roleUserName = user.username
      this.currentUserId = user.id
      // 根据id查询用户信息
      const res1 = await this.$http.get(`users/${user.id}`)
      // console.log(res1)
      this.currentRoleId = res1.data.data.rid
      this.setRoleDialogFormVisible = true
      // 发送请求获取角色信息
      const res = await this.$http.get('roles')
      // console.log(res)
      const {data} = res.data
      this.roles = data
    },
    // 改变用户状态
    async changeUserStatus (usermessage) {
      // console.log(usermessage)
      const res = await this.$http.put(`users/${usermessage.id}/state/${usermessage.mg_state}`)
      console.log(res)
      const {meta: {msg, status}} = res.data
      if (status === 200) {
        this.$message.success(msg)
        this.loadTableDate()
      }
    },
    // 处理编辑用户
    async handelEditUser () {
      // 1 点击确定后，获取表单数据
      const formData = this.editUserFormData
      // 2 发送编辑请求
      // console.log(formData)
      const res = await this.$http.put(`users/${formData.id}`, {
        email: formData.email,
        mobile: formData.mobile
      })
      // console.log(res)
      const {meta: {msg, status}} = res.data
      if (status === 200) {
        // 更新成功 弹框提示用户 关闭对话框 冲洗加载数据
        this.$message.success(msg)
        this.editUserDialogFormVisible = false
        // 分页部分回到初始状态
        this.pagenum = 1
        this.loadTableDate()
      }
    },
    // 点击显示编辑用户对话框
    async editUser (id) {
      // 1 根据id值获取到用户数据
      const res = await this.$http.get(`users/${id}`)
      console.log(res)
      // 2 将数据添加到文本框中
      const {data} = res.data
      this.editUserFormData = data
      // 3 弹出对话框
      this.editUserDialogFormVisible = true
    },
    // 添加用户
    async addUser () {
      // 1 获取表单数据
      const formData = this.addUserformData
      // 2 发送请求
      const res = await this.$http.post('users', formData)
      // console.log(res)
      const {meta: {msg, status}} = res.data
      if (status === 201) {
        // 关闭弹框
        this.dialogFormVisible = false
        this.$message.success(msg)
        // 分页部分回到初始状态
        this.pagenum = 1
        this.loadTableDate()
      }
    },
    // 点击弹出添加用户对话框
    handelAddUser () {
      this.dialogFormVisible = true
    },
    // 删除用户
    async deleteUser (id) {
      if (confirm('确定删除吗？')) {
        const res = await this.$http.delete(`users/${id}`)
        // console.log(res)
        const {meta: {msg, status}} = res.data
        if (status === 200) {
          this.$message.success(msg)
          // 分页部分回到初始状态
          this.pagenum = 1
          // 重新加载表格
          this.loadTableDate()
        }
      }
    },
    // 搜索功能
    handelSearch () {
      this.pagenum = 1
      this.loadTableDate()
    },
    // 分页功能
    handleSizeChange (val) {
      console.log(`每页${val}条`)
      this.pagesize = val
      this.loadTableDate()
    },
    handleCurrentChange (val) {
      console.log(`当前第${val}页`)
      this.pagenum = val
      this.loadTableDate()
    },
    async loadTableDate () {
      // 发送请求之前显示加载动画
      this.loading = true
      // 除了登录功能外，其他功能在发送请求时，都需要携带token值，才能有权限访问数据库
      const AUTH_TOKEN = sessionStorage.getItem('token')
      this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
      const res = await this.$http.get(`users?pagenum=${this.pagenum}&pagesize=${this.pagesize}&query=${this.searchVal}`)
      // console.log(res)
      // 发送请求并获取到数据之后，取消加载
      this.loading = false
      // 获取到数据后，将数据的数量填写到total属性中
      this.tableData = res.data.data.users
      this.total = res.data.data.total
      // console.log(this.tableData)
    }
  }
}
</script>

<style>
  /* 设置样式 */
  .box-card {
    height: 100%;
  }
  .searchArea {
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .searchArea .searchInput {
    width: 350px;
  }
</style>
