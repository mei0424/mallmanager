<template>
  <el-card class="box-card">
    <!-- 面包屑导航 -->
    <my-bread level1="权限管理" level2="角色列表"></my-bread>
    <!-- 按钮 -->
    <el-button type="primary" class="btn">添加角色</el-button>
    <!-- 表格 -->
    <el-table
      :data="tableData"
      style="width: 100%">
      <!-- 展开行 type="expand" -->
      <el-table-column type="expand">
        <!-- 放置展开内容 -->
        <template slot-scope="scope">
          <!-- 一级权限 -->
            <el-row class="level1" v-for="(item1,index) in scope.row.children" :key="index">
              <el-col :span="4">
                <el-tag @close="deleteRoleRight(scope.row, item1.id)" type="success" closable>{{item1.authName}}</el-tag>
                <i class="el-icon-arrow-right"></i>
              </el-col>
              <el-col :span="20">
                <!-- 二级权限 -->
                <el-row class="level2" v-for="(item2, index) in item1.children" :key="index">
                  <el-col :span="4">
                    <el-tag @close="deleteRoleRight(scope.row, item2.id)" type="warning" closable>{{item2.authName}}</el-tag>
                    <i class="el-icon-arrow-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="20">
                    <el-tag @close="deleteRoleRight(scope.row, item3.id)" class="level3" closable v-for="(item3, index) in item2.children" :key="index">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
        </template>
      </el-table-column>
      <el-table-column
        type="index"
        label="#">
      </el-table-column>
      <el-table-column
        label="角色名称"
        prop="roleName">
      </el-table-column>
      <el-table-column
        label="角色描述"
        prop="roleDesc">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" circle size="mini" plain="true"></el-button>
            <el-button type="danger" icon="el-icon-delete" circle size="mini" plain="true"></el-button>
            <el-button type="success" icon="el-icon-check" circle size="mini" plain="true" @click="showDialog(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 角色权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="dialogVisible"
      width="50%">
      <template slot-scope="scope">
        <!-- :default-expanded-keys="[2, 3]" 默认展开的节点
        :default-checked-keys="[5]" 默认选中的节点-->
        <el-tree
          ref="tree"
          :data="treeData"
          show-checkbox
          node-key="id"
          :default-expanded-keys="expandedArr"
          :default-checked-keys="checkedArr"
          :props="defaultProps">
        </el-tree>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRight()">确 定</el-button>
      </span>
    </el-dialog>

  </el-card>
</template>

<script>
export default {
  data () {
    return {
      tableData: [],
      dialogVisible: false,
      treeData: [],
      // 展开数组
      expandedArr: [],
      checkedArr: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      // 角色id
      roleId: -1
    }
  },
  created () {
    this.loadRoleList()
  },
  methods: {
    // 修改权限，发送请求
    async setRight () {
      // 关闭对话框
      this.dialogVisible = false
      // 调用element-ui 表格自带的函数 getCheckedNodes 获取表格中所有选中的项
      const arr1 = this.$refs.tree.getCheckedKeys()
      console.log(arr1)
      // 获取版选中节点所获取的数组
      const arr2 = this.$refs.tree.getHalfCheckedKeys()
      console.log(arr2)
      // ...操作符，展开数组每个元素
      const arr = [...arr1, ...arr2]
      console.log(arr)
      const res = await this.$http.post(`roles/${this.roleId}/rights`,{
        rids: arr.join(',')
      })
      const {meta, data} = res.data
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        this.loadRoleList()
      }

    },
    // 点击显示对话框
    async showDialog (role) {
      // 显示对话框
      this.dialogVisible = true
      this.roleId = role.id
      // 获取权限信息
      const res = await this.$http.get('rights/tree')
      console.log(res)
      this.treeData = res.data.data
      var arr1 = []
      // 多次循环遍历该对象，获取权限id值添加到数组当中
      res.data.data.forEach(element1 => {
        arr1.push(element1.id)
        element1.children.forEach(element2 => {
          arr1.push(element2.id)
          element2.children.forEach(element3 => {
            arr1.push(element3.id)
          })
        })
      })
      this.expandedArr = arr1
      // 多次循环遍历，根据用户权限添加到数组
      const arr2 = []
      role.children.forEach(element1 => {
        element1.children.forEach(element2 => {
          element2.children.forEach(element3 => {
            arr2.push(element3.id)
          })
        })
      })
      this.checkedArr = arr2
    },
    // 删除角色权限
    async deleteRoleRight (role, rightId) {
      const res = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      console.log(res)
      const {meta, data} = res.data
      if (meta.status === 200) {
        // 提示用户删除成功
        this.$message.success(meta.msg)
        // 给角色重新赋值
        role.children = data
      }
    },
    // 获取角色列表
    async loadRoleList () {
      const res = await this.$http.get('roles')
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
.level3 {
  margin-bottom: 5px;
  margin-right: 5px;
}
.level2 {
  margin-bottom: 10px;
}
</style>
