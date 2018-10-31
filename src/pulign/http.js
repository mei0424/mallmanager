// 导入axios插件
import axios from 'axios'
// 定义一个对象
const httpTool = {}
// 给httpTool 对象添加一个install属性
httpTool.install = (Vue) => {
  // 同时设置基准路径
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
  // 将axios挂载在Vue原型上
  Vue.prototype.$http = axios
}
// 导出httpTool
export default httpTool
