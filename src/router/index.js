import Vue from 'vue'
import Router from 'vue-router'
// 单独引入message
import { Message } from 'element-ui'
// @标识会自动锁定src文件夹
import Login from '@/views/login'
import Home from '@/views/home'
import User from '@/views/user'
import Rights from '@/views/rights'
import Role from '@/views/role'
import goodsList from '@/views/goodsList'
import goodsParams from '@/views/goodsParams'
import goodsCat from '@/views/goodsCat'
import addgoods from '@/views/goodsAdd'

Vue.use(Router)
const router = new Router({
  routes: [{
    name: 'login',
    path: '/login',
    component: Login
  }, {
    name: Home,
    path: '/',
    component: Home,
    children: [{
      path: '/users',
      component: User
    }, {
      name: 'rights',
      path: '/rights',
      component: Rights
    }, {
      name: 'roles',
      path: '/roles',
      component: Role
    }, {
      name: goodsList,
      path: '/goods',
      component: goodsList
    }, {
      name: goodsParams,
      path: '/params',
      component: goodsParams
    }, {
      name: goodsCat,
      path: '/categories',
      component: goodsCat
    }, {
      name: addgoods,
      path: '/addgoods',
      component: addgoods
    }]
  }]
})
router.beforeEach((to, from, next) => {
  // console.log(to, from)
  if (to.name === 'login') {
    next()
  } else {
    const token = sessionStorage.getItem('token')
    if (!token) {
      router.push({'name': 'login'})
      Message.warning('请先登录')
      return
    }
    // 否则进入跳转路径
    next()
  }
})
export default router
