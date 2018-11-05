<template>
<el-container class="container">
  <el-header class="header">
    <el-row>
      <el-col :span="4">
        <img src="../assets/logo.png" alt="">
      </el-col>
      <el-col :span="19" class="middle">
        <h2>电商后台管理系统</h2>
      </el-col>
      <el-col :span="1">
        <a href="#" class="loginout" @click.prevent="loginout()">退出</a>
      </el-col>
    </el-row>
  </el-header>
<el-container>
  <el-aside class="aside" width="200px">
    <!-- router="true"开启路由模式 -->
    <el-menu default-active="1" class="menu" :router="true" :unique-opened="true">
      <el-submenu :index="index + ''"
      v-for="(item1, index) in menus"
      :key="index">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>{{item1.authName}}</span>
        </template>
          <el-menu-item :index="'/' + item2.path"
          v-for="(item2, index) in item1.children"
          :key="index">
            <i class="el-icon-menu"></i>
            {{item2.authName}}</el-menu-item>
      </el-submenu>

    </el-menu>
    </el-aside>
    <el-main class="main">
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
export default {
  data () {
    return {
      menus: []
    }
  },
  beforeCreate () {
    const token = sessionStorage.getItem('token')
    if (!token) {
      this.$router.push('/login')
      this.$message.warning('请先登录')
    } else {
      this.$router.push('/')
    }
  },
  created () {
    this.getUserModel()
  },
  methods: {
    // 获取当前用户可操作模块
    async getUserModel () {
      const res = await this.$http.get('menus')
      // console.log(res)
      // 将数据赋值给RightNavlist
      this.menus = res.data.data
      console.log(this.menus)
    },
    // 退出功能
    loginout () {
      // 1 清除session
      sessionStorage.clear()
      // 2 跳转到登录页
      this.$router.push({name: 'login'})
      // 3 提示用户 退出成功
      this.$message.success('退出成功')
    }
  }
}
</script>

<style>
.container {
  height: 100%;
}
.header {
  background-color: #d3c0e6;
}
.aside {
  background-color: #d3c0e6;
}
.main {
  height: 100%;
  background-color: #e9eef3;
}
/* 头部样式 */
.header .middle {
  line-height: 25px;
  color: #fff;
  text-align: center;
}
.header .loginout {
  line-height: 60px;
  text-decoration: none;
}
.menu {
  height: 100%;
}
</style>
