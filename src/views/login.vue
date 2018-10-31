<template>
  <div class="login-wrap">
    <el-form class="login-form" label-position="top" label-width="80px">
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="formdata.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formdata.password"></el-input>
      </el-form-item>
      <el-button class="login-button" type="primary"
      @click.prevent="handelloginin()">登录</el-button>
    </el-form>
  </div>
</template>
<script>
export default {
  data () {
    return {
      formdata: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    async handelloginin () {
      // 在该函数中
      // 1 获取到表单数据
      const formdata = this.formdata
      // 发送post请求
      const res = await this.$http.post('login', formdata)
      console.log(res)
      const {meta} = res.data
      if (meta.status === 200) {
        // 如果成功
        // 弹出登录成功提示框
        this.$message.success(meta.msg)
        // 登录成功后，将获取到的token值存储到sessionStorage中
        const token = res.data.data.token
        sessionStorage.setItem('token', token)
        // 改变路径标识为'/'
        this.$router.push('/')
      } else {
        // 失败
        this.$message.error(meta.msg)
      }
    }
  }
}
</script>

<style>
  .login-wrap {
    height: 100%;
    background-color: #324152;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .login-form {
    background-color: #fff;
    width: 400px;
    padding: 30px;
    border-radius: 5px;
  }
  .login-wrap .login-form .login-button {
    width: 100%;
  }
</style>
