// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 1 引入moment插件
import moment from 'moment'
// 1 导入httpTool
import httpTool from '@/pulign/http.js'
import App from './App'
import router from './router'
import '@/assets/css/index.css'

Vue.use(ElementUI)
// 2 使用httpTool
Vue.use(httpTool)

Vue.config.productionTip = false

// 自定义全局过滤器
// 格式化日期
Vue.filter('fmtDate', (value) => {
  return moment(value).format('YYYY-MM-DD HH:mm:ss')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
