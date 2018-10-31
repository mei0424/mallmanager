import Vue from 'vue'
import Router from 'vue-router'
// @标识会自动锁定src文件夹
import Login from '@/views/login'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/login',
    component: Login
  }]
})
